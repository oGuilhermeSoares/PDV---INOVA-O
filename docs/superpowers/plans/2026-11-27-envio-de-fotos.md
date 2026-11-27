# Tela de envio de fotos e vídeos: plano de implementação

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** a tela em que o associado escolhe para onde vão as fotos e os vídeos, escolhe os arquivos, vê cada um subir e recebe a confirmação. Só o visual, com o envio simulado na prévia.

**Architecture:** as regras sem tela ficam em `src/lib/envio.ts`: tipos aceitos, tamanho, resumo, um reducer da fila e a fase do envio. A tela (`src/components/envio/`) recebe a função que envia um arquivo (`EnviarArquivo`). Na prévia, essa função é uma simulação passada por um componente cliente (`EnvioDaPrevia`). Na segunda parte do #20, é o envio de verdade, e a tela não muda.

**Tech Stack:** Next.js 16.4.6 (App Router), React 19, Tailwind 4.3 só com os tokens do design system, `lucide-react` e Vitest 4 com `renderToStaticMarkup` (`src/testes/renderizar.ts`).

**Spec:** [docs/superpowers/specs/2026-11-27-envio-de-fotos-design.md](../specs/2026-11-27-envio-de-fotos-design.md)

## Global Constraints

- Textos de tela em pt-BR, falando por "você". Botões em caixa normal e com verbo.
- Cores só pelos tokens (`bg-primary`, `text-gray-600`, `bg-petroleo-900`…), nunca hex. Texto teal é `primary-strong`, e o `primary` é só preenchimento.
- Os ícones vêm do `lucide-react`, com `aria-hidden="true"` quando decorativos. Botão só com ícone não entra nesta tela.
- Clicável é `button` ou `a`. Alvo de toque com pelo menos 44 px, que o `Button` já garante.
- É tela de trabalho: faixa petróleo lisa, sem `DecoracaoDoPainel` e sem movimento ligado à rolagem. `shadow-flutuante` só no diálogo.
- Componente que recebe função por prop não leva `"use client"`. Ele só é importado de componente cliente, o que evita o aviso 71007 do Next.
- Não mexer nas mudanças de ambiente do Guilherme: `src/app/api/saude/*`, `src/lib/env*.ts`, `src/instrumentation*.ts` e `src/lib/verificar-env.ts`. Nem em `.claude/`.
- Sem commits até o Guilherme pedir o PR. Prettier só nos arquivos mudados.
- Rode o Vitest pelo PowerShell (`npx vitest run …`). No Git Bash com `c:` minúsculo, ele falha.
- Os textos fixados pela spec, que devem aparecer exatamente assim:
  - motivos de recusa:
    - "Este tipo de arquivo não é aceito. Envie JPG, PNG, HEIC, MP4 ou MOV.";
    - "Maior que 1 GB. Este arquivo não vai ser enviado.";
    - "O arquivo está vazio.";
  - falha de um arquivo: "Não foi enviado. A conexão caiu no meio do envio.";
  - erros de validação:
    - "Escolha se as fotos e os vídeos são de antes ou de depois da assessoria.";
    - "Escolha pelo menos uma foto ou um vídeo.";
  - diálogo de saída:
    - título: "Sair antes de terminar o envio?";
    - descrição: "Os arquivos que ainda não foram enviados ficam de fora. Os que já foram continuam na pasta da loja.";
    - botões: "Continuar enviando" e "Sair e parar o envio";
  - dica de tipos: "JPG, PNG, HEIC, MP4 ou MOV, até 1 GB cada".

## Review Focus

1. Escolher de novo o mesmo arquivo depois de tirá-lo da lista: ele volta. O campo de arquivo zera o `value` a cada escolha, senão o `change` não dispara. Conferido no Chrome (Task 5).
2. Dois toques rápidos em "Enviar" disparam um envio só: uma `ref` de "rodando" barra o segundo. Conferido no Chrome (Task 5).
3. Ctrl ou Cmd + clique, ou um link com `target="_blank"`, durante o envio abre a outra aba sem o diálogo de saída. Conferido no Chrome (Task 5).
4. "foto.jpg.pdf", "foto." e "foto" sem extensão são recusados pelo tipo, e vale a última extensão. Teste na Task 1.
5. Um nome de 60 caracteres sem espaço, a 320 px, quebra a linha sem rolagem lateral (`wrap-anywhere`). Conferido no Chrome (Task 5).

---

### Task 1: Regras do envio (`src/lib/envio.ts`)

**Files:**

- Create: `src/lib/envio.ts`
- Test: `src/lib/envio.test.ts`

**Interfaces:**

