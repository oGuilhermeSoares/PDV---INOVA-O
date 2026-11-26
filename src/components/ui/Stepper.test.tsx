import { expect, test } from "vitest";

import { Stepper } from "@/components/ui/Stepper";
import { renderizar } from "@/testes/renderizar";

test("marca a etapa atual para o leitor de tela", () => {
  const html = renderizar(
    <Stepper
      rotulo="Etapas do envio"
      etapas={[
        { rotulo: "Loja", estado: "concluida" },
        { rotulo: "Fotos", estado: "atual" },
        { rotulo: "Enviar", estado: "futura" },
      ]}
    />,
  );
  expect(html.match(/aria-current="step"/g)).toHaveLength(1);
  expect(html).toContain('aria-label="Etapas do envio. Atual: Fotos"');
});
