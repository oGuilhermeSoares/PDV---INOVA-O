import "server-only";

import { notFound } from "next/navigation";

import { env } from "@/lib/env";

/** A prévia só existe no ambiente de desenvolvimento. Fora dele, dá 404. */
export function garantirPrevia(): void {
  if (env.NODE_ENV !== "development") notFound();
}
