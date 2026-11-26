import { expect, test } from "vitest";

import { formatarContagem } from "@/lib/tempo";

test.each([
  [45, "0:45"],
  [125, "2:05"],
  [600, "10:00"],
  [0, "0:00"],
])("formatarContagem(%s) é %s", (segundos, esperado) => {
  expect(formatarContagem(segundos)).toBe(esperado);
});

test("tempo negativo aparece como 0:00", () => {
  expect(formatarContagem(-3)).toBe("0:00");
});

test("arredonda para cima, para não mostrar 0:00 antes da hora", () => {
  expect(formatarContagem(44.2)).toBe("0:45");
});