- Consumes: `tipoDoArquivo(nome)` de `@/components/ui/ArquivoIcon`; `montarSecoes` de `@/lib/loja` (só no teste).
- Produces:
  - `type Momento = "antes" | "depois"`;
  - `type Destino = { lojaId: string; momento: Momento }`;
  - `type MotivoDaRecusa = "tipo" | "tamanho" | "vazio"`;
  - `type ArquivoEscolhido = { id: string; chave: string; nome: string; tamanho: number; miniatura?: string }`;
  - `type ArquivoNaFila = ArquivoEscolhido & ({ situacao: "pronto" } | { situacao: "recusado"; motivo: MotivoDaRecusa } | { situacao: "enviando"; progresso: number } | { situacao: "enviado" } | { situacao: "falhou" })`;
  - `type AcaoDaFila`, com as ações:
    - `{ tipo: "escolheu"; arquivos: ArquivoEscolhido[] }`;
    - `{ tipo: "tirou" | "comecou" | "terminou" | "falhou"; id: string }`;
    - `{ tipo: "progrediu"; id: string; fracao: number }`;
    - `{ tipo: "parou" | "recomecou" | "limpou" }`;
  - `type FaseDoEnvio = "escolhendo" | "enviando" | "com-falha" | "concluido"`;
  - `type Contagem = { fotos: number; videos: number }`;
  - `type EnviarArquivo = (arquivo: File, destino: Destino, opcoes: { aoProgredir: (fracao: number) => void; sinal: AbortSignal }) => Promise<void>`;
  - `type EstadoInicialDoEnvio = { momento?: Momento; fila?: ArquivoNaFila[]; erros?: ErrosDoEnvio }`, com `type ErrosDoEnvio = { momento?: string; arquivos?: string }`;
  - as constantes:
    - `ACCEPT = ".jpg,.jpeg,.png,.heic,.mp4,.mov,image/jpeg,image/png,image/heic,video/mp4,video/quicktime"`;
    - `TAMANHO_MAXIMO = 1_000_000_000`;
    - `MOTIVOS: Record<MotivoDaRecusa, string>`;
    - `MENSAGEM_DE_FALHA`;
    - `ERROS = { momento, arquivos }`;
    - `DICA_DOS_TIPOS`;
    - `SECAO_DO_MOMENTO: Record<Momento, string>`, com "Fotos e vídeos: antes" e "Fotos e vídeos: depois";
  - as funções:
    - `motivoDaRecusa({ nome, tamanho }): MotivoDaRecusa | null`;
    - `formatarTamanho(bytes: number): string`;
    - `contar(arquivos: { nome: string }[]): Contagem`;
    - `descreverQuantidade(c: Contagem): string`;
    - `tituloDoConcluido(c: Contagem): string`;
    - `rotuloDoEnvio(c: Contagem): string`;
    - `mensagemDeFalha(quantos: number): string`;
    - `resumoDaEscolha(total: number, recusados: number): string`;
    - `progressoDoEnvio(fila: ArquivoNaFila[]): string`;
    - `chaveDoArquivo(arquivo: { name: string; size: number; lastModified: number }): string`;
    - `filaDeEnvio(fila: ArquivoNaFila[], acao: AcaoDaFila): ArquivoNaFila[]`;
    - `faseDoEnvio(fila: ArquivoNaFila[], rodando: boolean): FaseDoEnvio`.

- [ ] **Step 1: Escrever os testes**

`describe("motivoDaRecusa")`:

- aceitam (`null`): `IMG_2041.HEIC`, `a.JPG`, `b.jpeg`, `c.png`, `d.mp4` e `VID_0007.MOV`, todos com 1000 bytes;
- recusam pelo `"tipo"`: `Planograma.pdf`, `foto.gif`, `foto.jpg.pdf`, `foto.` e `foto`;
- `TAMANHO_MAXIMO` passa, e `TAMANHO_MAXIMO + 1` é `"tamanho"`;
- 0 bytes é `"vazio"`.

`describe("formatarTamanho")`:

- `820_000` → `"820 KB"`;
- `4_200_000` → `"4,2 MB"`;
- `1_300_000_000` → `"1,3 GB"`;
- `312` → `"1 KB"`.

`describe("resumo")`:

| Contagem                   | `descreverQuantidade` | `tituloDoConcluido`           |
| -------------------------- | --------------------- | ----------------------------- |
| `{ fotos: 12, videos: 1 }` | "12 fotos e 1 vídeo"  | "12 fotos e 1 vídeo enviados" |
| `{ fotos: 1, videos: 0 }`  |                       | "1 foto enviada"              |
| `{ fotos: 2, videos: 0 }`  |                       | "2 fotos enviadas"            |
| `{ fotos: 0, videos: 1 }`  |                       | "1 vídeo enviado"             |
| `{ fotos: 0, videos: 2 }`  |                       | "2 vídeos enviados"           |

