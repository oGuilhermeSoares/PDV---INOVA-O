# Aviso

Aviso dentro da página, perto do que ele comenta, em quatro tons. Fica em [`src/components/ui/Aviso.tsx`](../../../src/components/ui/Aviso.tsx).

**Quando usar:** para confirmar uma ação ("12 fotos enviadas"), explicar um erro que não é de um campo só ou chamar atenção ("O acesso pelo portal ainda não foi liberado").

**O que você passa:** `tom`, `anunciar`, a mensagem em `children` e `className`.

- Os tons são `erro`, `sucesso`, `atencao` e `info` (o padrão).
- O erro usa `role="alert"` e é anunciado na hora; os outros tons usam `role="status"`.
- `anunciar={false}` tira o papel, para o aviso que fica dentro de uma região que já anuncia.
- As cores são as dos tokens de status, e o ícone muda com o tom: `CircleAlert`, `CircleCheck`, `TriangleAlert` e `Info`.

Escreva o que aconteceu e o que fazer.

```tsx
<Aviso tom="info">O relatório de novembro sai até o dia 10.</Aviso>
```

## Aviso que volta de uma ação: `RegiaoDeAviso`

Quando o aviso chega depois de um envio, como a resposta do formulário, use a `RegiaoDeAviso`, do mesmo arquivo. Ela fica sempre na página, vazia até o aviso chegar. O leitor de tela só anuncia com certeza o que muda dentro de uma região que já estava lá; um aviso que nasce com `role="status"` pode passar em silêncio.

**O que você passa:** `aviso` (`{ tom, texto }`, ou nada) e `className`, que vai no aviso. Vazia, a região não ocupa espaço.

```tsx
<RegiaoDeAviso aviso={estado.aviso} className="mt-4" />
```
