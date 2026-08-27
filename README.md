# 🏫 FIEL - Gestão Escolar

O **FIEL** é um sistema web integrado para gestão acadêmica e administrativa escolar, desenvolvido com uma arquitetura híbrida que combina uma interface dinâmica em React/TypeScript com um backend seguro em PHP e banco de dados MySQL.

---

## 🛠️ Tecnologias Utilizadas

![PHP](https://img.shields.io/badge/PHP-777BB4?style=for-the-badge&logo=php&logoColor=white)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-00000F?style=for-the-badge&logo=mysql&logoColor=white)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![Rust](https://img.shields.io/badge/rust-%23000000.svg?style=for-the-badge&logo=rust&logoColor=white)



---

## 📌 Funcionalidades

* **Autenticação e Sessões:** Controle de acesso seguro via PHP com proteção contra acessos não autorizados.
* **Consulta de Estudantes:** Busca avançada com filtros por matrícula, nome, turma e turno.
* **Dashboard Interativo:** Painel de controle responsivo desenvolvido em React e estilizado com Tailwind CSS.
* **Tratamento de Erros:** Páginas personalizadas e estruturadas para erros HTTP (404 Not Found e 500 Internal Server Error).
* **Automação de Análise :** Módulos em Python para processamento de dados de desempenho escolar e relatórios estatísticos.

---

## 📁 Estrutura do Projeto

```text
Projeto-Multidisciplinar/
├── analytics/         # Script em Python 
├── api-fiel-rust/     # Back-End Em Rust
├── assets/            # Logos, ícones e recursos visuais estáticos
├── dashboard/          # Bundles compilados pelo Vite (main.js, login.js)
├── error/              # Tela personalizada de Erro
├── includes/           # Páginas PHP do sistema (home.php,homeanon.php, etc.)
├── schemas/            # Banco de Dado de Exemplo   
├── script              #Codigos de Js, Que não são Compilado
├
├── src/                # Código-fonte React/TypeScript (App.tsx, main.tsx)
├
├── index.php           # Pagina Inicial 
├── login.php           # Tela de Login
├── logout.php          # Arquivo Php para Encerar Sessão 
├── .htaccess           # Configurações do servidor Apache e tratamento de erros
├── vite.config.ts      # Configuração de build do Vite
└── README.md           # Documentação do repositório
