// assets/scripts/save.js

export const SaveSystem = {
    unidadeAtual: "mc0:", 
    pasta: "/NINJA_TCC", 
    

    // Arquivo separado só para conquistas
    arquivoGlobal: "achievements.json",

    slots: [
        { nome: "slot_0.json", existe: false, dados: null },
        { nome: "slot_1.json", existe: false, dados: null },
        { nome: "slot_2.json", existe: false, dados: null }
    ],

    // --- CONFIG ---
    definirUnidade: function(slot) {
        this.unidadeAtual = "mc" + parseInt(slot) + ":";
    },

    definirSlot: function(numero) {
        this.slotAtual = numero;
    },

    getCaminhoPasta: function() {
        return this.unidadeAtual + this.pasta;
    },

    getCaminhoArquivo: function(indice) {
        return this.getCaminhoPasta() + "/" + this.slots[indice].nome;
    },

    // Caminho do arquivo de conquistas
    getCaminhoGlobal: function() {
        return this.getCaminhoPasta() + "/" + this.arquivoGlobal;
    },


    // --- FUNÇÕES GLOBAIS (CONQUISTAS) ---
    salvarConquistas: function(dadosConquistas) {
        const caminho = this.getCaminhoGlobal();
        const textoJSON = JSON.stringify(dadosConquistas);

        try {
            if (typeof os !== 'undefined' && os.mkdir) {
                os.mkdir(this.getCaminhoPasta());
            }
            let file = std.open(caminho, "w");
            if (file) {
                file.puts(textoJSON);
                file.close();
                print("Conquistas atualizadas no MC.");
                return true;
            }
        } catch(e) {
            print("Erro ao salvar conquistas: " + e);
        }
        return false;
    },

    carregarConquistas: function() {
        const caminho = this.getCaminhoGlobal();
        let file = std.open(caminho, "r");
        
        if (file) {
            let texto = file.readAsString();
            file.close();
            if (texto && texto.length > 2) {
                try {
                    return JSON.parse(texto);
                } catch(e) {}
            }
        }
        return null; // Retorna null se não tiver arquivo (primeira vez jogando)
    },


    // --- ESCANEAR ---
    escanearSlots: function() {
        for(let i=0; i<3; i++) {
            this.slots[i].existe = false;
            this.slots[i].dados = null;
        }

        for (let i = 0; i < this.slots.length; i++) {
            let caminho = this.getCaminhoArquivo(i);
            
            // Tenta abrir para leitura ("r")
            let file = std.open(caminho, "r");
            
            if (file) {
                // Se abriu, lê o conteúdo
                let conteudo = file.readAsString();
                file.close(); 
                
                // Verifica se tem algo escrito
                if (conteudo && conteudo.length > 2) {
                    this.slots[i].existe = true;
                    this.slots[i].dados = { info: "JOGO SALVO" }; 
                }
            }
        }
    },

    // --- SALVAR (USANDO STD) ---
    salvar: function(indiceSlot, dadosJogador) {
        const caminhoArquivo = this.getCaminhoArquivo(indiceSlot);
        const textoJSON = JSON.stringify(dadosJogador);

        print("Salvando em: " + caminhoArquivo);

        try {
            // Tenta criar a pasta antes (se o os.mkdir existir)
            // Se der erro aqui, o catch segura
            if (typeof os !== 'undefined' && os.mkdir) {
                os.mkdir(this.getCaminhoPasta());
            }

            // Abre arquivo para escrita ("w")
            let file = std.open(caminhoArquivo, "w");

            if (file) {
                file.puts(textoJSON); // Escreve o texto
                file.close();         // Fecha e salva
                
                print("Sucesso! Arquivo gravado.");
                this.slots[indiceSlot].existe = true;
                this.slots[indiceSlot].dados = dadosJogador;
                return true;
            } else {
                print("ERRO: Nao foi possivel criar o arquivo.");
            }
        } catch(e) {
            print("ERRO CRITICO AO GRAVAR: " + e);
        }
        return false;
    },

    // --- CARREGAR (USANDO STD) ---
    carregar: function(indiceSlot) {
        let caminho = this.getCaminhoArquivo(indiceSlot);
        
        let file = std.open(caminho, "r");

        if (file) {
            let texto = file.readAsString();
            file.close();
            
            if (texto && texto.length > 2) {
                try {
                    return JSON.parse(texto);
                } catch (e) {
                    print("JSON corrompido");
                }
            }
        }
        return null;
    },
    
    // --- EXCLUIR ---
    excluir: function(indiceSlot) {
         let caminho = this.getCaminhoArquivo(indiceSlot);
         
         // Abre em modo "w" e fecha logo em seguida para zerar o arquivo
         let file = std.open(caminho, "w");
         if (file) {
             file.puts("");
             file.close();
         }
         this.slots[indiceSlot].existe = false;
         this.slots[indiceSlot].dados = null;
    }
};