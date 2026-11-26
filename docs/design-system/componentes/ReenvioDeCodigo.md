# ReenvioDeCodigo

Contagem até o associado poder pedir outro código. Quando o tempo acaba, aparece a ação de reenviar. Fica em [`src/components/entrada/ReenvioDeCodigo.tsx`](../../../src/components/entrada/ReenvioDeCodigo.tsx).

**Quando usar:** embaixo do botão "Entrar", no passo do código.

**O que você passa:**

- `segundos`: quanto falta. Com 0, a ação aparece direto;
- `acao`: o botão "Reenviar código".

**Como funciona:**

- A conta usa a hora de término, não um contador que desce. Com a aba em segundo plano o navegador atrasa o relógio, e o tempo continua certo.
- A contagem fica fora de `aria-live`, para o leitor de tela não ler a cada segundo. Quando o tempo acaba, ele anuncia "Você já pode pedir outro código."
- O espaço tem 44 px de altura nos dois estados, para a tela não pular.
- Para recomeçar a contagem depois de um reenvio, troque a `key` do componente.
