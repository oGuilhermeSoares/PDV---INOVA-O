import type { ComponentProps } from "react";
import clsx from "clsx";

// Listas com várias colunas no computador. No celular, troque cada linha por
// um cartão. O contêiner (borda, raio e rolagem) e as linhas ficam com quem
// usa. Números e datas com `tabular-nums`.

export function Table({ className, ...props }: ComponentProps<"table">) {
  return (
    <table
      {...props}
      className={clsx("text-corpo w-full border-collapse text-left", className)}
    />
  );
}

export function TableHead({ className, ...props }: ComponentProps<"th">) {
  return (
    <th
      scope="col"
      {...props}
      className={clsx(
        "text-apoio sticky top-0 z-10 border-b border-gray-200 bg-gray-50 px-4 py-3 font-semibold text-gray-600",
        className,
      )}
    />
  );
}

export function TableCell({ className, ...props }: ComponentProps<"td">) {
  return (
    <td {...props} className={clsx("px-4 py-4 align-middle", className)} />
  );
}
