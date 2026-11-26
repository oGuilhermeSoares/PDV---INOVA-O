# Design system e telas de entrada (plano de implementação)

> **Para agentes:** SUB-SKILL OBRIGATÓRIA: use superpowers:subagent-driven-development (recomendado) ou superpowers:executing-plans para implementar este plano tarefa por tarefa. Os passos usam checkbox (`- [ ]`).

**Objetivo:** trazer o design system corrigido para o repositório, com a linguagem visual do clinia sobre a marca da Farmácias Associadas, e montar as telas de entrada do associado e da equipe, com todos os estados e uma prévia só para desenvolvimento.

**Arquitetura:** os tokens ficam em `src/app/globals.css` (`@theme` do Tailwind 4, com a paleta e os tamanhos padrão zerados), com os mesmos hex em `src/lib/cores.ts`, conferidos por teste. Os componentes de base ficam em `src/components/ui`, os da marca em `src/components/marca` e os das telas de entrada em `src/components/entrada`. As telas chamam ações no servidor que, por enquanto, só validam o formato e respondem que o acesso ainda não foi liberado. Os cards #10 e #6 trocam o corpo dessas ações.

**Tecnologia:** Next.js 16.4.6 (App Router), React 19.2.4, Tailwind 4.3, lucide-react 1.76, `next/font` (Atkinson Hyperlegible Next e Barlow) e Vitest 4, com `react-dom/server` nos testes de componente.

**Spec:** [2026-11-25-design-system-e-telas-de-entrada-design.md](../specs/2026-11-25-design-system-e-telas-de-entrada-design.md). A pasta de origem é `C:\Users\gsoares\Downloads\portal-pdv-design-system`: leia, mas não altere.

## Restrições globais

- Texto de tela, de erro e de documentação em pt-BR, falando com "você", em caixa normal e sem emoji. Ícones só de `lucide-react`; os decorativos levam `aria-hidden="true"`.
- Hex só em `src/app/globals.css`, `src/lib/cores.ts` e arquivos de `public/`. Os componentes usam as classes dos tokens.
- O menor texto é `apoio` (14 px). Campos em 16 px (`corpo`). Todo clicável tem pelo menos 44 px. Texto com contraste de 4,5:1 ou mais; borda, ícone e foco com 3:1 ou mais.
- Barlow 600 só em `vitrine`, `pagina` e `secao` (classe `font-titulo`). O resto em Atkinson Hyperlegible Next.
- `prefers-reduced-motion: reduce` desliga animações e transições.
- Nenhuma dependência nova no `package.json`.
- Next 16: `params` é uma Promise, e arquivo com `"use server"` só exporta funções async. Antes de usar uma API que você não conferiu, leia o guia em `node_modules/next/dist/docs/`.
- **Sem commit.** O Guilherme pede quando quiser. No lugar do commit, cada tarefa termina rodando os próprios testes.
- **Não mexa** nos arquivos de ambiente que já estavam alterados antes deste trabalho: `src/app/api/saude/route.ts`, `src/app/api/saude/route.test.ts`, `src/lib/env.ts`, `src/lib/env-schema.ts`, `src/lib/env-schema.test.ts`, `src/instrumentation.ts`, `src/instrumentation.test.ts` e `src/lib/verificar-env.ts`.
- Formate só os arquivos que você mudou: `npx prettier --write <arquivos>`.
- Não deixe o `next dev` rodando no fim. O dev server é do Guilherme.

## Foco da revisão

1. **CNPJ colado com espaços ou em minúsculas** (`11 222 333 0001 81`, `12abc34501de35`) tem de valer. O teste fica na Tarefa 2.
2. **Letras ou traço colados no código** (`123-456`): o campo fica só com os seis algarismos. O teste de `limparCodigo` fica na Tarefa 5.
3. **Contagem do reenvio com a aba dormindo:** a conta usa a hora de término, não um contador que desce, e nunca mostra tempo negativo nem `0:00` antes da hora. Os testes de `formatarContagem(-3)` e `formatarContagem(44.2)` ficam na Tarefa 2.
4. **Foco sobre o painel escuro:** o anel `primary-strong` some sobre o petróleo; lá o anel usa `primary` (5,6:1). O teste de contraste fica na Tarefa 1, e a conferência no navegador, na Tarefa 8.
5. **E-mail mascarado longo num celular de 320 px** (`ma***@farmaciasassociadas.com.br`): a linha quebra, sem rolagem lateral. A conferência fica na Tarefa 8.

---

### Task 1 — Tarefa 1: Tokens, fontes e base do CSS

**Arquivos:**

- Modificar: `src/lib/cores.ts`, `src/lib/cores.test.ts`, `src/app/globals.css` e `src/app/layout.tsx`.

**Interfaces:**

- Produz: `CORES` (nomes abaixo) e `contraste(a, b): number`, que já existe. Classes do Tailwind: `bg-*`, `text-*` e `border-*` de cada cor; `text-apoio`, `text-corpo`, `text-destaque`, `text-secao`, `text-pagina`, `text-vitrine` e `text-senha`; `font-sans` e `font-titulo`; `shadow-flutuante`; `rounded-2xl` (20 px); `animate-entrar`; e as classes `.superficie-escura` (foco em `primary`) e `.grade-de-pontos`.

