# EntradaDaEquipe

Entrada da equipe de PDV, com a conta Microsoft do domínio. Fica em [`src/components/entrada/EntradaDaEquipe.tsx`](../../../src/components/entrada/EntradaDaEquipe.tsx).

**O que você passa:** `estadoInicial` (opcional), para a prévia.

**Como funciona:**

- O botão escuro "Entrar com a Microsoft", o texto oficial do botão da Microsoft em português, chama a ação `entrarComMicrosoft`, de [`src/app/admin/entrar/acoes.ts`](../../../src/app/admin/entrar/acoes.ts). Durante o envio, ele diz "Abrindo a Microsoft…".
- O logo da Microsoft fica em `public/logo-microsoft.svg`, com os quatro quadrados oficiais.
- Por enquanto, a ação responde "A entrada da equipe ainda não foi ligada." O card #6 troca o corpo pelo login do Auth.js com o Entra ID.
- Os avisos de conta sem acesso e de conta de fora do domínio já têm texto em `MENSAGENS` e aparecem na prévia.

Quando o card #6 proteger `/admin` no `proxy.ts`, a página `/admin/entrar` precisa ficar de fora da proteção.
