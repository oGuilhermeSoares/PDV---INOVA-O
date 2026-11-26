import { readFileSync } from "node:fs";
import { join } from "node:path";

import { expect, test } from "vitest";

const ler = (arquivo: string) =>
  readFileSync(join(process.cwd(), arquivo), "utf8");

// No Next 16, o scroll-behavior: smooth do <html> também vale na troca de
// página: a tela nova rolaria devagar até o topo. O atributo pede ao Next para
// rolar na hora durante a navegação e deixar a rolagem suave só nos atalhos.
test("com rolagem suave no html, a troca de página não rola devagar", () => {
  expect(ler("src/app/globals.css")).toMatch(/scroll-behavior:\s*smooth/);
  expect(ler("src/app/layout.tsx")).toContain('data-scroll-behavior="smooth"');
});
