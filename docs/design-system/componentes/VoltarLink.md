# VoltarLink

Link de volta no topo das telas internas. Fica em [`src/components/ui/VoltarLink.tsx`](../../../src/components/ui/VoltarLink.tsx).

**Quando usar:** acima do título, em telas de detalhe e em passos de um fluxo. O texto é o nome da tela de destino ("Trocar CNPJ", "Fotos e vídeos"), sem a palavra "voltar".

**O que você passa:** `href` e o texto em `children`. O link usa o `next/link`, o `ChevronLeft` de 16 px e texto `corpo` em `gray-600`, que vira `gray-900` no hover. Tem 44 px de altura, para o toque.
