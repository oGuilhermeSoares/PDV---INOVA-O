// Fonte única das cores do Portal PDV. O globals.css repete estes hex nos
// tokens do Tailwind, e um teste garante que os dois não se desencontram (e que
// cada par de texto e fundo usado nos componentes passa no contraste).
//
// Papéis (guia completo em docs/design-system/README.md):
// - `primary` é o teal da marca, só como preenchimento (texto sobre ele em
//   `gray-950`). Texto teal e anel de foco no claro usam `primary-strong`.
// - `accent` é o laranja da cruz: logo e item novo, nunca texto sobre fundo
//   claro. Texto laranja usa `accent-strong`.
// - `petroleo-*` são os painéis escuros da marca, e `realce` é a palavra de
//   destaque do título sobre eles.
// - Cinzas e vermelhos são os do Tailwind 4, convertidos de oklch para hex.
export const CORES = {
  white: "#ffffff",

  "gray-50": "#f9fafb",
  "gray-100": "#f3f4f6",
  "gray-200": "#e5e7eb",
  "gray-300": "#d1d5dc",
  "gray-400": "#99a1af",
  "gray-500": "#6a7282",
  "gray-600": "#4a5565",
  "gray-700": "#364153",
  "gray-900": "#101828",
  "gray-950": "#030712",

  "red-50": "#fef2f2",
  "red-700": "#c10007",
  "red-800": "#9f0712",

  primary: "#00b6ad",
  "primary-dark": "#009991",
  "primary-light": "#e0faf9",
  "primary-strong": "#00706a",

  accent: "#f97316",
  "accent-light": "#fff7ed",
  "accent-strong": "#a84300",

  "status-aberto": "#8a4a00",
  "status-aberto-bg": "#fff3e0",
  "status-andamento": "#00596b",
  "status-andamento-bg": "#e3f4f8",
  "status-aguardando": "#5b3fa0",
  "status-aguardando-bg": "#f0ebfa",
  "status-resolvido": "#1f6b3a",
  "status-resolvido-bg": "#e6f4ea",
  "status-recusado": "#a3271f",
  "status-recusado-bg": "#fdecea",

  "petroleo-950": "#0a2427",
  "petroleo-900": "#0f3034",
  "petroleo-800": "#163f44",
  "petroleo-700": "#21535a",
  realce: "#fdba74",

  "avatar-1": "#245c5a",
  "avatar-1-bg": "#dcefed",
  "avatar-2": "#855126",
  "avatar-2-bg": "#f4e6d7",
  "avatar-3": "#395d74",
  "avatar-3-bg": "#e2edf4",
  "avatar-4": "#895361",
  "avatar-4-bg": "#f4e6e9",
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
