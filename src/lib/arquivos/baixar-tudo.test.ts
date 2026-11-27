import { describe, expect, test, vi } from "vitest";

import {
  LIMITE_DE_ENTRADAS_DO_ZIP,
  LIMITE_DO_ZIP_BYTES,
  prepararZip,
  type DependenciasDoZip,
  type ErroDaFonte,
  type FonteDeArquivos,
  type ResultadoDoZip,
} from "@/lib/arquivos/baixar-tudo";
import type { PastaDaLoja } from "@/lib/loja";
import {
  criarChecagemEmMemoria,
  criarFonteDeArquivosEmMemoria,
} from "@/testes/em-memoria";
import { lerTudo, lerZip } from "@/testes/ler-zip";

const texto = new TextEncoder();
const DATA = "2026-10-28T12:00:00Z";

const arquivo = (
  id: string,
  nome: string,
  tamanho: number | undefined = 10,
) => ({
  id,
  nome,
  atualizadoEm: DATA,
  tamanho,
});

const PASTAS: PastaDaLoja[] = [
  { nome: "Fotos Depois", arquivos: [arquivo("d1", "foto.jpg")] },
  { nome: "Interno", arquivos: [arquivo("i1", "rascunho.txt")] },
  {
    nome: "",
    arquivos: [arquivo("r1", "Relatório.pdf"), arquivo("r2", "relatório.PDF")],
  },
  { nome: "Fotos antes", arquivos: [] },
];

const CONTEUDOS = {
  d1: texto.encode("foto"),
  i1: texto.encode("segredo da equipe"),
  r1: texto.encode("rel 1"),
  r2: texto.encode("rel 2"),
};

function montar(opcoes: { logado?: boolean; pastas?: PastaDaLoja[] } = {}) {
  const fonte = criarFonteDeArquivosEmMemoria({
    pastas: { "loja-1": opcoes.pastas ?? PASTAS },
    conteudos: CONTEUDOS,
  });
  const deps: DependenciasDoZip = {
    fonte,
    checagem: criarChecagemEmMemoria({
      logado: opcoes.logado ?? true,
      lojas: [{ id: "loja-1", nome: "Farmácia Brick - Salvador" }],
    }),
  };
  return { fonte, deps };
}

const requisicao = (sinal?: AbortSignal) =>
  new Request("http://localhost/arquivos/lojas/loja-1/zip", { signal: sinal });

async function ok(resultado: ResultadoDoZip) {
  if (resultado.tipo !== "ok")
    throw new Error(`esperava ok: ${resultado.tipo}`);
  return { nome: resultado.nome, ...lerZip(await lerTudo(resultado.corpo)) };
}

