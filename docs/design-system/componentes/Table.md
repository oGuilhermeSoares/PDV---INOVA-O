# Table

Tabela com cabeçalho fixo dentro da área de rolagem: `Table`, `TableHead` e `TableCell`. Fica em [`src/components/ui/Table.tsx`](../../../src/components/ui/Table.tsx).

**Quando usar:** em listas com várias colunas, no computador. No celular, troque cada linha por um cartão.

**O que você passa:**

- `Table` recebe o `<thead>` e o `<tbody>`, com as props nativas de `<table>`. O texto é `corpo`.
- `TableHead` é um `<th scope="col">` em `apoio` e `gray-600`, com fundo `gray-50` e borda `gray-200`.
- `TableCell` é um `<td>` com 16 px de respiro.

O contêiner (borda, raio de 20 px e rolagem) e as linhas ficam com quem usa. Datas e números vão com `tabular-nums`.

```tsx
<div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white">
  <Table>
    <thead>
      <tr>
        <TableHead>Arquivo</TableHead>
        <TableHead>Atualizado em</TableHead>
      </tr>
    </thead>
    <tbody className="divide-y divide-gray-200">…</tbody>
  </Table>
</div>
```
