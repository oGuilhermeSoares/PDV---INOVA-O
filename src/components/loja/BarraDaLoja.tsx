import Link from "next/link";
import { LogOut } from "lucide-react";

import { Logo } from "@/components/marca/Logo";

/**
 * Barra de cima da área do associado: sólida, em petróleo, porque é tela de
 * trabalho (o vidro fica na página de entrada). "Sair" volta à entrada; o card
 * #10 troca por uma ação que encerra a sessão.
 */
export function BarraDaLoja() {
  return (
    <header className="superficie-escura bg-petroleo-900 sticky top-0 z-30 border-b border-white/8 text-white">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-4 px-4 sm:px-8">
        <span className="flex items-center gap-2.5">
          <span className="flex shrink-0 rounded-full bg-white p-1">
            <Logo tamanho={36} />
          </span>
          <span className="text-corpo font-bold">Portal PDV</span>
        </span>
        <Link
          href="/entrar"
          className="text-apoio inline-flex min-h-11 items-center gap-2 rounded-full px-4 font-semibold text-white/72 transition-colors hover:bg-white/8 hover:text-white"
        >
          <LogOut aria-hidden="true" className="size-4" />
          Sair
        </Link>
      </div>
    </header>
  );
}
