import { describe, expect, test } from "vitest";

import { contentDisposition } from "@/lib/zip/cabecalhos";

describe("contentDisposition", () => {
  test("nome simples", () => {
    expect(contentDisposition("loja.zip")).toBe(
      `attachment; filename="loja.zip"; filename*=UTF-8''loja.zip`,
    );
  });

  test("acento vira letra sem acento no fallback e %XX no filename*", () => {
    const valor = contentDisposition("Farmácia Brick - Salvador.zip");

    expect(valor).toContain(`filename="Farmacia Brick - Salvador.zip"`);
    expect(valor).toContain(
      "filename*=UTF-8''Farm%C3%A1cia%20Brick%20-%20Salvador.zip",
    );
  });

  test("aspas, barras e não-ASCII viram _ no fallback", () => {
    const valor = contentDisposition('a"b\\c/d…e.zip');

    expect(valor).toContain(`filename="a_b_c_d_e.zip"`);
  });

  test("apóstrofo, parênteses e asterisco são codificados no filename*", () => {
    const valor = contentDisposition("a'b(c)*.zip");

    expect(valor).toContain("filename*=UTF-8''a%27b%28c%29%2A.zip");
  });

  test("surrogate solto não lança URIError", () => {
    expect(() => contentDisposition("a\ud83db.zip")).not.toThrow();
    expect(contentDisposition("a\ud83db.zip")).toContain("a%EF%BF%BDb.zip");
  });

  test("não deixa quebra de linha passar para o cabeçalho", () => {
    expect(contentDisposition("a\r\nb.zip")).not.toMatch(/[\r\n]/);
  });
});
