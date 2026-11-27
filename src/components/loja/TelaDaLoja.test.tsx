import { describe, expect, test, vi } from "vitest";

import { TelaDaLoja } from "@/components/loja/TelaDaLoja";
import { LIMITE_DO_ZIP_BYTES } from "@/lib/arquivos/limite-do-zip";
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
  tamanho: 1_000_000,
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
        enviarHref="/enviar"
      />,
    );
    expect(html).toMatch(
      /<h1[^>]*>Drogaria Jumalti\u00a0- Caxias do Sul<\/h1>/,
    );
    expect(html).toMatch(
      /<a[^>]*href="\/enviar"[^>]*>[\s\S]*?Enviar fotos e v\u00eddeos<\/a>/,
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
        enviarHref="/enviar"
      />,
    );
    expect(html).toContain("<details");
  });

  test("com erro: o aviso e o botão, sem as seções", () => {
    const html = renderizar(
      <TelaDaLoja
        loja={loja}
        lojas={[]}
        secoes={secoes}
        enviarHref="/enviar"
        erro
      />,
    );
    expect(html).toContain(
      "Não deu para carregar o material agora. Tente de novo em alguns minutos.",
    );
    expect(html).toContain("Tentar de novo");
    expect(html).not.toContain(">Relatórios<");
  });

  const zipHref = (secaoId?: string) =>
    `/zip${secaoId ? `?secao=${secaoId}` : ""}`;

  test("com zipHref: Baixar tudo da loja e de cada seção com arquivos", () => {
    const html = renderizar(
      <TelaDaLoja
        loja={loja}
        lojas={[]}
        secoes={secoes}
        enviarHref="/enviar"
        zipHref={zipHref}
      />,
    );
    expect(html).toMatch(
      /<a[^>]*href="\/zip"[^>]*aria-label="Baixar tudo de Drogaria Jumalti - Caxias do Sul em \.zip"/,
    );
    expect(html).toContain('href="/zip?secao=relatorios"');
    expect(html).toContain('href="/zip?secao=estudo"');
    expect(html).toContain('href="/zip?secao=antes"');
    // "Fotos depois" está vazia: sem botão.
    expect(html).not.toContain('href="/zip?secao=depois"');
  });

  test("loja grande demais: a faixa e a seção grande trocam o botão pelo aviso", () => {
    const grandes = montarSecoes([
      {
        nome: "Fotos antes",
        arquivos: [{ ...arquivo("Vídeo.mp4"), tamanho: LIMITE_DO_ZIP_BYTES }],
      },
      { nome: "Estudos", arquivos: [{ ...arquivo("BRICK.pdf"), tamanho: 10 }] },
    ]);
    const html = renderizar(
      <TelaDaLoja
        loja={loja}
        lojas={[]}
        secoes={grandes}
        enviarHref="/e"
        zipHref={zipHref}
      />,
    );
    // A loja inteira passa do teto: sem o botão da faixa, só o aviso.
    expect(html).not.toMatch(/href="\/zip"/);
    expect(html).toContain("Grande demais para um .zip");
    // A seção pequena ainda baixa; a grande não passa do teto sozinha.
    expect(html).toContain('href="/zip?secao=estudo"');
    expect(html).toContain('href="/zip?secao=antes"');
  });

  test("sem zipHref, nenhum Baixar tudo", () => {
    const html = renderizar(
      <TelaDaLoja loja={loja} lojas={[]} secoes={secoes} enviarHref="/e" />,
    );
    expect(html).not.toContain("Baixar tudo");
  });

  test("com erro ou tudo vazio, a faixa não tem Baixar tudo", () => {
    const comErro = renderizar(
      <TelaDaLoja
        loja={loja}
        lojas={[]}
        secoes={secoes}
        enviarHref="/e"
        zipHref={zipHref}
        erro
      />,
    );
    expect(comErro).not.toContain("Baixar tudo");
    const vazias = montarSecoes([
      { nome: "", arquivos: [] },
      { nome: "Fotos antes", arquivos: [] },
    ]);
    const semNada = renderizar(
      <TelaDaLoja
        loja={loja}
        lojas={[]}
        secoes={vazias}
        enviarHref="/e"
        zipHref={zipHref}
      />,
    );
    expect(semNada).not.toContain("Baixar tudo");
  });
});
