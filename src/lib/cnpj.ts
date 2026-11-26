// CNPJ da loja, no formato antigo (só números) e no alfanumérico que a Receita
// emite desde julho de 2026: 12 caracteres de letras e números mais 2 dígitos
// verificadores. O cálculo é o mesmo módulo 11 de sempre; a diferença é que o
// valor de cada caractere passa a ser o código ASCII menos 48 (A = 17).

export type MotivoCnpjInvalido =
  "vazio" | "tamanho" | "caractere" | "digito" | "repetido";

export type ResultadoCnpj =
  | { valido: true; cnpj: string }
  | { valido: false; motivo: MotivoCnpjInvalido };

const TAMANHO = 14;
const PESOS_DV1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
const PESOS_DV2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
const FORMATO = /^[0-9A-Z]{12}[0-9]{2}$/;

/** Tira espaços, ".", "/" e "-" e passa as letras para maiúsculas. */
export function normalizarCnpj(valor: string): string {
  return valor.replace(/[\s./-]/g, "").toUpperCase();
}

function digitoVerificador(base: string, pesos: number[]): number {
  const soma = pesos.reduce(
    (total, peso, i) => total + (base.charCodeAt(i) - 48) * peso,
    0,
  );
  const resto = soma % 11;
  return resto < 2 ? 0 : 11 - resto;
}

export function validarCnpj(valor: string): ResultadoCnpj {
  const cnpj = normalizarCnpj(valor);

  if (cnpj === "") return { valido: false, motivo: "vazio" };
  if (cnpj.length !== TAMANHO) return { valido: false, motivo: "tamanho" };
  if (!FORMATO.test(cnpj)) return { valido: false, motivo: "caractere" };
  if (/^(.)\1+$/.test(cnpj)) return { valido: false, motivo: "repetido" };

  const dv1 = digitoVerificador(cnpj.slice(0, 12), PESOS_DV1);
  const dv2 = digitoVerificador(cnpj.slice(0, 12) + dv1, PESOS_DV2);
  if (cnpj.slice(12) !== `${dv1}${dv2}`) {
    return { valido: false, motivo: "digito" };
  }

  return { valido: true, cnpj };
}

/** "12ABC34501DE35" vira "12.ABC.345/01DE-35". Recebe o CNPJ já normalizado. */
export function formatarCnpj(cnpj: string): string {
  return `${cnpj.slice(0, 2)}.${cnpj.slice(2, 5)}.${cnpj.slice(5, 8)}/${cnpj.slice(8, 12)}-${cnpj.slice(12)}`;
}
