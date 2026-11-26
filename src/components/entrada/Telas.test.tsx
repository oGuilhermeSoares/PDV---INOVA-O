import { describe, expect, test } from "vitest";

import { TelaDaEquipe, TelaDoAssociado } from "@/components/entrada/Telas";
import { renderizar } from "@/testes/renderizar";

describe("TelaDoAssociado", () => {
  const html = renderizar(
    <TelaDoAssociado>
      <p>cartão</p>
    </TelaDoAssociado>,
  );

  test("todo atalho #… da página leva a uma seção que existe nela", () => {
    const alvos = [...html.matchAll(/href="#([^"]+)"/g)].map((m) => m[1]);
    const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
    expect(alvos.length).toBeGreaterThan(0);
    for (const alvo of alvos) expect(ids, `#${alvo}`).toContain(alvo);
  });

  test("os atalhos da barra são os das seções", () => {
    for (const alvo of ["o-que-tem", "como-funciona", "perguntas"]) {
      expect(html).toContain(`href="#${alvo}"`);
    }
  });

  test("tem cabeçalho, conteúdo e rodapé, e um cartão só", () => {
    expect(html).toContain("<header");
    expect(html).toContain("<main");
    expect(html).toContain("<footer");
    expect(html.match(/\sid="entrar"/g)).toHaveLength(1);
  });

  test("o rodapé escreve 'Portal PDV' só como nome, sem marca d'água", () => {
    const rodape = html.match(/<footer[\s\S]*<\/footer>/)?.[0] ?? "";
    expect(rodape.match(/Portal PDV/g)).toHaveLength(1);
  });

  test("o rodapé leva à entrada da equipe", () => {
    const rodape = html.match(/<footer[\s\S]*<\/footer>/)?.[0] ?? "";
    expect(rodape).toContain('href="/admin/entrar"');
    expect(rodape).toContain("Setor de PDV · Farmácias Associadas");
  });
});

describe("TelaDaEquipe", () => {
  test("é só o hero: sem atalhos, seções nem rodapé", () => {
    const html = renderizar(
      <TelaDaEquipe>
        <p>cartão</p>
      </TelaDaEquipe>,
    );
    expect(html).not.toContain("<nav");
    expect(html).not.toContain("<footer");
    expect(html).not.toContain('id="perguntas"');
  });
});
