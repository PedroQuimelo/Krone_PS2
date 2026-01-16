// assets/scripts/ui_trophies.js
import { Conquistas } from "../achievements.js"; 
import { PALETA } from "../data/palette.js"; 

export const UiTrophies = {
    // Estado interno DESTA tela
    scroll: 0,
    cursor: 0,      
    maxItens: 6, 
    vendoDetalhes: false, 
    itemDetalhe: null,

    // Resetar estado ao entrar na tela (IMPORTANTE)
    reset: function() {
        this.scroll = 0;
        this.cursor = 0;
        this.vendoDetalhes = false;
        this.itemDetalhe = null;
    },

    update: function(padWrapper) {
        if (!Conquistas || !Conquistas.lista || !Conquistas.lista.length) return "VOLTAR";

        // MODO DETALHES
        if (this.vendoDetalhes) {
            if (padWrapper.justPressed(Pads.CIRCLE) || padWrapper.justPressed(Pads.CROSS)) {
                this.vendoDetalhes = false;
            }
            return null; 
        }

        // MODO LISTA
        let totalItens = Conquistas.lista.length;
        if (padWrapper.justPressed(Pads.UP)) {
            this.cursor--;
            if (this.cursor < 0) {
                this.cursor = totalItens - 1;
                this.scroll = Math.max(0, totalItens - this.maxItens);
            }
        }
        if (padWrapper.justPressed(Pads.DOWN)) {
            this.cursor++;
            if (this.cursor >= totalItens) {
                this.cursor = 0;
                this.scroll = 0;
            }
        }

        // Ajusta Scroll
        if (this.cursor < this.scroll) this.scroll = this.cursor;
        if (this.cursor >= this.scroll + this.maxItens) this.scroll = this.cursor - this.maxItens + 1;

        // Ações
        if (padWrapper.justPressed(Pads.CROSS)) {
            this.itemDetalhe = Conquistas.lista[this.cursor];
            this.vendoDetalhes = true;
        }

        if (padWrapper.justPressed(Pads.CIRCLE)) return "VOLTAR";
        return null;
    },

    draw: function(font) {
        Draw.rect(0, 0, 640, 448, PALETA.BG_CONQ); 
        if(!font) return;

        font.color = PALETA.BRANCO; font.scale = 1.5; font.print(220, 50, "TROFEUS");

        if (!Conquistas || !Conquistas.lista) return;

        let y = 120; font.scale = 0.8;

        for (let i = this.scroll; i < this.scroll + this.maxItens; i++) {
            if (i < Conquistas.lista.length) {
                let t = Conquistas.lista[i];
                let isSelecionado = (i === this.cursor);

                let corFundo = isSelecionado ? PALETA.FUNDO_SEL : ((i % 2 === 0) ? PALETA.FUNDO_PAR : PALETA.FUNDO_IMPAR);
                Draw.rect(80, y - 5, 480, 40, corFundo);

                if (isSelecionado) font.color = PALETA.AMARELO;
                else if (t.feito)  font.color = PALETA.BRANCO;
                else               font.color = PALETA.CINZA;

                let x = 100;
                if (isSelecionado) font.print(85, y, ">");
                
                // Checkbox e Título
                if (t.feito) { font.print(x, y, "[X]"); font.print(x + 35, y, t.titulo); }
                else         { font.print(x, y, "[ ]"); font.print(x + 35, y, "??? (Bloqueado)"); }
                
                y += 45; 
            }
        }

        // Setas
        font.scale = 1.0; font.color = PALETA.AMARELO;
        if (this.scroll > 0) font.print(580, 120, "^"); 
        if (this.scroll + this.maxItens < Conquistas.lista.length) font.print(580, 400, "v"); 

        font.scale = 0.7; font.color = PALETA.CINZA_ESCURO; font.print(350, 420, "X: Detalhes  |  O: Voltar");

        // OVERLAY DE DETALHES
        if (this.vendoDetalhes && this.itemDetalhe) {
            this.drawDetalhes(font);
        }
    },

    // Função interna só pra desenhar o card (organização)
    drawDetalhes: function(font) {
        Draw.rect(0, 0, 640, 448, PALETA.PRETO_TRANSPARENTE);
        let cx = 120, cy = 100, cw = 400, ch = 200;
        
        Draw.rect(cx, cy, cw, ch, PALETA.CARD_BG);
        
        // Bordas
        Draw.rect(cx, cy, cw, 2, PALETA.CARD_BORDA); Draw.rect(cx, cy + ch, cw, 2, PALETA.CARD_BORDA);
        Draw.rect(cx, cy, 2, ch, PALETA.CARD_BORDA); Draw.rect(cx + cw, cy, 2, ch + 2, PALETA.CARD_BORDA);
        Draw.rect(cx + 20, cy + 50, 64, 64, PALETA.ICON_BG);
        
        font.scale = 2.0;
        if (this.itemDetalhe.feito) { font.color = PALETA.AMARELO; font.print(cx + 40, cy + 65, "!"); } 
        else { font.color = PALETA.CINZA; font.print(cx + 38, cy + 65, "?"); }

        font.scale = 1.2; 
        font.color = this.itemDetalhe.feito ? PALETA.AMARELO : PALETA.CINZA;
        font.print(cx + 100, cy + 30, this.itemDetalhe.feito ? this.itemDetalhe.titulo : "Conquista Secreta");

        Draw.rect(cx + 100, cy + 60, 250, 1, PALETA.CINZA_ESCURO);

        font.scale = 0.8; font.color = PALETA.BRANCO;
        font.print(cx + 100, cy + 70, this.itemDetalhe.feito ? this.itemDetalhe.desc : "Continue jogando para desbloquear.");

        font.color = this.itemDetalhe.feito ? PALETA.SUCESSO : PALETA.ERRO;
        font.print(cx + 280, cy + 170, this.itemDetalhe.feito ? "STATUS: CONCLUIDO" : "STATUS: BLOQUEADO");

        font.scale = 0.7; font.color = PALETA.CINZA_ESCURO;
        font.print(cx + 20, cy + 170, "O: Fechar");
    }
};