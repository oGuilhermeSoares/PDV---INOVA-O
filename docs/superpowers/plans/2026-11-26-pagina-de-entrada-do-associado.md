# Página de entrada do associado (plano de implementação)

> **Para agentes:** SUB-SKILL OBRIGATÓRIA: use superpowers:subagent-driven-development (recomendado) ou superpowers:executing-plans para implementar este plano tarefa por tarefa. Os passos usam checkbox (`- [ ]`).

**Objetivo:** transformar `/entrar` numa página de apresentação no estilo do clinia, com o login no primeiro bloco e, abaixo dele, a prévia da tela da loja, o que tem no portal, como funciona, as perguntas frequentes e a chamada final. `/admin/entrar` passa a usar o mesmo hero.

**Arquitetura:**

- A página é montada por `TelaDoAssociado`: `BarraDoPortal` (o `<header>`), `<main>` com o hero e as seções, e `RodapeDoPortal`.
- O hero é a `MolduraDeEntrada`, refeita como bloco escuro na largura toda.
- O movimento ligado à rolagem é só CSS (`animation-timeline`), dentro de `@supports` e de `prefers-reduced-motion: no-preference`. Fora disso, tudo aparece parado.
- O acordeão é `<details>` nativo.

**Tecnologia:** a mesma do plano de 25/11. Nenhuma dependência nova.

**Spec:** [2026-11-26-pagina-de-entrada-do-associado-design.md](../specs/2026-11-26-pagina-de-entrada-do-associado-design.md). O guia é o [README do design system](../../design-system/README.md).

## Restrições globais

- Valem todas as do [plano de 25/11](2026-11-25-design-system-e-telas-de-entrada.md): pt-BR, tokens, ícones Lucide, 44 px, contraste e nenhum commit.
- Nenhuma string inventada: nada de números, datas, nomes de loja, depoimentos ou logos de clientes. Os textos são os da spec.
- O `realce` só aparece sobre o petróleo. Nas seções claras, os títulos são `gray-900`.
- Não mexa nas mudanças de ambiente do Guilherme. A lista está no plano de 25/11.
- O servidor de desenvolvimento roda na porta 3100 (`npx next dev -p 3100`), porque a 3000 é de outro projeto. Pare o servidor no fim.

## Foco da revisão

1. **Atalho da barra que esconde o título da seção atrás da barra fixa.** Resolve com `scroll-padding-top` no `html`. A conferência fica na Tarefa 6, no navegador.
2. **Barra de vidro passando sobre o fundo claro.** O texto branco precisa de 4,5:1. O teste fica na Tarefa 1 e lê a opacidade da própria classe do componente.
3. **Acordeão pelo teclado.** O Tab chega a cada pergunta, o Enter abre e o foco aparece. A conferência fica na Tarefa 6.
4. **Quem pede menos movimento, ou usa navegador sem `animation-timeline`.** As seções aparecem paradas e visíveis, nunca com opacidade 0. A conferência fica na Tarefa 6, com `prefers-reduced-motion: reduce` emulado.
5. **Celular de 320 px.** A barra cabe com o logo e o "Entrar", e a prévia não cria rolagem lateral. A conferência fica na Tarefa 6.

---

### Task 1 — Tarefa 1: Barra do portal e CSS de rolagem

**Arquivos:**

- Criar: `src/components/entrada/BarraDoPortal.tsx` e `src/components/entrada/BarraDoPortal.test.tsx`.
- Modificar: `src/components/ui/Button.tsx`, que passa a exportar o `IconeNoCirculo` e a usá-lo, e `src/app/globals.css`.

**Interfaces:**

