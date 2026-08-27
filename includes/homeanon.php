<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Portal Lassalista - Modo Visitante</title>

  <link rel="icon" type="image/jpeg" href="../assets/favicon.jpeg">
  
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-slate-100 min-h-screen flex flex-col font-sans">
  <header class="bg-[#002B49] text-white p-4 shadow-md">
    <div class="max-w-4xl mx-auto flex justify-between items-center">
      <div class="flex items-center space-x-3">
        <h1 class="text-xl font-bold tracking-wide">La<span class="text-yellow-400">★</span>Salle</h1>
        <span class="text-xs sm:text-sm opacity-80 border-l border-slate-600 pl-3">Consulta Pública / Modo Visitante</span>
      </div>
      <a href="../index.php" class="text-xs bg-slate-700 hover:bg-slate-600 px-3 py-1.5 rounded text-white font-medium transition">
        ← Voltar para Login
      </a>
    </div>
  </header>
  <main class="flex-1 max-w-4xl w-full mx-auto p-4 md:p-6 space-y-6">
    <div class="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
      <h2 class="text-lg font-bold text-[#002B49] mb-1">Consulta de Notas por Matrícula</h2>
      <p class="text-xs text-slate-500 mb-4">Informe o número de matrícula do estudante para visualizar as notas trimestrais.</p>
      
      <div class="flex flex-col sm:flex-row gap-3">
        <input 
          type="text" 
          id="inputMatricula" 
          placeholder="Ex: 20260901" 
          class="flex-1 p-2.5 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-800"
          onkeydown="if(event.key === 'Enter') buscarNotas()"
        />
        <button 
          onclick="buscarNotas()" 
          class="bg-[#002B49] hover:bg-blue-900 text-white font-semibold px-6 py-2.5 rounded transition shadow">
          Buscar Notas
        </button>
      </div>
      <p id="msgErro" class="text-red-600 text-sm mt-3 font-medium hidden"></p>
    </div>
    <div id="resultado" class="hidden space-y-6">
      <div class="bg-blue-50 border-l-4 border-[#002B49] p-4 rounded-r shadow-sm flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
        <div>
          <span class="text-xs text-slate-500 uppercase font-bold tracking-wider">Estudante</span>
          <p id="lblNome" class="text-base font-bold text-slate-800"></p>
        </div>
        <div>
          <span class="text-xs text-slate-500 uppercase font-bold tracking-wider">Turma</span>
          <p id="lblTurma" class="text-base font-bold text-slate-800"></p>
        </div>
      </div>
      <div class="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <div class="p-4 border-b border-slate-100 bg-slate-50">
          <h3 class="font-bold text-slate-700 text-sm">Boletim Trimestral</h3>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-slate-100 text-slate-700 text-xs font-bold uppercase border-b border-slate-200">
                <th class="p-3">Disciplina</th>
                <th class="p-3 text-center">1º Trimestre</th>
                <th class="p-3 text-center">2º Trimestre</th>
                <th class="p-3 text-center">3º Trimestre</th>
                <th class="p-3 text-center">Média Parcial</th>
              </tr>
            </thead>
            <tbody id="tabelaCorpo" class="text-sm divide-y divide-slate-100">
            </tbody>
          </table>
        </div>
      </div>
    </div>

  </main>

  <footer class="bg-[#002B49] text-white text-center py-3 text-xs">
    © 2026 FIEL - Projeto Multidisciplinar Lassalista. Todos os direitos reservados.
  </footer>

  <script src="../scripts/anon.js"></script>
</body>
</html>