import type { ReactNode } from "react";
import { Inbox, type LucideIcon } from "lucide-react";

import { SectionTitle } from "./SectionTitle";

/**
 * Lista ou pasta sem itens. Diga o que vai aparecer ali e, se houver, a ação
 * que resolve. Numa busca sem resultado, diga o filtro ativo.
 */
export function EmptyState({
  title,
  description,
  action,
  icon: Icone = Inbox,
  as = "h2",
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  icon?: LucideIcon;
  /** `h3` quando o estado vazio fica dentro de uma seção que já tem `h2`. */
  as?: "h2" | "h3";
}) {
  return (
    <div className="flex flex-col items-center px-6 py-12 text-center">
      <span className="bg-primary-light text-primary-strong mb-4 flex size-12 items-center justify-center rounded-xl">
        <Icone className="size-6" aria-hidden="true" />
      </span>
      <SectionTitle as={as}>{title}</SectionTitle>
      {description && (
        <p className="text-corpo mt-1 max-w-sm text-gray-600">{description}</p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
