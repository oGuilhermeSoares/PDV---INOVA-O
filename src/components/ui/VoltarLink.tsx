import type { ReactNode } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

/**
 * Link de volta no topo das telas internas, com 44 px de altura para o toque.
 * O texto é o nome da tela de destino ("Início", "Trocar CNPJ"), sem a palavra
 * "voltar".
 */
export function VoltarLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className="text-corpo -ml-1 inline-flex min-h-11 items-center gap-1 rounded-lg pr-2 text-gray-600 transition-colors hover:text-gray-900"
    >
      <ChevronLeft aria-hidden="true" className="size-4 shrink-0" />
      {children}
    </Link>
  );
}
