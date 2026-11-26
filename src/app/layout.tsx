import type { Metadata, Viewport } from "next";
import { Atkinson_Hyperlegible_Next, Barlow } from "next/font/google";

import { Avisos } from "@/components/ui/Avisos";
import { CORES } from "@/lib/cores";

import "./globals.css";

// Texto, campos e números: desenhada para leitura fácil, inclusive com baixa
// visão, e diferencia 0 de O e 1 de l (importa no CNPJ e no código).
const atkinson = Atkinson_Hyperlegible_Next({
  subsets: ["latin", "latin-ext"],
  variable: "--font-atkinson",
  display: "swap",
  // O Next não tem as métricas desta família para ajustar a fonte reserva.
  adjustFontFallback: false,
  fallback: ["system-ui", "Segoe UI", "Roboto", "Arial", "sans-serif"],
});

// Só os títulos (vitrine, pagina e secao), pela classe font-titulo.
const barlow = Barlow({
  weight: "600",
  subsets: ["latin", "latin-ext"],
  variable: "--font-barlow",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Portal PDV · Farmácias Associadas",
    template: "%s · Portal PDV",
  },
  description:
    "Portal do associado para acompanhar a assessoria de PDV da loja.",
};

// A barra do navegador no celular continua o painel petróleo do topo.
export const viewport: Viewport = {
  themeColor: CORES["petroleo-900"],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    // data-scroll-behavior: na troca de página o Next rola na hora; a rolagem
    // suave do globals.css fica só para os atalhos dentro da página.
    <html
      lang="pt-BR"
      data-scroll-behavior="smooth"
      className={`${atkinson.variable} ${barlow.variable}`}
    >
      <body className="min-h-dvh font-sans antialiased">
        {children}
        {/* Região dos avisos flutuantes (avisar), uma só para o app todo. */}
        <Avisos />
      </body>
    </html>
  );
}
