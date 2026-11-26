# PageHeader

Topo da página: o título (`h1`), a descrição e as ações. Quebra de linha em telas estreitas. Fica em [`src/components/ui/PageHeader.tsx`](../../../src/components/ui/PageHeader.tsx).

**Quando usar:** no topo de toda tela de trabalho, uma vez. O `title` é o mesmo nome que a tela tem no menu e na aba do navegador (`Nome da tela · Portal PDV`). As telas de entrada não usam o PageHeader: o `h1` delas fica no cartão do formulário.

**O que você passa:**

- `title`, em Barlow no estilo `pagina`;
- `description`, em `corpo` e `gray-600`, com até 72 caracteres por linha;
- `actions`, em geral um [Button](Button.md) principal ou um link com `buttonStyles`.
