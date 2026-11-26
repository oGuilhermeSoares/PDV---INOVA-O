import { ArrowRight } from "lucide-react";
import { describe, expect, test } from "vitest";

import { Button } from "@/components/ui/Button";
import { renderizar } from "@/testes/renderizar";

describe("Button", () => {
  test("com pending fica desabilitado e marca aria-busy", () => {
    const html = renderizar(<Button pending>Enviando código…</Button>);
    expect(html).toContain('disabled=""');
    expect(html).toContain('aria-busy="true"');
  });

  test("sem type, é um botão comum, que não envia o formulário", () => {
    expect(renderizar(<Button>Voltar</Button>)).toContain('type="button"');
  });

  test("o ícone final fica escondido do leitor de tela, e o texto continua", () => {
    const html = renderizar(
      <Button iconeFinal={ArrowRight}>Enviar código</Button>,
    );
    expect(html).toMatch(/<svg[^>]*aria-hidden="true"/);
    expect(html).toContain("Enviar código");
  });

  test("com pending, o ícone final dá lugar ao indicador de envio", () => {
    const html = renderizar(
      <Button pending iconeFinal={ArrowRight}>
        Enviando código…
      </Button>,
    );
    expect(html.match(/<svg/g)).toHaveLength(1);
    expect(html).toContain("animate-spin");
  });
});
