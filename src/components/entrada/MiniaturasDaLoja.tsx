import clsx from "clsx";
import { ImageIcon, Play, Upload } from "lucide-react";

import { ArquivoIcon, type TipoDeArquivo } from "@/components/ui/ArquivoIcon";

// Peças em miniatura da tela da loja, para a prévia e as ilustrações da
// página de entrada. Mostram a estrutura de verdade da tela (os nomes das
// seções e dos tipos de arquivo); o que seria dado da loja vira barra cinza
// ou bloco com ícone. Nada de nome, data ou foto inventados.

/** Barra cinza no lugar de um texto secundário. */
export function BarraDeTexto({ className }: { className?: string }) {
  return (
    <span className={clsx("block h-2 rounded-full bg-gray-200", className)} />
  );
}

/** Linha de arquivo: ícone do tipo, o nome da categoria e uma barra cinza. */
export function LinhaDeArquivo({
  tipo,
  nome,
  className,
}: {
  tipo: TipoDeArquivo;
  nome: string;
  className?: string;
}) {
  return (
    <div
      className={clsx(
        "flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-3",
        className,
      )}
    >
      <span className="bg-primary-light text-primary-strong flex size-9 shrink-0 items-center justify-center rounded-lg">
        <ArquivoIcon tipo={tipo} className="size-5" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="text-apoio block truncate font-semibold text-gray-900">
          {nome}
        </span>
        <BarraDeTexto className="mt-1.5 w-2/5" />
      </span>
    </div>
  );
}

/** Bloco no lugar de uma foto (ou de um vídeo, com `video`). */
export function BlocoDeFoto({ video = false }: { video?: boolean }) {
  return (
    <span className="from-primary-light text-primary-strong flex aspect-square items-center justify-center rounded-lg bg-linear-to-br to-gray-200">
      {video ? (
        <Play aria-hidden="true" className="size-4" />
      ) : (
        <ImageIcon aria-hidden="true" className="size-4" />
      )}
    </span>
  );
}

/** O botão "Enviar fotos e vídeos" da tela da loja, só como desenho. */
export function PilulaDeEnvio() {
  return (
    <span className="bg-primary text-apoio inline-flex items-center gap-2 rounded-full px-4 py-2 font-semibold whitespace-nowrap text-gray-950">
      <Upload aria-hidden="true" className="size-4" />
      Enviar fotos e vídeos
    </span>
  );
}
