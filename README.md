# Krone: Ruínas Ancestrais ⚔️

> Um jogo de ação e aventura desenvolvido para PlayStation 2.

![Status](https://img.shields.io/badge/Status-Em_Desenvolvimento-yellow) ![Plataforma](https://img.shields.io/badge/Plataforma-PS2-blue) ![License](https://img.shields.io/badge/License-MIT-green)

## 📖 Sobre o Projeto
**Krone: Ruínas Ancestrais** é um projeto homebrew focado na exploração e combate em ruínas antigas. O jogo utiliza uma arquitetura baseada em máquinas de estados para gerenciar o fluxo entre menus, gameplay e sistemas de persistência (Memory Card).

---

## 📚 Documentação Técnica
A arquitetura detalhada, diagramas de estados e fluxo de dados foram movidos para a pasta de documentação para manter este arquivo limpo.

* **[📂 Estrutura e Arquitetura](docs/fluxo_dados.md)**: Entenda a organização das pastas, o Game Loop e a Máquina de Estados (FSM).
* **[💾 Sistema de Save](docs/fluxo_dados.md#4-fluxo-de-persistência-save-system)**: Detalhes sobre como os dados são gravados no Memory Card.

> _Consulte os links acima para visualizar os diagramas Mermaid e a árvore de arquivos completa._

---

## 🛠️ Instalação e Execução

### Pré-requisitos
* PS2 SDK configurado no ambiente.
* PCSX2 (Emulador) ou console real com uLaunchELF.

### Compilando
1.  Clone este repositório:
    ```bash
    git clone [https://github.com/seu-usuario/Krone-Ruinas-Ancestrais.git](https://github.com/seu-usuario/Krone-Ruinas-Ancestrais.git)
    ```
2.  Compile o projeto:
    ```bash
    make
    ```
3.  Execute o arquivo `.elf` gerado.

---

## 📝 Licença
Este projeto está sob a licença **MIT**. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.
