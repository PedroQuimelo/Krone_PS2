// scripts/achievements.js
import { SaveSystem } from "./systems/save.js"; // Importa pra poder salvar global
import { LISTA_CONQUISTAS } from "./data/data_achievements.js"; // <--- Importa os dados

// Caminho corrigido baseado no seu print
// assets/sprites/achiviments_png/trofy_gold.png
const imgTrofeu = new Image("assets/sprites/UI/trofy_gold.png");

const POPUP_CONF = {
    Y_FIXO: 10, X_ALVO: 10, X_INICIAL: -300,
    LARGURA: 315, ALTURA: 55,
    COR_FUNDO: Color.new(10, 10, 10, 240),
    COR_BORDA: Color.new(255, 255, 255, 50),
    TEMPO_TELA: 180, VELOCIDADE: 8
};

// Exportando Notificacao
export const Notificacao = {
    ativo: false, estado: 0, x: POPUP_CONF.X_INICIAL,
    timer: 0, titulo: "", desc: "", fila: [],

    mostrar: function(titulo, desc) {
        this.fila.push({ t: titulo, d: desc });
    },

    update: function() {
        if (!this.ativo && this.fila.length > 0) {
            let prox = this.fila.shift();
            this.titulo = prox.t; this.desc = prox.d;
            this.ativo = true; this.estado = 1; 
            this.x = POPUP_CONF.X_INICIAL;
        }
        if (!this.ativo) return;

        // Animação Slide
        if (this.estado === 1) { // Entrando
            this.x += POPUP_CONF.VELOCIDADE;
            if (this.x >= POPUP_CONF.X_ALVO) {
                this.x = POPUP_CONF.X_ALVO; this.estado = 2; this.timer = POPUP_CONF.TEMPO_TELA;
            }
        } else if (this.estado === 2) { // Esperando
            this.timer--;
            if (this.timer <= 0) this.estado = 3;
        } else if (this.estado === 3) { // Saindo
            this.x -= POPUP_CONF.VELOCIDADE;
            if (this.x <= POPUP_CONF.X_INICIAL) {
                this.ativo = false; this.estado = 0;
            }
        }
    },

    draw: function(font) {
        if (!this.ativo) return;
        let y = POPUP_CONF.Y_FIXO;
        
        Draw.rect(this.x, y, POPUP_CONF.LARGURA, POPUP_CONF.ALTURA, POPUP_CONF.COR_FUNDO);
        Draw.rect(this.x, y, 2, POPUP_CONF.ALTURA, POPUP_CONF.COR_BORDA);
        
        // Desenha trofeu
        imgTrofeu.width = 36; imgTrofeu.height = 36;
        imgTrofeu.draw(this.x + 10, y + 7);

        // Se tiver fonte, usa. Se não, desenha placeholders
        if (font) {
            // Ajuste de cores manual pois font.color as vezes buga na v0.93
            font.print(this.x + 55, y + 10, "CONQUISTA DESBLOQUEADA!");
            font.print(this.x + 55, y + 30, this.titulo);
        }
    }
};

// Exportando Gerenciador
export const Conquistas = {
    // Agora é um ARRAY (Lista ordenada)
    lista: LISTA_CONQUISTAS,

    // --- NOVO: Carregar do MC ao iniciar ---
    carregar: function() {
        let globalData = SaveSystem.carregarConquistas();
        if (globalData && Array.isArray(globalData)) {
            // Lógica inteligente: Percorre a lista atual e só puxa o 'feito' do save
            // Assim as descrições novas não somem
            for (let i = 0; i < this.lista.length; i++) {
                // Procura esse ID no save
                for (let j = 0; j < globalData.length; j++) {
                    if (globalData[j].id === this.lista[i].id) {
                        this.lista[i].feito = globalData[j].feito;
                        break;
                    }
                }
            }
            print("Conquistas globais carregadas e sincronizadas!");
        }
    },

    desbloquear: function(idAlvo) {
        for (let i = 0; i < this.lista.length; i++) {
            if (this.lista[i].id === idAlvo) {
                let item = this.lista[i];
                if (!item.feito) {
                    item.feito = true;
                    Notificacao.mostrar(item.titulo, "Conquista Desbloqueada");
                    return true;
                }
                return false; 
            }
        }
        return false; 
    }
};