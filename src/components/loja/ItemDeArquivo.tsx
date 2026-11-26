import { ChevronRight, Download } from "lucide-react";

import {
  ArquivoIcon,
  ROTULO_DO_TIPO,
  tipoDoArquivo,
} from "@/components/ui/ArquivoIcon";
import { buttonStyles } from "@/components/ui/Button";
import { acaoDoArquivo, formatarData, type ArquivoDaLoja } from "@/lib/loja";

/**
 * Uma linha de arquivo: o ícone do tipo, o nome inteiro (quebra a linha,
 * nunca é cortado), o tipo com a data e a ação certa. PDF e vídeo abrem no
 * navegador; planilha é baixada.
 *
 * Sem `url` (na prévia), o link não leva a lugar nenhum e não baixa nada; sem
 * isso, o navegador baixaria a própria página. O card #12 passa a rota
 * protegida de cada arquivo.
 */
export function ItemDeArquivo({ arquivo }: { arquivo: ArquivoDaLoja }) {
  const tipo = tipoDoArquivo(arquivo.nome);
  const acao = acaoDoArquivo(tipo);
  const rotulo = acao === "abrir" ? "Abrir" : "Baixar";

  return (
    // No celular, o botão desce para a linha de baixo, alinhado com o nome:
    // ao lado, ele espremeria nomes longos em quatro linhas. O texto ocupa o
    // resto da primeira linha (100% menos o ícone de 40 px e o espaço de 12).
    <li className="flex flex-wrap items-center gap-x-3 gap-y-2 py-3">
      <span className="bg-primary-light text-primary-strong flex size-10 shrink-0 items-center justify-center rounded-xl">
        <ArquivoIcon tipo={tipo} className="size-5" />
      </span>
      <div className="min-w-0 flex-[1_1_calc(100%-3.25rem)] sm:flex-1">
        <p className="text-corpo font-semibold wrap-anywhere text-gray-900">
          {arquivo.nome}
        </p>
        <p className="text-apoio text-gray-600">
          {`${ROTULO_DO_TIPO[tipo]} · ${formatarData(arquivo.atualizadoEm)}`}
        </p>
      </div>
      <a
        href={arquivo.url ?? "#sem-arquivo"}
        download={acao === "baixar" && arquivo.url ? "" : undefined}
        aria-label={`${rotulo} ${arquivo.nome}`}
        className={buttonStyles({
          variant: "secondary",
          size: "sm",
          className: "ml-13 shrink-0 sm:ml-0",
        })}
      >
        {acao === "baixar" && (
          <Download aria-hidden="true" className="size-4" />
        )}
        {rotulo}
        {acao === "abrir" && (
          <ChevronRight aria-hidden="true" className="size-4" />
        )}
      </a>
    </li>
  );
}
