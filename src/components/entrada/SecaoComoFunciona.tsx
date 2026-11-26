import { Images, KeyRound, Mail, Store, type LucideIcon } from "lucide-react";

import { DecoracaoDoPainel } from "./DecoracaoDoPainel";

const PASSOS: { Icone: LucideIcon; titulo: string; texto: string }[] = [
  {
    Icone: Store,
    titulo: "A equipe visita a loja",
    texto: "e salva o relatório, o estudo e as fotos na pasta da sua loja.",
  },
  {
    Icone: Mail,
    titulo: "Você recebe um e-mail",
    texto: "com o link do portal, sem anexo.",
  },
  {
    Icone: KeyRound,
    titulo: "Você entra com o CNPJ",
    texto: "e um código de 6 números que chega no seu e-mail. Sem senha.",
  },
  {
    Icone: Images,
    titulo: "E manda fotos de volta",
    texto: "Fotos e vídeos vão direto para a equipe, na qualidade original.",
  },
];

/**
 * "Como funciona": os quatro passos, da visita da equipe à tela do associado,
 * ligados por uma linha que se desenha conforme a pessoa rola (o movimento
 * marcante da página). Sem suporte, ou para quem pede menos movimento, a
 * linha já aparece desenhada.
 */
export function SecaoComoFunciona() {
  return (
    <section
      id="como-funciona"
      aria-labelledby="como-funciona-titulo"
      className="superficie-escura bg-petroleo-900 relative isolate overflow-clip py-20 text-white lg:py-28"
    >
      <DecoracaoDoPainel />

      <div className="mx-auto max-w-6xl px-4 sm:px-8">
        <div className="revelar text-center">
          <p className="text-apoio inline-flex rounded-full border border-white/12 bg-white/8 px-3 py-1 font-semibold text-white/72">
            Como funciona
          </p>
          <h2
            id="como-funciona-titulo"
            className="font-titulo text-secao lg:text-pagina mt-4 font-semibold tracking-tight text-balance"
          >
            Da visita da equipe{" "}
            <span className="text-realce">até a sua tela.</span>
          </h2>
        </div>

        <div className="linha-do-tempo relative mt-14">
          {/* No celular: a linha desce pela esquerda, atrás dos ícones. */}
          <svg
            aria-hidden="true"
            viewBox="0 0 2 100"
            preserveAspectRatio="none"
            className="text-primary/60 absolute top-7 bottom-7 left-7 h-[calc(100%-3.5rem)] w-0.5 -translate-x-1/2 sm:hidden"
          >
            <path
              d="M1 0 V100"
              pathLength="1"
              className="desenhar-ao-rolar"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>
          {/* No computador: a linha atravessa o centro dos ícones. */}
          <svg
            aria-hidden="true"
            viewBox="0 0 100 2"
            preserveAspectRatio="none"
            // Largura explícita: num <svg> absoluto, left e right não esticam.
            className="text-primary/60 absolute top-7 left-[12.5%] hidden h-0.5 w-3/4 -translate-y-1/2 lg:block"
          >
            <path
              d="M0 1 H100"
              pathLength="1"
              className="desenhar-ao-rolar"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>

          <ol className="relative grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            {PASSOS.map(({ Icone, titulo, texto }, i) => (
              <li
                key={titulo}
                className="flex gap-5 lg:flex-col lg:items-center lg:text-center"
              >
                <span className="bg-petroleo-800 text-primary flex size-14 shrink-0 items-center justify-center rounded-full ring-1 ring-white/12">
                  <Icone aria-hidden="true" className="size-6" />
                </span>
                <div>
                  <p className="text-apoio text-primary font-semibold">
                    Passo {i + 1}
                  </p>
                  <h3 className="text-destaque mt-1 font-semibold">{titulo}</h3>
                  <p className="text-corpo mt-1 text-white/72">{texto}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
