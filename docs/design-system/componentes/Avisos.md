# Avisos

Avisos flutuantes: a resposta curta a uma ação, como "12 fotos enviadas" ou "Associado avisado". Fica em [`src/components/ui/Avisos.tsx`](../../../src/components/ui/Avisos.tsx).

**Quando usar:** quando uma ação termina e a pessoa continua na mesma tela. O erro de formulário não vem para cá: ele fica ao lado do campo, no [Field](Field.md).

**O que você passa:** nada ao componente. A região `<Avisos />` já está montada uma vez em [`src/app/layout.tsx`](../../../src/app/layout.tsx). De qualquer componente cliente, chame `avisar(texto, tom)`, com o `tom` do [Aviso](Aviso.md). O padrão é `sucesso`.

- Ficam no máximo três avisos na tela; quando chega um quarto, o mais antigo sai.
- Sucesso e info somem em 6 s. Atenção e erro ficam até a pessoa fechar, porque pedem uma providência.
- A região usa `role="status"` com `aria-live="polite"` e fica embaixo, centralizada no celular e à direita no computador.

```tsx
avisar("12 fotos enviadas para a equipe.");
```
