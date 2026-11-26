import type { ReactNode } from "react";
import clsx from "clsx";
import {
  CircleAlert,
  CircleCheck,
  Info,
  TriangleAlert,
  type LucideIcon,
} from "lucide-react";

export type TomDoAviso = "erro" | "sucesso" | "atencao" | "info";

// As cores são as dos tokens de status: texto sobre o fundo do mesmo tom,
// todos acima de 4,5:1. O ícone muda com o tom, para não depender só da cor.
export const TONS_DO_AVISO: Record<
  TomDoAviso,
  { caixa: string; Icone: LucideIcon; role: "alert" | "status" }
> = {
  erro: {
    caixa:
      "border-status-recusado/30 bg-status-recusado-bg text-status-recusado",
    Icone: CircleAlert,
    role: "alert",
  },
  sucesso: {
    caixa:
      "border-status-resolvido/30 bg-status-resolvido-bg text-status-resolvido",
    Icone: CircleCheck,
    role: "status",
  },
  atencao: {
    caixa: "border-status-aberto/30 bg-status-aberto-bg text-status-aberto",
    Icone: TriangleAlert,
    role: "status",
  },
  info: {
    caixa: "border-gray-200 bg-gray-50 text-gray-700",
    Icone: Info,
    role: "status",
  },
};

/**
 * Aviso dentro da página, perto do que ele comenta. Erro usa `role="alert"`
 * (anunciado na hora); os demais usam `role="status"`. Escreva o que
 * aconteceu e o que fazer.
 *
 * `anunciar={false}` tira o papel: serve quando o aviso fica dentro de uma
 * região que já anuncia, como a `RegiaoDeAviso`.
 */
export function Aviso({
  tom = "info",
  anunciar = true,
  children,
  className,
}: {
  tom?: TomDoAviso;
  anunciar?: boolean;
  children: ReactNode;
  className?: string;
}) {
  const { caixa, Icone, role } = TONS_DO_AVISO[tom];
  return (
    <div
      role={anunciar ? role : undefined}
      className={clsx(
        "text-corpo flex items-start gap-2.5 rounded-xl border px-4 py-3",
        caixa,
        className,
      )}
    >
      <Icone aria-hidden="true" className="mt-1 size-4 shrink-0" />
      <div className="min-w-0 wrap-break-word">{children}</div>
    </div>
  );
}

/**
 * Lugar fixo do aviso que volta de uma ação, como o envio de um formulário.
 * A região existe antes do aviso chegar: o leitor de tela só anuncia com
 * certeza o que muda dentro de uma região que já estava na página. Vazia, ela
 * não ocupa espaço; a margem (`className`) vai no aviso.
 */
export function RegiaoDeAviso({
  aviso,
  className,
}: {
  aviso?: { tom: TomDoAviso; texto: ReactNode } | null;
  className?: string;
}) {
  return (
    <div aria-live="polite" aria-atomic="true" data-regiao-de-aviso="">
      {aviso && (
        <Aviso tom={aviso.tom} anunciar={false} className={className}>
          {aviso.texto}
        </Aviso>
      )}
    </div>
  );
}
