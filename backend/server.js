// Importando as bibliotecas
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();  // Instanciando a biblioteca express
const PORT = 3000;      // Definindo a constante para a porta de escuta

// Conectando com banco SQLite
const db = new sqlite3.Database('banco.db');

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Cria a tabela se não existir (corrigido: IF NOT EXISTS e vírgula faltando)
db.run(`
   CREATE TABLE IF NOT EXISTS usuarios (
      id TEXT PRIMARY KEY,
      nome TEXT,
      cpf TEXT,
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
   const {id , nome, cpf, nascimento, sexo, cep, email, telefone, trilha, senha } = req.body;

   const comandoSql = `
      INSERT INTO usuarios (id, nome, cpf, nascimento, sexo, cep, email, telefone, trilha, senha)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
   `;

   db.run(comandoSql, [id, nome, cpf, nascimento, sexo, cep, email, telefone, trilha, senha], function(err) {
      if (err) {
         return res.status(500).json({ error: err.message });
      }

      res.status(201).json({
         message: 'Usuário cadastrado com sucesso!',
         id: this.lastID
      });
   });
});

// Rota GET para listar os usuários cadastrados
app.get('/usuarios', (req, res) => {
   db.all('SELECT * FROM usuarios', [], (err, rows) => {
      if (err) {
         return res.status(500).json({ error: err.message });
      }

      res.json(rows);
   });
});

// Inicia o servidor
app.listen(PORT, () => {
   console.log(`Servidor rodando em http://localhost:${PORT}`);
});
