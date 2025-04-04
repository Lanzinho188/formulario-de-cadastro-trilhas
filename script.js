const formulario = document.getElementById('formulario');
const overlayConteudo = document.querySelector('.overlay__conteudo');
const figura = document.querySelector('.overlay__figura-imagem');
const paragrafoOverlay = document.querySelector('.overlay__conteudo__paragrafo');
const overlay = document.querySelector('.overlay');
const botaoVoltar = document.getElementById('botaoVoltar');
let enviarFormulario = false;

// Função usada para validar cpf
function validarCPF(cpf) {
    cpf = cpf.replace(/[^\d]+/g, '') // Remove todos os caracteres não numéricos

    // Verifica se o CPF tem 11 dígitos
    if (cpf.length != 11) {
        return false;
    }

    // Verifica se todos os dígitos do CPF são iguais
    if (/^(\d)\1{10}$/.test(cpf)) {
        return false;
    }

    // Validação do primeiro dígito verificador
    let soma = 0;
    let multiplicador = 10;

    for (let i = 0; i < 9; i++) {
        soma += parseInt(cpf.charAt(i)) * multiplicador--;
    }

    let resto = (soma * 10) % 11;
    if (resto == 10 || resto == 11) {
        resto = 0;
    }
    if (resto !== parseInt(cpf.charAt(9))) {
        return false;
    }

    // Validação do segundo dígito verificador
    soma = 0;
    multiplicador = 11;
    for (let i = 0; i < 10; i++) {
        soma += parseInt(cpf.charAt(i)) * multiplicador--;
    }

    resto = (soma * 10) % 11;
    if (resto == 10 || resto == 11) {
        resto = 0;
    }
    
    if (resto != parseInt(cpf.charAt(10))) {
        return false;
    }

    return true;
}

formulario.addEventListener('submit', function(event) {
    event.preventDefault();

    var nome = document.getElementById('nome').value;
    var cpf = document.getElementById('cpf').value;
    if (!validarCPF(cpf)) {
        overlayConteudo.style.background = '#B3261E';
        figura.setAttribute('src', '/assets/images/emoji_pensando.png');
        paragrafoOverlay.innerHTML = 'O cpf que você informou não é válido!';
        overlay.classList.add('show');
        enviarFormulario = false;
    } else {
        overlayConteudo.style.background = '#08AEA7';
        figura.setAttribute('src', '/assets/images/emoji_feliz.png');
        paragrafoOverlay.innerHTML = `Parabéns, <span class="destaque__nome">${nome}</span>! Sua inscrição foi realizada com sucesso`;
        enviarFormulario = true;
    }

    overlay.classList.add('show');
});

botaoVoltar.addEventListener('click', function() {
    overlay.classList.remove('show');

    if (enviarFormulario) {
        formulario.submit();
    }
});

// Função para aplicar a máscara
function adicionarMascara() {
    var cpfInput = document.getElementById("cpf");
    var telefoneInput = document.getElementById("telefone");
    var cepInput = document.getElementById("cep");

    if (cpfInput) {
        Inputmask("999.999.999-99").mask(cpfInput);
    }

    if (telefoneInput) {
        Inputmask("(99) 99999-9999").mask(telefoneInput);
    }

    if (cepInput) {
        Inputmask("99999-999").mask(cepInput);
    }

}


document.addEventListener("DOMContentLoaded", adicionarMascara);