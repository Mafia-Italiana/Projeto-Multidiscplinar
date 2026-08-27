async function buscarNotas() {
  const input = document.getElementById('inputMatricula');
  const matricula = input.value.trim();
  const msgErro = document.getElementById('msgErro');
  const resultado = document.getElementById('resultado');

  msgErro.classList.add('hidden');
  resultado.classList.add('hidden');

  if (!matricula) {
    msgErro.innerText = 'Por favor, informe a matrícula.';
    msgErro.classList.remove('hidden');
    return;
  }

  try {
    const res = await fetch(`http://127.0.0.1:3000/api/consulta-anonima?matricula=${encodeURIComponent(matricula)}`);
    const data = await res.json();

    if (!data.sucesso) {
      msgErro.innerText = data.mensagem || 'Estudante não encontrado.';
      msgErro.classList.remove('hidden');
      return;
    }


    document.getElementById('lblNome').innerText = data.aluno.nome;
    document.getElementById('lblTurma').innerText = data.aluno.turma;

    const tbody = document.getElementById('tabelaCorpo');
    tbody.innerHTML = '';

    if (!data.notas || data.notas.length === 0) {
      tbody.innerHTML = `<tr><td colspan="5" class="p-4 text-center text-slate-500">Nenhuma nota cadastrada.</td></tr>`;
    } else {
      data.notas.forEach(item => {
        const tr = document.createElement('tr');
        tr.className = "hover:bg-slate-50 transition-colors";
        tr.innerHTML = `
          <td class="p-3 font-semibold text-slate-800">${item.disciplina}</td>
          <td class="p-3 text-center text-slate-700 font-medium">${Number(item.trimestre1).toFixed(1)}</td>
          <td class="p-3 text-center text-slate-700 font-medium">${Number(item.trimestre2).toFixed(1)}</td>
          <td class="p-3 text-center text-slate-700 font-medium">${Number(item.trimestre3).toFixed(1)}</td>
          <td class="p-3 text-center font-bold ${item.media >= 6.0 ? 'text-green-600' : 'text-red-600'}">${Number(item.media).toFixed(1)}</td>
        `;
        tbody.appendChild(tr);
      });
    }

    resultado.classList.remove('hidden');

  } catch (err) {
    console.error(err);
    msgErro.innerText = 'Erro ao conectar à API em Rust. Verifique se ela está rodando no terminal.';
    msgErro.classList.remove('hidden');
  }
}