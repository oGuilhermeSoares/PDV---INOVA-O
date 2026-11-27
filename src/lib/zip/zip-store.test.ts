import { spawnSync } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, test } from "vitest";

import { lerTudo, lerZip } from "@/testes/ler-zip";
import { criarZip, dataDos, type EntradaDoZip } from "@/lib/zip/zip-store";

const texto = new TextEncoder();

function fonteDeBytes(...partes: Uint8Array[]): ReadableStream<Uint8Array> {
  let i = 0;
  return new ReadableStream<Uint8Array>(
    {
      pull(c) {
        if (i < partes.length) c.enqueue(partes[i++]);
        else c.close();
      },
    },
    { highWaterMark: 0 },
  );
}

const entradaDeTexto = (
  nome: string,
  conteudo: string,
  extra: Partial<EntradaDoZip> = {},
): EntradaDoZip => ({
  nome,
  abrir: async () => fonteDeBytes(texto.encode(conteudo)),
  ...extra,
});

describe("criarZip", () => {
  test("gera um zip válido com nomes em UTF-8 e CRC conferido", async () => {
    const zip = await lerTudo(
      criarZip([
        entradaDeTexto("Relatórios/laudo.txt", "olá, mundo"),
        entradaDeTexto("vazio.txt", ""),
      ]),
    );
    const { entradas, usouEocd64 } = lerZip(zip);

    expect(usouEocd64).toBe(false);
    expect(entradas.map((e) => e.nome)).toEqual([
      "Relatórios/laudo.txt",
      "vazio.txt",
    ]);
    expect(new TextDecoder().decode(entradas[0].dados)).toBe("olá, mundo");
    expect(entradas[1].dados.length).toBe(0);
    expect(entradas.every((e) => (e.flags & 0x0800) !== 0)).toBe(true);
  });

  test("zero arquivos gera um zip vazio válido", async () => {
    const zip = await lerTudo(criarZip([]));

    expect(zip.length).toBe(22);
    expect(lerZip(zip).entradas).toEqual([]);
  });

  test("um vídeo de dezenas de MB passa por pull, com memória limitada", async () => {
    const PEDACO = 64 * 1024;
    const TOTAL = 48 * 1024 * 1024;
    const pedaco = new Uint8Array(PEDACO).fill(7);
    let produzidos = 0;
    let consumidos = 0;
    let maiorFolga = 0;

    const video = new ReadableStream<Uint8Array>(
      {
        pull(c) {
          if (produzidos * PEDACO >= TOTAL) return c.close();
          produzidos++;
          maiorFolga = Math.max(maiorFolga, produzidos - consumidos);
          c.enqueue(pedaco);
        },
      },
      { highWaterMark: 0 },
    );

    const zip = criarZip([{ nome: "video.mp4", abrir: async () => video }]);
    const leitor = zip.getReader();
    const partes: Uint8Array[] = [];
    for (;;) {
      const { done, value } = await leitor.read();
      if (done) break;
      partes.push(value);
      consumidos++;
    }

    expect(maiorFolga).toBeLessThanOrEqual(4);
    const { entradas } = lerZip(Buffer.concat(partes));
    expect(entradas[0].dados.length).toBe(TOTAL);
  });

  test("só abre o arquivo na vez dele", async () => {
    const abertos: string[] = [];
    const entrada = (nome: string): EntradaDoZip => ({
      nome,
      abrir: async () => {
        abertos.push(nome);
        return fonteDeBytes(texto.encode(nome));
      },
    });
    const leitor = criarZip([entrada("a"), entrada("b")]).getReader();

    await leitor.read(); // cabeçalho de "a"
    expect(abertos).toEqual(["a"]);
    for (;;) {
      const { done } = await leitor.read();
      if (done) break;
    }
    expect(abertos).toEqual(["a", "b"]);
  });

  test("falha no meio dá erro no stream e nunca escreve o fim do zip", async () => {
    const quebrada = new ReadableStream<Uint8Array>({
      pull(c) {
        c.error(new Error("Graph caiu"));
      },
    });
    const zip = criarZip([
      entradaDeTexto("a.txt", "ok"),
      { nome: "b.txt", abrir: async () => quebrada },
      entradaDeTexto("c.txt", "nunca"),
    ]);
    const leitor = zip.getReader();
    const recebidos: Uint8Array[] = [];

    await expect(
      (async () => {
        for (;;) {
          const { done, value } = await leitor.read();
          if (done) return;
          recebidos.push(value);
        }
      })(),
    ).rejects.toThrow("falha ao gerar o zip");

    const tudo = Buffer.concat(recebidos);
    expect(tudo.includes(Buffer.from([0x50, 0x4b, 0x05, 0x06]))).toBe(false);
    expect(tudo.includes(Buffer.from("nunca"))).toBe(false);
  });

  test("falha ao abrir um arquivo também dá erro no stream", async () => {
    const zip = criarZip([
      {
        nome: "a.txt",
        abrir: async () => {
          throw new Error("sem acesso");
        },
      },
    ]);

    await expect(lerTudo(zip)).rejects.toThrow("falha ao gerar o zip");
  });

  test("cancelar aborta o sinal da fonte e não abre a próxima", async () => {
    let sinalDaFonte: AbortSignal | undefined;
    let abriuSegunda = false;
    const infinita = new ReadableStream<Uint8Array>(
      { pull: (c) => c.enqueue(new Uint8Array(1024)) },
      { highWaterMark: 0 },
    );
    const zip = criarZip([
      {
        nome: "a",
        abrir: async (sinal) => {
          sinalDaFonte = sinal;
          return infinita;
        },
      },
      {
        nome: "b",
        abrir: async () => {
          abriuSegunda = true;
          return fonteDeBytes();
        },
      },
    ]);
    const leitor = zip.getReader();
    await leitor.read();
    await leitor.read();

    await leitor.cancel();

    expect(sinalDaFonte?.aborted).toBe(true);
    expect(abriuSegunda).toBe(false);
  });

  test("o sinal externo aborta a fonte atual e dá erro no stream", async () => {
    const externo = new AbortController();
    let sinalDaFonte: AbortSignal | undefined;
    let abriuSegunda = false;
    const infinita = new ReadableStream<Uint8Array>(
      { pull: (c) => c.enqueue(new Uint8Array(1024)) },
      { highWaterMark: 0 },
    );
    const zip = criarZip(
      [
        {
          nome: "a",
          abrir: async (sinal) => {
            sinalDaFonte = sinal;
            return infinita;
          },
        },
        {
          nome: "b",
          abrir: async () => {
            abriuSegunda = true;
            return fonteDeBytes();
          },
        },
      ],
      externo.signal,
    );
    const leitor = zip.getReader();
    await leitor.read();

    externo.abort(new Error("cliente saiu"));

    await expect(leitor.read()).rejects.toThrow("cliente saiu");
    expect(sinalDaFonte?.aborted).toBe(true);
    expect(abriuSegunda).toBe(false);
  });

  test("ZIP64 com limiar baixo: por entrada, por deslocamento e no fim", async () => {
    const grande = new Uint8Array(150).fill(1);
    const pequeno = new Uint8Array(10).fill(2);
    const zip = await lerTudo(
      criarZip(
        [
          {
            nome: "grande.bin",
            tamanho: grande.length,
            abrir: async () => fonteDeBytes(grande),
          },
          {
            nome: "pequeno.bin",
            tamanho: pequeno.length,
            abrir: async () => fonteDeBytes(pequeno),
          },
        ],
        undefined,
        { limiteZip64: 100 },
      ),
    );
    const { entradas, usouEocd64 } = lerZip(zip);

    expect(usouEocd64).toBe(true);
    expect(entradas.map((e) => [e.nome, e.zip64, e.dados.length])).toEqual([
      ["grande.bin", true, 150],
      ["pequeno.bin", false, 10],
    ]);
  });

  test("passou do limite de 32 bits sem ser marcado: aborta o stream", async () => {
    const zip = criarZip(
      [
        {
          nome: "mentiu.bin",
          abrir: async () => fonteDeBytes(new Uint8Array(150)),
        },
      ],
      undefined,
      { limiteZip64: 100 },
    );

    await expect(lerTudo(zip)).rejects.toThrow("falha ao gerar o zip");
  });

  test("mais de 65535 entradas usa o fim ZIP64", async () => {
    const entradas: EntradaDoZip[] = Array.from({ length: 65536 }, (_, i) => ({
      nome: `${i}`,
      abrir: async () => fonteDeBytes(),
    }));

    const { entradas: lidas, usouEocd64 } = lerZip(
      await lerTudo(criarZip(entradas)),
    );

    expect(usouEocd64).toBe(true);
    expect(lidas).toHaveLength(65536);
  }, 30_000);

  test("falha no meio: o erro do stream é genérico e o callback recebe só o nome", async () => {
    const nomes: string[] = [];
    const erroDoGraph = Object.assign(
      new Error("GET https://graph.microsoft.com/x?token=segredo Foto.jpg"),
      { name: "ErroDoGraph" },
    );
    const zip = criarZip(
      [
        {
          nome: "Foto.jpg",
          abrir: async () => {
            throw erroDoGraph;
          },
        },
      ],
      undefined,
      { aoFalhar: (nome) => nomes.push(nome) },
    );

    const erro = await lerTudo(zip).catch((e: Error) => e);

    expect((erro as Error).message).toBe("falha ao gerar o zip");
    expect(nomes).toEqual(["ErroDoGraph"]);
  });

  test("limiteBytes: aborta se os bytes lidos passarem do limite", async () => {
    const zip = criarZip(
      [
        {
          nome: "a.bin",
          tamanho: 10,
          abrir: async () => fonteDeBytes(new Uint8Array(60)),
        },
        {
          nome: "b.bin",
          tamanho: 10,
          abrir: async () => fonteDeBytes(new Uint8Array(60)),
        },
      ],
      undefined,
      { limiteBytes: 100 },
    );

    await expect(lerTudo(zip)).rejects.toThrow("falha ao gerar o zip");
  });

  test("limiteBytes: dentro do limite passa", async () => {
    const zip = await lerTudo(
      criarZip(
        [
          {
            nome: "a.bin",
            abrir: async () => fonteDeBytes(new Uint8Array(60)),
          },
        ],
        undefined,
        { limiteBytes: 100 },
      ),
    );

    expect(lerZip(zip).entradas).toHaveLength(1);
  });

  test("ZIP64 por entrada com offset grande: o extra leva 3 valores", async () => {
    const pequeno = new Uint8Array(60).fill(3);
    const grande = new Uint8Array(150).fill(4);
    const { entradas } = lerZip(
      await lerTudo(
        criarZip(
          [
            {
              nome: "pequeno.bin",
              tamanho: pequeno.length,
              abrir: async () => fonteDeBytes(pequeno),
            },
            {
              nome: "grande.bin",
              tamanho: grande.length,
              abrir: async () => fonteDeBytes(grande),
            },
          ],
          undefined,
          { limiteZip64: 100 },
        ),
      ),
    );

    expect(entradas.map((e) => e.valoresZip64NoCentral)).toEqual([0, 3]);
    expect(entradas[1].zip64).toBe(true);
    expect(Buffer.from(entradas[1].dados).equals(Buffer.from(grande))).toBe(
      true,
    );
  });

  test("a data DOS usa o horário de Brasília, seja qual for o fuso do servidor", async () => {
    // 01:30 UTC de 27/11 são 22:30 de 26/11 em Brasília (UTC-3).
    const { hora, dia } = dataDos(new Date("2026-11-27T01:30:00Z"));

    expect(hora).toBe((22 << 11) | (30 << 5) | 0);
    expect(dia).toBe(((2026 - 1980) << 9) | (11 << 5) | 26);

    const zip = await lerTudo(
      criarZip([
        entradaDeTexto("a.txt", "x", {
          data: new Date("2026-11-27T01:30:00Z"),
        }),
      ]),
    );
    expect(lerZip(zip).entradas[0].data).toEqual({
      ano: 2026,
      mes: 11,
      dia: 26,
      hora: 22,
      minuto: 30,
      segundo: 0,
    });
  });

  test("a data DOS fica entre 1980 e 2107", () => {
    expect(dataDos(new Date("1970-01-01T12:00:00Z")).dia >> 9).toBe(0);
    expect(dataDos(new Date("2200-06-01T12:00:00Z")).dia >> 9).toBe(127);
  });
});

