// assets/scripts/states/state_menu.js
import { MenuSystem } from "../menu.js"; // O seu Gerente de UI
import { UiSave } from "../menus/ui_save.js";
import { SaveSystem } from "../systems/save.js";
import { GameManager } from "../core/game_manager.js";
import { StateGame } from "./state_game.js"; // Importa o próximo estado

// Sub-estados internos APENAS do menu
const SUB = { HOME: 0, MC: 1, SLOTS: 2, OPCOES: 3, CONQ: 4, CONFIRM: 5 };

export const StateMenu = {
    subEstado: SUB.HOME,
    
    // Dados temporários de sessão (exclusivos do menu)
    sessao: {
        modo: "", // "NOVO" ou "CARREGAR"
        slotAlvo: -1,
        tipoConfirm: ""
    },

    enter: function() {
        this.subEstado = SUB.HOME;
        MenuSystem.cursor = 0; // Reseta cursor visual
    },

    update: function(input) {
        // Lógica baseada no Sub-Estado (Parecido com o switch antigo, mas isolado aqui)
        
        switch (this.subEstado) {
            // --- HOME ---
            case SUB.HOME:
                let acao = MenuSystem.update(input);
                if (acao === "NOVO" || acao === "CARREGAR") {
                    this.sessao.modo = acao;
                    UiSave.cursorCard = 0;
                    this.subEstado = SUB.MC;
                }
                else if (acao === "OPCOES") this.subEstado = SUB.OPCOES;
                else if (acao === "CONQUISTAS") this.subEstado = SUB.CONQ;
                else if (acao === "SAIR") System.exitToBrowser();
                break;

            // --- ESCOLHER MC ---
            case SUB.MC:
                let mc = MenuSystem.updateDispositivo(input);
                if (mc === "VOLTAR") this.subEstado = SUB.HOME;
                else if (typeof mc === "number") {
                    SaveSystem.definirUnidade(mc);
                    SaveSystem.escanearSlots();
                    UiSave.cursorSlot = 0;
                    this.subEstado = SUB.SLOTS;
                }
                break;

            // --- SLOTS (A Mágica acontece aqui) ---
            case SUB.SLOTS:
                let slot = MenuSystem.updateSlots(input, this.sessao.modo);
                
                if (slot === "VOLTAR") this.subEstado = SUB.MC;
                else if (typeof slot === "number") {
                    SaveSystem.definirSlot(slot);
                    
                    if (this.sessao.modo === "NOVO") {
                        if (SaveSystem.slots[slot].existe) {
                            this.sessao.slotAlvo = slot;
                            this.sessao.tipoConfirm = "SOBRESCREVER";
                            this.subEstado = SUB.CONFIRM;
                        } else {
                            // INICIAR JOGO NOVO!
                            this.iniciarJogo(slot);
                        }
                    } else { // CARREGAR
                        if (UiSave.colunaAtual === 1) { // Delete
                            this.sessao.slotAlvo = slot;
                            this.sessao.tipoConfirm = "EXCLUIR";
                            this.subEstado = SUB.CONFIRM;
                        } else {
                            // CARREGAR JOGO!
                            let dados = SaveSystem.carregar(slot);
                            if (dados) {
                                GameManager.mudarEstado(StateGame, dados);
                            }
                        }
                    }
                }
                break;

            // --- CONFIRMAÇÃO ---
            case SUB.CONFIRM:
                const pad = Pads.get(); // Input direto pra simplificar confirmação
                if (input.justPressed(Pads.CROSS)) {
                    if (this.sessao.tipoConfirm === "SOBRESCREVER") {
                        this.iniciarJogo(this.sessao.slotAlvo);
                    } else {
                        SaveSystem.excluir(this.sessao.slotAlvo);
                        this.subEstado = SUB.SLOTS;
                    }
                } else if (input.justPressed(Pads.CIRCLE)) {
                    this.subEstado = SUB.SLOTS;
                }
                break;

            // --- OUTRAS TELAS ---
            case SUB.OPCOES:
                // ... lógica de opções ...
                if (MenuSystem.updateOpcoes(input, {debug: false}) === "VOLTAR") this.subEstado = SUB.HOME;
                break;
                
            case SUB.CONQ:
                if (MenuSystem.updateConquistas(input) === "VOLTAR") this.subEstado = SUB.HOME;
                break;
        }
    },

    draw: function(font) {
        // Redireciona o desenho para o MenuSystem baseado no sub-estado
        if (this.subEstado === SUB.HOME) MenuSystem.draw(font);
        else if (this.subEstado === SUB.MC) MenuSystem.drawDispositivo(font);
        else if (this.subEstado === SUB.SLOTS) MenuSystem.drawSlots(font, this.sessao.modo);
        else if (this.subEstado === SUB.OPCOES) MenuSystem.drawOpcoes(font, {debug: false}); // config temp
        else if (this.subEstado === SUB.CONQ) MenuSystem.drawConquistas(font);
        else if (this.subEstado === SUB.CONFIRM) {
            MenuSystem.drawSlots(font, this.sessao.modo);
            MenuSystem.drawConfirmacao(font, "CONFIRMAR?", "Tem certeza?");
        }
    },

    // Helper interno para iniciar novo jogo
    iniciarJogo: function(slot) {
        // Dados iniciais de um novo jogo
        const dadosNovos = { x: 100, y: 300 };
        SaveSystem.salvar(slot, dadosNovos);
        
        // MUDANÇA DE ESTADO: Aqui a mágica acontece
        GameManager.mudarEstado(StateGame, dadosNovos);
    }
};