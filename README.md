# Portal PDV · Farmácias Associadas

Site para o associado acompanhar a assessoria de PDV da sua loja. No portal ele vê os relatórios, o estudo de mercado, as fotos e os vídeos, e **envia novas fotos e vídeos** direto para a equipe, sem passar pelo WhatsApp.

A equipe do setor **SELL OUT E OPERAÇÕES DE PDV** continua trabalhando no SharePoint como hoje. O portal mostra ao associado as pastas da loja dele e grava nelas o que ele envia.

**Situação:** em desenvolvimento. A base do projeto está pronta (card [#1](https://github.com/oGuilhermeSoares/PDV---INOVA-O/issues/1)), e as telas chegam nos próximos cards.

## Onde está cada coisa

|                                  |                                                                                                                              |
| -------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| Documentação completa do projeto | [docs/documentacao-do-projeto.md](docs/documentacao-do-projeto.md)                                                           |
| Quadro de tarefas                | [PDV - INOVAÇÃO](https://github.com/users/oGuilhermeSoares/projects/3)                                                       |
| Design inicial (13/11/2026)      | [docs/superpowers/specs/2026-11-13-portal-fotos-pdv-design.md](docs/superpowers/specs/2026-11-13-portal-fotos-pdv-design.md) |
| Design system                    | [docs/design-system/README.md](docs/design-system/README.md)                                                                 |

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

## Design system

As telas seguem o [guia do design system](docs/design-system/README.md): a marca da Farmácias Associadas, painéis petróleo e títulos em Barlow, com o texto em Atkinson Hyperlegible Next. Os componentes ficam em `src/components/ui`.

A entrada do associado (`/entrar`) é uma página de apresentação, no estilo do [clinia.io](https://clinia.io/). O login fica no primeiro bloco; abaixo vêm a prévia da tela da loja, o que tem no portal, como funciona e as perguntas frequentes.

Depois de entrar, o associado vê a tela da loja (`src/components/loja`): os relatórios, o estudo de mercado e as fotos e vídeos de antes e depois. Ela é tela de trabalho e segue o design system do portal; o estilo do clinia fica só na entrada.

O botão "Enviar fotos e vídeos" leva à tela de envio (`src/components/envio`). Nela o associado escolhe a loja e se o material é de antes ou de depois, escolhe os arquivos e acompanha uma barra por arquivo. Por enquanto, o envio é simulado; o envio de verdade para o SharePoint é a segunda parte do card [#20](https://github.com/oGuilhermeSoares/PDV---INOVA-O/issues/20).

Para ver as telas de entrada, a tela da loja e a de envio em cada estado, e o catálogo de componentes, rode `npm run dev` e abra `/previa`. A prévia só existe no ambiente de desenvolvimento.

## Como trabalhar neste repositório

1. Pegue um card em **Pronto para começar** no quadro e mova-o para **Em andamento**.
2. Crie uma branch a partir da `main`.
3. Abra um PR citando o card (`Closes #N`). O card vai para **Em revisão** e, depois do merge, para **Concluído**.

Antes de abrir o PR, rode os quatro gates (veja o [AGENTS.md](AGENTS.md)).

## Rodar localmente

### Pré-requisitos

- **Node.js 22 ou mais novo**
- **PostgreSQL** rodando na máquina. O banco de produção ainda vai ser decidido no card #2. Enquanto isso, o desenvolvimento usa Postgres.

### Passo a passo

1. Instale as dependências. O `prisma generate` roda sozinho no fim:

   ```bash
   npm install
   ```

2. Crie o usuário e o banco do portal no Postgres local, como superusuário:

   ```bash
   psql -h localhost -U postgres -c "CREATE ROLE portal_pdv LOGIN PASSWORD 'portal_pdv' CREATEDB;" -c "CREATE DATABASE portal_pdv OWNER portal_pdv;"
   ```

   O `CREATEDB` é necessário, porque o `prisma migrate dev` cria um banco temporário para comparar as migrations.

3. Copie o arquivo de variáveis e ajuste a `DATABASE_URL`, se o seu Postgres não estiver na porta 5432:

   ```bash
   cp .env.example .env
   ```

   Por enquanto só `DATABASE_URL`, `APP_URL` e `NODE_ENV` são obrigatórias. As outras ficam vazias até o card que as usa. Se faltar alguma obrigatória, o portal não sobe e avisa qual é.

4. Suba o portal:

   ```bash
   npm run dev
   ```

5. Abra o endereço que aparecer no terminal, normalmente <http://localhost:3000>. Para conferir o banco, abra `/api/saude`. A resposta deve ser `{"status":"ok","banco":"ok"}`.

### Comandos

| Comando              | Para que serve                                           |
| -------------------- | -------------------------------------------------------- |
| `npm run dev`        | Sobe o portal em modo desenvolvimento                    |
| `npm test`           | Roda os testes                                           |
| `npm run lint`       | Confere o código com o ESLint                            |
| `npm run typecheck`  | Confere os tipos do TypeScript                           |
| `npm run build`      | Gera o cliente Prisma e o build de produção              |
| `npm run format`     | Formata o código com o Prettier                          |
| `npm run db:migrate` | Cria e aplica migrations no banco local (a partir do #5) |
| `npm run db:studio`  | Abre o Prisma Studio para olhar o banco                  |

### Na máquina do Guilherme

O Postgres de desenvolvimento roda num cluster próprio na **porta 5433**, sem Docker. É o mesmo do Inventário. A `DATABASE_URL` do `.env` dele aponta para `localhost:5433/portal_pdv`.
