# Badge

Rótulo curto em pílula, com ponto ou ícone opcional. Fica em [`src/components/ui/Badge.tsx`](../../../src/components/ui/Badge.tsx).

**Quando usar:** para marcar uma propriedade curta de um item, como a loja, o tipo ou "Novo". Para situação, use o [StatusBadge](StatusBadge.md).

**O que você passa:** o texto em `children`, `className`, `dot` e `icon`.

- `className` traz o par de cores. O padrão é `bg-gray-100 text-gray-600`. Use sempre um par de texto e fundo com 4,5:1 ou mais, como `bg-accent-light text-accent-strong`.
- `dot` mostra um ponto na cor do texto.
- `icon` recebe um ícone Lucide de 14 px, com `aria-hidden`.

```tsx
<Badge className="bg-accent-light text-accent-strong" dot>
  Novo
</Badge>
```
