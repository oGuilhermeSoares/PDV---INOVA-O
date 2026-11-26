import { Plus } from "lucide-react";

import { PERGUNTAS } from "@/lib/perguntas";

/**
 * Perguntas frequentes em acordeão, como no clinia. Cada pergunta é um
 * `<details>` nativo: abre pelo teclado (Tab e Enter), sem JavaScript, e o
 * `+` gira para `×` ao abrir.
 */
export function PerguntasFrequentes() {
  return (
    <section
      id="perguntas"
      aria-labelledby="perguntas-titulo"
      className="mx-auto max-w-3xl px-4 py-20 sm:px-8 lg:py-28"
    >
      <h2
        id="perguntas-titulo"
        className="font-titulo text-secao lg:text-pagina text-center font-semibold tracking-tight text-gray-900"
      >
        Perguntas frequentes
      </h2>

      <div className="revelar mt-10 divide-y divide-gray-200 border-y border-gray-200">
        {PERGUNTAS.map(({ pergunta, resposta }) => (
          <details key={pergunta} className="group">
            <summary className="text-destaque flex min-h-14 list-none items-center justify-between gap-4 rounded-lg py-4 font-semibold text-gray-900 [&::-webkit-details-marker]:hidden">
              {pergunta}
              <Plus
                aria-hidden="true"
                className="text-primary-strong size-5 shrink-0 transition-transform duration-200 group-open:rotate-45"
              />
            </summary>
            <p className="text-corpo max-w-[72ch] pr-10 pb-5 text-gray-600">
              {resposta}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}
