import { CONF } from "./config.js";
import { PALETA } from "../data/palette.js"; 

// Cor específica do Debug (criada fora pra não gerar lixo na memória)
const COR_HITBOX = Color.new(0, 255, 0, 80);

export const DebugSystem = {
    contadorFrames: 0,
    ultimoTempo: Date.now(),
    fps: 0,

    update: function() {
        this.contadorFrames++;
        let agora = Date.now();
        if (agora - this.ultimoTempo >= 1000) {
            this.fps = this.contadorFrames;
            this.contadorFrames = 0;
            this.ultimoTempo = agora;
        }
    },
    
    draw: function(font, ninja, config) {
        if (!font) return;

        // --- 1. MODO DEBUG (Informações do Ninja) ---
        if (config.debug) {
            font.scale = 0.7;
            font.color = PALETA.BRANCO; // Usando Paleta
            
            font.print(10, 20, "X: " + Math.floor(ninja.x) + " Y: " + Math.floor(ninja.y));
            font.print(10, 40, "Anim: " + ninja.estadoAnim);
            font.print(10, 60, "Pulos: " + ninja.pulosRestantes);
            
            // Hitbox (Usa a constante criada lá em cima)
            let tamanhoReal = 32 * CONF.ESCALA;
            Draw.rect(ninja.x, ninja.y, tamanhoReal, tamanhoReal, COR_HITBOX);
        }

        // --- 2. MONITOR DE PERFORMANCE ---
        if (config.showFPS) {
            let ramTexto = "RAM: N/A";
            let vramTexto = "VRAM: N/A";
            let corRam = PALETA.VERDE; // Padrão Verde
            
            // RAM
            try {
                if (System.getMemoryStats) {
                    let stats = System.getMemoryStats();
                    if (stats) {
                        let ramUsada = (stats.used / 1048576).toFixed(2);
                        ramTexto = "RAM: " + ramUsada + " / 32.00 MB";
                        if (stats.used > 29360128) corRam = PALETA.VERMELHO; 
                    }
                }
            } catch(e) {}

            // VRAM
            try {
                if (Screen.getFreeVRAM) {
                    let vramLivre = Screen.getFreeVRAM();
                    let vramTotal = 4194304; 
                    let vramUsada = vramTotal - vramLivre;
                    let vramMB = (vramUsada / 1048576).toFixed(2);
                    vramTexto = "VRAM: " + vramMB + " / 4.00 MB";
                }
            } catch(e) {}

            font.scale = 0.8; 
            
            // FPS (Ciano da Paleta)
            font.color = PALETA.CIANO; 
            font.print(500, 20, "FPS: " + this.fps);
            
            // RAM
            font.color = corRam;
            font.print(450, 40, ramTexto);

            // VRAM (Magenta da Paleta)
            font.color = PALETA.MAGENTA; 
            font.print(450, 60, vramTexto);
        }
    }
};