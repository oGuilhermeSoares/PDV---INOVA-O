# Tela da loja do associado (plano de implementação)

> **Para agentes:** SUB-SKILL OBRIGATÓRIA: use superpowers:subagent-driven-development (recomendado) ou superpowers:executing-plans para implementar este plano tarefa por tarefa. Os passos usam checkbox (`- [ ]`).

**Objetivo:** montar a tela que o associado vê depois de entrar, com as seções, a grade de fotos, o visualizador em tela cheia e os estados (várias lojas, seção vazia, erro), só no visual e na prévia.

**Arquitetura:**

- As regras de dados são funções puras em `src/lib/loja.ts`: da pasta do SharePoint para a seção, a ordem, as datas, a ação de cada arquivo e a posição no visualizador. O card #11 vai usar as mesmas funções.
- Os componentes ficam em `src/components/loja/`. Só são cliente a grade de fotos, o visualizador, o botão de envio e o de tentar de novo.
- Os dados de exemplo ficam em `src/app/previa/dados-de-exemplo.ts`, tirados do caso da Drogaria Jumalti na documentação.

**Tecnologia:** a mesma do plano de 25/11. Nenhuma dependência nova.

**Spec:** [2026-11-26-tela-da-loja-design.md](../specs/2026-11-26-tela-da-loja-design.md).

## Restrições globais

- Valem as do plano de 25/11: tokens, Lucide, 44 px, contraste, pt-BR e nenhum commit.
- Por dentro, não há decoração de painel (arcos e brilho), que é só da marca. A barra é sólida.
- Nome de arquivo nunca é cortado: ele quebra a linha (`wrap-anywhere`).
- Dados de exemplo só na prévia.

## Foco da revisão

1. **Nome de arquivo longo e sem espaço num celular de 320 px.** Ele quebra a linha, sem rolagem lateral. Conferência no navegador, na Tarefa 5.
2. **Visualizador pelo teclado.** Ao abrir, o foco entra; as setas andam e dão a volta; o Esc fecha e devolve o foco à miniatura. Os testes do índice ficam na Tarefa 1, e a conferência no navegador na Tarefa 5.
3. **Pasta com nome em outra caixa ou acento** ("fotos depois", "FOTOS ANTES") é a mesma seção, e a pasta "Interno" não aparece. Teste na Tarefa 1.
4. **Loja com uma seção vazia.** O cartão diz o que vai aparecer ali, sem quebrar a grade. Teste na Tarefa 4.
5. **Data no fuso errado:** um arquivo salvo às 23h de 28/10 aparece como 28/10, e não 29/10. A data é formatada em `America/Sao_Paulo`. Teste na Tarefa 1.

---

### Task 1 — Tarefa 1: Regras da loja

**Arquivos:** criar `src/lib/loja.ts` e `src/lib/loja.test.ts`.

**Interfaces (produz):**

```ts
export type ArquivoDaLoja = {
  id: string;
  nome: string;
  atualizadoEm: string;
  url?: string;
};
export type PastaDaLoja = { nome: string; arquivos: ArquivoDaLoja[] }; // nome "" = raiz da pasta da loja
export type SecaoDaLoja = {
  id: string;
  titulo: string;
  tipo: "documentos" | "fotos";
  vazia: string;
  arquivos: ArquivoDaLoja[];
};
export function montarSecoes(pastas: PastaDaLoja[]): SecaoDaLoja[];
export function ultimaAtualizacao(
  arquivos: ArquivoDaLoja[],
): string | undefined;
export function formatarData(iso: string): string; // "dd/mm/aaaa" em America/Sao_Paulo
export function acaoDoArquivo(tipo: TipoDeArquivo): "abrir" | "baixar";
export function indiceVizinho(
  indice: number,
  total: number,
  passo: 1 | -1,
): number; // dá a volta
export function posicao(indice: number, total: number): string; // "3 de 16"
```

**O que vira cada pasta** (a comparação ignora maiúsculas, acentos e espaços nas pontas):

| Pasta          | Seção                                       | Tipo       |
| -------------- | ------------------------------------------- | ---------- |
| a raiz (`""`)  | Relatórios                                  | documentos |
| `Estudos`      | Estudo de mercado                           | documentos |
| `Fotos antes`  | Fotos e vídeos: antes                       | fotos      |
| `Fotos depois` | Fotos e vídeos: depois                      | fotos      |
| `Interno`      | não aparece                                 | —          |
| qualquer outra | o próprio nome, no fim, em ordem alfabética | documentos |

**Textos do estado vazio:**

- Relatórios: "O relatório da assessoria aparece aqui depois da visita da equipe."
- Estudo de mercado: "Os estudos de mercado da sua loja aparecem aqui."
- Fotos e vídeos: antes: "As fotos e os vídeos de antes da assessoria aparecem aqui."
- Fotos e vídeos: depois: "As fotos e os vídeos de depois da assessoria aparecem aqui."
- Qualquer outra pasta: "Esta pasta ainda está vazia."

