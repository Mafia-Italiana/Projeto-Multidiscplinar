import React, { useState } from 'react';

export function Login() {
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    // Impede o formulário de recarregar a página e mandar dados pela URL (GET)
    e.preventDefault();
    setErro('');
    setCarregando(true);

    try {
      const response = await fetch('login.php', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ usuario, senha }),
      });

      const data = await response.json();

      if (data.sucesso) {
        window.location.href = data.redirect || 'includes/home.php';
      } else {
        setErro(data.erro || 'Usuário ou senha incorretos.');
      }
    } catch (err) {
      setErro('Erro ao conectar com o servidor PHP.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="bg-[#051c33] text-slate-800 antialiased min-h-screen flex flex-col font-sans">
      <header className="bg-[#07314f] text-white text-center py-5 shadow-lg border-b border-white/10">
        <h1 className="m-0 text-xl font-bold tracking-wide">FIEL - Autenticação</h1>
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="bg-white w-full max-w-[400px] p-8 rounded-lg shadow-2xl">
          <h2 className="text-[#07314f] text-2xl font-bold text-center mb-2">Acesso ao Sistema</h2>
          <div className="h-0.5 bg-[#ffc72c] w-full mb-6"></div>

          {erro && (
            <div className="bg-red-100 text-red-800 text-sm p-3 rounded-md mb-5 text-center border border-red-200">
              {erro}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-semibold text-sm text-slate-700 mb-1">Usuário</label>
              <input
                type="text"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                placeholder="Digite seu usuário"
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0066cc] transition-all"
              />
            </div>

            <div>
              <label className="block font-semibold text-sm text-slate-700 mb-1">Senha</label>
              <input
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="Digite sua senha"
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0066cc] transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={carregando}
              className="w-full bg-[#0066cc] hover:bg-[#0052a3] text-white font-semibold py-2.5 rounded-md transition-all duration-200 shadow-md mt-2 disabled:opacity-50"
            >
              {carregando ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
        </div>
      </main>

      <footer className="w-full bg-[#0b2545] border-t-4 border-[#ffc72c] py-4 text-center">
        <p className="text-white text-xs md:text-sm">
          &copy; 2026 FIEL - Projeto Multidisciplinar Lassalista. Todos os direitos reservados.
        </p>
      </footer>
    </div>
  );
}