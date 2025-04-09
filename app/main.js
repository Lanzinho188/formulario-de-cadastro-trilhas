// Seletores
const formulario = document.getElementById('formulario');
const overlay = document.querySelector('.overlay');
const overlayConteudo = overlay.querySelector('.overlay__conteudo');
const figura = overlay.querySelector('.overlay__figura-imagem');
const paragrafoOverlay = overlay.querySelector('.overlay__conteudo__paragrafo');
const botaoVoltar = document.getElementById('botaoVoltar');
const inputSenha = document.getElementById('senha');
const inputDataDeNascimento = document.getElementById('dataDeNascimento');

let enviarFormulario = false;

// Valida CPF
function validarCPF(cpf) {
    cpf = cpf.replace(/[^\d]+/g, '');

    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

    const calcularDigito = (slice, pesoInicial) => {
        const soma = slice
            .split('')
            .reduce((acc, num, i) => acc + num * (pesoInicial - i), 0);

        const resto = (soma * 10) % 11;
        return resto === 10 ? 0 : resto;
    };

    const digito1 = calcularDigito(cpf.slice(0, 9), 10);
    const digito2 = calcularDigito(cpf.slice(0, 10), 11);

    return digito1 === +cpf[9] && digito2 === +cpf[10];
}

// Valida data de nascimento
inputDataDeNascimento.addEventListener('change', () => {
    const valor = inputDataDeNascimento.value;
    if (!valor) return;

    const nascimento = new Date(valor);
    const hoje = new Date();

    if (nascimento > hoje) {
        alert('Insira uma data válida');
        inputDataDeNascimento.value = '';
        return;
    }

    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const mes = hoje.getMonth() - nascimento.getMonth();

    if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
        idade--;
    }

    if (idade < 16) {
        alert('Você não pode participar do trilhas!\nVocê tem menos de 16 anos');
        inputDataDeNascimento.value = '';
        return;
    }

    console.log(`✅ Data válida! Idade: ${idade}`);
});

// Envio do formulário
formulario.addEventListener('submit', (event) => {
    event.preventDefault();

    const nome = document.getElementById('nome').value.trim();
    const cpf = document.getElementById('cpf').value;

    if (!validarCPF(cpf)) {
        exibirOverlay(
            '#B3261E',
            '/assets/images/img_emoji_pensando.png',
            'O CPF que você informou não é válido!'
        );
        enviarFormulario = false;
    } else {
        exibirOverlay(
            '#08AEA7',
            '/assets/images/img_emoji_feliz.png',
            `Parabéns, <span class="destaque__nome">${nome}</span>! Sua inscrição foi realizada com sucesso`
        );
        enviarFormulario = true;
    }
});

// Função para exibir overlay com conteúdo dinâmico
function exibirOverlay(corDeFundo, imagem, mensagem) {
    overlayConteudo.style.background = corDeFundo;
    figura.src = imagem;
    paragrafoOverlay.innerHTML = mensagem;
    overlay.classList.add('show');
}

// Botão de voltar
botaoVoltar.addEventListener('click', () => {
    overlay.classList.remove('show');
    if (enviarFormulario) formulario.submit();
});

// Máscaras nos inputs
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

// Inicialização geral
document.addEventListener('DOMContentLoaded', () => {
    adicionarMascara();

    tippy('.info-icon', {
        theme: 'light',
        animation: 'scale',
        placement: 'right',
    });
});