- Produz:
  - `BarraDoPortal({ atalhos?: { href: string; rotulo: string }[]; acao?: ReactNode })`.
    - É um `<header>` fixo (`fixed inset-x-0 top-3 z-40 px-3`) com a pílula de vidro: `rounded-full border border-white/12 bg-petroleo-900/75 backdrop-blur-xl text-white` e a classe `superficie-escura`.
    - Mostra o logo na placa branca e "Portal PDV".
    - Com `atalhos`, mostra um `<nav aria-label="Seções">` só a partir de `lg`, com os links em `text-apoio font-semibold text-white/72 hover:text-white` e 44 px de altura.
    - A `acao` fica à direita.
  - `IconeNoCirculo({ icone: LucideIcon })`: o círculo escuro com o ícone que o `Button` já desenha no `iconeFinal`, para links com cara de botão.
  - No `globals.css`:
    - `html { scroll-behavior: smooth; scroll-padding-top: 6rem; }`;
    - as classes `revelar`, `subir-ao-rolar` e `desenhar-ao-rolar`. Sem suporte, elas não mudam nada;
    - `linha-do-tempo` (`view-timeline: --passos block`), para a linha do "Como funciona";
    - as animações, só dentro de `@media (prefers-reduced-motion: no-preference)` e `@supports (animation-timeline: view())`:
      - `revelar`: opacidade 0 e 24 px abaixo, até o normal, em `entry 0% entry 60%`;
      - `subir`: 64 px abaixo, `scale(0.96)` e opacidade 0,4, até o normal, em `entry 0% cover 35%`;
      - `desenhar`: `stroke-dashoffset` de 1 a 0, com `animation-timeline: --passos` em `entry 20% cover 60%`.
    - `.desenhar-ao-rolar` tem `stroke-dasharray: 1` e `stroke-dashoffset: 0` fora da animação.

- [ ] **Passo 1: testes em `BarraDoPortal.test.tsx`.**
  - Com `atalhos=[{ href: "#perguntas", rotulo: "Perguntas" }]`, o HTML tem `<nav aria-label="Seções"` e um link `href="#perguntas"` com "Perguntas".
  - Sem `atalhos`, não há `<nav`.
  - A `acao` aparece no HTML.
  - **Contraste da barra:**
    - o teste extrai `bg-petroleo-900/(\d+)` do HTML;
    - mistura `CORES["petroleo-900"]` com essa opacidade sobre `CORES.white`, com uma função `misturar` no próprio teste;
    - exige que `contraste(CORES.white, mistura)` seja pelo menos 4,5. É o pior caso: a barra passando sobre o fundo branco.
- [ ] **Passo 2:** rode `npx vitest run src/components/entrada/BarraDoPortal.test.tsx`. Ele falha, porque o componente não existe.
- [ ] **Passo 3:** implemente a barra, o `IconeNoCirculo` (o `Button` passa a usá-lo, sem mudar o visual) e o CSS.
- [ ] **Passo 4:** os testes da barra e os do `Button` passam, e `npm run lint` também.

### Task 2 — Tarefa 2: Hero escuro e decoração compartilhada

**Arquivos:**

- Criar: `src/components/entrada/DecoracaoDoPainel.tsx`, que é a `Decoracao` saída da moldura, agora exportada.
- Modificar: `src/components/entrada/MolduraDeEntrada.tsx` e `src/components/entrada/Telas.tsx`. A `TelaDaEquipe` passa a montar `<BarraDoPortal />` e um `<main>` com a moldura.
- Teste: `src/components/entrada/MolduraDeEntrada.test.tsx`.

**Interfaces:**

- Consome: `BarraDoPortal` (Tarefa 1).
- Produz:
  - `DecoracaoDoPainel()`: os arcos, os brilhos e a grade, como hoje. Precisa de um pai com `relative isolate overflow-hidden`.
  - `MolduraDeEntrada({ rotulo?, titulo, destaque, selos, children, rodape?, altura: "tela" | "pagina", idDoCartao?: string })`:
    - é um bloco `superficie-escura` em degradê petróleo, na largura toda, com a `DecoracaoDoPainel`;
    - por dentro, `mx-auto max-w-6xl`, com `pt-28` e, a partir de `lg`, `grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] items-center`;
    - à esquerda ficam o rótulo, o título (`<p>` em `font-titulo`, com `text-pagina` e `lg:text-vitrine`) e os selos;
    - à direita, uma `<div id={idDoCartao} className="scroll-mt-28">` com o cartão e o rodapé;
    - `altura="tela"` usa `min-h-dvh` e `pb-12`; `altura="pagina"` usa `pb-44 lg:pb-56`, para a prévia entrar por cima;
    - a moldura não tem mais logo, que agora fica na barra, nem a linha "Setor de PDV";
    - o rodapé do cartão fica sobre o escuro: o texto em `text-white/72` e o link em `text-primary` com sublinhado `decoration-primary/40`. O `estiloDoLink` do `Telas.tsx` muda junto.

