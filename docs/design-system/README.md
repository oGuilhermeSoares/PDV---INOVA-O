# Design system do Portal PDV

Este é o guia visual e de conteúdo do Portal PDV, e vale para toda tela nova. Os tokens ficam em [`src/lib/cores.ts`](../../src/lib/cores.ts) e no [`src/app/globals.css`](../../src/app/globals.css), e os componentes, em [`src/components`](../../src/components).

Para ver tudo funcionando, rode `npm run dev` e abra `/previa`. A prévia mostra cada tela em cada estado e o catálogo de componentes, e só existe no ambiente de desenvolvimento.

## Princípios

1. **Primeiro o balcão.** A tela fala a língua de quem usa. O associado vê "Relatórios da assessoria", não o nome da pasta no SharePoint.
2. **O código é a senha.** O código de acesso aparece em algarismos grandes e de largura fixa, fáceis de ler e de ditar ao telefone.
3. **Cor é informação.** Fora do painel da marca, a cor só aparece quando diz alguma coisa, e sempre junto de texto ou de forma.
4. **O que foi digitado não se perde.** O erro diz o que aconteceu e o que fazer, mantém o que a pessoa digitou e leva o foco ao campo.
5. **Cada perfil vê o que precisa.** O associado e a equipe de PDV entram por telas diferentes. A palavra "admin" não aparece para o associado.

## Conteúdo e tom

- Português do Brasil, em frases curtas, falando com a pessoa por "você". Caixa normal em tudo, inclusive nos botões.
- Escreva como a pessoa fala, não como o sistema guarda: "Fotos de antes e depois", não "Fotos antes / Fotos Depois".
- O botão diz o que acontece: "Enviar código", "Enviar fotos", "Avisar associado". Durante o envio, o gerúndio ("Enviando código…"); depois, o aviso com o mesmo verbo ("12 fotos enviadas").
- O erro segue o molde "o que aconteceu + o que fazer": "O CNPJ tem 14 caracteres. Confira e digite de novo."
- A confirmação de uma ação destrutiva usa verbos: "Excluir arquivo" e "Manter arquivo". Nunca "OK" e "Cancelar".
- Datas em `dd/mm/aaaa` e `dd/mm/aaaa HH:mm`.
- Sem emoji, nem como ícone. Setas e sinais vêm de ícones, não de caracteres digitados.
- Parágrafos com no máximo 72 caracteres por linha (`max-w-[72ch]`).

## Cores

A marca é o teal `primary` (`#00b6ad`) com o laranja da cruz `accent` (`#f97316`). Os painéis escuros usam o petróleo, um teal bem fechado. A paleta padrão do Tailwind está desligada: só existem as cores abaixo. Uma classe fora delas, como `bg-blue-500`, não gera estilo nenhum.

### Regras

- **O teal tem dois papéis.** `primary` é só preenchimento: o botão principal, com o texto em `gray-950` (7,95:1), a etapa atual e a seleção. Sobre branco ele tem 2,53:1, então nunca é texto nem anel de foco no claro. O texto teal é `primary-strong` (5,96:1): links, ícones de arquivo e o anel de foco.
- **O laranja nunca é texto sobre fundo claro** (2,80:1 sobre branco). Ele fica no logo e no selo "Novo". O texto laranja é `accent-strong`.
- **Tinta e balcão.** O texto principal é `gray-900`; o texto de apoio, `gray-600`, o cinza mínimo para texto. O `gray-500` só vale sobre branco ou `gray-50`, e o `gray-400` não é texto (2,60:1). O fundo da página é `gray-50`, e as superfícies são brancas.
- **Bordas.** O campo usa `gray-500` (4,84:1); a borda decorativa, `gray-200`; o botão secundário, `gray-300`.
- **Painel da marca.** O fundo é `petroleo-900`, em degradê até `petroleo-950`. O texto é branco (14,07:1), o texto de apoio é branco a 72% (8,00:1), e a palavra de destaque do título é `realce` (8,34:1). Nele, o anel de foco é `primary` (5,56:1).
- **Status.** O texto vai sobre o fundo de mesmo nome, e cada grupo tem uma forma (veja [StatusBadge](componentes/StatusBadge.md)).
- Toda cor nova entra em `cores.ts` e no `globals.css`, com o par de contraste no teste `src/lib/cores.test.ts`.

### Tokens

