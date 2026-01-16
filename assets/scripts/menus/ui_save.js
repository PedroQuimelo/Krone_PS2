// assets/scripts/menus/ui_save.js
import { SaveSystem } from "../systems/save.js"; 
import { PALETA } from "../data/palette.js"; 

export const UiSave = {
    // Estado interno (Cursor e Variáveis)
    cursorCard: 0,      
    cursorSlot: 0,      
    colunaAtual: 0, // 0 = Slot, 1 = Botão Delete

    // --- 1. TELA DE ESCOLHER DISPOSITIVO (MC0 / MC1) ---
    updateDispositivo: function(padWrapper) {
        if (padWrapper.justPressed(Pads.UP)) { 
            this.cursorCard--; 
            if (this.cursorCard < 0) this.cursorCard = 1; 
        }
        if (padWrapper.justPressed(Pads.DOWN)) { 
            this.cursorCard++; 
            if (this.cursorCard > 1) this.cursorCard = 0; 
        }
        
        if (padWrapper.justPressed(Pads.CROSS)) return this.cursorCard; // Retorna 0 ou 1
        if (padWrapper.justPressed(Pads.CIRCLE)) return "VOLTAR";
        return null;
    },

    drawDispositivo: function(font) {
        Draw.rect(0, 0, 640, 448, PALETA.BG_MC);
        if (!font) return;

        font.color = PALETA.BRANCO; font.scale = 1.5; 
        font.print(120, 50, "ESCOLHA O MEMORY CARD");

        const cards = ["MEMORY CARD 1 (mc0:)", "MEMORY CARD 2 (mc1:)"];
        for (let i = 0; i < 2; i++) {
            let isSel = (this.cursorCard === i);
            let cor = isSel ? PALETA.AMARELO : Color.new(50, 50, 50); // Usei new aqui pq é cinza escuro específico, ou pode por na paleta
            
            // Destaque visual
            if (isSel) Draw.rect(145, 145 + (i * 100), 350, 70, PALETA.AMARELO); // Borda
            
            Draw.rect(150, 150 + (i * 100), 340, 60, isSel ? Color.new(120, 120, 0) : Color.new(50, 50, 50));
            
            font.color = PALETA.BRANCO; font.scale = 1.0; 
            font.print(170, 165 + (i * 100), cards[i]);
        }
        
        font.color = PALETA.CINZA_ESCURO; font.scale = 0.8; 
        font.print(400, 400, "O: Voltar");
    },

    // --- 2. TELA DE SLOTS (SALVAR / CARREGAR) ---
    updateSlots: function(padWrapper, modo) {
        // Cima / Baixo
        if (padWrapper.justPressed(Pads.UP)) { 
            this.cursorSlot--; 
            if (this.cursorSlot < 0) this.cursorSlot = SaveSystem.slots.length - 1; 
        }
        if (padWrapper.justPressed(Pads.DOWN)) { 
            this.cursorSlot++; 
            if (this.cursorSlot >= SaveSystem.slots.length) this.cursorSlot = 0; 
        }

        // Esquerda / Direita (Apenas no modo CARREGAR para ir no botão Delete)
        if (modo === "CARREGAR") {
            if (padWrapper.justPressed(Pads.RIGHT) && this.colunaAtual === 0) this.colunaAtual = 1;
            if (padWrapper.justPressed(Pads.LEFT) && this.colunaAtual === 1) this.colunaAtual = 0;
        } else {
            this.colunaAtual = 0;
        }

        if (padWrapper.justPressed(Pads.CROSS)) return this.cursorSlot;
        if (padWrapper.justPressed(Pads.CIRCLE)) return "VOLTAR";
        return null;
    },

    drawSlots: function(font, modo) {
        Draw.rect(0, 0, 640, 448, PALETA.BG_SLOTS); 
        if (!font) return;

        font.color = PALETA.BRANCO; font.scale = 1.4;
        let titulo = (modo === "NOVO") ? "CRIAR NOVO JOGO" : "CARREGAR JOGO";
        font.print(150, 40, titulo + " (" + SaveSystem.unidadeAtual + ")");

        for (let i = 0; i < SaveSystem.slots.length; i++) {
            let y = 110 + (i * 80); 
            let slot = SaveSystem.slots[i];
            let texto = slot.existe ? "JOGO SALVO" : "--- VAZIO ---";

            // Lógica de destaque
            let destaqueSlot = (this.colunaAtual === 0 && i === this.cursorSlot);
            
            // Fundo do Slot
            let corSlot = destaqueSlot ? PALETA.AMARELO : PALETA.FUNDO_PAR; // Reusando cor da paleta
            Draw.rect(80, y, 400, 60, corSlot);

            // Texto do Slot
            font.color = destaqueSlot ? Color.new(0, 0, 0) : PALETA.CINZA_ESCURO;
            font.scale = 1.0; 
            font.print(100, y + 20, `SLOT ${i + 1}: ${texto}`);

            // Botão Delete (Só aparece no carregar se existir save)
            if (modo === "CARREGAR" && slot.existe) {
                let destaqueDel = (this.colunaAtual === 1 && i === this.cursorSlot);
                let corDel = destaqueDel ? Color.new(255, 0, 0) : Color.new(100, 20, 20);
                
                Draw.rect(500, y, 60, 60, corDel);
                
                font.scale = 0.8; 
                font.color = PALETA.BRANCO;
                font.print(512, y + 22, "DEL");
            }
        }
        
        font.scale = 0.7; font.color = PALETA.CINZA_ESCURO;
        if (modo === "CARREGAR") font.print(100, 400, "SETAS: Navegar | X: Confirmar | O: Voltar");
        else font.print(150, 400, "X: Criar Jogo | O: Voltar");
    },

    // --- 3. TELA DE CONFIRMAÇÃO ---
    drawConfirmacao: function(font, titulo, mensagem) {
        // Fundo Escuro
        Draw.rect(40, 90, 560, 220, Color.new(0, 0, 0)); 
        
        // Bordas Vermelhas (Alerta)
        let vermelho = Color.new(200, 0, 0);
        Draw.rect(40, 90, 560, 5, vermelho);   // Topo
        Draw.rect(40, 305, 560, 5, vermelho);  // Baixo
        Draw.rect(40, 90, 5, 220, vermelho);   // Esq
        Draw.rect(595, 90, 5, 220, vermelho);  // Dir

        if(!font) return;

        font.scale = 1.1; font.color = Color.new(255, 50, 50); 
        font.print(80, 130, titulo);

        font.scale = 0.9; font.color = PALETA.BRANCO;
        font.print(80, 180, mensagem);

        font.scale = 0.9; font.color = PALETA.AMARELO; 
        font.print(160, 260, "X: CONFIRMAR   |   O: CANCELAR");
    }
};