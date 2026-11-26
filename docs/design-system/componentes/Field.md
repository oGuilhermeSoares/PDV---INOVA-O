# Field

Rótulo, controle, dica e erro de um campo de formulário, já ligados entre si. Fica em [`src/components/ui/Field.tsx`](../../../src/components/ui/Field.tsx).

**Quando usar:** em volta de todo [Input](Input.md), [Select](Select.md), [Textarea](Textarea.md) e [CampoCodigo](CampoCodigo.md).

**O que você passa:** `id`, `label`, `obrigatorio` ou `opcional`, `dica`, `erro` e o controle como função em `children`. A função recebe `id`, `aria-invalid` e `aria-describedby`.

- `obrigatorio` e `opcional` aparecem escritos por extenso, nunca como asterisco.
- O erro sai em `red-700` com `role="alert"`, e o leitor de tela o anuncia sem a pessoa precisar procurar.

```tsx
<Field
  id="cnpj"
  label="CNPJ da loja"
  dica="Com ou sem pontuação."
  erro={estado.erro}
>
  {(campo) => <Input {...campo} name="cnpj" defaultValue={estado.valor} />}
</Field>
```

Quando a validação falha, mantenha o que foi digitado (`defaultValue` com o valor que voltou da ação) e leve o foco ao primeiro campo com erro.
