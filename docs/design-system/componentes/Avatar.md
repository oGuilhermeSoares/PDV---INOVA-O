# Avatar

Iniciais de uma pessoa ou de uma loja num círculo, com um tom que não muda entre telas. Fica em [`src/components/ui/Avatar.tsx`](../../../src/components/ui/Avatar.tsx).

**Quando usar:** ao lado do nome de quem enviou ou de quem atendeu, em listas e históricos. É decorativo (`aria-hidden`), então o nome precisa estar escrito ao lado.

**O que você passa:**

- `nome`: as iniciais saem da primeira letra do primeiro nome e do último;
- `chave`: um identificador estável, como o e-mail. Sem ela, o tom vem do nome;
- `size`: `sm` (32 px) ou `md` (40 px, o padrão);
- `className`.

O componente também exporta `iniciais(nome)` e `tomDoAvatar(chave)`. Os quatro tons são os tokens `avatar-1` a `avatar-4`, cada um sobre o seu `-bg`, e o teste de contraste confere todos (de 4,99:1 a 6,40:1).