// --- Leitores externos: só rodam quando a ferramenta existe na máquina ---

function existe(comando: string, args: string[]): boolean {
  return spawnSync(comando, args, { stdio: "ignore" }).error === undefined;
}

// O tar do Windows (bsdtar) lê zip; o GNU tar não.
const temTarQueLeZip =
  existe("tar", ["--version"]) &&
  String(spawnSync("tar", ["--version"], { encoding: "utf8" }).stdout).includes(
    "bsdtar",
  );
const temUnzip = existe("unzip", ["-v"]);

async function zipsDeExemplo(): Promise<Record<string, Uint8Array>> {
  const acentos = [
    entradaDeTexto("Relatórios/Relatório março.txt", "olá"),
    entradaDeTexto("Fotos antes/foto (2).jpg", "conteúdo"),
  ];
  return {
    acentos: await lerTudo(criarZip(acentos)),
    vazio: await lerTudo(criarZip([])),
    zip64: await lerTudo(
      criarZip(
        [
          {
            nome: "grande.bin",
            tamanho: 150,
            abrir: async () => fonteDeBytes(new Uint8Array(150).fill(9)),
          },
          entradaDeTexto("pequeno.txt", "oi"),
        ],
        undefined,
        { limiteZip64: 100 },
      ),
    ),
  };
}

