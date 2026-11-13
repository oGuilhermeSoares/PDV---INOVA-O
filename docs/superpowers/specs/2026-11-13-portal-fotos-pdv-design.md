# Portal do Associado — Fotos e Estudos do PDV

**Data:** 13/11/2026 · **Autor:** Guilherme Soares (com Claude)

## Por que existe

O setor de PDV da Farmácias Associadas faz assessoria nas lojas dos associados. Hoje a equipe sobe tudo no SharePoint: fotos de antes e depois, vídeos e estudos BRICK em PDF e XLSX. Isso fica no site **SELL OUT E OPERAÇÕES DE PDV**, em `ASSESSORIA GC / LOJAS ATENDIDAS / <loja>`. Depois a equipe baixa a pasta, zipa e **manda por e-mail** ao associado.

O portal tira o zip do e-mail. O associado passa a ter um lugar fixo para ver o material da loja quando quiser.

## Objetivos

- O associado entra no site e vê as fotos, os vídeos e os estudos das suas lojas, organizados por seção.
- A equipe de PDV **não muda a rotina**. Ela continua subindo os arquivos no SharePoint como faz hoje.
- O setor tem uma área de admin para cadastrar associados, ligar cada um à sua pasta e avisar quando há material novo.

## Não objetivos (por agora)

- Não é um gerenciador de arquivos. Nada é subido, renomeado ou apagado pelo portal.
- O associado não edita nem comenta os arquivos.
- O portal não substitui o SharePoint como repositório da equipe.

## Antiobjetivos (seria um fracasso mesmo funcionando)

- Um associado conseguir ver o material de outra loja.
- Alguém entrar só sabendo o CNPJ, que é público.
- A equipe ter de subir os mesmos arquivos em dois lugares.

## Abordagens consideradas

| Abordagem | Como funciona | Troca | Decisão |
|---|---|---|---|
| **A. Ler direto do SharePoint** | O portal lê as pastas pelo Microsoft Graph. O admin só liga a pasta da loja ao associado. | Rotina da equipe intacta e vídeos no espaço do M365. Exige um app no Entra com permissão no site. | **Escolhida** |
| B. Upload no portal | O admin sobe os arquivos no Supabase Storage. | Mais simples de construir, mas há dois lugares para manter e os vídeos estouram o plano gratuito. | Descartada |

Login do associado:

| Opção | Troca | Decisão |
|---|---|---|
| Só CNPJ | Zero atrito, mas o CNPJ é público e qualquer pessoa entraria. | Descartada |
| CNPJ + senha | Seguro, mas cria o "suporte de senha". | Descartada |
| **CNPJ + código de 6 dígitos por e-mail** | O associado digita só o CNPJ. Entra quem tem acesso ao e-mail cadastrado. | **Escolhida** |

## Decisões do Guilherme

- Os arquivos vêm **direto do SharePoint** (abordagem A).
- O associado entra com **CNPJ + código enviado ao e-mail cadastrado**. Não há senha.
- **Um associado pode ter várias lojas (CNPJs).** Exemplo: a Drogaria Jumauti e a Farmácia Geral são do mesmo associado.
- A stack é a mesma dos outros projetos: Next.js 16 (App Router, `proxy.ts`), React 19, Prisma 7, Auth.js v5, Tailwind v4 e zod.
- **A hospedagem ainda não foi decidida.** O William provavelmente quer a Hostinger. Por isso o banco (Postgres ou MySQL) só é definido junto com a hospedagem, e o código não usa recurso exclusivo de nenhum dos dois.
- O repositório é público, mas os cards podem ter dados reais.

## Como funciona

### Quem usa

- **Associado:** entra com o CNPJ e o código, vê suas lojas e abre ou baixa os arquivos.
- **Equipe de PDV (admin):** entra com a conta Microsoft `@farmaciasassociadas.com.br`, cadastra associados, liga pastas, avisa associados e vê os acessos.

### Dados (banco via Prisma: Postgres ou MySQL, conforme a hospedagem)

- `Associado`: o grupo, com nome e e-mails de contato (um ou mais).
- `Loja`: CNPJ (único, com validação do dígito verificador), razão social, nome fantasia e cidade. Pertence a um `Associado`.
- `VinculoPasta`: liga um `Associado` (ou uma `Loja`) a uma pasta do SharePoint. Guarda `driveId` e `itemId`, nunca o caminho, para sobreviver a renomeações.
- `CodigoAcesso`: hash do código, CNPJ, validade, tentativas e quando foi usado.
- `Admin`: e-mails da equipe liberados para entrar.
- `RegistroAcesso`: quem entrou, quando e quais arquivos abriu.

### Leitura do SharePoint (Graph, só no servidor)

