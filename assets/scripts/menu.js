// assets/scripts/menu.js
import { COLORS } from "./config.js";
import { SaveSystem } from "./save.js"; // Precisamos importar o SaveSystem aqui para ler os slots

// --- ADICIONEI 'export' AQUI EMBAIXO ---
export const MenuSystem = {

    // --- PROPRIEDADES DE ESTADO ---
    opcoes: ["NOVO JOGO", "CARREGAR JOGO", "CONQUISTAS", "SAIR"],
    
    cursor: 0,          // Menu Principal
    cursorCard: 0,      // Escolha de MC (0 ou 1)
    cursorSlot: 0,      // Qual slot (0, 1, 2)
    colunaAtual: 0,     // 0 = Lista de Saves, 1 = Botão Excluir (Lixeira)

    // ================================================
    // 1. UPDATE: MENU PRINCIPAL
    // ================================================
    update: function(pad) {
        if (pad.justPressed(Pads.UP)) {
            this.cursor--;
            if (this.cursor < 0) this.cursor = this.opcoes.length - 1;
        }

        if (pad.justPressed(Pads.DOWN)) {
            this.cursor++;
            if (this.cursor >= this.opcoes.length) this.cursor = 0;
        }

        if (pad.justPressed(Pads.CROSS)) {
            if (this.cursor === 0) return "NOVO";
            if (this.cursor === 1) return "CARREGAR";
            if (this.cursor === 2) return "CONQUISTAS";
            if (this.cursor === 3) return "SAIR";
        }

        return null;
    },

    // ================================================
    // 2. UPDATE: ESCOLHER DISPOSITIVO (MC0 / MC1)
    // ================================================
    updateDispositivo: function(pad) {
        if (pad.justPressed(Pads.UP) || pad.justPressed(Pads.DOWN)) {
            // Alterna entre 0 e 1
            this.cursorCard = (this.cursorCard === 0) ? 1 : 0;
        }

        if (pad.justPressed(Pads.CROSS)) {
            // Retorna o índice (0 ou 1) para o Main saber qual usar
            return this.cursorCard;
        }

        if (pad.justPressed(Pads.CIRCLE)) {
            return "VOLTAR";
        }

        return null;
    },

    // ================================================
    // 3. UPDATE: ESCOLHER SLOT (COM NAVEGAÇÃO LATERAL)
    // ================================================
    updateSlots: function(pad, modo) {
        
        // --- NAVEGAÇÃO VERTICAL (Entre Slots) ---
        if (pad.justPressed(Pads.UP)) {
            this.cursorSlot--;
            if (this.cursorSlot < 0) this.cursorSlot = SaveSystem.slots.length - 1;
        }

        if (pad.justPressed(Pads.DOWN)) {
            this.cursorSlot++;
            if (this.cursorSlot >= SaveSystem.slots.length) this.cursorSlot = 0;
        }

        // --- NAVEGAÇÃO HORIZONTAL (Só no modo CARREGAR) ---
        if (modo === "CARREGAR") {
            // Ir para a direita (Botão Excluir)
            if (pad.justPressed(Pads.RIGHT)) {
                if (this.colunaAtual === 0) {
                    this.colunaAtual = 1;
                }
            }
            
            // Voltar para a esquerda (Lista de Saves)
            if (pad.justPressed(Pads.LEFT)) {
                if (this.colunaAtual === 1) {
                    this.colunaAtual = 0;
                }
            }
        } else {
            // Se for NOVO JOGO, trava na coluna 0 sempre
            this.colunaAtual = 0;
        }

        // --- CONFIRMAR ---
        if (pad.justPressed(Pads.CROSS)) {
            // Retorna o índice do slot onde o cursor está.
            // O main.js vai ler 'colunaAtual' para saber se é Load ou Delete.
            return this.cursorSlot;
        }

        if (pad.justPressed(Pads.CIRCLE)) {
            return "VOLTAR";
        }

        return null;
    },

    // ================================================
    // DESENHO: MENU PRINCIPAL
    // ================================================
    draw: function(font) {
        Draw.rect(0, 0, 640, 448, Color.new(20, 20, 40)); // Fundo Azulado

        font.color = Color.new(255, 255, 0);
        font.scale = 2.0;
        font.print(180, 80, "NINJA GAIDEN PS2");

        for (let i = 0; i < this.opcoes.length; i++) {
            let y = 200 + (i * 50);

            if (i === this.cursor) {
                font.color = Color.new(255, 255, 0); // Amarelo
                font.scale = 1.2;
                font.print(200, y, "> " + this.opcoes[i]);
            } else {
                font.color = Color.new(255, 255, 255); // Branco
                font.scale = 1.0;
                font.print(220, y, this.opcoes[i]);
            }
        }
    },

    // ================================================
    // DESENHO: ESCOLHER DISPOSITIVO
    // ================================================
    drawDispositivo: function(font) {
        Draw.rect(0, 0, 640, 448, Color.new(10, 10, 30));

        font.color = Color.new(255, 255, 255);
        font.scale = 1.5;
        font.print(120, 50, "ESCOLHA O MEMORY CARD");

        const cards = ["MEMORY CARD 1 (mc0:)", "MEMORY CARD 2 (mc1:)"];

        for (let i = 0; i < 2; i++) {
            // Cor de fundo do botão
            let cor = (this.cursorCard === i)
                ? Color.new(120, 120, 0) // Selecionado
                : Color.new(50, 50, 50); // Inativo

            Draw.rect(150, 150 + (i * 100), 340, 60, cor);

            font.color = Color.new(255, 255, 255);
            font.scale = 1.0;
            font.print(170, 165 + (i * 100), cards[i]);
        }

        font.color = Color.new(150, 150, 150);
        font.scale = 0.8;
        font.print(400, 400, "O: Voltar");
    },

    // ================================================
    // DESENHO: LISTA DE SLOTS (LAYOUT NOVO)
    // ================================================
    drawSlots: function(font, modo) {
        Draw.rect(0, 0, 640, 448, Color.new(10, 30, 10)); // Fundo Verde Escuro

        font.color = Color.new(255, 255, 255);
        font.scale = 1.4;

        let titulo = (modo === "NOVO") ? "CRIAR NOVO JOGO" : "CARREGAR JOGO";
        font.print(150, 40, titulo + " (" + SaveSystem.unidadeAtual + ")");

        for (let i = 0; i < SaveSystem.slots.length; i++) {
            let y = 110 + (i * 80); // Espaçamento vertical
            let slot = SaveSystem.slots[i];
            let texto = slot.existe ? "JOGO SALVO" : "--- VAZIO ---";

            // --- COLUNA 0: BARRA DO SLOT ---
            // Se estamos na coluna 0 E na linha i, destaca
            let destaqueSlot = (this.colunaAtual === 0 && i === this.cursorSlot);
            
            let corSlot = destaqueSlot
                ? Color.new(180, 180, 0) // Amarelo Selecionado
                : Color.new(40, 40, 40); // Cinza Normal

            Draw.rect(80, y, 400, 60, corSlot);

            // Texto do Slot
            font.color = destaqueSlot ? Color.new(0, 0, 0) : Color.new(200, 200, 200);
            font.scale = 1.0;
            font.print(100, y + 20, `SLOT ${i + 1}: ${texto}`);

            // --- COLUNA 1: BOTÃO DEL (Apenas Carregar + Slot Existe) ---
            if (modo === "CARREGAR" && slot.existe) {
                
                let destaqueDel = (this.colunaAtual === 1 && i === this.cursorSlot);
                
                let corDel = destaqueDel
                    ? Color.new(255, 0, 0)   // Vermelho Vivo (Foco)
                    : Color.new(100, 20, 20); // Vermelho Escuro (Normal)

                Draw.rect(500, y, 60, 60, corDel);

                font.scale = 0.8;
                font.color = Color.new(255, 255, 255);
                // Centraliza o texto DEL
                font.print(512, y + 22, "DEL");
            }
        }

        // --- LEGENDA ---
        font.scale = 0.7;
        font.color = Color.new(150, 150, 150);
        
        if (modo === "CARREGAR") {
            font.print(100, 400, "SETAS: Navegar  |  X: Confirmar  |  O: Voltar");
        } else {
            font.print(150, 400, "X: Criar Jogo  |  O: Voltar");
        }
    },

    // ================================================
    // DESENHO: POPUP DE CONFIRMAÇÃO
    // ================================================
    drawConfirmacao: function(font, titulo, mensagem) {
        // Fundo escurecido atrás (simulado)
        // No PS2 desenhamos um retangulo semi-transparente se possível, 
        // ou solido escuro por cima de tudo
        Draw.rect(40, 90, 560, 220, Color.new(0, 0, 0)); 
        
        // Bordas Vermelhas
        Draw.rect(40, 90, 560, 5, Color.new(200, 0, 0));  // Topo
        Draw.rect(40, 305, 560, 5, Color.new(200, 0, 0)); // Baixo
        Draw.rect(40, 90, 5, 220, Color.new(200, 0, 0));  // Esq
        Draw.rect(595, 90, 5, 220, Color.new(200, 0, 0)); // Dir

        // Título
        font.scale = 1.1;
        font.color = Color.new(255, 50, 50);
        font.print(80, 130, titulo);

        // Mensagem
        font.scale = 0.9;
        font.color = Color.new(200, 200, 200);
        font.print(80, 180, mensagem);

        // Opções
        font.scale = 0.9;
        font.color = Color.new(255, 255, 0);
        font.print(160, 260, "X: CONFIRMAR   |   O: CANCELAR");
    },

    // ================================================
    // DESENHO: CONQUISTAS
    // ================================================
    drawConquistas: function(font) {
        Draw.rect(0, 0, 640, 448, Color.new(20, 0, 0)); // Fundo avermelhado

        font.color = Color.new(255, 255, 255);
        font.scale = 1.5;
        font.print(220, 50, "TROFEUS");

        let y = 120;
        font.scale = 0.8;

        if (typeof Conquistas !== "undefined") {
            for (let id in Conquistas.lista) {
                let t = Conquistas.lista[id];

                if (t.feito) {
                    font.color = Color.new(255, 255, 0);
                    font.print(100, y, "[X] " + t.titulo);
                } else {
                    font.color = Color.new(80, 80, 80);
                    font.print(100, y, "[ ] ???");
                }
                y += 40;
            }
        }
        
        font.color = Color.new(255, 255, 255);
        font.print(400, 400, "O: Voltar");
    }
};