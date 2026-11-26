// Código de acesso que o associado recebe no e-mail (card #10).

export const TAMANHO_DO_CODIGO = 6;

/**
 * Só os algarismos, cortados no tamanho do código. Quem cola "123-456" ou
 * "123 456" do e-mail fica com "123456".
 *
 * Fica fora do componente para o servidor também poder usar.
 */
export function limparCodigo(valor: string, tamanho = TAMANHO_DO_CODIGO) {
  return valor.replace(/\D/g, "").slice(0, tamanho);
}
