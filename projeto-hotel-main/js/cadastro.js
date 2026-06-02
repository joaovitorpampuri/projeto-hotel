document.getElementById("cep").addEventListener("input", function () {

    let valor = this.value.replace(/\D/g, "");

    valor = valor.replace(/^(\d{5})(\d)/, "$1-$2");

    this.value = valor;
});

document.getElementById("cep").addEventListener("blur", buscarCEP);

function buscarCEP() {

    let cep = document.getElementById("cep").value;

    cep = cep.replace(/\D/g, "");

    if (cep.length !== 8) {
        alert("CEP inválido.");
        return;
    }

    fetch(`https://viacep.com.br/ws/${cep}/json/`)
        .then(response => response.json())
        .then(dados => {

            if (dados.erro) {
                alert("CEP não encontrado.");
                return;
            }

            document.getElementById("logradouro").value = dados.logradouro;
            document.getElementById("bairro").value = dados.bairro;
            document.getElementById("cidade").value = dados.localidade;
            document.getElementById("estado").value = dados.uf;

        })
        .catch(() => {
            alert("Erro ao consultar o CEP.");
        });
}

// Máscara CPF
document.getElementById("cpf").addEventListener("input", function () {

    let valor = this.value.replace(/\D/g, "");

    valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
    valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
    valor = valor.replace(/(\d{3})(\d{1,2})$/, "$1-$2");

    this.value = valor;
});

// Máscara Telefone
document.getElementById("telefone").addEventListener("input", function () {

    let valor = this.value.replace(/\D/g, "");

    valor = valor.replace(/^(\d{2})(\d)/g, "($1) $2");
    valor = valor.replace(/(\d{5})(\d)/, "$1-$2");

    this.value = valor;
});


// Validação CPF
function validarCPF(cpf) {

    cpf = cpf.replace(/\D/g, "");

    if (cpf.length !== 11) return false;

    if (/^(\d)\1+$/.test(cpf)) return false;

    let soma = 0;

    for (let i = 0; i < 9; i++) {
        soma += parseInt(cpf.charAt(i)) * (10 - i);
    }

    let resto = (soma * 10) % 11;

    if (resto === 10 || resto === 11) resto = 0;

    if (resto !== parseInt(cpf.charAt(9))) return false;

    soma = 0;

    for (let i = 0; i < 10; i++) {
        soma += parseInt(cpf.charAt(i)) * (11 - i);
    }

    resto = (soma * 10) % 11;

    if (resto === 10 || resto === 11) resto = 0;

    return resto === parseInt(cpf.charAt(10));
}


// Cadastro
function cadastrar() {

    const nome = document.getElementById("nome").value.trim();
    const email = document.getElementById("email").value.trim();
    const telefone = document.getElementById("telefone").value.trim();
    const cpf = document.getElementById("cpf").value.trim();
    const senha = document.getElementById("senha").value;
    const confirmarSenha = document.getElementById("confirmar-senha").value;

    if (!validarCPF(cpf)) {
        alert("CPF inválido.");
        return;
    }

    if (senha !== confirmarSenha) {
        alert("As senhas não coincidem.");
        return;
    }

    const usuario = {
        nome,
        email,
        telefone,
        cpf,
        senha
    };

    localStorage.setItem("hotelUser", JSON.stringify(usuario));

    alert("Cadastro realizado com sucesso!");

    window.location.href = "../hotel.index.html";
}