**Ação por tipo:** `pdf`, `imagem` e `video` abrem; `planilha` e `outro` baixam.

- [ ] **Passo 1: testes.**
  - **Ordem:** `montarSecoes` de `["Fotos Depois", "Outra", "", "Interno", "estudos", "FOTOS ANTES"]` dá a ordem Relatórios, Estudo de mercado, Fotos e vídeos: antes, Fotos e vídeos: depois, Outra, sem a "Interno".
  - **Uma pasta por seção:** "Fotos Depois" e "fotos depois" juntas viram uma seção só, com os arquivos das duas.
  - **Datas:**
    - `ultimaAtualizacao` dá a data mais recente, ou `undefined` sem arquivos;
    - `formatarData("2026-10-29T01:30:00Z")` dá `"28/10/2026"`, por causa do fuso.
  - **Ação:** `acaoDoArquivo` dá `abrir` para `pdf`, `video` e `imagem`, e `baixar` para `planilha` e `outro`.
  - **Visualizador:**
    - `indiceVizinho(15, 16, 1)` dá 0, `indiceVizinho(0, 16, -1)` dá 15 e `indiceVizinho(2, 16, 1)` dá 3;
    - `posicao(2, 16)` dá `"3 de 16"`.
- [ ] **Passo 2:** os testes falham. **Passo 3:** implemente. **Passo 4:** os testes passam.

### Task 2 — Tarefa 2: Barra, seletor e seção de arquivos

**Arquivos:** criar `src/components/loja/{BarraDaLoja,SeletorDeLoja,ItemDeArquivo,SecaoDaLoja}.tsx` e `src/components/loja/Loja.test.tsx`.

**Interfaces (produz):**

