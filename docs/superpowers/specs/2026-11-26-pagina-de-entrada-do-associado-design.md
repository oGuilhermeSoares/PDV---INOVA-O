# Página de entrada do associado (desenho)

**Data:** 26/11/2026 · **Branch:** `feat/design-system` · Complementa o [desenho de 25/11](2026-11-25-design-system-e-telas-de-entrada-design.md).

## Por que

O Guilherme quer a entrada atrativa para o cliente final, com o [clinia.io](https://clinia.io/) como referência e as funcionalidades dele aplicadas aqui. Ele escolheu transformar `/entrar` numa página de apresentação. O primeiro bloco continua sendo o login; abaixo dele, o associado vê o que tem no portal antes de entrar.

## Seria um fracasso, mesmo funcionando

- **Dado inventado:** logos de clientes, depoimentos, números ou datas falsas. Fica proibido também pelo plugin `frontend-design`.
- **Promessa errada:** um texto que promete o que o portal não vai fazer. As respostas saem só da [documentação do projeto](../../documentacao-do-projeto.md).
- **Contraste abaixo de 4,5:1.** A barra de vidro do clinia reprova quando passa sobre o fundo claro.
- **Login fora da primeira tela.** O login precisa aparecer logo, no celular e no computador.

**Fora do escopo:** blog, questionário, botão do WhatsApp, logos de clientes e depoimentos.

## Caminhos considerados

1. **CSS e HTML nativos (escolhido).** Acordeão com `<details>`, sem JavaScript. As animações ligadas à rolagem usam `animation-timeline: view()` dentro de `@supports`; o navegador que não suporta mostra tudo parado, sem prejuízo. Não entra nenhuma dependência nova.
2. **Biblioteca de animação** (Framer Motion, GSAP). Descartado: a spec proíbe dependência nova, e ela poria JavaScript e hidratação em todas as seções.
3. **`IntersectionObserver` em componentes cliente.** Funciona em todo navegador, mas exige JavaScript para algo que o CSS já resolve.

## A página `/entrar`, de cima para baixo

1. **Barra de vidro fixa,** como a do clinia.
   - Fica no topo, em pílula, com fundo `petroleo-900` a 75% e desfoque.
   - À esquerda, o logo e "Portal PDV".
   - No computador, os atalhos "O que tem no portal", "Como funciona" e "Perguntas", que levam às seções.
   - À direita, o botão "Entrar", que leva ao cartão.
   - No celular, só o logo e "Entrar".
2. **Hero escuro, na largura toda.** Ocupa a largura inteira, com arcos, brilho e grade de pontos.
   - À esquerda, o título "Tudo da sua loja, **num lugar só.**" e os selos.
   - À direita, o cartão do CNPJ (`id="entrar"`), com o link da equipe embaixo, sobre o escuro.
   - No celular, o cartão vem logo depois do título.
3. **Prévia da tela da loja.** É uma moldura que entra por cima da borda do hero e sobe ao rolar, como a do clinia: navegador no computador, telefone no celular.
   - Mostra a estrutura de verdade da tela da loja: "Sua loja", o botão "Enviar fotos e vídeos", "Relatórios", "Estudo de mercado" e "Fotos e vídeos: antes e depois".
   - As linhas secundárias são barras cinzas, e as fotos são blocos com ícone. Nada de nome, data ou foto inventados.
   - Tem `role="img"` e uma descrição para o leitor de tela.
4. **O que você encontra** (`#o-que-tem`). Três cartões com mini-ilustração, como os do clinia:
   - **Relatórios da assessoria:** "O relatório que a equipe de PDV faz depois de cada visita, em PDF. Abre no navegador."
   - **Estudo de mercado:** "Os estudos BRICK da região da sua loja, em PDF e em planilha."
   - **Fotos e vídeos:** "O antes e o depois da assessoria. E você manda fotos novas direto daqui, sem passar pelo WhatsApp."
5. **Como funciona** (`#como-funciona`). Seção escura, com o selo "Como funciona" e o título "Da visita da equipe **até a sua tela.**" São quatro passos ligados por uma linha:
   1. "A equipe visita a loja": "e salva o relatório, o estudo e as fotos na pasta da sua loja."
   2. "Você recebe um e-mail": "com o link do portal, sem anexo."
   3. "Você entra com o CNPJ": "e um código de 6 números que chega no seu e-mail. Sem senha."
   4. "E manda fotos de volta": "Fotos e vídeos vão direto para a equipe, na qualidade original."
6. **Perguntas frequentes** (`#perguntas`). Acordeão com o `+` que gira para `×` ao abrir.

   | Pergunta                                            | Resposta                                                                                                                                                                        |
   | --------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | Como eu entro no portal?                            | Com o CNPJ de uma das suas lojas. Mandamos um código de 6 números para o e-mail cadastrado na Farmácias Associadas, e ele vale por 10 minutos. Não tem senha.                   |
   | Não recebi o código. O que eu faço?                 | Confira a caixa de spam e se o e-mail que aparece na tela é o seu. Depois de alguns segundos, dá para pedir outro código. Se o e-mail estiver errado, fale com a equipe de PDV. |
   | Tenho mais de uma loja. Preciso entrar em cada uma? | Não. Entrando com o CNPJ de qualquer uma delas, você vê todas as lojas do seu grupo.                                                                                            |
   | Preciso entrar toda vez?                            | Não. Depois de entrar, o portal lembra de você por 30 dias naquele aparelho. Para sair antes, toque em Sair.                                                                    |
   | Os arquivos abrem no celular?                       | Sim. PDFs e vídeos abrem no navegador, e as planilhas são baixadas.                                                                                                             |
   | Como envio fotos e vídeos?                          | Toque em Enviar fotos e vídeos. No celular, isso abre a galeria ou a câmera. Os arquivos vão direto para a pasta da loja, na qualidade original, e a equipe de PDV é avisada.   |
   | Quem vê o material da minha loja?                   | Só você e a equipe de PDV. Cada associado vê apenas as próprias lojas.                                                                                                          |

7. **Chamada final e rodapé.**
   - Chamada num cartão escuro: "Pronto para ver o material da **sua loja?**" e o botão "Entrar no portal", que leva ao cartão.
   - O rodapé tem a decoração dos painéis (arcos e brilho), a linha "Setor de PDV · Farmácias Associadas" e o link "É da equipe de PDV? Entre com a conta Microsoft". A marca d'água "Portal PDV" que estava aqui saiu: o Guilherme achou que pesava (26/11).

**O movimento marcante:** a linha de "Como funciona" se desenha conforme a pessoa rola, ligando a visita da equipe à tela do associado. Quem pede menos movimento, ou usa um navegador sem suporte, vê a linha já desenhada.

## `/admin/entrar`

A tela usa o mesmo hero escuro, na largura toda e na altura da tela. A barra mostra só o logo, sem atalhos, e não há seções embaixo.

## Componentes

- **Novos:**
  - `BarraDoPortal`;
  - `PreviaDaLoja`;
  - `SecaoOQueTem`;
  - `SecaoComoFunciona`;
  - `PerguntasFrequentes`, com os textos em `src/lib/perguntas.ts`;
  - `ChamadaFinal`;
  - `RodapeDoPortal`.
- **Mudam:**
  - `MolduraDeEntrada` vira o hero escuro, na largura toda;
  - `TelaDoAssociado` passa a montar a página inteira;
  - `TelaDaEquipe` passa a usar o hero na altura da tela.
- **A prévia `/previa`** continua com todos os estados. Cada estado do associado mostra a página inteira.

## Testes

- **Perguntas:**
  - há 7 `<details>` com os textos da tabela;
  - as respostas citam "10 minutos" e "30 dias".
- **Atalhos:**
  - os atalhos da barra apontam para seções que existem na página (`#entrar`, `#o-que-tem`, `#como-funciona` e `#perguntas`);
  - o "Entrar" aponta para o cartão.
- **Como funciona:** os passos estão numa lista ordenada, com 4 itens.
- **Prévia da tela da loja:** tem `role="img"` e uma descrição.
- **Contraste:** o branco sobre a barra de vidro passando no branco (o `petroleo-900` a 75% sobre `white`) tem pelo menos 4,5:1.
- **Navegador:** os quatro gates e a conferência no Chrome sem janela, em 5 larguras: sem rolagem lateral, com os atalhos levando às seções sem esconder o título atrás da barra, o acordeão abrindo pelo teclado e o console limpo.

## Decisões minhas

- **A barra usa 75% de opacidade,** e não os 50% do clinia: com 50%, o texto branco reprova sobre o fundo claro.
- **Os selos ficam no hero,** sem um parágrafo a mais.
- **Sem marca d'água no rodapé.** A primeira versão tinha o texto "Portal PDV" gigante ao fundo; saiu a pedido do Guilherme, e no lugar entrou a decoração dos painéis.
- **O rodapé não tem links de privacidade nem de termos,** porque essas páginas ainda não existem.
- **O tamanho é médio:** uma página com sete blocos e uns oito componentes.
