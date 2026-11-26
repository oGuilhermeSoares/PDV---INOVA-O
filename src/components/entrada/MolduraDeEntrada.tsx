import type { ReactNode } from "react";
import clsx from "clsx";

import { DecoracaoDoPainel } from "./DecoracaoDoPainel";
import { SeloComVisto } from "./SeloComVisto";

/**
 * Hero das telas de entrada: um bloco petróleo na largura toda, como o do
 * clinia, com o título e os selos à esquerda e o cartão do formulário à
 * direita (no celular, o cartão vem depois do título). O logo fica na
 * `BarraDoPortal`, fixa em cima.
 *
 * - `altura="tela"`: ocupa a tela inteira (entrada da equipe).
 * - `altura="pagina"`: abre a página do associado e deixa espaço embaixo para
 *   a prévia da tela da loja entrar por cima da borda.
 *
 * O `h1` da página é o do cartão. O título do painel é um parágrafo.
 */
export function MolduraDeEntrada({
  rotulo,
  titulo,
  destaque,
  selos,
  children,
  rodape,
  altura,
  idDoCartao,
}: {
  /** Linha pequena acima do título, como "Área da equipe de PDV". */
  rotulo?: string;
  titulo: string;
  /** Fim do título, na cor de realce. */
  destaque: string;
  selos: string[];
  /** O cartão do formulário. */
  children: ReactNode;
  /** Embaixo do cartão, sobre o escuro, como o link para o outro perfil. */
  rodape?: ReactNode;
  altura: "tela" | "pagina";
  /** Alvo do botão "Entrar" da barra. */
  idDoCartao?: string;
}) {
  return (
    <div
      className={clsx(
        "superficie-escura from-petroleo-900 via-petroleo-900 to-petroleo-950 relative isolate overflow-clip bg-linear-to-br text-white",
        altura === "tela" && "flex min-h-dvh items-center",
      )}
    >
      <DecoracaoDoPainel />

      <div
        className={clsx(
          "mx-auto grid w-full max-w-6xl grid-cols-1 gap-10 px-4 pt-28 sm:px-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:items-center lg:gap-16 lg:pt-36",
          altura === "tela" ? "pb-12 lg:pb-24" : "pb-44 lg:pb-56",
        )}
      >
        <div className="max-w-xl">
          {rotulo && (
            <p className="text-apoio mb-4 inline-flex rounded-full border border-white/12 bg-white/8 px-3 py-1 font-semibold text-white/72">
              {rotulo}
            </p>
          )}
          <p className="animate-entrar font-titulo text-pagina lg:text-vitrine font-semibold tracking-tight text-balance">
            {titulo} <span className="text-realce">{destaque}</span>
          </p>
          <ul className="animate-entrar mt-8 hidden flex-wrap gap-2 [animation-delay:80ms] sm:flex">
            {selos.map((selo) => (
              <SeloComVisto key={selo}>{selo}</SeloComVisto>
            ))}
          </ul>
        </div>

        <div
          id={idDoCartao}
          className="animate-entrar w-full max-w-md scroll-mt-28 justify-self-center [animation-delay:160ms] lg:justify-self-end"
        >
          {children}
          {rodape && (
            <div className="text-corpo mt-6 text-center text-white/72">
              {rodape}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