describe("prepararZip", () => {
  test("uma seção: arquivos na raiz do zip, nomes seguros e sem repetir", async () => {
    const { deps } = montar();

    const zip = await ok(
      await prepararZip(deps, requisicao(), "loja-1", "relatorios"),
    );

    expect(zip.nome).toBe("Farmácia Brick - Salvador - Relatórios.zip");
    expect(zip.entradas.map((e) => e.nome)).toEqual([
      "Relatório.pdf",
      "relatório (2).PDF",
    ]);
  });

  test("loja inteira: uma subpasta por seção, na ordem das seções, sem Interno", async () => {
    const { deps, fonte } = montar();

    const zip = await ok(await prepararZip(deps, requisicao(), "loja-1", null));

    expect(zip.nome).toBe("Farmácia Brick - Salvador.zip");
    expect(zip.entradas.map((e) => e.nome)).toEqual([
      "Relatórios/Relatório.pdf",
      "Relatórios/relatório (2).PDF",
      "Fotos depois/foto.jpg",
    ]);
    expect(fonte.abertos).not.toContain("i1");
  });

  test("a pasta Interno nunca é baixada, nem pelo id que ela teria", async () => {
    const { deps, fonte } = montar();

    for (const id of ["interno", "pasta-interno"]) {
      expect(await prepararZip(deps, requisicao(), "loja-1", id)).toEqual({
        tipo: "nao-encontrado",
      });
    }
    expect(fonte.abertos).toEqual([]);
  });

  test("só abre os itens da seção pedida", async () => {
    const { deps, fonte } = montar();

    await ok(await prepararZip(deps, requisicao(), "loja-1", "depois"));

    expect(fonte.abertos).toEqual(["d1"]);
  });

  test("sem sessão", async () => {
    const { deps } = montar({ logado: false });

    expect(await prepararZip(deps, requisicao(), "loja-1", null)).toEqual({
      tipo: "sem-sessao",
    });
  });

  test("loja de outro usuário é como loja que não existe", async () => {
    const { deps, fonte } = montar();

    expect(await prepararZip(deps, requisicao(), "loja-2", null)).toEqual({
      tipo: "nao-encontrado",
    });
    expect(fonte.abertos).toEqual([]);
  });

  test("seção que não existe", async () => {
    const { deps } = montar();

    expect(
      await prepararZip(deps, requisicao(), "loja-1", "pasta-xyz"),
    ).toEqual({ tipo: "nao-encontrado" });
  });

  test("seção sem arquivos e loja sem nenhum arquivo são vazias", async () => {
    const { deps } = montar({
      pastas: [
        { nome: "Fotos antes", arquivos: [] },
        { nome: "Interno", arquivos: [arquivo("i1", "x.txt")] },
      ],
    });

    expect(await prepararZip(deps, requisicao(), "loja-1", "antes")).toEqual({
      tipo: "vazio",
    });
    expect(await prepararZip(deps, requisicao(), "loja-1", null)).toEqual({
      tipo: "vazio",
    });
  });

  test("acima do teto, pelo tamanho dos arquivos: grande demais, sem abrir nada", async () => {
    const { deps, fonte } = montar({
      pastas: [
        {
          nome: "Fotos depois",
          arquivos: [
            arquivo("d1", "a.mp4", LIMITE_DO_ZIP_BYTES),
            arquivo("d2", "b.mp4", 1),
          ],
        },
      ],
    });

    expect(await prepararZip(deps, requisicao(), "loja-1", null)).toEqual({
      tipo: "grande-demais",
      limiteBytes: LIMITE_DO_ZIP_BYTES,
    });
    expect(fonte.abertos).toEqual([]);
  });

  test("arquivo sem tamanho é recusado, e não contado como zero", async () => {
    const { deps, fonte } = montar({
      pastas: [
        {
          nome: "Fotos depois",
          arquivos: [
            arquivo("d1", "a.mp4", 10),
            { ...arquivo("d2", "b.mp4"), tamanho: undefined },
          ],
        },
      ],
    });

    expect(await prepararZip(deps, requisicao(), "loja-1", "depois")).toEqual({
      tipo: "grande-demais",
      limiteBytes: LIMITE_DO_ZIP_BYTES,
    });
    expect(fonte.abertos).toEqual([]);
  });

  test("mais de 5.000 entradas é recusado", async () => {
    const muitos = Array.from(
      { length: LIMITE_DE_ENTRADAS_DO_ZIP + 1 },
      (_, i) => arquivo(`x${i}`, `foto ${i}.jpg`, 1),
    );
    const { deps } = montar({
      pastas: [{ nome: "Fotos depois", arquivos: muitos }],
    });

    expect(await prepararZip(deps, requisicao(), "loja-1", "depois")).toEqual({
      tipo: "grande-demais",
      limiteBytes: LIMITE_DO_ZIP_BYTES,
    });
  });

  test("defesa extra: se o arquivo for maior que o tamanho declarado, o zip aborta", async () => {
    const { deps } = montar({
      pastas: [
        {
          nome: "Fotos depois",
          arquivos: [arquivo("d1", "mentiroso.jpg", 5)],
        },
      ],
    });
    const nomes: string[] = [];
    // Teto de 100 bytes (+10% de folga); o arquivo de verdade tem 1 KB.
    deps.fonte = {
      ...deps.fonte,
      abrirConteudo: async () =>
        new ReadableStream<Uint8Array>({
          start(c) {
            c.enqueue(new Uint8Array(1024));
            c.close();
          },
        }),
    };

    const resultado = await prepararZip(
      deps,
      requisicao(),
      "loja-1",
      "depois",
      { limiteBytes: 100, aoFalhar: (n) => nomes.push(n) },
    );
    if (resultado.tipo !== "ok") throw new Error("esperava ok");

    await expect(lerTudo(resultado.corpo)).rejects.toThrow(
      "falha ao gerar o zip",
    );
    expect(nomes).toEqual(["LimiteDoZip"]);
  });
});

