<?php
header('Content-Type: application/json');
require_once 'auth.php';

$host    = 'localhost';
$db      = 'fiel_db';
$user    = 'root';
$pass    = '';
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);
} catch (PDOException $e) {
    echo json_encode(['erro' => 'Erro no banco: ' . $e->getMessage()]);
    exit();
}

$action = $_GET['action'] ?? '';


if ($action === 'listar') {
    $matricula = $_GET['matricula'] ?? '';
    $nome      = $_GET['nome'] ?? '';
    $turma     = $_GET['turma'] ?? '';
    $turno     = $_GET['turno'] ?? '';
    $pagina    = max(1, (int)($_GET['pagina'] ?? 1));
    $limite    = 10;
    $offset    = ($pagina - 1) * $limite;

    $where = ' WHERE 1=1';
    $params = [];

    if (!empty($matricula)) { $where .= ' AND matricula LIKE :m'; $params['m'] = "%$matricula%"; }
    if (!empty($nome))      { $where .= ' AND nome LIKE :n';      $params['n'] = "%$nome%"; }
    if (!empty($turma))     { $where .= ' AND turma = :t';        $params['t'] = $turma; }
    if (!empty($turno))     { $where .= ' AND turno = :tn';       $params['tn'] = $turno; }

    $stmtTotal = $pdo->prepare("SELECT COUNT(*) FROM estudantes $where");
    $stmtTotal->execute($params);
    $totalRegistros = (int)$stmtTotal->fetchColumn();

    $stmt = $pdo->prepare("SELECT matricula, nome, turma, turno, situacao FROM estudantes $where ORDER BY nome ASC LIMIT :limite OFFSET :offset");
    foreach ($params as $k => $v) { $stmt->bindValue(":$k", $v); }
    $stmt->bindValue(':limite', $limite, PDO::PARAM_INT);
    $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
    $stmt->execute();

    echo json_encode([
        'estudantes' => $stmt->fetchAll(),
        'totalPaginas' => max(1, ceil($totalRegistros / $limite)),
        'paginaAtual' => $pagina,
        'totalRegistros' => $totalRegistros
    ]);
    exit();
}

if ($action === 'obter') {
    $matricula = $_GET['matricula'] ?? '';
    $stmt = $pdo->prepare("SELECT * FROM estudantes WHERE matricula = :m LIMIT 1");
    $stmt->execute(['m' => $matricula]);
    echo json_encode($stmt->fetch() ?: null);
    exit();
}

// 3. SALVAR EDIÇÃO (Antigo editar.php)
if ($action === 'salvar' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    if (empty($data['nome']) || empty($data['turma'])) {
        echo json_encode(['sucesso' => false, 'erro' => 'Preencha os campos obrigatórios!']);
        exit();
    }

    $stmt = $pdo->prepare("UPDATE estudantes SET 
        nome = :nome, turma = :turma, turno = :turno, situacao = :situacao, 
        email = :email, telefone = :telefone, nome_responsavel = :nome_responsavel 
        WHERE matricula = :matricula");

    $sucesso = $stmt->execute([
        ':nome'             => trim($data['nome']),
        ':turma'            => trim($data['turma']),
        ':turno'            => trim($data['turno'] ?? 'Manhã'),
        ':situacao'         => trim($data['situacao'] ?? 'Ativo'),
        ':email'            => trim($data['email'] ?? ''),
        ':telefone'         => trim($data['telefone'] ?? ''),
        ':nome_responsavel' => trim($data['nome_responsavel'] ?? ''),
        ':matricula'        => $data['matricula']
    ]);

    echo json_encode(['sucesso' => $sucesso]);
    exit();
}

// 4. CADASTRAR NOVO ESTUDANTE
if ($action === 'cadastrar' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    $matricula       = trim($data['matricula'] ?? '');
    $nome            = trim($data['nome'] ?? '');
    $turma           = trim($data['turma'] ?? '');
    $situacao        = trim($data['situacao'] ?? 'Ativo');
    $data_nascimento = trim($data['data_nascimento'] ?? '');
    $nome_responsavel= trim($data['nome_responsavel'] ?? '');
    $email           = trim($data['email'] ?? '');
    $telefone        = trim($data['telefone'] ?? '');

    if (empty($matricula) || empty($nome) || empty($turma)) {
        echo json_encode(['sucesso' => false, 'erro' => 'Preencha os campos obrigatórios (Matrícula, Nome e Turma).']);
        exit();
    }

    try {
        $stmt = $pdo->prepare("INSERT INTO estudantes (matricula, nome, turma, situacao, data_nascimento, nome_responsavel, email, telefone) 
                               VALUES (:matricula, :nome, :turma, :situacao, :data_nascimento, :nome_responsavel, :email, :telefone)");
        
        $sucesso = $stmt->execute([
            ':matricula'        => $matricula,
            ':nome'             => $nome,
            ':turma'            => $turma,
            ':situacao'         => $situacao,
            ':data_nascimento'  => $data_nascimento ?: null,
            ':nome_responsavel' => $nome_responsavel,
            ':email'            => $email,
            ':telefone'         => $telefone
        ]);

        echo json_encode(['sucesso' => $sucesso]);
    } catch (PDOException $e) {
        if ($e->getCode() == 23000) {
            echo json_encode(['sucesso' => false, 'erro' => "A matrícula '$matricula' já está cadastrada."]);
        } else {
            echo json_encode(['sucesso' => false, 'erro' => 'Erro no banco: ' . $e->getMessage()]);
        }
    }
    exit();
}