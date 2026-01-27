# 🧠 Arquitetura e Fluxo de Dados

Este documento descreve como os dados fluem dentro do jogo **Krone: Ruínas Ancestrais**, desde a inicialização até o loop de jogo.

## 1. Estrutura de Pastas
A organização do código segue o padrão de separação por responsabilidade:

* **`/states`**: Máquina de estados (Menu, Jogo, Pause).
* **`/systems`**: Gerenciadores globais (Input, Save, Config).
* **`/entities`**: Objetos do jogo (Player, Inimigos).
* **`/data`**: Dados estáticos (Conquistas, Paletas de cores).

## 2. O Ciclo de Vida (Game Loop)
O ponto de entrada é o arquivo `main.js`, que inicializa o motor AthenaEnv e carrega o primeiro estado.

### Fluxo de Inicialização:
1.  **Boot (`main.js`):** Carrega as configurações iniciais.
2.  **State Manager:** Define o estado inicial como `state_menu.js`.
3.  **Render Loop:** O motor chama a função `Update()` e `Draw()` do estado ativo a cada frame (60 FPS).

## 3. Gerenciamento de Dados (Save/Load)
O sistema de persistência (`systems/save.js`) opera da seguinte forma:
* **Save:** O objeto `gameData` é convertido para JSON e depois para binário.
* **Storage:** Os dados são gravados no Memory Card (mc0:/) em blocos de 16KB.
* **Load:** Ao iniciar, o sistema busca o arquivo assinado na raiz do Memory Card.
