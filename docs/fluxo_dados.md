# Krone: Ruínas Ancestrais (PS2)

Um jogo de ação e aventura 2D desenvolvido para PlayStation 2 utilizando o motor **AthenaEnv** (JavaScript).

![Status](https://img.shields.io/badge/Status-Em_Desenvolvimento-yellow) ![Plataforma](https://img.shields.io/badge/Plataforma-PlayStation_2-blue)

## 📖 Documentação Técnica
Para entender como o jogo funciona por baixo do capô, consulte nossa documentação:

* **[🧠 Fluxo de Dados e Arquitetura](./docs/fluxo_dados.md)**: Entenda como funciona a Máquina de Estados e o Game Loop.

## 🎮 Como Jogar
1. Baixe a ISO mais recente na aba **Releases**.
2. Execute no emulador PCSX2 ou grave em um DVD para jogar no console real.

---

## 🤝 Contribuição
Contribuições são bem-vindas!
1. Faça um Fork do projeto.
2. Crie sua Feature Branch.
3. Abra um Pull Request.

## 📄 Licença e Créditos
Distribuído sob a licença **MIT**. Veja o arquivo `LICENSE` para mais detalhes.

**Agradecimentos Especiais:**
* **[AthenaEnv](https://github.com/DanielSant0s/AthenaEnv):** Pelo motor incrível.
* **Comunidade PS2DEV:** Pelo suporte contínuo ao console.

### Diagrama de Estados (FSM)
Como o jogo navega entre as telas:

```mermaid
stateDiagram-v2
    [*] --> Boot
    Boot --> Menu: Carregar Assets
    Menu --> Jogo: Novo Jogo
    Jogo --> Pause: Start
    Pause --> Jogo: Start
    Pause --> Menu: Sair
    Jogo --> [*]: Game Over

    ### 2. Diagrama de Sequência (Game Loop) 🔄
**Onde está no seu código:** Arquivo `main.js` e o motor Athena.
**O que é:** Mostra a ordem que as coisas acontecem a cada frame (60 vezes por segundo).

**Como colocar no GitHub:**

```markdown
### O Game Loop (Ciclo de Vida)
O que acontece a cada frame (1/60s):

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

    ### 3. ECS (Entity Component System) 🧩
**Onde está no seu código:** Pastas `/entities` e `/systems`.
**O que é:** É a arquitetura moderna de jogos.
* **Entities:** O Player, o Inimigo (são apenas "coisas" com ID).
* **Components:** Vida, Posição, Sprite (são os dados).
* **Systems:** `input.js`, `physics.js` (são o código que mexe nos dados).
