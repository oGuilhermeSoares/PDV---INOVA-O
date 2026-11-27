# Tela de envio de fotos e vídeos (desenho)

**Data:** 27/11/2026 · **Branch:** `feat/20-envio-de-fotos` · Base: card [#20](https://github.com/oGuilhermeSoares/PDV---INOVA-O/issues/20) e a [documentação](../../documentacao-do-projeto.md), seções 6.3, 9 e 16.

## Por que

Hoje o associado manda as fotos e os vídeos da loja pelo WhatsApp, e a equipe de PDV salva um por um no SharePoint. Com esta tela, ele envia pelo portal e o arquivo cai direto na pasta da loja. O Guilherme aprovou o desenho em 27/11 ("pode seguir com esse desenho") e pediu para eu tomar as decisões.

É tela de trabalho: segue o design system do portal, como a [tela da loja](2026-11-26-tela-da-loja-design.md). O clinia vale só para o login.

## Escopo

**Dentro:** a tela inteira, os estados dela e as regras que não dependem do SharePoint, testadas:

- os tipos aceitos e o tamanho máximo, conferidos no navegador antes do envio;
- o tamanho escrito ("4,2 MB") e o resumo ("12 fotos e 1 vídeo");
- a fila de arquivos e a fase do envio, como funções puras;
- o aviso antes de sair no meio do envio.

Tudo na prévia (`/previa/envio…`). Lá, o envio é simulado: a barra anda e o arquivo termina sem sair do navegador.

**Fora:**

- o envio de verdade (`createUploadSession`, CORS, envio em partes): é a segunda parte do #20, e depende dos cards #3 (com escrita), #4, #5, #10 e #11;
- a conferência no servidor (sessão, loja do associado, tipo e tamanho de novo);
- o registro em `EnvioAssociado` e o aviso único para a equipe.

## Seria um fracasso, mesmo funcionando

- A foto ir para a seção errada sem o associado perceber. Por isso não existe "antes" ou "depois" marcado de saída.
- O associado só descobrir que um arquivo não serve depois de esperar o envio. Os recusados aparecem na hora da escolha, com o motivo.
- O associado sair no meio do envio achando que terminou.
- Uma lista de nomes como "IMG_2041.HEIC" sem a foto: no celular, a pessoa reconhece a foto, não o nome.

## Caminhos considerados

1. **Tela própria, aberta pelo botão da tela da loja (escolhido).** Ela tem endereço, mostra para onde as fotos vão antes da escolha dos arquivos e pode pedir confirmação antes de sair no meio do envio.
2. **Galeria direto no toque, com um painel por cima da tela da loja.** Economiza um toque, mas o "voltar" do celular fecha o painel no meio do envio, e o destino só aparece depois da escolha.
3. **Diálogo (`<dialog>`) por cima da tela da loja.** Tem o mesmo problema do "voltar", e uma lista longa de arquivos não cabe bem num diálogo no celular.

## A tela, de cima para baixo

```
[logo] Portal PDV                                   Sair   ← BarraDaLoja
‹ Sua loja                                                 ← faixa petróleo
Enviar fotos e vídeos                                      ← h1
Os arquivos vão direto para a pasta da loja, na qualidade original.

┌ 1  Para onde vão ───────────────────────────────────────┐
│ Loja: Drogaria Jumalti - Caxias do Sul    (2+: campo de escolha) │
│ As fotos e os vídeos são de antes ou de depois da assessoria?    │
│ ( ) Antes   Como a loja estava      ( ) Depois   Como a loja ficou │
└─────────────────────────────────────────────────────────┘
┌ 2  Fotos e vídeos ──────────────────────────────────────┐
│  [ Escolher fotos e vídeos ]   ou arraste os arquivos para cá    │
│  JPG, PNG, HEIC, MP4 ou MOV, até 1 GB cada                       │
│  [▣] IMG_2041.HEIC   Foto · 4,2 MB                    [Tirar]    │
│  [▣] VID_0007.MOV    Vídeo · 1,3 GB                   [Tirar]    │
│      Maior que 1 GB. Este arquivo não vai ser enviado.           │
└─────────────────────────────────────────────────────────┘
[ Enviar 12 fotos e 1 vídeo ]                    ← barra presa embaixo
```

- **Faixa petróleo:** a mesma da tela da loja, lisa, sem a decoração dos painéis. Tem o link de volta "Sua loja" (o [VoltarLink](../../design-system/componentes/VoltarLink.md) ganha o tom escuro), o `h1` e uma linha de apoio.
- **Passo 1, "Para onde vão":**
  - a loja. Com uma loja só, ela aparece escrita. Com duas ou mais, vira um campo de escolha já na loja de onde o associado veio;
  - antes ou depois, em dois cartões de escolha (`radio` dentro de `fieldset`), **sem nenhum marcado**.
- **Passo 2, "Fotos e vídeos":**
  - uma área tracejada com o botão "Escolher fotos e vídeos". No celular, ele abre a galeria ou a câmera. No computador, dá para arrastar os arquivos para a área;
  - a linha com os tipos aceitos e o limite;
  - a lista dos arquivos escolhidos, cada um com a miniatura (para foto), o nome inteiro, o tipo e o tamanho, e "Tirar".
- **Barra de ação:** presa embaixo da tela, para o botão estar à mão numa lista longa. O botão diz quanto vai: "Enviar 12 fotos e 1 vídeo". Sem arquivo válido, diz "Enviar fotos e vídeos".

## Cada arquivo na lista

| Situação | O que a linha mostra                                                                     |
| -------- | ---------------------------------------------------------------------------------------- |
| Pronto   | Tipo e tamanho, e "Tirar"                                                                |
| Recusado | O motivo, em vermelho com ícone, e "Tirar". Não entra na contagem nem no envio           |
| Na fila  | "Na fila" (durante o envio, esperando a vez)                                             |
| Enviando | Barra de progresso (`role="progressbar"`) e a porcentagem                                |
| Enviado  | "Enviado", com o visto, em verde. Não tem "Tirar": o associado não apaga o que já mandou |
| Falhou   | "Não foi enviado. A conexão caiu no meio do envio.", em vermelho com ícone, e "Tirar"    |

Os motivos de recusa:

- **tipo:** "Este tipo de arquivo não é aceito. Envie JPG, PNG, HEIC, MP4 ou MOV.";
- **tamanho:** "Maior que 1 GB. Este arquivo não vai ser enviado.";
- **vazio:** "O arquivo está vazio.".

## O envio

1. "Enviar" confere o passo 1 e o 2. Faltando o antes ou depois, o erro aparece embaixo da pergunta ("Escolha se as fotos e os vídeos são de antes ou de depois da assessoria.") e o foco vai para ela. Sem arquivo válido, o erro aparece no passo 2 ("Escolha pelo menos uma foto ou um vídeo.").
2. Os arquivos vão um de cada vez, na ordem da escolha. A tela aceita outra ordem ou vários juntos, porque cada linha tem a própria barra.
3. Durante o envio:
   - o botão fica ocupado, com "Enviando…";
   - o passo 1 e o "Escolher" ficam desabilitados;
   - uma região `aria-live` diz "3 de 13 enviados" a cada arquivo que termina, e não a cada pedaço da barra.
4. **Saída no meio:** fechar ou recarregar a aba dispara o aviso do navegador (`beforeunload`). Tocar em qualquer link da página, como "Sua loja" ou "Sair", abre o [DialogoConfirmacao](../../design-system/componentes/DialogoConfirmacao.md):
   - título "Sair antes de terminar o envio?";
   - texto "Os arquivos que ainda não foram enviados ficam de fora. Os que já foram continuam na pasta da loja.";
   - botões "Continuar enviando" e "Sair e parar o envio".
     O botão de voltar do celular não passa por aqui: o roteador do Next não dá esse aviso. Fica anotado para a segunda parte.
5. **Falha:** quando um arquivo falha, os outros continuam. No fim, um aviso de erro diz quantos não foram ("1 arquivo não foi enviado. Confira a internet e tente de novo."), e o botão vira "Tentar de novo", que manda só os que falharam e os que ainda estão prontos.
6. **Concluído:** os passos saem e entra um cartão de sucesso:
   - título "12 fotos e 1 vídeo enviados", que recebe o foco;
   - texto "Já estão em Fotos e vídeos: antes, na tela da loja. A equipe de PDV recebe um aviso.", e embaixo "Loja: Drogaria Jumalti - Caxias do Sul" (com duas lojas, é a escolhida);
   - "Ver na tela da loja", que leva à tela da loja escolhida, e "Enviar mais fotos e vídeos", que limpa a lista e desmarca o antes ou depois.

## A pergunta 1 da Camila

A documentação propõe que **o associado escolhe** antes ou depois (pergunta 1 da seção 16), e a tela segue a proposta. A escolha fica num componente só, `EscolhaDoMomento`, e o destino é um tipo só (`Destino`). Se a Camila preferir uma pasta "Enviadas pelo associado", sai esse componente e o texto do cartão de sucesso muda. O resto da tela fica.

## Regras (em `src/lib/envio.ts`)

- **Tipos aceitos:** pela extensão, sem diferenciar maiúsculas: `jpg`, `jpeg`, `png`, `heic`, `mp4` e `mov`. O tipo que o navegador informa (MIME) não serve: o Windows e o Chrome deixam o HEIC sem tipo.
- **Tamanho máximo:** 1 GB por arquivo (pergunta 5, ainda sem a palavra final), numa constante só.
- **Tamanho escrito:** em base 1000, como o celular mostra ("4,2 MB", "1,3 GB", "820 KB"), com vírgula.
- **Resumo:** "1 foto", "12 fotos", "1 vídeo", "12 fotos e 1 vídeo". O particípio concorda: "12 fotos enviadas", "1 vídeo enviado", "12 fotos e 1 vídeo enviados".
- **Mesmo arquivo duas vezes:** escolher o mesmo arquivo de novo (mesmo nome, tamanho e data) não repete a linha. Dois arquivos diferentes com o mesmo nome entram os dois. No SharePoint, o segundo é renomeado (`conflictBehavior: rename`), que é a segunda parte do card.
- **Fila e fase:** a fila é um reducer (`escolheu`, `tirou`, `comecou`, `progrediu`, `terminou`, `falhou`, `parou`, `recomecou`, `limpou`). A fase sai da fila e de "está rodando": `escolhendo`, `enviando`, `com-falha` ou `concluido`.

## O ponto de troca do envio

A tela recebe a função que envia um arquivo:

```ts
type EnviarArquivo = (
  arquivo: File,
  destino: Destino, // { lojaId, momento: "antes" | "depois" }
  opcoes: { aoProgredir: (fracao: number) => void; sinal: AbortSignal },
) => Promise<void>;
```

Na prévia, ela é a simulação. Na segunda parte do #20, ela pede a sessão de envio ao portal e manda o arquivo em partes. A tela não muda.

Por receber uma função, a tela só pode ser montada a partir de um componente cliente. Na prévia, esse componente é `EnvioDaPrevia`.

## Componentes novos (em `src/components/envio/`)

- `TelaDeEnvio({ lojas, lojaId, enviar, estadoInicial? })`: a barra, a faixa, o formulário e o rodapé. `lojas` usa o mesmo formato do seletor de loja (`{ id, nome, href }`): o `href` da loja de origem é o "Sua loja", e o da loja escolhida é o "Ver na tela da loja".
- `EscolhaDoDestino`: o passo 1, com a loja e a `EscolhaDoMomento`.
- `AreaDeArquivos`: o passo 2, com a área de escolha, o campo de arquivo escondido e a lista.
- `LinhaDoArquivo`: uma linha, conforme a situação.
- `EnvioConcluido`: o cartão de sucesso.
- `ProtecaoDeSaida`: o `beforeunload`, a captura dos cliques em links e o diálogo.

**Na tela da loja**, o botão "Enviar fotos e vídeos" vira um link para a tela de envio (`enviarHref`). Ele deixa de mostrar o aviso de "próxima etapa".

## Prévia

- `envio`: vazio, com uma loja;
- `envio-varias-lojas`: com o campo de escolha da loja;
- `envio-escolhendo`: antes marcado, seis arquivos, um recusado pelo tamanho e um pelo tipo;
- `envio-faltou-escolher`: o erro de antes ou depois;
- `envio-enviando`: dois enviados, um a 64% e o resto na fila. Os links da página abrem o diálogo de saída;
- `envio-com-falha`: um arquivo falhou, com o aviso e o "Tentar de novo";
- `envio-concluido`: o cartão de sucesso.

Em todos, dá para escolher arquivos de verdade e ver o envio simulado. Os nomes de exemplo seguem o que o celular gera (`IMG_2041.HEIC`, `WhatsApp Image … .jpeg`) e só existem na prévia.

## Testes

- **Regras:** tipos (maiúsculas, `jpeg`, sem extensão, `pdf`), limite exato de 1 GB, arquivo vazio, tamanho escrito, resumo e particípio, fila (deduplicação, cada ação) e fase.
- **Componentes:** cada estado da prévia renderizado. Conferem os nomes acessíveis ("Tirar IMG_2041.HEIC"), a barra com `aria-valuenow`, o `accept` do campo, o erro com `role="alert"`, o botão ocupado e o link "Ver na tela da loja".
- **Navegador:** os quatro gates e o Chrome sem janela em 5 larguras, sem rolagem lateral e com o console limpo. Além disso:
  - arquivos de verdade postos no campo (`DOM.setFileInputFiles`): o recusado aparece com o motivo;
  - o envio simulado chega ao cartão de sucesso;
  - o diálogo de saída abre no meio do envio;
  - o teclado chega a tudo.

## Decisões minhas

- Tela própria, e não painel nem diálogo.
- Nenhum "antes" ou "depois" marcado de saída.
- Um arquivo de cada vez, na ordem da escolha.
- Tamanho em base 1000 e limite de 1 GB = 1.000.000.000 bytes.
- `jpeg` conta como JPG. `heif` e os outros tipos de imagem ficam de fora até a Camila pedir.
- Um "Tentar de novo" só, no fim, e não um por linha.
- Os recusados não somem: ficam na lista com o motivo até o associado tirar.
- Miniatura para foto (com `URL.createObjectURL`, liberada ao tirar e ao sair). Vídeo e HEIC que o navegador não abre ficam com o ícone.
- "Enviar mais" desmarca o antes ou depois, para a próxima leva ser uma escolha consciente.
- O tamanho é médio: uma tela, sete estados e as regras.
