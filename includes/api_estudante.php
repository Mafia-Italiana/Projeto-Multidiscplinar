<?php
header('Content-Type: application/json');
require_once 'auth.php';

$host = 'localhost';
$db   = 'fiel_db';
$user = 'root';
$pass = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8mb4", $user, $pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
    ]);

    $matricula = $_GET['matricula'] ?? null;

    if (!$matricula) {
        echo json_encode(['erro' => 'Matrícula não informada.']);
        exit;
    }

    $stmt = $pdo->prepare('SELECT * FROM estudantes WHERE matricula = :matricula');
    $stmt->execute(['matricula' => $matricula]);
    $estudante = $stmt->fetch();

    if ($estudante) {
        echo json_encode($estudante);
    } else {
        http_response_code(404);
        echo json_encode(['erro' => 'Estudante não encontrado.']);
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['erro' => 'Erro no banco de dados: ' . $e->getMessage()]);
}

?>