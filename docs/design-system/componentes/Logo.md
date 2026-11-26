# Logo

Só a marca da Farmácias Associadas, a cruz laranja, com a reserva para quando a imagem falha. Fica em [`src/components/marca/Logo.tsx`](../../../src/components/marca/Logo.tsx). As regras de uso estão em [logo.md](../logo.md).

**Quando usar:** no topo das telas, com o nome "Portal PDV" escrito ao lado. No painel escuro, ponha-o numa placa branca redonda.

**O que você passa:**

- `tamanho`: 36 (o padrão) ou 64 px na tela;
- `className`: para mudar o tamanho a partir de uma largura, como `lg:size-16`.

A imagem vem sempre em 64 px, nítida nos dois tamanhos. Se ela falhar, o componente mostra o quadrado `accent` com a cruz branca e `role="img"`, com o mesmo nome acessível.

```tsx
<span className="flex rounded-full bg-white p-1.5 ring-4 ring-white/10">
  <Logo tamanho={36} className="lg:size-16" />
</span>
```
