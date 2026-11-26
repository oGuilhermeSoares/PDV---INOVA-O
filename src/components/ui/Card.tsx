import type { ComponentProps } from "react";
import clsx from "clsx";

const espacos = { none: "", sm: "p-4", md: "p-6", lg: "p-6 sm:p-8" };

/**
 * Superfície branca com borda suave. `elevado` acrescenta a sombra tingida de
 * petróleo, para o que flutua (como o cartão do formulário de entrada). Não
 * ponha cartão dentro de cartão.
 */
export function Card({
  padding = "md",
  elevado = false,
  className,
  ...props
}: ComponentProps<"div"> & {
  padding?: keyof typeof espacos;
  elevado?: boolean;
}) {
  return (
    <div
      {...props}
      className={clsx(
        "rounded-2xl border border-gray-200 bg-white",
        espacos[padding],
        elevado && "shadow-flutuante",
        className,
      )}
    />
  );
}
