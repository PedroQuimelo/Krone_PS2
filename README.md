# Krone: Ruínas Ancestrais ⚔️

> Um jogo de ação e aventura desenvolvido para PlayStation 2.

![Status](https://img.shields.io/badge/Status-Em_Desenvolvimento-yellow) ![Plataforma](https://img.shields.io/badge/Plataforma-PS2-blue) ![License](https://img.shields.io/badge/License-MIT-green)

## 📖 Sobre o Projeto
**Krone: Ruínas Ancestrais** é um projeto homebrew focado na exploração e combate em ruínas antigas. O jogo utiliza uma arquitetura baseada em máquinas de estados para gerenciar o fluxo entre menus, gameplay e sistemas de persistência (Memory Card).

---

## 📂 Estrutura do Projeto
A organização dos arquivos segue o padrão de separação por responsabilidade:

```text
📦 Krone_Ruinas_Ancestrais
 ┣ 📂 data        # Dados estáticos (Conquistas, Paletas de cores)
 ┣ 📂 entities    # Objetos do jogo (Player, Inimigos)
 ┣ 📂 menus       # Scripts de Interface (UI de Save, Opções)
 ┣ 📂 states      # Máquina de estados (Menu, Jogo, Pause)
 ┣ 📂 systems     # Gerenciadores globais (Input, Save, Config)
 ┣ 📂 sprites     # Arquivos de imagem e texturas
 ┗ 📜 main.js     # Ponto de entrada (Boot)
