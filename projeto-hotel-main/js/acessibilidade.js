function alternarTema() {

    document.body.classList.toggle("dark-mode");

    if(document.body.classList.contains("dark-mode")){
        localStorage.setItem("tema", "escuro");
    }else{
        localStorage.setItem("tema", "claro");
    }
}

window.onload = function() {
    if(localStorage.getItem("tema") === "escuro") {
        document.body.classList.add("dark-mode");
    }
}

let tamanhoFonte = parseInt(localStorage.getItem("fonte")) || 16;

document.documentElement.style.fontSize = tamanhoFonte + "px";

function aumentarFonte(){

    tamanhoFonte += 2;

    document.documentElement.style.fontSize = tamanhoFonte + "px";

    localStorage.setItem("fonte", tamanhoFonte);
}

function diminuirFonte(){

    if(tamanhoFonte > 12){

        tamanhoFonte -= 2;

        document.documentElement.style.fontSize = tamanhoFonte + "px";

        localStorage.setItem("fonte", tamanhoFonte);
    }
}