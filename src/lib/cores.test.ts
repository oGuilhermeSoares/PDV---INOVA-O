import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, test } from "vitest";

import { CORES, contraste } from "@/lib/cores";

type NomeDaCor = keyof typeof CORES;

const AA = 4.5;
const NAO_TEXTO = 3;

// Cor resultante de `cor` com opacidade `alfa` sobre `fundo` (todas #rrggbb).
// Serve para conferir textos como `text-white/72` sobre o painel petróleo.
function misturar(cor: string, fundo: string, alfa: number): string {
  const canal = (hex: string, inicio: number) =>
    parseInt(hex.slice(inicio, inicio + 2), 16);
  return (
    "#" +
    [1, 3, 5]
      .map((inicio) =>
        Math.round(
          canal(cor, inicio) * alfa + canal(fundo, inicio) * (1 - alfa),
        ),
      )
      .map((valor) => valor.toString(16).padStart(2, "0"))
      .join("")
  );
}

function coresDoCss(): Record<string, string> {
  const css = readFileSync(
    join(process.cwd(), "src/app/globals.css"),
    "utf8",
  ).toLowerCase();
  const cores: Record<string, string> = {};
  for (const [, nome, hex] of css.matchAll(
    /--color-([a-z0-9-]+):\s*(#[0-9a-f]{6})\s*;/g,
  )) {
    cores[nome] = hex;
  }
  return cores;
}

describe("contraste", () => {
  test("contraste de preto e branco é 21", () => {
    expect(contraste("#000000", "#ffffff")).toBeCloseTo(21, 1);
  });

  test("é simétrico", () => {
    expect(contraste("#ffffff", "#000000")).toBeCloseTo(21, 1);
  });
});

describe("tokens de cor", () => {
  test("globals.css e CORES têm as mesmas cores", () => {
    expect(coresDoCss()).toEqual(CORES);
  });

  // Texto sobre fundo: cada par que os componentes usam precisa de 4,5:1.
  const PARES_DE_TEXTO: [NomeDaCor, NomeDaCor][] = [
    ["gray-900", "white"],
    ["gray-900", "gray-50"],
    ["gray-900", "gray-100"],
    ["gray-900", "primary-light"],
    ["gray-700", "gray-50"],
    ["gray-700", "gray-100"],
    ["gray-600", "white"],
    ["gray-600", "gray-50"],
    ["gray-600", "gray-100"],
    ["gray-500", "white"],
    ["gray-500", "gray-50"],
    ["gray-950", "primary"],
    ["gray-950", "primary-dark"],
    ["primary-strong", "white"],
    ["primary-strong", "gray-50"],
    ["primary-strong", "primary-light"],
    ["accent-strong", "white"],
    ["accent-strong", "accent-light"],
    ["status-aberto", "status-aberto-bg"],
    ["status-andamento", "status-andamento-bg"],
    ["status-aguardando", "status-aguardando-bg"],
    ["status-resolvido", "status-resolvido-bg"],
    ["status-recusado", "status-recusado-bg"],
    ["red-700", "white"],
    ["red-700", "red-50"],
    ["white", "red-700"],
    ["white", "red-800"],
    ["white", "petroleo-950"],
    ["white", "petroleo-900"],
    ["white", "petroleo-800"],
    ["white", "petroleo-700"],
    ["realce", "petroleo-950"],
    ["realce", "petroleo-900"],
    ["primary", "petroleo-900"],
    ["avatar-1", "avatar-1-bg"],
    ["avatar-2", "avatar-2-bg"],
    ["avatar-3", "avatar-3-bg"],
    ["avatar-4", "avatar-4-bg"],
  ];

  test.each(PARES_DE_TEXTO)("%s sobre %s passa AA", (texto, fundo) => {
    expect(contraste(CORES[texto], CORES[fundo])).toBeGreaterThanOrEqual(AA);
  });

  test("texto de apoio do painel (branco a 72%) passa AA sobre o petróleo", () => {
    const apoio = misturar(CORES.white, CORES["petroleo-900"], 0.72);
    expect(contraste(apoio, CORES["petroleo-900"])).toBeGreaterThanOrEqual(AA);
  });

  // Borda de campo, ícone e anel de foco precisam de 3:1 (WCAG 1.4.11).
  const PARES_SEM_TEXTO: [NomeDaCor, NomeDaCor, string][] = [
    ["gray-500", "white", "borda do campo"],
    ["red-700", "white", "borda do campo inválido"],
    ["primary-strong", "white", "anel de foco no claro"],
    ["primary", "petroleo-900", "anel de foco no painel escuro"],
  ];

  test.each(PARES_SEM_TEXTO)("%s sobre %s (%s) passa 3:1", (cor, fundo) => {
    expect(contraste(CORES[cor], CORES[fundo])).toBeGreaterThanOrEqual(
      NAO_TEXTO,
    );
  });

  test("o teal puro da marca não é texto nem foco sobre branco", () => {
    // Por isso o texto teal é `primary-strong` e o foco no claro também.
    expect(contraste(CORES.primary, CORES.white)).toBeLessThan(NAO_TEXTO);
  });

  test("o laranja puro não é texto sobre branco", () => {
    // Texto laranja usa `accent-strong`.
    expect(contraste(CORES.accent, CORES.white)).toBeLessThan(AA);
  });

  test("gray-400 não é cor de texto", () => {
    expect(contraste(CORES["gray-400"], CORES.white)).toBeLessThan(AA);
  });
});
