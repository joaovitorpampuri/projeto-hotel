/* ─── ALTERNAR ABAS ─── */
function mostrarPainel(qual) {
    document.getElementById("painel-login").classList.remove("ativo");
    document.getElementById("painel-cadastro").classList.remove("ativo");
    document.getElementById("aba-login").classList.remove("ativa");
    document.getElementById("aba-cadastro").classList.remove("ativa");

    document.getElementById("painel-" + qual).classList.add("ativo");
    document.getElementById("aba-" + qual).classList.add("ativa");
}

/* ─── MÁSCARAS ─── */
document.getElementById("cep").addEventListener("input", function () {
    let v = this.value.replace(/\D/g, "");
    v = v.replace(/^(\d{5})(\d)/, "$1-$2");
    this.value = v;
});

document.getElementById("cep").addEventListener("blur", buscarCEP);

document.getElementById("cpf").addEventListener("input", function () {
    let v = this.value.replace(/\D/g, "");
    v = v.replace(/(\d{3})(\d)/, "$1.$2");
    v = v.replace(/(\d{3})(\d)/, "$1.$2");
    v = v.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    this.value = v;
});

document.getElementById("telefone").addEventListener("input", function () {
    let v = this.value.replace(/\D/g, "");
    v = v.replace(/^(\d{2})(\d)/g, "($1) $2");
    v = v.replace(/(\d{5})(\d)/, "$1-$2");
    this.value = v;
});

/* ─── BUSCA CEP ─── */
function buscarCEP() {
    let cep = document.getElementById("cep").value.replace(/\D/g, "");
    if (cep.length !== 8) { alert("CEP inválido."); return; }
    fetch(`https://viacep.com.br/ws/${cep}/json/`)
        .then(r => r.json())
        .then(d => {
            if (d.erro) { alert("CEP não encontrado."); return; }
            document.getElementById("logradouro").value = d.logradouro;
            document.getElementById("bairro").value     = d.bairro;
            document.getElementById("cidade").value     = d.localidade;
            document.getElementById("estado").value     = d.uf;
        })
        .catch(() => alert("Erro ao consultar o CEP."));
}

/* ─── VALIDAÇÃO CPF ─── */
function validarCPF(cpf) {
    cpf = cpf.replace(/\D/g, "");
    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;
    let soma = 0;
    for (let i = 0; i < 9; i++) soma += parseInt(cpf[i]) * (10 - i);
    let r = (soma * 10) % 11;
    if (r === 10 || r === 11) r = 0;
    if (r !== parseInt(cpf[9])) return false;
    soma = 0;
    for (let i = 0; i < 10; i++) soma += parseInt(cpf[i]) * (11 - i);
    r = (soma * 10) % 11;
    if (r === 10 || r === 11) r = 0;
    return r === parseInt(cpf[10]);
}

/* ─── HASH SHA-256 ─── */
async function gerarHash(senha) {
    const enc = new TextEncoder();
    const buf = await crypto.subtle.digest("SHA-256", enc.encode(senha));
    return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join("");
}

/* ─── LOGIN ─── */
async function fazerLogin() {
    const email  = document.getElementById("login-email").value.trim();
    const senha  = document.getElementById("login-senha").value;
    const erroEl = document.getElementById("erro-login");
    erroEl.style.display = "none";

    const raw = localStorage.getItem("hotelUser");
    if (!raw) {
        mostrarPainel("cadastro");
        alert("Nenhuma conta encontrada. Por favor, faça seu cadastro primeiro.");
        return;
    }

    const usuario      = JSON.parse(raw);
    const hashDigitado = await gerarHash(senha);

    if (usuario.email !== email || usuario.senha !== hashDigitado) {
        erroEl.style.display = "block";
        erroEl.textContent   = "E-mail ou senha incorretos.";
        return;
    }

    sessionStorage.setItem("hotelLogado", "true");
    window.location.href = "../hotel.index.html";
}

/* ─── CADASTRO ─── */
async function cadastrar() {
    const nome           = document.getElementById("nome").value.trim();
    const email          = document.getElementById("email").value.trim();
    const telefone       = document.getElementById("telefone").value.trim();
    const cpf            = document.getElementById("cpf").value.trim();
    const senha          = document.getElementById("senha").value;
    const confirmarSenha = document.getElementById("confirmar-senha").value;

    if (!validarCPF(cpf))            { alert("CPF inválido."); return; }
    if (senha !== confirmarSenha)    { alert("As senhas não coincidem."); return; }

    const senhaHash = await gerarHash(senha);

    const usuario = { nome, email, telefone, cpf, senha: senhaHash };
    localStorage.setItem("hotelUser", JSON.stringify(usuario));
    sessionStorage.setItem("hotelLogado", "true");

    alert("Cadastro realizado com sucesso!");
    window.location.href = "../hotel.index.html";
}
