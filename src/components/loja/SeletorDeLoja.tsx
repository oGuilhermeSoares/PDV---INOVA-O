import Link from "next/link";
import { Check, ChevronDown } from "lucide-react";

import { nomeDaLoja } from "@/lib/loja";

export type OpcaoDeLoja = { id: string; nome: string; href: string };

/**
 * "Trocar loja": só aparece quando o associado tem duas lojas ou mais. É um
 * `<details>` nativo (abre pelo teclado, sem JavaScript) com um link por loja;
 * a atual leva `aria-current="page"` e o visto.
 *
 * Fica na faixa petróleo do topo da tela da loja: o "Trocar loja" é teal
 * (5,6:1 sobre o petróleo). A lista abre num cartão branco, então os links
 * voltam ao anel de foco das superfícies claras.
 */
export function SeletorDeLoja({
  lojas,
  atual,
}: {
  lojas: OpcaoDeLoja[];
  atual: string;
}) {
  if (lojas.length < 2) return null;

  return (
    <details className="group relative">
      <summary className="text-corpo text-primary inline-flex min-h-11 list-none items-center gap-1.5 rounded-lg font-semibold transition-colors hover:text-white [&::-webkit-details-marker]:hidden">
        Trocar loja
        <ChevronDown
          aria-hidden="true"
          className="size-4 transition-transform group-open:rotate-180"
        />
      </summary>
      <ul className="shadow-flutuante absolute left-0 z-20 mt-1 w-80 max-w-[calc(100vw-2rem)] rounded-xl border border-gray-200 bg-white p-1.5">
        {lojas.map((loja) => {
          const eAtual = loja.id === atual;
          return (
            <li key={loja.id}>
              <Link
                href={loja.href}
                aria-current={eAtual ? "page" : undefined}
                className="text-corpo outline-primary-strong flex min-h-11 items-center justify-between gap-3 rounded-lg px-3 py-2 text-gray-900 transition-colors hover:bg-gray-100 aria-[current=page]:font-semibold"
              >
                {nomeDaLoja(loja.nome)}
                {eAtual && (
                  <Check
                    aria-hidden="true"
                    className="text-primary-strong size-4 shrink-0"
                  />
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </details>
  );
}
