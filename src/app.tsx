import React, { useState, useEffect } from 'react';

interface Estudante {
  matricula: string;
  nome: string;
  turma: string;
  turno?: string;
  situacao: string;
  data_nascimento?: string;
  email?: string;
  telefone?: string;
  nome_responsavel?: string;
}

interface NotaTrimestre {
  trimestre1: number | string;
  trimestre2: number | string;
  trimestre3: number | string;
}

interface NotasAluno {
  disciplina: string;
  notas: NotaTrimestre;
}

export default function App() {
  const [telaAtual, setTelaAtual] = useState<
  'home' | 'ficha' | 'editar' | 'cadastrar' | 'notas' | 'frequencia'
>('home');
  const [alunoSelecionado, setAlunoSelecionado] = useState<Estudante | null>(null);
  const [estudantes, setEstudantes] = useState<Estudante[]>([]);
  const [filtros, setFiltros] = useState({ matricula: '', nome: '', turma: '', turno: '' });
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [totalRegistros, setTotalRegistros] = useState(0);
  const [formEditar, setFormEditar] = useState<Estudante | null>(null);
  const [alunoNotas, setAlunoNotas] = useState<Estudante | null>(null);
  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState('');

  const [notasTrimestrais, setNotasTrimestrais] = useState<NotasAluno[]>([
    { disciplina: 'Português', notas: { trimestre1: '', trimestre2: '', trimestre3: '' } },
    { disciplina: 'Matemática', notas: { trimestre1: '', trimestre2: '', trimestre3: '' } },
    { disciplina: 'História', notas: { trimestre1: '', trimestre2: '', trimestre3: '' } },
    { disciplina: 'Geografia', notas: { trimestre1: '', trimestre2: '', trimestre3: '' } },
    { disciplina: 'Ciências', notas: { trimestre1: '', trimestre2: '', trimestre3: '' } },
  ]);

  const [formCadastrar, setFormCadastrar] = useState({
    matricula: '',
    nome: '',
    turma: '',
    situacao: 'Ativo',
    data_nascimento: '',
    nome_responsavel: '',
    email: '',
    telefone: ''
  });

  // Função unificada para carregar estudantes
const carregarEstudantes = async (pag: number = pagina) => {
  try {
    const params = new URLSearchParams({
      matricula: filtros.matricula || '',
      nome: filtros.nome || '',
      turma: filtros.turma || '',
      turno: filtros.turno || '',
      pagina: pag.toString(),
      limite: '10'
    });

    const res = await fetch(`http://127.0.0.1:3000/api/estudantes?${params.toString()}`);

    if (res.ok) {
      const data = await res.json();
      
      // Obtém o array completo enviado pela API
      const listaCompleta: Estudante[] = data.dados || data.estudantes || (Array.isArray(data) ? data : []);
      
      const limite = 10;
      const totalReg = data.totalRegistros || listaCompleta.length;
      const totalPag = data.totalPaginas || Math.ceil(totalReg / limite) || 1;

      // Se o backend NÃO paginou (retornou tudo), faz o corte (slice) localmente
      const inicio = (pag - 1) * limite;
      const listaPaginada = data.totalPaginas 
        ? listaCompleta 
        : listaCompleta.slice(inicio, inicio + limite);

      setEstudantes(listaPaginada);
      setTotalPaginas(totalPag);
      setTotalRegistros(totalReg);
    } else {
      setErro('Erro ao carregar a lista de estudantes.');
    }
  } catch {
    setErro('Erro ao conectar com a API em Rust.');
  }
};
  // Dispara a busca sempre que a página mudar
  useEffect(() => {
    carregarEstudantes(pagina);
  }, [pagina]);

  // Handler para busca de filtros
  const handleBuscar = (e: React.FormEvent) => {
    e.preventDefault();
    if (pagina === 1) {
      carregarEstudantes(1);
    } else {
      setPagina(1);
    }
  };

  const abrirFicha = (matricula: string) => {
    const aluno = estudantes.find((e) => e.matricula === matricula);
    if (aluno) {
      setAlunoSelecionado(aluno);
      setTelaAtual('ficha');
    } else {
      setErro('Estudante não encontrado.');
    }
  };

  const abrirEditar = (matricula: string) => {
    setMensagem('');
    setErro('');
    const aluno = estudantes.find((e) => e.matricula === matricula);
    if (aluno) {
      setFormEditar(aluno);
      setTelaAtual('editar');
    } else {
      setErro('Estudante não encontrado.');
    }
  };

const abrirNotas = async (aluno: Estudante) => {
  setAlunoNotas(aluno);
  setMensagem('');
  setErro('');

  const disciplinasPadrao: NotasAluno[] = [
    { disciplina: 'Português', notas: { trimestre1: '', trimestre2: '', trimestre3: '' } },
    { disciplina: 'Matemática', notas: { trimestre1: '', trimestre2: '', trimestre3: '' } },
    { disciplina: 'História', notas: { trimestre1: '', trimestre2: '', trimestre3: '' } },
    { disciplina: 'Geografia', notas: { trimestre1: '', trimestre2: '', trimestre3: '' } },
    { disciplina: 'Ciências', notas: { trimestre1: '', trimestre2: '', trimestre3: '' } },
  ];

  try {
    const res = await fetch(`http://127.0.0.1:3000/api/notas/${aluno.matricula}`);

    // Garante que a requisição HTTP retornou status 200 (OK)
    if (res.ok) {
      const data = await res.json();

      // Suporta tanto o formato envelopado { sucesso: true, notas: [...] }
      // quanto o retorno direto de um array de notas [...] da API Rust
      const notasRecebidas = Array.isArray(data) ? data : data?.notas;

      if (Array.isArray(notasRecebidas) && notasRecebidas.length > 0) {
        setNotasTrimestrais(notasRecebidas);
      } else {
        setNotasTrimestrais(disciplinasPadrao);
      }
    } else {
      // Se der 404 (sem notas cadastradas ainda), usa a estrutura padrão
      setNotasTrimestrais(disciplinasPadrao);
    }
  } catch (err) {
    // Caso a API esteja offline ou ocorra erro de rede
    setNotasTrimestrais(disciplinasPadrao);
  }

  setTelaAtual('notas');
};

const salvarEdicao = async (e: React.FormEvent) => {
  e.preventDefault();

  const estudante = formEditar as any;

  if (!estudante || !estudante.matricula) {
    alert("Identificador do aluno não encontrado.");
    return;
  }

  try {
    const res = await fetch(`http://127.0.0.1:3000/api/estudantes/${estudante.matricula}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(estudante),
    });

    if (res.ok) {
      alert("Dados do aluno atualizados com sucesso!");
      setTelaAtual('home');
      carregarEstudantes();
    } else {
      const erroApi = await res.text();
      alert(`Erro ao salvar: ${erroApi}`);
    }
  } catch (error) {
    alert("Erro de conexão ao tentar salvar as alterações.");
  }
};

  const salvarCadastro = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensagem('');
    setErro('');

    try {
      const res = await fetch('http://127.0.0.1:3000/api/estudantes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formCadastrar)
      });

      const resData = await res.json();
      if (resData.sucesso) {
        setMensagem('Estudante cadastrado com sucesso!');
        setFormCadastrar({
          matricula: '', nome: '', turma: '', situacao: 'Ativo',
          data_nascimento: '', nome_responsavel: '', email: '', telefone: ''
        });
      } else {
        setErro(resData.erro || 'Erro ao cadastrar estudante.');
      }
    } catch {
      setErro('Falha na comunicação com o servidor.');
    }
  };

const salvarNotas = async () => {
  if (!alunoNotas || !alunoNotas.matricula) {
    alert("Aluno não identificado.");
    return;
  }

  try {
    const res = await fetch(`http://127.0.0.1:3000/api/notas/${alunoNotas.matricula}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(notasTrimestrais),
    });

    if (res.ok) {
      alert("Notas salvas com sucesso!");
    } else {
      const txt = await res.text();
      alert(`Erro ao salvar notas: ${txt}`);
    }
  } catch (err) {
    alert("Erro de conexão ao salvar notas.");
  }
};

  const handleNotaChange = (index: number, campo: keyof NotaTrimestre, valor: string) => {
    setNotasTrimestrais(prevNotas =>
      prevNotas.map((item, i) =>
        i === index
          ? { ...item, notas: { ...item.notas, [campo]: valor } }
          : item
      )
    );
  };

