import { describe, expect, test } from "vitest";

import { VoltarLink } from "@/components/ui/VoltarLink";
import { renderizar } from "@/testes/renderizar";

describe("VoltarLink", () => {
  test("no claro, em cinza de apoio", () => {
    const html = renderizar(<VoltarLink href="/a">Início</VoltarLink>);
    expect(html).toContain("text-gray-600");
  });

  test("no painel escuro, em branco a 72%", () => {
    const html = renderizar(
      <VoltarLink href="/a" escuro>
        Sua loja
      </VoltarLink>,
    );
    expect(html).toContain("text-white/72");
    expect(html).not.toContain("text-gray-600");
  });
});
