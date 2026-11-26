import type { ComponentProps } from "react";
import clsx from "clsx";

// A borda gray-500 tem 4,8:1 sobre branco: o limite do campo precisa de 3:1
// para ser percebido. 48 px de altura passa do alvo mínimo de toque, e o texto
// de 16 px evita o zoom do iPhone ao tocar no campo.
export const fieldStyles =
  "w-full min-w-0 min-h-12 rounded-xl border border-gray-500 bg-white px-3.5 py-2.5 text-corpo text-gray-900 placeholder:text-gray-500 transition-colors hover:border-gray-700 focus:border-primary-strong disabled:cursor-not-allowed disabled:bg-gray-50 disabled:opacity-60 aria-invalid:border-red-700";

export function Input({ className, ...props }: ComponentProps<"input">) {
  return <input {...props} className={clsx(fieldStyles, className)} />;
}
