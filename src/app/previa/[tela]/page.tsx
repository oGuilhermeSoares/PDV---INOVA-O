import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { garantirPrevia } from "../garantir-previa";
import { itemDaPrevia } from "../telas";

type Props = { params: Promise<{ tela: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  garantirPrevia();
  const item = itemDaPrevia((await params).tela);
  return item ? { title: `${item.titulo} · Prévia` } : {};
}

/** Uma tela de entrada inteira, num estado (veja a lista em /previa). */
export default async function TelaDaPrevia({ params }: Props) {
  garantirPrevia();
  const item = itemDaPrevia((await params).tela);
  if (!item) notFound();
  return item.tela;
}
