# Design system e telas de entrada do Portal PDV

**Data:** 25/11/2026 · **Branch:** `feat/design-system` · **Pedido de:** Guilherme

## Por que

O Portal PDV é a primeira tela da assessoria de PDV que o associado vai ver. O Guilherme quer que ela fique **muito atrativa**, com a linguagem visual do [clinia.io](https://clinia.io/), sem perder a marca da Farmácias Associadas.

O design system exportado do claude.ai (pasta `portal-pdv-design-system`) veio do FarmaDesk. Ele é a base, mas tem erros e partes que não são do portal.

Este trabalho faz duas coisas:

1. Traz o design system para dentro do repositório, corrigido e adaptado ao portal.
2. Monta as telas de entrada do associado e da equipe, só a parte visual. Os cards #10 e #6 ligam a lógica depois.

## Objetivos

- Tokens, componentes e guias do design system no repositório, como fonte única.
- Tela de entrada do associado (CNPJ e código) e da equipe (conta Microsoft), com todos os estados.
- Uma prévia, só no ambiente de desenvolvimento, com todas as telas, os estados e os componentes.

## Fora do escopo

- O login de verdade: gerar e conferir o código, enviar o e-mail, criar a sessão, entrar com a Microsoft (cards #9, #10 e #6).
- As telas internas: lojas, arquivos, envio de fotos, admin.
- Mudar a pasta de Downloads.
- Modo escuro. A superfície escura é um estilo de painel, não um tema.

## Seria um fracasso, mesmo funcionando

- Copiar o clinia: logo, textos, fotos ou a marca deles. Ele é referência de linguagem visual.
- Ficar bonito e perder a leitura: contraste abaixo de 4,5:1, alvo de toque menor que 44 px, foco invisível ou texto menor que 14 px.
- Um botão que finge entrar. Enquanto o #10 e o #6 não chegam, o botão diz que o acesso ainda não foi liberado.

## Restrições

- Regras do [AGENTS.md](../../../AGENTS.md): tokens em vez de hex, `lucide-react`, sem emoji, só `button` e `a` clicáveis, pt-BR, teste antes do código e os quatro gates.
- Next 16.4.6, React 19.2 e Tailwind 4.3, sem shadcn/ui.
- **CNPJ com letras.** Desde o fim de julho de 2026, a Receita emite CNPJ alfanumérico: 12 caracteres de letras e números, mais 2 dígitos verificadores. O campo aceita letras, e a validação segue o cálculo novo: o valor de cada caractere é o código ASCII menos 48, com módulo 11. Exemplo oficial: `12.ABC.345/01DE-35`.
- **Zoom no iPhone.** Campo com texto menor que 16 px faz o Safari dar zoom ao tocar. Os campos usam 16 px.
- `prefers-reduced-motion` desliga as animações.

## Caminhos considerados

1. **Só as telas, no design system (escolhido).** Telas e estados prontos; os botões avisam que o acesso ainda não foi liberado. Fecha o pedido de design sem decidir a segurança do login.
2. **Telas e login do associado funcionando localmente**, com o código no terminal e os dados em memória. Adiantaria o #10, mas misturaria regras de segurança com o trabalho visual.
3. **Tudo funcionando.** Bloqueado pelo app do Entra (#3).

Dentro do caminho 1, os componentes continuam os do design system (Tailwind puro), e o que muda é a linguagem visual. Trocar por uma biblioteca pronta, como o shadcn/ui, foi descartado: o projeto já usa Tailwind puro, e os componentes já trazem as regras de acessibilidade.

## O que fica do design system

- **A marca:** teal `#00b6ad`, laranja `#f97316`, o logo e o papel de cada cor. `primary` é só preenchimento; `primary-strong` é texto e foco; o laranja puro nunca é texto sobre fundo claro.
- **Atkinson Hyperlegible Next** para texto, campos e números. Ela diferencia `0` de `O` e `1` de `l`, o que importa no CNPJ e no código.
- **As regras de conteúdo:** pt-BR, "você", caixa normal, botões com verbo, e erro no molde "o que aconteceu + o que fazer".
- **Acessibilidade:** foco de 2 px afastado 2 px, alvo de 44 px, status com ícone e texto, `role="alert"` nos erros.
- **Os componentes e as props deles.**

## O que muda: a linguagem do clinia

| Tema            | Antes (FarmaDesk)                        | Agora (Portal PDV)                                                                                                                               |
| --------------- | ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| Superfícies     | Tudo claro e discreto                    | Painéis **petróleo** escuros, tirados do teal da marca, com arcos e brilhos suaves ao fundo                                                      |
| Títulos         | Atkinson 700                             | **Barlow 600**, com letras mais juntas (−0,02 em) e a palavra de destaque em **pêssego** (`realce`) sobre o petróleo                             |
| Botões          | Raio de 8 px                             | **Pílula**. O botão principal pode levar a seta num círculo, no fim                                                                              |
| Campos          | 15 px, raio de 8 px                      | **16 px**, raio de 12 px e 48 px de altura                                                                                                       |
| Cartões         | Sem sombra                               | Raio de 20 px e **sombra suave tingida de petróleo** no que flutua                                                                               |
| Movimento       | Quase nenhum                             | Os blocos entram subindo e aparecendo; o botão sobe 1 px no hover. Tudo desligado com `prefers-reduced-motion`                                   |
| Escala de texto | 13 / 15 / 17 / 20 / 26 px, `senha` 32 px | `apoio` 14, `corpo` 16, `destaque` 18, `secao` 24, `pagina` 32, `vitrine` 44 px (título da moldura; no celular ele usa `pagina`) e `senha` 32 px |

A caixa alta continua fora. O clinia a usa nos botões, mas aqui vale a regra do design system, por legibilidade.

### Cores novas

| Token                   | Valor                | Uso                                                | Contraste                         |
| ----------------------- | -------------------- | -------------------------------------------------- | --------------------------------- |
| `petroleo-950`          | `#0a2427`            | Fundo mais fundo do painel                         | —                                 |
| `petroleo-900`          | `#0f3034`            | Fundo do painel e `themeColor` do navegador        | branco 14,1:1; branco a 72% 8,0:1 |
| `petroleo-800`          | `#163f44`            | Selos e superfícies sobre o painel                 | branco a 72% 6,8:1                |
| `petroleo-700`          | `#21535a`            | Botão escuro (texto branco)                        | branco 8,6:1                      |
| `realce`                | `#fdba74`            | Palavra de destaque no título, só sobre o petróleo | 8,3:1 sobre `petroleo-900`        |
| `avatar-1` a `avatar-4` | (os pares do Avatar) | Iniciais no Avatar, cada um com o seu `-bg`        | 5,0:1 a 6,4:1                     |

Sobre o petróleo, o teal da marca `primary` passa como texto e anel de foco (5,6:1).

## Correções no design system exportado

- **O guia de instalação quebrava o projeto.** Ele mandava copiar `app/` para a raiz, e com as duas pastas o Next ignora `src/app`. Os componentes vão para `src/components/ui`, com imports `@/components/ui/...`.
- **O guia rebaixava o lucide** para a versão 1.41.0. Fica a do projeto.
- **A pasta interna duplicada** não entra.
- **Código do FarmaDesk sai:** `solicitacao-constants.ts`, os status de chamado e de compra, `EquipamentoIcon` e `UrgenciaBadge`. `StatusBadge` e `Stepper` passam a receber o grupo e as etapas por props. `EquipamentoIcon` vira `ArquivoIcon` (PDF, planilha, foto, vídeo e outro).
- **`Table`:** células em `corpo` e cabeçalho em `apoio`, em `gray-600`. O código usava 14 e 12 px. O guia dizia que o `gray-500` reprovava sobre o `gray-50`, mas ele passa (4,63:1).
- **`Avatar`:** as cores viram tokens, e o texto mínimo passa a ser `apoio`. O código usava hex direto e texto de 10 px.
- **`Avisos`:** sai a folga de 64 px no celular, que era da barra inferior do FarmaDesk.
- **`globals.css`:** o fundo da página passa a `gray-50`, como o guia já dizia (o código usava branco), e o texto passa a `gray-900` (o código usava outro azul-escuro). A paleta e os tamanhos de texto padrão do Tailwind são zerados, para só existirem os tokens do design system.
- **`tokens.json` e `tokens.css` não entram:** eles repetiam o `globals.css`. A fonte única passa a ser `src/lib/cores.ts` mais o `globals.css`, conferidos por teste.
- **Tokens sem uso no portal saem:** `tarja-*` e `grafico`.
- **Os textos e os exemplos dos guias** passam do FarmaDesk ("Abrir chamado") para o portal ("Enviar código", "Enviar fotos").

## As telas

### Moldura comum

- **Computador (a partir de 1024 px):** duas colunas. À esquerda fica o painel petróleo, com o logo numa placa branca redonda, o nome "Portal PDV", o título em Barlow com a palavra de destaque em pêssego, três selos com visto e, no pé, "Setor de PDV · Farmácias Associadas". À direita fica o fundo claro, com o cartão do formulário.
- **Celular:** o painel vira uma faixa no topo, com o logo, o nome e um título curto. O cartão do formulário sobe por cima da borda da faixa.

```
Computador
┌──────────────────────────────┬──────────────────────────────┐
│ petróleo, arcos e brilho      │ fundo claro                  │
│ (logo) Portal PDV             │  ┌────────────────────────┐  │
│                               │  │ Entrar no portal       │  │
│ Tudo da assessoria da sua     │  │ CNPJ da loja           │  │
│ loja, num lugar só.           │  │ [                    ] │  │
│        └── em pêssego         │  │ Com ou sem pontuação.  │  │
│ (v) Relatórios da assessoria  │  │ [ Enviar código   (>) ]│  │
│ (v) Estudos de mercado        │  └────────────────────────┘  │
│ (v) Fotos de antes e depois   │  É da equipe de PDV?         │
│ Setor de PDV · Farmácias Ass. │  Entre com a conta Microsoft │
└──────────────────────────────┴──────────────────────────────┘

Celular
┌────────────────────────┐
│ (logo) Portal PDV      │  petróleo
│ Tudo da sua loja,      │
│ num lugar só.          │
│ ┌────────────────────┐ │
└─┤ Entrar no portal   ├─┘
  │ CNPJ da loja       │
  │ [                ] │
  │ [ Enviar código  ] │
  └────────────────────┘
  É da equipe de PDV? Entre aqui
```

### Entrada do associado: `/entrar`

**Passo 1, CNPJ.**

- Título "Entrar no portal" e o texto "Digite o CNPJ de uma das suas lojas. Vamos mandar um código para o e-mail cadastrado."
- Campo "CNPJ da loja", com a dica "Com ou sem pontuação." No celular, o teclado abre com letras maiúsculas, por causa do CNPJ com letras.
- Botão "Enviar código". A ação no servidor valida o CNPJ e mantém o que foi digitado.
- Estados:
  - **CNPJ incompleto:** "O CNPJ tem 14 caracteres. Confira e digite de novo."
  - **Dígito verificador errado:** "Este CNPJ não confere. Confira os números e digite de novo."
  - **Enviando:** "Enviando código…"
  - **CNPJ válido:** aviso de atenção "O acesso pelo portal ainda não foi liberado. Por enquanto, a equipe de PDV continua mandando os relatórios por e-mail." Vale até o #10.

**Passo 2, código.** O componente fica pronto, mas a rota só nasce no #10.

- "Trocar CNPJ" no topo, título "Digite o código" e o texto "Mandamos um código de 6 números para jo\*\*\*@gmail.com. Ele vale por 10 minutos."
- Seis casas com algarismos grandes, no estilo `senha`. Por trás há um campo só: colar funciona, e o celular sugere o código que chegou (`autocomplete="one-time-code"`).
- Botão "Entrar". Embaixo, "Não chegou? Você pode pedir outro em 0:45" e, quando o tempo acaba, o botão "Reenviar código".
- Estados:
  - **Código errado:** "Código errado. Você ainda tem 4 tentativas."
  - **Código vencido:** "Este código venceu. Peça um novo."
  - **Bloqueado depois de 5 erros:** "Você errou o código 5 vezes. Peça um novo código."
  - **Reenviado:** aviso de sucesso "Enviamos um novo código para jo\*\*\*@gmail.com."
- O e-mail chega mascarado do servidor. O componente nunca recebe o e-mail inteiro.

**No pé:** "É da equipe de PDV? Entre com a conta Microsoft", com link para `/admin/entrar`. A palavra "admin" não aparece na tela.

### Entrada da equipe: `/admin/entrar`

- **Painel:** "Área da equipe de PDV", o título "Publique o material e acompanhe cada loja", com "cada loja" em pêssego, e os selos "Associados e lojas", "Avisos de material novo" e "Fotos enviadas pelos associados".
- **Cartão:** título "Entrar como equipe", o texto "Use a sua conta @farmaciasassociadas.com.br.", o botão "Entrar com a Microsoft" (o texto oficial do botão da Microsoft em português) com o logo da Microsoft (arquivo em `public/`, como pedem as regras de marca dela) e o link "É associado? Entre com o CNPJ".
- Estados:
  - **Abrindo:** "Abrindo a Microsoft…"
  - **Acesso não liberado:** "Sua conta ainda não tem acesso ao portal. Peça a liberação a quem administra o portal."
  - **Conta de fora do domínio:** "Use a sua conta @farmaciasassociadas.com.br. Contas pessoais não entram."
  - **Por enquanto:** o botão responde "A entrada da equipe ainda não foi ligada."

### Página inicial: `/`

Redireciona para `/entrar`. Quando o #10 criar a sessão, `/` passa a ser a tela da loja.

### Prévia: `/previa`

Só existe no ambiente de desenvolvimento (`env.NODE_ENV === "development"`); fora dele, responde 404.

- `/previa`: índice com todas as telas, os estados e o catálogo de componentes.
- `/previa/[tela]`: a tela inteira num estado, por exemplo `/previa/codigo-errado`.
- `/previa/componentes`: todos os componentes e as variantes.

## Componentes

Em `src/components/ui`, vindos do design system e corrigidos: `Button`, `Card`, `Badge`, `Input`, `Select`, `Textarea`, `Field`, `Aviso`, `Avisos`, `EmptyState`, `PageHeader`, `SectionTitle`, `DialogoConfirmacao`, `Table`, `Avatar`, `LinkPendingHint`, `VoltarLink`, `StatusBadge`, `Stepper` e `ArquivoIcon`.

Novos: `Logo` (com a cruz de reserva quando a imagem falha), `CampoCodigo`, `ContagemRegressiva`, `SeloComVisto` e a moldura das telas de entrada.

## Testes

- **`cores.test.ts`:** cada token do `globals.css` está em `CORES`, e o contrário também. Cada par de texto e fundo documentado tem pelo menos 4,5:1, e cada borda, ícone ou foco, pelo menos 3:1. Continuam os testes que mostram por que o teal e o laranja puros não são texto sobre branco.
- **`cnpj.test.ts`:** limpa a pontuação, aceita minúsculas, valida os dígitos (CNPJ só de números e com letras, como `12.ABC.345/01DE-35`), recusa sequência repetida e tamanho errado, e formata.
- **Componentes, com `react-dom/server` e sem dependência nova:**
  - `Field` liga o rótulo, a dica e o erro.
  - `Button` com `pending` fica desabilitado e marca `aria-busy`.
  - `Aviso` usa o `role` certo.
  - `CampoCodigo` tem `inputMode="numeric"`, `autoComplete="one-time-code"` e seis casas.
  - `StatusBadge` mostra o texto e o ícone.
  - `Stepper` marca a etapa atual.
- Os quatro gates e a revisão no navegador, no computador e no celular (390 px).

## Documentação

- **`docs/design-system/README.md`:** o guia. É o antigo `DESIGN.md`, reescrito para o portal e com a linguagem do clinia.
- **`docs/design-system/componentes/*.md`:** um guia por componente.
- **AGENTS.md:** a regra de cores aponta para o guia, e entra uma seção "Interface".
- **README:** links para o guia e para a `/previa`.

## Decisões de quem escreveu este desenho

- O pêssego (`#fdba74`) destaca a palavra no título, no lugar do teal, porque ecoa a cruz laranja do logo.
- A Barlow fica só nos títulos; a Atkinson fica no resto.
- O formulário fica no fundo claro, não no painel escuro. Assim os campos mantêm o contraste do design system, e a leitura fica fácil para quem enxerga pouco.
- O campo de CNPJ abre o teclado de letras no celular, por causa do CNPJ alfanumérico.
- A branch saiu da `feat/1-configurar-projeto`, porque a `main` ainda não tem o app. As mudanças de ambiente que não estavam commitadas vieram junto e continuam intocadas.
- Nada é commitado até o Guilherme pedir.

## Fica com quem constrói

- Os valores finos de espaçamento, o tamanho dos arcos e dos brilhos, e a duração das animações (entre 150 e 600 ms).
- Os nomes finais dos arquivos e a organização das pastas dentro de `src/components`.
