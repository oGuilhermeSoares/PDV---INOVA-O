# FormularioCodigo

Passo 2 da entrada do associado: o código que chegou no e-mail. Fica em [`src/components/entrada/FormularioCodigo.tsx`](../../../src/components/entrada/FormularioCodigo.tsx).

**O que você passa:**

- `emailMascarado`: o e-mail como o servidor manda, por exemplo `jo***@gmail.com`. O e-mail inteiro nunca vem para o navegador;
- `segundosParaReenviar`: quanto falta para poder pedir outro código. O padrão é 45;
- `estadoInicial` (opcional), para a prévia.

**Como funciona:**

- O formulário chama a ação `conferirCodigo`, de [`src/app/entrar/acoes.ts`](../../../src/app/entrar/acoes.ts). O botão "Reenviar código" envia o mesmo formulário com `intencao=reenviar`, e só o botão apertado mostra o gerúndio ("Entrando…" ou "Reenviando código…").
- O código usa o [CampoCodigo](CampoCodigo.md), e a contagem, o [ReenvioDeCodigo](ReenvioDeCodigo.md).
- "Trocar CNPJ" volta ao [passo 1](FormularioCnpj.md).
- Os estados que o card #10 vai usar já têm texto em `MENSAGENS`: código errado, código vencido, bloqueado depois de 5 erros e código reenviado. Eles aparecem na prévia.

A rota deste passo nasce no card #10. Por enquanto, ele aparece em `/previa/codigo`.
