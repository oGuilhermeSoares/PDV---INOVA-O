import { expect, test } from "vitest";

import { ReenvioDeCodigo } from "@/components/entrada/ReenvioDeCodigo";
import { renderizar } from "@/testes/renderizar";

const botao = <button type="submit">Reenviar código</button>;

test("enquanto falta tempo, mostra a contagem e não o botão", () => {
  const html = renderizar(<ReenvioDeCodigo segundos={45} acao={botao} />);
  expect(html).toContain("0:45");
  expect(html).not.toContain("Reenviar código");
});

test("quando o tempo acaba, mostra o botão de reenviar", () => {
  const html = renderizar(<ReenvioDeCodigo segundos={0} acao={botao} />);
  expect(html).toContain("Reenviar código");
});
