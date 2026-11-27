// A regra do que cabe num .zip, num lugar só: o servidor (`prepararZip`)
// recusa o que não cabe, e a tela não mostra o botão "Baixar tudo" nesse caso.
// Sem `server-only`: a tela também importa este módulo.

/**
 * Teto do zip, somando o tamanho dos arquivos. O zip é gerado em streaming,
 * então a memória não é o problema: o limite é o tempo da função. No plano
 * Hobby da Vercel a função vive no máximo 300 s; no Pro, até 800 s. Com ~500 MB
 * e uma conexão razoável com o SharePoint sobra folga nos 300 s. É um chute
 * educado: calibrar medindo o download real na Vercel e subir se o plano Pro
 * for adotado.
 */
export const LIMITE_DO_ZIP_BYTES = 500 * 1024 * 1024;

/** Mais entradas que isso gastam tempo em aberturas, mesmo com poucos bytes. */
export const LIMITE_DE_ENTRADAS_DO_ZIP = 5000;

/** O que dizer no lugar do botão quando os arquivos não cabem num zip. */
export const AVISO_GRANDE_DEMAIS =
  "Grande demais para um .zip. Baixe os arquivos um por um.";

export type LimitesDoZip = { bytes?: number; entradas?: number };

/**
 * Cabe num zip? Não cabe se passa do teto de bytes, se passa do limite de
 * entradas ou se algum arquivo não informa o tamanho (sem ele, o teto poderia
 * ser contornado).
 */
export function cabeNoZip(
  arquivos: { tamanho?: number }[],
  limites: LimitesDoZip = {},
): boolean {
  if (arquivos.length > (limites.entradas ?? LIMITE_DE_ENTRADAS_DO_ZIP)) {
    return false;
  }
  let soma = 0;
  for (const { tamanho } of arquivos) {
    if (tamanho === undefined || !Number.isFinite(tamanho) || tamanho < 0) {
      return false;
    }
    soma += tamanho;
  }
  return soma <= (limites.bytes ?? LIMITE_DO_ZIP_BYTES);
}
