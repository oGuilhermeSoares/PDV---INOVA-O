import {
  ChartColumn,
  Construction,
  FileText,
  Images,
  Upload,
  type LucideIcon,
} from "lucide-react";

import { Logo } from "@/components/marca/logo";

// Página provisória: vira a tela de login do associado no card #10.

const RECURSOS: { icone: LucideIcon; titulo: string; texto: string }[] = [
  {
    icone: FileText,
    titulo: "Relatórios da assessoria",
    texto: "O relatório que a equipe de PDV faz depois de cada visita.",
  },
  {
    icone: ChartColumn,
    titulo: "Estudo de mercado",
    texto: "Os estudos BRICK da região da sua loja, em PDF e planilha.",
  },
  {
    icone: Images,
    titulo: "Fotos e vídeos da loja",
    texto: "O antes e o depois da assessoria, organizados por loja.",
  },
  {
    icone: Upload,
    titulo: "Envio de fotos para a equipe",
    texto: "Mande fotos e vídeos direto por aqui, sem passar pelo WhatsApp.",
  },
];

export default function Inicio() {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="bg-marca">
        <div className="text-texto mx-auto max-w-2xl px-4 py-5 sm:px-6">
          <Logo />
        </div>
      </header>

      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-10 sm:px-6">
        <h1 className="text-3xl leading-tight font-bold sm:text-4xl">
          Portal do Associado
        </h1>
        <p className="text-texto-suave mt-3 max-w-prose text-lg leading-relaxed">
          Aqui você vai acompanhar a assessoria de PDV das suas lojas, num lugar
          só e quando quiser.
        </p>

        <ul className="mt-8 space-y-5">
          {RECURSOS.map(({ icone: Icone, titulo, texto }) => (
            <li key={titulo} className="flex gap-4">
              <span className="bg-primary-light text-primary flex size-11 shrink-0 items-center justify-center rounded-lg">
                <Icone aria-hidden className="size-5" />
              </span>
              <span>
                <span className="block font-bold">{titulo}</span>
                <span className="text-texto-suave block">{texto}</span>
              </span>
            </li>
          ))}
        </ul>

        <p
          role="status"
          className="border-accent bg-accent-light mt-10 flex gap-3 rounded-lg border-l-4 p-4"
        >
          <Construction
            aria-hidden
            className="text-accent-dark mt-0.5 size-5 shrink-0"
          />
          <span>
            <span className="block font-bold">
              O portal está em construção.
            </span>
            <span className="text-texto-suave block">
              Por enquanto, a equipe de PDV continua enviando os relatórios por
              e-mail.
            </span>
          </span>
        </p>
      </main>

      <footer className="border-borda border-t">
        <p className="text-texto-suave mx-auto max-w-2xl px-4 py-5 text-sm sm:px-6">
          Setor de PDV da Farmácias Associadas
        </p>
      </footer>
    </div>
  );
}
