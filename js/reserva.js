/* ============================================================
   RESERVA.JS — Lógica do modal de reserva
   Utilizado em todas as páginas de suíte do projeto
   ============================================================ */

// PRECO_NOITE e NOME_SUITE são declarados em cada página HTML antes deste script
// Exemplo: <script> const NOME_SUITE = "Imperial"; const PRECO_NOITE = 320; </script>
const TAXA_SERVICO = 0.10;
const MAX_NOITES   = 30;

/* ---------- Abrir modal ---------- */
function abrirReserva() {
    const overlay = document.getElementById("reservaOverlay");

    // Reseta o estado do modal antes de abrir
    document.getElementById("reservaFormArea").style.display = "block";
    document.getElementById("reservaSucesso").classList.remove("show");
    document.getElementById("reservaResumo").classList.remove("show");
    document.getElementById("linhaServico").classList.remove("show");
    document.getElementById("reservaErro").classList.remove("show");
    document.getElementById("btnConfirmar").disabled = true;
    document.getElementById("checkin").value = "";
    document.getElementById("checkout").value = "";

    // Define a data mínima como hoje
    const hoje = new Date().toISOString().split("T")[0];
    document.getElementById("checkin").min = hoje;
    document.getElementById("checkout").min = hoje;

    overlay.classList.add("active");
}

/* ---------- Fechar modal ---------- */
function fecharReserva() {
    document.getElementById("reservaOverlay").classList.remove("active");
}

/* ---------- Fechar ao clicar fora ---------- */
function fecharReservaFora(event) {
    if (event.target === document.getElementById("reservaOverlay")) {
        fecharReserva();
    }
}

/* ---------- Fechar com tecla Escape ---------- */
document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
        fecharReserva();
    }
});

/* ---------- Calcular total ---------- */
function calcularReserva() {
    const checkin  = document.getElementById("checkin").value;
    const checkout = document.getElementById("checkout").value;
    const erro     = document.getElementById("reservaErro");
    const resumo   = document.getElementById("reservaResumo");
    const btn      = document.getElementById("btnConfirmar");

    // Limpa estado anterior
    erro.classList.remove("show");
    resumo.classList.remove("show");
    btn.disabled = true;

    // Aguarda os dois campos preenchidos
    if (!checkin || !checkout) return;

    // Atualiza mínimo do checkout com base no checkin
    document.getElementById("checkout").min = checkin;

    const dCheckin  = new Date(checkin);
    const dCheckout = new Date(checkout);
    const noites    = (dCheckout - dCheckin) / (1000 * 60 * 60 * 24);

    // Validações
    if (noites <= 0) {
        mostrarErro("O check-out deve ser em uma data posterior ao check-in.");
        return;
    }

    if (noites > MAX_NOITES) {
        mostrarErro(`O período máximo de reserva online é de ${MAX_NOITES} noites. Para estadias maiores, entre em contato pelo telefone (21) 3456-7891.`);
        return;
    }

    // Cálculo dos valores
    const subtotal = noites * PRECO_NOITE;
    const servico  = subtotal * TAXA_SERVICO;
    const total    = subtotal + servico;

    // Preenche o resumo
    document.getElementById("lblNoites").textContent =
        `${noites} noite${noites > 1 ? "s" : ""} × R$ ${PRECO_NOITE.toLocaleString("pt-BR")},00`;

    document.getElementById("lblSubtotal").textContent =
        `R$ ${formatarMoeda(subtotal)}`;

    document.getElementById("lblServico").textContent =
        `R$ ${formatarMoeda(servico)}`;

    document.getElementById("lblTotal").textContent =
        `R$ ${formatarMoeda(total)}`;

    document.getElementById("linhaServico").classList.add("show");
    resumo.classList.add("show");
    btn.disabled = false;
}

/* ---------- Confirmar reserva ---------- */
function confirmarReserva() {
    const checkin  = document.getElementById("checkin").value;
    const checkout = document.getElementById("checkout").value;
    const adultos  = parseInt(document.getElementById("adultos").value);
    const criancas = parseInt(document.getElementById("criancas").value);

    const noites   = (new Date(checkout) - new Date(checkin)) / (1000 * 60 * 60 * 24);
    const subtotal = noites * PRECO_NOITE;
    const total    = subtotal * (1 + TAXA_SERVICO);

    // Gera código de reserva com prefixo da suíte
    const prefixo = (typeof NOME_SUITE !== "undefined")
        ? NOME_SUITE.replace(/\s+/g, "").substring(0, 3).toUpperCase()
        : "HTL";
    const codigo = prefixo + "-" + Math.random().toString(36).substr(2, 6).toUpperCase();

    // Formata datas para exibição
    const formatarData = (dataStr) =>
        new Date(dataStr + "T12:00:00").toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "long",
            year: "numeric"
        });

    // Monta texto de hóspedes
    const txtAdultos  = `${adultos} adulto${adultos > 1 ? "s" : ""}`;
    const txtCriancas = criancas > 0 ? ` + ${criancas} criança${criancas > 1 ? "s" : ""}` : "";

    // Exibe tela de sucesso
    document.getElementById("reservaFormArea").style.display = "none";
    document.getElementById("reservaSucesso").classList.add("show");

    document.getElementById("sucInfo1").textContent =
        `Check-in: ${formatarData(checkin)}  →  Check-out: ${formatarData(checkout)}`;

    document.getElementById("sucInfo2").textContent =
        `${txtAdultos}${txtCriancas}  •  Total: R$ ${formatarMoeda(total)}`;

    document.getElementById("sucCod").textContent =
        `Código da reserva: ${codigo}`;

    // Salva reserva no localStorage (opcional — útil para área do usuário)
    salvarReservaLocal({ checkin, checkout, adultos, criancas, total, codigo });
}

/* ---------- Helpers ---------- */

function mostrarErro(mensagem) {
    const erro = document.getElementById("reservaErro");
    erro.textContent = mensagem;
    erro.classList.add("show");
}

function formatarMoeda(valor) {
    return valor.toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

function salvarReservaLocal(dados) {
    try {
        const reservas = JSON.parse(localStorage.getItem("hotelReservas") || "[]");
        reservas.push({
            ...dados,
            suite: (typeof NOME_SUITE !== "undefined") ? NOME_SUITE : "Hotel",
            criadaEm: new Date().toISOString()
        });
        localStorage.setItem("hotelReservas", JSON.stringify(reservas));
    } catch (e) {
        // Falha silenciosa — não interrompe o fluxo do usuário
    }
}