Também nesse bloco:

- `rotuloDoEnvio({ fotos: 0, videos: 0 })` → "Enviar fotos e vídeos";
- `rotuloDoEnvio({ fotos: 12, videos: 1 })` → "Enviar 12 fotos e 1 vídeo";
- `mensagemDeFalha(1)` → "1 arquivo não foi enviado. Confira a internet e tente de novo.";
- `mensagemDeFalha(2)` → "2 arquivos não foram enviados. Confira a internet e tente de novo.";
- `resumoDaEscolha(1, 0)` → "1 arquivo escolhido.";
- `resumoDaEscolha(13, 1)` → "13 arquivos escolhidos. 1 não vai ser enviado.";
- `resumoDaEscolha(13, 2)` → "13 arquivos escolhidos. 2 não vão ser enviados.";
- `contar` conta `.MOV` e `.mp4` como vídeo e o resto como foto.

`describe("SECAO_DO_MOMENTO")`: os dois textos são iguais aos títulos que `montarSecoes([{ nome: "Fotos antes", arquivos: [] }, { nome: "Fotos Depois", arquivos: [] }])` devolve.

`describe("filaDeEnvio")`, a partir de uma fila vazia:

- `escolheu` com um `.HEIC` de 4 MB, um `.MOV` de 1,3 GB e um `.pdf` dá as situações `pronto`, `recusado/tamanho` e `recusado/tipo`;
- `escolheu` de novo com a mesma `chave` não repete a linha, e uma `chave` repetida no mesmo lote também não;
- dois arquivos com o mesmo nome e `chave` diferente entram os dois;
- `tirou` remove um `pronto`, um `recusado` e um `falhou`, mas não um `enviado` nem um `enviando`;
- `comecou` leva a `enviando` com progresso 0;
- `progrediu` com 1,5 fica em 1;
- `terminou` leva a `enviado`, e `falhou` leva a `falhou`;
- `parou` volta todo `enviando` para `pronto`;
- `recomecou` volta todo `falhou` para `pronto`;
- `limpou` esvazia a fila.

`describe("faseDoEnvio")`:

- vazia → `escolhendo`;
- só `pronto` → `escolhendo`;
- `rodando` true → `enviando`;
- algum `enviando` → `enviando`, mesmo com `rodando` false (é a prévia estática);
- algum `falhou` → `com-falha`;
- todos os válidos `enviado` (com um `recusado` junto) → `concluido`;
- só `recusado` → `escolhendo`.

`progressoDoEnvio` de 2 enviados, 1 enviando, 10 prontos e 1 recusado → "2 de 13 enviados".

- [ ] **Step 2: Rodar e ver falhar**

Run: `npx vitest run src/lib/envio.test.ts`
Expected: FAIL, com "Failed to resolve import" de `@/lib/envio`.

- [ ] **Step 3: Implementar `src/lib/envio.ts`**

- A extensão é o que vem depois do último ponto, em minúsculas. Vazia, ela é `"tipo"`. A ordem das checagens é tipo, vazio e tamanho.
- O tamanho segue a base 1000: abaixo de 1 MB, em KB inteiro e no mínimo 1; abaixo de 1 GB, em MB com uma casa; acima, em GB com uma casa. Use `Intl.NumberFormat("pt-BR", { maximumFractionDigits: 1 })`.
- `chaveDoArquivo` é `${name}|${size}|${lastModified}`.
- O particípio: só fotos, "enviada" ou "enviadas"; só vídeos, "enviado" ou "enviados"; misturado, "enviados".
- Comentário no topo: as regras seguem a seção 6.3 e as perguntas 1 e 5 da documentação, e o limite de 1 GB ainda espera a palavra da Camila.

- [ ] **Step 4: Rodar e ver passar**

Run: `npx vitest run src/lib/envio.test.ts`
Expected: PASS em todos.

---

### Task 2: As peças da tela (destino, arquivos, linha e conclusão)

**Files:**

- Create:
  - `src/components/envio/TituloDoPasso.tsx`
  - `src/components/envio/EscolhaDoDestino.tsx`
  - `src/components/envio/LinhaDoArquivo.tsx`
  - `src/components/envio/AreaDeArquivos.tsx`
  - `src/components/envio/EnvioConcluido.tsx`
- Test: `src/components/envio/Envio.test.tsx`

**Interfaces:**

- Consumes:
  - o que a Task 1 exporta;
  - `OpcaoDeLoja` de `@/components/loja/SeletorDeLoja`;
  - `nomeDaLoja` de `@/lib/loja`;
  - os componentes de interface: `Button`, `buttonStyles`, `Card`, `Select`, `Field`, `ArquivoIcon` e `tipoDoArquivo`.
