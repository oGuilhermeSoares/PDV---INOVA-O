import { BarraDaLoja } from "@/components/loja/BarraDaLoja";
import type { OpcaoDeLoja } from "@/components/loja/SeletorDeLoja";
import { VoltarLink } from "@/components/ui/VoltarLink";
import type { EnviarArquivo, EstadoInicialDoEnvio } from "@/lib/envio";

import { FormularioDeEnvio } from "./FormularioDeEnvio";

/**
 * A tela em que o associado envia fotos e vídeos para a pasta da loja. É tela
 * de trabalho: a mesma barra e a mesma faixa petróleo lisa da tela da loja.
 *
 * Recebe a função que envia (`enviar`), então só pode ser montada a partir de
 * um componente cliente, como o `EnvioDaPrevia`. `lojas` tem o mesmo formato
 * do seletor de loja: o `href` da loja de origem é o "Sua loja".
 */
export function TelaDeEnvio({
  lojas,
  lojaId,
  enviar,
  estadoInicial,
}: {
  lojas: OpcaoDeLoja[];
  lojaId: string;
  enviar: EnviarArquivo;
  estadoInicial?: EstadoInicialDoEnvio & { arquivos?: Map<string, File> };
}) {
  const origem = lojas.find(({ id }) => id === lojaId) ?? lojas[0];

  return (
    <div className="flex min-h-dvh flex-col">
      <BarraDaLoja />

      <main className="flex-1">
        <div className="superficie-escura bg-petroleo-900 text-white">
          <div className="mx-auto max-w-3xl px-4 pt-4 pb-10 sm:px-8 sm:pt-6 sm:pb-12">
            <VoltarLink href={origem.href} escuro>
              Sua loja
            </VoltarLink>
            <h1 className="font-titulo text-pagina mt-2 font-semibold tracking-tight text-balance">
              Enviar fotos e vídeos
            </h1>
            <p className="text-corpo mt-2 max-w-[72ch] text-white/72">
              Os arquivos vão direto para a pasta da loja, na qualidade
              original.
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-3xl px-4 py-8 sm:px-8 sm:py-10">
          <FormularioDeEnvio
            lojas={lojas}
            lojaId={origem.id}
            enviar={enviar}
            estadoInicial={estadoInicial}
          />
        </div>
      </main>

      <footer className="border-t border-gray-200">
        <p className="text-apoio mx-auto max-w-3xl px-4 py-6 text-gray-600 sm:px-8">
          Setor de PDV · Farmácias Associadas
        </p>
      </footer>
    </div>
  );
}
