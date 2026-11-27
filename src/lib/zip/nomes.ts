// Nomes de arquivo que abrem em qualquer sistema (Windows é o mais chato).

const TAMANHO_MAXIMO = 150;
const PROIBIDOS = /[<>:"/\\|?*\u0000-\u001f\u007f]/g;
const RESERVADOS = /^(con|prn|aux|nul|com[1-9]|lpt[1-9])$/i;

/** Separa "foto.final.jpg" em ["foto.final", ".jpg"]; sem extensão, o 2º é "". */
function separarExtensao(nome: string): [string, string] {
  const ponto = nome.lastIndexOf(".");
  if (ponto <= 0 || nome.length - ponto > 12) return [nome, ""];
  return [nome.slice(0, ponto), nome.slice(ponto)];
}

/** Os primeiros `n` code points: nunca corta um emoji ao meio. */
function cortar(texto: string, n: number): string {
  return Array.from(texto).slice(0, Math.max(n, 0)).join("");
}

/**
 * Deixa o nome seguro para o zip: NFC, sem caracteres proibidos, sem ponto ou
 * espaço no fim, sem nome reservado do Windows (CON, NUL, COM1...) e com no
 * máximo ~150 caracteres, guardando a extensão.
 */
export function nomeSeguro(nome: string): string {
  // toWellFormed troca surrogate solto por U+FFFD: sem isso, o nome não
  // codifica em UTF-8 nem em URL.
  let limpo = nome
    .toWellFormed()
    .normalize("NFC")
    .replace(PROIBIDOS, "_")
    .replace(/[. ]+$/, "");
  if (limpo === "" || limpo === "." || limpo === "..") return "arquivo";

  // No Windows, "CON.txt" também é reservado: vale o que vem antes do 1º ponto.
  if (RESERVADOS.test(limpo.split(".")[0].trim())) limpo = `_${limpo}`;

  if (Array.from(limpo).length > TAMANHO_MAXIMO) {
    const [base, extensao] = separarExtensao(limpo);
    limpo =
      cortar(base, TAMANHO_MAXIMO - Array.from(extensao).length) + extensao;
    limpo = limpo.replace(/[. ]+$/, "") || "arquivo";
  }
  return limpo;
}

function chaveDoNome(nome: string): string {
  return nome.normalize("NFC").toLowerCase();
}

/** Repetidos (sem olhar caixa nem NFC/NFD) viram "foto (2).jpg", "foto (3).jpg". */
export function nomesUnicos(nomes: string[]): string[] {
  const usados = new Set(nomes.map(chaveDoNome));
  const vistos = new Set<string>();
  return nomes.map((nome) => {
    if (!vistos.has(chaveDoNome(nome))) {
      vistos.add(chaveDoNome(nome));
      return nome;
    }
    const [base, extensao] = separarExtensao(nome);
    for (let n = 2; ; n++) {
      const candidato = `${base} (${n})${extensao}`;
      const chave = chaveDoNome(candidato);
      if (!vistos.has(chave) && !usados.has(chave)) {
        vistos.add(chave);
        return candidato;
      }
    }
  });
}

/**
 * "<loja> - <seção>.zip", ou "<loja>.zip" para a loja inteira. Recebe o nome
 * cru da loja: `nomeDaLoja()` troca o espaço antes do traço por um que não
 * quebra, e isso não deve ir para o nome do arquivo.
 */
export function nomeDoZip(loja: string, secao?: string): string {
  const base = nomeSeguro(loja);
  return secao === undefined
    ? `${base}.zip`
    : `${base} - ${nomeSeguro(secao)}.zip`;
}
