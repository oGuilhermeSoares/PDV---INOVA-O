import type { ReactNode } from "react";
import Link from "next/link";
import clsx from "clsx";
import { ChevronLeft } from "lucide-react";

/**
 * Link de volta no topo das telas internas, com 44 px de altura para o toque.
 * O texto é o nome da tela de destino ("Início", "Trocar CNPJ"), sem a palavra
 * "voltar". `escuro` é para a faixa petróleo, como a da tela de envio.
 */
export function VoltarLink({
  href,
  escuro = false,
  children,
}: {
  href: string;
  escuro?: boolean;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className={clsx(
        "text-corpo -ml-1 inline-flex min-h-11 items-center gap-1 rounded-lg pr-2 transition-colors",
        escuro
          ? "text-white/72 hover:text-white"
          : "text-gray-600 hover:text-gray-900",
      )}
    >
      <ChevronLeft aria-hidden="true" className="size-4 shrink-0" />
      {children}
    </Link>
  );
}
