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

    %% Duas formas de ir para o jogo
    Menu --> Jogo: Novo Jogo
    Menu --> Jogo: Carregar Save

    Jogo --> Pause: Start
    Pause --> Jogo: Voltar
    Pause --> Menu: Sair p/ Título
    Jogo --> [*]: Game Over

%% --- ÁREA DE PINTURA ---
    style Boot fill:#0a0a45,color:#00e5ff,stroke:#00e5ff
    style Menu fill:#0a0a45,color:#00e5ff,stroke:#00e5ff
    style Jogo fill:#1a237e,color:#fff,stroke:#fff
    style Pause fill:#1a237e,color:#fff,stroke:#fff
```

---

## 3. Diagrama de Sequência (Game Loop)
Este diagrama detalha o que acontece no `main.js` a cada frame (60 vezes por segundo):

```mermaid
graph TD
    %% Nós do diagrama
    Start([Início do Frame])
    Input[Ler Controles / Input]
    Logic[Atualizar Lógica e Física]
    Clear[Limpar Tela]
    Draw[Desenhar Sprites]

    %% Conexões
    Start --> Input
    Input --> Logic
    Logic --> Clear
    Clear --> Draw
    
    %% O Loop
    Draw -.->|Repetir 60x por seg| Start

    %% --- SUBSTITA APENAS ESSAS DUAS LINHAS ---
    style Start fill:#0a0a45,color:#00e5ff,stroke:#00e5ff,stroke-width:2px
    style Draw fill:#1a237e,color:#ffffff,stroke:#ffffff,stroke-width:2px
```
