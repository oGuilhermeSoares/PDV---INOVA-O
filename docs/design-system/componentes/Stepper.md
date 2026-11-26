# Stepper

Linha de etapas numeradas. Fica em [`src/components/ui/Stepper.tsx`](../../../src/components/ui/Stepper.tsx).

**Quando usar:** quando as etapas são uma sequência de verdade, como as da assessoria (visita, relatório, publicado). Por isso elas são numeradas.

**O que você passa:**

- `etapas`: uma lista de `{ rotulo, estado }`, em que o `estado` é `concluida`, `atual`, `futura` ou `negativa`;
- `rotulo`: o nome da sequência, como "Etapas da assessoria";
- `className`.

O visual de cada estado:

- A etapa atual fica em `primary`, com anel a 25%.
- As concluídas ganham o visto em `primary-light`.
- As futuras têm borda `gray-300`.
- A `negativa` é a etapa final cinza de um fluxo encerrado, como "Recusado".

A lista tem o `aria-label` "<rotulo>. Atual: <etapa>", e a etapa atual leva `aria-current="step"`.

```tsx
<Stepper
  rotulo="Etapas da assessoria"
  etapas={[
    { rotulo: "Visita", estado: "concluida" },
    { rotulo: "Relatório", estado: "atual" },
    { rotulo: "Publicado", estado: "futura" },
  ]}
/>
```