- Produces (nenhum com `"use client"`):
  - `TituloDoPasso({ numero: number; id: string; children })`: o número num círculo `bg-primary-light text-primary-strong`, mais um `h2` com `font-titulo text-secao`;
  - `EscolhaDoDestino({ lojas: OpcaoDeLoja[]; lojaId: string; aoMudarLoja: (id: string) => void; momento?: Momento; aoMudarMomento: (m: Momento) => void; erro?: string; desabilitado: boolean; refDoMomento: Ref<HTMLInputElement> })`. É o cartão do passo 1, "Para onde vão". Com uma loja só, mostra "Loja" e o nome (via `nomeDaLoja`). Com duas ou mais, mostra o `Field` com o `Select` "Loja". Embaixo vem a `EscolhaDoMomento`;
  - `EscolhaDoMomento({ momento?, aoMudar, erro?, desabilitado, refDoPrimeiro })`, exportado do mesmo arquivo:
    - um `fieldset` cuja `legend` é "As fotos e os vídeos são de antes ou de depois da assessoria?";
    - dois `label` em cartão, cada um com um `input type="radio" name="momento"`: "Antes" com a dica "Como a loja estava" e "Depois" com "Como a loja ficou";
    - o cartão marcado fica com `has-checked:border-primary-strong has-checked:bg-primary-light`;
    - o erro vai num `p role="alert"`, ligado ao `fieldset` por `aria-describedby`;
  - `LinhaDoArquivo({ arquivo: ArquivoNaFila; fase: FaseDoEnvio; aoTirar: (id: string) => void })`. A linha segue a tabela "Cada arquivo na lista" da spec:
    - a miniatura `size-12 rounded-xl`, com `<img>` da `miniatura` quando houver. No erro de carga (HEIC no Chrome), volta o `ArquivoIcon` numa caixa `bg-primary-light`;
    - o nome com `wrap-anywhere`, e embaixo `ROTULO_DO_TIPO · formatarTamanho`;
    - a barra é um `div role="progressbar"` com `aria-valuemin=0`, `aria-valuemax=100`, `aria-valuenow` e `aria-label="Enviando <nome>"`, em trilho `bg-primary-light` e preenchimento `bg-primary-strong`;
    - "Tirar" é `Button variant="ghost" size="sm"` com `aria-label="Tirar <nome>"`, e só aparece em `pronto`, `recusado` e `falhou` fora da fase `enviando`;
    - "Na fila" aparece em `pronto` durante a fase `enviando`;
    - os ícones: `CircleCheck` em `text-status-resolvido` e `CircleAlert` em `text-status-recusado`;
  - `AreaDeArquivos({ fila; fase; aoEscolher: (arquivos: File[]) => void; aoTirar; erro?: string; refDoBotao: Ref<HTMLButtonElement> })`. É o cartão do passo 2, "Fotos e vídeos":
    - uma área tracejada (`border-dashed border-gray-300 rounded-xl`) que, com algo arrastado por cima, fica `border-primary-strong bg-primary-light`. O `onDragOver` chama `preventDefault`, e o `onDrop` passa `dataTransfer.files` para `aoEscolher`. Na fase `enviando`, a área ignora o que for solto nela;
    - nela, o `Button variant="secondary"` com o `ImagePlus`: "Escolher fotos e vídeos" com a lista vazia, "Escolher mais" com ela cheia. Ele fica `disabled` na fase `enviando`;
    - o `input type="file" multiple accept={ACCEPT} className="sr-only" tabIndex={-1} aria-hidden="true"`. Ele zera o `value` depois de cada `change`;
    - a dica "ou arraste os arquivos para cá" (só a partir de `sm:`) e a `DICA_DOS_TIPOS`;
    - o erro em `p role="alert"`;
    - a `ul aria-label="Arquivos escolhidos"` com uma `LinhaDoArquivo` por item;
  - `EnvioConcluido({ contagem: Contagem; momento: Momento; loja: OpcaoDeLoja; aoEnviarMais: () => void })`. É um `Card`:
    - a caixa com o `CircleCheck` em `bg-status-resolvido-bg text-status-resolvido`;
    - o `h2` `tituloDoConcluido(contagem)`, com `tabIndex={-1}`, que recebe o foco num `useEffect` ao montar;
    - o texto "Já estão em <SECAO_DO_MOMENTO[momento]>, na tela da loja. A equipe de PDV recebe um aviso.";
    - "Loja: <nomeDaLoja(loja.nome)>" em `text-apoio text-gray-600`;
    - o link "Ver na tela da loja" (`buttonStyles()`, `href={loja.href}`) e o `Button variant="secondary"` "Enviar mais fotos e vídeos".

