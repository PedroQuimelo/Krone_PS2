// === 1. CONFIGURAÇÃO INICIAL ===
const configTela = Screen.getMode();
configTela.width = 640;
configTela.height = 448;
Screen.setMode(configTela);
Screen.setVSync(true);

// === 2. IMPORTS ===
import { Player } from "./assets/scripts/player.js";
import { CONF, COLORS } from "./assets/scripts/config.js";
import { SaveSystem } from "./assets/scripts/save.js";
import { Notificacao, Conquistas } from "./assets/scripts/achievements.js"; 
import { MenuSystem } from "./assets/scripts/menu.js";
import { DebugSystem } from "./assets/scripts/debug.js"; 
import { UiSave } from "./assets/scripts/menus/ui_save.js";
import { UiOptions } from "./assets/scripts/menus/ui_options.js";

// === CONFIGURAÇÕES GLOBAIS ===
const GameConfig = {
    debug: false,
    showFPS: true 
};

// (REMOVI AS VARIÁVEIS DE FPS DAQUI)

const pad = Pads.get();
const ninja = new Player(100, 300);

// Inicialização
Conquistas.carregar(); 
let timerMensagemSalvo = 0;
const fonte = new Font("assets/fonts/mania.ttf"); 

const InputWrapper = {
    atual: 0, anterior: 0,
    update: function(padOriginal) {
        this.anterior = this.atual;
        this.atual = padOriginal.btns;
    },
    justPressed: function(botao) {
        return (this.atual & botao) && !(this.anterior & botao);
    }
};

const STATE = { MENU: 0, DISPOSITIVO: 1, SLOTS: 2, JOGO: 3, CONQUISTAS: 4, CONFIRMACAO: 5, OPCOES: 6 };
let estadoAtual = STATE.MENU;
let modoSlot = ""; 
let slotParaAcao = -1;
let tipoConfirmacao = "";

function iniciarNovoJogo(slot) {
    ninja.x = 100; ninja.y = 300;
    ninja.vx = 0; ninja.vy = 0; 
    ninja.estadoAnim = 'parado';
    ninja.puloBloqueado = true; 
    let dadosIniciais = { x: ninja.x, y: ninja.y }; 
    SaveSystem.salvar(slot, dadosIniciais);
    estadoAtual = STATE.JOGO;
}

