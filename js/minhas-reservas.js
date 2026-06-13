/* ============================================================
   MINHAS-RESERVAS.JS — Gerenciamento de reservas
   ============================================================ */

// ========== ABRIR MODAL DE MINHAS RESERVAS ==========
// Esta função exibe um popup com todas as reservas salvas do usuário
function abrirMinhasReservas() {
    // Pega as reservas do navegador (localStorage) e converte de JSON
    // Se não houver reservas, usa um array vazio []
    const reservas = JSON.parse(localStorage.getItem("hotelReservas") || "[]");
    
    // Valida se há reservas. Se não tiver, mostra aviso e sai
    if (reservas.length === 0) {
        alert("Você ainda não possui reservas registradas.");
        return;
    }

    // ========== CRIAR ESTRUTURA DO MODAL ==========
    // Cria um "overlay" (fundo escuro) que fica por trás do modal
    const overlay = document.createElement("div");
    overlay.className = "modal-overlay";
    overlay.id = "modalReservas";
    
    // Cria a caixa do modal (a janela branca com o conteúdo)
    const modal = document.createElement("div");
    modal.className = "modal-reservas";
    
    // ========== CONTEÚDO DO CABEÇALHO ==========
    let conteudo = `
        <div class="modal-header">
            <h2>Minhas Reservas</h2>
            <button class="btn-fechar" onclick="fecharModalReservas()">✕</button>
        </div>
        <div class="modal-conteudo">
            <p style="color: #666; margin-bottom: 20px;">Total de reservas: <strong>${reservas.length}</strong></p>
    `;
    
    // ========== LOOP PARA LISTAR CADA RESERVA ==========
    // Percorre cada reserva do array "reservas"
    reservas.forEach((reserva, index) => {
        conteudo += `
            <div class="reserva-item">
                <div class="reserva-header">
                    <!-- Nome da suíte ou "Hotel" se não tiver nome -->
                    <h3>${reserva.suite || "Hotel"}</h3>
                    <!-- Badge com o código da reserva em destaque -->
                    <span class="codigo-reserva">${reserva.codigo}</span>
                </div>
                <div class="reserva-detalhes">
                    <!-- Data de check-in formatada em português (ex: 15 de junho de 2026) -->
                    <p><strong>Check-in:</strong> ${formatarDataDisplay(reserva.checkin)}</p>
                    <!-- Data de check-out formatada em português -->
                    <p><strong>Check-out:</strong> ${formatarDataDisplay(reserva.checkout)}</p>
                    <!-- Quantidade de hóspedes (adultos e crianças) -->
                    <p><strong>Hóspedes:</strong> ${reserva.adultos} adulto(s) ${reserva.criancas > 0 ? `+ ${reserva.criancas} criança(s)` : ""}</p>
                    <!-- Valor total formatado com separador de milhares e 2 casas decimais -->
                    <p><strong>Valor Total:</strong> R$ ${formatarMoedaDisplay(reserva.total)}</p>
                    <!-- Data e hora que a reserva foi criada -->
                    <p style="font-size: 12px; color: #999;">Registrada em: ${formatarDataHoraCompleta(reserva.criadaEm)}</p>
                </div>
            </div>
        `;
    });
    
    // ========== RODAPÉ DO MODAL COM BOTÕES ==========
    conteudo += `
        </div>
        <div class="modal-footer">
            <!-- Botão para baixar a reserva como imagem PNG -->
            <button class="btn-modal btn-exportar" onclick="exportarReservasImagem()">
                🖼️ Baixar como Imagem
            </button>
            <!-- Botão para fechar o modal -->
            <button class="btn-modal btn-fechar-modal" onclick="fecharModalReservas()">
                Fechar
            </button>
        </div>
    `;
    
    // Insere todo o conteúdo HTML (cabeçalho + reservas + rodapé) dentro da modal
    modal.innerHTML = conteudo;
    
    // Adiciona a modal dentro do overlay
    overlay.appendChild(modal);
    
    // ========== EVENTO PARA FECHAR AO CLICAR FORA ==========
    // Se o usuário clicar fora do modal (no overlay escuro), fecha a janela
    overlay.onclick = (e) => {
        if (e.target === overlay) fecharModalReservas();
    };
    
    // ========== MOSTRAR O MODAL NA PÁGINA ==========
    // Adiciona o overlay (com o modal dentro) no corpo da página
    document.body.appendChild(overlay);
}

