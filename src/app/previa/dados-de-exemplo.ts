import { montarSecoes, type ArquivoDaLoja, type PastaDaLoja } from "@/lib/loja";

// O caso documentado (documentação do projeto, seção 7): os nomes dos
// arquivos são os da pasta da Drogaria Jumalti no SharePoint. Só a prévia usa
// estes dados; sem `url`, as miniaturas e o visualizador mostram o bloco.

export const JUMALTI = {
  id: "jumalti",
  nome: "Drogaria Jumalti - Caxias do Sul",
};
export const FARMACIA_GERAL = { id: "farmacia-geral", nome: "Farmácia Geral" };

function arquivos(nomes: string[], atualizadoEm: string): ArquivoDaLoja[] {
  return nomes.map((nome) => ({ id: nome, nome, atualizadoEm }));
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

function pastasDaJumalti(semFotosDeDepois: boolean): PastaDaLoja[] {
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
      arquivos: arquivos(
        ["Vídeo.mp4", ...fotosDoWhatsApp()],
        "2026-08-10T09:44:00-03:00",
      ),
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

export function secoesDaJumalti({ semFotosDeDepois = false } = {}) {
  return montarSecoes(pastasDaJumalti(semFotosDeDepois));
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
