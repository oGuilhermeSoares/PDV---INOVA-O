# CampoCodigo

Campo do código de acesso: seis casas com algarismos grandes, no estilo `senha`. Fica em [`src/components/entrada/CampoCodigo.tsx`](../../../src/components/entrada/CampoCodigo.tsx).

**Quando usar:** no passo do código da entrada do associado, dentro de um [Field](Field.md).

**O que você passa:** as props que o `Field` entrega (`id`, `aria-invalid` e `aria-describedby`), mais `ref`, `name` (o padrão é `codigo`), `tamanho` (6), `defaultValue`, `autoFocus` e `disabled`.

**Como funciona:**

- Por trás das casas há um campo só, transparente e por cima delas. O leitor de tela lê um campo comum, e o celular sugere o código que chegou no e-mail (`autocomplete="one-time-code"`).
- O teclado é numérico (`inputMode="numeric"`), e o texto do campo tem 16 px, para o iPhone não dar zoom.
- O campo guarda só os algarismos. Quem cola "123-456" ou "123 456" fica com "123456". A limpeza é `limparCodigo`, de [`src/lib/codigo.ts`](../../../src/lib/codigo.ts), que o servidor também usa.
- Com o campo em foco, a casa da vez ganha a borda `primary-strong`. Com erro, todas ficam em `red-700`.

```tsx
<Field id="codigo" label="Código de acesso" erro={estado.erro}>
  {(campo) => <CampoCodigo {...campo} ref={referencia} autoFocus />}
</Field>
```
