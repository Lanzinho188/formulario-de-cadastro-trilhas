// Importando bibliotecas necessárias
const express = require("express"); // Framework que ajuda a criar o servidor
const cors = require("cors"); // Permite que o front-end e o back-end conversem mesmo se estiverem em lugares diferentes
const { createClient } = require("@supabase/supabase-js"); // Cliente do Supabase para conectar com o banco de dados
const bodyParser = require("body-parser"); // Converte os dados que chegam em JSON

const app = express(); // Cria o servidor usando o Express
const PORT = process.env.PORT || 3000; // Porta onde o servidor vai "escutar"

// Permite que o front-end acesse o back-end (libera o CORS)
app.use(cors());

// Permite ler os dados enviados em formato JSON
app.use(bodyParser.json());

// Conectando com o banco de dados do Supabase
const supabaseUrl = "https://kyllrhtmruhglxukfsot.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt5bGxyaHRtcnVoZ2x4dWtmc290Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQzMTA4MzcsImV4cCI6MjA1OTg4NjgzN30.4AHfEfVuCXbhPQOuzYRCPwLWru0E0-7NlAipdZ-x9II";
const supabase = createClient(supabaseUrl, supabaseKey);

// ROTAS DA APLICAÇÃO

// ROTA PARA CADASTRAR USUÁRIO
app.post("/usuarios", async (req, res) => {
  // Pegando todos os dados enviados pelo formulário
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

  // Inserindo os dados no banco de dados Supabase
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

  // Se der erro, responde com erro
  if (error) {
    return res.status(500).json({ error: error.message });
  }

  // Se tudo der certo, responde com sucesso
  res.status(201).json({ message: "Usuário cadastrado com sucesso!" });
});


// ROTA DE LOGIN
app.post("/login", async (req, res) => {
  // Pegando o ID e a senha enviados pelo usuário
  const { id, senha } = req.body;

  // Buscando o usuário no banco de dados que tem o mesmo id e senha
  const { data, error } = await supabase
    .from("usuarios")
    .select("*")
    .eq("id", id)
    .eq("senha", senha)
    .single(); // Espera apenas um resultado

  // Se não encontrar ou tiver erro, retorna erro
  if (error || !data) {
    return res.status(401).json({ message: "ID ou senha incorretos" });
  }

  // Se achou o usuário, retorna sucesso e os dados do usuário
  res.status(200).json({
    message: "Login realizado com sucesso!",
    usuario: data,
  });
});

// ROTA PARA LISTAR TODOS OS USUÁRIOS CADASTRADOS
app.get("/usuarios", async (req, res) => {
  // Pega todos os usuários do banco de dados
  const { data, error } = await supabase.from("usuarios").select("*");

  // Se der erro, mostra mensagem
  if (error) {
    return res.status(500).json({ error: error.message });
  }

  // Retorna os dados dos usuários
  res.json(data);
});


// ROTA PARA PEGAR UM USUÁRIO ESPECÍFICO PELO ID
app.get("/usuarios/:id", async (req, res) => {
  const { id } = req.params; // Pega o id que veio pela URL

  // Busca o usuário com o ID informado
  const { data, error } = await supabase
    .from("usuarios")
    .select("*")
    .eq("id", id)
    .single();

  // Se não encontrar, responde com erro
  if (error || !data) {
    return res.status(404).json({ message: "Usuário não encontrado" });
  }

  // Se encontrou, retorna os dados do usuário
  res.json(data);
});


// ROTA PARA DELETAR UM USUÁRIO PELO CPF
app.delete("/usuarios/:cpf", async (req, res) => {
  const { cpf } = req.params;

  // Tenta deletar o usuário com o CPF informado
  const { error, data } = await supabase
    .from("usuarios")
    .delete()
    .eq("cpf", cpf)
    .select();

  // Se der erro na exclusão, responde com erro
  if (error) {
    return res.status(500).json({ error: error.message });
  }

  // Se não encontrou nenhum usuário para deletar
  if (data.length === 0) {
    return res.status(404).json({ message: "Usuário não encontrado" });
  }

  // Se deletou com sucesso
  res.status(200).json({ message: "Usuário deletado com sucesso!" });
});

// Exportando o app para ser usado no arquivo principal
module.exports = app;