describe("leitores externos", () => {
  test.skipIf(!temTarQueLeZip)(
    "tar -tf (bsdtar) lista os zips",
    async () => {
      const pasta = mkdtempSync(join(tmpdir(), "zip-"));
      try {
        for (const [nome, zip] of Object.entries(await zipsDeExemplo())) {
          const arquivo = join(pasta, `${nome}.zip`);
          writeFileSync(arquivo, zip);
          const r = spawnSync("tar", ["-tf", arquivo], { encoding: "utf8" });
          expect(r.status, `${nome}: ${r.stderr}`).toBe(0);
        }
      } finally {
        rmSync(pasta, { recursive: true, force: true });
      }
    },
    30_000,
  );

  test.skipIf(!temUnzip)(
    "unzip -t confere os zips",
    async () => {
      const pasta = mkdtempSync(join(tmpdir(), "zip-"));
      try {
        for (const [nome, zip] of Object.entries(await zipsDeExemplo())) {
          const arquivo = join(pasta, `${nome}.zip`);
          writeFileSync(arquivo, zip);
          const r = spawnSync("unzip", ["-t", arquivo], { encoding: "utf8" });
          // unzip devolve 1 (aviso) para zip vazio; o resto precisa ser 0.
          const esperado = nome === "vazio" ? [1, 0] : [0];
          expect(esperado, `${nome}: ${r.stdout}${r.stderr}`).toContain(
            r.status,
          );
        }
      } finally {
        rmSync(pasta, { recursive: true, force: true });
      }
    },
    30_000,
  );
});
