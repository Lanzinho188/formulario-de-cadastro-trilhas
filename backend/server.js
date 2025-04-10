// Importando as bibliotecas
const express = require("express");
const { createClient } = require("@supabase/supabase-js");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express(); // Instanciando o express
const PORT = process.env.PORT || 3000; // Definindo a constante para a porta de escuta

// Middleware
app.use(cors()); // Libera a conexão do front-end com o back-end
app.use(bodyParser.json()); //

// Conectando supabase
const supabaseUrl = "https://kyllrhtmruhglxukfsot.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt5bGxyaHRtcnVoZ2x4dWtmc290Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQzMTA4MzcsImV4cCI6MjA1OTg4NjgzN30.4AHfEfVuCXbhPQOuzYRCPwLWru0E0-7NlAipdZ-x9II";
const supabase = createClient(supabaseUrl, supabaseKey);

// Rota POST para cadastrar usuário
app.post("/usuarios", async (req, res) => {
  const {
   id,
   nome,
   cpf,
   dataDeNascimento,
   sexo,
   cep,
   email,
   telefone,
   trilha,
   senha,
  } = req.body;

  const { error } = await supabase
    .from("usuarios")
    .insert([
      {
        id,
        nome,
        cpf,
        dataDeNascimento,
        sexo,
        cep,
        email,
        telefone,
        trilha,
        senha,
      },
    ]);

  if (error) {
      return res.status(500).json({ error: error.message });
  }

  res.status(201).json({ message: "Usuário cadastrado com sucesso!" });
});

// Rota POST para fazer login
app.post("/login", async (req, res) => {
  const { id, senha } = req.body;

  const { data, error } = await supabase
    .from("usuarios")
    .select("*")
    .eq("id", id)
    .eq("senha", senha)
    .single();

  if (error || !data) {
    return res.status(401).json({ message: "ID ou senha incorretos" });
  }

  res.status(200).json({
    message: "Login realizado com sucesso!",
    usuario: data,
  });
});

// Rota GET para listar todos os usuários cadastrados
app.get("/usuarios", async (req, res) => {
  const { data, error } = await supabase.from("usuarios").select("*");
  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json(data);
});

// Rota GET para buscar um usuário específico pelo id
app.get("/usuarios/:id", async (req, res) => {
  const { id } = req.params; // Pega o valor que veio da URL

  const { data, error } = await supabase
    .from("usuarios")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    return res.status(404).json({ message: "Usuário não encontrado" });
  }

  res.json(data);
});

// Rota DELETE para apagar usuários pelo CPF
app.delete("/usuarios/:cpf", async (req, res) => {
  const { cpf } = req.params;

  const { error, data } = await supabase
    .from("usuarios")
    .delete()
    .eq("cpf", cpf)
    .select();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  if (data.length === 0) {
    return res.status(404).json({ message: "Usuário não encontrado" });
  }

  res.status(200).json({ message: "Usuário deletado com sucesso!" });
});

module.exports = app;
