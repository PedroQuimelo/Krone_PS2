// assets/scripts/menus/ui_options.js
import { PALETA } from "../palette.js"; 

export const UiOptions = {
    // Estado interno
    cursor: 0, 
    lista: ["Debug Info", "Monitor FPS"],

    // Resetar cursor ao entrar (importante pra não lembrar a posição velha)
    reset: function() {
        this.cursor = 0;
    },

    // --- UPDATE ---
    update: function(padWrapper, configAtual) {
        // Navegar Cima/Baixo
        if (padWrapper.justPressed(Pads.UP)) { 
            this.cursor--; 
            if (this.cursor < 0) this.cursor = this.lista.length - 1; 
        }
        if (padWrapper.justPressed(Pads.DOWN)) { 
            this.cursor++; 
            if (this.cursor >= this.lista.length) this.cursor = 0; 
        }

        // Alterar Valores
        if (padWrapper.justPressed(Pads.CROSS) || padWrapper.justPressed(Pads.RIGHT)) {
            if (this.cursor === 0) configAtual.debug = !configAtual.debug;
            else if (this.cursor === 1) configAtual.showFPS = !configAtual.showFPS;
            return "ALTEROU"; 
        }

        if (padWrapper.justPressed(Pads.CIRCLE)) return "VOLTAR";
        return null;
    },

    // --- DRAW ---
    draw: function(font, configAtual) {
        Draw.rect(0, 0, 640, 448, Color.new(10, 10, 20)); // Fundo levemente azulado
        if(!font) return;

        font.scale = 1.5; font.color = PALETA.BRANCO; 
        font.print(220, 50, "CONFIGURACOES");

        for (let i = 0; i < this.lista.length; i++) {
            let y = 150 + (i * 60);
            
            // Desenha Seletor
            if (i === this.cursor) { 
                font.color = PALETA.AMARELO; font.scale = 1.2; 
                font.print(150, y, ">"); 
            } else { 
                font.color = Color.new(200, 200, 200); font.scale = 1.0; 
            }

            // Nome da Opção
            font.print(180, y, this.lista[i]);

            // Valor (ON/OFF)
            let valorTexto = "???";
            if (i === 0) valorTexto = configAtual.debug ? "< ON >" : "< OFF >";
            if (i === 1) valorTexto = configAtual.showFPS ? "< ON >" : "< OFF >";
            
            // Cor do Valor (Verde ou Vermelho)
            let corValor = (valorTexto.indexOf("ON") > -1) ? Color.new(0, 255, 0) : Color.new(255, 50, 50);
            font.color = corValor; 
            font.print(400, y, valorTexto);
        }

        font.color = PALETA.CINZA_ESCURO; font.scale = 0.8; 
        font.print(350, 400, "X: Alterar  |  O: Voltar");
    }
};