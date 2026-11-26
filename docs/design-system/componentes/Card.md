# Card

Superfície branca com borda `gray-200` e raio de 20 px. Fica em [`src/components/ui/Card.tsx`](../../../src/components/ui/Card.tsx).

**Quando usar:** para o que é clicável ou flutua, ou para separar um bloco do fundo `gray-50`. Não ponha cartão dentro de cartão.

**O que você passa:** `children`, `padding` e `elevado`, além das props nativas de `<div>`.

- `padding`: `none`, `sm` (16 px), `md` (24 px, o padrão) ou `lg` (24 px, e 32 px a partir de `sm`).
- `elevado` acrescenta a `shadow-flutuante`. Use no que flutua, como o cartão do formulário de entrada.

```tsx
<Card padding="lg" elevado>
  <form>…</form>
</Card>
```
