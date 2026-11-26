<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Portal PDV: regras do repositório

Vale para pessoas e para agentes (Claude, Codex) que trabalham neste código.

## Antes de abrir um PR

Rode os quatro gates. Todos precisam passar:

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

Formate só os arquivos que você mudou, com `npx prettier --write <arquivos>`.

## Fluxo de trabalho

1. Pegue um card no [quadro PDV - INOVAÇÃO](https://github.com/users/oGuilhermeSoares/projects/3) e mova-o para **Em andamento**.
2. Crie uma branch a partir da `main`, por exemplo `feat/5-modelo-de-dados`.
3. Escreva o teste antes do código e veja-o falhar.
4. Abra o PR com `Closes #N` na descrição.
5. Atualize a documentação junto com o código: o [README](README.md) e a [documentação do projeto](docs/documentacao-do-projeto.md).

## Regras

- **Idioma:** textos de tela, mensagens de erro, commits e documentação ficam em pt-BR.
- **Banco portável:** a hospedagem ainda não foi decidida (card #2), e o banco pode ser Postgres ou MySQL. No schema do Prisma, nada de `String[]`, extensões, `@db.*` exclusivos de um banco ou SQL cru com sintaxe de um só banco.
- **Prisma 7:** o generator é `prisma-client`, com saída em `src/generated/prisma`, e a conexão fica em `prisma.config.ts`. O app acessa o banco só por `src/lib/db.ts`.
- **Variáveis de ambiente:** toda variável nova entra em `src/lib/env-schema.ts` **e** no `.env.example`. Um teste quebra se os dois se desencontrarem. Acesse as variáveis por `env`, de `@/lib/env`, nunca por `process.env` direto.
- **Middleware:** use `src/proxy.ts`, não `middleware.ts`. O Next 16 renomeou o arquivo.
- **Cores:** use os tokens do Tailwind (`bg-primary`, `text-texto-suave`…), nunca hex direto nos componentes. Os valores ficam em `src/lib/cores.ts` e no `globals.css`, e um teste confere que são os mesmos. O teal (`marca`) e o laranja (`accent`) puros não passam no contraste para texto: use `primary` e `accent-dark`, e mantenha o teste de contraste verde para qualquer cor nova.
- **Ícones:** use `lucide-react`. Nada de emoji no lugar de ícone.
- **Acessibilidade:** um elemento clicável é `button` ou `a`, nunca `div` ou `span` com `onClick`. O lint bloqueia isso.
- **Segredos:** nunca vão para o git. O `.env` fica no gitignore.
- **SharePoint e Graph:** todo acesso fica no servidor (`import "server-only"`). Nenhum token ou link do Graph vai para o navegador sem passar pela checagem de permissão do portal (cards #4 e #12).

## Pegadinhas conhecidas

- **Vitest no Windows com drive minúsculo:** se `npm test` falhar com `Vitest failed to find the current suite`, o terminal está na pasta como `c:\` em vez de `C:\`. Isso acontece no Git Bash aberto pelo VS Code. Entre de novo na pasta com o drive maiúsculo (`cd /C/PDV---INOVA-O`) ou use o PowerShell.
- **`next dev` reescreve o bloco do topo deste arquivo.** Ele é do Next e deve ficar.
