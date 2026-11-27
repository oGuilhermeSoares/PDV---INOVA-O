import type { ReactNode } from "react";

/**
 * O título de um passo do envio: o número num círculo teal e o `h2`. O leitor
 * de tela ouve "Passo 1: Para onde vão".
 */
export function TituloDoPasso({
  numero,
  id,
  children,
}: {
  numero: number;
  id: string;
  children: ReactNode;
}) {
  return (
    <div className="flex items-center gap-3">
      <span
        aria-hidden="true"
        className="bg-primary-light text-primary-strong text-apoio flex size-8 shrink-0 items-center justify-center rounded-full font-semibold"
      >
        {numero}
      </span>
      <h2
        id={id}
        className="font-titulo text-secao font-semibold tracking-tight text-gray-900"
      >
        <span className="sr-only">Passo {numero}: </span>
        {children}
      </h2>
    </div>
  );
}
