import { ArrowRight } from "lucide-react";

import { buttonStyles, IconeNoCirculo } from "@/components/ui/Button";

import { DecoracaoDoPainel } from "./DecoracaoDoPainel";

/** Chamada no fim da página, num cartão escuro, que leva de volta ao login. */
export function ChamadaFinal() {
  return (
    <section
      aria-labelledby="chamada-titulo"
      className="px-4 pb-20 sm:px-8 lg:pb-28"
    >
      <div className="revelar superficie-escura from-petroleo-900 to-petroleo-950 relative isolate mx-auto max-w-6xl overflow-clip rounded-2xl bg-linear-to-br px-6 py-14 text-center text-white sm:px-12 lg:py-20">
        <DecoracaoDoPainel />
        <h2
          id="chamada-titulo"
          className="font-titulo text-secao lg:text-pagina font-semibold tracking-tight text-balance"
        >
          Pronto para ver o material da{" "}
          <span className="text-realce">sua loja?</span>
        </h2>
        <a
          href="#entrar"
          className={buttonStyles({ size: "lg", className: "mt-8 pr-2" })}
        >
          Entrar no portal
          <IconeNoCirculo icone={ArrowRight} />
        </a>
      </div>
    </section>
  );
}
