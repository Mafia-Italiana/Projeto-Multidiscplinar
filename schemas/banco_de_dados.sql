DROP TABLE IF EXISTS estudantes;

CREATE TABLE estudantes (
    matricula VARCHAR(20) PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    turma VARCHAR(50) NOT NULL,
    turno VARCHAR(20) DEFAULT 'Manhã',
    situacao ENUM('Ativo', 'Inativo', 'Pendente') DEFAULT 'Ativo',
    data_nascimento DATE,
    nome_responsavel VARCHAR(100),
    email VARCHAR(100),
    telefone VARCHAR(20)
);

INSERT INTO estudantes (matricula, nome, turma, turno, situacao, data_nascimento, nome_responsavel, email, telefone) VALUES
('20260601', 'Aluno Sexto Ano A', '6º Ano - Ensino Fundamental', 'Manhã', 'Ativo', '2014-02-10', 'Responsável Aluno 6A', 'aluno6a@aluno.lasalle.br', '(41) 98801-0001'),
('20260602', 'Aluno Sexto Ano B', '6º Ano - Ensino Fundamental', 'Manhã', 'Ativo', '2014-04-15', 'Responsável Aluno 6B', 'aluno6b@aluno.lasalle.br', '(41) 98801-0002'),
('20260603', 'Aluno Sexto Ano C', '6º Ano - Ensino Fundamental', 'Tarde', 'Ativo', '2014-06-20', 'Responsável Aluno 6C', 'aluno6c@aluno.lasalle.br', '(41) 98801-0003'),
('20260604', 'Aluno Sexto Ano D', '6º Ano - Ensino Fundamental', 'Tarde', 'Ativo', '2014-08-25', 'Responsável Aluno 6D', 'aluno6d@aluno.lasalle.br', '(41) 98801-0004'),
('20260701', 'Aluno Sétimo Ano A', '7º Ano - Ensino Fundamental', 'Manhã', 'Ativo', '2013-01-12', 'Responsável Aluno 7A', 'aluno7a@aluno.lasalle.br', '(41) 98802-0001'),
('20260702', 'Aluno Sétimo Ano B', '7º Ano - Ensino Fundamental', 'Manhã', 'Ativo', '2013-03-18', 'Responsável Aluno 7B', 'aluno7b@aluno.lasalle.br', '(41) 98802-0002'),
('20260703', 'Aluno Sétimo Ano C', '7º Ano - Ensino Fundamental', 'Manhã', 'Ativo', '2013-05-22', 'Responsável Aluno 7C', 'aluno7c@aluno.lasalle.br', '(41) 98802-0003'),
('20260704', 'Aluno Sétimo Ano D', '7º Ano - Ensino Fundamental', 'Tarde', 'Ativo', '2013-07-30', 'Responsável Aluno 7D', 'aluno7d@aluno.lasalle.br', '(41) 98802-0004'),
('20260801', 'Aluno Oitavo Ano A', '8º Ano - Ensino Fundamental', 'Manhã', 'Ativo', '2012-02-14', 'Responsável Aluno 8A', 'aluno8a@aluno.lasalle.br', '(41) 98803-0001'),
('20260802', 'Aluno Oitavo Ano B', '8º Ano - Ensino Fundamental', 'Manhã', 'Ativo', '2012-04-19', 'Responsável Aluno 8B', 'aluno8b@aluno.lasalle.br', '(41) 98803-0002'),
('20260803', 'Aluno Oitavo Ano C', '8º Ano - Ensino Fundamental', 'Manhã', 'Ativo', '2012-06-11', 'Responsável Aluno 8C', 'aluno8c@aluno.lasalle.br', '(41) 98803-0003'),
('20260804', 'Aluno Oitavo Ano D', '8º Ano - Ensino Fundamental', 'Manhã', 'Ativo', '2012-09-05', 'Responsável Aluno 8D', 'aluno8d@aluno.lasalle.br', '(41) 98803-0004'),
('20260901', 'Aluno Nono Ano A', '9º Ano - Ensino Fundamental', 'Manhã', 'Ativo', '2011-01-10', 'Responsável Aluno 9A', 'aluno9a@aluno.lasalle.br', '(41) 98804-0001'),
('20260902', 'Aluno Nono Ano B', '9º Ano - Ensino Fundamental', 'Manhã', 'Ativo', '2011-03-15', 'Responsável Aluno 9B', 'aluno9b@aluno.lasalle.br', '(41) 98804-0002'),
('20260903', 'Aluno Nono Ano C', '9º Ano - Ensino Fundamental', 'Manhã', 'Ativo', '2011-05-20', 'Responsável Aluno 9C', 'aluno9c@aluno.lasalle.br', '(41) 98804-0003'),
('20260904', 'Aluno Nono Ano D', '9º Ano - Ensino Fundamental', 'Tarde', 'Ativo', '2011-08-12', 'Responsável Aluno 9D', 'aluno9d@aluno.lasalle.br', '(41) 98804-0004'),
('20261101', 'Aluno Primeiro Médio A', '1º Ano - Ensino Médio', 'Manhã', 'Ativo', '2010-02-01', 'Responsável Aluno 1MA', 'aluno1ma@aluno.lasalle.br', '(41) 98805-0001'),
('20261102', 'Aluno Primeiro Médio B', '1º Ano - Ensino Médio', 'Manhã', 'Ativo', '2010-04-10', 'Responsável Aluno 1MB', 'aluno1mb@aluno.lasalle.br', '(41) 98805-0002'),
('20261103', 'Aluno Primeiro Médio C', '1º Ano - Ensino Médio', 'Manhã', 'Ativo', '2010-06-18', 'Responsável Aluno 1MC', 'aluno1mc@aluno.lasalle.br', '(41) 98805-0003'),
('20261104', 'Aluno Primeiro Médio D', '1º Ano - Ensino Médio', 'Noite', 'Ativo', '2010-08-22', 'Responsável Aluno 1MD', 'aluno1md@aluno.lasalle.br', '(41) 98805-0004'),
('20261105', 'Aluno Primeiro Médio E', '1º Ano - Ensino Médio', 'Noite', 'Ativo', '2010-10-05', 'Responsável Aluno 1ME', 'aluno1me@aluno.lasalle.br', '(41) 98805-0005'),
('20261106', 'Aluno Primeiro Médio F', '1º Ano - Ensino Médio', 'Noite', 'Ativo', '2010-12-12', 'Responsável Aluno 1MF', 'aluno1mf@aluno.lasalle.br', '(41) 98805-0006'),
('20261201', 'Aluno Segundo Médio A', '2º Ano - Ensino Médio', 'Manhã', 'Ativo', '2009-01-15', 'Responsável Aluno 2MA', 'aluno2ma@aluno.lasalle.br', '(41) 98806-0001'),
('20261202', 'Aluno Segundo Médio B', '2º Ano - Ensino Médio', 'Manhã', 'Ativo', '2009-03-20', 'Responsável Aluno 2MB', 'aluno2mb@aluno.lasalle.br', '(41) 98806-0002'),
('20261203', 'Aluno Segundo Médio C', '2º Ano - Ensino Médio', 'Manhã', 'Ativo', '2009-05-10', 'Responsável Aluno 2MC', 'aluno2mc@aluno.lasalle.br', '(41) 98806-0003'),
('20261204', 'Aluno Segundo Médio D', '2º Ano - Ensino Médio', 'Manhã', 'Ativo', '2009-07-04', 'Responsável Aluno 2MD', 'aluno2md@aluno.lasalle.br', '(41) 98806-0004'),
('20261205', 'Aluno Segundo Médio E', '2º Ano - Ensino Médio', 'Noite', 'Ativo', '2009-09-18', 'Responsável Aluno 2ME', 'aluno2me@aluno.lasalle.br', '(41) 98806-0005'),
('20261206', 'Aluno Segundo Médio F', '2º Ano - Ensino Médio', 'Noite', 'Ativo', '2009-10-30', 'Responsável Aluno 2MF', 'aluno2mf@aluno.lasalle.br', '(41) 98806-0006'),
('20261207', 'Aluno Segundo Médio G', '2º Ano - Ensino Médio', 'Noite', 'Ativo', '2009-11-12', 'Responsável Aluno 2MG', 'aluno2mg@aluno.lasalle.br', '(41) 98806-0007'),
('20261208', 'Aluno Segundo Médio G1', '2º Ano - Ensino Médio', 'Noite', 'Ativo', '2009-12-28', 'Responsável Aluno 2MH', 'aluno2mh@aluno.lasalle.br', '(41) 98806-0008'),
('20261301', 'Aluno Terceiro Médio A', '3º Ano - Ensino Médio', 'Manhã', 'Ativo', '2008-01-10', 'Responsável Aluno 3MA', 'aluno3ma@aluno.lasalle.br', '(41) 98807-0001'),
('20261302', 'Aluno Terceiro Médio B', '3º Ano - Ensino Médio', 'Manhã', 'Ativo', '2008-02-14', 'Responsável Aluno 3MB', 'aluno3mb@aluno.lasalle.br', '(41) 98807-0002'),
('20261303', 'Aluno Terceiro Médio C', '3º Ano - Ensino Médio', 'Manhã', 'Ativo', '2008-03-22', 'Responsável Aluno 3MC', 'aluno3mc@aluno.lasalle.br', '(41) 98807-0003'),
('20261304', 'Aluno Terceiro Médio D', '3º Ano - Ensino Médio', 'Manhã', 'Ativo', '2008-04-18', 'Responsável Aluno 3MD', 'aluno3md@aluno.lasalle.br', '(41) 98807-0004'),
('20261305', 'Aluno Terceiro Médio E', '3º Ano - Ensino Médio', 'Manhã', 'Ativo', '2008-05-30', 'Responsável Aluno 3ME', 'aluno3me@aluno.lasalle.br', '(41) 98807-0005'),
('20261306', 'Aluno Terceiro Médio F', '3º Ano - Ensino Médio', 'Manhã', 'Ativo', '2008-06-12', 'Responsável Aluno 3MF', 'aluno3mf@aluno.lasalle.br', '(41) 98807-0006'),
('20261307', 'Aluno Terceiro Médio G', '3º Ano - Ensino Médio', 'Noite', 'Ativo', '2008-08-08', 'Responsável Aluno 3MG', 'aluno3mg@aluno.lasalle.br', '(41) 98807-0007'),
('20261308', 'Aluno Terceiro Médio G1', '3º Ano - Ensino Médio', 'Noite', 'Ativo', '2008-09-19', 'Responsável Aluno 3MH', 'aluno3mh@aluno.lasalle.br', '(41) 98807-0008'),
('20261309', 'Aluno Terceiro Médio G2', '3º Ano - Ensino Médio', 'Noite', 'Ativo', '2008-10-25', 'Responsável Aluno 3MI', 'aluno3mi@aluno.lasalle.br', '(41) 98807-0009'),
('20261310', 'Aluno Terceiro Médio G3', '3º Ano - Ensino Médio', 'Noite', 'Ativo', '2008-11-11', 'Responsável Aluno 3MJ', 'aluno3mj@aluno.lasalle.br', '(41) 98807-0010');


DROP TABLE IF EXISTS usuarios;

CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario VARCHAR(50) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL
);

INSERT INTO usuarios (usuario, senha) VALUES ('adm', 'lasalle123');