// ========== FECHAR MODAL ==========
// Remove a janela de minhas reservas da página
function fecharModalReservas() {
    // Procura pelo elemento com id "modalReservas" (o overlay com a modal)
    const modal = document.getElementById("modalReservas");
    
    // Se encontrar, remove ele da página
    if (modal) modal.remove();
}

// ========== FUNÇÕES AUXILIARES DE FORMATAÇÃO ==========

// Formata data para exibição em português (ex: "15 de junho de 2026")
function formatarDataDisplay(dataStr) {
    // Cria um objeto Date a partir da string de data (2026-06-15)
    // Adiciona "T12:00:00" para evitar problemas de fuso horário
    return new Date(dataStr + "T12:00:00").toLocaleDateString("pt-BR", {
        day: "2-digit",        // Dia com 2 dígitos (01, 02, etc)
        month: "long",         // Mês por extenso (janeiro, fevereiro, etc)
        year: "numeric"        // Ano com 4 dígitos (2026)
    });
}

// Formata valor monetário para Real (R$) com separador de milhares e 2 casas decimais
function formatarMoedaDisplay(valor) {
    // Exemplo: 1234.56 vira "1.234,56"
    return valor.toLocaleString("pt-BR", {
        minimumFractionDigits: 2,  // No mínimo 2 casas decimais
        maximumFractionDigits: 2   // No máximo 2 casas decimais
    });
}

// Formata data e hora completa (ex: "15/06/2026 14:30:45")
function formatarDataHoraCompleta(dataIso) {
    // Se não tiver data, retorna "N/A"
    if (!dataIso) return "N/A";
    
    // Converte e formata no padrão brasileiro
    return new Date(dataIso).toLocaleString("pt-BR");
}

// ========== EXPORTAR RESERVAS COMO IMAGEM ==========
// Função principal que decide se exporta uma reserva ou múltiplas
function exportarReservasImagem() {
    // Pega todas as reservas salvas no navegador
    const reservas = JSON.parse(localStorage.getItem("hotelReservas") || "[]");
    
    // Valida se há reservas para exportar
    if (reservas.length === 0) {
        alert("Nenhuma reserva para exportar.");
        return;
    }

    // ========== LÓGICA DE SELEÇÃO ==========
    // Se houver apenas uma reserva, exporta direto sem perguntar
    if (reservas.length === 1) {
        gerarImagemReserva(reservas[0], 0);
        return;
    }

    // Se houver múltiplas reservas, cria um menu para o usuário escolher
    let opcoes = "Qual reserva deseja exportar?\n\n";
    reservas.forEach((r, i) => {
        opcoes += `${i + 1}. ${r.suite || "Hotel"} - Check-in: ${r.checkin} (Código: ${r.codigo})\n`;
    });
    opcoes += `\n0. Todas as reservas em um documento`;

    // Abre uma caixa de diálogo para o usuário escolher
    const escolha = prompt(opcoes);
    
    // Se o usuário apertar Cancel/ESC, sai sem fazer nada
    if (escolha === null) return;
    
    // Converte a escolha do usuário para número inteiro
    const index = parseInt(escolha);
    
    // Valida se a escolha é um número válido
    if (isNaN(index) || index < 0 || index > reservas.length) {
        alert("Opção inválida!");
        return;
    }

    // ========== EXECUTAR A AÇÃO ESCOLHIDA ==========
    // Se escolheu 0, exporta todas as reservas em uma imagem
    if (index === 0) {
        gerarImagemTodas(reservas);
    } else {
        // Senão, exporta apenas a reserva escolhida
        gerarImagemReserva(reservas[index - 1], index - 1);
    }
}

