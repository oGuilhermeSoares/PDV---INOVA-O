# FormularioCnpj

Passo 1 da entrada do associado: o CNPJ de uma das lojas. Fica em [`src/components/entrada/FormularioCnpj.tsx`](../../../src/components/entrada/FormularioCnpj.tsx).

**O que você passa:** `estadoInicial` (opcional), para mostrar a tela num estado, como na prévia.

**Como funciona:**

- O formulário chama a ação `pedirCodigo`, de [`src/app/entrar/acoes.ts`](../../../src/app/entrar/acoes.ts), com `useActionState`.
- O campo aceita o CNPJ com ou sem pontuação, com espaços e com letras (o CNPJ alfanumérico da Receita, emitido desde julho de 2026). No celular, o teclado abre em maiúsculas.
- A validação fica em [`src/lib/cnpj.ts`](../../../src/lib/cnpj.ts). Com erro, a mensagem sai ao lado do campo, o que foi digitado continua lá e o foco volta ao campo.
- Os textos ficam em `MENSAGENS`, de [`src/lib/entrada.ts`](../../../src/lib/entrada.ts).
- Por enquanto, um CNPJ válido mostra o aviso "O acesso pelo portal ainda não foi liberado". O card #10 troca o corpo da ação: achar o associado, enviar o código e ir para o [passo do código](FormularioCodigo.md).
