// main.js (Versão Final Refatorada)

// === CONFIGURAÇÃO ===
const configTela = Screen.getMode();
configTela.width = 640; configTela.height = 448;
Screen.setMode(configTela); Screen.setVSync(true);

// === IMPORTS ===
import { InputWrapper } from "./assets/scripts/core/input.js";
import { GameManager } from "./assets/scripts/core/game_manager.js";
import { PALETA } from "./assets/scripts/data/palette.js";
import { StateMenu } from "./assets/scripts/states/state_menu.js";

// === INICIO ===
const pad = Pads.get();
const fonte = new Font("assets/fonts/mania.ttf"); 

// Começa direto no Menu
GameManager.mudarEstado(StateMenu);

// === LOOP PRINCIPAL ===
Screen.display(() => {
    // 1. Inputs Globais
    pad.update();
    InputWrapper.update(pad); 
    
    // 2. Limpeza
    Screen.clear(PALETA.AZUL_FUNDO);

    // 3. O Gerente cuida de tudo
    GameManager.update(InputWrapper); 
    GameManager.draw(fonte);
});