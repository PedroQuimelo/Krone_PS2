// scripts/config.js

// Adicionei o 'export' antes do const para os outros arquivos poderem ler
export const CONF = {
    // Tela
    SCREEN_W: 640,
    SCREEN_H: 448,
    TILE_SIZE: 32,
    ESCALA: 2.0, // Atenção: Escala 2.0 vai deixar o boneco com 64px de altura (32*2)

    // Física
    GRAVIDADE: 0.5,
    CHAO_Y: 400,

    // Jogador
    VELOCIDADE: 3,
    PULO_FORCA: -10,
    PULO_CORTE: 0.5,
    PULOS_MAX: 2,
    
    // Dash
    DASH_SPEED: 8,
    DASH_TIME: 10,
    DASH_COOL: 30,
    DASH_AEREO: 1
};

// Cores (Globais)
export const COLORS = {
    WHITE: Color.new(255, 255, 255),
    YELLOW: Color.new(255, 255, 0),
    GREEN: Color.new(0, 255, 0),
    DEBUG: Color.new(255, 0, 255),
    // Adicionei essas duas pra evitar erro no main.js se você usar meu exemplo anterior:
    AZUL_FUNDO: Color.new(0, 0, 50),
    VERMELHO: Color.new(255, 0, 0)
};