# TelaDaLoja

A tela que o associado vê depois de entrar: o material da loja, numa rolagem só. Os componentes ficam em [`src/components/loja/`](../../../src/components/loja/), e as regras sem tela (ordem das seções, datas, ação por tipo) em [`src/lib/loja.ts`](../../../src/lib/loja.ts).

É tela de trabalho, então segue o design system do portal, não a página de entrada: barra sólida, faixa petróleo lisa, sem a [decoração dos painéis](SecoesDaPagina.md) e sem movimento ligado à rolagem.

## TelaDaLoja

```tsx
<TelaDaLoja
  loja={{ id, nome }}
  lojas={[{ id, nome, href }]} // todas as lojas do grupo, com a atual
  secoes={montarSecoes(pastas)}
  erro={false} // true quando o SharePoint não respondeu
/>
```

De cima para baixo:

1. a [BarraDaLoja](#barradaloja);
2. a faixa petróleo com "Sua loja" (em `realce`), o nome da loja no `h1`, o [SeletorDeLoja](#seletordeloja) e o botão principal "Enviar fotos e vídeos";
3. as seções, uma [SecaoDaLoja](#secaodaloja) por pasta, na ordem de `montarSecoes`;
4. o rodapé "Setor de PDV · Farmácias Associadas".

A faixa fica em `z-10`, para o menu "Trocar loja" abrir por cima das seções. Por isso as seções começam abaixo dela, sem sobrepor.

O nome da loja passa por `nomeDaLoja` no `h1` e no seletor. As pastas seguem "Loja - Cidade", e o espaço antes do traço não quebra: no celular, a segunda linha nunca começa com "- Caxias do Sul".

Com `erro`, as seções saem e entram um [Aviso](Aviso.md) de erro ("Não deu para carregar o material agora. Tente de novo em alguns minutos.") e o botão "Tentar de novo", que pede a página de novo ao servidor.

"Enviar fotos e vídeos" ainda só mostra um aviso flutuante dizendo que o envio chega na próxima etapa. O card #20 troca pela tela de envio.

## Ordem das seções

`montarSecoes(pastas)` recebe as pastas da loja no SharePoint e devolve as seções, como a documentação (seção 7) manda:

| Pasta no SharePoint  | Seção                  | Tipo       |
| -------------------- | ---------------------- | ---------- |
| A raiz da loja       | Relatórios             | documentos |
| `Estudos`            | Estudo de mercado      | documentos |
| `Fotos antes`        | Fotos e vídeos: antes  | fotos      |
| `Fotos Depois`       | Fotos e vídeos: depois | fotos      |
| Qualquer outra pasta | O próprio nome, no fim | documentos |
| `Interno`            | Não aparece            |            |

Os nomes das pastas são comparados sem maiúsculas, acentos nem espaços nas pontas: "Fotos Depois" e " fotos depois " viram a mesma seção.

## BarraDaLoja

Barra fixa, em `petroleo-900` sólido, com o logo, "Portal PDV" e "Sair". É sólida, e não de vidro como a [BarraDoPortal](BarraDoPortal.md), porque fica sobre o conteúdo de trabalho. "Sair" volta para `/entrar`; o card #10 troca por uma ação que encerra a sessão.

## SeletorDeLoja

"Trocar loja", só quando o associado tem duas lojas ou mais. É um `<details>` nativo: abre pelo teclado e funciona sem JavaScript. A lista abre num cartão branco com `shadow-flutuante`, um link por loja; a atual leva `aria-current="page"` e o visto.

- Fica na faixa petróleo: o "Trocar loja" é `primary` (5,6:1 sobre o petróleo).
- Os links da lista usam `outline-primary-strong`: a `superficie-escura` poria o anel `primary` sobre o branco do cartão.

## SecaoDaLoja

O cartão de uma seção. O título é `h2` (`font-titulo`, tamanho `secao`), ao lado de "Atualizado em dd/mm/aaaa · N itens", com a data do arquivo mais recente no horário de Brasília.

- **Documentos:** uma lista de [ItemDeArquivo](#itemdearquivo).
- **Fotos:** a [GradeDeFotos](#gradedefotos), passada em `children`.
- **Vazia:** um [EmptyState](EmptyState.md) com `as="h3"` e o texto da seção, que diz o que vai aparecer ali ("O relatório da assessoria aparece aqui depois da visita da equipe.").

## ItemDeArquivo

Uma linha: o [ícone do tipo](ArquivoIcon.md) numa caixa `primary-light`, o nome inteiro (quebra a linha, nunca é cortado), o tipo com a data e a ação.

| Tipo               | Ação   | Botão                      |
| ------------------ | ------ | -------------------------- |
| PDF, foto e vídeo  | Abrir  | "Abrir" com `ChevronRight` |
| Planilha e o resto | Baixar | "Baixar" com `Download`    |

Abaixo de 640 px, o botão desce para a linha de baixo, alinhado com o nome: ao lado, ele espremeria um nome longo em quatro linhas.

O nome acessível do botão leva o nome do arquivo ("Abrir Assessoria GC - Jumauti Ltda (1).pdf"), porque há vários "Abrir" na tela. Sem `url` (na prévia), o link não baixa nada: sem essa trava, o navegador baixaria a própria página.

## GradeDeFotos

Miniaturas quadradas: 3 colunas no celular, 4 a partir de 640 px e 6 a partir de 1024 px.

- Mostra as 6 primeiras e "Ver todas (N)" quando há mais. O botão vira "Mostrar menos", a seta gira e ele marca `aria-expanded`.
- Cada miniatura é um botão: "Abrir foto WhatsApp Image… .jpeg, 3 de 16".
- A foto entra com `loading="lazy"`. Sem `url`, a miniatura é um bloco cinza com o ícone de foto.
- O vídeo é um bloco cinza com o `Play`, nunca um `<img>` com o arquivo do vídeo, que quebraria. O card #12 pode trazer a miniatura que o Graph gera.
- Usa `<img>` e não `next/image`: as fotos vêm de uma rota protegida (card #12), e o otimizador do Next guardaria cópias de arquivos privados.

## Visualizador

As fotos e os vídeos de uma seção em tela cheia, um de cada vez. É um `<dialog>` nativo sobre `petroleo-950` sólido: com transparência, a página aparecia por trás da foto.

- **Em cima:** o nome do arquivo, a posição ("3 de 16") e "Fechar". O nome e a posição ficam numa região `aria-live`, anunciados a cada troca.
- **No meio:** a foto (`object-contain`) ou o vídeo (`<video controls>`).
- **Trocar:** os botões "Foto anterior" e "Próxima foto" (48 px; ao lado da foto no computador, embaixo no celular), as setas do teclado ou arrastar o dedo 50 px para o lado. No fim, volta ao começo.
- **Fechar:** o botão ou o Esc. O foco volta à miniatura que abriu.
- Com o foco no vídeo, as setas avançam e voltam o próprio vídeo, e não trocam de arquivo.
- Com o diálogo aberto, a página de trás não rola (`html:has(dialog[data-tela-cheia]:modal)` no `globals.css`; o diálogo pequeno de confirmação não trava, para a página não pular).

Não tem `"use client"` próprio: só a `GradeDeFotos`, que já é cliente, o usa.

## Prévia

Em `/previa`, no grupo "Tela da loja", com os arquivos do caso documentado (a Drogaria Jumalti, em [`src/app/previa/dados-de-exemplo.ts`](../../../src/app/previa/dados-de-exemplo.ts)):

- `loja`: uma loja só, sem seletor;
- `loja-varias-lojas` e `loja-farmacia-geral`: o mesmo associado com duas lojas; o seletor troca entre as duas;
- `loja-secao-vazia`: sem fotos de depois;
- `loja-erro`: o SharePoint fora do ar.
