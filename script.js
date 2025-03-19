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

document.getElementById('formulario').addEventListener('submit', function(event) {
    var cpf = document.getElementById('cpf').value;
    if (!validarCPF(cpf)) {
        alert("O CPF inserido não é válido");
        event.preventDefault();
        return;
    }

    alert('Inscrição realizada com sucesso');   
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