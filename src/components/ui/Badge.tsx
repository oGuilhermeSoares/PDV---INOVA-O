import type { ComponentProps, ReactNode } from "react";
import clsx from "clsx";

/**
 * Rótulo curto em pílula. `className` traz o par de cores (padrão
 * `bg-gray-100 text-gray-600`), sempre um par de texto e fundo com 4,5:1 ou
 * mais, como `bg-accent-light text-accent-strong`.
 */
export function Badge({
  className = "bg-gray-100 text-gray-600",
  dot = false,
  icon,
  children,
  ...props
}: ComponentProps<"span"> & { dot?: boolean; icon?: ReactNode }) {
  return (
    <span
      {...props}
      className={clsx(
        "text-apoio inline-flex max-w-full items-center gap-1.5 rounded-full px-2.5 py-1 leading-4 font-semibold whitespace-nowrap",
        className,
      )}
    >
      {icon}
      {dot && (
        <span
          aria-hidden="true"
          className="size-1.5 shrink-0 rounded-full bg-current"
        />
      )}
      {children}
    </span>
  );
}
