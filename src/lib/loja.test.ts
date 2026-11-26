import { describe, expect, test } from "vitest";

import {
  acaoDoArquivo,
  formatarData,
  indiceVizinho,
  montarSecoes,
  nomeDaLoja,
  posicao,
  ultimaAtualizacao,
  type PastaDaLoja,
} from "@/lib/loja";

const arquivo = (id: string, atualizadoEm = "2026-10-28T12:00:00Z") => ({
  id,
  nome: `${id}.jpeg`,
  atualizadoEm,
});

describe("montarSecoes", () => {
  test("segue a ordem da documentação e esconde a pasta Interno", () => {
    const pastas: PastaDaLoja[] = [
      "Fotos Depois",
      "Outra",
      "",
      "Interno",
      "estudos",
      "FOTOS ANTES",
    ].map((nome) => ({ nome, arquivos: [arquivo(nome || "raiz")] }));

    expect(montarSecoes(pastas).map((s) => s.titulo)).toEqual([
      "Relatórios",
      "Estudo de mercado",
      "Fotos e vídeos: antes",
      "Fotos e vídeos: depois",
      "Outra",
    ]);
  });

  test("a mesma pasta com outra caixa ou acento vira uma seção só", () => {
    const secoes = montarSecoes([
      { nome: "Fotos Depois", arquivos: [arquivo("a")] },
      { nome: " fotos depois ", arquivos: [arquivo("b")] },
    ]);
    expect(secoes).toHaveLength(1);
    expect(secoes[0].arquivos.map((a) => a.id)).toEqual(["a", "b"]);
    expect(secoes[0].tipo).toBe("fotos");
  });

  test("cada seção traz o texto do estado vazio", () => {
    const [relatorios] = montarSecoes([{ nome: "", arquivos: [] }]);
    expect(relatorios.vazia).toBe(
      "O relatório da assessoria aparece aqui depois da visita da equipe.",
    );
  });
});

describe("datas", () => {
  test("a última atualização é a do arquivo mais recente", () => {
    expect(
      ultimaAtualizacao([
        arquivo("a", "2026-10-01T10:00:00Z"),
        arquivo("b", "2026-10-28T10:00:00Z"),
      ]),
    ).toBe("2026-10-28T10:00:00Z");
    expect(ultimaAtualizacao([])).toBeUndefined();
  });

  test("a data sai no horário de Brasília (23h30 de 28/10 é 28/10)", () => {
    expect(formatarData("2026-10-29T02:30:00Z")).toBe("28/10/2026");
  });
});

describe("acaoDoArquivo", () => {
  test.each([
    ["pdf", "abrir"],
    ["video", "abrir"],
    ["imagem", "abrir"],
    ["planilha", "baixar"],
    ["outro", "baixar"],
  ] as const)("%s → %s", (tipo, acao) => {
    expect(acaoDoArquivo(tipo)).toBe(acao);
  });
});

describe("visualizador", () => {
  test("as setas dão a volta no fim e no começo", () => {
    expect(indiceVizinho(15, 16, 1)).toBe(0);
    expect(indiceVizinho(0, 16, -1)).toBe(15);
    expect(indiceVizinho(2, 16, 1)).toBe(3);
  });

  test("a posição conta a partir de 1", () => {
    expect(posicao(2, 16)).toBe("3 de 16");
  });
});

describe("nomeDaLoja", () => {
  test("o traço de 'Loja - Cidade' nunca começa a linha", () => {
    expect(nomeDaLoja("Drogaria Jumalti - Caxias do Sul")).toBe(
      "Drogaria Jumalti\u00a0- Caxias do Sul",
    );
  });

  test("sem traço, o nome fica igual", () => {
    expect(nomeDaLoja("Farmácia Geral")).toBe("Farmácia Geral");
  });
});
