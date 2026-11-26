import { describe, expect, test } from "vitest";

import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { renderizar } from "@/testes/renderizar";

describe("Field", () => {
  test("liga o rótulo, a dica e o erro ao campo", () => {
    const html = renderizar(
      <Field
        id="cnpj"
        label="CNPJ da loja"
        dica="Com ou sem pontuação."
        erro="Este CNPJ não confere."
      >
        {(campo) => <Input {...campo} name="cnpj" />}
      </Field>,
    );
    expect(html).toContain('for="cnpj"');
    expect(html).toContain('aria-describedby="cnpj-dica cnpj-erro"');
    expect(html).toContain('aria-invalid="true"');
    expect(html).toContain('<p id="cnpj-erro" role="alert"');
  });

  test("sem erro, o campo não fica marcado como inválido", () => {
    const html = renderizar(
      <Field id="cnpj" label="CNPJ da loja" dica="Com ou sem pontuação.">
        {(campo) => <Input {...campo} name="cnpj" />}
      </Field>,
    );
    // O atributo, não a classe `aria-invalid:border-red-700` do campo.
    expect(html).not.toMatch(/\saria-invalid="/);
    expect(html).toContain('aria-describedby="cnpj-dica"');
  });

  test("campo obrigatório diz isso por extenso", () => {
    const html = renderizar(
      <Field id="nome" label="Nome" obrigatorio>
        {(campo) => <Input {...campo} name="nome" />}
      </Field>,
    );
    expect(html).toContain("(obrigatório)");
  });
});
