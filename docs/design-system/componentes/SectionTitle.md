# SectionTitle

Título abaixo do `h1` da página, sempre em caixa normal. Fica em [`src/components/ui/SectionTitle.tsx`](../../../src/components/ui/SectionTitle.tsx).

**Quando usar:** para abrir uma seção (como "Relatórios") ou para o título de um cartão ou de uma linha.

**O que você passa:** `as`, `tamanho` e as props nativas do título.

- `as` (`h2`, o padrão, ou `h3`) segue a estrutura do conteúdo.
- `tamanho` segue o lugar onde o título aparece: `secao` (Barlow, 24 px) abre uma seção da página; `destaque` (18 px, o padrão) fica dentro de um cartão ou de uma linha.
- Os dois são independentes de propósito: um `h3` pode ter o tamanho `destaque` dentro de uma seção.
