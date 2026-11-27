import type { TipoDeArquivo } from "@/components/ui/ArquivoIcon";

// Regras da tela da loja do associado, sem depender do SharePoint: o card #11
// lê as pastas pelo Graph e passa por aqui. A ordem e os nomes seguem a
// documentação do projeto (seção 7, revisada em 18/11).

export type ArquivoDaLoja = {
  id: string;
  nome: string;
  /** Data e hora ISO da última alteração no SharePoint. */
  atualizadoEm: string;
  /** Rota protegida do arquivo (card #12). Sem ela, a tela mostra o bloco. */
  url?: string;
  /** Tamanho em bytes, quando o Graph informa. Serve ao limite do zip (#17). */
  tamanho?: number;
};

/** Uma pasta da loja no SharePoint. `nome` vazio é a raiz da pasta da loja. */
export type PastaDaLoja = { nome: string; arquivos: ArquivoDaLoja[] };

export type SecaoDaLoja = {
  id: string;
  titulo: string;
  tipo: "documentos" | "fotos";
  /** O que dizer quando a seção não tem arquivos. */
  vazia: string;
  /** Nome curto da pasta dentro do .zip (card #17). Sem ele, vale o título. */
  nomeNoZip?: string;
  arquivos: ArquivoDaLoja[];
};

type Regra = Omit<SecaoDaLoja, "arquivos"> & { ordem: number };

const CONHECIDAS: Record<string, Regra> = {
  "": {
    id: "relatorios",
    titulo: "Relatórios",
    nomeNoZip: "Relatórios",
    tipo: "documentos",
    vazia: "O relatório da assessoria aparece aqui depois da visita da equipe.",
    ordem: 0,
  },
  estudos: {
    id: "estudo",
    titulo: "Estudo de mercado",
    nomeNoZip: "Estudo de mercado",
    tipo: "documentos",
    vazia: "Os estudos de mercado da sua loja aparecem aqui.",
    ordem: 1,
  },
  "fotos antes": {
    id: "antes",
    titulo: "Fotos e vídeos: antes",
    nomeNoZip: "Fotos antes",
    tipo: "fotos",
    vazia: "As fotos e os vídeos de antes da assessoria aparecem aqui.",
    ordem: 2,
  },
  "fotos depois": {
    id: "depois",
    titulo: "Fotos e vídeos: depois",
    nomeNoZip: "Fotos depois",
    tipo: "fotos",
    vazia: "As fotos e os vídeos de depois da assessoria aparecem aqui.",
    ordem: 3,
  },
};

// Rascunhos da equipe (proposta da documentação, seção 7): nunca aparecem.
const ESCONDIDAS = new Set(["interno"]);

/** Os ids das seções que sempre existem, para validar o que vem na URL. */
export const IDS_DAS_SECOES_CONHECIDAS: readonly string[] = Object.values(
  CONHECIDAS,
).map((regra) => regra.id);

/**
 * O id de seção tem um formato aceitável? É só o formato: se a seção existe
 * ou não, quem decide é a busca em `montarSecoes`. "interno" passa de
 * propósito, para a pasta escondida dar 404 e não 400.
 */
export function formatoDeIdDeSecaoValido(id: string): boolean {
  return (
    id.length <= 300 &&
    (IDS_DAS_SECOES_CONHECIDAS.includes(id) ||
      ESCONDIDAS.has(id) ||
      /^pasta-[a-z0-9-]+$/.test(id))
  );
}

/** Sem maiúsculas, acentos nem espaços nas pontas: "Fotos Depois" = "fotos depois". */
function chave(nome: string): string {
  return nome
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .trim()
    .toLowerCase();
}

/** As seções da loja, na ordem da documentação; outras pastas no fim. */
export function montarSecoes(pastas: PastaDaLoja[]): SecaoDaLoja[] {
  const porChave = new Map<string, Regra & { arquivos: ArquivoDaLoja[] }>();

  for (const pasta of pastas) {
    const k = chave(pasta.nome);
    if (ESCONDIDAS.has(k)) continue;
    const regra: Regra = CONHECIDAS[k] ?? {
      id: `pasta-${k.replace(/[^a-z0-9]+/g, "-")}`,
      titulo: pasta.nome.trim(),
      nomeNoZip: pasta.nome.trim(),
      tipo: "documentos",
      vazia: "Esta pasta ainda está vazia.",
      ordem: 10,
    };
    const atual = porChave.get(k);
    if (atual) atual.arquivos.push(...pasta.arquivos);
    else porChave.set(k, { ...regra, arquivos: [...pasta.arquivos] });
  }

  return [...porChave.values()]
    .sort(
      (a, b) => a.ordem - b.ordem || a.titulo.localeCompare(b.titulo, "pt-BR"),
    )
    .map(({ id, titulo, nomeNoZip, tipo, vazia, arquivos }) => ({
      id,
      titulo,
      nomeNoZip,
      tipo,
      vazia,
      arquivos,
    }));
}

/** A data mais recente entre os arquivos, ou nada se não houver arquivo. */
export function ultimaAtualizacao(
  arquivos: ArquivoDaLoja[],
): string | undefined {
  return arquivos.reduce<string | undefined>(
    (maior, { atualizadoEm }) =>
      !maior || Date.parse(atualizadoEm) > Date.parse(maior)
        ? atualizadoEm
        : maior,
    undefined,
  );
}

const DATA = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  timeZone: "America/Sao_Paulo",
});

/** "dd/mm/aaaa" no horário de Brasília, onde a equipe trabalha. */
export function formatarData(iso: string): string {
  return DATA.format(new Date(iso));
}

/** PDF, foto e vídeo abrem no navegador; planilha e o resto são baixados. */
export function acaoDoArquivo(tipo: TipoDeArquivo): "abrir" | "baixar" {
  return tipo === "pdf" || tipo === "imagem" || tipo === "video"
    ? "abrir"
    : "baixar";
}

/** O índice ao lado, dando a volta no fim e no começo da galeria. */
export function indiceVizinho(
  indice: number,
  total: number,
  passo: 1 | -1,
): number {
  return (indice + passo + total) % total;
}

/** "3 de 16": a posição contada a partir de 1. */
export function posicao(indice: number, total: number): string {
  return `${indice + 1} de ${total}`;
}

/**
 * O nome da loja para mostrar. As pastas seguem "Loja - Cidade"; o espaço
 * antes do traço não quebra, para a linha nunca começar com "- Cidade".
 */
export function nomeDaLoja(nome: string): string {
  return nome.replaceAll(" - ", "\u00a0- ");
}
