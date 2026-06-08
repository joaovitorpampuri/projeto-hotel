function alternarTema() {
    document.body.classList.toggle("dark-mode");
    const btn = document.getElementById("btn-tema");
    if (document.body.classList.contains("dark-mode")) {
        localStorage.setItem("tema", "escuro");
        if (btn) btn.textContent = "☀️";
    } else {
        localStorage.setItem("tema", "claro");
        if (btn) btn.textContent = "🌙";
    }
}

window.onload = function () {
    if (localStorage.getItem("tema") === "escuro") {
        document.body.classList.add("dark-mode");
        const btn = document.getElementById("btn-tema");
        if (btn) btn.textContent = "☀️";
    }
    const fonteSalva = parseInt(localStorage.getItem("fonte")) || 16;
    tamanhoFonte = fonteSalva;
    document.documentElement.style.fontSize = tamanhoFonte + "px";
};

let tamanhoFonte = parseInt(localStorage.getItem("fonte")) || 16;
document.documentElement.style.fontSize = tamanhoFonte + "px";

function aumentarFonte() {
    if (tamanhoFonte < 24) {
        tamanhoFonte += 2;
        document.documentElement.style.fontSize = tamanhoFonte + "px";
        localStorage.setItem("fonte", tamanhoFonte);
    }
}

function diminuirFonte() {
    if (tamanhoFonte > 12) {
        tamanhoFonte -= 2;
        document.documentElement.style.fontSize = tamanhoFonte + "px";
        localStorage.setItem("fonte", tamanhoFonte);
    }
}
