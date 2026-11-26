# BarraDoPortal

Barra de vidro fixa no topo das telas de entrada, como a do clinia. Fica em [`src/components/entrada/BarraDoPortal.tsx`](../../../src/components/entrada/BarraDoPortal.tsx).

**Quando usar:** no topo de `/entrar` e de `/admin/entrar`, por meio de [TelaDoAssociado e TelaDaEquipe](Telas.md). É o `<header>` da página.

**O que você passa:**

- `atalhos` (opcional): `{ href, rotulo }` das seções da página, como `#perguntas` "Perguntas". Aparecem num `<nav aria-label="Seções">` a partir de 1024 px.
- `acao` (opcional): o que fica à direita, como o link "Entrar" para o cartão (`buttonStyles({ size: "sm" })`).

**Como fica:**

- Pílula em `petroleo-900` a 75%, com desfoque (`backdrop-blur-xl`), borda branca a 12%, o logo numa placa branca e "Portal PDV".
- Os atalhos são `apoio`, em branco a 72%, e ficam brancos no hover. Têm 44 px de altura.
- **Não baixe a opacidade.** Com menos de 75%, o texto branco reprova quando a barra passa sobre uma seção clara. O teste em `BarraDoPortal.test.tsx` lê a opacidade da própria classe e confere esse pior caso.
- Os atalhos levam às seções sem esconder o título atrás da barra, graças ao `scroll-padding-top` do `html`.
