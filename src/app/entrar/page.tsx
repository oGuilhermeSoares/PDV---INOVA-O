import type { Metadata } from "next";

import { FormularioCnpj } from "@/components/entrada/FormularioCnpj";
import { TelaDoAssociado } from "@/components/entrada/Telas";

export const metadata: Metadata = { title: "Entrar" };

export default function Entrar() {
  return (
    <TelaDoAssociado>
      <FormularioCnpj />
    </TelaDoAssociado>
  );
}
