<?php
http_response_code(500);
?>
<!DOCTYPE html>
<html lang="pt-br">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Erro Interno no Servidor - FIEL</title>
  <link rel="icon" type="image/jpeg" href="/fiel/assets/favicon.jpeg">
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;800&display=swap" rel="stylesheet">
  <style> body { font-family: 'Montserrat', sans-serif; } </style>
</head>
<body class="bg-[#f4f6f9] text-slate-800 min-h-screen flex flex-col justify-between">
<header class="bg-[#0b2545] text-white px-8 py-4 shadow-md"><a href="/fiel/includes/home.php" class="flex items-center"><img src="/fiel/assets/logo.jpeg" alt="Logo La Salle" class="h-[44px] w-auto object-contain select-none pointer-events-none"></a></header><main class="flex-1 flex flex-col items-center justify-center p-6 text-center"><h1 class="text-8xl font-extrabold text-[#d9534f] tracking-widest">500</h1><div class="h-1.5 bg-[#ffc72c] w-24 my-4 rounded-full"></div><h2 class="text-2xl font-bold text-slate-700 mb-2">Instabilidade Temporária</h2><p class="text-slate-500 max-w-md mb-8 text-sm">Ocorreu um problema ao processar sua requisição no servidor. Não Precisa se Preocupar, O Problema não é Você O Problema é o Eu (Servidor) .</p><div class="flex gap-3"><button onclick="window.location.reload()" class="bg-[#0b2545] hover:bg-[#07182d] text-white font-bold text-sm px-6 py-3 rounded-md shadow-md transition">Tentar Novamente</button><a href="/fiel/index.php" class="bg-slate-500 hover:bg-slate-600 text-white font-bold text-sm px-6 py-3 rounded-md shadow-md transition">Voltar ao Início</a></div></main><footer class="bg-[#0b2545] border-t-4 border-[#ffc72c] py-3 text-center text-white text-xs"> &copy; 2026 FIEL - Projeto Multidisciplinar Lassalista. Todos os direitos reservados.</footer>

</body>
</html>