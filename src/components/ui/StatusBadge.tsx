import type { ReactNode } from "react";
import {
  Ban,
  Circle,
  CircleCheck,
  CirclePause,
  CircleX,
  Contrast,
  type LucideIcon,
} from "lucide-react";

import { Badge } from "./Badge";

export type GrupoStatus =
  | "aberto"
  | "andamento"
  | "aguardando"
  | "resolvido"
  | "recusado"
  | "cancelado";

// Cada grupo tem cor e forma próprias: a situação se lê pelo texto e pelo
// ícone, sem depender só da cor. As cores vêm dos tokens `status-*` (todos
// acima de 4,5:1 sobre o próprio fundo). Situações novas do portal entram num
// destes grupos, sem criar cor nova.
const GRUPOS: Record<GrupoStatus, { className: string; Icone: LucideIcon }> = {
  aberto: {
    className: "bg-status-aberto-bg text-status-aberto",
    Icone: Circle,
  },
  andamento: {
    className: "bg-status-andamento-bg text-status-andamento",
    Icone: Contrast,
  },
  aguardando: {
    className: "bg-status-aguardando-bg text-status-aguardando",
    Icone: CirclePause,
  },
  resolvido: {
    className: "bg-status-resolvido-bg text-status-resolvido",
    Icone: CircleCheck,
  },
  recusado: {
    className: "bg-status-recusado-bg text-status-recusado",
    Icone: Ban,
  },
  cancelado: { className: "bg-gray-100 text-gray-600", Icone: CircleX },
};

/** Situação de um item: `<StatusBadge grupo="resolvido">Enviado</StatusBadge>`. */
export function StatusBadge({
  grupo,
  children,
}: {
  grupo: GrupoStatus;
  children: ReactNode;
}) {
  const { className, Icone } = GRUPOS[grupo];

  return (
    <Badge
      className={className}
      icon={<Icone aria-hidden="true" className="size-3.5 shrink-0" />}
    >
      {children}
    </Badge>
  );
}
