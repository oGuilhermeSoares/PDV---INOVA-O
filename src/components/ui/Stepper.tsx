import clsx from "clsx";
import { Check } from "lucide-react";

export type Etapa = {
  rotulo: string;
  /** `negativa` é a etapa final cinza de um fluxo encerrado (recusado, cancelado). */
  estado: "concluida" | "atual" | "futura" | "negativa";
};

const BOLAS: Record<Etapa["estado"], string> = {
  atual: "border-primary bg-primary text-gray-900 ring-3 ring-primary/25",
  negativa: "border-gray-500 bg-gray-200 text-gray-700",
  concluida: "border-primary/40 bg-primary-light text-primary-strong",
  futura: "border-gray-300 bg-white text-gray-500",
};

const ROTULOS: Record<Etapa["estado"], string> = {
  atual: "font-semibold text-gray-900",
  negativa: "font-semibold text-gray-900",
  concluida: "text-gray-600",
  futura: "text-gray-500",
};

/**
 * Linha de etapas, quando elas são uma sequência de verdade (por isso são
 * numeradas). A etapa atual leva `aria-current="step"`, e a lista diz qual é
 * no `aria-label`.
 */
export function Stepper({
  etapas,
  rotulo,
  className,
}: {
  etapas: Etapa[];
  /** Nome da sequência, como "Etapas do envio". */
  rotulo: string;
  className?: string;
}) {
  const atual = etapas.find(
    (etapa) => etapa.estado === "atual" || etapa.estado === "negativa",
  );

  return (
    <ol
      className={clsx("grid w-full", className)}
      style={{
        gridTemplateColumns: `repeat(${etapas.length}, minmax(0, 1fr))`,
      }}
      aria-label={atual ? `${rotulo}. Atual: ${atual.rotulo}` : rotulo}
    >
      {etapas.map((etapa, i) => {
        const feita = etapa.estado !== "futura";
        const traco = feita
          ? etapa.estado === "negativa"
            ? "bg-gray-300"
            : "bg-primary"
          : "bg-gray-200";

        return (
          <li
            key={`${etapa.rotulo}-${i}`}
            className="relative px-0.5 text-center"
            aria-current={etapa === atual ? "step" : undefined}
          >
            {i > 0 && (
              <span
                aria-hidden="true"
                className={clsx(
                  "absolute top-3.5 right-1/2 left-[-50%] h-0.5",
                  traco,
                )}
              />
            )}
            <span
              aria-hidden="true"
              className={clsx(
                "text-apoio relative z-1 mx-auto mb-2 flex size-7 items-center justify-center rounded-full border font-semibold",
                BOLAS[etapa.estado],
              )}
            >
              {etapa.estado === "concluida" ? (
                <Check className="size-4" />
              ) : (
                i + 1
              )}
            </span>
            <span
              className={clsx(
                "text-apoio block leading-tight",
                ROTULOS[etapa.estado],
              )}
            >
              {etapa.rotulo}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