describe("prepararZip: nova tentativa", () => {
  const erro = (status?: number, tentarDeNovoEmMs?: number): ErroDaFonte =>
    Object.assign(new Error("falha"), { status, tentarDeNovoEmMs });

  function fonteQueFalha(falhas: ErroDaFonte[]) {
    const { deps, fonte } = montar();
    let chamadas = 0;
    const instavel: FonteDeArquivos = {
      listarPastasDaLoja: fonte.listarPastasDaLoja,
      abrirConteudo: async (itemId, sinal) => {
        const falha = falhas[chamadas++];
        if (falha) throw falha;
        return fonte.abrirConteudo(itemId, sinal);
      },
    };
    return { deps: { ...deps, fonte: instavel }, chamadas: () => chamadas };
  }

  test.each([
    ["429", erro(429)],
    ["503", erro(503)],
    ["falha de rede, sem status", erro()],
  ])("repete uma vez em erro transitório (%s)", async (_nome, falha) => {
    const { deps, chamadas } = fonteQueFalha([falha]);
    const esperar = vi.fn(async () => {});
    const tentativas: string[] = [];

    const zip = await ok(
      await prepararZip(deps, requisicao(), "loja-1", "depois", {
        esperar,
        aoTentarDeNovo: (n) => tentativas.push(n),
      }),
    );

    expect(chamadas()).toBe(2);
    expect(esperar).toHaveBeenCalledWith(500, expect.anything());
    expect(tentativas).toEqual(["Error"]);
    expect(zip.entradas.map((e) => e.nome)).toEqual(["foto.jpg"]);
  });

  test.each([400, 401, 403, 404])(
    "não repete em %i, que é definitivo",
    async (status) => {
      const { deps, chamadas } = fonteQueFalha([erro(status)]);
      const esperar = vi.fn(async () => {});

      const resultado = await prepararZip(
        deps,
        requisicao(),
        "loja-1",
        "depois",
        { esperar },
      );
      if (resultado.tipo !== "ok") throw new Error("esperava ok");

      await expect(lerTudo(resultado.corpo)).rejects.toThrow(
        "falha ao gerar o zip",
      );
      expect(chamadas()).toBe(1);
      expect(esperar).not.toHaveBeenCalled();
    },
  );

  test("espera o que o Retry-After pediu, no máximo 2 s", async () => {
    for (const [pedido, esperado] of [
      [1200, 1200],
      [60_000, 2000],
    ]) {
      const { deps } = fonteQueFalha([erro(429, pedido)]);
      const esperar = vi.fn(async () => {});

      await ok(
        await prepararZip(deps, requisicao(), "loja-1", "depois", { esperar }),
      );

      expect(esperar).toHaveBeenCalledWith(esperado, expect.anything());
    }
  });

  test("se a segunda abertura também falhar, o stream dá erro", async () => {
    const { deps, chamadas } = fonteQueFalha([erro(503), erro(503)]);

    const resultado = await prepararZip(
      deps,
      requisicao(),
      "loja-1",
      "depois",
      { esperar: async () => {} },
    );
    if (resultado.tipo !== "ok") throw new Error("esperava ok");

    await expect(lerTudo(resultado.corpo)).rejects.toThrow(
      "falha ao gerar o zip",
    );
    expect(chamadas()).toBe(2);
  });

  test("cancelar a requisição aborta o zip", async () => {
    const { deps } = montar();
    const controle = new AbortController();
    const resultado = await prepararZip(
      deps,
      requisicao(controle.signal),
      "loja-1",
      null,
    );
    if (resultado.tipo !== "ok") throw new Error("esperava ok");
    const leitor = resultado.corpo.getReader();
    await leitor.read();

    controle.abort();

    await expect(leitor.read()).rejects.toBeDefined();
  });
});