- Um app no Entra com permissão de aplicação **`Sites.Selected`**, liberada só no site SELL OUT E OPERAÇÕES DE PDV, com acesso de leitura.
- O portal lista as subpastas da pasta vinculada. Os nomes conhecidos ganham rótulo e ordem fixa: **Fotos antes**, **Fotos depois**, **Estudos**. Qualquer outra subpasta aparece com o próprio nome, para não perder material novo.
- Miniaturas pelo endpoint `thumbnails` do Graph.
- Para abrir ou baixar, uma rota do portal confere a sessão e se o arquivo pertence a uma pasta do associado. Só então redireciona para o `@microsoft.graph.downloadUrl`, que é curto e pré-autenticado. **Nenhum link do Graph vai para o navegador sem essa checagem.**
- As listagens ficam em cache por alguns minutos para não bater no Graph a cada clique.

### Login do associado

1. O associado digita o CNPJ, aceito com ou sem máscara.
2. Se o CNPJ estiver cadastrado, o portal gera um código de 6 dígitos e envia para os e-mails do associado. A tela mostra o e-mail mascarado (`jo***@gmail.com`).
3. O código vale 10 minutos e aceita no máximo 5 tentativas. Cada CNPJ pode pedir no máximo 3 códigos a cada 15 minutos. No banco fica só o hash.
4. Com o código certo, o associado recebe uma sessão de 30 dias e vê **todas as lojas do seu grupo**.

### Login do setor

Auth.js com Microsoft Entra ID, igual ao FarmaDesk. Só entram contas `@farmaciasassociadas.com.br` que estejam na tabela `Admin`. O primeiro admin vem de uma variável de ambiente.

### E-mails

Saem pelo **Microsoft Graph** (`sendMail`), a partir de uma caixa do setor, usando o mesmo app do Entra. A permissão `Mail.Send` fica restrita a essa caixa por Application Access Policy. É o mesmo caminho que o FarmaDesk usa desde 04/11. Há dois modelos:

- o código de acesso;
- "Seu material de PDV está disponível", que substitui o e-mail com zip e leva só o link do portal.

### Telas

- **Associado:** login (CNPJ, depois código) e página da loja, com seletor quando houver mais de uma. A página tem as seções Fotos antes, Fotos depois e Estudos, uma galeria com miniaturas, visualização em tela cheia com setas, player de vídeo, PDF aberto no navegador e XLSX para baixar. Tudo deve funcionar bem no celular.
- **Admin:** lista de associados com status (pasta ligada? e-mail cadastrado? último acesso), cadastro e edição de associado e lojas, escolha da pasta navegando em `LOJAS ATENDIDAS` com prévia do que o associado vai ver, botão "avisar associado" e registro de acessos.

### Identidade visual

Teal `#00b6ad` e laranja `#f97316`, logo da Farmácias Associadas e tokens no `@theme` do Tailwind, como no FarmaDesk. Nada de emoji como ícone.

## Hospedagem

**Em aberto. A decisão é do William.** Como os arquivos ficam no SharePoint, o portal só precisa de um servidor Node.js e de um banco pequeno. Não precisa de armazenamento de arquivos. As opções em vista:

| Opção | Banco | Observação |
|---|---|---|
| Hostinger, "Node.js Web Apps" (plano Business ou maior) | MySQL gerenciado | Roda o Next.js em modo servidor. O app dorme quando fica parado, e o primeiro acesso depois disso é mais lento. |
| Hostinger VPS | Postgres instalado na VPS | Controle total, mas a manutenção do servidor fica com a equipe. |
| Vercel + Supabase | Postgres | O caminho do FarmaDesk e do Inventário. |

Como o Prisma troca de provedor com uma linha enquanto ainda não há migrations em produção, o desenvolvimento pode começar antes da decisão. Para o domínio, a sugestão é seguir o padrão `*.redeassociadas.com.br`.

## Calls do Claude (revisar)

- O e-mail mascarado aparece na tela do código para ajudar o associado a achar a mensagem. Em troca, revela que aquele CNPJ é cliente.
- O vínculo de pasta guarda `driveId` e `itemId`, não o caminho.
- Subpastas com nomes desconhecidos aparecem em vez de ficarem escondidas.
- As validades (10 min, 5 tentativas, 3 códigos a cada 15 min, sessão de 30 dias) podem ser ajustadas.

## Fica para quem constrói

- A biblioteca da galeria e do visualizador.
- A estratégia exata de cache das listagens do Graph.
- O layout fino das telas, dentro da identidade visual.

## Pendências fora do código

- Decidir a hospedagem e o banco. Quem decide é o William.
- Registrar o app no Entra e liberar `Sites.Selected` no site. Quem faz é o Guilherme.
- Definir qual caixa do setor envia os e-mails.
- Levantar a lista de associados com CNPJs, e-mails e pastas, para a importação inicial.
