// assets/scripts/palette.js

// Definimos as cores aqui para serem criadas APENAS UMA VEZ na memória.
export const PALETA = {
    // Cores Básicas
    AMARELO: Color.new(255, 255, 0),
    BRANCO:  Color.new(255, 255, 255),
    CINZA:   Color.new(100, 100, 100),
    CINZA_ESCURO: Color.new(150, 150, 150),
    PRETO_TRANSPARENTE: Color.new(0, 0, 0, 200), // Dimmer

    // Cores da Interface de Conquistas
    FUNDO_SEL:   Color.new(80, 20, 0),
    FUNDO_PAR:   Color.new(40, 0, 0),
    FUNDO_IMPAR: Color.new(60, 20, 20),
    
    // Cores do Card de Detalhes (Estilo PS4)
    CARD_BG:     Color.new(30, 30, 35),
    CARD_BORDA:  Color.new(200, 200, 200),
    ICON_BG:     Color.new(10, 10, 15),
    
    // Status
    SUCESSO: Color.new(0, 255, 0),
    ERRO:    Color.new(255, 50, 50),

    // Fundos de Telas
    BG_CONQ:  Color.new(20, 0, 0),
    BG_GERAL: Color.new(20, 20, 40),
    BG_MC:    Color.new(10, 10, 30),
    BG_SLOTS: Color.new(10, 30, 10)
};