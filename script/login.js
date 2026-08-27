 async function fazerLogin(event) {
      event.preventDefault();
      
      const usuario = document.getElementById('usuario').value.trim();
      const senha = document.getElementById('senha').value.trim();
      const msgErro = document.getElementById('msgErro');

      msgErro.classList.add('hidden');

      try {
        const response = await fetch('http://127.0.0.1:3000/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ usuario, senha })
        });

        const data = await response.json();

        if (data.sucesso) {
          localStorage.setItem('fiel_token', data.token);
          window.location.href = 'includes/home.php';
        } else {
          msgErro.innerText = data.mensagem || 'Usuário ou senha incorretos!';
          msgErro.classList.remove('hidden');
        }
      } catch (err) {
        msgErro.innerText = 'Erro ao conectar à API em Rust. Verifique se o servidor está ativo.';
        msgErro.classList.remove('hidden');
      }
    }