import { expect, test } from "vitest";

import { entrarComMicrosoft } from "@/app/admin/entrar/acoes";
import { MENSAGENS } from "@/lib/entrada";

test("enquanto o card #6 não chega, a entrada da equipe avisa que não foi ligada", async () => {
  expect(await entrarComMicrosoft()).toEqual({
    aviso: { tom: "atencao", texto: MENSAGENS.equipeNaoLigada },
  });
});
