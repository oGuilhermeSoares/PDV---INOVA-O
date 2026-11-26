# Tela da loja do associado (desenho)

**Data:** 26/11/2026 · **Branch:** `feat/design-system` · Base: card [#11](https://github.com/oGuilhermeSoares/PDV---INOVA-O/issues/11) e a [documentação](../../documentacao-do-projeto.md), seções 6.2 e 7.

## Por que

O Guilherme quer ver como fica a tela que o associado vê depois de entrar. É a tela que substitui o zip no e-mail. Ele pediu os plugins de design ativos e deixou claro que o clinia era referência **só para o login**. Por dentro, o portal segue o próprio design system: claro, com conteúdo em primeiro lugar e acessível. O plugin `ui-ux-pro-max` recomenda o estilo "Accessible & Ethical" para portal B2B, que é o que o design system já faz.

## Escopo

**Dentro:**

- a tela da loja;
- o visualizador de fotos e vídeos em tela cheia;
- os estados: várias lojas, seção vazia e SharePoint fora do ar.

Tudo só no visual, na prévia (`/previa/loja…`), com dados de exemplo.

**Fora:**

- o login de verdade e a sessão (card #10);
- a leitura do SharePoint (cards #4 e #11);
- a rota protegida dos arquivos (#12);
- o "baixar tudo" (#17);
- a tela de envio de fotos (#20). O botão "Enviar fotos e vídeos" aparece, mas a tela dele é outro passo.

## Seria um fracasso, mesmo funcionando

- O associado precisar de mais de um toque para achar o relatório da última visita.
- A galeria só funcionar com o mouse ou só com o dedo: ela precisa de setas, do teclado e do arrasto.
- Dado de exemplo que pareça real fora da prévia. Os exemplos vêm do caso documentado (Drogaria Jumalti) e ficam só em `/previa`.
- Foto inventada. Sem arquivo de verdade, a miniatura é um bloco com ícone e o nome do arquivo.

## Uma divergência resolvida

O card #11 manda os arquivos soltos para "Documentos", na ordem fotos antes, fotos depois e estudos. A documentação, revisada em 18/11 depois da Camila, chama esses arquivos de **Relatórios** e põe a ordem **Relatórios, Estudo de mercado, Fotos e vídeos: antes, Fotos e vídeos: depois**. As outras subpastas vêm no fim, com o próprio nome. Sigo a documentação, que é a mais recente.

## Caminhos considerados

1. **Uma página só, com todas as seções (escolhido).** É o esboço da seção 6.2: tudo numa rolagem, com "Ver todas" nas fotos e o visualizador por cima. O relatório fica a um toque.
2. **Abas por seção.** Mostra menos de cada vez e exige um toque a mais para trocar; o associado não vê de uma vez o que chegou.
3. **Menu lateral no computador.** É pesado demais para quatro seções e não funciona no celular sem virar outra coisa.

## A tela, de cima para baixo

```
[logo] Portal PDV                          Sair    ← barra petróleo, fixa
Drogaria Jumalti - Caxias do Sul  [Trocar loja ▾]  ← h1; o seletor só aparece com 2+ lojas
[ Enviar fotos e vídeos ]                          ← botão principal
Relatórios · atualizado em 28/10/2026
  [PDF] Assessoria GC - Jumauti Ltda (1).pdf     Abrir ›
Estudo de mercado · atualizado em 14/10/2026
  [PDF]  BRICK 2004 - Drogaria Jumauti Ltda…     Abrir ›
  [XLSX] BRICK 2004 - PRODUTOS JUMAUTI…          Baixar
Fotos e vídeos: antes · 16 itens
  ▢ ▢ ▢ ▢ ▢ ▢                      Ver todas (16) ›
Fotos e vídeos: depois · 3 itens
  ▢ ▢ ▢
```

- **Barra:** sólida, em `petroleo-900`, sem vidro, porque é uma tela de trabalho. Tem o logo, "Portal PDV" e "Sair" (`ghost`, com `LogOut`).
- **Topo:** o `h1` é o nome da loja. Com duas lojas ou mais, um seletor "Trocar loja" lista as lojas do grupo; com uma só, ele não aparece.
- **Botão principal:** "Enviar fotos e vídeos", com o ícone `Upload`. É o único botão principal da tela.
- **Seções:** cada uma é um cartão com o título (`h2`, estilo `secao`) e a data da última atualização (`dd/mm/aaaa`).
- **Arquivos:** viram linhas com o ícone do tipo, o nome (que quebra a linha, nunca é cortado) e a ação certa: "Abrir" para PDF e vídeo, "Baixar" para planilha. No computador, as linhas também mostram o tipo e a data.
- **Fotos e vídeos:**
  - grade de miniaturas (3 colunas no celular e 6 no computador), com o ícone `Play` nos vídeos;
  - "Ver todas (N)" mostra a grade inteira na mesma página;
  - cada miniatura é um botão que abre o visualizador naquela foto.
- **Vazios:**
  - seção vazia: `EmptyState` curto ("A equipe ainda não salvou fotos de depois desta loja.");
  - SharePoint fora do ar: `Aviso` de erro ("Não deu para carregar o material agora. Tente de novo em alguns minutos.") e o botão "Tentar de novo".

## O visualizador

- `<dialog>` nativo, em tela cheia, sobre fundo petróleo quase opaco.
- Mostra a foto ou o vídeo (`<video controls>`), o nome do arquivo e "3 de 16".
- Botões "Anterior" e "Próxima" com 44 px e nome acessível, e "Fechar".
- No teclado: setas e Esc. No celular: arrastar para o lado troca a foto, e os botões continuam lá.
- Ao fechar, o foco volta à miniatura que abriu.
- Com menos movimento, a troca de foto não anima.

## Componentes novos (em `src/components/loja/`)

- `BarraDaLoja`;
- `SeletorDeLoja`;
- `SecaoDeArquivos`;
- `LinhaDeArquivo`, com a ação certa por tipo;
- `GradeDeFotos`;
- `Visualizador`, componente cliente;
- `TelaDaLoja({ loja, lojas, secoes, erro? })`.

O formato dos dados (`Loja`, `SecaoDaLoja`, `ArquivoDaLoja`) fica em `src/lib/loja.ts`. O card #11 vai preencher esse formato a partir do SharePoint.

## Prévia

- `/previa/loja`: o caso da Jumalti;
- `/previa/loja-varias-lojas`;
- `/previa/loja-secao-vazia`;
- `/previa/loja-erro`.

O visualizador abre clicando numa foto.

## Testes

- **Ordem das seções:** relatórios, estudo, antes, depois e outras no fim. É uma função pura, a mesma que o #11 vai usar.
- **Ação por tipo:** PDF e vídeo abrem; planilha baixa.
- **Seletor:** só aparece com duas lojas ou mais.
- **Visualizador:** "3 de 16"; as setas andam e dão a volta no fim; os botões têm nome acessível.
- **Grade:** mostra 6 miniaturas e "Ver todas (16)"; ao expandir, mostra as 16.
- **Navegador:** os gates, o Chrome sem janela em 5 larguras (sem rolagem lateral), o teclado na galeria e o console limpo.

## Decisões minhas

- A barra de dentro é sólida, não de vidro: é tela de trabalho.
- A ordem e os nomes das seções seguem a documentação de 18/11, e não o card #11.
- Os nomes de arquivo quebram a linha, para o associado ler o nome inteiro.
- "Ver todas" expande na mesma página, sem rota nova.
- O tamanho é médio: uma tela, um visualizador e três estados.
