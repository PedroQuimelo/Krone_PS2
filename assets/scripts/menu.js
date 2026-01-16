// assets/scripts/menu.js
import { PALETA } from "./data/palette.js"; 

import { UiTrophies } from "./menus/ui_trophies.js";
import { UiSave } from "./menus/ui_save.js";
import { UiOptions } from "./menus/ui_options.js";

export const MenuSystem = {
    opcoes: ["NOVO JOGO", "CARREGAR JOGO", "OPÇÕES", "CONQUISTAS", "SAIR"],  
    cursor: 0,

    // ================================================
    // UPDATE PRINCIPAL
    // ================================================
    update: function(padWrapper) {
        if (padWrapper.justPressed(Pads.UP)) { this.cursor--; if (this.cursor < 0) this.cursor = this.opcoes.length - 1; }
        if (padWrapper.justPressed(Pads.DOWN)) { this.cursor++; if (this.cursor >= this.opcoes.length) this.cursor = 0; }
        if (padWrapper.justPressed(Pads.CROSS)) {
            if (this.cursor === 0) return "NOVO";
            if (this.cursor === 1) return "CARREGAR";
            if (this.cursor === 2) {
                UiOptions.reset();
                return "OPCOES";
            }
            if (this.cursor === 3) {
                UiTrophies.reset();
                return "CONQUISTAS";
            }
            if (this.cursor === 4) return "SAIR";
        }
        return null;
    },

    // --- DRAW DO MENU PRINCIPAL ---
    draw: function(font) { 
        Draw.rect(0, 0, 640, 448, PALETA.BG_GERAL); 
        if (!font) return; 
        font.color = PALETA.AMARELO; font.scale = 2.0; font.print(180, 80, "NINJA GAIDEN PS2");
        for (let i = 0; i < this.opcoes.length; i++) {
            let y = 180 + (i * 45); 
            if (i === this.cursor) { font.color = PALETA.AMARELO; font.scale = 1.2; font.print(200, y, "> " + this.opcoes[i]); } 
            else { font.color = PALETA.BRANCO; font.scale = 1.0; font.print(220, y, this.opcoes[i]); }
        }
    },

    // ================================================
    // trofeus
    // ================================================
    // UPDATE CONQUISTAS
    // ================================================
    updateConquistas: function(padWrapper) {
        return UiTrophies.update(padWrapper);
    },
    // ================================================
    // DRAW CONQUISTAS 
    // ================================================
    drawConquistas: function(font) {
        UiTrophies.draw(font);
    },

    // ================================================
    // save/memory card 
    // ================================================
    // Memory card 
    // ================================================
    updateDispositivo: (pad) => UiSave.updateDispositivo(pad),
    // ================================================
    // DRAW memory card
    // ================================================
    drawDispositivo: (font) => UiSave.drawDispositivo(font),

    // ================================================
    // slots de save 
    // ================================================
    // slots de save
    // ================================================
    updateSlots: (pad, modo) => UiSave.updateSlots(pad, modo),
    // ================================================
    // DRAW slots de save
    // ================================================
    drawSlots: (font, modo) => UiSave.drawSlots(font, modo),
    // ================================================
    // DRAW confirmar novo save
    // ================================================
    drawConfirmacao: (font, t, m) => UiSave.drawConfirmacao(font, t, m),

    // ================================================
    // Opções 
    // ================================================
    // opções
    // ================================================
    updateOpcoes: (pad, cfg) => UiOptions.update(pad, cfg),
    // ================================================
    // DRAW opções
    // ================================================
    drawOpcoes: (font, cfg) => UiOptions.draw(font, cfg)
};