import type { ReactNode } from "react";
import { CircleCheck } from "lucide-react";

/** Selo em pílula sobre o painel escuro: o que a pessoa encontra no portal. */
export function SeloComVisto({ children }: { children: ReactNode }) {
  return (
    <li className="text-apoio inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/8 py-2 pr-4 pl-3 font-semibold text-white">
      <CircleCheck
        aria-hidden="true"
        className="text-primary size-4 shrink-0"
      />
      {children}
    </li>
  );
}
