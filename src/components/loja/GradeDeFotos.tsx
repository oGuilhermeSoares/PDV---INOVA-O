"use client";

import { useId, useState } from "react";
import clsx from "clsx";
import { ChevronDown, ImageIcon, Play } from "lucide-react";

import { tipoDoArquivo } from "@/components/ui/ArquivoIcon";
import { Button } from "@/components/ui/Button";
import { posicao, type ArquivoDaLoja } from "@/lib/loja";

import { Visualizador } from "./Visualizador";

/** Quantas miniaturas aparecem antes de "Ver todas". */
const VISIVEIS = 6;

/**
 * As miniaturas de uma seção de fotos e vídeos. Mostra as 6 primeiras e um
 * "Ver todas (N)" quando há mais. Cada miniatura é um botão que abre o
 * visualizador naquela posição; o vídeo leva o símbolo de play.
 */
export function GradeDeFotos({ arquivos }: { arquivos: ArquivoDaLoja[] }) {
  const [todas, setTodas] = useState(false);
  const [aberto, setAberto] = useState(false);
  const [indice, setIndice] = useState(0);
  const idDaGrade = useId();
  const total = arquivos.length;
  const mostradas = todas ? arquivos : arquivos.slice(0, VISIVEIS);

  return (
    <>
      <ul
        id={idDaGrade}
        className="grid grid-cols-3 gap-2 sm:grid-cols-4 sm:gap-3 lg:grid-cols-6"
      >
        {mostradas.map((arquivo, i) => {
          const video = tipoDoArquivo(arquivo.nome) === "video";
          return (
            <li key={arquivo.id}>
              <button
                type="button"
                aria-label={`Abrir ${video ? "vídeo" : "foto"} ${arquivo.nome}, ${posicao(i, total)}`}
                onClick={() => {
                  setIndice(i);
                  setAberto(true);
                }}
                className="group relative block aspect-square w-full overflow-clip rounded-xl bg-gray-100"
              >
                {video ? (
                  // Vídeo ainda sem miniatura: um <img> com o .mp4 quebraria.
                  // O card #12 pode trazer a miniatura que o Graph gera.
                  <span className="flex size-full items-center justify-center">
                    <span className="flex size-10 items-center justify-center rounded-full bg-gray-950/70 text-white">
                      <Play
                        aria-hidden="true"
                        className="size-5 fill-current"
                      />
                    </span>
                  </span>
                ) : arquivo.url ? (
                  // As fotos vêm de uma rota protegida (card #12). O
                  // otimizador de imagens do Next guardaria cópias de
                  // arquivos privados.
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={arquivo.url}
                    alt=""
                    loading="lazy"
                    className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <span className="flex size-full items-center justify-center text-gray-500">
                    <ImageIcon aria-hidden="true" className="size-6" />
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ul>

      {total > VISIVEIS && (
        <div className="mt-4 flex justify-center">
          <Button
            variant="ghost"
            size="sm"
            aria-expanded={todas}
            aria-controls={idDaGrade}
            onClick={() => setTodas((valor) => !valor)}
          >
            {todas ? "Mostrar menos" : `Ver todas (${total})`}
            <ChevronDown
              aria-hidden="true"
              className={clsx(
                "size-4 transition-transform",
                todas && "rotate-180",
              )}
            />
          </Button>
        </div>
      )}

      <Visualizador
        arquivos={arquivos}
        indice={indice}
        aoMudar={setIndice}
        aberto={aberto}
        aoFechar={() => setAberto(false)}
      />
    </>
  );
}
