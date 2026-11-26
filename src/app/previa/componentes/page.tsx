import type { Metadata } from "next";

import { PageHeader } from "@/components/ui/PageHeader";
import { VoltarLink } from "@/components/ui/VoltarLink";

import { garantirPrevia } from "../garantir-previa";
import {
  SECOES,
  SecaoAvisos,
  SecaoBotoes,
  SecaoCampos,
  SecaoCores,
  SecaoDialogo,
  SecaoEtapas,
  SecaoMarca,
  SecaoNavegacao,
  SecaoSelos,
  SecaoSuperficies,
  SecaoTabela,
  SecaoTipografia,
} from "./secoes";

export const metadata: Metadata = { title: "Componentes · Prévia" };

export default function Componentes() {
  garantirPrevia();

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:py-16">
      <VoltarLink href="/previa">Prévia</VoltarLink>
      <div className="mt-2">
        <PageHeader
          title="Componentes"
          description="Tokens e componentes do design system do Portal PDV. O guia de cada um fica em docs/design-system/componentes."
        />
      </div>

      <nav aria-label="Seções" className="mt-6">
        <ul className="flex flex-wrap gap-2">
          {SECOES.map((secao) => (
            <li key={secao.id}>
              <a
                href={`#${secao.id}`}
                className="text-apoio hover:border-primary-strong inline-flex min-h-11 items-center rounded-full border border-gray-200 bg-white px-4 font-semibold text-gray-700 transition-colors hover:text-gray-900"
              >
                {secao.titulo}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-10 space-y-12">
        <SecaoCores />
        <SecaoTipografia />
        <SecaoBotoes />
        <SecaoCampos />
        <SecaoAvisos />
        <SecaoSelos />
        <SecaoEtapas />
        <SecaoTabela />
        <SecaoSuperficies />
        <SecaoDialogo />
        <SecaoNavegacao />
        <SecaoMarca />
      </div>
    </main>
  );
}