- [ ] **Passo 1: reescrever `src/lib/cores.test.ts`.** Uma função `misturar(cor, fundo, alfa)` no próprio teste calcula a cor de `cor` com opacidade `alfa` sobre `fundo`.
  - Ficam os dois testes de `contraste`.
  - `globals.css e CORES têm as mesmas cores`: lê o `globals.css`, extrai todo `--color-<nome>: #rrggbb` e espera o mesmo conjunto de `CORES`, com os mesmos nomes e os mesmos hex. Um token só no CSS, ou só no TS, quebra o teste.
  - `pares de texto passam AA`: `test.each` exigindo 4,5:1 ou mais para cada `[texto, fundo]`: `gray-900/white`, `gray-900/gray-50`, `gray-900/gray-100`, `gray-900/primary-light`, `gray-700/gray-50`, `gray-700/gray-100`, `gray-600/white`, `gray-600/gray-50`, `gray-600/gray-100`, `gray-500/white`, `gray-500/gray-50`, `gray-950/primary`, `gray-950/primary-dark`, `primary-strong/white`, `primary-strong/gray-50`, `primary-strong/primary-light`, `accent-strong/white`, `accent-strong/accent-light`, os cinco `status-X/status-X-bg`, `red-700/white`, `red-700/red-50`, `white/red-700`, `white/red-800`, `white/petroleo-950`, `white/petroleo-900`, `white/petroleo-800`, `white/petroleo-700`, `realce/petroleo-950`, `realce/petroleo-900`, `primary/petroleo-900`, os quatro `avatar-N/avatar-N-bg` e `misturar(white, petroleo-900, 0.72)/petroleo-900`.
  - `bordas, ícones e foco passam 3:1`: `gray-500/white` (borda do campo), `red-700/white` (campo inválido), `primary-strong/white` (foco no claro) e `primary/petroleo-900` (foco no escuro).
  - Os que mostram o que não pode: `primary` sobre `white` < 3; `accent` sobre `white` < 4,5; `gray-400` sobre `white` < 4,5.
- [ ] **Passo 2:** rode `npm test -- src/lib/cores.test.ts`. Ele falha, porque `CORES` ainda tem os nomes antigos.
- [ ] **Passo 3: `CORES` em `src/lib/cores.ts`**, com estes valores, em hex minúsculo:

  | Nomes                                                                             | Hex                                                                                                          |
  | --------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
  | `white`                                                                           | `#ffffff`                                                                                                    |
  | `gray-50`, `-100`, `-200`, `-300`, `-400`, `-500`, `-600`, `-700`, `-900`, `-950` | `#f9fafb`, `#f3f4f6`, `#e5e7eb`, `#d1d5dc`, `#99a1af`, `#6a7282`, `#4a5565`, `#364153`, `#101828`, `#030712` |
  | `red-50`, `red-700`, `red-800`                                                    | `#fef2f2`, `#c10007`, `#9f0712`                                                                              |
  | `primary`, `primary-dark`, `primary-light`, `primary-strong`                      | `#00b6ad`, `#009991`, `#e0faf9`, `#00706a`                                                                   |
  | `accent`, `accent-light`, `accent-strong`                                         | `#f97316`, `#fff7ed`, `#a84300`                                                                              |
  | `status-aberto`, `status-aberto-bg`                                               | `#8a4a00`, `#fff3e0`                                                                                         |
  | `status-andamento`, `status-andamento-bg`                                         | `#00596b`, `#e3f4f8`                                                                                         |
  | `status-aguardando`, `status-aguardando-bg`                                       | `#5b3fa0`, `#f0ebfa`                                                                                         |
  | `status-resolvido`, `status-resolvido-bg`                                         | `#1f6b3a`, `#e6f4ea`                                                                                         |
  | `status-recusado`, `status-recusado-bg`                                           | `#a3271f`, `#fdecea`                                                                                         |
  | `petroleo-950`, `-900`, `-800`, `-700`                                            | `#0a2427`, `#0f3034`, `#163f44`, `#21535a`                                                                   |
  | `realce`                                                                          | `#fdba74`                                                                                                    |
  | `avatar-1` e `avatar-1-bg` até `avatar-4` e `avatar-4-bg`                         | `#245c5a`/`#dcefed`, `#855126`/`#f4e6d7`, `#395d74`/`#e2edf4`, `#895361`/`#f4e6e9`                           |

  Os cinzas e os vermelhos são os do Tailwind 4, convertidos de oklch para hex. Saem os nomes antigos: `marca`, `primary-hover`, `fundo`, `superficie`, `texto`, `texto-suave`, `borda` e `accent-dark`. Atualize o comentário do topo do arquivo.

- [ ] **Passo 4: `src/app/globals.css`.**
  - O `@theme` começa com `--color-*: initial;` e `--text-*: initial;` e depois declara cada cor de `CORES` como `--color-<nome>: <hex>;`.
  - Escala (tamanho/altura da linha): `apoio` 0.875rem/1.45, `corpo` 1rem/1.5, `destaque` 1.125rem/1.4, `secao` 1.5rem/1.25, `pagina` 2rem/1.15, `vitrine` 2.75rem/1.08 e `senha` 2rem/1.1.
  - `--radius-2xl: 1.25rem;`.
  - `--shadow-flutuante`: três camadas em `rgb(15 48 52 / …)`, com opacidades 0.08, 0.07 e 0.04 e deslocamento/desfoque de 5/10, 18/18 e 42/25 px.
  - `--animate-entrar: entrar 600ms cubic-bezier(0.22, 1, 0.36, 1) both;`, com o `@keyframes entrar` partindo de opacidade 0 e 12 px abaixo.
  - `@theme inline`: `--font-sans: var(--font-atkinson), system-ui, "Segoe UI", Roboto, Arial, sans-serif;` e `--font-titulo: var(--font-barlow), var(--font-atkinson), system-ui, sans-serif;`.
  - `body` com fundo `--color-gray-50` e texto `--color-gray-900`.
  - Fica do design system: as regras de cursor, o anel de foco único (2 px em `primary-strong`, afastado 2 px) e o `.link-hint`.
  - Entra: `.superficie-escura :focus-visible { outline-color: var(--color-primary); }`; `.grade-de-pontos`, um `radial-gradient` de pontos de 1 px em `color-mix(in srgb, var(--color-white) 6%, transparent)` a cada 22 px; e um bloco `@media (prefers-reduced-motion: reduce)` que zera `animation-duration` e `transition-duration` em `*`.
