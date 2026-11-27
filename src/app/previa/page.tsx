import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { buttonStyles } from "@/components/ui/Button";
import { LinkPendingHint } from "@/components/ui/LinkPendingHint";
import { PageHeader } from "@/components/ui/PageHeader";
import { SectionTitle } from "@/components/ui/SectionTitle";

import { garantirPrevia } from "./garantir-previa";
import { TELAS } from "./telas";

export const metadata: Metadata = { title: "Prévia" };

const GRUPOS = [
  { grupo: "Associado", titulo: "Entrada do associado" },
  { grupo: "Loja", titulo: "Tela da loja" },
  { grupo: "Envio", titulo: "Envio de fotos e vídeos" },
  { grupo: "Equipe", titulo: "Entrada da equipe" },
] as const;

export default function Previa() {
  garantirPrevia();

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:py-16">
      <PageHeader
        title="Prévia do design system"
        description="Só aparece no ambiente de desenvolvimento."
        actions={
          <Link
            href="/previa/componentes"
            className={buttonStyles({ variant: "secondary" })}
          >
            Ver os componentes
          </Link>
        }
      />

      {GRUPOS.map(({ grupo, titulo }) => (
        <section key={grupo} className="mt-10">
          <SectionTitle tamanho="secao">{titulo}</SectionTitle>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {Object.entries(TELAS)
              .filter(([, item]) => item.grupo === grupo)
              .map(([chave, item]) => (
                <li key={chave}>
                  <Link
                    href={`/previa/${chave}`}
                    className="text-corpo hover:border-primary-strong hover:shadow-flutuante flex min-h-12 items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 font-semibold text-gray-900 transition"
                  >
                    <span className="flex-1">{item.titulo}</span>
                    <LinkPendingHint />
                    <ChevronRight
                      aria-hidden="true"
                      className="size-4 shrink-0 text-gray-600"
                    />
                  </Link>
                </li>
              ))}
          </ul>
        </section>
      ))}
    </main>
  );
}
