import { describe, expect, test } from "vitest";

import { PerguntasFrequentes } from "@/components/entrada/PerguntasFrequentes";
import { PreviaDaLoja } from "@/components/entrada/PreviaDaLoja";
import { SecaoComoFunciona } from "@/components/entrada/SecaoComoFunciona";
import { SecaoOQueTem } from "@/components/entrada/SecaoOQueTem";
import { PERGUNTAS } from "@/lib/perguntas";
import { renderizar } from "@/testes/renderizar";

describe("SecaoComoFunciona", () => {
  const html = renderizar(<SecaoComoFunciona />);

  test("é a seção do atalho, com o destaque em realce", () => {
    expect(html).toContain('id="como-funciona"');
    expect(html).toMatch(/class="text-realce"[^>]*>até a sua tela\./);
  });

  test("os quatro passos estão numa lista ordenada", () => {
    const lista = html.match(/<ol[\s\S]*<\/ol>/)?.[0] ?? "";
    expect(lista.match(/<li/g)).toHaveLength(4);
    for (const passo of [
      "A equipe visita a loja",
      "Você recebe um e-mail",
      "Você entra com o CNPJ",
      "E manda fotos de volta",
    ]) {
      expect(lista).toContain(passo);
    }
  });

  test("tem a linha que se desenha ao rolar", () => {
    expect(html).toMatch(
      /pathLength="1"[^>]*class="desenhar-ao-rolar"|class="desenhar-ao-rolar"[^>]*pathLength="1"/,
    );
    expect(html).toContain("linha-do-tempo");
  });
});

describe("PerguntasFrequentes", () => {
  const html = renderizar(<PerguntasFrequentes />);

  test("as respostas saem do que está decidido na documentação", () => {
    expect(PERGUNTAS).toHaveLength(7);
    const respostas = PERGUNTAS.map(({ resposta }) => resposta).join(" ");
    expect(respostas).toContain("10 minutos");
    expect(respostas).toContain("30 dias");
  });

  test("cada pergunta é um details com summary, para abrir pelo teclado", () => {
    expect(html).toContain('id="perguntas"');
    expect(html.match(/<details/g)).toHaveLength(7);
    expect(html.match(/<summary/g)).toHaveLength(7);
    for (const { pergunta } of PERGUNTAS) expect(html).toContain(pergunta);
  });
});

describe("PreviaDaLoja", () => {
  const html = renderizar(<PreviaDaLoja />);

  test("é uma imagem com descrição para o leitor de tela", () => {
    expect(html).toContain('role="img"');
    expect(html).toContain(
      'aria-label="Prévia da tela da loja, com o botão de enviar fotos e vídeos, os relatórios, o estudo de mercado e as fotos de antes e depois."',
    );
  });

  test("mostra a estrutura de verdade da tela da loja", () => {
    for (const texto of [
      "Relatórios",
      "Estudo de mercado",
      "Fotos e vídeos: antes",
      "Enviar fotos e vídeos",
    ]) {
      expect(html).toContain(texto);
    }
  });

  test("não inventa datas nem números", () => {
    // Fora os atributos, que têm medidas (viewBox, larguras).
    const texto = html.replace(/<[^>]+>/g, " ");
    expect(texto).not.toMatch(/\d{2}\/\d{2}/);
    expect(texto).not.toMatch(/\d{3,}/);
  });
});

describe("SecaoOQueTem", () => {
  const html = renderizar(<SecaoOQueTem />);

  test("é a seção do atalho, ligada ao título", () => {
    expect(html).toContain('id="o-que-tem"');
    expect(html).toContain('aria-labelledby="o-que-tem-titulo"');
    expect(html).toMatch(/<h2[^>]*id="o-que-tem-titulo"/);
  });

  test("tem os três cartões", () => {
    expect(html.match(/<h3/g)).toHaveLength(3);
    for (const titulo of [
      "Relatórios da assessoria",
      "Estudo de mercado",
      "Fotos e vídeos",
    ]) {
      expect(html).toContain(titulo);
    }
  });
});