- [ ] **Passo 5: fontes e `viewport` em `src/app/layout.tsx`.**
  - `Atkinson_Hyperlegible_Next({ subsets: ["latin", "latin-ext"], variable: "--font-atkinson", display: "swap" })` e `Barlow({ weight: "600", subsets: ["latin", "latin-ext"], variable: "--font-barlow", display: "swap" })`. Se o build avisar que não acha as métricas da fonte reserva da Atkinson, use `adjustFontFallback: false` nela, como o `fonte.ts` da origem.
  - `export const viewport: Viewport = { themeColor: CORES["petroleo-900"] }`.
  - `metadata.title = { default: "Portal PDV · Farmácias Associadas", template: "%s · Portal PDV" }`.
  - `<html lang="pt-BR">` com as duas variáveis de fonte, e `<body className="min-h-dvh font-sans antialiased">`.
- [ ] **Passo 6:** `npm test -- src/lib/cores.test.ts` passa, e `npm run typecheck` também. A página provisória fica sem estilo até a Tarefa 5. Isso é esperado.

### Task 2 — Tarefa 2: CNPJ e contagem

**Arquivos:**

- Criar: `src/lib/cnpj.ts`, `src/lib/cnpj.test.ts`, `src/lib/tempo.ts` e `src/lib/tempo.test.ts`.

**Interfaces:**

- Produz:

  ```ts
  export type MotivoCnpjInvalido =
    "vazio" | "tamanho" | "caractere" | "digito" | "repetido";
  export type ResultadoCnpj =
    | { valido: true; cnpj: string } // 14 caracteres, maiúsculos e sem pontuação
    | { valido: false; motivo: MotivoCnpjInvalido };
  export function normalizarCnpj(valor: string): string; // tira espaços, ".", "/" e "-" e passa para maiúsculas
  export function validarCnpj(valor: string): ResultadoCnpj;
  export function formatarCnpj(cnpj: string): string; // "12ABC34501DE35" -> "12.ABC.345/01DE-35"
  export function formatarContagem(segundos: number): string; // "m:ss"
  ```

- [ ] **Passo 1: escrever os testes.**
  - `normalizarCnpj(" 11.222.333/0001-81 ")` e `normalizarCnpj("11 222 333 0001 81")` dão `"11222333000181"`; `normalizarCnpj("12.abc.345/01de-35")` dá `"12ABC34501DE35"`.
  - `validarCnpj`:
    - `"11.222.333/0001-81"` dá `{ valido: true, cnpj: "11222333000181" }`.
    - `"12.ABC.345/01DE-35"` e `"12abc34501de35"` dão `valido: true`, com `cnpj: "12ABC34501DE35"`.
    - `""` e `"   "` dão `vazio`.
    - `"1122233300018"` e `"112223330001811"` dão `tamanho`.
    - `"11.222.333/0001-8X"` dá `caractere`, porque os dígitos verificadores são só números. `"11.222.333/0001-8!"` também dá `caractere`.
    - `"11.222.333/0001-82"` dá `digito`.
    - `"11111111111111"` e `"00000000000000"` dão `repetido`.
  - `formatarCnpj("11222333000181")` dá `"11.222.333/0001-81"`, e `formatarCnpj("12ABC34501DE35")` dá `"12.ABC.345/01DE-35"`.
  - `formatarContagem`: `45` dá `"0:45"`, `125` dá `"2:05"`, `600` dá `"10:00"`, `0` dá `"0:00"`, `-3` dá `"0:00"` e `44.2` dá `"0:45"`. Arredondar para cima evita mostrar `0:00` antes da hora.
- [ ] **Passo 2:** rode `npm test -- src/lib/cnpj.test.ts src/lib/tempo.test.ts`. Ele falha, porque os módulos não existem.
- [ ] **Passo 3: implementar.** O dígito segue o cálculo da Receita para CNPJ com letras:
  - os 12 primeiros caracteres são `[0-9A-Z]`, e os 2 últimos, `[0-9]`;
  - o valor de cada caractere é `charCodeAt(0) - 48`;
  - o DV1 usa os pesos `5,4,3,2,9,8,7,6,5,4,3,2` sobre os 12 primeiros;
  - o DV2 usa os pesos `6,5,4,3,2,9,8,7,6,5,4,3,2` sobre os 12 primeiros e o DV1;
  - em cada um, `resto = soma % 11` e `dv = resto < 2 ? 0 : 11 - resto`.

  A ordem das checagens é vazio, tamanho, caractere, repetido e dígito.

- [ ] **Passo 4:** os testes passam.

### Task 3 — Tarefa 3: Componentes de base: ação, campo e aviso

**Arquivos:**

