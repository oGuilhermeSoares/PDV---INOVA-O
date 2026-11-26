// Sem "use client": só a GradeDeFotos (que já é cliente) usa este componente,
// e as funções nas props não atravessam a fronteira do servidor.
import { useEffect, useId, useRef, type KeyboardEvent } from "react";
import { ChevronLeft, ChevronRight, ImageIcon, Play, X } from "lucide-react";

import { tipoDoArquivo } from "@/components/ui/ArquivoIcon";
import { indiceVizinho, posicao, type ArquivoDaLoja } from "@/lib/loja";

/** Quanto o dedo precisa andar na horizontal para trocar de foto. */
const ARRASTE_MINIMO = 50;

const botaoRedondo =
  "flex size-12 shrink-0 items-center justify-center rounded-full text-white transition-colors hover:bg-white/16";

/**
 * As fotos e os vídeos de uma seção em tela cheia, um de cada vez. Abre por
 * cima da página (`<dialog>` nativo: prende o foco, fecha com Esc e devolve o
 * foco à miniatura). Troca com as setas da tela, as do teclado ou arrastando
 * o dedo para o lado. O nome e a posição ("3 de 16") são anunciados a cada
 * troca.
 */
export function Visualizador({
  arquivos,
  indice,
  aoMudar,
  aberto,
  aoFechar,
}: {
  arquivos: ArquivoDaLoja[];
  indice: number;
  aoMudar: (indice: number) => void;
  aberto: boolean;
  aoFechar: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const inicioDoToque = useRef<number | null>(null);
  const idDoNome = useId();
  const total = arquivos.length;
  const atual = arquivos[indice];

  useEffect(() => {
    const dialogo = ref.current;
    if (!dialogo) return;
    if (aberto && !dialogo.open) dialogo.showModal();
    if (!aberto && dialogo.open) dialogo.close();
  }, [aberto]);

  if (!atual) return null;

  const tipo = tipoDoArquivo(atual.nome);
  const ir = (passo: 1 | -1) => aoMudar(indiceVizinho(indice, total, passo));

  function aoTeclar(evento: KeyboardEvent<HTMLDialogElement>) {
    // No vídeo, as setas avançam e voltam o próprio vídeo.
    if (evento.target instanceof HTMLVideoElement) return;
    if (evento.key === "ArrowRight") ir(1);
    if (evento.key === "ArrowLeft") ir(-1);
  }

  return (
    <dialog
      ref={ref}
      aria-labelledby={idDoNome}
      data-tela-cheia=""
      onClose={aoFechar}
      onKeyDown={aoTeclar}
      onTouchStart={(evento) => {
        inicioDoToque.current = evento.touches[0]?.clientX ?? null;
      }}
      onTouchEnd={(evento) => {
        const inicio = inicioDoToque.current;
        const fim = evento.changedTouches[0]?.clientX;
        inicioDoToque.current = null;
        if (inicio === null || fim === undefined) return;
        if (evento.target instanceof HTMLVideoElement) return;
        const andou = fim - inicio;
        if (Math.abs(andou) >= ARRASTE_MINIMO) ir(andou < 0 ? 1 : -1);
      }}
      className="superficie-escura bg-petroleo-950 backdrop:bg-petroleo-950 m-0 h-dvh max-h-none w-full max-w-none p-0 text-white open:flex open:flex-col"
    >
      <div className="flex items-start gap-3 px-4 pt-3 sm:px-6 sm:pt-4">
        <div aria-live="polite" className="min-w-0 flex-1 py-1.5">
          <p id={idDoNome} className="text-corpo font-semibold wrap-anywhere">
            {atual.nome}
          </p>
          <p className="text-apoio text-white/72">{posicao(indice, total)}</p>
        </div>
        <button
          type="button"
          aria-label="Fechar"
          onClick={aoFechar}
          className={botaoRedondo}
        >
          <X aria-hidden="true" className="size-6" />
        </button>
      </div>

      <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 pt-2 pb-20 sm:px-20 sm:pb-8">
        {!atual.url ? (
          <div className="flex flex-col items-center gap-3 text-center text-white/72">
            {tipo === "video" ? (
              <Play aria-hidden="true" className="size-12" />
            ) : (
              <ImageIcon aria-hidden="true" className="size-12" />
            )}
            <p className="text-corpo max-w-xs">
              Este arquivo ainda não está disponível.
            </p>
          </div>
        ) : tipo === "video" ? (
          <video
            key={atual.id}
            src={atual.url}
            controls
            playsInline
            className="max-h-full max-w-full rounded-lg"
          />
        ) : (
          // As fotos vêm de uma rota protegida (card #12). O otimizador de
          // imagens do Next guardaria cópias de arquivos privados.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={atual.id}
            src={atual.url}
            alt={atual.nome}
            className="max-h-full max-w-full rounded-lg object-contain"
          />
        )}

        {total > 1 && (
          <>
            <button
              type="button"
              aria-label="Foto anterior"
              onClick={() => ir(-1)}
              className={`${botaoRedondo} absolute bottom-4 left-4 bg-white/8 sm:top-1/2 sm:bottom-auto sm:-translate-y-1/2`}
            >
              <ChevronLeft aria-hidden="true" className="size-6" />
            </button>
            <button
              type="button"
              aria-label="Próxima foto"
              onClick={() => ir(1)}
              className={`${botaoRedondo} absolute right-4 bottom-4 bg-white/8 sm:top-1/2 sm:bottom-auto sm:-translate-y-1/2`}
            >
              <ChevronRight aria-hidden="true" className="size-6" />
            </button>
          </>
        )}
      </div>
    </dialog>
  );
}
