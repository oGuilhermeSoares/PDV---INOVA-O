import type { Metadata } from "next";

import { EntradaDaEquipe } from "@/components/entrada/EntradaDaEquipe";
import { TelaDaEquipe } from "@/components/entrada/Telas";

export const metadata: Metadata = { title: "Entrar como equipe" };

// Quando o card #6 proteger /admin no proxy.ts, esta página fica de fora.
export default function EntrarComoEquipe() {
  return (
    <TelaDaEquipe>
      <EntradaDaEquipe />
    </TelaDaEquipe>
  );
}