| Token                                         | Valor                           | Papel                                                    | Contraste                      |
| --------------------------------------------- | ------------------------------- | -------------------------------------------------------- | ------------------------------ |
| `primary`                                     | `#00b6ad`                       | Preenchimento da marca: botão principal, etapa atual     | `gray-950` sobre ele: 7,95:1   |
| `primary-dark`                                | `#009991`                       | Hover do botão principal                                 | `gray-950` sobre ele: 5,72:1   |
| `primary-light`                               | `#e0faf9`                       | Fundo teal claro: hover do secundário, caixa de ícone    | `primary-strong`: 5,45:1       |
| `primary-strong`                              | `#00706a`                       | Teal de leitura: links, ícones, foco no claro            | 5,96:1 sobre branco            |
| `accent`                                      | `#f97316`                       | Laranja da cruz: logo, reserva do logo, brilho do painel | Não é texto (2,80:1)           |
| `accent-light`                                | `#fff7ed`                       | Fundo do selo "Novo"                                     | `accent-strong`: 5,70:1        |
| `accent-strong`                               | `#a84300`                       | Texto laranja                                            | 6,06:1 sobre branco            |
| `petroleo-950`                                | `#0a2427`                       | Fim do degradê do painel                                 | Branco: 16,22:1                |
| `petroleo-900`                                | `#0f3034`                       | Painel da marca e cor do navegador no celular            | Branco: 14,07:1                |
| `petroleo-800`                                | `#163f44`                       | Superfície sobre o painel e hover do botão escuro        | —                              |
| `petroleo-700`                                | `#21535a`                       | Botão escuro (`variant="escuro"`)                        | Branco: 8,57:1                 |
| `realce`                                      | `#fdba74`                       | Palavra de destaque do título, só sobre o petróleo       | 8,34:1 sobre `petroleo-900`    |
| `gray-950`                                    | `#030712`                       | Texto sobre o teal                                       | —                              |
| `gray-900`                                    | `#101828`                       | Texto principal, títulos e rótulos                       | 17,75:1 sobre branco           |
| `gray-700`                                    | `#364153`                       | Botão ghost, aviso info, hover da borda do campo         | 9,86:1 sobre `gray-50`         |
| `gray-600`                                    | `#4a5565`                       | Texto de apoio, dicas, "(opcional)"                      | 7,23:1 sobre `gray-50`         |
| `gray-500`                                    | `#6a7282`                       | Borda do campo e placeholder                             | 4,84:1 sobre branco            |
| `gray-400`                                    | `#99a1af`                       | Só decoração                                             | Não é texto (2,60:1)           |
| `gray-300`, `gray-200`, `gray-100`, `gray-50` | `#d1d5dc` … `#f9fafb`           | Bordas, fundos e o balcão (`gray-50`)                    | —                              |
| `red-700`, `red-800`, `red-50`                | `#c10007`, `#9f0712`, `#fef2f2` | Erro do campo e botões destrutivos                       | `red-700`: 6,42:1 sobre branco |
| `status-aberto` / `-bg`                       | `#8a4a00` / `#fff3e0`           | Aberto e aviso de atenção                                | 6,26:1                         |
| `status-andamento` / `-bg`                    | `#00596b` / `#e3f4f8`           | Em andamento                                             | 7,03:1                         |
| `status-aguardando` / `-bg`                   | `#5b3fa0` / `#f0ebfa`           | Aguardando você                                          | 6,75:1                         |
| `status-resolvido` / `-bg`                    | `#1f6b3a` / `#e6f4ea`           | Resolvido e aviso de sucesso                             | 5,74:1                         |
| `status-recusado` / `-bg`                     | `#a3271f` / `#fdecea`           | Recusado e aviso de erro                                 | 6,40:1                         |
| `avatar-1` a `avatar-4` / `-bg`               | (em `cores.ts`)                 | Iniciais do [Avatar](componentes/Avatar.md)              | 4,99:1 a 6,40:1                |

## Tipografia

Duas famílias, as duas do Google Fonts, carregadas no [`layout.tsx`](../../src/app/layout.tsx):

- **Atkinson Hyperlegible Next** (`font-sans`, o padrão) em texto, campos e números. Ela foi desenhada para quem enxerga pouco e diferencia `0` de `O` e `1` de `l`, o que importa no CNPJ e no código. Pesos: 400 no texto, 600 em rótulos e botões, 700 no código.
- **Barlow 600** (`font-titulo`) só nos títulos grandes: `vitrine`, `pagina` e `secao`, com `tracking-tight`.

| Classe          | Tamanho e altura da linha | Uso                                                                        |
| --------------- | ------------------------- | -------------------------------------------------------------------------- |
| `text-vitrine`  | 44 px / 1,08              | Título do painel da marca no computador                                    |
| `text-pagina`   | 32 px / 1,15              | Título da página (`h1`, um por tela) e título do painel no celular         |
| `text-senha`    | 32 px / 1,1               | Algarismos do código, com `tabular-nums`                                   |
| `text-secao`    | 24 px / 1,25              | Título de seção (`h2`)                                                     |
| `text-destaque` | 18 px / 1,4               | Título de cartão, de linha e de estado vazio; texto do botão `lg`          |
| `text-corpo`    | 16 px / 1,5               | Texto, campos e botões. Campo com menos de 16 px faz o iPhone dar zoom     |
| `text-apoio`    | 14 px / 1,45              | Dicas, erros de campo, badges e o botão `sm`. É o menor texto da interface |

