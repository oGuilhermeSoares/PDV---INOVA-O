# Input

Campo de texto de uma linha, com borda, foco, tipografia e estados iguais em toda tela. Fica em [`src/components/ui/Input.tsx`](../../../src/components/ui/Input.tsx).

**Quando usar:** em todo campo de uma linha, sempre dentro de um [Field](Field.md), que liga o rótulo, a dica e o erro.

**O que você passa:** as props nativas de `<input>`.

- A altura é de 48 px, e o texto, de 16 px. Com menos de 16 px, o iPhone dá zoom quando a pessoa toca no campo.
- A borda é `gray-500` (4,84:1). No hover vira `gray-700`, no foco vira `primary-strong`, e com `aria-invalid` vira `red-700`.
- `disabled` usa fundo `gray-50` e opacidade.
- As classes ficam em `fieldStyles`, reaproveitadas pelo [Select](Select.md) e pelo [Textarea](Textarea.md).
- O placeholder serve para um exemplo, nunca no lugar do rótulo.
