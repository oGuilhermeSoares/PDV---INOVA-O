import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, test } from "vitest";

import { CORES, contraste } from "@/lib/cores";

const AA = 4.5;
const BRANCO = "#ffffff";

describe("contraste", () => {
  test("contraste de preto e branco é 21", () => {
    expect(contraste("#000000", BRANCO)).toBeCloseTo(21, 1);
  });

  test("é simétrico", () => {
    expect(contraste(BRANCO, "#000000")).toBeCloseTo(21, 1);
  });
});

describe("tokens de cor", () => {
  test("teal puro da marca não serve para texto sobre branco", () => {
    // Por isso existe um `primary` mais escuro para botões e links.
    expect(contraste(CORES.marca, BRANCO)).toBeLessThan(AA);
  });

  test("primary passa AA com texto branco", () => {
    expect(contraste(CORES.primary, BRANCO)).toBeGreaterThanOrEqual(AA);
  });

  test("primary-hover passa AA com texto branco", () => {
    expect(contraste(CORES["primary-hover"], BRANCO)).toBeGreaterThanOrEqual(
      AA,
    );
  });

  test("accent-dark passa AA sobre branco", () => {
    expect(contraste(CORES["accent-dark"], BRANCO)).toBeGreaterThanOrEqual(AA);
  });

  test("texto e texto-suave passam AA sobre o fundo", () => {
    expect(contraste(CORES.texto, CORES.fundo)).toBeGreaterThanOrEqual(AA);
    expect(contraste(CORES["texto-suave"], CORES.fundo)).toBeGreaterThanOrEqual(
      AA,
    );
  });

  test("texto passa AA sobre a faixa da marca (cabeçalho)", () => {
    expect(contraste(CORES.texto, CORES.marca)).toBeGreaterThanOrEqual(AA);
  });

  test("texto branco não passa AA sobre a faixa da marca", () => {
    // Documenta por que o cabeçalho teal usa texto escuro.
    expect(contraste(BRANCO, CORES.marca)).toBeLessThan(AA);
  });

  test("primary passa AA sobre primary-light (selos e destaques)", () => {
    expect(
      contraste(CORES.primary, CORES["primary-light"]),
    ).toBeGreaterThanOrEqual(AA);
  });

  test("globals.css usa os mesmos hex de CORES", () => {
    const css = readFileSync(
      join(process.cwd(), "src/app/globals.css"),
      "utf8",
    ).toLowerCase();

    for (const [nome, hex] of Object.entries(CORES)) {
      expect(css, `--color-${nome}`).toContain(`--color-${nome}: ${hex}`);
    }
  });
});
