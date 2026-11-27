import type { ReactNode } from "react";
import { Download, FileText, Images } from "lucide-react";

import { buttonStyles } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { AVISO_GRANDE_DEMAIS, cabeNoZip } from "@/lib/arquivos/limite-do-zip";
import {
  formatarData,
  ultimaAtualizacao,
  type SecaoDaLoja as Secao,
} from "@/lib/loja";

import { ItemDeArquivo } from "./ItemDeArquivo";

/**
 * O cartão de uma seção da loja (Relatórios, Estudo de mercado, Fotos e
 * vídeos…), com a data da última atualização e a quantidade de itens. Nas
 * seções de documentos, a lista de arquivos; nas de fotos, a grade vem em
 * `children`. Vazia, diz o que vai aparecer ali.
 *
 * Com `zipHref` e ao menos um arquivo, o cabeçalho ganha "Baixar tudo", que
 * baixa a seção inteira num .zip. Sem `zipHref`, o botão não aparece. Se os
 * arquivos não cabem num zip (`cabeNoZip`: grande demais, sem tamanho ou
 * entradas demais), o link dá lugar a um aviso curto.
 */
export function SecaoDaLoja({
  secao,
  zipHref,
  children,
}: {
  secao: Secao;
  zipHref?: string;
  children?: ReactNode;
}) {
  const total = secao.arquivos.length;
  const quando = ultimaAtualizacao(secao.arquivos);
  const idDoTitulo = `secao-${secao.id}`;
  const cabe = cabeNoZip(secao.arquivos);

  return (
    <section aria-labelledby={idDoTitulo}>
      <Card padding="none" className="overflow-clip">
        {/* No celular, a data e o botão descem para baixo do título. */}
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b border-gray-200 px-5 py-4 sm:px-6">
          <h2
            id={idDoTitulo}
            className="font-titulo text-secao font-semibold tracking-tight text-gray-900"
          >
            {secao.titulo}
          </h2>
          {(quando || (zipHref && total > 0)) && (
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              {quando && (
                <p className="text-apoio text-gray-600">
                  {`Atualizado em ${formatarData(quando)} · ${total} ${total === 1 ? "item" : "itens"}`}
                </p>
              )}
              {zipHref && total > 0 && cabe && (
                <a
                  href={zipHref}
                  download=""
                  aria-label={`Baixar tudo de ${secao.titulo} em .zip`}
                  className={buttonStyles({
                    variant: "secondary",
                    size: "sm",
                    className: "shrink-0",
                  })}
                >
                  <Download aria-hidden="true" className="size-4" />
                  Baixar tudo
                </a>
              )}
              {zipHref && total > 0 && !cabe && (
                <p className="text-apoio text-gray-600">
                  {AVISO_GRANDE_DEMAIS}
                </p>
              )}
            </div>
          )}
        </div>

        {total === 0 ? (
          <EmptyState
            as="h3"
            icon={secao.tipo === "fotos" ? Images : FileText}
            title="Nada por aqui ainda"
            description={secao.vazia}
          />
        ) : secao.tipo === "fotos" ? (
          <div className="p-4 sm:p-6">{children}</div>
        ) : (
          <ul className="divide-y divide-gray-200 px-5 sm:px-6">
            {secao.arquivos.map((arquivo) => (
              <ItemDeArquivo key={arquivo.id} arquivo={arquivo} />
            ))}
          </ul>
        )}
      </Card>
    </section>
  );
}
