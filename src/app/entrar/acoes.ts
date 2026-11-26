"use server";

import { formatarCnpj, validarCnpj } from "@/lib/cnpj";
import { limparCodigo, TAMANHO_DO_CODIGO } from "@/lib/codigo";
import {
  MENSAGENS,
  mensagemDoCnpj,
  type RespostaDaEntrada,
} from "@/lib/entrada";

// Por enquanto, as ações só conferem o formato e avisam que o acesso ainda não
// foi liberado. O card #10 troca o corpo delas: achar o associado, gerar e
// enviar o código, conferir com os limites de tentativa e criar a sessão.

function campo(dados: FormData, nome: string): string {
  const valor = dados.get(nome);
  return typeof valor === "string" ? valor : "";
}

function acessoNaoLiberado(): RespostaDaEntrada {
  return { aviso: { tom: "atencao", texto: MENSAGENS.acessoNaoLiberado } };
}

/** Passo 1: o associado digita o CNPJ de uma das lojas. */
export async function pedirCodigo(
  _anterior: RespostaDaEntrada,
  dados: FormData,
): Promise<RespostaDaEntrada> {
  const valor = campo(dados, "cnpj");
  const resultado = validarCnpj(valor);
  if (!resultado.valido) {
    return { erro: mensagemDoCnpj(resultado.motivo), valor };
  }
  return { ...acessoNaoLiberado(), valor: formatarCnpj(resultado.cnpj) };
}

/** Passo 2: o código do e-mail, ou o pedido de um código novo. */
export async function conferirCodigo(
  _anterior: RespostaDaEntrada,
  dados: FormData,
): Promise<RespostaDaEntrada> {
  if (campo(dados, "intencao") === "reenviar") return acessoNaoLiberado();

  if (limparCodigo(campo(dados, "codigo")).length !== TAMANHO_DO_CODIGO) {
    return { erro: MENSAGENS.codigoFormato };
  }
  return acessoNaoLiberado();
}
