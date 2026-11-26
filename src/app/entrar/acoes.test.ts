import { describe, expect, test } from "vitest";

import { conferirCodigo, pedirCodigo } from "@/app/entrar/acoes";
import { MENSAGENS } from "@/lib/entrada";

function formulario(campos: Record<string, string>) {
  const dados = new FormData();
  for (const [nome, valor] of Object.entries(campos)) dados.set(nome, valor);
  return dados;
}

const NAO_LIBERADO = {
  aviso: { tom: "atencao", texto: MENSAGENS.acessoNaoLiberado },
};

describe("pedirCodigo", () => {
  test("CNPJ vazio pede o CNPJ", async () => {
    expect(await pedirCodigo({}, formulario({ cnpj: "" }))).toEqual({
      erro: MENSAGENS.cnpjVazio,
      valor: "",
    });
  });

  test("sem o campo, conta como vazio", async () => {
    expect(await pedirCodigo({}, new FormData())).toEqual({
      erro: MENSAGENS.cnpjVazio,
      valor: "",
    });
  });

  test("CNPJ incompleto: explica e mantém o que foi digitado", async () => {
    expect(
      await pedirCodigo({}, formulario({ cnpj: "1122233300018" })),
    ).toEqual({ erro: MENSAGENS.cnpjTamanho, valor: "1122233300018" });
  });

  test("dígito verificador errado: o CNPJ não confere", async () => {
    expect(
      await pedirCodigo({}, formulario({ cnpj: "11.222.333/0001-82" })),
    ).toEqual({ erro: MENSAGENS.cnpjNaoConfere, valor: "11.222.333/0001-82" });
  });

  test("CNPJ válido, colado em blocos: formata e avisa que o acesso ainda não foi liberado", async () => {
    expect(
      await pedirCodigo({}, formulario({ cnpj: "11 222 333 0001 81" })),
    ).toEqual({ ...NAO_LIBERADO, valor: "11.222.333/0001-81" });
  });
});

describe("conferirCodigo", () => {
  test("código com letra ou incompleto pede os 6 números", async () => {
    expect(await conferirCodigo({}, formulario({ codigo: "12a" }))).toEqual({
      erro: MENSAGENS.codigoFormato,
    });
  });

  test("código no formato certo: o acesso ainda não foi liberado", async () => {
    expect(await conferirCodigo({}, formulario({ codigo: "123456" }))).toEqual(
      NAO_LIBERADO,
    );
  });

  test("pedir outro código também avisa que o acesso não foi liberado", async () => {
    expect(
      await conferirCodigo({}, formulario({ intencao: "reenviar" })),
    ).toEqual(NAO_LIBERADO);
  });
});
