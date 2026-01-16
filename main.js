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

// === 3. INICIALIZAÇÃO ===
const pad = Pads.get();
const ninja = new Player(100, 300);

// Variável para mostrar mensagem de "Salvo" temporária
let timerMensagemSalvo = 0;

// Fonte
const fonte = new Font("assets/fonts/mania.ttf"); 

// --- HELPER DE INPUT PARA O MENU ---
const InputWrapper = {
    atual: 0,
    anterior: 0,
    update: function(padOriginal) {
        this.anterior = this.atual;
        this.atual = padOriginal.btns;
    },
    justPressed: function(botao) {
        return (this.atual & botao) && !(this.anterior & botao);
    }
};

// --- MÁQUINA DE ESTADOS ---
const STATE = { MENU: 0, DISPOSITIVO: 1, SLOTS: 2, JOGO: 3, CONQUISTAS: 4 };
let estadoAtual = STATE.MENU;
let modoSlot = ""; 

// === LOOP DO JOGO ===
Screen.display(() => {
    pad.update();
    InputWrapper.update(pad); 

    Screen.clear(COLORS.AZUL_FUNDO);

    switch(estadoAtual) {
        
        // --- 1. MENU PRINCIPAL ---
        case STATE.MENU:
            MenuSystem.draw(fonte);
            let acao = MenuSystem.update(InputWrapper); 
            
            if (acao === "NOVO") {
                modoSlot = "NOVO";
                estadoAtual = STATE.DISPOSITIVO;
            } 
            else if (acao === "CARREGAR") {
                modoSlot = "CARREGAR";
                estadoAtual = STATE.DISPOSITIVO;
            }
            else if (acao === "CONQUISTAS") {
                estadoAtual = STATE.CONQUISTAS;
            }
            else if (acao === "SAIR") {
                System.exitToBrowser(); // Tchau brigado! Encerra o script.
            }
            break;

        // --- 2. ESCOLHA DO MEMORY CARD ---
        case STATE.DISPOSITIVO:
            MenuSystem.drawDispositivo(fonte);
            let mc = MenuSystem.updateDispositivo(InputWrapper);
            
            if (mc === "VOLTAR") estadoAtual = STATE.MENU;
            else if (typeof mc === "number") {
                SaveSystem.definirUnidade(mc);
                SaveSystem.escanearSlots(); 
                MenuSystem.cursorSlot = 0;
                estadoAtual = STATE.SLOTS;
            }
            break;

        // --- 3. ESCOLHA DO SLOT ---
        case STATE.SLOTS:
            MenuSystem.drawSlots(fonte, modoSlot);
            let slot = MenuSystem.updateSlots(InputWrapper, modoSlot);

            if (slot === "VOLTAR") estadoAtual = STATE.DISPOSITIVO;
            else if (typeof slot === "number") {
                SaveSystem.definirSlot(slot);
                
                // === NOVO JOGO ===
                if (modoSlot === "NOVO") {
                     ninja.x = 100; ninja.y = 300;
                     // Zera velocidades para ele não nascer correndo/pulando
                     ninja.vx = 0; ninja.vy = 0; 
                     ninja.estadoAnim = 'parado';
                     ninja.puloBloqueado = true;
                     
                     // Zera conquistas visualmente
                     for (let key in Conquistas.lista) {
                        Conquistas.lista[key].feito = false;
                     }
                     
                     let dadosIniciais = { x: ninja.x, y: ninja.y, conquistas: Conquistas.lista };
                     SaveSystem.salvar(slot, dadosIniciais);
                     estadoAtual = STATE.JOGO;
                } 
                // === CARREGAR ===
                else if (modoSlot === "CARREGAR") {
                    if (MenuSystem.colunaAtual === 1) {
                        SaveSystem.excluir(slot); // Deletar
                    } else {
                        // Carregar
                        let dados = SaveSystem.carregar(slot);
                        if (dados) {
                            ninja.x = dados.x || 100;
                            ninja.y = dados.y || 300;
                            
                            // --- CORREÇÃO DO PULO ---
                            ninja.vy = 0; // Zera velocidade vertical (para de cair/pular)
                            ninja.vx = 0; // Zera velocidade horizontal
                            ninja.estadoAnim = 'parado'; // Força animação de chão
                            ninja.noChao = false; // Deixa a física detectar o chão no próximo frame
                            ninja.puloBloqueado = true;
                            
                            if (dados.conquistas) {
                                Conquistas.lista = dados.conquistas;
                            }
                            estadoAtual = STATE.JOGO;
                        }
                    }
                }
            }
            break;

        // --- 4. JOGO RODANDO ---
        case STATE.JOGO:
            ninja.update(pad); 
            Notificacao.update();

            // Checar Conquistas
            if (ninja.estadoAnim === 'pulo') Conquistas.desbloquear("PULO_1");
            if (ninja.estadoAnim === 'dash') Conquistas.desbloquear("DASH_1");

            // Desenhar
            Draw.rect(0, CONF.CHAO_Y, 640, 50, COLORS.VERMELHO);
            ninja.draw();
            Notificacao.draw(fonte);

            // --- BOTÃO SELECT (SALVAR RAPIDO) ---
            if (pad.btns & Pads.SELECT) {
                // Salva sem sair do jogo
                SaveSystem.salvar(SaveSystem.slotAtual || 0, {
                    x: ninja.x, y: ninja.y, conquistas: Conquistas.lista
                });
                timerMensagemSalvo = 120; // Mostra mensagem por 2 segundos (60fps * 2)
            }

            // Mostra mensagem "JOGO SALVO" se o timer estiver ativo
            if (timerMensagemSalvo > 0) {
                timerMensagemSalvo--;
                if (fonte) {
                    fonte.scale = 1.0;
                    fonte.color = COLORS.YELLOW;
                    fonte.print(500, 400, "JOGO SALVO!");
                }
            }

            // --- BOTÃO START (ABRIR MENU / PAUSE) ---
            if (pad.btns & Pads.START) {
                // Antes de sair, garante que salvou? (Opcional, mas seguro)
                SaveSystem.salvar(SaveSystem.slotAtual || 0, {
                    x: ninja.x, y: ninja.y, conquistas: Conquistas.lista
                });
                
                estadoAtual = STATE.MENU; // Vai para a tela inicial
            }
            break;
            
        // --- 5. TELA DE TROFÉUS ---
        case STATE.CONQUISTAS:
            MenuSystem.drawConquistas(fonte);
            if (InputWrapper.justPressed(Pads.CIRCLE) || (pad.btns & Pads.CIRCLE)) {
                 estadoAtual = STATE.MENU;
            }
            break;
    }
});