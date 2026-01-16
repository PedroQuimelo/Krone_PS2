// assets/scripts/states/state_game.js
import { Player } from "../entities/player.js";
import { CONF } from "../systems/config.js";
import { PALETA } from "../data/palette.js";
import { DebugSystem } from "../systems/debug.js";
import { SaveSystem } from "../systems/save.js";
import { Notificacao, Conquistas } from "../achievements.js";
import { GameManager } from "../core/game_manager.js";

// Para voltar ao menu, precisaremos importá-lo depois (Dynamic Import ou referência circular)
// Por enquanto, vamos focar no jogo rodando.

const ninja = new Player(100, 300);

export const StateGame = {
    
    // params = { x, y, carregar: boolean }
    enter: function(params) {
        console.log("Entrando no Jogo...");
        
        if (params) {
            ninja.reset(params.x || 100, params.y || 300);
            // Se carregou de um save, bloqueia o pulo pra evitar Input Bleed
            ninja.puloBloqueado = true; 
        } else {
            ninja.reset(100, 300);
        }
    },

    update: function(inputWrapper) {
        // Pega o pad atualizado
        const pad = Pads.get(); 
        
        ninja.update(pad);
        Notificacao.update();
        DebugSystem.update();

        // Conquistas
        if (ninja.estadoAnim === 'pulo') Conquistas.desbloquear("PULO_1");
        if (ninja.estadoAnim === 'dash') Conquistas.desbloquear("DASH_1");

        // Atalhos de Sistema
        if (pad.btns & Pads.START) {
            // Aqui futuramente chamaremos GameManager.mudarEstado(StateMenu)
            // Por enquanto, só salva pra testar
            SaveSystem.salvar(SaveSystem.slotAtual || 0, { x: ninja.x, y: ninja.y });
            Notificacao.mostrar("Salvo", "Jogo salvo com sucesso");
        }
    },

    draw: function(font) {
        // Chão (Debug)
        Draw.rect(0, CONF.CHAO_Y, 640, 50, PALETA.VERMELHO);
        
        ninja.draw();
        Notificacao.draw(font);
        
        // UI Debug
        DebugSystem.draw(font, ninja, { debug: false, showFPS: true });
    },

    exit: function() {
        console.log("Saindo do Jogo...");
        // Aqui você poderia limpar memória de texturas se necessário
    }
};