- [ ] **Passo 1: testes em `MolduraDeEntrada.test.tsx`.**
  - Com `idDoCartao="entrar"`, o HTML tem `id="entrar"` e o `children`.
  - O título e o destaque aparecem, com o destaque em `text-realce`.
  - O rodapé aparece.
  - O HTML não tem `<header` nem `Setor de PDV`: a moldura não é mais a barra.
- [ ] **Passo 2:** rode o teste. Ele falha, porque a moldura atual tem `<header>` e não aceita `idDoCartao`.
- [ ] **Passo 3:** implemente a moldura e a decoração, e ajuste a `TelaDaEquipe` e o link do rodapé.
- [ ] **Passo 4:** os testes passam, e `npm run typecheck` e `npm run lint` também.

### Task 3 — Tarefa 3: Prévia da tela da loja e "O que você encontra"

**Arquivos:**

- Criar: `src/components/entrada/PreviaDaLoja.tsx`, `src/components/entrada/SecaoOQueTem.tsx` e o teste `src/components/entrada/Secoes.test.tsx`.

**Interfaces:**

- Consome: `Logo`, `ArquivoIcon` e `IconeNoCirculo`, quando precisar.
- Produz:
  - **`PreviaDaLoja()`**: uma `<figure>` com `subir-ao-rolar`, `relative z-10 -mt-36 lg:-mt-44` e `px-4`.
    - Dentro, uma moldura com `role="img"` e `aria-label="Prévia da tela da loja, com o botão de enviar fotos e vídeos, os relatórios, o estudo de mercado e as fotos de antes e depois."`.
    - No celular, a moldura é de telefone: `max-w-[22rem]`, `rounded-[2.25rem]` e `border-8 border-gray-950`. A partir de `sm`, é de navegador: `max-w-5xl`, `rounded-2xl` e `border border-gray-200`. As duas têm `shadow-flutuante` e fundo `gray-50`.
    - O conteúdo:
      - a barra com o logo, "Portal PDV", "Sua loja" com `ChevronDown` e "Sair";
      - a pílula "Enviar fotos e vídeos" com `Upload`;
      - o bloco "Relatórios", com a linha PDF "Relatório da assessoria" e uma barra cinza;
      - o bloco "Estudo de mercado", com as linhas PDF "Estudo BRICK" e planilha "Planilha de produtos";
      - "Fotos e vídeos: antes", com 4 blocos, e "Fotos e vídeos: depois", com 3. Os blocos são quadrados em degradê `primary-light` → `gray-200`, com o ícone `Image`; um deles tem o `Play`.
    - No celular, só o primeiro bloco de fotos aparece (`hidden sm:block` nos outros).
    - Nenhum número, data ou nome de loja.
  - **`SecaoOQueTem()`**: uma `<section id="o-que-tem" aria-labelledby="o-que-tem-titulo">`.
    - O `h2` é "O que você encontra no portal", em `font-titulo text-secao lg:text-pagina` e `gray-900`, centralizado.
    - São três cartões (`rounded-2xl border border-gray-200 bg-white p-6`, com `revelar`), cada um com uma ilustração `aria-hidden` numa área `rounded-xl bg-gray-100 h-44`, um `h3` em `text-destaque` e um `p` em `text-gray-600`. Os títulos e os textos são os da spec.
    - As ilustrações:
      - Relatórios: duas linhas de arquivo empilhadas, a de trás inclinada 3°;
      - Estudo: as linhas PDF e planilha;
      - Fotos: uma grade 3×2 de blocos e a pílula "Enviar fotos e vídeos".

- [ ] **Passo 1: testes em `Secoes.test.tsx`.**
  - **Prévia:**
    - o HTML tem `role="img"` e o `aria-label` exato;
    - não tem data (`/\d{2}\/\d{2}/`) nem número de três algarismos ou mais (`/\d{3,}/`);
    - tem "Relatórios", "Estudo de mercado" e "Fotos e vídeos: antes".
  - **O que tem:**
    - o HTML tem `id="o-que-tem"` e três `<h3`, com os três títulos da spec;
    - o `h2` está ligado pelo `aria-labelledby`.
