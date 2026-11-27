import { describe, expect, test } from "vitest";

import {
  cabeNoZip,
  LIMITE_DE_ENTRADAS_DO_ZIP,
  LIMITE_DO_ZIP_BYTES,
} from "@/lib/arquivos/limite-do-zip";

describe("cabeNoZip", () => {
  test("o teto é de 500 MB e o limite de entradas é 5.000", () => {
    expect(LIMITE_DO_ZIP_BYTES).toBe(500 * 1024 * 1024);
    expect(LIMITE_DE_ENTRADAS_DO_ZIP).toBe(5000);
  });

  test("cabe quando a soma está no teto", () => {
    expect(
      cabeNoZip([{ tamanho: LIMITE_DO_ZIP_BYTES - 1 }, { tamanho: 1 }]),
    ).toBe(true);
    expect(cabeNoZip([])).toBe(true);
  });

  test("não cabe acima do teto", () => {
    expect(cabeNoZip([{ tamanho: LIMITE_DO_ZIP_BYTES }, { tamanho: 1 }])).toBe(
      false,
    );
  });

  test("não cabe se um arquivo não informa o tamanho", () => {
    expect(cabeNoZip([{ tamanho: 10 }, {}])).toBe(false);
    expect(cabeNoZip([{ tamanho: Number.NaN }])).toBe(false);
    expect(cabeNoZip([{ tamanho: -1 }])).toBe(false);
  });

  test("não cabe com mais de 5.000 entradas", () => {
    const muitos = Array.from(
      { length: LIMITE_DE_ENTRADAS_DO_ZIP + 1 },
      () => ({
        tamanho: 1,
      }),
    );

    expect(cabeNoZip(muitos)).toBe(false);
    expect(cabeNoZip(muitos.slice(1))).toBe(true);
  });
});