- [ ] **Step 1: Escrever os testes em `Envio.test.tsx`**

Os casos ficam em `describe` separados:

- `EscolhaDoDestino` com uma loja: tem ">Loja<" e "Drogaria Jumalti - Caxias do Sul", e nenhum `<select`;
- com duas lojas: tem `<select`, as duas `<option`, e a de `lojaId` com `selected=""`;
- `EscolhaDoMomento`: dois `type="radio"` com `name="momento"`, nenhum com `checked`, a `legend` com o texto da spec e as dicas "Como a loja estava" e "Como a loja ficou";
- `EscolhaDoMomento` com `erro`: `role="alert"` com `ERROS.momento`, e o `aria-describedby` do `fieldset` igual ao `id` do erro;
- `LinhaDoArquivo` `pronto` em `escolhendo`: `aria-label="Tirar IMG_2041.HEIC"` e "Foto · 4,2 MB";
- `recusado/tamanho`: `MOTIVOS.tamanho` e "Tirar";
- `enviando` com progresso 0,64: `role="progressbar"`, `aria-valuenow="64"`, "64%" e nenhum "Tirar";
- `pronto` na fase `enviando`: "Na fila" e nenhum "Tirar";
- `enviado`: "Enviado" e nenhum "Tirar";
- `falhou` em `com-falha`: `MENSAGEM_DE_FALHA` e "Tirar";
- `AreaDeArquivos` vazia: `type="file"`, `multiple=""`, `accept="<ACCEPT>"`, "Escolher fotos e vídeos" e `DICA_DOS_TIPOS`;
- com um item: "Escolher mais" e `aria-label="Arquivos escolhidos"`;
- `AreaDeArquivos` na fase `enviando`: o botão com `disabled=""`;
- `EnvioConcluido` com `{ fotos: 12, videos: 1 }` e `antes`: "12 fotos e 1 vídeo enviados", "Já estão em Fotos e vídeos: antes", o `href` da loja e "Enviar mais fotos e vídeos".

- [ ] **Step 2: Rodar e ver falhar**

Run: `npx vitest run src/components/envio`
Expected: FAIL, com "Failed to resolve import".

- [ ] **Step 3: Implementar os cinco componentes** conforme o bloco Interfaces.

- [ ] **Step 4: Rodar e ver passar**

Run: `npx vitest run src/components/envio src/lib/envio.test.ts`, depois `npx eslint src/components/envio src/lib/envio.ts` e `npx tsc --noEmit`.
Expected: PASS, e o ESLint e o tsc limpos.

---

### Task 3: A tela inteira, o envio e a proteção de saída

**Files:**

- Create:
  - `src/components/envio/ProtecaoDeSaida.tsx`
  - `src/components/envio/FormularioDeEnvio.tsx`
  - `src/components/envio/TelaDeEnvio.tsx`
- Modify: `src/components/ui/VoltarLink.tsx` (prop `escuro`)
- Test: `src/components/envio/TelaDeEnvio.test.tsx`

**Interfaces:**