- Modificar: `vitest.config.mts` (`include: ["src/**/*.test.{ts,tsx}"]`) e `src/app/layout.tsx`, que passa a montar `<Avisos />` uma vez, no fim do `body`.
- Criar: `src/testes/renderizar.ts` e `src/components/ui/{Button,Card,Badge,Input,Select,Textarea,Field,Aviso,Avisos}.tsx`.
- Testes: `src/components/ui/{Button,Field,Aviso}.test.tsx`.
- Origem: os arquivos de mesmo nome em `…\portal-pdv-design-system\app\components\ui\`. Traga o código, passe para o estilo do projeto (aspas duplas, ponto e vírgula e `clsx` para juntar classes) e aplique as mudanças abaixo.

**Interfaces:**

- Produz:
  - `renderizar(no: ReactElement): string`, com `renderToStaticMarkup`.
  - `buttonStyles({ variant?, size?, className? }): string` e `Button(props: ComponentProps<"button"> & { variant?: "primary" | "secondary" | "ghost" | "danger" | "danger-solid" | "escuro"; size?: "sm" | "md" | "lg"; pending?: boolean; iconeFinal?: LucideIcon })`.
  - `Card(props: ComponentProps<"div"> & { padding?: "none" | "sm" | "md" | "lg"; elevado?: boolean })`.
  - Com a API da origem: `Badge`, `fieldStyles`, `Input`, `Select`, `Textarea`, `Field` (`id`, `label`, `obrigatorio`, `opcional`, `dica`, `erro` e `children(controle)`), `type TomDoAviso = "erro" | "sucesso" | "atencao" | "info"`, `TONS_DO_AVISO`, `Aviso({ tom, children, className })`, `avisar(texto, tom?)` e `Avisos()`.

**Mudanças sobre a origem:**

- **`Button`:**
  - pílula (`rounded-full`);
  - tamanhos `sm` (`min-h-11 px-4 text-apoio`), `md` (`min-h-12 px-6 text-corpo`) e `lg` (`min-h-14 px-7 text-destaque`);
  - variante nova `escuro`: `bg-petroleo-700 text-white hover:bg-petroleo-800`;
  - no hover, `primary` e `escuro` sobem 1 px e ganham `shadow-flutuante`;
  - `iconeFinal` desenha o ícone (`size-4`) num círculo no fim (`size-8 rounded-full bg-gray-950 text-primary`), com `pr-2` para o círculo encostar na borda;
  - com `pending`, aparece o `LoaderCircle` no início e o `iconeFinal` some.
- **`Card`:** `rounded-2xl`; `elevado` acrescenta `shadow-flutuante`.
- **`fieldStyles`:** `min-h-12 rounded-xl text-corpo`; o resto fica como na origem.
- **`Avisos`:**
  - a região fica em `bottom-0` também no celular (sai o `bottom-16`, que era da barra do FarmaDesk);
  - o botão de fechar usa `hover:bg-gray-900/5`, porque o `black` não existe mais;
  - o comentário sobre os avisos que ficam até a pessoa fechar passa a citar "atenção" e "erro".

- [ ] **Passo 1: escrever os testes.**
  - `Button.test.tsx`:
    - com `pending`, o HTML tem `disabled=""` e `aria-busy="true"`;
    - sem `type`, sai `type="button"`;
    - com `iconeFinal={ArrowRight}`, o SVG tem `aria-hidden="true"` e o texto continua no botão.
  - `Field.test.tsx`:
    - com `id="cnpj"`, `dica` e `erro`, o `label` tem `for="cnpj"`, o `input` tem `aria-describedby="cnpj-dica cnpj-erro"` e `aria-invalid="true"`, e o erro sai em `<p id="cnpj-erro" role="alert"`;
    - sem `erro`, não há `aria-invalid`;
    - `obrigatorio` escreve "(obrigatório)".
  - `Aviso.test.tsx`: `tom="erro"` dá `role="alert"`; `sucesso`, `atencao` e `info` dão `role="status"`.
- [ ] **Passo 2:** rode `npm test -- src/components/ui`. Ele falha, porque os componentes não existem.
- [ ] **Passo 3:** implemente os componentes e o `renderizar`.
- [ ] **Passo 4:** os testes passam, e `npm run lint` e `npm run typecheck` também.

### Task 4 — Tarefa 4: Componentes de base: estrutura, lista e situação

**Arquivos:**

- Criar: `src/components/ui/{PageHeader,SectionTitle,EmptyState,Table,Avatar,StatusBadge,Stepper,ArquivoIcon,DialogoConfirmacao,LinkPendingHint,VoltarLink}.tsx`.
- Testes: `src/components/ui/{Avatar,StatusBadge,Stepper,ArquivoIcon}.test.tsx`.
- Origem: os de mesmo nome na pasta do design system. O `StatusBadge` vem de `app/components/`, e o `ArquivoIcon` substitui o `EquipamentoIcon`. Não traga o `solicitacao-constants.ts` nem o `UrgenciaBadge`.

**Interfaces:**

- Produz:
  - `PageHeader({ title, description?, actions? })`, com o `h1` em `font-titulo text-pagina font-semibold tracking-tight`.
  - `SectionTitle({ as?, tamanho?: "secao" | "destaque", ...props })`. O tamanho `secao` usa `font-titulo text-secao font-semibold tracking-tight`.
  - `EmptyState`, `DialogoConfirmacao`, `LinkPendingHint` e `VoltarLink` com a API da origem. O diálogo passa para `rounded-2xl` e `shadow-flutuante`, e o `mt-5` do `EmptyState` vira `mt-6`.
  - `Table`, `TableHead` e `TableCell`: a tabela em `text-corpo`, e o cabeçalho em `text-apoio font-semibold text-gray-600`.
  - `iniciais(nome: string): string`, `tomDoAvatar(chave: string): string` e `Avatar({ nome, chave?, size?: "sm" | "md", className? })`. Os tons são `bg-avatar-N-bg text-avatar-N`, com N de 1 a 4. Tamanhos: `sm` é `size-8 text-apoio`, e `md`, `size-10 text-corpo`.
  - `type GrupoStatus = "aberto" | "andamento" | "aguardando" | "resolvido" | "recusado" | "cancelado"` e `StatusBadge({ grupo, children })`, com as cores e os ícones da tabela da origem.
  - `type Etapa = { rotulo: string; estado: "concluida" | "atual" | "futura" | "negativa" }` e `Stepper({ etapas, rotulo, className? })`. O `aria-label` é `` `${rotulo}. Atual: ${rótulo da etapa atual}` ``. O visual é o da origem.
  - `type TipoDeArquivo = "pdf" | "planilha" | "imagem" | "video" | "outro"`, `tipoDoArquivo(nome: string): TipoDeArquivo`, `ROTULO_DO_TIPO: Record<TipoDeArquivo, string>` (PDF, Planilha, Foto, Vídeo e Arquivo) e `ArquivoIcon({ tipo, ...LucideProps })`, com `FileText`, `FileSpreadsheet`, `FileImage`, `FileVideo` e `File`, sempre com `aria-hidden`. Extensões, sem diferenciar maiúsculas: `pdf`; `xlsx xls csv ods`; `jpg jpeg png heic heif webp gif`; `mp4 mov m4v webm avi 3gp`.

- [ ] **Passo 1: escrever os testes.**
  - `Avatar.test.tsx`: `iniciais("Camila Couto")` dá `"CC"`; `iniciais("guilherme")`, `"G"`; `iniciais("  ")`, `"?"`; `iniciais("Ana Maria da Silva")`, `"AS"`. `tomDoAvatar("ana@loja.com.br")` dá o mesmo valor nas duas chamadas, e é um dos quatro tons.
  - `StatusBadge.test.tsx`: `grupo="resolvido"` com "Enviado" tem o texto "Enviado", a classe `bg-status-resolvido-bg` e um SVG com `aria-hidden="true"`. `grupo="cancelado"` usa `bg-gray-100`.
  - `Stepper.test.tsx`: com três etapas (concluída, atual "Fotos" e futura) e `rotulo="Etapas do envio"`, `aria-current="step"` aparece uma vez, e o `aria-label` é "Etapas do envio. Atual: Fotos".
  - `ArquivoIcon.test.tsx`: `tipoDoArquivo` dá `pdf` para "Assessoria GC - Jumauti Ltda (1).pdf", `planilha` para "BRICK 2004 - PRODUTOS JUMAUTI - MAT04_2026.xlsx", `imagem` para "WhatsApp Image 2026-08-10 at 09.41.58.jpeg", `video` para "Vídeo.MP4" e `outro` para "leia-me".
- [ ] **Passo 2:** rode `npm test -- src/components/ui`. Os testes novos falham.
- [ ] **Passo 3:** implemente os componentes.
- [ ] **Passo 4:** os testes passam, e `npm run lint` e `npm run typecheck` também.

### Task 5 — Tarefa 5: Marca e peças das telas de entrada

**Arquivos:**

- Renomear: `git mv -f src/components/marca/logo.tsx src/components/marca/Logo.tsx`. No Windows, mudar só a caixa do nome sem passar pelo git quebra o import na Vercel, que diferencia maiúsculas.
- Modificar: `src/app/page.tsx`, que vira só `redirect("/entrar")`. A rota `/entrar` nasce na Tarefa 6.
- Criar: `public/logo-microsoft.svg` e `src/components/entrada/{MolduraDeEntrada,SeloComVisto,CampoCodigo,ReenvioDeCodigo}.tsx`.
- Testes: `src/components/entrada/{CampoCodigo,ReenvioDeCodigo}.test.tsx`.

**Interfaces:**

- Consome: `formatarContagem` (Tarefa 2).
- Produz:
  - **`Logo({ tamanho?: 36 | 64; className? })`**, cliente. Mostra só a marca, com `next/image` e `alt="Farmácias Associadas"`. Se a imagem falhar (`onError`), mostra um quadrado `bg-accent rounded-xl` com o `Plus` branco e `role="img"` com o mesmo nome.
  - **`SeloComVisto({ children })`:** um `li` em pílula sobre o painel escuro (`bg-white/8 border border-white/12 text-white`), com `CircleCheck` em `text-primary`.
  - **`MolduraDeEntrada({ rotulo?, titulo, destaque, selos, children, rodape? })`**:
    - props: `rotulo?: string` (linha pequena acima do título, como "Área da equipe de PDV"), `titulo: string`, `destaque: string` (fim do título, em `text-realce`), `selos: string[]`, `children` (o cartão) e `rodape?: ReactNode` (embaixo do cartão);
    - estrutura: um `<header>` com o painel e um `<main>` com o cartão. O `h1` é o do cartão; o título do painel é um `<p>` em `font-titulo`, com `text-pagina` no celular e `lg:text-vitrine`;
    - painel: `superficie-escura bg-petroleo-900 text-white`. O logo (36 px, e 64 px a partir de `lg`) fica numa placa branca redonda com anel `ring-white/10`, com "Portal PDV" ao lado. Os selos ficam num `ul`. No pé, só no computador, vai "Setor de PDV · Farmácias Associadas" em `text-white/72`;
    - decoração, com `aria-hidden` e `pointer-events-none`: três arcos grandes em SVG, com traço `text-white/6`; um brilho `bg-primary/25 blur-3xl` atrás do título e um `bg-accent/15` no canto; e a `grade-de-pontos`;
    - no computador (`lg`): `grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]`, com o painel da altura da tela e o cartão centralizado em `max-w-md`. No celular, o painel vira uma faixa com `pb-24`, e o `main` sobe com `-mt-16`;
    - o título, os selos e o cartão entram com `animate-entrar`, com atrasos de 0, 80 e 160 ms.
  - **`limparCodigo(valor: string, tamanho = 6): string`:** só os algarismos, cortados no tamanho.
  - **`CampoCodigo({ id, name = "codigo", tamanho = 6, defaultValue?, autoFocus?, disabled?, "aria-invalid"?, "aria-describedby"? })`**, cliente, encaixa no `Field`:
    - um `input` de verdade, transparente e por cima das casas, com `inputMode="numeric"`, `autoComplete="one-time-code"`, `pattern="[0-9]*"`, `maxLength={tamanho}` e `text-corpo` (16 px, para o iPhone não dar zoom);
    - seis casas (`data-casa`) com os algarismos em `text-senha tabular-nums`. Com o campo em foco, a casa da vez mostra a borda `primary-strong`. Com `aria-invalid`, as bordas ficam em `red-700`.
  - **`ReenvioDeCodigo({ segundos, acao })`**, cliente, com `segundos: number` e `acao: ReactNode` (o botão de reenviar):
    - guarda a hora de término (`Date.now() + segundos * 1000`) e se atualiza a cada segundo;
    - enquanto falta tempo, mostra "Não chegou? Você pode pedir outro em {formatarContagem(restante)}.", com o número fora do `aria-live`, para o leitor de tela não ler a cada segundo;
    - quando o tempo acaba, mostra a `acao`.
  - **`public/logo-microsoft.svg`:** os quatro quadrados oficiais, num `viewBox` de 21×21, com quadrados de 10 nas posições 1/1, 11/1, 1/11 e 11/11, nas cores `#f25022`, `#7fba00`, `#00a4ef` e `#ffb900`.

