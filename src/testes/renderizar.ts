import type { ReactElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

/**
 * HTML estático de um componente, como o servidor o entrega. Serve para os
 * testes conferirem rótulos e atributos de acessibilidade sem um navegador.
 * Efeitos (useEffect) não rodam aqui.
 */
export function renderizar(no: ReactElement): string {
  return renderToStaticMarkup(no);
}