- **`BarraDaLoja()`:** `<header>` fixo no topo, `superficie-escura bg-petroleo-900`, com o logo na placa, "Portal PDV" e o link "Sair" para `/entrar` (o #10 troca por uma ação), com o ícone `LogOut`.
- **`SeletorDeLoja({ lojas: { id; nome; href }[]; atual: string })`:**
  - só aparece com duas lojas ou mais;
  - é um `<details>` com o `<summary>` "Trocar loja" e o `ChevronDown`;
  - mostra a lista de links das lojas, com `aria-current="page"` na atual e o visto (`Check`).
- **`ItemDeArquivo({ arquivo })`:** a linha do arquivo.
  - mostra o ícone do tipo, o nome (que quebra a linha) e a linha "PDF · 28/10/2026";
  - a ação é um link `buttonStyles({ variant: "secondary", size: "sm" })`: "Abrir", com `ChevronRight`, ou "Baixar", com `Download` e o atributo `download`;
  - o `aria-label` é "Abrir <nome>" ou "Baixar <nome>".
- **`SecaoDaLoja({ secao, children? })`:** o cartão da seção, com o `h2` em `font-titulo text-secao`, a linha "Atualizado em dd/mm/aaaa" e a quantidade de itens.
  - Sem arquivos, mostra um `EmptyState` com `as="h3"` e o texto `secao.vazia`.
  - Nas seções de documentos, a lista é de `ItemDeArquivo`; nas de fotos, o conteúdo vem em `children` (a grade).

- [ ] **Passo 1: testes.**
  - **Seletor:** com uma loja, o HTML fica vazio; com duas, aparecem os dois links e `aria-current="page"` na atual.
  - **Item:** num PDF, aparecem "Abrir" e o `aria-label` "Abrir Assessoria…"; numa planilha, "Baixar" e o atributo `download`.
  - **Seção:** a vazia mostra o texto `vazia`; a cheia mostra "Atualizado em 28/10/2026" e "1 item" (e "4 itens" no plural).
- [ ] **Passo 2:** os testes falham. **Passo 3:** implemente. **Passo 4:** os testes passam.

### Task 3 — Tarefa 3: Grade de fotos e visualizador

**Arquivos:** criar `src/components/loja/{GradeDeFotos,Visualizador}.tsx`. Os testes vão em `Loja.test.tsx`.

**Interfaces (produz):**

- **`GradeDeFotos({ arquivos })`**, cliente:
  - grade de 3 colunas, 4 a partir de `sm` e 6 a partir de `lg`;
  - mostra as 6 primeiras e o botão `ghost` "Ver todas (N)", que vira "Mostrar menos";
  - cada miniatura é um `<button>` com `aria-label` "Abrir <foto|vídeo> <nome>, <posicao>";
  - com `url`, mostra a imagem (`<img loading="lazy">`); sem `url`, mostra um bloco com ícone (`ImageIcon` ou `Play`);
  - o clique abre o `Visualizador` naquele índice.
- **`Visualizador({ arquivos, indice, aoMudar, aberto, aoFechar })`**, cliente:
  - `<dialog>` na tela inteira (`max-h-none max-w-none`), em `bg-petroleo-950/95`, com `superficie-escura`;
  - em cima, o nome do arquivo, a `posicao` e o botão "Fechar" (`X`, com `aria-label`);
  - no meio, a imagem, o `<video controls>` ou, sem `url`, o bloco grande com o ícone;
  - nos lados, "Foto anterior" e "Próxima foto", com 48 px e nome acessível;
  - setas do teclado; arrastar para o lado mais de 50 px troca a foto;
  - ao fechar, o `<dialog>` devolve o foco à miniatura.

- [ ] **Passo 1: testes.**
  - **Grade:** com 16 arquivos, o HTML tem 6 botões de miniatura e "Ver todas (16)"; com 3, não tem "Ver todas".
  - **Visualizador:** o HTML tem os botões "Foto anterior", "Próxima foto" e "Fechar" e o texto "1 de 16".
- [ ] **Passo 2:** os testes falham. **Passo 3:** implemente. **Passo 4:** os testes passam.

### Task 4 — Tarefa 4: Tela da loja e prévia

**Arquivos:**

- Criar `src/components/loja/{TelaDaLoja,BotoesDaLoja}.tsx` e `src/app/previa/dados-de-exemplo.ts`.
- Modificar `src/app/previa/telas.tsx` e `src/app/previa/page.tsx`.

**Interfaces (produz):**

- **`BotaoEnviar()`**, cliente: botão principal "Enviar fotos e vídeos" com `Upload`. Por enquanto chama `avisar("O envio de fotos e vídeos pelo portal chega na próxima etapa.", "info")`, e o #20 troca pela tela de envio.
- **`BotaoTentarDeNovo()`**, cliente: botão `secondary` "Tentar de novo", que recarrega a página com `router.refresh()`.
- **`TelaDaLoja({ loja: { id; nome }, lojas: { id; nome; href }[], secoes: SecaoDaLoja[], erro?: boolean })`:**
  - monta a `BarraDaLoja`;
  - no `<main>` (`max-w-5xl`): a linha "Sua loja", o `h1` com o nome, o `SeletorDeLoja` e o `BotaoEnviar`;
  - com `erro`, um `Aviso` de erro ("Não deu para carregar o material agora. Tente de novo em alguns minutos.") e o `BotaoTentarDeNovo`; sem erro, cada seção (documentos com a lista, fotos com a `GradeDeFotos`);
  - no pé, "Setor de PDV · Farmácias Associadas".
- **Dados de exemplo:**
  - a Drogaria Jumalti, com os arquivos da seção 7 da documentação: o relatório na raiz; os 4 BRICK em Estudos; o `Vídeo.mp4` e 15 fotos do WhatsApp em Fotos antes; e "Medicamentos 1.jpeg", "Medicamentos 2.mp4" e "Medicamentos.jpeg" em Fotos Depois;
  - a Farmácia Geral, com Estudos e as pastas de fotos vazias.
- **Prévia:** entra o grupo "Loja" em `TELAS`:
  - `loja`;
  - `loja-varias-lojas`, cujo seletor leva a `/previa/loja-varias-lojas` e `/previa/loja-farmacia-geral`;
  - `loja-farmacia-geral`;
  - `loja-secao-vazia` (a Jumalti sem fotos de depois);
  - `loja-erro`.
- **`/previa`:** ganha a seção "Tela da loja".

- [ ] **Passo 1: testes.**
  - **`TelaDaLoja`:**
    - com uma loja: o `h1` é o nome da loja, as seções aparecem na ordem (Relatórios antes de Estudo de mercado, antes de Fotos e vídeos: antes) e não há `<details`;
    - com `erro`: aparece o texto do aviso e não aparece "Relatórios".
- [ ] **Passo 2:** os testes falham. **Passo 3:** implemente. **Passo 4:** os testes passam, com a suíte inteira, o lint e o typecheck.

### Task 5 — Tarefa 5: Guia e conferência

- [ ] **Passo 1: guia.** Escreva `docs/design-system/componentes/TelaDaLoja.md`, que cobre os componentes de `src/components/loja/`, e ponha o link no README do design system.
- [ ] **Passo 2: gates.** Prettier, os quatro gates e o validador de tokens.
- [ ] **Passo 3: navegador.** No Chrome sem janela, em 5 larguras, abra `/previa/loja`, `/previa/loja-varias-lojas`, `/previa/loja-secao-vazia` e `/previa/loja-erro`, e confira:
  - não há rolagem lateral;
  - o clique numa miniatura abre o visualizador em "1 de 16";
  - a seta para a direita muda para "2 de 16";
  - o Esc fecha e devolve o foco à miniatura;
  - o "Ver todas" mostra as 16;
  - o console está limpo.

  Tire fotos e olhe cada uma.
