"use client";

import { TelaDeEnvio } from "@/components/envio/TelaDeEnvio";
import type { OpcaoDeLoja } from "@/components/loja/SeletorDeLoja";
import type { EnviarArquivo, EstadoInicialDoEnvio } from "@/lib/envio";

const PASSOS = 10;
const MS_POR_PASSO = 120;

/**
 * Só a prévia: finge o envio de um arquivo. A barra anda em dez passos e o
 * arquivo sempre termina bem; nada sai do navegador.
 */
const simularEnvio: EnviarArquivo = (_arquivo, _destino, opcoes) =>
  new Promise((resolver, rejeitar) => {
    let passo = 0;
    const parar = () => {
      clearTimeout(relogio);
      rejeitar(new DOMException("Envio parado", "AbortError"));
    };
    const andar = () => {
      passo++;
      opcoes.aoProgredir(passo / PASSOS);
      if (passo < PASSOS) {
        relogio = setTimeout(andar, MS_POR_PASSO);
      } else {
        opcoes.sinal.removeEventListener("abort", parar);
        resolver();
      }
    };
    let relogio = setTimeout(andar, MS_POR_PASSO);
    opcoes.sinal.addEventListener("abort", parar, { once: true });
  });

/**
 * A tela de envio na prévia, com o envio simulado. A fila de exemplo não tem
 * os arquivos de verdade: cada item ganha aqui um `File` vazio no lugar, para
 * o "Tentar de novo" ter o que mandar.
 */
export function EnvioDaPrevia({
  lojas,
  lojaId,
  estadoInicial,
}: {
  lojas: OpcaoDeLoja[];
  lojaId: string;
  estadoInicial?: EstadoInicialDoEnvio;
}) {
  const arquivos = new Map(
    (estadoInicial?.fila ?? []).map((item) => [
      item.id,
      new File([], item.nome),
    ]),
  );

  return (
    <TelaDeEnvio
      lojas={lojas}
      lojaId={lojaId}
      enviar={simularEnvio}
      estadoInicial={{ ...estadoInicial, arquivos }}
    />
  );
}
