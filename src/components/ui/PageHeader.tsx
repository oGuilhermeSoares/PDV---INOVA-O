import type { ReactNode } from "react";

/**
 * Topo da página: o título (`h1`, um por tela), a descrição e as ações. O
 * título é o mesmo nome da tela no menu e na aba do navegador.
 */
export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div className="min-w-0">
        <h1 className="font-titulo text-pagina font-semibold tracking-tight text-gray-900">
          {title}
        </h1>
        {description && (
          <p className="text-corpo mt-2 max-w-[72ch] text-gray-600">
            {description}
          </p>
        )}
      </div>
      {actions && (
        <div className="flex shrink-0 items-center gap-2">{actions}</div>
      )}
    </div>
  );
}