- [ ] **Passo 2:** rode o teste. Ele falha, porque os componentes não existem.
- [ ] **Passo 3:** implemente.
- [ ] **Passo 4:** os testes passam.

### Task 4 — Tarefa 4: "Como funciona" e perguntas frequentes

**Arquivos:**

- Criar: `src/lib/perguntas.ts`, `src/components/entrada/SecaoComoFunciona.tsx` e `src/components/entrada/PerguntasFrequentes.tsx`.
- Testes: acrescente ao `src/components/entrada/Secoes.test.tsx`.

**Interfaces:**

- Consome: `DecoracaoDoPainel` (Tarefa 2) e as classes `linha-do-tempo` e `desenhar-ao-rolar` (Tarefa 1).
- Produz:
  - **`PERGUNTAS: readonly { pergunta: string; resposta: string }[]`**: as 7 perguntas da tabela da spec, com o texto exato.
  - **`SecaoComoFunciona()`**: uma `<section id="como-funciona" aria-labelledby="como-funciona-titulo">`, `superficie-escura` e em petróleo, com a `DecoracaoDoPainel`.
    - Em cima, o selo "Como funciona" e o `h2` "Da visita da equipe **até a sua tela.**", com o destaque em `realce`.
    - Embaixo, um `<div className="linha-do-tempo relative">` com:
      - um `<svg aria-hidden="true">` só a partir de `lg`, com uma reta horizontal no centro dos ícones (`<path pathLength="1" className="desenhar-ao-rolar" stroke="currentColor">`, em `text-primary/60`);
      - um `<svg>` vertical só no celular, à esquerda dos ícones, com a mesma classe;
      - um `<ol>` com os 4 passos da spec. Cada `li` tem o ícone Lucide num círculo (`size-14 rounded-full bg-petroleo-800 ring-1 ring-white/12`, com o ícone em `text-primary`), o `h3` em `text-destaque`, em branco, e o `p` em `text-white/72`.
      - Os ícones, em ordem: `Store`, `Mail`, `KeyRound` e `Images`.
  - **`PerguntasFrequentes()`**: uma `<section id="perguntas" aria-labelledby="perguntas-titulo">`, com o `h2` "Perguntas frequentes", centralizado.
    - Cada pergunta é um `<details className="group">`.
    - O `<summary>` tem `list-none` e `[&::-webkit-details-marker]:hidden`, 56 px de altura e texto `destaque` 600, com um `Plus` em `primary-strong` que gira 45° em `group-open:`.
    - A resposta é um `p` em `text-corpo text-gray-600 max-w-[72ch]`.
    - A lista fica entre bordas `gray-200`.

- [ ] **Passo 1: testes.**
  - **Perguntas:**
    - `PERGUNTAS` tem 7 itens;
    - alguma resposta contém "10 minutos" e alguma contém "30 dias";
    - o HTML da seção tem 7 `<details` e 7 `<summary`, e o texto de cada pergunta;
    - tem `id="perguntas"`.
  - **Como funciona:**
    - o HTML tem `id="como-funciona"`, um `<ol` com 4 `<li`, os 4 títulos dos passos e `pathLength="1"` com a classe `desenhar-ao-rolar`;
    - o destaque está em `text-realce`.
- [ ] **Passo 2:** rode o teste. Ele falha.
- [ ] **Passo 3:** implemente.
- [ ] **Passo 4:** os testes passam.

### Task 5 — Tarefa 5: Chamada final, rodapé e a página montada

**Arquivos:**

- Criar: `src/components/entrada/ChamadaFinal.tsx` e `src/components/entrada/RodapeDoPortal.tsx`.
- Modificar: `src/components/entrada/Telas.tsx`, para a `TelaDoAssociado` montar a página inteira.
- Teste: `src/components/entrada/Telas.test.tsx`.

**Interfaces:**

