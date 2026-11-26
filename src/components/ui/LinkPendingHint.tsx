"use client";

import clsx from "clsx";
import { useLinkStatus } from "next/link";

/**
 * Ponto que pulsa dentro de um `<Link>` enquanto a navegação não termina.
 * Ocupa sempre o mesmo espaço e só aparece depois de 100 ms (`.link-hint` em
 * globals.css), para não piscar quando a tela chega rápido. Coloque-o como
 * último filho do `<Link>`.
 */
export function LinkPendingHint({ className }: { className?: string }) {
  const { pending } = useLinkStatus();
  return (
    <span
      aria-hidden="true"
      className={clsx("link-hint", pending && "is-pending", className)}
    />
  );
}
