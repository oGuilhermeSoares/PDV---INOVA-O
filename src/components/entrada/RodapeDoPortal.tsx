import Link from "next/link";

import { Logo } from "@/components/marca/Logo";

import { DecoracaoDoPainel } from "./DecoracaoDoPainel";

/**
 * Rodapé da página do associado: a marca, o link da equipe e a linha do
 * setor, sobre o petróleo com a mesma decoração do hero (arcos e brilho). Sem
 * marca d'água: o "Portal PDV" gigante ao fundo pesava e repetia o nome.
 */
export function RodapeDoPortal() {
  return (
    <footer className="superficie-escura bg-petroleo-950 relative isolate overflow-clip text-white">
      <DecoracaoDoPainel />
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-8">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <span className="flex shrink-0 rounded-full bg-white p-1.5 ring-4 ring-white/10">
              <Logo tamanho={36} />
            </span>
            <div className="leading-tight">
              <p className="text-destaque font-bold">Portal PDV</p>
              <p className="text-apoio text-white/72">Farmácias Associadas</p>
            </div>
          </div>
          <p className="text-corpo text-white/72">
            É da equipe de PDV?{" "}
            <Link
              href="/admin/entrar"
              className="text-primary decoration-primary/40 hover:decoration-primary inline-flex min-h-11 items-center font-semibold underline underline-offset-4 transition-colors"
            >
              Entre com a conta Microsoft
            </Link>
          </p>
        </div>
        <p className="text-apoio mt-10 border-t border-white/12 pt-6 text-white/72">
          Setor de PDV · Farmácias Associadas
        </p>
      </div>
    </footer>
  );
}
