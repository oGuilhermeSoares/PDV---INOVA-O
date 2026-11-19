// Fonte única das cores do portal. O globals.css repete estes hex nos tokens
// do Tailwind, e um teste garante que os dois não se desencontram.
//
// O teal (#00b6ad) e o laranja (#f97316) da Farmácias Associadas não têm
// contraste suficiente para texto sobre branco (2,5:1 e 2,8:1). Por isso eles
// ficam só em fundos decorativos e no logo; texto, botões e links usam tons
// mais escuros da mesma cor, que passam no WCAG AA (≥ 4,5:1).
export const CORES = {
  marca: "#00b6ad",
  primary: "#007b75",
  "primary-hover": "#006560",
  "primary-light": "#e0faf9",
  accent: "#f97316",
  "accent-dark": "#c2410c",
  "accent-light": "#fff7ed",
  fundo: "#fafaf9",
  superficie: "#ffffff",
  texto: "#1f2937",
  "texto-suave": "#4b5563",
  borda: "#e7e5e4",
} as const;

function luminancia(hex: string): number {
  const [r, g, b] = [1, 3, 5].map((inicio) => {
    const canal = parseInt(hex.slice(inicio, inicio + 2), 16) / 255;
    return canal <= 0.03928 ? canal / 12.92 : ((canal + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** Razão de contraste do WCAG 2.x entre duas cores `#rrggbb` (1 a 21). */
export function contraste(hexA: string, hexB: string): number {
  const [clara, escura] = [luminancia(hexA), luminancia(hexB)].sort(
    (a, b) => b - a,
  );
  return (clara + 0.05) / (escura + 0.05);
}