- [ ] **Passo 1: escrever os testes.**
  - `CampoCodigo.test.tsx`: `limparCodigo("123-456")` dá `"123456"`; `limparCodigo("12a3")`, `"123"`; `limparCodigo("1234567")`, `"123456"`. O HTML do campo tem `inputmode="numeric"`, `autocomplete="one-time-code"`, `maxlength="6"` e seis `data-casa`.
  - `ReenvioDeCodigo.test.tsx`: com `segundos={45}`, o HTML tem "0:45" e não tem a `acao`; com `segundos={0}`, mostra a `acao`.
- [ ] **Passo 2:** rode `npm test -- src/components/entrada`. Ele falha, porque os componentes não existem.
- [ ] **Passo 3:** implemente.
- [ ] **Passo 4:** os testes passam, e `npm run lint` e `npm run typecheck` também.

### Task 6 — Tarefa 6: Telas de entrada e ações

**Arquivos:**

- Criar:
  - `src/lib/entrada.ts` e `src/lib/entrada.test.ts`;
  - `src/app/entrar/acoes.ts`, `src/app/entrar/acoes.test.ts` e `src/app/entrar/page.tsx`;
  - `src/app/admin/entrar/acoes.ts`, `src/app/admin/entrar/acoes.test.ts` e `src/app/admin/entrar/page.tsx`;
  - `src/components/entrada/{Telas,FormularioCnpj,FormularioCodigo,EntradaDaEquipe}.tsx`.

