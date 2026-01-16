import { CONF } from "../systems/config.js";

export class Player {
    constructor(x, y) {
        this.reset(x, y); // Reaproveita a lógica de reset no inicio

        // --- VISUAL (Carrega uma vez só) ---
        this.sprite = new Image("assets/sprites/player/Player_Sheet.png");
        
        // Configuração dos Frames
        this.animacoes = {
            parado:   { inicio: 0,  fim: 6,   vel: 5 },
            andando:  { inicio: 7,  fim: 18,  vel: 3 },
            pulo:     { inicio: 16, fim: 16,  vel: 10 },
            caindo:   { inicio: 17, fim: 17,  vel: 10 },
            dash:     { inicio: 18, fim: 18,  vel: 1 }
        };
    }

    // --- NOVO MÉTODO RESET (Pra usar no main.js) ---
    reset(x, y) {
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;
        
        // Estados Físicos
        this.noChao = false;
        this.lado = 1;
        
        // Pulo
        this.pulosRestantes = 0;
        this.puloBloqueado = false; // Começa destravado, mas o main.js pode travar

        // Dash
        this.dashesRestantes = 0;
        this.timerDash = 0;    
        this.timerDashCool = 0; 
        this.dashBloqueado = false; 

        // Visual
        this.estadoAnim = 'parado';
        this.frameAtual = 0;
        this.timerAnim = 0;
    }

    update(pad) {
        // ==================================================
        // 1. PROCESSAR DASH (Prioridade Máxima)
        // ==================================================
        if (this.timerDashCool > 0) this.timerDashCool--;

        if (this.timerDash > 0) {
            this.timerDash--;
            this.estadoAnim = 'dash';
            this.vx = CONF.DASH_SPEED * this.lado;
            this.vy = 0; 
            this.x += this.vx;
            this.aplicarColisaoChao(); 
            return; 
        }

        // ==================================================
        // 2. CORREÇÃO DO "INPUT BLEED" (Trava do Pulo)
        // ==================================================
        // Se estiver bloqueado, SÓ libera se soltar o botão X
        if (this.puloBloqueado) {
            if (!(pad.btns & Pads.CROSS)) {
                this.puloBloqueado = false; // Soltou o botão, pode liberar
            }
        }

        this.vx = 0;
        let moveu = false;

        // --- Botão QUADRADO (Dash) ---
        if (pad.btns & Pads.SQUARE) {
            if (!this.dashBloqueado && this.timerDashCool <= 0) {
                let podeDash = this.noChao || (this.dashesRestantes > 0);
                
                if (podeDash) {
                    this.timerDash = CONF.DASH_TIME; 
                    this.timerDashCool = CONF.DASH_COOL; 
                    if (!this.noChao) this.dashesRestantes--; 
                }
                this.dashBloqueado = true; 
            }
        } else {
            this.dashBloqueado = false; 
        }

        // --- Movimento ---
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
        // AQUI ESTAVA O ERRO! Tirei o "else { this.puloBloqueado = false }"
        if (pad.btns & Pads.CROSS) {
            // Só pula se NÃO estiver bloqueado
            if (!this.puloBloqueado && this.pulosRestantes > 0) {
                this.vy = CONF.PULO_FORCA;
                this.pulosRestantes--;
                this.noChao = false;
                
                // Trava imediatamente após pular
                this.puloBloqueado = true; 
            }
        } 
        // REMOVIDO: else { this.puloBloqueado = false; }
        // Motivo: A liberação agora é feita exclusivamente no bloco "2." lá em cima.

        // ==================================================
        // 3. FÍSICA
        // ==================================================
        this.vy += CONF.GRAVIDADE;
        this.x += this.vx;
        this.y += this.vy;

        this.aplicarColisaoChao();

        // ==================================================
        // 4. ANIMAÇÃO
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

    aplicarColisaoChao() {
        if (this.y >= CONF.CHAO_Y - (32 * CONF.ESCALA)) {
            this.y = CONF.CHAO_Y - (32 * CONF.ESCALA);
            this.vy = 0;
            this.noChao = true;
            this.pulosRestantes = CONF.PULOS_MAX;
            this.dashesRestantes = CONF.DASH_AEREO; 
        }
    }

    draw() {
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