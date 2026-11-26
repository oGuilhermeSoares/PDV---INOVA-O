# StatusBadge

Selo de situação, com o texto e uma forma por grupo. Fica em [`src/components/ui/StatusBadge.tsx`](../../../src/components/ui/StatusBadge.tsx).

**Quando usar:** sempre que a tela mostra a situação de um item, como um envio de fotos ou um associado. A situação se lê pelo texto e pela forma, sem depender só da cor.

**O que você passa:** `grupo` e o texto da situação em `children`. Situações novas do portal entram num dos grupos abaixo, sem criar cor nova.

| Grupo        | Cores                                            | Forma                           |
| ------------ | ------------------------------------------------ | ------------------------------- |
| `aberto`     | `status-aberto` sobre `status-aberto-bg`         | Círculo vazio (`Circle`)        |
| `andamento`  | `status-andamento` sobre `status-andamento-bg`   | Círculo meio cheio (`Contrast`) |
| `aguardando` | `status-aguardando` sobre `status-aguardando-bg` | Pausa (`CirclePause`)           |
| `resolvido`  | `status-resolvido` sobre `status-resolvido-bg`   | Visto (`CircleCheck`)           |
| `recusado`   | `status-recusado` sobre `status-recusado-bg`     | Proibido (`Ban`)                |
| `cancelado`  | `gray-600` sobre `gray-100`                      | Xis (`CircleX`)                 |

```tsx
<StatusBadge grupo="resolvido">Publicado</StatusBadge>
```
