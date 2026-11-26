# MolduraDeEntrada

Hero das telas de entrada: um bloco petróleo na largura toda, como o do clinia, com o título e os selos à esquerda e o cartão do formulário à direita. Fica em [`src/components/entrada/MolduraDeEntrada.tsx`](../../../src/components/entrada/MolduraDeEntrada.tsx).

**Quando usar:** só nas telas de entrada, por meio de [TelaDoAssociado e TelaDaEquipe](Telas.md). O logo fica na [BarraDoPortal](BarraDoPortal.md), fixa em cima.

**O que você passa:**

- `altura`:
  - `"tela"` ocupa a tela inteira, na entrada da equipe;
  - `"pagina"` abre a página do associado e deixa espaço embaixo para a [prévia da tela da loja](PreviaDaLoja.md) entrar por cima da borda.
- `idDoCartao` (opcional): o `id` do lugar do cartão, alvo do "Entrar" da barra (`entrar`).
- `rotulo` (opcional): a linha pequena acima do título, como "Área da equipe de PDV".
- `titulo` e `destaque`: o título do painel, com o `destaque` no fim, na cor `realce`.
- `selos`: os textos dos [selos](SeloComVisto.md), que aparecem a partir de 640 px.
- `children`: o cartão do formulário.
- `rodape` (opcional): embaixo do cartão, sobre o escuro, como o link para a entrada do outro perfil (link em `primary`).

**Como fica:**

- **Computador (a partir de 1024 px):** duas colunas, com o título em `vitrine` e o cartão à direita.
- **Celular:** o título em `pagina` e o cartão logo depois, na primeira tela.
- O título, os selos e o cartão entram com `animate-entrar`.
- A decoração é a [DecoracaoDoPainel](SecoesDaPagina.md#decoracaodopainel), e o bloco usa `overflow-clip`.

O `h1` da página é o do cartão. O título do painel é um parágrafo.
