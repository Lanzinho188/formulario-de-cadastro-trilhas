// Auxiliares
let cadastro = false;
let dadosDoFormulario = null;

// Função usada para coletar os dados do formulário
function coletarDadosDoFormulario() {
    // Cria uma lista de nomes que representam os id's dos inputs do html
    const listaDeId = [
        'id', 'nome', 'cpf', 'dataDeNascimento', 'sexo',
        'cep', 'email', 'telefone', 'trilha', 'senha'
    ];

    const dados = {};   // Cria um objeto vazio

    // Loop que passa por cada item na lista campos
    listaDeId.forEach(campoId => {
        // Obtém o valor do campo pelo id
        let valor = document.getElementById(campoId).value;
        // Verifica se é o campo do id
        if (campoId === 'id') {
            valor = valor.replace(/[^0-9]/g, ''); // Remove tudo que não for número
        }
        dados[campoId] = valor; // Guarda o valor do campo dentro do ojeto dados
    });

    return dados;   // Retorna o objeto dados com todos os valores preenchidos
}

// Função usada para validar o CPF
function validarCPF(cpf) {
    cpf = cpf.replace(/[^\d]+/g, '');   // Rejex que remove tudo que não é número

    // Verifica o tamanho do CPF e se todos os dígitos são iguais
    // /^(\d)\1{10}$/ Rejex que detecta números repetidos
    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf))
        return false;

    // Função que calcula um dígito verificador do CPF
    const calcularDigito = (slice, pesoInicial) => {
        // Cria uma array cortado e faz uma soma acumulada
        const soma = slice.split('').reduce((acc, num, i) => acc + num * (pesoInicial - i), 0);

        // Pefa o resto da operação 
        const resto = (soma * 10) % 11;

        // Retorna  oresto
        return resto === 10 ? 0 : resto;
    };

    // Chama a função para o primeiro dígito verificativo
    const digito1 = calcularDigito(cpf.slice(0, 9), 10);

    // Chama a função para o segundo dígito verificativo
    const digito2 = calcularDigito(cpf.slice(0, 10), 11);

    // Retorna o resulta para a verificação do cpf
    return digito1 === +cpf[9] && digito2 === +cpf[10];
}

// Função usada para enviar os dados para o servidor
function enviarDadosParaAPI(dados) {
    // Envia as informações para o seridor com a url especificada
    fetch('http://localhost:3000/usuarios', {
        method: 'POST', // Usado para enviar informações para o servidor
        headers: { 'Content-Type': 'application/json' },    // Informa o tipo de conteúdo para o servidor
        body: JSON.stringify(dados) // O corpo da mensagem será convertido para JSON
    })
    .then(response => {
        if (response.ok) {
            console.log('Dados enviados com sucesso!');
        } else {
            console.error('Erro ao enviar os dados.');
        }
    })
    .catch(error => {
        console.error('Erro na conexão com o servidor: ', error);
    });

    window.location.href = 'login.html';
}

// Função usada para mostrar o overlay na tela de cadastro
function exibirOverlay(corDeFundo, imagem, mensagem) {
    const overlay = document.querySelector('.overlay');
    overlay.querySelector('.overlay__conteudo').style.background = corDeFundo;
    overlay.querySelector('.overlay__figura-imagem').src = imagem;
    overlay.querySelector('.overlay__conteudo__paragrafo').innerHTML = mensagem;
    overlay.classList.add('show');
}

// Função usada para aplicar as máscaras nos campos
function adicionarMascara() {
    // Cria uma lista com várias máscaras
    const mascaras = [
        { id: 'cpf', mask: '999.999.999-99' },
        { id: 'telefone', mask: '(99) 99999-9999' },
        { id: 'cep', mask: '99999-999' },
        { id: 'id', mask: '99999-99' },
    ];

    // Para cada item da lista, adiciona a máscara
    mascaras.forEach(({ id, mask }) => {
        const input = document.getElementById(id);  // Pega o campo com o id atual
        if (input) Inputmask(mask).mask(input); // Verifica se o campo existe
    });
}

// Função usada para validar a data de nascimento
function validarDataDeNascimento() {
    const input = document.getElementById('dataDeNascimento');
    const nascimento = new Date(input.value);
    const hoje = new Date();

    // Verifica se o usuário veio do futuro, maior que a data atual
    if (nascimento > hoje) {
        alert('Insira uma data válida');
        input.value = '';
        return false;
    }

    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const mes = hoje.getMonth() - nascimento.getMonth();
    console.log(`Mes: ${mes}, idade: ${idade}`);

    // Verifica se o usuário já fez aniversário
    if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) idade--;

    // Verifica se o usuário tem 16 ano ou mais
    if (idade < 16) {
        alert('Você precisa ter pelo menos 16 anos');
        input.value = '';
        return false;
    }

    return true;
}

// Função usada para iniciar a interatividade do formulário
function iniciarFormulario() {
    const formulario = document.getElementById('formulario');
    const botaoVoltar = document.getElementById('botaoVoltar');
    const dataDeNascimento = document.getElementById('dataDeNascimento');

    // Validação da data de nascimento em tempo real
    dataDeNascimento.addEventListener('change', validarDataDeNascimento);

    // Executa quando o usuário clicar em "Fazer inscrição"
    formulario.addEventListener('submit', (event) => {
        event.preventDefault(); // Evita o carregamento automático da página
        const dados = coletarDadosDoFormulario();   // Obtém os dados do formulário
        const cpfValido = validarCPF(dados.cpf);    // Verifica se o cpf é válido

        // Se o cpf não for válido
        if (!cpfValido) {
            // Exibe a pop-up de erro
            exibirOverlay(
                '#B3261E',
                './/assets/images/img_emoji_pensando.png',
                'O CPF que você informou não é válido!'
            );
        } else {    // Se o cpf for válido
            // Exibe a pop-up de sucesso
            exibirOverlay(
                '#08AEA7',
                './/assets/images/img_emoji_feliz.png',
                `Parabéns, <span class="destaque__nome">${dados.nome}</span>! Sua inscrição foi realizada com sucesso.`
            );
            cadastro = true;
            dadosDoFormulario = dados;
        }
    });

    // Executa quando o usuário fecha a pop-up
    botaoVoltar.addEventListener('click', () => {
        document.querySelector('.overlay').classList.remove('show');
        if (cadastro) enviarDadosParaAPI(dadosDoFormulario);    // Verifica se pode enviar os dados
    });

    adicionarMascara(); // Chama a função para adicionar as máscaras

    // Tooltip dos ícones com balão explicativo
    tippy('.info-icon', {
        theme: 'light',
        animation: 'scale',
        placement: 'right',
    });
}

// Executa quando a página for carregada
document.addEventListener('DOMContentLoaded', iniciarFormulario);
