import type { ReactNode } from "react";
import clsx from "clsx";

import { ArquivoIcon } from "@/components/ui/ArquivoIcon";

import {
  BarraDeTexto,
  BlocoDeFoto,
  LinhaDeArquivo,
  PilulaDeEnvio,
} from "./MiniaturasDaLoja";

/** Uma folha de relatório em PDF, com barras cinzas no lugar do texto. */
function FolhaDeRelatorio({ className }: { className?: string }) {
  return (
    <div
      className={clsx(
        "w-32 rounded-xl border border-gray-200 bg-white p-4 shadow-sm",
        className,
      )}
    >
      <span className="bg-primary-light text-primary-strong flex size-9 items-center justify-center rounded-lg">
        <ArquivoIcon tipo="pdf" className="size-5" />
      </span>
      <BarraDeTexto className="mt-4 w-4/5" />
      <BarraDeTexto className="mt-2 w-full" />
      <BarraDeTexto className="mt-2 w-3/5" />
    </div>
  );
}

const CARTOES: { titulo: string; texto: string; ilustracao: ReactNode }[] = [
  {
    titulo: "Relatórios da assessoria",
    texto:
      "O relatório que a equipe de PDV faz depois de cada visita, em PDF. Abre no navegador.",
    ilustracao: (
      // Duas folhas empilhadas: uma por visita.
      <div className="relative flex items-center justify-center">
        <FolhaDeRelatorio className="absolute -translate-x-10 -rotate-6 opacity-70" />
        <FolhaDeRelatorio className="relative translate-x-6 rotate-2" />
      </div>
    ),
  },
  {
    titulo: "Estudo de mercado",
    texto: "Os estudos BRICK da região da sua loja, em PDF e em planilha.",
    ilustracao: (
      <div className="w-full max-w-64 space-y-2">
        <LinhaDeArquivo tipo="pdf" nome="Estudo BRICK" />
        <LinhaDeArquivo tipo="planilha" nome="Planilha de produtos" />
      </div>
    ),
  },
  {
    titulo: "Fotos e vídeos",
    texto:
      "O antes e o depois da assessoria. E você manda fotos novas direto daqui, sem passar pelo WhatsApp.",
    ilustracao: (
      <div className="flex flex-col items-center gap-3">
        <div className="grid w-40 grid-cols-3 gap-2">
          <BlocoDeFoto />
          <BlocoDeFoto video />
          <BlocoDeFoto />
          <BlocoDeFoto />
          <BlocoDeFoto />
          <BlocoDeFoto />
        </div>
        <PilulaDeEnvio />
      </div>
    ),
  },
];

/** "O que você encontra no portal": os três tipos de material, em cartões. */
export function SecaoOQueTem() {
  return (
    <section
      id="o-que-tem"
      aria-labelledby="o-que-tem-titulo"
      className="mx-auto max-w-6xl px-4 py-20 sm:px-8 lg:py-28"
    >
      <h2
        id="o-que-tem-titulo"
        className="font-titulo text-secao lg:text-pagina text-center font-semibold tracking-tight text-balance text-gray-900"
      >
        O que você encontra no portal
      </h2>
      <ul className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
        {CARTOES.map(({ titulo, texto, ilustracao }) => (
          <li
            key={titulo}
            className="revelar rounded-2xl border border-gray-200 bg-white p-6"
          >
            <div
              aria-hidden="true"
              className="flex h-44 items-center justify-center overflow-hidden rounded-xl bg-gray-100 px-6"
            >
              {ilustracao}
            </div>
            <h3 className="text-destaque mt-6 font-semibold text-gray-900">
              {titulo}
            </h3>
            <p className="text-corpo mt-2 text-gray-600">{texto}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
