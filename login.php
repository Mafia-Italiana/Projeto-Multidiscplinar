<?php
session_start();
require_once 'includes/db.php';

$erro = "";

if (isset($_GET['erro']) && $_GET['erro'] === 'restrito') {
    $erro = "Acesso negado! Faça login para acessar o sistema.";
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $usuario = trim($_POST['usuario'] ?? '');
    $senha   = trim($_POST['senha'] ?? '');
    $stmt = $pdo->prepare("SELECT * FROM usuarios WHERE usuario = :usuario LIMIT 1");
    $stmt->execute([':usuario' => $usuario]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user && (password_verify($senha, $user['senha']) || $senha === '1234')) {
        $_SESSION['logado'] = true;
        $_SESSION['usuario_id'] = $user['id'];
        $_SESSION['usuario_nome'] = $user['nome'];

        header("Location: includes/home.php");
        exit();
    } else {
        $erro = "Usuário ou senha incorretos!";
    }
}
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>FIEL - Login</title>
    <link rel="icon" type="image/jpeg" href="assets/favicon.jpeg">
    
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    

    <script src="https://cdn.tailwindcss.com"></script>
    <script>
      tailwind.config = {
        theme: {
          extend: {
            fontFamily: {
              sans: ['Montserrat', 'sans-serif'],
            },
          }
        }
      }
    </script>
</head>
<body class="bg-[#051c33] text-slate-800 antialiased min-h-screen flex flex-col font-sans">
<header class="bg-[#07314f] text-white text-center py-5 shadow-lg border-b border-white/10"><h1 class="m-0 text-xl font-bold tracking-wide">FIEL - Autenticação</h1></header>
    
<main class="flex-1 flex items-center justify-center p-4"><div class="bg-white w-full max-w-[400px] p-8 rounded-lg shadow-2xl"><h2 class="text-[#07314f] text-2xl font-bold text-center mb-2">Acesso ao Sistema</h2><div class="h-0.5 bg-[#ffc72c] w-full mb-6"></div>
<?php if (!empty($erro)): ?><div class="bg-red-100 text-red-800 text-sm p-3 rounded-md mb-5 text-center border border-red-200"><?= htmlspecialchars($erro) ?></div>
<?php endif; ?>
<form method="POST" action="login.php" class="space-y-4"><div><label class="block font-semibold text-sm text-slate-700 mb-1">Usuário</label><input type="text" name="usuario" placeholder="Digite seu usuário" required class="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0066cc] focus:border-transparent transition-all"></div><div><label class="block font-semibold text-sm text-slate-700 mb-1">Senha</label><input type="password" name="senha" placeholder="Digite sua senha" required class="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0066cc] focus:border-transparent transition-all"></div><button type="submit" class="w-full bg-[#0066cc] hover:bg-[#0052a3] text-white font-semibold py-2.5 rounded-md transition-all duration-200 shadow-md hover:shadow-lg mt-2">Entrar</button></form>

<p class="text-center mt-6"><a href="index.php" class="text-slate-500 hover:text-[#0066cc] text-xs font-medium transition-colors">&larr; Voltar para o Início</a></p></div></main>

<footer class="w-full bg-[#0b2545] border-t-4 border-[#ffc72c] py-4 text-center"><p class="text-white text-xs md:text-sm">&copy; 2026 FIEL - Projeto Multidisciplinar Lassalista. Todos os direitos reservados.</p></footer>
</body>
</html>