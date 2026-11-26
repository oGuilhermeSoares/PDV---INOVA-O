import { describe, expect, test } from "vitest";

import { formatarCnpj, normalizarCnpj, validarCnpj } from "@/lib/cnpj";

describe("normalizarCnpj", () => {
  test("tira pontuação e espaços das pontas", () => {
    expect(normalizarCnpj(" 11.222.333/0001-81 ")).toBe("11222333000181");
  });

  test("tira os espaços do meio, de quem cola o CNPJ em blocos", () => {
    expect(normalizarCnpj("11 222 333 0001 81")).toBe("11222333000181");
  });

  test("passa as letras do CNPJ alfanumérico para maiúsculas", () => {
    expect(normalizarCnpj("12.abc.345/01de-35")).toBe("12ABC34501DE35");
  });
});

describe("validarCnpj", () => {
  test("aceita um CNPJ só de números, com pontuação", () => {
    expect(validarCnpj("11.222.333/0001-81")).toEqual({
      valido: true,
      cnpj: "11222333000181",
    });
  });

  test.each(["12.ABC.345/01DE-35", "12abc34501de35"])(
    "aceita o CNPJ com letras %s (exemplo da Receita)",
    (valor) => {
      expect(validarCnpj(valor)).toEqual({
        valido: true,
        cnpj: "12ABC34501DE35",
      });
    },
  );

  test.each(["", "   "])("recusa %j como vazio", (valor) => {
    expect(validarCnpj(valor)).toEqual({ valido: false, motivo: "vazio" });
  });

  test.each(["1122233300018", "112223330001811"])(
    "recusa %s pelo tamanho",
    (valor) => {
      expect(validarCnpj(valor)).toEqual({ valido: false, motivo: "tamanho" });
    },
  );

  test.each(["11.222.333/0001-8X", "11.222.333/0001-8!"])(
    "recusa %s por caractere inválido (o dígito verificador é só número)",
    (valor) => {
      expect(validarCnpj(valor)).toEqual({
        valido: false,
        motivo: "caractere",
      });
    },
  );

  test("recusa um dígito verificador errado", () => {
    expect(validarCnpj("11.222.333/0001-82")).toEqual({
      valido: false,
      motivo: "digito",
    });
  });

  test.each(["11111111111111", "00000000000000"])(
    "recusa a sequência repetida %s",
    (valor) => {
      expect(validarCnpj(valor)).toEqual({ valido: false, motivo: "repetido" });
    },
  );
});

describe("formatarCnpj", () => {
  test("formata um CNPJ só de números", () => {
    expect(formatarCnpj("11222333000181")).toBe("11.222.333/0001-81");
  });

  test("formata um CNPJ com letras", () => {
    expect(formatarCnpj("12ABC34501DE35")).toBe("12.ABC.345/01DE-35");
  });
});
