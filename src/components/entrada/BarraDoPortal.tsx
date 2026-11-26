import type { ReactNode } from "react";

import { Logo } from "@/components/marca/Logo";

/**
 * Barra de vidro fixa no topo das telas de entrada, como a do clinia: uma
 * pílula em petróleo a 75%, com desfoque. A opacidade não pode baixar: com
 * menos, o texto branco reprova quando a barra passa sobre uma seção clara (o
 * teste confere).
 *
 * `atalhos` levam às seções da página (só a partir de 1024 px); `acao` fica à
 * direita, como o botão "Entrar".
 */
export function BarraDoPortal({
  atalhos,
  acao,
}: {
  atalhos?: { href: string; rotulo: string }[];
  acao?: ReactNode;
}) {
  return (
    <header className="fixed inset-x-0 top-3 z-40 px-3">
      <div className="superficie-escura bg-petroleo-900/75 mx-auto flex max-w-6xl items-center justify-between gap-4 rounded-full border border-white/12 py-2 pr-2 pl-2 text-white backdrop-blur-xl">
        <div className="flex items-center gap-2.5">
          <span className="flex shrink-0 rounded-full bg-white p-1">
            <Logo tamanho={36} />
          </span>
          <span className="text-corpo font-bold">Portal PDV</span>
        </div>

        {atalhos && atalhos.length > 0 && (
          <nav aria-label="Seções" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {atalhos.map(({ href, rotulo }) => (
                <li key={href}>
                  <a
                    href={href}
                    className="text-apoio inline-flex min-h-11 items-center rounded-full px-4 font-semibold text-white/72 transition-colors hover:bg-white/8 hover:text-white"
                  >
                    {rotulo}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        )}

        {acao ? <div className="shrink-0">{acao}</div> : <span />}
      </div>
    </header>
  );
}
