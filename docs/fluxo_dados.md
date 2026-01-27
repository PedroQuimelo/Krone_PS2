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
graph TD
    A[Inicio do Frame] -->|1| B(Ler Controles)
    B -->|2| C(Calcular Lógica e Colisão)
    C -->|3| D(Limpar Tela)
    D -->|4| E(Desenhar Sprites)
    E -.->|Repetir| A
```
