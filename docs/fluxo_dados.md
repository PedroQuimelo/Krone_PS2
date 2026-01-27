# 🧠 Arquitetura e Fluxo de Dados

Este documento descreve como os dados fluem dentro do jogo **Krone: Ruínas Ancestrais**, desde a inicialização até o loop de jogo.

## 1. Estrutura de Pastas
A organização do código segue o padrão de separação por responsabilidade:

* **`/states`**: Máquina de estados (Menu, Jogo, Pause).
* **`/systems`**: Gerenciadores globais (Input, Save, Config).
* **`/entities`**: Objetos do jogo (Player, Inimigos).
* **`/data`**: Dados estáticos (Conquistas, Paletas de cores).

---

## 2. Diagrama de Estados (FSM)
Este diagrama mostra como o jogo navega entre as diferentes telas (`states`):

```mermaid
stateDiagram-v2
    [*] --> Boot
    Boot --> Menu: Carregar Assets
    Menu --> Jogo: Novo Jogo
    Jogo --> Pause: Start
    Pause --> Jogo: Start
    Pause --> Menu: Sair
    Jogo --> [*]: Game Over
```

---

## 3. Diagrama de Sequência (Game Loop)
Este diagrama detalha o que acontece no `main.js` a cada frame (60 vezes por segundo):

```mermaid
sequenceDiagram
    participant Main as Main.js
    participant Update as Systems (Lógica)
    participant Draw as Render (Tela)

    loop A cada Frame
        Main->>Update: Ler Controles (Input)
        Main->>Update: Atualizar Posição Player
        Main->>Update: Checar Colisões
        Main->>Draw: Limpar Tela
        Main->>Draw: Desenhar Sprites
    end
```