// ========== GERAR IMAGEM DE UMA RESERVA ==========
// Cria uma imagem PNG profissional com os dados de uma reserva
function gerarImagemReserva(reserva, numero) {
    // ========== CRIAR CANVAS (ÁREA DE DESENHO) ==========
    const largura = 800;    // Largura em pixels
    const altura = 1100;    // Altura em pixels (tamanho de um documento A4)
    const canvas = document.createElement("canvas");
    canvas.width = largura;
    canvas.height = altura;
    const ctx = canvas.getContext("2d");  // Objeto para desenhar

    // ========== FUNDO ==========
    ctx.fillStyle = "#ffffff";  // Cor branca
    ctx.fillRect(0, 0, largura, altura);  // Preenche todo o canvas

    // ========== BORDA ELEGANTE ==========
    ctx.strokeStyle = "#c9a96e";  // Cor dourada do hotel
    ctx.lineWidth = 3;
    ctx.strokeRect(15, 15, largura - 30, altura - 30);  // Desenha um retângulo

    // ========== TOPO COM COR DE FUNDO ==========
    ctx.fillStyle = "#c9a96e";  // Dourado
    ctx.fillRect(0, 0, largura, 80);  // Retângulo preenchido no topo

    // ========== TÍTULO PRINCIPAL ==========
    ctx.fillStyle = "#ffffff";  // Texto branco
    ctx.font = "bold 32px Arial";
    ctx.textAlign = "center";
    ctx.fillText("COMPROVANTE DE RESERVA", largura / 2, 50);

    // ========== SEPARADOR ==========
    ctx.strokeStyle = "#c9a96e";
    ctx.lineWidth = 2;
    ctx.beginPath();  // Começa a desenhar uma linha
    ctx.moveTo(50, 100);  // Posição inicial
    ctx.lineTo(largura - 50, 100);  // Posição final
    ctx.stroke();  // Desenha a linha

    // ========== ESPAÇAMENTO E POSICIONAMENTO ==========
    ctx.fillStyle = "#2a2a2a";  // Cinza escuro (texto)
    ctx.font = "14px Arial";
    ctx.textAlign = "left";

    let yPos = 140;  // Posição vertical inicial
    const linhaAltura = 50;

    // ========== NOME DO HOTEL ==========
    ctx.font = "bold 18px Arial";
    ctx.fillText("COPACABANA PALMS", 50, yPos);
    yPos += 30;

    // Lema do hotel
    ctx.font = "regular 12px Arial";
    ctx.fillStyle = "#666";
    ctx.fillText("Luxo e Conforto em Rio de Janeiro", 50, yPos);
    yPos += 40;

    // ========== CÓDIGO DA RESERVA (EM DESTAQUE) ==========
    ctx.fillStyle = "#2a2a2a";
    ctx.font = "bold 12px Arial";
    ctx.fillText("Código da Reserva:", 50, yPos);
    ctx.font = "bold 20px Arial";  // Fonte maior para destacar
    ctx.fillStyle = "#c9a96e";  // Cor dourada
    ctx.fillText(reserva.codigo, 50, yPos + 30);
    yPos += 60;

    // ========== INFORMAÇÕES DA SUÍTE ==========
    ctx.fillStyle = "#2a2a2a";
    ctx.font = "bold 12px Arial";
    ctx.fillText("Suíte:", 50, yPos);
    ctx.font = "regular 14px Arial";
    ctx.fillStyle = "#333";
    ctx.fillText(reserva.suite || "Hotel", 200, yPos);
    yPos += 35;

    // ========== DATA DE CHECK-IN ==========
    ctx.fillStyle = "#2a2a2a";
    ctx.font = "bold 12px Arial";
    ctx.fillText("Check-in:", 50, yPos);
    ctx.font = "regular 14px Arial";
    ctx.fillStyle = "#333";
    ctx.fillText(formatarDataDisplay(reserva.checkin), 200, yPos);
    yPos += 35;

    // ========== DATA DE CHECK-OUT ==========
    ctx.fillStyle = "#2a2a2a";
    ctx.font = "bold 12px Arial";
    ctx.fillText("Check-out:", 50, yPos);
    ctx.font = "regular 14px Arial";
    ctx.fillStyle = "#333";
    ctx.fillText(formatarDataDisplay(reserva.checkout), 200, yPos);
    yPos += 35;

    // ========== INFORMAÇÕES DE HÓSPEDES ==========
    ctx.fillStyle = "#2a2a2a";
    ctx.font = "bold 12px Arial";
    ctx.fillText("Hóspedes:", 50, yPos);
    ctx.font = "regular 14px Arial";
    ctx.fillStyle = "#333";
    const hospedes = `${reserva.adultos} adulto(s) ${reserva.criancas > 0 ? `+ ${reserva.criancas} criança(s)` : ""}`;
    ctx.fillText(hospedes, 200, yPos);
    yPos += 50;

    // ========== SEPARADOR PONTILHADO ==========
    ctx.strokeStyle = "#c9a96e";
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);  // [5px linha, 5px espaço] = efeito pontilhado
    ctx.beginPath();
    ctx.moveTo(50, yPos - 10);
    ctx.lineTo(largura - 50, yPos - 10);
    ctx.stroke();
    ctx.setLineDash([]);  // Remove o efeito pontilhado

    yPos += 30;

    // ========== RESUMO DE VALORES ==========
    ctx.fillStyle = "#2a2a2a";
    ctx.font = "bold 12px Arial";
    ctx.fillText("Valor da Diária:", 50, yPos);
    // Calcula o valor da diária dividindo o total pelo número de noites
    ctx.fillText("R$ " + formatarMoedaDisplay(reserva.total / calcularNoites(reserva.checkin, reserva.checkout)), 500, yPos);
    yPos += 30;

    ctx.font = "bold 12px Arial";
    ctx.fillText("Noites:", 50, yPos);
    ctx.fillText(calcularNoites(reserva.checkin, reserva.checkout).toString(), 500, yPos);
    yPos += 30;

    // ========== SEPARADOR CHEIO (ANTES DO TOTAL) ==========
    ctx.strokeStyle = "#c9a96e";
    ctx.lineWidth = 2;
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.moveTo(50, yPos);
    ctx.lineTo(largura - 50, yPos);
    ctx.stroke();
    yPos += 25;

    // ========== VALOR TOTAL (EM DESTAQUE) ==========
    ctx.fillStyle = "#c9a96e";  // Dourado para destacar
    ctx.font = "bold 16px Arial";
    ctx.fillText("VALOR TOTAL:", 50, yPos);
    ctx.fillText("R$ " + formatarMoedaDisplay(reserva.total), 400, yPos);
    yPos += 50;

    // ========== MENSAGEM IMPORTANTE ==========
    ctx.fillStyle = "#666";
    ctx.font = "regular 11px Arial";
    ctx.textAlign = "center";  // Centraliza o texto
    const msg = "Apresente este comprovante ao fazer o check-in no hotel.";
    ctx.fillText(msg, largura / 2, yPos);
    yPos += 25;

    // ========== RODAPÉ COM DATA/HORA ==========
    ctx.fillStyle = "#999";  // Cor mais clara
    ctx.font = "regular 10px Arial";
    ctx.fillText(`Gerado em: ${new Date().toLocaleString("pt-BR")}`, largura / 2, altura - 30);

    // ========== CONVERTER CANVAS PARA IMAGEM E BAIXAR ==========
    // Converte o desenho do canvas em um arquivo PNG (blob)
    canvas.toBlob((blob) => {
        // Cria uma URL temporária para o arquivo
        const url = URL.createObjectURL(blob);
        
        // Cria um elemento <a> (link) invisível
        const link = document.createElement("a");
        link.href = url;
        link.download = `reserva_${reserva.codigo}.png`;  // Nome do arquivo a baixar
        
        // Simula um clique no link para iniciar o download
        link.click();
        
        // Libera a memória da URL temporária
        URL.revokeObjectURL(url);
    }, "image/png");  // Formato do arquivo
}

