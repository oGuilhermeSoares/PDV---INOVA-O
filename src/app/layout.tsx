import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "Portal PDV · Farmácias Associadas",
  description:
    "Portal do associado para acompanhar a assessoria de PDV da loja.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
