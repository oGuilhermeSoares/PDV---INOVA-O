# TelaDoAssociado e TelaDaEquipe

As duas telas de entrada, já montadas. Ficam em [`src/components/entrada/Telas.tsx`](../../../src/components/entrada/Telas.tsx).

**Quando usar:** nas páginas `/entrar` e `/admin/entrar` e na prévia. O cartão do formulário vem em `children`.

**`TelaDoAssociado`** é a página de apresentação, no estilo do clinia, de cima para baixo:

1. a [BarraDoPortal](BarraDoPortal.md), com os atalhos "O que tem no portal", "Como funciona" e "Perguntas" e o botão "Entrar";
2. o [hero](MolduraDeEntrada.md): "Tudo da sua loja, **num lugar só.**", os selos "Relatórios da assessoria", "Estudos de mercado" e "Fotos de antes e depois", o cartão (`#entrar`) e o link "É da equipe de PDV? Entre com a conta Microsoft";
3. a [PreviaDaLoja](PreviaDaLoja.md);
4. as [seções](SecoesDaPagina.md): "O que você encontra", "Como funciona", as perguntas frequentes e a chamada final;
5. o rodapé.

Um teste confere que todo atalho `#…` da página leva a uma seção que existe nela.

**`TelaDaEquipe`** é só o hero, na altura da tela:

- a barra sem atalhos;
- a linha "Área da equipe de PDV";
- o título "Publique o material e acompanhe **cada loja.**";
- os selos "Associados e lojas", "Avisos de material novo" e "Fotos enviadas pelos associados";
- o link "É associado? Entre com o CNPJ".

A palavra "admin" fica só no endereço, nunca no texto da tela.

```tsx
<TelaDoAssociado>
  <FormularioCnpj />
</TelaDoAssociado>
```