Os tamanhos padrão do Tailwind (`text-sm`, `text-xs`…) também estão desligados.

## Forma

- Os botões são pílulas (`rounded-full`), assim como os selos, os badges e os avatares.
- Campos, avisos e a caixa de ícone do estado vazio usam `rounded-xl` (12 px).
- Cartões e diálogos usam `rounded-2xl` (20 px).
- Não ponha caixa arredondada dentro de outra, nem cartão dentro de cartão.

## Profundidade

- Nada tem sombra em repouso.
- `shadow-flutuante` é uma sombra suave, em três camadas, tingida de petróleo. Ela vai só no que flutua: o cartão do formulário (`Card elevado`), o diálogo, o aviso flutuante e o menu "Trocar loja". O botão principal e o escuro também a ganham no hover.
- A superfície escura é o painel da marca. A classe `superficie-escura` troca o anel de foco para `primary`, que aparece sobre o petróleo.
- **Barra de vidro:** a [BarraDoPortal](componentes/BarraDoPortal.md) fica fixa no topo, em pílula, com `petroleo-900` a 75% e desfoque. A opacidade não pode baixar: com menos, o texto branco reprova quando a barra passa sobre uma seção clara (o clinia usa 50%, e o texto dele reprova). O teste da barra confere esse pior caso.

## Foco e toque

- Há um anel de foco só, igual em link, botão e campo: 2 px sólido em `primary-strong`, afastado 2 px. No painel escuro, ele é `primary`. A cor fica definida também fora do foco, para a transição dos botões não fazer o anel nascer na cor do texto.
- Todo clicável tem pelo menos 44 px de altura. Os botões têm 44, 48 e 56 px, e os campos, 48 px.
- O campo com erro troca a borda para `red-700`, e o erro aparece embaixo, com `role="alert"`.

## Movimento

- `animate-entrar`: o bloco sobe 12 px e aparece em 600 ms. Nas telas de entrada, o título, os selos e o cartão entram com 0, 80 e 160 ms de atraso.
- O botão principal e o escuro sobem 1 px no hover, em 150 ms.
- O ponto do [LinkPendingHint](componentes/LinkPendingHint.md) só aparece se a navegação passar de 100 ms.
- **Movimento ligado à rolagem**, como no clinia. É só CSS (`animation-timeline`), sem JavaScript, e vem em três classes:
  - `revelar`: o bloco sobe 24 px e aparece ao entrar na tela. Vai nos cartões, no acordeão e na chamada final;
  - `subir-ao-rolar`: a [prévia da tela da loja](componentes/PreviaDaLoja.md) sobe e cresce até o lugar;
  - `desenhar-ao-rolar`: a linha do "Como funciona" se desenha conforme a pessoa rola. É o movimento marcante da página. O `path` precisa de `pathLength="1"` e fica dentro de um `.linha-do-tempo`.
- Num navegador sem `animation-timeline`, as três classes não mudam nada: tudo aparece parado e visível.
- Os atalhos da barra rolam suave e param com o título abaixo dela (`scroll-padding-top` no `html`).
- Quem pede menos movimento (`prefers-reduced-motion`) não vê animação nem transição. A regra fica no `globals.css` e vale para tudo, inclusive a rolagem.

## Decoração do painel

Só nos painéis da marca: o hero, o "Como funciona", a chamada final e o rodapé. Nunca nas telas de trabalho. É a [DecoracaoDoPainel](componentes/SecoesDaPagina.md):

- três arcos concêntricos com traço branco a 6%;
- um brilho teal (`primary` a 25%, com desfoque de 64 px) atrás do título e um laranja (`accent` a 15%) no canto;
- uma grade de pontos (`grade-de-pontos`) que some para baixo.

Tudo é `aria-hidden` e não recebe clique.

O painel usa `relative isolate overflow-clip`, nunca `overflow-hidden`. Com `overflow-hidden`, ele vira uma área de rolagem, e as animações ligadas à rolagem passam a seguir o painel, que não rola, e ficam paradas.

## Ícones e logo

