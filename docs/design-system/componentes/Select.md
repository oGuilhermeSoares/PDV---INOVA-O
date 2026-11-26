# Select

Select nativo, com o mesmo estilo de campo (`fieldStyles`). Fica em [`src/components/ui/Select.tsx`](../../../src/components/ui/Select.tsx).

**Quando usar:** para escolher um item de uma lista curta, dentro de um [Field](Field.md). Para duas a cinco opções que cabem na tela, prefira radios.

**O que você passa:** as props nativas de `<select>`, com os `<option>` em `children`.

```tsx
<Field id="loja" label="Loja">
  {(campo) => (
    <Select {...campo} name="loja">
      <option value="jumalti">Drogaria Jumalti - Caxias do Sul</option>
    </Select>
  )}
</Field>
```
