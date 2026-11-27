# Card #17: baixar tudo em .zip, por seção ou por loja

## O que foi feito

- **Rota:** `GET /arquivos/lojas/[lojaId]/zip`, com `?secao=<id>` opcional. Sem `secao`, baixa a loja inteira, com uma subpasta por seção. A lógica fica em `src/lib/arquivos/rota-do-zip.ts`; o `route.ts` só liga as dependências e declara `maxDuration = 300`.
- **Status:** 200 (zip), 400 (formato de `secao` inválido), 401 (sem sessão), 404 (loja de outro usuário, seção inexistente, vazia ou a pasta Interno), 413 (não cabe num zip), 500 (nome do arquivo impossível de montar), 502 (falha ao ler a pasta) e 503 (dependências ainda não configuradas).
- **Gerador:** `src/lib/zip/zip-store.ts`, ZIP sem compressão (STORE), em streaming com Web Streams, sem dependência nova. Abre um arquivo por vez, com contrapressão (`pull`), CRC incremental com `node:zlib`, bit 3 (data descriptor) e bit 11 (UTF-8). A data de cada arquivo é gravada no horário de Brasília, seja qual for o fuso do servidor.
- **ZIP64:** por arquivo e por zip, só quando necessário. Por arquivo (4 GiB ou mais) é inalcançável com o teto atual de 500 MB; fica pronto para quando o teto subir (Pro da Vercel).
- **Falhas:** se um arquivo falha no meio, o stream dá erro com a mensagem genérica "falha ao gerar o zip" (sem URL nem nome de arquivo) e o fim do zip não é escrito: o download chega truncado em vez de parecer completo. O log leva só o nome do erro, o id da loja e a seção.
- **Regra de "cabe num zip":** `cabeNoZip` em `src/lib/arquivos/limite-do-zip.ts`, usada pelo servidor (`prepararZip`) e pela tela. Não cabe se a soma passa de 500 MB (`LIMITE_DO_ZIP_BYTES`), se há mais de 5.000 arquivos ou se algum arquivo não informa o `tamanho`. O servidor responde 413; a tela esconde o "Baixar tudo" e mostra "Grande demais para um .zip. Baixe os arquivos um por um.". O gerador ainda conta os bytes lidos e aborta se passarem do teto com 10% de folga (o tamanho vem do SharePoint e pode estar errado).
- **Nova tentativa:** só ao abrir um arquivo, e só para erro transitório (429, 5xx ou falha de rede sem `status`), uma vez, esperando `min(tentarDeNovoEmMs ?? 500, 2000)` ms. 4xx definitivo não repete. O tipo `ErroDaFonte` (`status?`, `tentarDeNovoEmMs?`) é o contrato com o card #4.
- **Nomes:** `src/lib/zip/nomes.ts` (nomes seguros para o Windows, cortados por code point, sem surrogate solto, sem repetição) e `src/lib/zip/cabecalhos.ts` (`Content-Disposition` com acento, calculado logo depois de `prepararZip`; se falhar, a rota cancela o stream e responde 500).
- **Regra de negócio:** `src/lib/arquivos/baixar-tudo.ts` (`server-only`). O navegador manda só o id da loja e o da seção. O servidor lista a pasta da loja do usuário, passa por `montarSecoes` (que tira a pasta Interno) e baixa só os arquivos da seção. Nenhum `itemId` vem do navegador.
- **Validação de `secao`:** só o formato (`formatoDeIdDeSecaoValido`, em `src/lib/loja.ts`, que reaproveita os ids das seções conhecidas). Quem decide se a seção existe é a busca em `montarSecoes`, que responde 404. `?secao=interno` dá 404, não 400.
- **Portas:** `FonteDeArquivos` (SharePoint, card #4) e `ChecagemDeAcesso` (sessão e permissão, cards #10 e #12). Os dublês em memória ficam em `src/testes/em-memoria.ts`, fora do código de produção.
- **Tela:** `TelaDaLoja` e `SecaoDaLoja` ganharam `zipHref` (veja o [guia da TelaDaLoja](../design-system/componentes/TelaDaLoja.md)), e a prévia ganhou `loja-vazia` e `loja-grande-demais`.
- **Testes:** `src/testes/ler-zip.ts` é um verificador de zip rigoroso (EOCD/EOCD64 e localizador, diretório central, contiguidade, nome local x central, CRC e tamanhos zerados no local, largura do descriptor pelo extra ZIP64 local, data DOS). Os zips gerados também passam por `unzip -t` e `tar -tf` (bsdtar) quando a ferramenta existe; sem ela, o teste é pulado de forma explícita.

## O que fica bloqueado

- **Critério 2 (só o que o usuário pode ver):** a checagem real depende dos cards #10 e #12. Hoje `criarChecagemDeAcesso` lança "não configurado" e a rota responde 503.
- **Critério 1 de ponta a ponta:** depende do card #4 (`criarFonteDeArquivos`). Depois dele, falta o teste manual: abrir o zip no Explorador do Windows e no 7-Zip, com um vídeo grande, já publicado na Vercel.

## Decisões e limitações aceitas

- **Erros em `<a download>`:** o botão é um link com `download`. Se a rota responde 401, 413 ou 503, o navegador mostra só "Falha no download", sem a mensagem em pt-BR. Aceito até o card #12; por isso a tela já esconde o botão quando o zip não cabe.
- **Interno:** hoje a pasta é escondida por lista negra (`ESCONDIDAS` em `loja.ts`). Uma lista branca (só as pastas conhecidas e as combinadas) seria mais segura, mas muda a regra de seções; fica como pendência.

## Pendências e decisões em aberto

1. **Nome da seção no zip.** Hoje: Relatórios, Estudo de mercado, Fotos antes, Fotos depois (outras pastas usam o título). Está em `CONHECIDAS`, em `src/lib/loja.ts`, campo `nomeNoZip`.
2. **Nome do zip da loja inteira.** Hoje `"<loja>.zip"`; por seção, `"<loja> - <seção>.zip"`.
3. **O que é `lojaId`** e qual o formato: id interno do portal (banco) ou id da pasta no SharePoint? A rota trata como texto opaco (até 200 caracteres); a porta de acesso decide.
4. **Hobby ou Pro, e o limite.** O teto de 500 MB assume o Hobby (300 s). No Pro (800 s) dá para subir; calibrar medindo na Vercel.
5. **Prioridade do card.** A documentação sugere rever, já que hoje ninguém recebe um zip com tudo.
6. **Concorrência e rate limit por usuário (#10/#12).** Hoje nada impede vários downloads de 500 MB ao mesmo tempo pelo mesmo usuário.
7. **Requisitos para o card #4:** nunca pôr URL ou token em mensagens de erro (elas podem ir para o log) e preencher sempre o `tamanho` dos arquivos; sem ele, a loja inteira deixa de ter "Baixar tudo".
8. **Teste manual** no Explorador do Windows e no 7-Zip, na Vercel.
9. **`npm audit`:** há avisos pré-existentes nas dependências do Prisma (effect), que não vêm deste card.

## Plano B1 (para depois)

Se o zip em uma requisição só não aguentar (limite de tempo ou arquivos muito grandes), o plano B1 é baixar em sequência, um arquivo por vez, pelas rotas protegidas do card #12, com a tela disparando um download por arquivo. Não tem limite de tempo total, mas perde o "um arquivo só".