- Os ícones são do [Lucide](https://lucide.dev) (`lucide-react`), em traço único: 16 px em linha (`size-4`), 20 px em destaque e 24 px no estado vazio. Ícone decorativo leva `aria-hidden="true"`.
- Botão só com ícone, sempre com `aria-label`, só em dois lugares: o de fechar o aviso flutuante e os três do [visualizador de fotos](componentes/TelaDaLoja.md#visualizador) ("Fechar", "Foto anterior" e "Próxima foto"), onde o texto taparia a foto.
- Use `ChevronRight` para "abrir" e `ChevronLeft` para voltar. `ArrowRight` vai no círculo do botão principal.
- O logo tem regras próprias em [logo.md](logo.md).

## Componentes

Cada guia diz quando usar o componente e o que passar a ele.

- **Ação e formulário:** [Button](componentes/Button.md), [Field](componentes/Field.md), [Input](componentes/Input.md), [Select](componentes/Select.md), [Textarea](componentes/Textarea.md) e [CampoCodigo](componentes/CampoCodigo.md).
- **Mensagens:** [Aviso](componentes/Aviso.md), [Avisos](componentes/Avisos.md), [DialogoConfirmacao](componentes/DialogoConfirmacao.md) e [EmptyState](componentes/EmptyState.md).
- **Estrutura:** [PageHeader](componentes/PageHeader.md), [SectionTitle](componentes/SectionTitle.md), [Card](componentes/Card.md), [Table](componentes/Table.md), [VoltarLink](componentes/VoltarLink.md) e [LinkPendingHint](componentes/LinkPendingHint.md).
- **Situação e itens:** [Badge](componentes/Badge.md), [StatusBadge](componentes/StatusBadge.md), [Stepper](componentes/Stepper.md), [Avatar](componentes/Avatar.md) e [ArquivoIcon](componentes/ArquivoIcon.md).
- **Marca e entrada:** [Logo](componentes/Logo.md), [BarraDoPortal](componentes/BarraDoPortal.md), [MolduraDeEntrada](componentes/MolduraDeEntrada.md), [SeloComVisto](componentes/SeloComVisto.md), [ReenvioDeCodigo](componentes/ReenvioDeCodigo.md), [Telas](componentes/Telas.md), [FormularioCnpj](componentes/FormularioCnpj.md), [FormularioCodigo](componentes/FormularioCodigo.md) e [EntradaDaEquipe](componentes/EntradaDaEquipe.md).
- **Página do associado:** [PreviaDaLoja](componentes/PreviaDaLoja.md) e as [seções da página](componentes/SecoesDaPagina.md): "O que você encontra", "Como funciona", as perguntas frequentes, a chamada final, o rodapé, as miniaturas e a decoração.
- **Tela da loja:** [TelaDaLoja](componentes/TelaDaLoja.md), com a barra, o seletor de loja, as seções, a linha de arquivo, a grade de fotos e o visualizador.

## De onde veio

- **Tokens, componentes e regras de uso:** do FarmaDesk (`oGuilhermeSoares/farmadesk-`, `main@f253be7`). Eles foram exportados do design system "Portal PDV" do claude.ai em 25/11/2026 e corrigidos para o portal.
- **Linguagem visual:** o [clinia.io](https://clinia.io/) serve de referência para os painéis escuros, os títulos com a palavra de destaque, as pílulas, as sombras suaves e a entrada dos blocos. Nada da marca, dos textos ou das imagens deles foi usado.

## O que mudou em relação ao FarmaDesk

| Tema               | FarmaDesk                                        | Portal PDV                                                         |
| ------------------ | ------------------------------------------------ | ------------------------------------------------------------------ |
| Superfícies        | Tudo claro e discreto                            | Painel petróleo da marca nas telas de entrada                      |
| Títulos            | Atkinson 700                                     | Barlow 600, com a palavra de destaque em `realce` sobre o petróleo |
| Botões             | Raio de 8 px                                     | Pílula, com a variante `escuro` e a seta no círculo (`iconeFinal`) |
| Campos             | 15 px e raio de 8 px                             | 16 px, raio de 12 px e 48 px de altura                             |
| Cartões            | Sem sombra                                       | Raio de 20 px e `shadow-flutuante` no que flutua                   |
| Escala de texto    | 13 / 15 / 17 / 20 / 26 px                        | 14 / 16 / 18 / 24 / 32 / 44 px                                     |
| Tabela             | Células em 14 px e cabeçalho em 12 px `gray-500` | Células em `corpo` e cabeçalho em `apoio` `gray-600`               |
| Avatar             | Cores em hex no componente e texto de 10 px      | Tokens `avatar-*` e texto mínimo de 14 px                          |
| Status e etapas    | Presos aos chamados e às compras do FarmaDesk    | `StatusBadge` recebe o grupo, e `Stepper` recebe as etapas         |
| Ícones de item     | `EquipamentoIcon` (catálogo de TI)               | `ArquivoIcon` (PDF, planilha, foto, vídeo)                         |
| Urgência           | `UrgenciaBadge` e as tarjas                      | Saiu: o portal não tem urgência                                    |
| Fundo da página    | Branco no código, `gray-50` no guia              | `gray-50`, como o guia dizia                                       |
| Paleta do Tailwind | Completa                                         | Desligada: só existem os tokens                                    |
