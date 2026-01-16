// assets/scripts/debug.js
import { COLORS, CONF } from "./config.js";

export const DebugSystem = {
    // Variáveis internas para cálculo de FPS
    contadorFrames: 0,
    ultimoTempo: Date.now(),
    fps: 0,

    // Chama isso todo frame no main.js
    update: function() {
        this.contadorFrames++;
        let agora = Date.now();
        if (agora - this.ultimoTempo >= 1000) {
            this.fps = this.contadorFrames;
            this.contadorFrames = 0;
            this.ultimoTempo = agora;
        }
    },
    
    // Desenha na tela
    draw: function(font, ninja, config) {
        if (!font) return;

        // --- 1. MODO DEBUG (Informações do Ninja) ---
        if (config.debug) {
            font.scale = 0.7;
            font.color = COLORS.WHITE;
            
            font.print(10, 20, "X: " + Math.floor(ninja.x) + " Y: " + Math.floor(ninja.y));
            font.print(10, 40, "Anim: " + ninja.estadoAnim);
            font.print(10, 60, "Pulos: " + ninja.pulosRestantes);
            
            // Hitbox Verde Transparente
            let tamanhoReal = 32 * CONF.ESCALA;
            Draw.rect(ninja.x, ninja.y, tamanhoReal, tamanhoReal, Color.new(0, 255, 0, 80));
        }

        // --- 2. MONITOR DE PERFORMANCE (FPS + RAM + VRAM) ---
        if (config.showFPS) {
            let ramTexto = "RAM: N/A";
            let vramTexto = "VRAM: N/A";
            
            // --- CÁLCULO DA RAM (32MB Total) ---
            try {
                if (System.getMemoryStats) {
                    let stats = System.getMemoryStats();
                    if (stats) {
                        let ramUsada = (stats.used / 1048576).toFixed(2);
                        ramTexto = "RAM: " + ramUsada + " / 32.00 MB";
                        
                        // Muda cor se a RAM estiver crítica (> 28MB)
                        if (stats.used > 29360128) font.color = Color.new(255, 0, 0); 
                        else font.color = Color.new(0, 255, 0); 
                    }
                }
            } catch(e) {}

            // --- CÁLCULO DA VRAM (4MB Total) ---
            try {
                // Screen.getFreeVRAM retorna bytes livres na GPU
                if (Screen.getFreeVRAM) {
                    let vramLivre = Screen.getFreeVRAM();
                    let vramTotal = 4194304; // 4MB em bytes
                    let vramUsada = vramTotal - vramLivre;
                    
                    let vramMB = (vramUsada / 1048576).toFixed(2); // Converte pra MB
                    vramTexto = "VRAM: " + vramMB + " / 4.00 MB";
                }
            } catch(e) {}

            font.scale = 0.8; 
            
            // FPS (Ciano)
            font.color = Color.new(0, 255, 255); 
            font.print(500, 20, "FPS: " + this.fps);
            
            // RAM (Cor definida pelo uso)
            // A cor já foi setada no bloco da RAM, ou padrão verde se falhou
            font.print(450, 40, ramTexto);

            // VRAM (Amarelo ou Roxo pra destacar)
            font.color = Color.new(255, 0, 255); // Roxo claro (Magenta)
            font.print(450, 60, vramTexto);
        }
    }
};