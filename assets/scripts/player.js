import { CONF } from "./config.js";

export class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;
        
        // --- ESTADOS FÍSICOS ---
        this.noChao = false;
        this.lado = 1;
        
        // Pulo
        this.pulosRestantes = 0;
        this.puloBloqueado = false;

        // Dash (Adicionado)
        this.dashesRestantes = 0;
        this.timerDash = 0;     // Tempo que dura o dash ativo
        this.timerDashCool = 0; // Tempo de recarga (Cooldown)
        this.dashBloqueado = false; // Trava do botão Quadrado

        // --- VISUAL ---
        this.sprite = new Image("assets/sprites/player/Player_Sheet.png");
        this.estadoAnim = 'parado';
        this.frameAtual = 0;
        this.timerAnim = 0;

        // Configuração dos Frames (Incluindo o Dash no frame 18)
        this.animacoes = {
            parado:   { inicio: 0,  fim: 6,   vel: 5 },
            andando:  { inicio: 7,  fim: 18,  vel: 3 },
            pulo:     { inicio: 16, fim: 16,  vel: 10 },
            caindo:   { inicio: 17, fim: 17,  vel: 10 },
            dash:     { inicio: 18, fim: 18,  vel: 1 } // Adicionado
        };
        
        this.frameAtual = this.animacoes['parado'].inicio;
    }

    update(pad) {
        // ==================================================
        // 1. PROCESSAR DASH (Prioridade Máxima)
        // ==================================================
        
        // Diminui o Cooldown se tiver
        if (this.timerDashCool > 0) this.timerDashCool--;

        // Se o Dash estiver ATIVO (acontecendo agora)
        if (this.timerDash > 0) {
            this.timerDash--;
            this.estadoAnim = 'dash';
            
            // Velocidade Alta na direção que o boneco olha
            this.vx = CONF.DASH_SPEED * this.lado;
            this.vy = 0; // Gravidade zero durante o dash (voa reto)
            
            // Aplica movimento direto e SAI da função (pula gravidade e controle)
            this.x += this.vx;
            this.aplicarColisaoChao(); // Só pra garantir que não atravesse paredes/chão
            return; 
        }

        // ==================================================
        // 2. INPUTS NORMAIS (Só funcionam se não estiver dando dash)
        // ==================================================
        
        this.vx = 0;
        let moveu = false;

        // --- Botão QUADRADO (Ativar Dash) ---
        if (pad.btns & Pads.SQUARE) {
            if (!this.dashBloqueado && this.timerDashCool <= 0) {
                // Pode dar dash? (Se tiver no chão OU tiver dashes aéreos sobrando)
                let podeDash = this.noChao || (this.dashesRestantes > 0);
                
                if (podeDash) {
                    this.timerDash = CONF.DASH_TIME;     // Começa o Dash
                    this.timerDashCool = CONF.DASH_COOL; // Ativa Cooldown
                    
                    if (!this.noChao) {
                        this.dashesRestantes--; // Gasta dash aéreo
                    }
                }
                this.dashBloqueado = true; // Trava o botão
            }
        } else {
            this.dashBloqueado = false; // Destrava quando solta
        }

        // --- Botão ESQUERDA / DIREITA ---
        if (pad.btns & Pads.RIGHT) {
            this.vx = CONF.VELOCIDADE;
            this.lado = 1;
            moveu = true;
        } 
        else if (pad.btns & Pads.LEFT) {
            this.vx = -CONF.VELOCIDADE;
            this.lado = -1;
            moveu = true;
        }

        // --- Botão X (Pulo) ---
        if (pad.btns & Pads.CROSS) {
            if (!this.puloBloqueado && this.pulosRestantes > 0) {
                this.vy = CONF.PULO_FORCA;
                this.pulosRestantes--;
                this.noChao = false;
                this.puloBloqueado = true;
            }
        } else {
            this.puloBloqueado = false;
        }

        // ==================================================
        // 3. FÍSICA PADRÃO
        // ==================================================
        
        this.vy += CONF.GRAVIDADE;
        this.x += this.vx;
        this.y += this.vy;

        this.aplicarColisaoChao();

        // ==================================================
        // 4. SISTEMA DE ANIMAÇÃO
        // ==================================================
        if (!this.noChao) {
            if (this.vy < 0) this.estadoAnim = 'pulo';
            else this.estadoAnim = 'caindo';
        } 
        else if (moveu) {
            this.estadoAnim = 'andando';
        } 
        else {
            this.estadoAnim = 'parado';
        }
    }

    // Função separada pra não repetir código
    aplicarColisaoChao() {
        if (this.y >= CONF.CHAO_Y - (32 * CONF.ESCALA)) {
            this.y = CONF.CHAO_Y - (32 * CONF.ESCALA);
            this.vy = 0;
            this.noChao = true;
            
            // Reseta contadores ao tocar no chão
            this.pulosRestantes = CONF.PULOS_MAX;
            this.dashesRestantes = CONF.DASH_AEREO; 
        }
    }

    draw() {
        // Lógica de animação igual a anterior
        const anim = this.animacoes[this.estadoAnim];

        this.timerAnim++;
        if (this.timerAnim > anim.vel) {
            this.frameAtual++;
            this.timerAnim = 0;
        }

        if (this.frameAtual > anim.fim || this.frameAtual < anim.inicio) {
            this.frameAtual = anim.inicio;
        }

        let colunasSheet = 16; 
        let col = this.frameAtual % colunasSheet;
        let lin = Math.floor(this.frameAtual / colunasSheet);
        let tamanhoOriginal = 32;

        let recorteX = col * tamanhoOriginal;
        let recorteY = lin * tamanhoOriginal;

        if (this.lado === 1) {
            this.sprite.startx = recorteX;
            this.sprite.endx = recorteX + tamanhoOriginal;
        } else {
            this.sprite.startx = recorteX + tamanhoOriginal;
            this.sprite.endx = recorteX;
        }
        
        this.sprite.starty = recorteY;
        this.sprite.endy = recorteY + tamanhoOriginal;
        
        this.sprite.width = tamanhoOriginal * CONF.ESCALA;
        this.sprite.height = tamanhoOriginal * CONF.ESCALA;

        this.sprite.draw(this.x, this.y);
    }
}