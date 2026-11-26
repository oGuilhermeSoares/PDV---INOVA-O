/**
 * Arcos, brilhos e grade de pontos dos painéis petróleo (hero, "Como
 * funciona", chamada final). Só decoração: `aria-hidden` e sem clique. O pai
 * precisa de `relative isolate overflow-clip`: com `overflow-hidden`, ele vira uma
 * área de rolagem, e as animações ligadas à rolagem (revelar, desenhar)
 * passam a seguir esse pai, que não rola, em vez da página.
 */
export function DecoracaoDoPainel() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10"
    >
      <div className="grade-de-pontos absolute inset-0 [mask-image:linear-gradient(to_bottom,black,transparent_80%)]" />
      <div className="bg-primary/25 absolute -top-40 -left-24 size-104 rounded-full blur-3xl lg:top-1/4 lg:-left-16" />
      <div className="bg-accent/15 absolute -right-24 -bottom-32 size-80 rounded-full blur-3xl" />
      <svg
        viewBox="0 0 600 600"
        fill="none"
        stroke="currentColor"
        className="absolute -right-56 -bottom-64 size-160 text-white/6 lg:-right-48 lg:-bottom-56 lg:size-208"
      >
        {[120, 200, 280].map((raio) => (
          <circle
            key={raio}
            cx="300"
            cy="300"
            r={raio}
            strokeWidth="1.5"
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </svg>
    </div>
  );
}