Screen.display(() => {
    // --- ATUALIZA DEBUG ---
    DebugSystem.update(); // O Debug agora se vira pra contar FPS

    pad.update();
    InputWrapper.update(pad); 
    Screen.clear(COLORS.AZUL_FUNDO);

    switch(estadoAtual) {
        
        case STATE.MENU:
            MenuSystem.draw(fonte);
            let acao = MenuSystem.update(InputWrapper); 
            
            if (acao === "NOVO") {
                modoSlot = "NOVO";
                UiSave.cursorCard = 0;
                estadoAtual = STATE.DISPOSITIVO;
            } 
            else if (acao === "CARREGAR") {
                modoSlot = "CARREGAR";
                UiSave.cursorCard = 0
                estadoAtual = STATE.DISPOSITIVO;
            }
            else if (acao === "OPCOES") {
                estadoAtual = STATE.OPCOES;
            }
            else if (acao === "CONQUISTAS") {
                estadoAtual = STATE.CONQUISTAS;
            }
            else if (acao === "SAIR") {
                System.exitToBrowser();;
            }
            break;

        case STATE.OPCOES:
            MenuSystem.drawOpcoes(fonte, GameConfig);
            let mudanca = MenuSystem.updateOpcoes(InputWrapper, GameConfig);
            if (mudanca === "VOLTAR") estadoAtual = STATE.MENU;
            break;

        case STATE.DISPOSITIVO:
            MenuSystem.drawDispositivo(fonte);
            let mc = MenuSystem.updateDispositivo(InputWrapper);
            if (mc === "VOLTAR") estadoAtual = STATE.MENU;
            else if (typeof mc === "number") {
                SaveSystem.definirUnidade(mc);
                SaveSystem.escanearSlots(); 
                UiSave.cursorSlot = 0;
                estadoAtual = STATE.SLOTS;
            }
            break;

        case STATE.SLOTS:
            MenuSystem.drawSlots(fonte, modoSlot);
            let slot = MenuSystem.updateSlots(InputWrapper, modoSlot);
            if (slot === "VOLTAR") estadoAtual = STATE.DISPOSITIVO;
            else if (typeof slot === "number") {
                SaveSystem.definirSlot(slot);
                if (modoSlot === "NOVO") {
                    if (SaveSystem.slots[slot].existe) { slotParaAcao = slot; tipoConfirmacao = "SOBRESCREVER"; estadoAtual = STATE.CONFIRMACAO; } 
                    else { iniciarNovoJogo(slot); }
                } else if (modoSlot === "CARREGAR") {
                    if (UiSave.colunaAtual === 1) { slotParaAcao = slot; tipoConfirmacao = "EXCLUIR"; estadoAtual = STATE.CONFIRMACAO; } 
                    else {
                        let dados = SaveSystem.carregar(slot);
                        if (dados) {
                            ninja.x = dados.x || 100; ninja.y = dados.y || 300;
                            ninja.vy = 0; ninja.vx = 0; ninja.estadoAnim = 'parado'; 
                            ninja.noChao = false; ninja.puloBloqueado = true;
                            estadoAtual = STATE.JOGO;
                        }
                    }
                }
            }
            break;

        case STATE.CONFIRMACAO:
            MenuSystem.drawSlots(fonte, modoSlot);
            let titulo = "", msg = "";
            if (tipoConfirmacao === "SOBRESCREVER") { titulo = "SOBRESCREVER SLOT " + (slotParaAcao + 1) + "?"; msg = "O progresso atual sera perdido."; } 
            else { titulo = "APAGAR SLOT " + (slotParaAcao + 1) + "?"; msg = "Essa acao nao tem volta."; }
            MenuSystem.drawConfirmacao(fonte, titulo, msg);
            if (InputWrapper.justPressed(Pads.CROSS)) {
                if (tipoConfirmacao === "SOBRESCREVER") iniciarNovoJogo(slotParaAcao);
                else { SaveSystem.excluir(slotParaAcao); estadoAtual = STATE.SLOTS; }
            }
            if (InputWrapper.justPressed(Pads.CIRCLE)) estadoAtual = STATE.SLOTS;
            break;

        case STATE.JOGO:
            ninja.update(pad); 
            Notificacao.update();

            if (ninja.estadoAnim === 'pulo') Conquistas.desbloquear("PULO_1");
            if (ninja.estadoAnim === 'dash') Conquistas.desbloquear("DASH_1");

            Draw.rect(0, CONF.CHAO_Y, 640, 50, COLORS.VERMELHO);
            ninja.draw();
            Notificacao.draw(fonte);
            
            // --- CHAMADA DO DEBUG ---
            // Não precisamos mais passar 'fps' aqui, ele pega interno
            DebugSystem.draw(fonte, ninja, GameConfig);

            if (pad.btns & Pads.SELECT) {
                SaveSystem.salvar(SaveSystem.slotAtual || 0, { x: ninja.x, y: ninja.y });
                SaveSystem.salvarConquistas(Conquistas.lista);
                timerMensagemSalvo = 120;
            }

            if (timerMensagemSalvo > 0) {
                timerMensagemSalvo--;
                if (fonte) {
                    fonte.scale = 1.0; fonte.color = COLORS.YELLOW;
                    fonte.print(500, 400, "JOGO SALVO!");
                }
            }

            if (pad.btns & Pads.START) {
                SaveSystem.salvar(SaveSystem.slotAtual || 0, { x: ninja.x, y: ninja.y });
                SaveSystem.salvarConquistas(Conquistas.lista);
                MenuSystem.cursor = 0; 
                estadoAtual = STATE.MENU;
            }
            break;
            
        case STATE.CONQUISTAS:
            MenuSystem.drawConquistas(fonte);
            
            // --- NOVA LÓGICA DE UPDATE ---
            // Agora quem cuida de voltar e rolar é o MenuSystem
            let acaoConq = MenuSystem.updateConquistas(InputWrapper);
            
            if (acaoConq === "VOLTAR") {
                 estadoAtual = STATE.MENU;
            }
            break;
    }
});