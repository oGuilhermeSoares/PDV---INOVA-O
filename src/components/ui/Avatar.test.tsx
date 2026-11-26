import { expect, test } from "vitest";

import { iniciais, tomDoAvatar } from "@/components/ui/Avatar";

test.each([
  ["Camila Couto", "CC"],
  ["guilherme", "G"],
  ["  ", "?"],
  ["Ana Maria da Silva", "AS"],
])("as iniciais de %j são %s", (nome, esperado) => {
  expect(iniciais(nome)).toBe(esperado);
});

test("a mesma pessoa tem sempre o mesmo tom, que é um dos quatro", () => {
  const tom = tomDoAvatar("ana@loja.com.br");
  expect(tomDoAvatar("ana@loja.com.br")).toBe(tom);
  expect(
    [1, 2, 3, 4].map((n) => `bg-avatar-${n}-bg text-avatar-${n}`),
  ).toContain(tom);
});
