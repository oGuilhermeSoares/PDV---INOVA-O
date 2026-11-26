import { describe, expect, test } from "vitest";

import { GradeDeFotos } from "@/components/loja/GradeDeFotos";
import { ItemDeArquivo } from "@/components/loja/ItemDeArquivo";
import { SecaoDaLoja } from "@/components/loja/SecaoDaLoja";
import { SeletorDeLoja } from "@/components/loja/SeletorDeLoja";
import { Visualizador } from "@/components/loja/Visualizador";
import type { ArquivoDaLoja, SecaoDaLoja as Secao } from "@/lib/loja";
import { renderizar } from "@/testes/renderizar";

const em = "2026-10-28T12:00:00-03:00";
const arquivo = (nome: string): ArquivoDaLoja => ({
  id: nome,
  nome,
  atualizadoEm: em,
});
const fotos = (n: number) =>
  Array.from({ length: n }, (_, i) => arquivo(`Foto ${i + 1}.jpeg`));

describe("SeletorDeLoja", () => {
  const lojas = [
    { id: "jumalti", nome: "Drogaria Jumalti", href: "/a" },
    { id: "geral", nome: "Farmácia Geral", href: "/b" },
  ];

  test("com uma loja só, não aparece", () => {
    expect(
      renderizar(<SeletorDeLoja lojas={lojas.slice(0, 1)} atual="jumalti" />),
    ).toBe("");
  });

  test("com duas lojas, lista as duas e marca a atual", () => {
    const html = renderizar(<SeletorDeLoja lojas={lojas} atual="jumalti" />);
    expect(html).toContain("Trocar loja");
    expect(html).toContain('href="/b"');
    expect(html).toMatch(/aria-current="page"[^>]*>[\s\S]*Drogaria Jumalti/);
  });
});

describe("ItemDeArquivo", () => {
  test("o PDF abre no navegador", () => {
    const html = renderizar(
      <ItemDeArquivo
        arquivo={arquivo("Assessoria GC - Jumauti Ltda (1).pdf")}
      />,
    );
    expect(html).toContain(">Abrir<");
    expect(html).toContain(
      'aria-label="Abrir Assessoria GC - Jumauti Ltda (1).pdf"',
    );
    expect(html).toContain("PDF · 28/10/2026");
  });

  test("a planilha é baixada", () => {
    const html = renderizar(
      <ItemDeArquivo
        arquivo={{
          ...arquivo("BRICK 2004 - PRODUTOS.xlsx"),
          url: "/arquivos/brick.xlsx",
        }}
      />,
    );
    expect(html).toContain(">Baixar<");
    expect(html).toContain('download=""');
    expect(html).toContain('href="/arquivos/brick.xlsx"');
  });

  test("sem o arquivo de verdade (prévia), não baixa a página", () => {
    const html = renderizar(
      <ItemDeArquivo arquivo={arquivo("BRICK 2004 - PRODUTOS.xlsx")} />,
    );
    expect(html).not.toMatch(/\sdownload=/);
  });
});

describe("SecaoDaLoja", () => {
  const secao = (arquivos: ArquivoDaLoja[]): Secao => ({
    id: "estudo",
    titulo: "Estudo de mercado",
    tipo: "documentos",
    vazia: "Os estudos de mercado da sua loja aparecem aqui.",
    arquivos,
  });

  test("vazia, diz o que vai aparecer ali", () => {
    expect(renderizar(<SecaoDaLoja secao={secao([])} />)).toContain(
      "Os estudos de mercado da sua loja aparecem aqui.",
    );
  });

  test("cheia, mostra a data e a quantidade", () => {
    const uma = renderizar(<SecaoDaLoja secao={secao([arquivo("a.pdf")])} />);
    expect(uma).toContain("Atualizado em 28/10/2026");
    expect(uma).toContain("1 item");
    const quatro = renderizar(
      <SecaoDaLoja secao={secao(["a", "b", "c", "d"].map(arquivo))} />,
    );
    expect(quatro).toContain("4 itens");
  });
});

describe("GradeDeFotos", () => {
  test("mostra 6 miniaturas e o botão para ver todas", () => {
    const html = renderizar(<GradeDeFotos arquivos={fotos(16)} />);
    expect(html.match(/aria-label="Abrir foto /g)).toHaveLength(6);
    expect(html).toContain("Ver todas (16)");
  });

  test("com poucas fotos, não tem 'Ver todas'", () => {
    expect(renderizar(<GradeDeFotos arquivos={fotos(3)} />)).not.toContain(
      "Ver todas",
    );
  });
});

describe("Visualizador", () => {
  test("tem os controles com nome e a posição", () => {
    const html = renderizar(
      <Visualizador
        arquivos={fotos(16)}
        indice={0}
        aberto={false}
        aoMudar={() => {}}
        aoFechar={() => {}}
      />,
    );
    for (const nome of ["Foto anterior", "Próxima foto", "Fechar"]) {
      expect(html).toContain(`aria-label="${nome}"`);
    }
    expect(html).toContain("1 de 16");
  });
});
