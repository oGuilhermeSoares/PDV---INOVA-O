"use server";

import { MENSAGENS, type RespostaDaEntrada } from "@/lib/entrada";

/**
 * Entrada da equipe com a conta Microsoft. O card #6 troca o corpo pelo login
 * do Auth.js com o Entra ID; por enquanto, avisa que a entrada não foi ligada.
 *
 * Serve ao `useActionState`, que passa o estado anterior e o formulário. Ela
 * ainda não usa nenhum dos dois, então não os declara.
 */
export async function entrarComMicrosoft(): Promise<RespostaDaEntrada> {
  return { aviso: { tom: "atencao", texto: MENSAGENS.equipeNaoLigada } };
}
