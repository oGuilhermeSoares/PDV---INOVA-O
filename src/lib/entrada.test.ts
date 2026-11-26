import { describe, expect, test } from "vitest";

import { MENSAGENS, mensagemDoCnpj } from "@/lib/entrada";

describe("mensagemDoCnpj", () => {
  test.each([
    ["vazio", MENSAGENS.cnpjVazio],
    ["tamanho", MENSAGENS.cnpjTamanho],
    ["caractere", MENSAGENS.cnpjCaractere],
    ["digito", MENSAGENS.cnpjNaoConfere],
    ["repetido", MENSAGENS.cnpjNaoConfere],
  ] as const)("o motivo %s mostra a mensagem certa", (motivo, texto) => {
    expect(mensagemDoCnpj(motivo)).toBe(texto);
  });
});

// Os textos são os do desenho aprovado: o que aconteceu e o que fazer.
describe("MENSAGENS", () => {
  test.each([
    ["cnpjVazio", "Digite o CNPJ de uma das suas lojas."],
    ["cnpjTamanho", "O CNPJ tem 14 caracteres. Confira e digite de novo."],
    [
      "cnpjCaractere",
      "O CNPJ só tem letras e números. Confira e digite de novo.",
    ],
    [
      "cnpjNaoConfere",
      "Este CNPJ não confere. Confira os números e digite de novo.",
    ],
    [
      "acessoNaoLiberado",
      "O acesso pelo portal ainda não foi liberado. Por enquanto, a equipe de PDV continua mandando os relatórios por e-mail.",
    ],
    [
      "codigoFormato",
      "O código tem 6 números. Confira o e-mail e digite de novo.",
    ],
    ["codigoErrado", "Código errado. Você ainda tem 4 tentativas."],
    ["codigoVencido", "Este código venceu. Peça um novo."],
    ["codigoBloqueado", "Você errou o código 5 vezes. Peça um novo código."],
    ["equipeNaoLigada", "A entrada da equipe ainda não foi ligada."],
    [
      "equipeSemAcesso",
      "Sua conta ainda não tem acesso ao portal. Peça a liberação a quem administra o portal.",
    ],
    [
      "equipeForaDoDominio",
      "Use a sua conta @farmaciasassociadas.com.br. Contas pessoais não entram.",
    ],
  ] as const)("%s", (chave, texto) => {
    expect(MENSAGENS[chave]).toBe(texto);
  });

  test("codigoReenviado diz para qual e-mail foi o código", () => {
    expect(MENSAGENS.codigoReenviado("jo***@gmail.com")).toBe(
      "Enviamos um novo código para jo***@gmail.com.",
    );
  });
});
