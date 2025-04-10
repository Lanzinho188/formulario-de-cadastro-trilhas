// Seletor dos botões
const botaoLogin = document.getElementById('botaoLogin');
const botaoCadastrar = document.getElementById('botaoCadastrar');
const campoId = document.getElementById('id');
const campoSenha = document.getElementById('senha');

// Função usada para adicionar máscara no campo do ID
function adicionarMascara() {
   if (campoId) {
      Inputmask('99999-99').mask(campoId);
   }
}

// Função que ativa ou desativa o botão de login
function verificarCampos() {
   const idPreenchido = campoId.value.trim() !== '';
   const senhaPreenchida = campoSenha.value.trim() !== '';

   botaoLogin.disabled = !(idPreenchido && senhaPreenchida);
}

// Adiciona escuta para quando o usuário digitar nos campos
campoId.addEventListener('input', verificarCampos);
campoSenha.addEventListener('input', verificarCampos);

// Desativa o botão ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
   botaoLogin.disabled = true;
   adicionarMascara();
});

// Ação ao clicar no botão de login
botaoLogin.addEventListener('click', () => {
   const inputId = campoId.value;
   const senha = campoSenha.value;
   const id = inputId.replace(/[^0-9]/g, '');

   fetch('https://form-server-bygtaoz8t-lanzinho188s-projects.vercel.app/login', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ id, senha })
   })
   .then(res => res.json())
   .then(data => {
      if (data.message === 'Login realizado com sucesso!') {
         localStorage.setItem('usuario', data.usuario.id);   // Salva o id temporariamente
         window.location.href = 'home.html';
      } else {
         alert('Usuário não encontrado');
      }
   })
   .catch(err => {
      console.error('Erro:', err);
      alert('Erro na conexão com o servidor');
   });
});

// Ação ao clicar no botão de cadastro
botaoCadastrar.addEventListener('click', () => {
   window.location.href = 'cadastro.html';
});
