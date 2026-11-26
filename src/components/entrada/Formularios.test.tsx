import { expect, test } from "vitest";

import { EntradaDaEquipe } from "@/components/entrada/EntradaDaEquipe";
import { FormularioCnpj } from "@/components/entrada/FormularioCnpj";
import { FormularioCodigo } from "@/components/entrada/FormularioCodigo";
import { renderizar } from "@/testes/renderizar";

// O aviso que volta da ação (como "o acesso ainda não foi liberado") precisa
// de uma região que já esteja na página antes do envio, para o leitor de tela
// anunciar quando ele chegar.
const REGIAO = /<div aria-live="polite"[^>]*data-regiao-de-aviso/;

test("o formulário do CNPJ já tem a região do aviso antes de enviar", () => {
  expect(renderizar(<FormularioCnpj />)).toMatch(REGIAO);
});

test("o formulário do código já tem a região do aviso antes de enviar", () => {
  expect(
    renderizar(<FormularioCodigo emailMascarado="jo***@gmail.com" />),
  ).toMatch(REGIAO);
});

test("a entrada da equipe já tem a região do aviso antes de enviar", () => {
  expect(renderizar(<EntradaDaEquipe />)).toMatch(REGIAO);
});
