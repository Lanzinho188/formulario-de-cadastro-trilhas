// Importando as bibliotecas
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();  // Instanciando o express
const PORT = process.env.PORT || 3000;      // Definindo a constante para a porta de escuta

// Conectando com banco SQLite3
const db = new sqlite3.Database('banco.db');

// Middleware
app.use(cors());  // Libera a conexão do front-end com o back-end
app.use(bodyParser.json());   // 

// Cria uma tabela de usuários se não existir
db.run(`
   CREATE TABLE IF NOT EXISTS usuarios (
      id TEXT,
      nome TEXT,
      cpf TEXT PRIMARY KEY,
      nascimento TEXT,
      sexo TEXT,
      cep TEXT,
      email TEXT,
      telefone TEXT,
      trilha TEXT,
      senha TEXT
   )
`);

// Rota POST para cadastrar usuário
app.post('/usuarios', (req, res) => {
   // Pega os dados que do corpo da requisição e adiciona em variáveis
   const {id, nome, cpf, dataDeNascimento, sexo, cep, email, telefone, trilha, senha } = req.body;

   // Prepara o comando sql para inserir novos usuários na ta tabela
   const comandoSql = `
      INSERT INTO usuarios (id, nome, cpf, nascimento, sexo, cep, email, telefone, trilha, senha)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
   `;

   // Executa o comando e insere os dados do formulário no lugar dos ?
   db.run(comandoSql, [id, nome, cpf, dataDeNascimento, sexo, cep, email, telefone, trilha, senha], function(err) {
      // Caso haja algum erro, será mostrado uma mensagem de erro
      if (err) {
         // 500 Internal Server Error
         return res.status(500).json({ error: err.message });
      }

      // Cajo não haja problemas, será mostrado uma mensagem de sucesso
      // 201 Created successful
      res.status(201).json({
         message: 'Usuário cadastrado com sucesso!',
         id: this.lastID
      });
   });
});

// Rota GET para listar todos os usuários cadastrados
app.get('/usuarios', (req, res) => {
   db.all('SELECT * FROM usuarios', [], (err, rows) => {
      if (err) {
         return res.status(500).json({ error: err.message });
      }
      res.json(rows);
   });
});

// Rota GET par buscar um usuário específico pelo id
app.get('/usuarios/:id', (req, res) => {
   const id = req.params.id;  // Pega o valor que veio da URL

   // Busca o registro pelo id na tabela
   db.get('SELECT * FROM usuarios WHERE id = ?', [id], (err, row) => {
      // Caso haja erro, será mostrado uma mensagem de erro 
      if (err) {
         return res.status(500).json({ error: err.message });
      }

      // Caso não encontre o id do usuário
      if (!row) {
         return res.status(404).json({ message: 'Usuário não encontrado' });
      }

      // Retorna a linha encontrada no formato JSON
      res.json(row);
   });

});

// Inicia o servidor
app.listen(PORT, () => {
   console.log(`Servidor rodando em http://localhost:${PORT}`);
});
