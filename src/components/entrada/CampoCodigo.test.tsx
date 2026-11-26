import { describe, expect, test } from "vitest";

import { CampoCodigo } from "@/components/entrada/CampoCodigo";
import { limparCodigo } from "@/lib/codigo";
import { renderizar } from "@/testes/renderizar";

describe("limparCodigo", () => {
  test.each([
    ["123-456", "123456"],
    ["12a3", "123"],
    ["1234567", "123456"],
  ])("%s vira %s", (valor, esperado) => {
    expect(limparCodigo(valor)).toBe(esperado);
  });
});

describe("CampoCodigo", () => {
  test("pede o teclado numérico e aceita o código sugerido pelo celular", () => {
    // O React escreve os atributos em camelCase (inputMode); no HTML, a
    // caixa não importa.
    const html = renderizar(<CampoCodigo id="codigo" />);
    expect(html).toMatch(/inputmode="numeric"/i);
    expect(html).toMatch(/autocomplete="one-time-code"/i);
    expect(html).toMatch(/maxlength="6"/i);
    expect(html.match(/data-casa=/g)).toHaveLength(6);
  });

  test("mostra nas casas os algarismos já digitados", () => {
    const html = renderizar(<CampoCodigo id="codigo" defaultValue="12-3" />);
    expect(html).toContain('value="123"');
    expect(html).toMatch(/data-casa="0"[^>]*>1</);
    expect(html).toMatch(/data-casa="2"[^>]*>3</);
  });

  test("com erro, o campo e as casas ficam marcados", () => {
    const html = renderizar(<CampoCodigo id="codigo" aria-invalid />);
    expect(html).toContain('aria-invalid="true"');
    expect(html).toContain("border-red-700");
  });
});