**Interfaces:**

- Consome: `validarCnpj`, `formatarCnpj` e `MotivoCnpjInvalido` (Tarefa 2); `Button`, `Card`, `Field`, `Input`, `Aviso` e `TomDoAviso` (Tarefa 3); `VoltarLink` (Tarefa 4); `MolduraDeEntrada`, `CampoCodigo` e `ReenvioDeCodigo` (Tarefa 5).
- Produz:
  - Em `src/lib/entrada.ts`: `type RespostaDaEntrada = { erro?: string; aviso?: { tom: TomDoAviso; texto: string }; valor?: string }`, os textos fixos `MENSAGENS` (tabela abaixo) e `mensagemDoCnpj(motivo: MotivoCnpjInvalido): string`.
  - Ações com `"use server"` e assinatura `(anterior: RespostaDaEntrada, dados: FormData) => Promise<RespostaDaEntrada>`: `pedirCodigo` e `conferirCodigo` em `src/app/entrar/acoes.ts`, e `entrarComMicrosoft` em `src/app/admin/entrar/acoes.ts`. O `conferirCodigo` trata o botão de reenviar pelo campo `intencao=reenviar`.
  - Em `Telas.tsx`: `TelaDoAssociado({ children })` e `TelaDaEquipe({ children })`, a moldura com os textos fixos de cada perfil. As páginas e a prévia usam essas duas.
  - Componentes cliente, todos com `estadoInicial?: RespostaDaEntrada` para a prévia: `FormularioCnpj({ estadoInicial? })`, `FormularioCodigo({ emailMascarado: string; segundosParaReenviar?: number; estadoInicial? })` (o padrão de `segundosParaReenviar` é 45) e `EntradaDaEquipe({ estadoInicial? })`.

**Textos fixos (`MENSAGENS`):**

| Chave                 | Texto                                                                                                                  |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `cnpjVazio`           | Digite o CNPJ de uma das suas lojas.                                                                                   |
| `cnpjTamanho`         | O CNPJ tem 14 caracteres. Confira e digite de novo.                                                                    |
| `cnpjCaractere`       | O CNPJ só tem letras e números. Confira e digite de novo.                                                              |
| `cnpjNaoConfere`      | Este CNPJ não confere. Confira os números e digite de novo. Vale para `digito` e `repetido`.                           |
| `acessoNaoLiberado`   | O acesso pelo portal ainda não foi liberado. Por enquanto, a equipe de PDV continua mandando os relatórios por e-mail. |
| `codigoFormato`       | O código tem 6 números. Confira o e-mail e digite de novo.                                                             |
| `codigoErrado`        | Código errado. Você ainda tem 4 tentativas.                                                                            |
| `codigoVencido`       | Este código venceu. Peça um novo.                                                                                      |
| `codigoBloqueado`     | Você errou o código 5 vezes. Peça um novo código.                                                                      |
| `codigoReenviado`     | Função `(email) => "Enviamos um novo código para ${email}."`                                                           |
| `equipeNaoLigada`     | A entrada da equipe ainda não foi ligada.                                                                              |
| `equipeSemAcesso`     | Sua conta ainda não tem acesso ao portal. Peça a liberação a quem administra o portal.                                 |
| `equipeForaDoDominio` | Use a sua conta @farmaciasassociadas.com.br. Contas pessoais não entram.                                               |

**Telas:**

