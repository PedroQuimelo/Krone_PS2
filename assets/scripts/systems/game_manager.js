// assets/scripts/core/game_manager.js

export const GameManager = {
    estadoAtual: null,

    /**
     * Troca o estado do jogo.
     * @param {Object} novoEstado - O objeto do estado (ex: StateMenu)
     * @param {Object} params - Dados opcionais para passar (ex: slot do save, vida)
     */
    mudarEstado: function(novoEstado, params) {
        // 1. Limpeza do estado anterior
        if (this.estadoAtual && this.estadoAtual.exit) {
            this.estadoAtual.exit();
        }

        // 2. Troca
        this.estadoAtual = novoEstado;

        // 3. Inicialização do novo estado (passando dados se houver)
        if (this.estadoAtual && this.estadoAtual.enter) {
            this.estadoAtual.enter(params);
        }
    },

    update: function(input) {
        if (this.estadoAtual && this.estadoAtual.update) {
            this.estadoAtual.update(input);
        }
    },

    draw: function(font) {
        if (this.estadoAtual && this.estadoAtual.draw) {
            this.estadoAtual.draw(font);
        }
    }
};