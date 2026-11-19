# Card #1: Configurar o projeto (plano de implementação)

> **Para agentes:** SUB-SKILL OBRIGATÓRIA: use superpowers:subagent-driven-development (recomendado) ou superpowers:executing-plans para implementar este plano tarefa por tarefa. Os passos usam checkbox (`- [ ]`).

**Objetivo:** deixar a base do Portal PDV pronta para os outros cards. O app Next.js deve rodar com a identidade visual, as variáveis de ambiente validadas, o Prisma ligado ao banco local, testes e lint funcionando, e um README que permita subir o ambiente do zero.

**Arquitetura:** um app Next.js 16 (App Router) em `src/`, seguindo o padrão do Inventário (`C:\FarmaInventario\inventario`). A configuração vem de `src/lib/env.ts`, validada com zod na subida. O acesso ao banco passa por um singleton Prisma 7 com driver adapter (`src/lib/db.ts`). Ainda não há modelos: as tabelas chegam no card #5.

**Tecnologia:** Next.js 16.4.6, React 19.2.4, TypeScript 5, Prisma 7.10.x (generator `prisma-client` e `@prisma/adapter-pg`), Tailwind 4, zod 4, Vitest 4, ESLint 9 (`eslint-config-next`) e Prettier 3.

**Spec:** [issue #1](https://github.com/oGuilhermeSoares/PDV---INOVA-O/issues/1) e [docs/documentacao-do-projeto.md](../../documentacao-do-projeto.md), seções 10, 12 e 13.

## Restrições globais

- Versões fixas: `next` 16.4.6, `eslint-config-next` 16.4.6, `react`/`react-dom` 19.2.4 e `prisma`/`@prisma/client`/`@prisma/adapter-pg` ^7.10.1.
- O Prisma usa `provider = "prisma-client"`, com saída em `src/generated/prisma` (no gitignore). A URL do banco fica em `prisma.config.ts`, nunca no schema.
- **O banco precisa ser portável** entre Postgres e MySQL, porque a hospedagem ainda não foi decidida (#2). Ficam de fora `String[]`, extensões, `@db.*` específicos de Postgres e SQL cru com sintaxe de um só banco.
- Todo texto de tela, mensagem de erro e documentação fica em pt-BR.
- Nenhum emoji serve de ícone. Os ícones vêm de `lucide-react`.
- Cores da marca: teal `#00b6ad` e laranja `#f97316`. **Texto e botões com texto precisam ter contraste AA (≥ 4,5:1).** Por isso o teal puro fica só para fundos decorativos e para o logo, e as cores interativas usam tons mais escuros da mesma cor. O Inventário aprendeu isso na prática: `#00ACA9` sobre branco dá 2,8:1.
- Segredos nunca vão para o git. O `.env` fica no gitignore, e o `.env.example` vai sem valores reais.
- Na hora de criar o middleware, usar `proxy.ts` e não `middleware.ts`. **Este card não cria proxy**, porque ainda não há rota protegida (YAGNI; ele entra no #6).
- Os arquivos ficam com fim de linha LF, garantido por `.gitattributes`. Assim se evita a sujeira de CRLF que aconteceu no Inventário.
- Banco local desta máquina: o cluster Postgres na porta **5433**, com usuário `postgres` e senha `postgres-dev-2026`. Ele não usa Docker. A role e o banco são `portal_pdv`/`portal_pdv`, com `CREATEDB` por causa do shadow DB.
- Não deixar `next dev` rodando em segundo plano no fim do trabalho. O dev server é do Guilherme.

## Foco da revisão

1. **Variável obrigatória ausente ou vazia** no `.env`: o app se recusa a subir e mostra em pt-BR _quais_ variáveis faltam. Não pode falhar depois, com um erro obscuro. Os testes ficam na Tarefa 2.
2. **`.env.example` diferente do schema**: alguém adiciona uma variável no código e esquece do exemplo, e quem clona o projeto fica sem saber dela. O teste de paridade fica na Tarefa 2.
3. **Banco fora do ar**: `/api/saude` responde 503 com JSON, em vez de derrubar o processo ou demorar até estourar o tempo. O teste fica na Tarefa 3.
4. **`next build` sem banco disponível**: o build não pode depender de conexão, porque na hospedagem o build pode rodar sem acesso ao banco. A verificação fica na Tarefa 3, com o build rodando contra uma URL inválida.
5. **Clone limpo seguindo só o README**: a pessoa precisa chegar ao app rodando sem passos implícitos, como o `prisma generate` esquecido. A verificação fica na Tarefa 5.

---

### Task 1 — Tarefa 1: Esqueleto do app e ferramentas de qualidade

**Arquivos:**

- Criar: `package.json`, `tsconfig.json`, `next.config.ts`, `postcss.config.mjs`, `eslint.config.mjs`, `.prettierrc.json`, `.prettierignore`, `.gitignore`, `.gitattributes`, `vitest.config.ts`, `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/globals.css` (por ora só `@import "tailwindcss";`)
- Teste: `src/lib/sanidade.test.ts` (provisório, removido na Tarefa 2)

**Interfaces:**

- Produz os scripts npm `dev`, `build` (`prisma generate && next build`, ligado na Tarefa 3), `start`, `lint`, `typecheck` (`tsc --noEmit`), `test` (`vitest run`), `format` e `format:check`.
- Produz o alias `@/*` → `./src/*`.

- [ ] **Passo 1:** criar a branch `feat/1-configurar-projeto` a partir da `main`.
- [ ] **Passo 2:** escrever os arquivos de configuração, tomando como modelo os do Inventário (`tsconfig.json`, `eslint.config.mjs` com a regra que proíbe `div`/`span` com `onClick` e o ignore de `src/generated/**`, `postcss.config.mjs`). `package.json` com `"name": "portal-pdv"`, `"private": true` e `"engines": { "node": ">=22" }`. `.prettierrc.json` com `{"plugins": ["prettier-plugin-tailwindcss"], "endOfLine": "lf"}`. `.gitattributes` com `* text=auto eol=lf`. O `.gitignore` inclui `.env`, `.env.*` (exceto `!.env.example`), `node_modules`, `.next`, `src/generated` e `*.tsbuildinfo`.
- [ ] **Passo 3:** rodar `npm install` com as versões das restrições globais e mais `lucide-react`, `clsx`, `zod`, `server-only` e, nas devDependencies, `vitest`, `vite-tsconfig-paths`, `@types/node`, `@types/react`, `@types/react-dom`, `typescript`, `eslint`, `prettier`, `prettier-plugin-tailwindcss`, `tailwindcss`, `@tailwindcss/postcss`, `dotenv` e `tsx`.
- [ ] **Passo 4:** escrever o teste provisório `expect(1 + 1).toBe(2)` em `src/lib/sanidade.test.ts`, para provar que o Vitest e o alias funcionam.
- [ ] **Passo 5:** escrever o `layout.tsx` (`lang="pt-BR"`, metadata `title: "Portal PDV · Farmácias Associadas"`) e uma `page.tsx` mínima com o texto "Portal PDV".
- [ ] **Passo 6:** verificar `npm run lint && npm run typecheck && npm test && npx next build`. Resultado esperado: os quatro sem erro, e o Vitest com `1 passed`.
- [ ] **Passo 7:** commit `chore: esqueleto Next.js 16 com lint, typecheck e testes`.

### Task 2 — Tarefa 2: Variáveis de ambiente validadas

**Arquivos:**

- Criar: `src/lib/env-schema.ts`, `src/lib/env.ts`, `.env.example`
- Teste: `src/lib/env-schema.test.ts`
- Remover: `src/lib/sanidade.test.ts`

**Interfaces:**

- Produz `envSchema` (zod, sem efeito colateral) e `type Env` em `env-schema.ts`.
- Produz `formatarErrosEnv(issues): string` em `env-schema.ts`, com mensagens em pt-BR.
- Produz `env: Env` em `env.ts`. Ele valida `process.env` ao ser importado e lança `Error("Configuração de ambiente inválida:\n  - DATABASE_URL: …")`.
- **Obrigatórias agora:** `DATABASE_URL` (url), `APP_URL` (url) e `NODE_ENV` (`development | test | production`).
- **Opcionais agora**, cada uma passando a obrigatória no card que a usar: `AUTH_SECRET` (mín. 32 caracteres; #6), `ADMIN_EMAIL` (e-mail; #6), `ENTRA_TENANT_ID`, `ENTRA_CLIENT_ID` e `ENTRA_CLIENT_SECRET` (#3, #4, #6, #9: um app só no Entra), `SHAREPOINT_SITE_ID`, `SHAREPOINT_DRIVE_ID` e `SHAREPOINT_PASTA_LOJAS_ID` (#4) e `EMAIL_REMETENTE` (e-mail da caixa do setor; #9).
- Uma variável opcional com string vazia (`FOO=`) conta como ausente, como no Inventário (`optionalTrimmedString`).

- [ ] **Passo 1:** escrever os testes em `env-schema.test.ts`:
  - `aceita o mínimo obrigatório`: um objeto com as 3 obrigatórias válidas → `success: true`.
  - `recusa DATABASE_URL ausente e informa o nome`: o resultado de `formatarErrosEnv` contém `"DATABASE_URL"`.
  - `recusa DATABASE_URL vazia`: com `DATABASE_URL: ""` → falha.
  - `trata opcional vazia como ausente`: com `ENTRA_CLIENT_ID: ""` → `success: true` e `data.ENTRA_CLIENT_ID === undefined`.
  - `recusa AUTH_SECRET curto`: com `AUTH_SECRET: "curto"` → falha.
  - `.env.example tem exatamente as chaves do schema`: lê `.env.example` com `fs`, extrai as chaves das linhas `CHAVE=` e compara (ordenado) com `Object.keys(envSchema.shape)`.
- [ ] **Passo 2:** rodar `npm test` e confirmar que FALHA, porque o módulo ainda não existe.
- [ ] **Passo 3:** implementar `env-schema.ts`, `env.ts` e o `.env.example`. Cada variável do exemplo leva um comentário em pt-BR dizendo para que serve e qual card a usa. Os valores locais ficam como em `DATABASE_URL=postgresql://portal_pdv:portal_pdv@localhost:5432/portal_pdv` e `APP_URL=http://localhost:3000`. O exemplo usa a porta padrão 5432, e a 5433 fica só no `.env` desta máquina.
- [ ] **Passo 4:** apagar `sanidade.test.ts`, rodar `npm test` e confirmar 6 testes passando.
- [ ] **Passo 5:** commit `feat: validação das variáveis de ambiente com zod`.

### Task 3 — Tarefa 3: Prisma 7, banco local e rota de saúde

**Arquivos:**

- Criar: `prisma/schema.prisma`, `prisma.config.ts`, `src/lib/db.ts`, `src/app/api/saude/route.ts`
- Teste: `src/app/api/saude/route.test.ts`
- Modificar: `package.json` (scripts `db:generate`, `db:migrate` = `prisma migrate dev`, `db:deploy` = `prisma migrate deploy`, `db:studio`; `postinstall` = `prisma generate`)

**Interfaces:**

- Consome: `env.DATABASE_URL` (Tarefa 2).
- Produz: `db: PrismaClient` em `src/lib/db.ts`, com `import "server-only"`, singleton em dev e adapter `PrismaPg`, igual ao Inventário.
- Produz: `GET /api/saude` → `200 {"status":"ok","banco":"ok"}`, ou `503 {"status":"erro","banco":"indisponível"}` quando a consulta falhar ou passar de 3 s. A rota tem `export const dynamic = "force-dynamic"`. A consulta é `db.$queryRaw\`SELECT 1\``, que funciona em Postgres e em MySQL.

- [ ] **Passo 1:** preparar o banco local, criando a role e o banco no cluster 5433:
      `psql -h localhost -p 5433 -U postgres -c "CREATE ROLE portal_pdv LOGIN PASSWORD 'portal_pdv' CREATEDB;" -c "CREATE DATABASE portal_pdv OWNER portal_pdv;"`
      Criar o `.env` local, fora do git, a partir do exemplo, com a porta 5433.
- [ ] **Passo 2:** escrever os testes em `route.test.ts`, com `vi.mock("@/lib/db")`:
  - `responde 200 quando o banco responde`: com `$queryRaw` resolvendo → status 200 e o corpo `{status:"ok", banco:"ok"}`.
  - `responde 503 quando o banco falha`: com `$queryRaw` rejeitando → status 503 e `banco: "indisponível"`. O teste também confirma que o corpo não expõe a mensagem do erro.
  - `responde 503 quando o banco demora`: com `$queryRaw` que nunca resolve e `vi.useFakeTimers()` avançando 3000 ms → 503.
- [ ] **Passo 3:** rodar `npm test` e confirmar que FALHA.
- [ ] **Passo 4:** implementar o `schema.prisma` (`generator client { provider = "prisma-client", output = "../src/generated/prisma" }` e `datasource db { provider = "postgresql" }`, ainda sem modelos, com um comentário dizendo que o provider pode virar `mysql` no #2), o `prisma.config.ts` (como o do Inventário, sem seed por enquanto), o `db.ts` e a rota.
- [ ] **Passo 5:** rodar `npm test` e confirmar que passa. Depois rodar `npx prisma migrate status` e confirmar que conecta ao `portal_pdv` na 5433 e informa que não há migrations. **A primeira migration real sai no card #5**, junto com os modelos. Isso precisa ficar dito no PR.
- [ ] **Passo 6:** verificar o build sem banco: `DATABASE_URL=postgresql://x:x@127.0.0.1:1/x npm run build`. Resultado esperado: o build termina sem erro, porque nada consulta o banco durante o build.
- [ ] **Passo 7:** verificar o app de verdade. Subir `npm run dev`, chamar `curl -s localhost:<porta>/api/saude` e esperar `{"status":"ok","banco":"ok"}`. **Derrubar o dev server** e conferir que a porta ficou livre.
- [ ] **Passo 8:** commit `feat: Prisma 7 com banco local e rota /api/saude`.

### Task 4 — Tarefa 4: Identidade visual e página inicial

**Arquivos:**

- Modificar: `src/app/globals.css`, `src/app/layout.tsx`, `src/app/page.tsx`
- Criar: `public/logo-farmacias-associadas.png` (copiado de `C:\ServiceDesk\solicitacoes\public\`), `src/components/marca/logo.tsx`
- Teste: `src/lib/cores.test.ts` e `src/lib/cores.ts`

**Interfaces:**

- Produz os tokens do Tailwind (`@theme`), usados como `bg-primary`, `text-primary` e assim por diante. Nunca hex direto nos componentes:
  - `--color-marca: #00b6ad` (teal puro: só fundos decorativos e o logo)
  - `--color-primary` (teal escuro para botões e links; **≥ 4,5:1** sobre branco e com texto branco), `--color-primary-hover` (mais escuro) e `--color-primary-light: #e0faf9`
  - `--color-accent: #f97316` (laranja puro: só decorativo), `--color-accent-dark` (laranja para texto, ≥ 4,5:1 sobre branco) e `--color-accent-light: #fff7ed`
  - neutros para fundo, texto, texto-suave e borda
- Produz `contraste(hexA: string, hexB: string): number` em `src/lib/cores.ts`, pela fórmula de luminância relativa do WCAG 2.x.
- Produz o componente `<Logo className? />`, com `next/image` e `alt="Farmácias Associadas"`.

- [ ] **Passo 1:** escrever os testes em `cores.test.ts`:
  - `contraste de preto e branco é 21`: `contraste("#000000", "#ffffff")` ≈ 21 (`toBeCloseTo(21, 1)`).
  - `teal puro da marca não serve para texto`: `contraste("#00b6ad", "#ffffff") < 4.5`. Este teste documenta por que existe um `primary` separado.
  - `primary passa AA com texto branco` e `accent-dark passa AA sobre branco`: os valores escolhidos dão ≥ 4.5. O teste importa as constantes `CORES` exportadas por `cores.ts`, que são a fonte dos hex copiados no CSS.
  - `globals.css usa os mesmos hex de CORES`: lê `src/app/globals.css` e confere que cada valor de `CORES` aparece lá. Assim, CSS e teste não se desencontram.
- [ ] **Passo 2:** rodar `npm test` e confirmar que FALHA.
- [ ] **Passo 3:** implementar `cores.ts`, escolhendo os hex de `primary`, `primary-hover` e `accent-dark` que passam no teste, e escrever os tokens no `globals.css`.
- [ ] **Passo 4:** montar o layout e a página inicial, que é provisória e será a tela de login do associado no #10. Ela tem um cabeçalho com `<Logo>` e o nome "Portal PDV", um cartão central com o título "Portal do Associado · PDV", uma frase sobre o que o portal faz (relatórios, estudo de mercado, fotos e envio de fotos), um aviso "Em construção" com ícone `lucide-react` e um rodapé "Farmácias Associadas · Setor de PDV". A fonte é Inter, via `next/font/google`. A página precisa funcionar em 360 px de largura e não pode ter emoji.
- [ ] **Passo 5:** verificar `npm test && npm run lint && npm run typecheck && npm run build`. Depois subir o dev, confirmar com `curl` que o HTML contém `alt="Farmácias Associadas"` e "Portal PDV", e derrubar o dev.
- [ ] **Passo 6:** commit `feat: identidade visual e página inicial`.

### Task 5 — Tarefa 5: README, AGENTS.md e PR

**Arquivos:**

- Modificar: `README.md` (acrescentar a seção "Rodar localmente")
- Criar: `AGENTS.md` e `CLAUDE.md` (este com uma linha: `Leia AGENTS.md.`)

**Interfaces:**

- `AGENTS.md` lista: os gates antes de cada PR (`npm run lint`, `npm run typecheck`, `npm test`, `npm run build`); as regras das restrições globais deste plano (banco portável, `proxy.ts`, tokens de cor, pt-BR, sem emoji, segredos); o fluxo branch → PR com `Closes #N`; onde fica a documentação; e "atualizar a documentação junto com o código".

- [ ] **Passo 1:** escrever a seção "Rodar localmente" do README. Pré-requisitos (Node ≥ 22 e Postgres local), depois `npm install`, `cp .env.example .env` e ajuste de `DATABASE_URL`, criação do banco (o comando SQL da Tarefa 3), `npm run dev`, abrir o app e conferir `/api/saude`. Incluir uma nota sobre o cluster 5433 desta máquina.
- [ ] **Passo 2:** escrever o `AGENTS.md` e o `CLAUDE.md`.
- [ ] **Passo 3:** verificar um clone limpo seguindo só o README. Clonar a branch numa pasta temporária, rodar `npm install`, copiar e ajustar o `.env` para a 5433 e o banco `portal_pdv`, e rodar `npm run build && npm test`. Resultado esperado: tudo passa sem nenhum passo fora do README. Se precisar de algo a mais, corrigir o README.
- [ ] **Passo 4:** commit `docs: como rodar localmente e regras do repositório`.
- [ ] **Passo 5:** push e PR `Configurar o projeto (card #1)`, com `Closes #1`, a lista dos critérios de aceite do card marcados e a nota de que a primeira migration sai no #5. Mover o card #1 para **Em revisão** no quadro.
