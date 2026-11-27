# TelaDeEnvio

A tela em que o associado envia fotos e vídeos para a pasta da loja, no lugar do WhatsApp. Os componentes ficam em [`src/components/envio/`](../../../src/components/envio/), e as regras sem tela (tipos aceitos, tamanho, resumo, fila e fase), em [`src/lib/envio.ts`](../../../src/lib/envio.ts).

É tela de trabalho, como a [tela da loja](TelaDaLoja.md): a mesma barra e a mesma faixa petróleo lisa, sem a decoração dos painéis.

Por enquanto, só o visual: na prévia, o envio é simulado. O envio de verdade para o SharePoint é a segunda parte do card #20.

## TelaDeEnvio

```tsx
<TelaDeEnvio
  lojas={[{ id, nome, href }]} // todas as lojas do associado; href = tela da loja
  lojaId={id} // a loja de onde ele veio
  enviar={enviarArquivo} // a função que envia um arquivo (veja abaixo)
/>
```

Ela recebe uma função, então só pode ser montada a partir de um componente cliente. Na prévia, quem monta é o [`EnvioDaPrevia`](../../../src/app/previa/EnvioDaPrevia.tsx).

De cima para baixo:

1. a [BarraDaLoja](TelaDaLoja.md#barradaloja);
2. a faixa petróleo, com o [VoltarLink](VoltarLink.md) "Sua loja" no tom escuro, o `h1` "Enviar fotos e vídeos" e a linha "Os arquivos vão direto para a pasta da loja, na qualidade original.";
3. o passo 1, "Para onde vão" (`EscolhaDoDestino`);
4. o passo 2, "Fotos e vídeos" (`AreaDeArquivos`);
5. a barra de ação, presa embaixo da tela, com o botão principal;
6. o rodapé.

Os passos são cartões com o número num círculo teal e o título em `h2`. O leitor de tela ouve "Passo 1: Para onde vão".

## Passo 1: para onde vão

- **Loja:** com uma loja só, ela aparece escrita. Com duas ou mais, vira um [Select](Select.md) já na loja de onde o associado veio.
- **Antes ou depois:** a pergunta "As fotos e os vídeos são de antes ou de depois da assessoria?", com dois cartões de escolha, "Antes" (como a loja estava) e "Depois" (como a loja ficou). São `radio` num `fieldset`, e o marcado fica com borda `primary-strong` e fundo `primary-light`.
- **Nada vem marcado.** A foto na seção errada dá retrabalho para a equipe.

A escolha de antes ou depois é a pergunta 1 da Camila (documentação, seção 16), e fica num componente só, a `EscolhaDoMomento`. Se tudo for para uma pasta "Enviadas pelo associado", sai esse componente e muda o texto do cartão de sucesso. O resto fica.

## Passo 2: fotos e vídeos

- **Escolher:** o botão "Escolher fotos e vídeos" abre o campo de arquivo, que fica escondido e fora do teclado. No celular, abre a galeria ou a câmera.
- **Arrastar:** no computador, dá para arrastar os arquivos para a área tracejada, que fica teal enquanto algo passa por cima.
- **O que entra:** JPG, PNG, HEIC, MP4 ou MOV, até 1 GB cada. A conferência é pela extensão, sem diferenciar maiúsculas.
- **Repetidos:** o mesmo arquivo escolhido duas vezes entra uma vez só. Dois arquivos diferentes com o mesmo nome entram os dois; no SharePoint, o segundo é renomeado.

### Cada arquivo

A linha tem a miniatura, o nome inteiro (quebra a linha, nunca é cortado), o tipo e o tamanho ("Foto · 4,2 MB"), e a situação:

| Situação | O que aparece                                                                                          |
| -------- | ------------------------------------------------------------------------------------------------------ |
| Pronto   | "Tirar"                                                                                                |
| Recusado | O motivo, em `status-recusado` com o `CircleAlert`, e "Tirar"                                          |
| Na fila  | "Na fila" (durante o envio, esperando a vez)                                                           |
| Enviando | A barra (`role="progressbar"`, trilho `primary-light`, preenchimento `primary-strong`) e a porcentagem |
| Enviado  | "Enviado", em `status-resolvido` com o `CircleCheck`. Não tem "Tirar"                                  |
| Falhou   | "Não foi enviado. A conexão caiu no meio do envio.", e "Tirar"                                         |

Os motivos de recusa:

- "Este tipo de arquivo não é aceito. Envie JPG, PNG, HEIC, MP4 ou MOV.";
- "Maior que 1 GB. Este arquivo não vai ser enviado.";
- "O arquivo está vazio.".

O tamanho é escrito em base 1000, como o celular mostra.

A miniatura existe só para a foto aceita, criada com `URL.createObjectURL` e liberada ao tirar o arquivo ou sair da tela. Vídeo, e HEIC que o navegador não abre, ficam com o [ícone do tipo](ArquivoIcon.md).

Abaixo de 640 px, o "Tirar" desce para a linha de baixo, alinhado com o nome: ao lado, ele espremeria o nome e o motivo numa coluna estreita (como no [ItemDeArquivo](TelaDaLoja.md#itemdearquivo)).

"Tirar" tem o nome do arquivo no nome acessível ("Tirar IMG_2041.HEIC"). Ele nunca aparece no que já foi enviado: o associado não apaga o que mandou (pergunta 4 da documentação).

## O envio

- **O botão diz quanto vai:** "Enviar 12 fotos e 1 vídeo", sem contar os recusados. Sem arquivo válido, diz "Enviar fotos e vídeos".
- **O que falta:** "Enviar" confere os dois passos:
  - sem antes ou depois, o erro aparece embaixo da pergunta e o foco vai para o primeiro cartão;
  - sem arquivo válido, o erro aparece no passo 2 e o foco vai para "Escolher".
- **Ordem:** um arquivo de cada vez, na ordem da escolha. Cada linha tem a própria barra.
- **Durante o envio:**
  - o botão fica ocupado ("Enviando…");
  - o passo 1 e o "Escolher" ficam desabilitados;
  - o "Tirar" some;
  - o leitor de tela ouve "3 de 13 enviados" a cada arquivo que termina, e não a cada pedaço da barra.
- **Falha:** quando um arquivo falha, os outros seguem. No fim, um [Aviso](Aviso.md) de erro diz quantos não foram ("1 arquivo não foi enviado. Confira a internet e tente de novo."). O botão vira "Tentar de novo", que manda só os que faltam.
- **Concluído:** os passos saem e entra o cartão de sucesso, com o título "12 fotos e 1 vídeo enviados" (que recebe o foco), onde eles estão, a loja, "Ver na tela da loja" e "Enviar mais fotos e vídeos". "Enviar mais" limpa a lista, desmarca o antes ou depois e leva o foco à pergunta.

## Sair no meio do envio

A `ProtecaoDeSaida` segura a saída enquanto o envio roda.

- **Fechar ou recarregar a aba:** dispara o aviso do navegador (`beforeunload`).
- **Clicar num link da página** ("Sua loja", "Sair"): abre o [DialogoConfirmacao](DialogoConfirmacao.md) "Sair antes de terminar o envio?", com "Continuar enviando" e "Sair e parar o envio". O clique é pego em captura no `document`, antes do roteador do Next.
- **Ctrl, Cmd ou Shift + clique, e links com `target="_blank"`:** abrem a outra aba sem perguntar, porque o envio segue.

O botão de voltar do celular não passa por aqui: o roteador do Next não avisa antes de trocar de página. Fica para a segunda parte do #20.

## O ponto de troca

```ts
type EnviarArquivo = (
  arquivo: File,
  destino: { lojaId: string; momento: "antes" | "depois" },
  opcoes: { aoProgredir: (fracao: number) => void; sinal: AbortSignal },
) => Promise<void>;
```

A função rejeita quando o envio falha, e com o `sinal` abortado quando o associado sai.

- **Na prévia:** a barra anda em dez passos e sempre termina bem.
- **Na segunda parte do #20:** a função pede ao portal a sessão de envio (`createUploadSession`) na pasta certa e manda o arquivo em partes. A tela não muda.

## Prévia

Em `/previa`, no grupo "Envio de fotos e vídeos". Em todas, dá para escolher arquivos de verdade e ver o envio simulado.

- `envio`: vazio, com uma loja;
- `envio-varias-lojas`: com o campo de escolha da loja;
- `envio-escolhendo`: seis arquivos, um recusado pelo tamanho e um pelo tipo;
- `envio-faltou-escolher`: o erro de antes ou depois;
- `envio-enviando`: parado no meio do envio. Os links da página abrem o diálogo de saída;
- `envio-com-falha`: um arquivo não foi, com o aviso e o "Tentar de novo";
- `envio-concluido`: o cartão de sucesso.

O botão "Enviar fotos e vídeos" da [tela da loja](TelaDaLoja.md) leva para cá.