- **`TelaDoAssociado`:** `titulo` "Tudo da sua loja,", `destaque` "num lugar só." e `selos` "Relatórios da assessoria", "Estudos de mercado" e "Fotos de antes e depois". No `rodape`, "É da equipe de PDV?" e o link "Entre com a conta Microsoft", para `/admin/entrar`.
- **`TelaDaEquipe`:** `rotulo` "Área da equipe de PDV", `titulo` "Publique o material e acompanhe", `destaque` "cada loja." e `selos` "Associados e lojas", "Avisos de material novo" e "Fotos enviadas pelos associados". No `rodape`, "É associado?" e o link "Entre com o CNPJ", para `/entrar`.
- **`/entrar`:** `metadata.title` "Entrar"; `<TelaDoAssociado><FormularioCnpj /></TelaDoAssociado>`.
- **`/admin/entrar`:** `metadata.title` "Entrar como equipe"; `<TelaDaEquipe><EntradaDaEquipe /></TelaDaEquipe>`.
- **Os três formulários** usam `useActionState`, `noValidate` e um `Card padding="lg" elevado`, com o `h1` em `font-titulo text-pagina font-semibold`.
- **`FormularioCnpj`:**
  - `h1` "Entrar no portal" e o texto "Digite o CNPJ de uma das suas lojas. Vamos mandar um código para o e-mail cadastrado.";
  - `Field id="cnpj" label="CNPJ da loja" dica="Com ou sem pontuação."`, com o erro do estado, em volta de um `Input name="cnpj"` com `defaultValue={estado.valor}`, `autoCapitalize="characters"`, `autoCorrect="off"`, `spellCheck={false}`, `autoComplete="off"` e `enterKeyHint="send"`;
  - o `Aviso` do estado;
  - `Button type="submit" size="lg"` com `w-full`, `iconeFinal={ArrowRight}` e `pending`, escrito "Enviar código" ou "Enviando código…".
- **`FormularioCodigo`:**
  - `VoltarLink href="/entrar"` com "Trocar CNPJ";
  - `h1` "Digite o código" e o texto "Mandamos um código de 6 números para {emailMascarado}. Ele vale por 10 minutos.", com o e-mail em `font-semibold` e `wrap-break-word`;
  - `Field id="codigo" label="Código de acesso"`, com o erro do estado, em volta de `CampoCodigo autoFocus`;
  - o `Aviso` do estado;
  - `Button type="submit" size="lg"` com `w-full` e `pending`, escrito "Entrar" ou "Entrando…";
  - `ReenvioDeCodigo`, cuja `acao` é `<Button type="submit" name="intencao" value="reenviar" variant="ghost">Reenviar código</Button>`.
- **`EntradaDaEquipe`:**
  - `h1` "Entrar como equipe" e o texto "Use a sua conta @farmaciasassociadas.com.br.";
  - o `Aviso` do estado;
  - `Button type="submit" variant="escuro" size="lg"` com `w-full` e `pending`, com `<Image src="/logo-microsoft.svg" alt="" width={20} height={20} />`, escrito "Entrar com a Microsoft" ou "Abrindo a Microsoft…".

- [ ] **Passo 1: escrever os testes.**
  - `entrada.test.ts`: `mensagemDoCnpj` dá `cnpjNaoConfere` para `digito` e para `repetido`, e o texto da tabela para cada um dos outros motivos.
  - `src/app/entrar/acoes.test.ts`, chamando as funções direto com um `FormData`:
    - `pedirCodigo({}, cnpj "")` dá `{ erro: MENSAGENS.cnpjVazio, valor: "" }`;
    - `"1122233300018"` dá `erro: cnpjTamanho` e mantém `valor: "1122233300018"`;
    - `"11.222.333/0001-82"` dá `erro: cnpjNaoConfere`;
    - `"11 222 333 0001 81"` dá `{ aviso: { tom: "atencao", texto: MENSAGENS.acessoNaoLiberado }, valor: "11.222.333/0001-81" }`;
    - `conferirCodigo({}, codigo "12a")` dá `erro: codigoFormato`; `"123456"` dá o aviso `acessoNaoLiberado`; `intencao=reenviar` também dá o aviso `acessoNaoLiberado`.
  - `src/app/admin/entrar/acoes.test.ts`: `entrarComMicrosoft({}, new FormData())` dá `{ aviso: { tom: "atencao", texto: MENSAGENS.equipeNaoLigada } }`.
- [ ] **Passo 2:** rode `npm test -- src/lib/entrada.test.ts src/app`. Os testes novos falham.
- [ ] **Passo 3:** implemente `entrada.ts`, as ações, `Telas.tsx`, os três formulários e as duas páginas.
- [ ] **Passo 4:** os testes passam, e `npm run lint` e `npm run typecheck` também.

### Task 7 — Tarefa 7: Prévia

**Arquivos:**

- Criar: `src/app/previa/garantir-previa.ts`, `src/app/previa/telas.tsx`, `src/app/previa/page.tsx`, `src/app/previa/[tela]/page.tsx` e `src/app/previa/componentes/page.tsx`. Se o catálogo ficar grande, divida as seções em arquivos dentro de `src/app/previa/componentes/`, e as partes interativas num componente cliente.

**Interfaces:**

- Consome: tudo das Tarefas 3 a 6, e `CORES` (Tarefa 1).
- Produz:
  - `garantirPrevia(): void`, que chama `notFound()` quando `env.NODE_ENV !== "development"`. As três páginas começam por ela.
  - `TELAS: Record<string, { titulo: string; grupo: "Associado" | "Equipe"; tela: () => ReactNode }>`. Cada item desenha a página inteira com o `estadoInicial` do estado. O e-mail da prévia é `jo***@gmail.com`.

**Estados da prévia (`TELAS`):**

| Chave                     | Tela e estado                                                       |
| ------------------------- | ------------------------------------------------------------------- |
| `cnpj`                    | `FormularioCnpj` vazio                                              |
| `cnpj-incompleto`         | `{ erro: cnpjTamanho, valor: "11.222.333/0001" }`                   |
| `cnpj-nao-confere`        | `{ erro: cnpjNaoConfere, valor: "11.222.333/0001-82" }`             |
| `cnpj-nao-liberado`       | `{ aviso: atencao/acessoNaoLiberado, valor: "11.222.333/0001-81" }` |
| `codigo`                  | `FormularioCodigo` com 45 s para o reenvio                          |
| `codigo-reenvio-liberado` | `FormularioCodigo` com `segundosParaReenviar={0}`                   |
| `codigo-errado`           | `{ erro: codigoErrado }`                                            |
| `codigo-vencido`          | `{ aviso: atencao/codigoVencido }`                                  |
| `codigo-bloqueado`        | `{ aviso: erro/codigoBloqueado }`                                   |
| `codigo-reenviado`        | `{ aviso: sucesso/codigoReenviado("jo***@gmail.com") }`             |
| `codigo-email-longo`      | `FormularioCodigo` com `ma***@farmaciasassociadas.com.br`           |
| `equipe`                  | `EntradaDaEquipe` vazia                                             |
| `equipe-nao-ligada`       | `{ aviso: atencao/equipeNaoLigada }`                                |
| `equipe-sem-acesso`       | `{ aviso: erro/equipeSemAcesso }`                                   |
| `equipe-fora-do-dominio`  | `{ aviso: erro/equipeForaDoDominio }`                               |

