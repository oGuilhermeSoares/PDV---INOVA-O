import { expect, test } from "vitest";

import { tipoDoArquivo } from "@/components/ui/ArquivoIcon";

// Nomes reais da pasta de uma loja no SharePoint.
test.each([
  ["Assessoria GC - Jumauti Ltda (1).pdf", "pdf"],
  ["BRICK 2004 - PRODUTOS JUMAUTI - MAT04_2026.xlsx", "planilha"],
  ["WhatsApp Image 2026-08-10 at 09.41.58.jpeg", "imagem"],
  ["Vídeo.MP4", "video"],
  ["leia-me", "outro"],
])("%s é do tipo %s", (nome, tipo) => {
  expect(tipoDoArquivo(nome)).toBe(tipo);
});