- Consome: tudo das Tarefas 1 a 4, mais `buttonStyles` e `IconeNoCirculo`.
- Produz:
  - **`ChamadaFinal()`**: uma `<section aria-labelledby="chamada-titulo">` com um cartão escuro `rounded-2xl`, com `revelar` e a `DecoracaoDoPainel`.
    - O `h2` é "Pronto para ver o material da **sua loja?**", com o destaque em `realce`.
    - O link `<a href="#entrar">` usa `buttonStyles({ size: "lg", className: "pr-2" })`, com "Entrar no portal" e `IconeNoCirculo` de `ArrowRight`.
  - **`RodapeDoPortal()`**: um `<footer>` `superficie-escura` em `bg-petroleo-950`.
    - Mostra o logo na placa, "Portal PDV" e "Farmácias Associadas".
    - Tem a linha "É da equipe de PDV? Entre com a conta Microsoft", com o link para `/admin/entrar` em `text-primary`.
    - Tem a linha "Setor de PDV · Farmácias Associadas" acima de uma borda `white/12`.
    - Tem a `DecoracaoDoPainel` ao fundo. (A marca d'água "Portal PDV" da primeira versão saiu a pedido do Guilherme, em 26/11.)
  - **`TelaDoAssociado({ children })`**, que monta:
    - `<BarraDoPortal>` com os atalhos `#o-que-tem` "O que tem no portal", `#como-funciona` "Como funciona" e `#perguntas` "Perguntas", e com `acao` `<a href="#entrar">` em `buttonStyles({ size: "sm" })`, escrito "Entrar";
    - o `<main>`, com a `MolduraDeEntrada altura="pagina" idDoCartao="entrar">` (os textos de hoje), a `PreviaDaLoja`, a `SecaoOQueTem`, a `SecaoComoFunciona`, as `PerguntasFrequentes` e a `ChamadaFinal`;
    - o `<RodapeDoPortal>`.

- [ ] **Passo 1: testes em `Telas.test.tsx`.**
  - **`TelaDoAssociado`** (com um `<p>cartão</p>` de filho):
    - cada `href="#…"` do HTML tem um `id="…"` correspondente na mesma página. Extraia os dois conjuntos e compare;
    - há um `<header`, um `<main` e um `<footer`;
    - há exatamente um `id="entrar"`.
  - **`TelaDaEquipe`:** não tem `<nav`, `<footer` nem `id="perguntas"`.
- [ ] **Passo 2:** rode o teste. Ele falha.
- [ ] **Passo 3:** implemente.
- [ ] **Passo 4:** toda a suíte passa (`npx vitest run`), e `npm run typecheck` e `npm run lint` também.

### Task 6 — Tarefa 6: Guias e conferência final

**Arquivos:**

- Criar: `docs/design-system/componentes/{BarraDoPortal,PreviaDaLoja,SecoesDaPagina}.md`. O `SecoesDaPagina` cobre "O que tem", "Como funciona", as perguntas, a chamada e o rodapé.
- Modificar:
  - `docs/design-system/README.md`: o "Movimento" ganha a rolagem; a "Profundidade" ganha a barra de vidro e os 75%; os links;
  - `docs/design-system/componentes/{MolduraDeEntrada,Telas}.md`;
  - `README.md`, se mudar o que se vê em `/entrar`.

- [ ] **Passo 1:** escreva e atualize os guias.
- [ ] **Passo 2:** rode o Prettier nos arquivos mudados e os quatro gates. Rode também o validador de tokens em `src/components` e `src/app`.
- [ ] **Passo 3: confira no Chrome sem janela,** com o script do scratchpad e o servidor na porta 3100.
  - Abra `/entrar`, `/admin/entrar` e `/previa/codigo` em 1440, 1024, 768, 390 e 320 px. Não pode haver rolagem lateral nem erro no console.
  - Clique em cada atalho da barra: o `h2` da seção fica abaixo da barra (topo do `h2` maior que a base da barra).
  - Pelo teclado: o Tab chega ao primeiro `summary`, o Enter abre (`details.open === true`) e o foco aparece.
  - Com `prefers-reduced-motion: reduce` emulado, uma seção com `revelar` tem opacidade 1 logo ao entrar na tela.
  - Tire fotos da página inteira e olhe cada uma.
- [ ] **Passo 4:** pare o servidor da porta 3100.