- Consumes: o que a Task 1 e a Task 2 exportam, mais `BarraDaLoja`, `DialogoConfirmacao`, `Aviso` e `RegiaoDeAviso` (ou uma `div aria-live`).
- Produces:
  - `VoltarLink({ href, escuro?: boolean, children })`. Com `escuro`, a cor é `text-white/72 hover:text-white`;
  - `ProtecaoDeSaida({ ativa: boolean; aoSair: () => void })`. Enquanto `ativa`:
    - liga o `beforeunload` (`preventDefault` e `returnValue = ""`), a menos que uma `ref` "saindo" esteja ligada;
    - liga um `click` em captura no `document`. Ele acha `closest("a[href]")` e ignora `target="_blank"`, `download` e os cliques com Ctrl, Cmd, Shift, Alt ou outro botão do mouse. Nos outros, chama `preventDefault()` e `stopPropagation()`, guarda o `href` e abre o `DialogoConfirmacao` com os textos da spec;
    - "Continuar enviando" (`variant="secondary"`) fecha o diálogo;
    - "Sair e parar o envio" (`variant="danger-solid"`) liga "saindo", chama `aoSair()` e depois `window.location.assign(href)`;
  - `FormularioDeEnvio({ lojas; lojaId; enviar: EnviarArquivo; estadoInicial?: EstadoInicialDoEnvio & { arquivos?: Map<string, File> } })`. Estado:
    - `lojaEscolhida`, `momento`, `erros` e `fila` (`useReducer(filaDeEnvio, estadoInicial?.fila ?? [])`);
    - `rodando`, como `useState` para a tela e como `ref` para barrar o segundo toque;
    - o `Map` de `File` (iniciado com `estadoInicial.arquivos`), o `AbortController`, o `Set` das URLs de miniatura e a `mensagem` da última escolha.

  O que o formulário faz:
  - **aoEscolher(files):**
    - descarta as `chave` que já estão na fila;
    - cria a `miniatura` com `URL.createObjectURL` só para `tipoDoArquivo === "imagem"`;
    - guarda o `File` no `Map` e despacha `escolheu`;
    - grava `resumoDaEscolha(novos, recusados)` em `mensagem` e limpa `erros.arquivos`.
  - **aoTirar(id):** revoga a URL da miniatura e despacha `tirou`.
  - **Enviar:**
    - sem `momento`, grava `ERROS.momento` e foca `refDoMomento`;
    - sem item `pronto` nem `falhou`, grava `ERROS.arquivos` e foca `refDoBotao`;
    - se não, despacha `recomecou` e envia em série os ids `pronto` da fila (já com os recomeçados), em ordem.
    - Para cada id: despacha `comecou`, chama `enviar(file, { lojaId: lojaEscolhida, momento }, { aoProgredir, sinal })` e despacha `terminou`.
    - Num erro com o sinal abortado, despacha `parou` e para. Num erro sem abortar, despacha `falhou` e segue.
    - Um id sem `File` no `Map` vira `falhou`.
    - No fim, `rodando` volta a false.
  - **Enviar mais:** revoga as URLs, despacha `limpou`, limpa o `Map`, o `momento` e os `erros`.
  - **Ao desmontar:** revoga todas as URLs.

  A renderização segue `faseDoEnvio(fila, rodando)`:
  - **`concluido`:** só o `EnvioConcluido`, com `contar(fila.filter(enviado))` e a loja escolhida;
  - **fora disso**, nesta ordem:
    - `EscolhaDoDestino` (`desabilitado` na fase `enviando`);
    - `AreaDeArquivos`;
    - na fase `com-falha`, um `Aviso tom="erro"` com `mensagemDeFalha(n)`;
    - uma `div aria-live="polite"` em `sr-only` com `progressoDoEnvio(fila)` na fase `enviando` e `mensagem` nas outras;
    - a barra de ação `sticky bottom-0`, branca, com borda de cima `gray-200`. O botão principal ocupa a largura toda no celular e fica com largura própria a partir de `sm:`. O rótulo:
      - na fase `com-falha`: "Tentar de novo", com `RotateCw`;
      - na fase `enviando`: `pending` e "Enviando…";
      - nas outras: `rotuloDoEnvio(contar(prontos))`, com `Upload`;
  - **sempre:** a `ProtecaoDeSaida` com `ativa` na fase `enviando` e `aoSair` que aborta o controller.
  - `TelaDeEnvio({ lojas; lojaId; enviar; estadoInicial? })`, de cima para baixo:
    - a `BarraDaLoja`;
    - a faixa `superficie-escura bg-petroleo-900 text-white`, com o `VoltarLink escuro href={origem.href}` "Sua loja", o `h1` "Enviar fotos e vídeos" (`font-titulo text-pagina`) e o texto `text-white/72` "Os arquivos vão direto para a pasta da loja, na qualidade original.";
    - o conteúdo em `max-w-3xl`, com o `FormularioDeEnvio`;
    - o rodapé "Setor de PDV · Farmácias Associadas", igual ao da `TelaDaLoja`.

    `origem` é a loja de `lojas` com o id `lojaId`.

- [ ] **Step 1: Escrever `TelaDeEnvio.test.tsx`**

A função `enviar` dos testes é `async () => {}`. Os casos:

- vazio, com uma loja: "Enviar fotos e vídeos" no `h1`; um link "Sua loja" com o `href` da loja; nenhum `<select`; e o botão "Enviar fotos e vídeos" sem `aria-busy`;
- com `estadoInicial.fila` de 2 fotos e 1 vídeo prontos e 1 recusado: "Enviar 2 fotos e 1 vídeo";
- um item `enviando`: `aria-busy="true"`, "Enviando…" e o `fieldset` com `disabled=""`;
- um item `falhou`: `mensagemDeFalha(1)` e "Tentar de novo";
- todos `enviado` (12 fotos e 1 vídeo) com o momento `antes`: "12 fotos e 1 vídeo enviados", e nenhum `type="file"`;
- `estadoInicial.erros.momento`: o texto `ERROS.momento` com `role="alert"`;
- `VoltarLink` com `escuro` tem `text-white/72`, e sem ele tem `text-gray-600`.

O teste de `VoltarLink` fica em `src/components/ui/VoltarLink.test.tsx`, que é novo.

- [ ] **Step 2: Rodar e ver falhar**

Run: `npx vitest run src/components/envio/TelaDeEnvio.test.tsx src/components/ui/VoltarLink.test.tsx`
Expected: FAIL, com "Failed to resolve import" e a classe que falta.

