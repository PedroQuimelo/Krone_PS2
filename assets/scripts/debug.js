const DebugSystem = {
    contadorFrames: 0,
    ultimoTempo: 0,
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

    draw: function(font) {
        // Pega stats
        let stats = System.getMemoryStats();
        let ramUsada = (stats.used / 1048576).toFixed(2);
        
        font.scale = 0.7;
        font.color = Color.new(255, 255, 0); // Amarelo
        font.print(10, 15, "FPS: " + this.fps);

        if (stats.used > 29360128) font.color = Color.new(255, 0, 0); // Vermelho
        else font.color = Color.new(0, 255, 0); // Verde

        font.print(10, 35, "RAM: " + ramUsada + " / 32.00 MB");
    }
};