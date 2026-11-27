import { useState } from "react";
import { CircleAlert, CircleCheck, X } from "lucide-react";

import {
  ArquivoIcon,
  ROTULO_DO_TIPO,
  tipoDoArquivo,
  type TipoDeArquivo,
} from "@/components/ui/ArquivoIcon";
import { Button } from "@/components/ui/Button";
import {
  MENSAGEM_DE_FALHA,
  MOTIVOS,
  formatarTamanho,
  type ArquivoNaFila,
  type FaseDoEnvio,
} from "@/lib/envio";

/**
 * Um arquivo da lista de envio: a miniatura, o nome inteiro, o tipo e o
 * tamanho, e a situação. "Tirar" só fora do envio e nunca no que já foi: o
 * associado não apaga o que mandou (pergunta 4 da documentação).
 */
export function LinhaDoArquivo({
  arquivo,
  fase,
  aoTirar,
}: {
  arquivo: ArquivoNaFila;
  fase: FaseDoEnvio;
  aoTirar: (id: string) => void;
}) {
  const tipo = tipoDoArquivo(arquivo.nome);
  const podeTirar =
    fase !== "enviando" &&
    (arquivo.situacao === "pronto" ||
      arquivo.situacao === "recusado" ||
      arquivo.situacao === "falhou");

  return (
    // Abaixo de 640 px, o "Tirar" desce para a linha de baixo: ao lado, ele
    // espremeria o nome e o motivo numa coluna estreita (como no ItemDeArquivo).
    <li className="flex flex-wrap items-start gap-x-3 gap-y-1 py-3">
      <Miniatura url={arquivo.miniatura} tipo={tipo} />
      <div className="min-w-0 flex-[1_1_calc(100%-3.75rem)] sm:flex-1">
        <p className="text-corpo font-semibold wrap-anywhere text-gray-900">
          {arquivo.nome}
        </p>
        <p className="text-apoio text-gray-600">
          {ROTULO_DO_TIPO[tipo]} · {formatarTamanho(arquivo.tamanho)}
        </p>
        <Situacao arquivo={arquivo} fase={fase} />
      </div>
      {podeTirar && (
        <Button
          variant="ghost"
          size="sm"
          aria-label={`Tirar ${arquivo.nome}`}
          onClick={() => aoTirar(arquivo.id)}
          // ml-11 + o recuo do botão = o começo do nome (60 px).
          className="ml-11 shrink-0 sm:-mr-2 sm:ml-0"
        >
          <X aria-hidden="true" className="size-4" />
          Tirar
        </Button>
      )}
    </li>
  );
}

/** A foto escolhida; o ícone do tipo quando não há ou o navegador não abre. */
function Miniatura({ url, tipo }: { url?: string; tipo: TipoDeArquivo }) {
  const [quebrou, setQuebrou] = useState(false);

  if (url && !quebrou) {
    return (
      // URL local do arquivo escolhido (blob:), que o next/image não carrega.
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={url}
        alt=""
        onError={() => setQuebrou(true)}
        className="size-12 shrink-0 rounded-xl bg-gray-100 object-cover"
      />
    );
  }
  return (
    <span className="bg-primary-light text-primary-strong flex size-12 shrink-0 items-center justify-center rounded-xl">
      <ArquivoIcon tipo={tipo} className="size-5" />
    </span>
  );
}

function Situacao({
  arquivo,
  fase,
}: {
  arquivo: ArquivoNaFila;
  fase: FaseDoEnvio;
}) {
  switch (arquivo.situacao) {
    case "recusado":
      return <Problema>{MOTIVOS[arquivo.motivo]}</Problema>;
    case "falhou":
      return <Problema>{MENSAGEM_DE_FALHA}</Problema>;
    case "enviado":
      return (
        <p className="text-apoio text-status-resolvido mt-1 flex items-center gap-1.5 font-semibold">
          <CircleCheck aria-hidden="true" className="size-4 shrink-0" />
          Enviado
        </p>
      );
    case "enviando": {
      const porcento = Math.round(arquivo.progresso * 100);
      return (
        <div className="mt-2 flex items-center gap-3">
          <div
            role="progressbar"
            aria-label={`Enviando ${arquivo.nome}`}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={porcento}
            className="bg-primary-light h-2 flex-1 overflow-clip rounded-full"
          >
            <div
              className="bg-primary-strong h-full origin-left rounded-full transition-transform duration-200"
              style={{ transform: `scaleX(${arquivo.progresso})` }}
            />
          </div>
          <span className="text-apoio w-11 shrink-0 text-right font-semibold text-gray-700 tabular-nums">
            {porcento}%
          </span>
        </div>
      );
    }
    case "pronto":
      return fase === "enviando" ? (
        <p className="text-apoio mt-1 text-gray-600">Na fila</p>
      ) : null;
  }
}

function Problema({ children }: { children: string }) {
  return (
    <p className="text-apoio text-status-recusado mt-1 flex items-start gap-1.5 font-semibold">
      <CircleAlert aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
      {children}
    </p>
  );
}
