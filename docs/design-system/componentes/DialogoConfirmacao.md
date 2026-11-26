# DialogoConfirmacao

Confirmação de uma ação que não dá para desfazer, num `<dialog>` nativo. Substitui o `confirm()` do navegador. Fica em [`src/components/ui/DialogoConfirmacao.tsx`](../../../src/components/ui/DialogoConfirmacao.tsx).

**Quando usar:** antes de excluir, desativar ou recusar alguma coisa. O navegador prende o foco dentro do diálogo, fecha com Esc e devolve o foco ao botão que abriu. Clicar no fundo escurecido fecha sem confirmar.

**O que você passa:**

- `aberto` e `aoFechar` (chamado no Esc, no clique fora e ao fechar);
- `titulo`: a pergunta com o objeto, como "Excluir o arquivo Medicamentos 1.jpeg?";
- `descricao`: a consequência;
- os botões em `children`, com o verbo da ação. Primeiro vem o que mantém (`variant="secondary"`), que recebe o foco ao abrir, e depois o que confirma (`variant="danger-solid"`). Nunca "OK" e "Cancelar".

O componente é cliente: use-o dentro de outro componente cliente, que guarda o `aberto`.
