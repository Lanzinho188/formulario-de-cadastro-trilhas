// Auxiliares
let cadastro = false;
let dadosDoFormulario = null;

// Coleta os dados do formulário
function coletarDadosDoFormulario() {
    const campos = [
        'id', 'nome', 'cpf', 'dataDeNascimento', 'sexo',
        'cep', 'email', 'telefone', 'trilha', 'senha'
    ];

    const dados = {};
    campos.forEach(campo => {
        let valor = document.getElementById(campo).value;
        if (campo === 'id') valor = valor.replace(/[^0-9]/g, '');
        dados[campo] = valor;
    });
    dados.nascimento = dados.dataDeNascimento;
    delete dados.dataDeNascimento;

    return dados;
}

// Valida o CPF
function validarCPF(cpf) {
    cpf = cpf.replace(/[^\d]+/g, '');
    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

    const calcularDigito = (slice, pesoInicial) => {
        const soma = slice.split('').reduce((acc, num, i) => acc + num * (pesoInicial - i), 0);
        const resto = (soma * 10) % 11;
        return resto === 10 ? 0 : resto;
    };

    const digito1 = calcularDigito(cpf.slice(0, 9), 10);
    const digito2 = calcularDigito(cpf.slice(0, 10), 11);

    return digito1 === +cpf[9] && digito2 === +cpf[10];
}

// Envia os dados para o servidor
function enviarDadosParaAPI(dados) {
    fetch('http://localhost:3000/usuarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados)
    })
    .then(res => res.json())
    .then(data => console.log('Usuário salvo:', data))
    .catch(err => console.error('Erro ao salvar:', err));
}

// Mostra a mensagem de sucesso ou erro
function exibirOverlay(corDeFundo, imagem, mensagem) {
    const overlay = document.querySelector('.overlay');
    overlay.querySelector('.overlay__conteudo').style.background = corDeFundo;
    overlay.querySelector('.overlay__figura-imagem').src = imagem;
    overlay.querySelector('.overlay__conteudo__paragrafo').innerHTML = mensagem;
    overlay.classList.add('show');
}

// Aplica as máscaras nos campos
function adicionarMascara() {
    const mascaras = [
        { id: 'cpf', mask: '999.999.999-99' },
        { id: 'telefone', mask: '(99) 99999-9999' },
        { id: 'cep', mask: '99999-999' },
        { id: 'id', mask: '99999-99' },
    ];

    mascaras.forEach(({ id, mask }) => {
        const input = document.getElementById(id);
        if (input) Inputmask(mask).mask(input);
    });
}

// Verifica se a pessoa tem 16 anos ou mais
function validarDataDeNascimento() {
    const input = document.getElementById('dataDeNascimento');
    const nascimento = new Date(input.value);
    const hoje = new Date();

    if (nascimento > hoje) {
        alert('Insira uma data válida');
        input.value = '';
        return false;
    }

    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const mes = hoje.getMonth() - nascimento.getMonth();
    if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) idade--;

    if (idade < 16) {
        alert('Você precisa ter pelo menos 16 anos');
        input.value = '';
        return false;
    }

    return true;
}

// Inicia tudo quando a página carregar
function iniciarFormulario() {
    const formulario = document.getElementById('formulario');
    const botaoVoltar = document.getElementById('botaoVoltar');

    // Validação da data de nascimento
    document.getElementById('dataDeNascimento').addEventListener('change', validarDataDeNascimento);

    // Quando o usuário clicar em "Enviar"
    formulario.addEventListener('submit', (event) => {
        event.preventDefault();

        const dados = coletarDadosDoFormulario();
        const cpfValido = validarCPF(dados.cpf);

        if (!cpfValido) {
            exibirOverlay(
                '#B3261E',
                '/assets/images/img_emoji_pensando.png',
                'O CPF que você informou não é válido!'
            );
        } else {
            exibirOverlay(
                '#08AEA7',
                '/assets/images/img_emoji_feliz.png',
                `Parabéns, <span class="destaque__nome">${dados.nome}</span>! Sua inscrição foi realizada com sucesso.`
            );
            cadastro = true;
            dadosDoFormulario = dados;
        }
    });

    // Quando o usuário fecha a mensagem
    botaoVoltar.addEventListener('click', () => {
        document.querySelector('.overlay').classList.remove('show');
        if (cadastro) enviarDadosParaAPI(dadosDoFormulario);
    });

    adicionarMascara();

    // Tooltip dos ícones (se estiver usando ícones com balão explicativo)
    tippy('.info-icon', {
        theme: 'light',
        animation: 'scale',
        placement: 'right',
    });
}

document.addEventListener('DOMContentLoaded', iniciarFormulario);
