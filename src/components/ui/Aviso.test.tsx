import { describe, expect, test } from "vitest";

import { Aviso, RegiaoDeAviso } from "@/components/ui/Aviso";
import { renderizar } from "@/testes/renderizar";

describe("Aviso", () => {
  test("o aviso de erro é anunciado na hora (role=alert)", () => {
    expect(renderizar(<Aviso tom="erro">Algo deu errado.</Aviso>)).toContain(
      'role="alert"',
    );
  });

  test.each(["sucesso", "atencao", "info"] as const)(
    "o aviso de %s usa role=status",
    (tom) => {
      expect(renderizar(<Aviso tom={tom}>Texto do aviso.</Aviso>)).toContain(
        'role="status"',
      );
    },
  );

  test("com anunciar={false}, não tem papel próprio (quem anuncia é a região)", () => {
    expect(
      renderizar(
        <Aviso tom="erro" anunciar={false}>
          Algo deu errado.
        </Aviso>,
      ),
    ).not.toContain("role=");
  });
});

describe("RegiaoDeAviso", () => {
  // O leitor de tela só anuncia com certeza o que muda dentro de uma região
  // que já estava na página: ela existe mesmo sem aviso.
  test("existe vazia antes do aviso chegar", () => {
    const html = renderizar(<RegiaoDeAviso />);
    expect(html).toMatch(/<div aria-live="polite"[^>]*data-regiao-de-aviso/);
    expect(html).not.toContain("role=");
  });

  test("mostra o aviso dentro dela, sem uma região dentro da outra", () => {
    const html = renderizar(
      <RegiaoDeAviso
        aviso={{ tom: "atencao", texto: "O acesso ainda não foi liberado." }}
      />,
    );
    expect(html).toContain("O acesso ainda não foi liberado.");
    expect(html).toContain("bg-status-aberto-bg");
    expect(html).not.toContain("role=");
  });
});