// ========== GERAR IMAGEM COM TODAS AS RESERVAS ==========
// Cria uma imagem PNG com todas as reservas do usuário em um único documento
function gerarImagemTodas(reservas) {
    // ========== CALCULAR O TAMANHO TOTAL ==========
    const largura = 800;
    const alturaBase = 300;      // Espaço para cabeçalho
    const alturaReserva = 200;   // Altura de cada reserva
    const altura = alturaBase + (reservas.length * alturaReserva);  // Total

    // ========== CRIAR CANVAS ==========
    const canvas = document.createElement("canvas");
    canvas.width = largura;
    canvas.height = altura;
    const ctx = canvas.getContext("2d");

    // ========== FUNDO BRANCO ==========
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, largura, altura);

    // ========== TOPO COM COR ==========
    ctx.fillStyle = "#c9a96e";
    ctx.fillRect(0, 0, largura, 80);

    // ========== TÍTULO ==========
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 32px Arial";
    ctx.textAlign = "center";
    ctx.fillText("MINHAS RESERVAS", largura / 2, 50);

    // ========== SEPARADOR ==========
    ctx.strokeStyle = "#c9a96e";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(50, 100);
    ctx.lineTo(largura - 50, 100);
    ctx.stroke();

    // ========== NOME DO HOTEL ==========
    ctx.fillStyle = "#2a2a2a";
    ctx.font = "bold 18px Arial";
    ctx.textAlign = "left";
    ctx.fillText("COPACABANA PALMS", 50, 140);

    let yPos = 180;

    // ========== LOOP PARA LISTAR CADA RESERVA ==========
    reservas.forEach((reserva, index) => {
        // Fundo cinzento para cada reserva
        ctx.fillStyle = "#f9f9f9";
        ctx.fillRect(30, yPos - 20, largura - 60, 180);

        // Borda da reserva
        ctx.strokeStyle = "#c9a96e";
        ctx.lineWidth = 1;
        ctx.strokeRect(30, yPos - 20, largura - 60, 180);

        // Número da reserva
        ctx.fillStyle = "#c9a96e";
        ctx.font = "bold 14px Arial";
        ctx.fillText(`${index + 1}.`, 50, yPos + 10);

        // Nome da suíte
        ctx.fillStyle = "#2a2a2a";
        ctx.font = "bold 14px Arial";
        ctx.fillText(reserva.suite || "Hotel", 80, yPos + 10);
        
        // Código da reserva (lado direito)
        ctx.fillStyle = "#c9a96e";
        ctx.font = "bold 12px Arial";
        ctx.fillText(reserva.codigo, 450, yPos + 10);

        // ========== DETALHES DA RESERVA ==========
        ctx.fillStyle = "#555";
        ctx.font = "regular 12px Arial";
        ctx.fillText(`Check-in: ${formatarDataDisplay(reserva.checkin)}`, 50, yPos + 35);
        ctx.fillText(`Check-out: ${formatarDataDisplay(reserva.checkout)}`, 50, yPos + 55);
        ctx.fillText(`Hóspedes: ${reserva.adultos} adulto(s) ${reserva.criancas > 0 ? `+ ${reserva.criancas} criança(s)` : ""}`, 50, yPos + 75);

        // Valor total (lado direito)
        ctx.fillStyle = "#c9a96e";
        ctx.font = "bold 14px Arial";
        ctx.fillText(`R$ ${formatarMoedaDisplay(reserva.total)}`, 450, yPos + 75);

        // Move para a próxima reserva
        yPos += alturaReserva;
    });

    // ========== RODAPÉ ==========
    ctx.fillStyle = "#999";
    ctx.font = "regular 10px Arial";
    ctx.textAlign = "center";
    ctx.fillText(`Total de reservas: ${reservas.length} | Gerado em: ${new Date().toLocaleString("pt-BR")}`, largura / 2, altura - 15);

    // ========== CONVERTER PARA IMAGEM E BAIXAR ==========
    canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `reservas_copacabana_${new Date().getTime()}.png`;  // Nome único com timestamp
        link.click();
        URL.revokeObjectURL(url);
    }, "image/png");
}

// ========== CALCULAR NÚMERO DE NOITES ==========
// Calcula quantas noites o hóspede ficará no hotel
function calcularNoites(checkin, checkout) {
    // Converte as datas em string (2026-06-15) para objetos Date
    const dCheckin = new Date(checkin);
    const dCheckout = new Date(checkout);
    
    // Calcula a diferença em milissegundos entre as duas datas
    // Depois converte para dias:
    // - (dCheckout - dCheckin) = diferença em ms
    // - / (1000 * 60 * 60 * 24) = converte ms para dias (1000ms=1s, 60s=1min, 60min=1hora, 24horas=1dia)
    // Math.ceil() arredonda para cima (se for 2.1 dias, fica 3)
    return Math.ceil((dCheckout - dCheckin) / (1000 * 60 * 60 * 24));
}
