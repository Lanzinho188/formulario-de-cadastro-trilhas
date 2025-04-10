// Seletores
const usuarioId = localStorage.getItem('usuario');
const botaoVoltar = document.querySelector('.botaoVoltar');

// Verifica se o usuário tá logado
if (!usuarioId) {
   alert('Usuário não logado');
   window.location.href = 'login.html';
}

// Busca os dados no servidor
fetch(`http://localhost:3000/usuarios/${usuarioId}`)
   .then(res => {
      if (!res.ok) throw new Error('Erro ao buscar o usuário');
      return res.json();
   })
   .then(usuario => {
      const dados = [
         {titulo: 'Nome Completo', valor: usuario.nome},
         {titulo: 'CPF', valor: usuario.cpf},
         {titulo: 'Data de Nascimento', valor: usuario.dataDeNascimento},
         {titulo: 'Sexo', valor: usuario.sexo},
         {titulo: 'CEP', valor: usuario.cep},
         {titulo: 'Email', valor: usuario.email},
         {titulo: 'Telefone', valor: usuario.telefone},
         {titulo: 'Trilha Escolhida', valor: usuario.trilha},
      ];

      const gridCards = document.querySelector('.grid-cards');
      gridCards.innerHTML = '';

      dados.forEach(item => {
         const card = document.createElement('div');
         card.className = 'card';
         card.innerHTML = `<h3>${item.titulo}</h3><p>${item.valor}</p>`;
         gridCards.appendChild(card);
      });
   })
   .catch(err => {
      console.error(err);
      alert('Erro ao carregar os dados do usuário');
   });

botaoVoltar.addEventListener('click', () => {
   window.location.href = 'index.html';
});