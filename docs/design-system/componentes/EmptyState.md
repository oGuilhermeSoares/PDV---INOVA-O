# EmptyState

Estado vazio, com ícone, título, descrição e ação opcional. Fica em [`src/components/ui/EmptyState.tsx`](../../../src/components/ui/EmptyState.tsx).

**Quando usar:** quando uma lista ou uma pasta não tem itens. Diga o que vai aparecer ali e, se houver, a ação que resolve. Numa busca sem resultado, diga o filtro ativo e ofereça "Limpar filtros".

**O que você passa:**

- `title` e `description`;
- `action`, em geral um [Button](Button.md);
- `icon`, um ícone Lucide (o padrão é `Inbox`), que aparece numa caixa `primary-light` com traço `primary-strong`;
- `as`: `h2` (o padrão) ou `h3`, dentro de uma seção que já tem `h2`.

```tsx
<EmptyState
  icon={Images}
  title="Nenhuma foto ainda"
  description="As fotos que você enviar aparecem aqui, separadas em antes e depois."
  action={<Button iconeFinal={ArrowRight}>Enviar fotos</Button>}
/>
```
