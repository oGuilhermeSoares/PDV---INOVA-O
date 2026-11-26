import { expect, test } from "vitest";

import { StatusBadge } from "@/components/ui/StatusBadge";
import { renderizar } from "@/testes/renderizar";

test("mostra a situação com texto, cor e forma", () => {
  const html = renderizar(<StatusBadge grupo="resolvido">Enviado</StatusBadge>);
  expect(html).toContain("Enviado");
  expect(html).toContain("bg-status-resolvido-bg");
  expect(html).toMatch(/<svg[^>]*aria-hidden="true"/);
});

test("cancelado usa o cinza neutro", () => {
  expect(
    renderizar(<StatusBadge grupo="cancelado">Desativado</StatusBadge>),
  ).toContain("bg-gray-100");
});
