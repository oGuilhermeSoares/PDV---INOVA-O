import type { ComponentProps } from "react";
import clsx from "clsx";

import { fieldStyles } from "./Input";

export function Textarea({ className, ...props }: ComponentProps<"textarea">) {
  return (
    <textarea {...props} className={clsx(fieldStyles, "resize-y", className)} />
  );
}
