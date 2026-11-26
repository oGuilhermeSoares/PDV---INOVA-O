import { describe, expect, test, vi } from "vitest";

import { TelaDaLoja } from "@/components/loja/TelaDaLoja";
import { montarSecoes, type ArquivoDaLoja } from "@/lib/loja";
import { renderizar } from "@/testes/renderizar";

// O "Tentar de novo" usa o roteador do Next, que não existe fora do app.
vi.mock("next/navigation", () => ({
  useRouter: () => ({ refresh: () => {} }),
}));

const arquivo = (nome: string): ArquivoDaLoja => ({
  id: nome,
  nome,
  atualizadoEm: "2026-10-28T12:00:00-03:00",
});

const loja = { id: "jumalti", nome: "Drogaria Jumalti - Caxias do Sul" };
const secoes = montarSecoes([
  { nome: "Fotos antes", arquivos: [arquivo("Vídeo.mp4")] },
  { nome: "Estudos", arquivos: [arquivo("BRICK.pdf")] },
  { nome: "", arquivos: [arquivo("Assessoria GC.pdf")] },
]);

describe("TelaDaLoja", () => {
  test("com uma loja: o nome no h1, as seções na ordem e sem seletor", () => {
    const html = renderizar(
      <TelaDaLoja
        loja={loja}
        lojas={[{ ...loja, href: "/a" }]}
        secoes={secoes}
      />,
    );
    expect(html).toMatch(
      /<h1[^>]*>Drogaria Jumalti\u00a0- Caxias do Sul<\/h1>/,
    );
    const relatorios = html.indexOf(">Relatórios<");
    const estudo = html.indexOf(">Estudo de mercado<");
    const antes = html.indexOf(">Fotos e vídeos: antes<");
    expect(relatorios).toBeGreaterThan(-1);
    expect(estudo).toBeGreaterThan(relatorios);
    expect(antes).toBeGreaterThan(estudo);
    expect(html).not.toContain("<details");
    expect(html).toContain("Enviar fotos e vídeos");
  });

  test("com duas lojas, aparece o seletor", () => {
    const html = renderizar(
      <TelaDaLoja
        loja={loja}
        lojas={[
          { ...loja, href: "/a" },
          { id: "geral", nome: "Farmácia Geral", href: "/b" },
        ]}
        secoes={secoes}
      />,
    );
    expect(html).toContain("<details");
  });

  test("com erro: o aviso e o botão, sem as seções", () => {
    const html = renderizar(
      <TelaDaLoja loja={loja} lojas={[]} secoes={secoes} erro />,
    );
    expect(html).toContain(
      "Não deu para carregar o material agora. Tente de novo em alguns minutos.",
    );
    expect(html).toContain("Tentar de novo");
    expect(html).not.toContain(">Relatórios<");
  });
});
