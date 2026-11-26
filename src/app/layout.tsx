import type { Metadata } from "next";
import { Atkinson_Hyperlegible_Next } from "next/font/google";

import "./globals.css";

// Fonte desenhada para leitura fácil, inclusive com baixa visão: o portal é
// lido principalmente no celular, por donos de farmácia de todas as idades.
const fonte = Atkinson_Hyperlegible_Next({
  subsets: ["latin", "latin-ext"],
  variable: "--font-portal",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Portal PDV · Farmácias Associadas",
  description:
    "Portal do associado para acompanhar a assessoria de PDV da loja.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={fonte.variable}>
      <body className="min-h-dvh font-sans antialiased">{children}</body>
    </html>
  );
}