- [ ] **Step 3: Implementar a `VoltarLink`, a `ProtecaoDeSaida`, o `FormularioDeEnvio` e a `TelaDeEnvio`** conforme o bloco Interfaces.

- [ ] **Step 4: Rodar e ver passar**

Run: `npx vitest run src/components src/lib/envio.test.ts`, depois `npx eslint src/components` e `npx tsc --noEmit`.
Expected: PASS, e o ESLint e o tsc limpos.

---

### Task 4: Prévia e o botão da tela da loja

**Files:**

- Create: `src/app/previa/EnvioDaPrevia.tsx` (`"use client"`)
- Modify:
  - `src/app/previa/dados-de-exemplo.ts`
  - `src/app/previa/telas.tsx`
  - `src/app/previa/page.tsx`
  - `src/components/loja/TelaDaLoja.tsx`
  - `src/components/loja/BotoesDaLoja.tsx`
  - `src/components/loja/TelaDaLoja.test.tsx`

**Interfaces:**

- Consumes: `TelaDeEnvio` (Task 3); `ArquivoNaFila`, `EstadoInicialDoEnvio` e `EnviarArquivo` (Task 1).
- Produces:
  - `EnvioDaPrevia({ lojas: OpcaoDeLoja[]; lojaId: string; estadoInicial?: EstadoInicialDoEnvio })`:
    - cria um `File` vazio (`new File([], nome)`) para cada item da fila de exemplo e passa um `Map` em `estadoInicial.arquivos`, com um comentário explicando que só a prévia faz isso;
    - renderiza a `TelaDeEnvio` com `enviar={simularEnvio}`;
  - `simularEnvio: EnviarArquivo`: dez passos de 120 ms com `setTimeout`, chamando `aoProgredir(passo / 10)`. Ele rejeita com `new DOMException("Envio parado", "AbortError")` quando o `sinal` aborta, e sempre termina bem;
  - em `dados-de-exemplo.ts`:
    - `ESCOLHIDOS_DE_EXEMPLO: { nome: string; tamanho: number }[]`, com seis arquivos:
      - `IMG_2041.HEIC` (4.200.000);
      - `IMG_2042.HEIC` (3.900.000);
      - `WhatsApp Image 2026-11-26 at 10.12.03.jpeg` (312.000);
      - `VID_0007.MOV` (1.300.000.000);
      - `Planograma.pdf` (820.000);
      - `VID_0008.MOV` (86.000.000);
    - `LEVA_DE_EXEMPLO`, com 12 fotos (`IMG_2041.HEIC` a `IMG_2052.HEIC`, de 3 a 4,5 MB) e 1 vídeo (`VID_0008.MOV`);
    - `type SituacaoDoExemplo = "pronto" | "enviado" | "falhou" | { progresso: number }`;
    - `filaDeExemplo(arquivos, situacao: (i: number) => SituacaoDoExemplo): ArquivoNaFila[]`, com `id` e `chave` iguais ao nome. Os recusados saem de `motivoDaRecusa`, seja qual for a situação pedida;
  - `TelaDaLoja`:
    - ganha a prop `enviarHref: string`;
    - o `BotaoEnviar` vira um `Link` com `buttonStyles({ className: "shrink-0 self-start md:self-auto" })`, o `Upload` e "Enviar fotos e vídeos";
    - o `BotaoEnviar` sai do `BotoesDaLoja` e fica só o `BotaoTentarDeNovo`;
  - em `telas.tsx`:
    - o grupo ganha `"Envio"`;
    - as telas da loja passam `enviarHref`: `/previa/envio` com uma loja e `/previa/envio-varias-lojas` com `DUAS_LOJAS`;
    - entram as sete telas da spec, com os títulos:

| Chave                   | Título                                | Estado                                                          |
| ----------------------- | ------------------------------------- | --------------------------------------------------------------- |
| `envio`                 | "Envio, com uma loja"                 | vazio                                                           |
| `envio-varias-lojas`    | "Envio, com duas lojas"               | `DUAS_LOJAS`                                                    |
| `envio-escolhendo`      | "Arquivos escolhidos, dois recusados" | antes e `ESCOLHIDOS_DE_EXEMPLO`                                 |
| `envio-faltou-escolher` | "Faltou escolher antes ou depois"     | `ESCOLHIDOS_DE_EXEMPLO` e `erros.momento`                       |
| `envio-enviando`        | "Enviando"                            | `LEVA_DE_EXEMPLO`: 2 enviados, 1 a 0,64 e o resto pronto; antes |
| `envio-com-falha`       | "Um arquivo não foi"                  | `LEVA_DE_EXEMPLO`: o último `falhou` e o resto enviado; antes   |
| `envio-concluido`       | "Envio concluído"                     | `LEVA_DE_EXEMPLO`, tudo enviado; antes                          |

