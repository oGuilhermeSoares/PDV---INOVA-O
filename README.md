# Portal PDV · Farmácias Associadas

Site para o associado acompanhar a assessoria de PDV da sua loja. No portal ele vê os relatórios, o estudo de mercado, as fotos e os vídeos, e **envia novas fotos e vídeos** direto para a equipe, sem passar pelo WhatsApp.

A equipe do setor **SELL OUT E OPERAÇÕES DE PDV** continua trabalhando no SharePoint como hoje. O portal mostra ao associado as pastas da loja dele e grava nelas o que ele envia.

**Situação:** em planejamento. O desenvolvimento começa pelo card [#1](https://github.com/oGuilhermeSoares/PDV---INOVA-O/issues/1).

## Onde está cada coisa

|                                  |                                                                                                                              |
| -------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| Documentação completa do projeto | [docs/documentacao-do-projeto.md](docs/documentacao-do-projeto.md)                                                           |
| Quadro de tarefas                | [PDV - INOVAÇÃO](https://github.com/users/oGuilhermeSoares/projects/3)                                                       |
| Design inicial (13/11/2026)      | [docs/superpowers/specs/2026-11-13-portal-fotos-pdv-design.md](docs/superpowers/specs/2026-11-13-portal-fotos-pdv-design.md) |

## Em resumo

| Hoje                                                                           | Com o portal                                                              |
| ------------------------------------------------------------------------------ | ------------------------------------------------------------------------- |
| O associado manda fotos e vídeos pelo WhatsApp, e a equipe salva no SharePoint | O associado envia pelo portal, e os arquivos caem direto na pasta da loja |
| A equipe manda o relatório e o estudo de mercado por e-mail                    | O associado vê tudo no portal, e o e-mail leva só o aviso com o link      |

## Equipe

- **Setor de PDV** (Camila Couto): dona do processo e usuária da área de admin
- **Guilherme Soares** e **William**: desenvolvimento

## Tecnologia

Next.js 16, React 19, Prisma 7, Auth.js v5 (Microsoft Entra ID), Tailwind v4 e Microsoft Graph, para o SharePoint e os e-mails. A hospedagem ainda está em decisão no card [#2](https://github.com/oGuilhermeSoares/PDV---INOVA-O/issues/2).

## Como trabalhar neste repositório

1. Pegue um card em **Pronto para começar** no quadro e mova-o para **Em andamento**.
2. Crie uma branch a partir da `main`.
3. Abra um PR citando o card (`Closes #N`). O card vai para **Em revisão** e, depois do merge, para **Concluído**.

As instruções para rodar o projeto localmente entram neste README junto com o card #1.
