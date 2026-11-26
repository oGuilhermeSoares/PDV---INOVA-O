import type { ComponentProps } from "react";
import clsx from "clsx";

const tamanhos = {
  // Título de seção da página, na fonte dos títulos.
  secao: "font-titulo text-secao font-semibold tracking-tight",
  // Título dentro de um cartão ou de uma linha.
  destaque: "text-destaque font-semibold",
};

/**
 * Título abaixo do `h1` da página, sempre em caixa normal. O nível (`as`)
 * segue a estrutura do conteúdo; o tamanho (`tamanho`) segue o lugar onde ele
 * aparece. Os dois são independentes de propósito.
 */
export function SectionTitle({
  as: Tag = "h2",
  tamanho = "destaque",
  className,
  ...props
}: ComponentProps<"h2"> & {
  as?: "h2" | "h3";
  tamanho?: keyof typeof tamanhos;
}) {
  return (
    <Tag
      {...props}
      className={clsx("text-gray-900", tamanhos[tamanho], className)}
    />
  );
}
