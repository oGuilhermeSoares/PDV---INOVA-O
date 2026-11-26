import { describe, expect, test } from "vitest";

import { BarraDoPortal } from "@/components/entrada/BarraDoPortal";
import { CORES, contraste } from "@/lib/cores";
import { renderizar } from "@/testes/renderizar";

// Cor de `cor` com opacidade `alfa` sobre `fundo` (todas #rrggbb).
function misturar(cor: string, fundo: string, alfa: number): string {
  const canal = (hex: string, i: number) => parseInt(hex.slice(i, i + 2), 16);
  return (
    "#" +
    [1, 3, 5]
      .map((i) =>
        Math.round(canal(cor, i) * alfa + canal(fundo, i) * (1 - alfa)),
      )
      .map((v) => v.toString(16).padStart(2, "0"))
      .join("")
  );
}

describe("BarraDoPortal", () => {
  test("mostra os atalhos das seções num nav", () => {
    const html = renderizar(
      <BarraDoPortal atalhos={[{ href: "#perguntas", rotulo: "Perguntas" }]} />,
    );
    expect(html).toContain('<nav aria-label="Seções"');
    expect(html).toMatch(/href="#perguntas"[^>]*>Perguntas</);
  });

  test("sem atalhos, não tem nav", () => {
    expect(renderizar(<BarraDoPortal />)).not.toContain("<nav");
  });

  test("mostra a ação à direita", () => {
    expect(
      renderizar(<BarraDoPortal acao={<a href="#entrar">Entrar</a>} />),
    ).toContain('href="#entrar"');
  });

  test("o texto branco passa AA mesmo com a barra sobre o fundo branco", () => {
    // O pior caso: o vidro passando sobre uma seção clara. A opacidade vem da
    // própria classe do componente.
    const html = renderizar(<BarraDoPortal />);
    const opacidade = html.match(/bg-petroleo-900\/(\d+)/)?.[1];
    expect(opacidade).toBeDefined();
    const fundo = misturar(
      CORES["petroleo-900"],
      CORES.white,
      Number(opacidade) / 100,
    );
    expect(contraste(CORES.white, fundo)).toBeGreaterThanOrEqual(4.5);
  });
});
