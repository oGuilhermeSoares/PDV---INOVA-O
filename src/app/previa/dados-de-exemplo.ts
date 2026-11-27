import { motivoDaRecusa, type ArquivoNaFila } from "@/lib/envio";
import { montarSecoes, type ArquivoDaLoja, type PastaDaLoja } from "@/lib/loja";

// O caso documentado (documentação do projeto, seção 7): os nomes dos
// arquivos são os da pasta da Drogaria Jumalti no SharePoint. Só a prévia usa
// estes dados; sem `url`, as miniaturas e o visualizador mostram o bloco.

export const JUMALTI = {
  id: "jumalti",
  nome: "Drogaria Jumalti - Caxias do Sul",
};
export const FARMACIA_GERAL = { id: "farmacia-geral", nome: "Farmácia Geral" };

/**
 * O "Baixar tudo" da prévia aponta para a rota de .zip do portal: a loja
 * inteira sem `secaoId`; uma seção com ele.
 */
export function zipDaPrevia(lojaId: string) {
  return (secaoId?: string) => {
    const base = `/arquivos/lojas/${encodeURIComponent(lojaId)}/zip`;
    return secaoId ? `${base}?secao=${encodeURIComponent(secaoId)}` : base;
  };
}

function arquivos(
  nomes: string[],
  atualizadoEm: string,
  tamanho = 2_000_000,
): ArquivoDaLoja[] {
  return nomes.map((nome) => ({ id: nome, nome, atualizadoEm, tamanho }));
}

/** 15 fotos do WhatsApp de 10/08, a partir das 09:41:58 da documentação. */
function fotosDoWhatsApp(): string[] {
  const inicio = 9 * 3600 + 41 * 60 + 58;
  return Array.from({ length: 15 }, (_, i) => {
    const segundos = inicio + i * 7;
    const hora = [
      Math.floor(segundos / 3600),
      Math.floor(segundos / 60) % 60,
      segundos % 60,
    ]
      .map((parte) => String(parte).padStart(2, "0"))
      .join(".");
    return `WhatsApp Image 2026-08-10 at ${hora}.jpeg`;
  });
}

const BRICK_DA_FARMACIA_GERAL = [
  "BRICK 2004 - Farmacia Geral Ltda - MAT04_2026.pdf",
  "BRICK 2004 - PRODUTOS FARM GERAL - MAT04_2026.xlsx",
];

function pastasDaJumalti(
  semFotosDeDepois: boolean,
  videoGrande: boolean,
): PastaDaLoja[] {
  return [
    {
      nome: "",
      arquivos: arquivos(
        ["Assessoria GC - Jumauti Ltda (1).pdf"],
        "2026-10-28T10:15:00-03:00",
      ),
    },
    {
      nome: "Estudos",
      arquivos: arquivos(
        [
          "BRICK 2004 - Drogaria Jumauti Ltda - MAT04_2026.pdf",
          BRICK_DA_FARMACIA_GERAL[0],
          BRICK_DA_FARMACIA_GERAL[1],
          "BRICK 2004 - PRODUTOS JUMAUTI - MAT04_2026.xlsx",
        ],
        "2026-10-14T16:40:00-03:00",
      ),
    },
    {
      nome: "Fotos antes",
      arquivos: [
        ...arquivos(
          ["Vídeo.mp4"],
          "2026-08-10T09:44:00-03:00",
          // 600 MB passa do teto de 500 MB do .zip.
          videoGrande ? 600 * 1024 * 1024 : undefined,
        ),
        ...arquivos(fotosDoWhatsApp(), "2026-08-10T09:44:00-03:00"),
      ],
    },
    {
      nome: "Fotos Depois",
      arquivos: semFotosDeDepois
        ? []
        : arquivos(
            ["Medicamentos 1.jpeg", "Medicamentos 2.mp4", "Medicamentos.jpeg"],
            "2026-10-28T09:20:00-03:00",
          ),
    },
  ];
}

export function secoesDaJumalti({
  semFotosDeDepois = false,
  videoGrande = false,
} = {}) {
  return montarSecoes(pastasDaJumalti(semFotosDeDepois, videoGrande));
}

// A tela de envio: nomes como o celular gera (iPhone e WhatsApp), só na
// prévia. Um vídeo passa de 1 GB e um PDF não é aceito.
export const ESCOLHIDOS_DE_EXEMPLO = [
  { nome: "IMG_2041.HEIC", tamanho: 4_200_000 },
  { nome: "IMG_2042.HEIC", tamanho: 3_900_000 },
  { nome: "WhatsApp Image 2026-11-26 at 10.12.03.jpeg", tamanho: 312_000 },
  { nome: "VID_0007.MOV", tamanho: 1_300_000_000 },
  { nome: "Planograma.pdf", tamanho: 820_000 },
  { nome: "VID_0008.MOV", tamanho: 86_000_000 },
];

/** Uma leva inteira: 12 fotos e 1 vídeo. */
export const LEVA_DE_EXEMPLO = [
  ...Array.from({ length: 12 }, (_, i) => ({
    nome: `IMG_${2041 + i}.HEIC`,
    tamanho: 3_000_000 + i * 130_000,
  })),
  { nome: "VID_0008.MOV", tamanho: 86_000_000 },
];

export type SituacaoDoExemplo =
  "pronto" | "enviado" | "falhou" | { progresso: number };

/** A fila da tela de envio; os recusados saem da regra, seja qual for o pedido. */
export function filaDeExemplo(
  arquivos: { nome: string; tamanho: number }[],
  situacao: (i: number) => SituacaoDoExemplo,
): ArquivoNaFila[] {
  return arquivos.map(({ nome, tamanho }, i) => {
    const base = { id: nome, chave: nome, nome, tamanho };
    const motivo = motivoDaRecusa(base);
    if (motivo) return { ...base, situacao: "recusado", motivo };
    const pedida = situacao(i);
    return typeof pedida === "string"
      ? { ...base, situacao: pedida }
      : { ...base, situacao: "enviando", progresso: pedida.progresso };
  });
}

/** Uma loja recém-liberada: todas as seções vazias, sem "Baixar tudo". */
export function secoesVazias() {
  return montarSecoes([
    { nome: "", arquivos: [] },
    { nome: "Estudos", arquivos: [] },
    { nome: "Fotos antes", arquivos: [] },
    { nome: "Fotos Depois", arquivos: [] },
  ]);
}

/** A segunda loja do mesmo associado: só o estudo, o resto ainda vazio. */
export function secoesDaFarmaciaGeral() {
  return montarSecoes([
    { nome: "", arquivos: [] },
    {
      nome: "Estudos",
      arquivos: arquivos(BRICK_DA_FARMACIA_GERAL, "2026-10-14T16:40:00-03:00"),
    },
    { nome: "Fotos antes", arquivos: [] },
    { nome: "Fotos Depois", arquivos: [] },
  ]);
}
