# Button

Botão de ação em pílula, com seis variantes, três tamanhos e estado de envio. Fica em [`src/components/ui/Button.tsx`](../../../src/components/ui/Button.tsx).

**Quando usar:** em toda ação da tela. Para um link com cara de botão, use `buttonStyles({ variant, size })` no `className` do link, em vez de escrever as classes à mão.

**O que você passa:** o texto em `children`, `variant`, `size`, `pending`, `iconeFinal` e as props nativas de `<button>`. O `type` padrão é `button`; no formulário, use `type="submit"`.

- `primary` (padrão): a ação principal, uma por área. É o teal da marca com o texto em `gray-950`, e sobe 1 px no hover.
- `secondary`: ações de apoio. Borda `gray-300` e hover em `primary-light`.
- `ghost`: ações leves, como "Cancelar" ao lado do botão principal ou "Reenviar código".
- `danger`: destrutivo discreto, com texto `red-700`, numa linha com outras ações.
- `danger-solid`: só no diálogo de confirmação, onde a ação destrutiva é a principal.
- `escuro`: o petróleo da marca com texto branco, para a ação principal que não é do associado, como a entrada da equipe.
- Os tamanhos são `sm` (44 px, texto `apoio`), `md` (48 px, o padrão) e `lg` (56 px, texto `destaque`).
- `iconeFinal` desenha um ícone Lucide num círculo escuro no fim do botão. Use `ArrowRight` para "seguir em frente".
- `pending` desabilita o botão, marca `aria-busy` e troca o ícone final pelo indicador de envio. Troque também o texto pelo gerúndio.

```tsx
<Button type="submit" size="lg" pending={enviando} iconeFinal={ArrowRight}>
  {enviando ? "Enviando código…" : "Enviar código"}
</Button>
```

Não use o `confirm()` do navegador. Para confirmar, abra um [DialogoConfirmacao](DialogoConfirmacao.md).
