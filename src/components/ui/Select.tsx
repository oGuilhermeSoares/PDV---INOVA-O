import type { ComponentProps } from "react";
import clsx from "clsx";

import { fieldStyles } from "./Input";

/** Escolha única numa lista curta. Para duas a cinco opções, prefira radios. */
export function Select({ className, ...props }: ComponentProps<"select">) {
  return <select {...props} className={clsx(fieldStyles, className)} />;
}
