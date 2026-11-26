"use client";

import { useEffect, useState, type ReactNode } from "react";

import { formatarContagem } from "@/lib/tempo";

/**
 * Contagem até o associado poder pedir outro código. Quando o tempo acaba,
 * aparece a `acao` (o botão "Reenviar código").
 *
 * A conta usa a hora de término, não um contador que desce: com a aba em
 * segundo plano o navegador atrasa o relógio, e o tempo continua certo. Para
 * recomeçar a contagem, troque a `key` do componente.
 */
export function ReenvioDeCodigo({
  segundos,
  acao,
}: {
  segundos: number;
  acao: ReactNode;
}) {
  const [restante, setRestante] = useState(segundos);

  useEffect(() => {
    if (segundos <= 0) return;
    const fim = Date.now() + segundos * 1000;
    const relogio = setInterval(() => {
      const falta = (fim - Date.now()) / 1000;
      setRestante(Math.max(0, falta));
      if (falta <= 0) clearInterval(relogio);
    }, 1000);
    return () => clearInterval(relogio);
  }, [segundos]);

  const acabou = restante <= 0;

  return (
    <div className="flex min-h-11 items-center justify-center text-center">
      {acabou ? (
        acao
      ) : (
        // Fora de aria-live: o leitor de tela não lê a contagem a cada segundo.
        <p className="text-apoio text-gray-600">
          Não chegou? Você pode pedir outro em{" "}
          <span className="font-semibold text-gray-900 tabular-nums">
            {formatarContagem(restante)}
          </span>
          .
        </p>
      )}
      <p className="sr-only" aria-live="polite">
        {acabou ? "Você já pode pedir outro código." : ""}
      </p>
    </div>
  );
}
