<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>La Salle - FIEL</title>
    
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
    <header class="bg-[#07314f] px-[12%] py-[18px] flex justify-between items-center shadow-lg">
        <a href="index.php" class="flex items-center">
            <img src="assets/logo.jpeg" alt="Logo La Salle" class="h-[44px] w-auto object-contain select-none pointer-events-none">
        </a>
        <div class="flex items-center">
            <a href="login.php" class="bg-transparent text-white px-6 py-2.5 rounded-md font-semibold text-[0.85rem] border-2 border-white/20 transition-all duration-200 hover:bg-white hover:text-[#07314f] hover:border-white">
                Acesso Restrito
            </a>
        </div>
    </header>
    <main class="flex-1 bg-slate-50 flex flex-col">
        <section class="bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#0d3b66] to-[#051c33] text-white py-[120px] px-[12%] border-b-4 border-[#ffc72c] flex-1 flex items-center">
            <div class="max-w-[1200px] mx-auto flex flex-col md:flex-row items-center justify-between gap-10 w-full">
                <div class="max-w-[580px] flex-1 text-center md:text-left">
                    <span class="bg-[#ffc72c]/15 text-[#ffc72c] px-3.5 py-1.5 text-[0.75rem] font-bold rounded uppercase inline-block mb-5 tracking-wider border border-[#ffc72c]/30">
                        Sistema FIEL 2026
                    </span>
                    <h2 class="text-3xl md:text-4xl font-extrabold leading-snug mb-5 tracking-tight">
                        Tudo está conectado:<br>informação e gestão escolar.
                    </h2>
                    <p class="text-slate-400 text-base leading-relaxed mb-9">
                        Ficha Individual do Estudante Lassalista. Plataforma online para consulta de dados cadastrais, turmas e registros acadêmicos.
                    </p>
                    <a href="login.php" class="bg-[#0066cc] text-white px-8 py-3.5 rounded-md font-semibold inline-block shadow-lg shadow-[#0066cc]/30 transition-all hover:bg-[#0052a3] hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#0066cc]/40">
                        Acessar o Portal do Sistema
                    </a>
                </div>
                <div class="flex-1 flex justify-center items-center">
                    <img src="assets/star.png" alt="Ilustração do Sistema Escolar" class="max-w-full h-auto object-contain select-none pointer-events-none">
                </div>
            </div>
        </section>
    </main>
    <footer class="w-full bg-[#0b2545] border-t-4 border-[#ffc72c] py-4 text-center">
        <p class="text-white text-xs md:text-sm">
            &copy; 2026 FIEL - Projeto Multidisciplinar Lassalista. Todos os direitos reservados.
        </p>
    </footer>
<script type="module" src="./dashboard/main.js"></script>
</body>
</html>