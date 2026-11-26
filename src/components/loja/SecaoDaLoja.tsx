import type { ReactNode } from "react";
import { FileText, Images } from "lucide-react";

import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
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
 */
export function SecaoDaLoja({
  secao,
  children,
}: {
  secao: Secao;
  children?: ReactNode;
}) {
  const total = secao.arquivos.length;
  const quando = ultimaAtualizacao(secao.arquivos);
  const idDoTitulo = `secao-${secao.id}`;

  return (
    <section aria-labelledby={idDoTitulo}>
      <Card padding="none" className="overflow-clip">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-gray-200 px-5 py-4 sm:px-6">
          <h2
            id={idDoTitulo}
            className="font-titulo text-secao font-semibold tracking-tight text-gray-900"
          >
            {secao.titulo}
          </h2>
          {quando && (
            <p className="text-apoio text-gray-600">
              {`Atualizado em ${formatarData(quando)} · ${total} ${total === 1 ? "item" : "itens"}`}
            </p>
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