**Páginas:**

- **`/previa`:** `PageHeader` "Prévia do design system", com a descrição "Só aparece no ambiente de desenvolvimento."; duas listas (Associado e Equipe) com links para `/previa/<chave>`; e um link para `/previa/componentes`.
- **`/previa/[tela]`:** `params: Promise<{ tela: string }>`. Uma tela que não está em `TELAS` dá `notFound()`.
- **`/previa/componentes`:** uma seção para cada grupo, com `SectionTitle tamanho="secao"`:
  - cores: a amostra de cada item de `CORES`, com `style={{ backgroundColor }}` lido de `CORES`, o nome e o hex;
  - tipografia: cada estilo da escala;
  - botões: as variantes nos três tamanhos, com `pending`, com `iconeFinal` e desabilitado;
  - campos: `Field` com dica, com erro, opcional e desabilitado, mais `Select`, `Textarea` e `CampoCodigo`;
  - avisos: os quatro tons e um botão que chama `avisar`;
  - `Badge` e os seis grupos do `StatusBadge`;
  - `Stepper`;
  - `Table` com arquivos de exemplo e o `ArquivoIcon`;
  - `Card`, `EmptyState` e `Avatar`;
  - `DialogoConfirmacao`, com um botão que abre o diálogo;
  - `VoltarLink` e `LinkPendingHint`;
  - o `Logo` em 36 e 64 px e os selos sobre o petróleo.

- [ ] **Passo 1:** implemente as cinco páginas e arquivos acima.
- [ ] **Passo 2:** `npm run lint` e `npm run typecheck` passam. Cada estado é conferido no navegador na Tarefa 8.

### Task 8 — Tarefa 8: Guias, regras e conferência final

**Arquivos:**

- Criar: `docs/design-system/README.md`, `docs/design-system/logo.md` e `docs/design-system/componentes/<Componente>.md`, um para cada componente das Tarefas 3 a 6.
- Modificar: `AGENTS.md` (a regra "Cores" e a seção nova "Interface"), `README.md` (links) e `docs/documentacao-do-projeto.md` (a linha "Visual" da tabela de tecnologia).

- [ ] **Passo 1: `docs/design-system/README.md`**, a partir do `DESIGN.md` da origem, com estas seções:
  - os princípios do portal: o balcão primeiro; o código de acesso como "senha"; cor é informação, menos no painel da marca; o que foi digitado não se perde; cada perfil vê o que precisa;
  - conteúdo e tom, com exemplos do portal;
  - cores: tabela com cada token, o papel e o contraste;
  - tipografia: as duas famílias e a escala;
  - forma: pílula e raios;
  - profundidade: sombra flutuante e superfície escura;
  - movimento;
  - decoração do painel;
  - ícones e logo;
  - componentes, com um link para cada guia;
  - "De onde veio": FarmaDesk `main@f253be7` e a linguagem do clinia.io, como referência, sem copiar a marca;
  - "O que mudou em relação ao FarmaDesk".
- [ ] **Passo 2:** escreva um guia por componente (quando usar, o que passar e um exemplo curto), atualizando os da origem, e o `logo.md`.
- [ ] **Passo 3: `AGENTS.md`.**
  - A regra "Cores" passa a dizer:
    - use os tokens do Tailwind (`bg-primary`, `text-gray-600`, `bg-petroleo-900`…), nunca hex nos componentes;
    - os valores ficam em `src/lib/cores.ts` e no `globals.css`, e um teste confere os dois;
    - o teal `primary` é só preenchimento, com o texto sobre ele em `gray-950`; o texto teal é `primary-strong`; o laranja `accent` nunca é texto sobre fundo claro;
    - mantenha o teste de contraste verde para qualquer cor nova.
  - A seção nova "Interface" diz:
    - siga `docs/design-system/README.md`;
    - use os componentes de `src/components/ui` antes de escrever classes à mão;
    - veja tudo em `/previa`, com `npm run dev`.
- [ ] **Passo 4:** acrescente ao README uma seção curta "Design system", com os links para o guia e para a `/previa`, e atualize a linha "Visual" da documentação do projeto.
- [ ] **Passo 5:** rode `npx prettier --write` nos arquivos mudados. Os quatro gates passam: `npm run lint`, `npm run typecheck`, `npm test` e `npm run build`.
- [ ] **Passo 6:** rode o validador de tokens do plugin de design system (`node "C:/Users/gsoares/.claude/plugins/cache/ui-ux-pro-max-skill/ui-ux-pro-max/2.15.0/.claude/skills/design-system/scripts/validate-tokens.cjs" --dir src/components`, e depois com `--dir src/app`). Nenhum hex escrito direto pode aparecer fora do `globals.css` e do `cores.ts`.
- [ ] **Passo 7: confira no navegador, com `npm run dev`.** Abra `/entrar`, `/admin/entrar` e cada `/previa/*` em 1440, 1024, 768 e 390 px de largura e confira:
  - não há rolagem lateral, nem em 320 px com o e-mail longo;
  - o foco aparece com Tab no claro e no escuro;
  - o erro é anunciado, e o CNPJ digitado continua no campo depois de enviar;
  - `/` leva a `/entrar`;
  - não há erro no console.

  No fim, pare o `next dev`.
