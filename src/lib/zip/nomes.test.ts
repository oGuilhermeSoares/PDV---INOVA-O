import { describe, expect, test } from "vitest";

import { nomeDoZip, nomeSeguro, nomesUnicos } from "@/lib/zip/nomes";

describe("nomeSeguro", () => {
  test("troca os caracteres proibidos no Windows por _", () => {
    expect(nomeSeguro('a<b>c:d"e/f\\g|h?i*j.pdf')).toBe(
      "a_b_c_d_e_f_g_h_i_j.pdf",
    );
  });

  test("troca controle e DEL por _", () => {
    expect(nomeSeguro("a\u0000b\u001fc\u007fd.txt")).toBe("a_b_c_d.txt");
  });

  test("normaliza para NFC", () => {
    expect(nomeSeguro("Relatório.pdf")).toBe("Relatório.pdf");
  });

  test("tira pontos e espaços do fim", () => {
    expect(nomeSeguro("foto. . ")).toBe("foto");
  });

  test("vazio, ponto e ponto-ponto viram arquivo", () => {
    expect(nomeSeguro("")).toBe("arquivo");
    expect(nomeSeguro("   ")).toBe("arquivo");
    expect(nomeSeguro(".")).toBe("arquivo");
    expect(nomeSeguro("..")).toBe("arquivo");
  });

  test("nomes reservados do Windows ganham _, mesmo com extensão", () => {
    expect(nomeSeguro("CON")).toBe("_CON");
    expect(nomeSeguro("nul.txt")).toBe("_nul.txt");
    expect(nomeSeguro("Com1.jpg")).toBe("_Com1.jpg");
    expect(nomeSeguro("LPT9")).toBe("_LPT9");
    expect(nomeSeguro("console.txt")).toBe("console.txt");
  });

  test("corta nomes longos preservando a extensão", () => {
    const nome = nomeSeguro(`${"a".repeat(400)}.jpeg`);

    expect(nome.length).toBeLessThanOrEqual(150);
    expect(nome.endsWith(".jpeg")).toBe(true);
  });

  test("não corta um emoji ao meio na posição do corte", () => {
    const nome = nomeSeguro(`${"a".repeat(145)}😀😀😀😀😀😀.jpg`);

    expect(nome.isWellFormed()).toBe(true);
    expect(Array.from(nome).length).toBeLessThanOrEqual(150);
    expect(nome.endsWith(".jpg")).toBe(true);
  });

  test("surrogate solto vira U+FFFD e o nome codifica em UTF-8 e em URL", () => {
    const nome = nomeSeguro("a\ud83db.jpg");

    expect(nome).toBe("a�b.jpg");
    expect(() => encodeURIComponent(nome)).not.toThrow();
  });
});

describe("nomesUnicos", () => {
  test("repetidos, sem olhar caixa, ganham (2), (3)", () => {
    expect(
      nomesUnicos(["foto.jpg", "FOTO.JPG", "foto.jpg", "outra.jpg"]),
    ).toEqual(["foto.jpg", "FOTO (2).JPG", "foto (3).jpg", "outra.jpg"]);
  });

  test("NFC e NFD contam como o mesmo nome", () => {
    expect(nomesUnicos(["Relatório.pdf", "Relatório.pdf"])).toEqual([
      "Relatório.pdf",
      "Relatório (2).pdf",
    ]);
  });

  test("não colide com um nome que já existe", () => {
    expect(nomesUnicos(["a.jpg", "a (2).jpg", "a.jpg"])).toEqual([
      "a.jpg",
      "a (2).jpg",
      "a (3).jpg",
    ]);
  });

  test("sem extensão", () => {
    expect(nomesUnicos(["leia", "leia"])).toEqual(["leia", "leia (2)"]);
  });
});

describe("nomeDoZip", () => {
  test("loja e seção", () => {
    expect(nomeDoZip("Farmácia Brick - Salvador", "Fotos antes")).toBe(
      "Farmácia Brick - Salvador - Fotos antes.zip",
    );
  });

  test("só a loja, para a loja inteira", () => {
    expect(nomeDoZip("Farmácia Brick - Salvador")).toBe(
      "Farmácia Brick - Salvador.zip",
    );
  });

  test("usa o nome cru da loja, sem o espaço que não quebra", () => {
    expect(nomeDoZip("Loja - Cidade")).not.toContain(" ");
  });

  test("limpa caracteres proibidos", () => {
    expect(nomeDoZip("A/B: loja", "x?")).toBe("A_B_ loja - x_.zip");
  });
});