- `page.tsx`: `GRUPOS` ganha `{ grupo: "Envio", titulo: "Envio de fotos e vídeos" }`, depois de "Loja".

- [ ] **Step 1: Atualizar o `TelaDaLoja.test.tsx`**

O primeiro teste passa `enviarHref="/enviar"` e espera `href="/enviar"` ao lado de "Enviar fotos e vídeos". Os outros dois também passam `enviarHref`.

- [ ] **Step 2: Rodar e ver falhar**

Run: `npx vitest run src/components/loja/TelaDaLoja.test.tsx`
Expected: FAIL, sem o `href="/enviar"`.

- [ ] **Step 3: Implementar** o bloco Interfaces.

- [ ] **Step 4: Rodar tudo**

Run: `npx vitest run`, depois `npm run lint` e `npm run typecheck`.
Expected: PASS em todos, com uma exceção conhecida: o `src/instrumentation.test.ts` do Guilherme pode estourar o tempo com o `next dev` rodando, e sozinho ele passa. O lint e o typecheck ficam limpos.

---

### Task 5: Documentação, gates e conferência no navegador

**Files:**

- Create: `docs/design-system/componentes/TelaDeEnvio.md`
- Modify:
  - `docs/design-system/README.md` (lista de componentes; a `shadow-flutuante` continua só no diálogo)
  - `docs/design-system/componentes/TelaDaLoja.md` (o botão leva à tela de envio)
  - `docs/design-system/componentes/VoltarLink.md` (`escuro`)
  - `README.md` (um parágrafo sobre a tela de envio)
  - `docs/documentacao-do-projeto.md`, seção 6.3: uma linha dizendo que a tela está desenhada na prévia e que o envio de verdade é a segunda parte do #20
- Ledger: `.superpowers/sdd/2026-11-27-envio-de-fotos/progress.md`

- [ ] **Step 1: Escrever o guia `TelaDeEnvio.md`**

Ele segue o formato do `TelaDaLoja.md`: o uso de `TelaDeEnvio`, a tela de cima para baixo, a tabela das situações, o envio, a saída no meio, o ponto de troca (`EnviarArquivo`), a pergunta 1 e a prévia. Depois, os outros documentos do bloco Files.

- [ ] **Step 2: Formatar só os arquivos mudados**

Run: `npx prettier --write` com a lista de `git status --short`, sem os arquivos de ambiente do Guilherme.

- [ ] **Step 3: Rodar os quatro gates**

Run: `npm run lint`, `npm run typecheck`, `npm test` e `npm run build`.
Expected: todos passam. A única exceção é o timeout conhecido do `instrumentation.test.ts`, que precisa passar sozinho.

- [ ] **Step 4: Conferir no Chrome sem janela**

Use o `next dev` do Guilherme na porta 3100. Se ele não responder, suba um na 3101 e pare só esse no fim. O roteiro do CDP fica no scratchpad.

1. As sete telas de envio, em 320, 375, 768, 1024 e 1440 px: nenhuma tem rolagem lateral.
2. Em `/previa/envio`, `DOM.setFileInputFiles` com cinco arquivos do scratchpad:
   - um PNG de verdade, que precisa mostrar a miniatura;
   - um `.HEIC` falso, que fica com o ícone;
   - um `.pdf`, recusado pelo tipo;
   - um arquivo de 0 byte, recusado como vazio;
   - um nome de 60 caracteres sem espaço, que não pode causar rolagem a 320 px.
3. O mesmo PNG escolhido de novo não repete a linha. Depois de "Tirar", escolhido de novo, ele volta.
4. "Enviar" sem marcar antes ou depois mostra o erro e foca o primeiro radio. Marcado "Antes", dois cliques seguidos em "Enviar" disparam um envio só, e as barras andam até o cartão de sucesso, que recebe o foco.
5. Em `/previa/envio-enviando`:
   - o clique em "Sua loja" abre o diálogo;
   - "Continuar enviando" fecha o diálogo;
   - Ctrl + clique em "Sair" não abre o diálogo.
6. Em `/previa/envio-com-falha`, "Tentar de novo" leva ao cartão de sucesso.
7. Em `/previa/loja`, o botão "Enviar fotos e vídeos" leva a `/previa/envio`.
8. O console fica limpo, e as capturas de tela são olhadas uma a uma.

- [ ] **Step 5: Registrar no caderno e abrir a prévia no navegador do Guilherme**

Anote no ledger as decisões tomadas em cada tarefa. Depois, abra `http://localhost:3100/previa` com `Start-Process`.
