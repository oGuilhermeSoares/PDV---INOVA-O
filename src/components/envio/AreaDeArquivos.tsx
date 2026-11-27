import { useId, useRef, useState, type Ref } from "react";
import clsx from "clsx";
import { ImagePlus } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import {
  ACCEPT,
  DICA_DOS_TIPOS,
  type ArquivoNaFila,
  type FaseDoEnvio,
} from "@/lib/envio";

import { LinhaDoArquivo } from "./LinhaDoArquivo";
import { TituloDoPasso } from "./TituloDoPasso";

/**
 * O passo 2 do envio: o botão que abre a galeria ou a câmera (no celular), a
 * área para arrastar os arquivos (no computador) e a lista do que foi
 * escolhido.
 */
export function AreaDeArquivos({
  fila,
  fase,
  aoEscolher,
  aoTirar,
  erro,
  refDoBotao,
}: {
  fila: ArquivoNaFila[];
  fase: FaseDoEnvio;
  aoEscolher: (arquivos: File[]) => void;
  aoTirar: (id: string) => void;
  erro?: string;
  refDoBotao: Ref<HTMLButtonElement>;
}) {
  const campo = useRef<HTMLInputElement>(null);
  const [arrastando, setArrastando] = useState(false);
  const idDoErro = useId();
  const enviando = fase === "enviando";

  return (
    <section aria-labelledby="passo-arquivos">
      <Card padding="lg">
        <TituloDoPasso numero={2} id="passo-arquivos">
          Fotos e vídeos
        </TituloDoPasso>

        <div
          onDragOver={(evento) => {
            if (enviando) return;
            evento.preventDefault();
            setArrastando(true);
          }}
          onDragLeave={() => setArrastando(false)}
          onDrop={(evento) => {
            evento.preventDefault();
            setArrastando(false);
            if (enviando) return;
            const arquivos = Array.from(evento.dataTransfer.files);
            if (arquivos.length > 0) aoEscolher(arquivos);
          }}
          className={clsx(
            "mt-5 flex flex-col items-center gap-3 rounded-xl border-2 border-dashed px-4 py-6 text-center transition-colors",
            arrastando
              ? "border-primary-strong bg-primary-light"
              : "border-gray-300",
          )}
        >
          <Button
            ref={refDoBotao}
            variant="secondary"
            disabled={enviando}
            aria-describedby={erro ? idDoErro : undefined}
            onClick={() => campo.current?.click()}
          >
            <ImagePlus aria-hidden="true" className="size-5" />
            {fila.length > 0 ? "Escolher mais" : "Escolher fotos e vídeos"}
          </Button>
          {/* Fora do teclado e do leitor de tela: quem abre é o botão. */}
          <input
            ref={campo}
            type="file"
            multiple
            accept={ACCEPT}
            tabIndex={-1}
            aria-hidden="true"
            className="sr-only"
            onChange={(evento) => {
              const arquivos = Array.from(evento.currentTarget.files ?? []);
              // Zera o campo: sem isso, escolher de novo o mesmo arquivo
              // (depois de tirá-lo da lista) não dispara o "change".
              evento.currentTarget.value = "";
              if (arquivos.length > 0) aoEscolher(arquivos);
            }}
          />
          <p className="text-apoio text-gray-600">
            <span className="hidden sm:inline">
              ou arraste os arquivos para cá
              <br />
            </span>
            {DICA_DOS_TIPOS}
          </p>
        </div>

        {erro && (
          <p
            id={idDoErro}
            role="alert"
            className="text-apoio mt-2 font-semibold text-red-700"
          >
            {erro}
          </p>
        )}

        {fila.length > 0 && (
          <ul
            aria-label="Arquivos escolhidos"
            className="mt-4 divide-y divide-gray-200"
          >
            {fila.map((arquivo) => (
              <LinhaDoArquivo
                key={arquivo.id}
                arquivo={arquivo}
                fase={fase}
                aoTirar={aoTirar}
              />
            ))}
          </ul>
        )}
      </Card>
    </section>
  );
}
