# Seções da página do associado

As seções que vêm depois do hero em `/entrar`, na ordem da página. Todas ficam em [`src/components/entrada/`](../../../src/components/entrada/) e são montadas pela [TelaDoAssociado](Telas.md). Nenhuma recebe props.

## SecaoOQueTem

"O que você encontra no portal" (`#o-que-tem`): três cartões brancos com mini-ilustração e a classe `revelar`.

- **Relatórios da assessoria:** "O relatório que a equipe de PDV faz depois de cada visita, em PDF. Abre no navegador."
- **Estudo de mercado:** "Os estudos BRICK da região da sua loja, em PDF e em planilha."
- **Fotos e vídeos:** "O antes e o depois da assessoria. E você manda fotos novas direto daqui, sem passar pelo WhatsApp."

As ilustrações são `aria-hidden`: o título e o texto do cartão dizem tudo.

## SecaoComoFunciona

"Da visita da equipe **até a sua tela.**" (`#como-funciona`): seção petróleo com a [decoração](#decoracaodopainel) e quatro passos numa lista ordenada. Cada passo tem um ícone num círculo, "Passo N", um título e um texto.

A linha que liga os passos (`desenhar-ao-rolar`, dentro do `.linha-do-tempo`) se desenha conforme a pessoa rola. É o movimento marcante da página:

- **Celular:** a linha desce pela esquerda, atrás dos ícones.
- **Computador:** a linha atravessa o centro dos ícones, de 12,5% a 87,5% da largura, com largura explícita (`w-3/4`), porque num `<svg>` absoluto `left` e `right` não esticam.
- **Tablet (duas colunas):** não há linha.
- O `path` usa `pathLength="1"` e não usa `vector-effect: non-scaling-stroke`. Com ele, o tracejado é medido em pixels da tela, e a linha sai em pedaços.

## PerguntasFrequentes

Acordeão (`#perguntas`) com as 7 perguntas de [`src/lib/perguntas.ts`](../../../src/lib/perguntas.ts). As respostas saem só do que está decidido na documentação do projeto; mude o arquivo junto com a regra, nunca antes.

Cada pergunta é um `<details>` nativo: abre pelo teclado (Tab e Enter), sem JavaScript, e o `+` gira para `×` ao abrir.

## ChamadaFinal

Cartão escuro, com `revelar`, no fim da página: "Pronto para ver o material da **sua loja?**" e o link "Entrar no portal", com a seta no círculo (`IconeNoCirculo`), que leva ao cartão (`#entrar`).

## RodapeDoPortal

O `<footer>` da página, em `petroleo-950`, com a mesma [decoração](#decoracaodopainel) do hero (arcos e brilho). Tem:

- a marca e o nome;
- "É da equipe de PDV? Entre com a conta Microsoft";
- "Setor de PDV · Farmácias Associadas".

Não tem marca d'água: o "Portal PDV" gigante ao fundo, como o do clinia, pesava e repetia o nome, e saiu a pedido do Guilherme (26/11). Não há links de privacidade nem de termos, porque essas páginas ainda não existem.

## MiniaturasDaLoja

As peças em miniatura da tela da loja, usadas pela [PreviaDaLoja](PreviaDaLoja.md) e pelas ilustrações dos cartões:

- `LinhaDeArquivo({ tipo, nome })`;
- `BlocoDeFoto({ video? })`;
- `PilulaDeEnvio()`;
- `BarraDeTexto({ className })`.

Elas mostram a estrutura de verdade da tela. O que seria dado da loja vira barra cinza ou bloco com ícone.

## DecoracaoDoPainel

Os arcos, os brilhos e a grade de pontos dos painéis petróleo (hero, "Como funciona" e chamada final). O pai precisa de `relative isolate overflow-clip`, nunca `overflow-hidden`: com `overflow-hidden`, o painel vira uma área de rolagem, e as animações ligadas à rolagem ficam paradas.
