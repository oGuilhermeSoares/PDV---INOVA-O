import { describe, expect, test } from "vitest";

import { MolduraDeEntrada } from "@/components/entrada/MolduraDeEntrada";
import { renderizar } from "@/testes/renderizar";

function moldura() {
  return renderizar(
    <MolduraDeEntrada
      altura="pagina"
      idDoCartao="entrar"
      titulo="Tudo da sua loja,"
      destaque="num lugar só."
      selos={["Relatórios da assessoria"]}
      rodape={<p>É da equipe de PDV?</p>}
    >
      <p>cartão do formulário</p>
    </MolduraDeEntrada>,
  );
}

describe("MolduraDeEntrada", () => {
  test("põe o cartão no lugar com o id que a barra usa", () => {
    const html = moldura();
    expect(html).toContain('id="entrar"');
    expect(html).toContain("cartão do formulário");
  });

  test("mostra o título com o destaque em realce", () => {
    expect(moldura()).toMatch(
      /Tudo da sua loja,[\s\S]*class="text-realce"[^>]*>num lugar só\./,
    );
  });

  test("mostra o rodapé do cartão", () => {
    expect(moldura()).toContain("É da equipe de PDV?");
  });

  test("não é mais a barra: o logo e o cabeçalho ficam na BarraDoPortal", () => {
    const html = moldura();
    expect(html).not.toContain("<header");
    expect(html).not.toContain("Setor de PDV");
  });
});