const carregarNotas = async (matricula: string) => {
  try {
    const res = await fetch(`http://127.0.0.1:3000/api/notas/${matricula}`);
    if (res.ok) {
      const dados = await res.json();
      if (dados && dados.length > 0) {
        setNotasTrimestrais(dados);
      }
    }
  } catch (err) {
    console.error("Erro ao carregar notas:", err);
  }
}

  const calcularMedia = (t1: number | string, t2: number | string, t3: number | string) => {
    const notasValidas = [t1, t2, t3]
      .filter(val => val !== '' && val !== null && val !== undefined)
      .map(val => parseFloat(val as string));

    if (notasValidas.length === 0) return '-';

    const soma = notasValidas.reduce((acc, curr) => acc + (isNaN(curr) ? 0 : curr), 0);
    return (soma / notasValidas.length).toFixed(1);
  };

  const limparFiltros = () => {
    setFiltros({ matricula: '', nome: '', turma: '', turno: '' });
    setPagina(1);
  };

  return (
    <div className="bg-[#f4f6f9] text-slate-800 antialiased min-h-screen flex flex-col font-sans">
      <header className="bg-[#07314f] px-[10%] py-3.5 flex justify-between items-center shadow-md">
        <button type="button" onClick={() => { setMensagem(''); setErro(''); setTelaAtual('home'); }} className="flex items-center">
          <img 
            src="../assets/logo.jpeg" 
            alt="Logo La Salle" 
            className="max-h-12 w-auto object-contain select-none pointer-events-none" 
          />
        </button>

        <div className="flex items-center gap-3">
          {telaAtual === 'home' ? (
            <>
              <button 
                type="button" 
                onClick={() => { setMensagem(''); setErro(''); setTelaAtual('cadastrar'); }}
                className="bg-[#ffc72c] hover:bg-[#e0ad22] text-[#07314f] px-3.5 py-2 rounded text-xs font-bold transition-colors shadow-sm"
              >
                + Cadastrar Aluno
              </button>
              <a href="../logout.php" className="bg-[#d9534f] hover:bg-[#c9302c] text-white px-4 py-2 rounded text-xs font-bold transition-colors">
                Sair
              </a>
            </>
          ) : (
            <button 
              type="button" 
              onClick={() => { setMensagem(''); setErro(''); setTelaAtual('home'); }}
              className="bg-[#6c757d] hover:bg-[#5a6268] text-white px-3.5 py-2 rounded text-xs font-bold transition-colors"
            >
              ← Voltar para Consulta
            </button>
          )}
        </div>
      </header>

      <main className="flex-1 max-w-[1100px] w-full mx-auto my-[30px] px-5 space-y-6">
        {telaAtual === 'home' && (
          <>
            <section className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
              <h2 className="text-[#002b49] text-lg font-bold pb-2 border-b-2 border-[#ffc72c] mb-5">
                Consulta de Estudante
              </h2>
              <form onSubmit={handleBuscar}>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="flex flex-col">
                    <label className="text-xs font-bold text-slate-700 mb-1">Matrícula</label>
                    <input 
                      type="text" value={filtros.matricula} 
                      onChange={e => setFiltros({...filtros, matricula: e.target.value})}
                      placeholder="Ex: 20261001" className="px-3 py-2 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-[#002b49]" 
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-xs font-bold text-slate-700 mb-1">Nome do Estudante</label>
                    <input 
                      type="text" value={filtros.nome} 
                      onChange={e => setFiltros({...filtros, nome: e.target.value})}
                      placeholder="Digite o nome..." className="px-3 py-2 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-[#002b49]" 
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-xs font-bold text-slate-700 mb-1">Turma</label>
                    <select 
                      value={filtros.turma} onChange={e => setFiltros({...filtros, turma: e.target.value})}
                      className="px-3 py-2 border border-slate-300 rounded text-xs bg-white focus:ring-1 focus:ring-[#002b49]"
                    >
                      <option value="">Todas</option>
                      <option value="6º Ano - Ensino Fundamental">6º Ano - Ensino Fundamental</option>
                      <option value="7º Ano - Ensino Fundamental">7º Ano - Ensino Fundamental</option>
                      <option value="8º Ano - Ensino Fundamental">8º Ano - Ensino Fundamental</option>
                      <option value="9º Ano - Ensino Fundamental">9º Ano - Ensino Fundamental</option>
                      <option value="1º Ano - Ensino Médio">1º Ano - Ensino Médio</option>
                      <option value="2º Ano - Ensino Médio">2º Ano - Ensino Médio</option>
                      <option value="3º Ano - Ensino Médio">3º Ano - Ensino Médio</option>
                    </select>
                  </div>
                  <div className="flex flex-col">
                    <label className="text-xs font-bold text-slate-700 mb-1">Turno</label>
                    <select 
                      value={filtros.turno} onChange={e => setFiltros({...filtros, turno: e.target.value})}
                      className="px-3 py-2 border border-slate-300 rounded text-xs bg-white focus:ring-1 focus:ring-[#002b49]"
                    >
                      <option value="">Todos</option>
                      <option value="Manhã">Manhã</option>
                      <option value="Tarde">Tarde</option>
                      <option value="Noite">Noite</option>
                    </select>
                  </div>
                </div>

                <div className="mt-4 flex gap-2.5 items-center flex-wrap">
                  <button type="submit" className="bg-[#07314f] hover:bg-[#002b49] text-white font-bold text-xs px-4 py-2 rounded transition-colors">
                    Buscar Dados
                  </button>
                  <button type="button" onClick={limparFiltros} className="bg-[#6c757d] hover:bg-[#5a6268] text-white font-bold text-xs px-4 py-2 rounded transition-colors">
                    Limpar Filtros
                  </button>
                </div>
              </form>
            </section>

            <section className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
              <h2 className="text-[#002b49] text-lg font-bold pb-2 border-b-2 border-[#ffc72c] mb-4">
                Dados Cadastrais do Estudante
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left text-xs">
                  <thead>
                    <tr className="bg-[#f0f4f8] text-[#002b49] font-bold">
                      <th className="p-3 border-b border-slate-200">Matrícula</th>
                      <th className="p-3 border-b border-slate-200">Nome</th>
                      <th className="p-3 border-b border-slate-200">Turma</th>
                      <th className="p-3 border-b border-slate-200">Turno</th>
                      <th className="p-3 border-b border-slate-200">Situação</th>
                      <th className="p-3 border-b border-slate-200">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {estudantes.length > 0 ? (
                      estudantes.map((aluno) => (
                        <tr key={aluno.matricula} className="hover:bg-slate-50">
                          <td className="p-3 text-slate-700 font-medium">{aluno.matricula}</td>
                          <td className="p-3 text-slate-700 font-medium">{aluno.nome}</td>
                          <td className="p-3 text-slate-700">{aluno.turma}</td>
                          <td className="p-3 text-slate-700">{aluno.turno || 'Manhã'}</td>
                          <td className="p-3 text-slate-700">{aluno.situacao}</td>
                          <td className="p-3 whitespace-nowrap space-x-1">
                            <button 
                              onClick={() => abrirFicha(aluno.matricula)} 
                              className="bg-[#002b49] text-white px-2.5 py-1 rounded text-xs font-semibold hover:bg-[#001f35]"
                            >
                              Ficha
                            </button>
                            <button 
                              onClick={() => abrirEditar(aluno.matricula)}
                              className="bg-[#ffc72c] text-[#07314f] px-2.5 py-1 rounded text-xs font-semibold hover:bg-[#e5b327]"
                            >
                              Editar
                            </button>
                            <button 
                              onClick={() => abrirNotas(aluno)}
                              className="bg-emerald-600 text-white px-2.5 py-1 rounded text-xs font-semibold hover:bg-emerald-700"
                            >
                              Notas
                            </button>
                          <button 
  onClick={() => {
    setAlunoSelecionado(aluno);
    setTelaAtual('frequencia');
  }}
  className="bg-purple-600 text-white px-2.5 py-1 rounded text-xs font-semibold hover:bg-purple-700"
>
  Faltas
</button>

                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="p-5 text-center text-slate-500">
                          Nenhum estudante encontrado com os parâmetros informados.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {totalPaginas > 1 && (
                <div className="mt-5 pt-4 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-3">
                  <span className="text-xs text-slate-500">
                    Mostrando página <strong>{pagina}</strong> de <strong>{totalPaginas}</strong> (Total: {totalRegistros} registros)
                  </span>
                  <div className="flex gap-1 items-center">
                    <button type="button" disabled={pagina === 1} onClick={() => setPagina(pagina - 1)} className="bg-[#07314f] text-white px-3 py-1 rounded text-xs disabled:bg-slate-200 disabled:text-slate-400">
                      &laquo; Anterior
                    </button>
                    {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((p) => (
                      <button type="button" key={p} onClick={() => setPagina(p)} className={`px-3 py-1 rounded text-xs font-bold ${p === pagina ? 'bg-[#07314f] text-white' : 'bg-slate-100 text-slate-700'}`}>
                        {p}
                      </button>
                    ))}
                    <button type="button" disabled={pagina === totalPaginas} onClick={() => setPagina(pagina + 1)} className="bg-[#07314f] text-white px-3 py-1 rounded text-xs disabled:bg-slate-200 disabled:text-slate-400">
                      Próximo &raquo;
                    </button>
                  </div>
                </div>
              )}
            </section>
          </>
        )}

        {telaAtual === 'ficha' && alunoSelecionado && (
          <section className="bg-white p-6 md:p-8 rounded-lg shadow-sm border border-slate-200 max-w-[650px] mx-auto">
            <h2 className="text-[#002b49] text-lg font-bold pb-2 border-b-2 border-[#ffc72c] mb-5">
              Ficha Individual do Estudante
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-slate-50 rounded"><span className="font-bold text-slate-500 block">Matrícula</span> <p className="text-sm font-semibold">{alunoSelecionado.matricula}</p></div>
              <div className="p-3 bg-slate-50 rounded"><span className="font-bold text-slate-500 block">Nome Completo</span> <p className="text-sm font-semibold">{alunoSelecionado.nome}</p></div>
              <div className="p-3 bg-slate-50 rounded"><span className="font-bold text-slate-500 block">Turma</span> <p>{alunoSelecionado.turma}</p></div>
              <div className="p-3 bg-slate-50 rounded"><span className="font-bold text-slate-500 block">Turno</span> <p>{alunoSelecionado.turno || 'N/A'}</p></div>
              <div className="p-3 bg-slate-50 rounded"><span className="font-bold text-slate-500 block">Situação</span> <p>{alunoSelecionado.situacao}</p></div>
              <div className="p-3 bg-slate-50 rounded"><span className="font-bold text-slate-500 block">Responsável</span> <p>{alunoSelecionado.nome_responsavel || 'Não informado'}</p></div>
              <div className="p-3 bg-slate-50 rounded"><span className="font-bold text-slate-500 block">E-mail</span> <p>{alunoSelecionado.email || 'Não informado'}</p></div>
              <div className="p-3 bg-slate-50 rounded"><span className="font-bold text-slate-500 block">Telefone</span> <p>{alunoSelecionado.telefone || 'Não informado'}</p></div>
            </div>
            <button type="button" onClick={() => abrirEditar(alunoSelecionado.matricula)} className="mt-6 w-full bg-[#ffc72c] text-[#07314f] font-bold text-xs py-2.5 rounded transition-colors">
              Editar Cadastro
            </button>
          </section>
        )}

        {telaAtual === 'editar' && formEditar && (
          <section className="bg-white p-6 md:p-8 rounded-lg shadow-sm border border-slate-200 max-w-[650px] mx-auto">
            <h2 className="text-[#002b49] text-lg font-bold pb-2 border-b-2 border-[#ffc72c] mb-5">
              Editar Aluno
            </h2>

            {mensagem && <div className="bg-[#e8f8e8] text-green-800 p-3.5 rounded mb-4 border border-green-200 text-xs font-medium">{mensagem}</div>}
            {erro && <div className="bg-[#ffe6e6] text-red-700 p-3.5 rounded mb-4 border border-red-200 text-xs font-medium">{erro}</div>}

            <form onSubmit={salvarEdicao} className="space-y-4">
              <div className="flex flex-col">
                <label className="text-xs font-bold text-slate-700 mb-1">Nome Completo *</label>
                <input 
                  type="text" value={formEditar.nome} required
                  onChange={e => setFormEditar({...formEditar, nome: e.target.value})}
                  className="px-3 py-2 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-[#002b49]" 
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label className="text-xs font-bold text-slate-700 mb-1">Turma *</label>
                  <select 
                    value={formEditar.turma} required
                    onChange={e => setFormEditar({...formEditar, turma: e.target.value})}
                    className="px-3 py-2 border border-slate-300 rounded text-xs bg-white focus:ring-1 focus:ring-[#002b49]"
                  >
                    <option value="6º Ano - Ensino Fundamental">6º Ano - Ensino Fundamental</option>
                    <option value="7º Ano - Ensino Fundamental">7º Ano - Ensino Fundamental</option>
                    <option value="8º Ano - Ensino Fundamental">8º Ano - Ensino Fundamental</option>
                    <option value="9º Ano - Ensino Fundamental">9º Ano - Ensino Fundamental</option>
                    <option value="1º Ano - Ensino Médio">1º Ano - Ensino Médio</option>
                    <option value="2º Ano - Ensino Médio">2º Ano - Ensino Médio</option>
                    <option value="3º Ano - Ensino Médio">3º Ano - Ensino Médio</option>
                  </select>
                </div>
                <div className="flex flex-col">
                  <label className="text-xs font-bold text-slate-700 mb-1">Turno</label>
                  <select 
                    value={formEditar.turno || 'Manhã'} 
                    onChange={e => setFormEditar({...formEditar, turno: e.target.value})}
                    className="px-3 py-2 border border-slate-300 rounded text-xs bg-white focus:ring-1 focus:ring-[#002b49]"
                  >
                    <option value="Manhã">Manhã</option>
                    <option value="Tarde">Tarde</option>
                    <option value="Noite">Noite</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label className="text-xs font-bold text-slate-700 mb-1">Situação</label>
                  <select 
                    value={formEditar.situacao} 
                    onChange={e => setFormEditar({...formEditar, situacao: e.target.value})}
                    className="px-3 py-2 border border-slate-300 rounded text-xs bg-white focus:ring-1 focus:ring-[#002b49]"
                  >
                    <option value="Ativo">Ativo</option>
                    <option value="Inativo">Inativo</option>
                    <option value="Pendente">Pendente</option>
                  </select>
                </div>
                <div className="flex flex-col">
                  <label className="text-xs font-bold text-slate-700 mb-1">Responsável</label>
                  <input 
                    type="text" value={formEditar.nome_responsavel || ''} 
                    onChange={e => setFormEditar({...formEditar, nome_responsavel: e.target.value})}
                    className="px-3 py-2 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-[#002b49]" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label className="text-xs font-bold text-slate-700 mb-1">E-mail</label>
                  <input 
                    type="email" value={formEditar.email || ''} 
                    onChange={e => setFormEditar({...formEditar, email: e.target.value})}
                    className="px-3 py-2 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-[#002b49]" 
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-xs font-bold text-slate-700 mb-1">Telefone</label>
                  <input 
                    type="text" value={formEditar.telefone || ''} 
                    onChange={e => setFormEditar({...formEditar, telefone: e.target.value})}
                    className="px-3 py-2 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-[#002b49]" 
                  />
                </div>
              </div>

              <button type="submit" className="w-full bg-[#07314f] hover:bg-[#002b49] text-white font-bold text-xs py-2.5 rounded transition-colors shadow-sm">
                Salvar Alterações
              </button>
            </form>
          </section>
        )}

        {telaAtual === 'notas' && alunoNotas && (
          <section className="bg-white p-6 md:p-8 rounded-lg shadow-sm border border-slate-200 max-w-[850px] mx-auto">
            <h2 className="text-[#002b49] text-lg font-bold pb-2 border-b-2 border-[#ffc72c] mb-2">
              Lançamento de Notas Trimestrais
            </h2>
            <div className="mb-6 p-3 bg-slate-50 rounded border border-slate-200 text-xs">
              <p><strong>Estudante:</strong> {alunoNotas.nome} | <strong>Matrícula:</strong> {alunoNotas.matricula} | <strong>Turma:</strong> {alunoNotas.turma}</p>
            </div>

            {mensagem && <div className="bg-[#e8f8e8] text-green-800 p-3.5 rounded mb-4 border border-green-200 text-xs font-medium">{mensagem}</div>}
            {erro && <div className="bg-[#ffe6e6] text-red-700 p-3.5 rounded mb-4 border border-red-200 text-xs font-medium">{erro}</div>}

            <form onSubmit={salvarNotas}>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left text-xs mb-5">
                  <thead>
                    <tr className="bg-[#f0f4f8] text-[#002b49] font-bold">
                      <th className="p-3 border-b border-slate-200">Disciplina</th>
                      <th className="p-3 border-b border-slate-200 text-center">1º Trimestre</th>
                      <th className="p-3 border-b border-slate-200 text-center">2º Trimestre</th>
                      <th className="p-3 border-b border-slate-200 text-center">3º Trimestre</th>
                      <th className="p-3 border-b border-slate-200 text-center">Média Parcial</th>
                    </tr>
                  </thead>
                  <tbody>
                    {notasTrimestrais && notasTrimestrais.length > 0 ? (
                      notasTrimestrais.map((item, index) => (
                        <tr key={item.disciplina || index} className="border-b hover:bg-slate-50">
                          <td className="p-3 font-semibold text-slate-700">{item.disciplina}</td>
                          <td className="p-3 text-center">
                            <input
                              type="number"
                              step="0.1"
                              min="0"
                              max="10"
                              className="w-16 p-1 border border-slate-300 rounded text-center text-slate-800 font-medium bg-white focus:outline-none focus:ring-2 focus:ring-[#002b49]"
                              value={item.notas?.trimestre1 ?? ''}
                              onChange={(e) => handleNotaChange(index, 'trimestre1', e.target.value)}
                            />
                          </td>
                          <td className="p-3 text-center">
                            <input
                              type="number"
                              step="0.1"
                              min="0"
                              max="10"
                              className="w-16 p-1 border border-slate-300 rounded text-center text-slate-800 font-medium bg-white focus:outline-none focus:ring-2 focus:ring-[#002b49]"
                              value={item.notas?.trimestre2 ?? ''}
                              onChange={(e) => handleNotaChange(index, 'trimestre2', e.target.value)}
                            />
                          </td>
                          <td className="p-3 text-center">
                            <input
                              type="number"
                              step="0.1"
                              min="0"
                              max="10"
                              className="w-16 p-1 border border-slate-300 rounded text-center text-slate-800 font-medium bg-white focus:outline-none focus:ring-2 focus:ring-[#002b49]"
                              value={item.notas?.trimestre3 ?? ''}
                              onChange={(e) => handleNotaChange(index, 'trimestre3', e.target.value)}
                            />
                          </td>
                          <td className="p-3 font-bold text-center text-[#002b49]">
                            {calcularMedia(item.notas?.trimestre1, item.notas?.trimestre2, item.notas?.trimestre3)}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="p-4 text-center text-slate-500">
                          Nenhuma disciplina encontrada.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="flex gap-3">
                <button type="submit" className="bg-[#07314f] hover:bg-[#002b49] text-white font-bold text-xs px-5 py-2.5 rounded transition-colors shadow-sm">
                  Salvar Notas
                </button>
                <button type="button" onClick={() => { setMensagem(''); setErro(''); setTelaAtual('home'); }} className="bg-[#6c757d] hover:bg-[#5a6268] text-white font-bold text-xs px-5 py-2.5 rounded transition-colors">
                  Cancelar
                </button>
              </div>
            </form>
          </section>
)}
  {telaAtual === 'frequencia' && alunoSelecionado && (
  <PainelFrequencia matricula={alunoSelecionado.matricula} /> 
)}
        {telaAtual === 'cadastrar' && (
          <section className="bg-white p-6 md:p-8 rounded-lg shadow-sm border border-slate-200 max-w-[800px] mx-auto">
            <h2 className="text-[#002b49] text-lg font-bold pb-2 border-b-2 border-[#ffc72c] mb-5">
              Cadastrar Novo Estudante
            </h2>

            {mensagem && <div className="bg-[#e8f8e8] text-green-800 p-3.5 rounded mb-4 border border-green-200 text-xs font-medium">{mensagem}</div>}
            {erro && <div className="bg-[#ffe6e6] text-red-700 p-3.5 rounded mb-4 border border-red-200 text-xs font-medium">{erro}</div>}

            <form onSubmit={salvarCadastro} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                
                <div className="flex flex-col">
                  <label className="text-xs font-bold text-slate-700 mb-1">Matrícula *</label>
                  <input 
                    type="text" required placeholder="Ex: 20261003"
                    value={formCadastrar.matricula} 
                    onChange={e => setFormCadastrar({...formCadastrar, matricula: e.target.value})}
                    className="px-3 py-2 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-[#002b49]" 
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-xs font-bold text-slate-700 mb-1">Nome Completo *</label>
                  <input 
                    type="text" required placeholder="Nome do aluno"
                    value={formCadastrar.nome} 
                    onChange={e => setFormCadastrar({...formCadastrar, nome: e.target.value})}
                    className="px-3 py-2 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-[#002b49]" 
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-xs font-bold text-slate-700 mb-1">Turma *</label>
                  <select 
                    required value={formCadastrar.turma}
                    onChange={e => setFormCadastrar({...formCadastrar, turma: e.target.value})}
                    className="px-3 py-2 border border-slate-300 rounded text-xs bg-white focus:ring-1 focus:ring-[#002b49]"
                  >
                    <option value="">Selecione...</option>
                    <option value="6º Ano - Ensino Fundamental">6º Ano - Ensino Fundamental</option>
                    <option value="7º Ano - Ensino Fundamental">7º Ano - Ensino Fundamental</option>
                    <option value="8º Ano - Ensino Fundamental">8º Ano - Ensino Fundamental</option>
                    <option value="9º Ano - Ensino Fundamental">9º Ano - Ensino Fundamental</option>
                    <option value="1º Ano - Ensino Médio">1º Ano - Ensino Médio</option>
                    <option value="2º Ano - Ensino Médio">2º Ano - Ensino Médio</option>
                    <option value="3º Ano - Ensino Médio">3º Ano - Ensino Médio</option>
                  </select>
                </div>

                <div className="flex flex-col">
                  <label className="text-xs font-bold text-slate-700 mb-1">Situação</label>
                  <select 
                    value={formCadastrar.situacao}
                    onChange={e => setFormCadastrar({...formCadastrar, situacao: e.target.value})}
                    className="px-3 py-2 border border-slate-300 rounded text-xs bg-white focus:ring-1 focus:ring-[#002b49]"
                  >
                    <option value="Ativo">Ativo</option>
                    <option value="Inativo">Inativo</option>
                    <option value="Pendente">Pendente</option>
                  </select>
                </div>

                <div className="flex flex-col">
                  <label className="text-xs font-bold text-slate-700 mb-1">Data Nasc.</label>
                  <input 
                    type="date" value={formCadastrar.data_nascimento}
                    onChange={e => setFormCadastrar({...formCadastrar, data_nascimento: e.target.value})}
                    className="px-3 py-2 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-[#002b49]" 
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-xs font-bold text-slate-700 mb-1">Responsável</label>
                  <input 
                    type="text" placeholder="Nome do responsável"
                    value={formCadastrar.nome_responsavel}
                    onChange={e => setFormCadastrar({...formCadastrar, nome_responsavel: e.target.value})}
                    className="px-3 py-2 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-[#002b49]" 
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-xs font-bold text-slate-700 mb-1">E-mail</label>
                  <input 
                    type="email" placeholder="aluno@aluno.lasalle.br"
                    value={formCadastrar.email}
                    onChange={e => setFormCadastrar({...formCadastrar, email: e.target.value})}
                    className="px-3 py-2 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-[#002b49]" 
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-xs font-bold text-slate-700 mb-1">Telefone</label>
                  <input 
                    type="text" placeholder="(41) 99999-9999"
                    value={formCadastrar.telefone}
                    onChange={e => setFormCadastrar({...formCadastrar, telefone: e.target.value})}
                    className="px-3 py-2 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-[#002b49]" 
                  />
                </div>

              </div>

              <div className="flex gap-3 pt-4">
                <button type="submit" className="bg-[#07314f] hover:bg-[#002b49] text-white text-xs font-bold px-5 py-2.5 rounded transition-colors shadow-sm">
                  Cadastrar Aluno
                </button>
              </div>
            </form>
          </section>
        )}

      </main>

      <footer className="w-full bg-[#0b2545] border-t-4 border-[#ffc72c] py-4 text-center mt-auto">
        <p className="text-white text-xs md:text-sm">
          &copy; 2026 FIEL - Projeto Multidisciplinar Lassalista. Todos os direitos reservados.
        </p>
      </footer>
    </div>
  );
}

interface DisciplinaFaltas {
  disciplina: string;
  faltas: {
    faltas_t1: number;
    faltas_t2: number;
    faltas_t3: number;
  };
}

const disciplinasIniciais = [
  "Português", "Matemática", "História", "Geografia", "Ciências"
];

export function PainelFrequencia({ matricula }: { matricula: string }) {
  const [frequencia, setFrequencia] = useState<DisciplinaFaltas[]>(
    disciplinasIniciais.map((d) => ({
      disciplina: d,
      faltas: { faltas_t1: 0, faltas_t2: 0, faltas_t3: 0 },
    }))
  );

  useEffect(() => {
    fetch(`http://127.0.0.1:3000/api/frequencia/${matricula}`)
      .then((res) => res.json())
      .then((dados) => {
        if (dados && dados.length > 0) {
          setFrequencia(dados);
        }
      });
  }, [matricula]);

  const handleChange = (index: number, campo: string, valor: string) => {
    const num = parseInt(valor) || 0;
    const novasFaltas = [...frequencia];
    novasFaltas[index].faltas = {
      ...novasFaltas[index].faltas,
      [campo]: num >= 0 ? num : 0,
    };
    setFrequencia(novasFaltas);
  };

  const salvarFrequencia = async () => {
    try {
      const res = await fetch(`http://127.0.0.1:3000/api/frequencia/${matricula}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(frequencia),
      });
      if (res.ok) alert("Frequência salva com sucesso!");
    } catch (err) {
      alert("Erro ao salvar frequência.");
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4 text-blue-900">Lançamento de Faltas Trimestrais</h2>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-100 border-b">
            <th className="p-2">Disciplina</th>
            <th className="p-2">1º Trimestre</th>
            <th className="p-2">2º Trimestre</th>
            <th className="p-2">3º Trimestre</th>
            <th className="p-2">Total de Faltas</th>
          </tr>
        </thead>
        <tbody>
          {frequencia.map((item, index) => {
            const total = item.faltas.faltas_t1 + item.faltas.faltas_t2 + item.faltas.faltas_t3;
            return (
              <tr key={item.disciplina} className="border-b">
                <td className="p-2 font-medium">{item.disciplina}</td>
                <td className="p-2">
                  <input
                    type="number"
                    min="0"
                    value={item.faltas.faltas_t1}
                    onChange={(e) => handleChange(index, "faltas_t1", e.target.value)}
                    className="w-16 p-1 border rounded text-center"
                  />
                </td>
                <td className="p-2">
                  <input
                    type="number"
                    min="0"
                    value={item.faltas.faltas_t2}
                    onChange={(e) => handleChange(index, "faltas_t2", e.target.value)}
                    className="w-16 p-1 border rounded text-center"
                  />
                </td>
                <td className="p-2">
                  <input
                    type="number"
                    min="0"
                    value={item.faltas.faltas_t3}
                    onChange={(e) => handleChange(index, "faltas_t3", e.target.value)}
                    className="w-16 p-1 border rounded text-center"
                  />
                </td>
                <td className="p-2 font-bold text-red-600">{total}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <button
        onClick={salvarFrequencia}
        className="mt-4 bg-blue-900 text-white px-4 py-2 rounded font-bold hover:bg-blue-800"
      >
        Salvar Frequência
      </button>
    </div>
  );
}