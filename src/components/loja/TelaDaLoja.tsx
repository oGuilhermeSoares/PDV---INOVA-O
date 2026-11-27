import Link from "next/link";
import { Download, Upload } from "lucide-react";

import { Aviso } from "@/components/ui/Aviso";
import { buttonStyles } from "@/components/ui/Button";
import { AVISO_GRANDE_DEMAIS, cabeNoZip } from "@/lib/arquivos/limite-do-zip";
import { nomeDaLoja, type SecaoDaLoja as Secao } from "@/lib/loja";

import { BarraDaLoja } from "./BarraDaLoja";
import { BotaoTentarDeNovo } from "./BotoesDaLoja";
import { GradeDeFotos } from "./GradeDeFotos";
import { SecaoDaLoja } from "./SecaoDaLoja";
import { SeletorDeLoja, type OpcaoDeLoja } from "./SeletorDeLoja";

/**
 * O que o associado vê depois de entrar: o nome da loja numa faixa petróleo
 * lisa (é tela de trabalho: sem a decoração dos painéis da marca), a troca de
 * loja (com duas ou mais), o link para a tela de envio (`enviarHref`) e as
 * seções na ordem da documentação. Com `erro` (SharePoint fora do ar), um
 * aviso e "Tentar de novo" no lugar das seções.
 *
 * Com `zipHref`, aparece "Baixar tudo": na faixa, a loja inteira
 * (`zipHref()`); em cada seção com arquivos, só ela (`zipHref(secao.id)`). O
 * da faixa some com `erro` ou com todas as seções vazias. Sem `zipHref`,
 * nenhum aparece. Quando os arquivos não cabem num zip (`cabeNoZip`), o botão
 * dá lugar a "Grande demais para um .zip. Baixe os arquivos um por um.".
 */
export function TelaDaLoja({
  loja,
  lojas,
  secoes,
  enviarHref,
  zipHref,
  erro = false,
}: {
  loja: { id: string; nome: string };
  lojas: OpcaoDeLoja[];
  secoes: Secao[];
  enviarHref: string;
  zipHref?: (secaoId?: string) => string;
  erro?: boolean;
}) {
  const todosOsArquivos = secoes.flatMap((secao) => secao.arquivos);
  const temArquivos = todosOsArquivos.length > 0;
  const cabeTudo = cabeNoZip(todosOsArquivos);
  const nome = nomeDaLoja(loja.nome);

  return (
    <div className="flex min-h-dvh flex-col">
      <BarraDaLoja />

      <main className="flex-1">
        {/* z-10: o menu "Trocar loja" abre por cima das seções. */}
        <div className="superficie-escura bg-petroleo-900 relative z-10 text-white">
          <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 pt-8 pb-10 sm:px-8 sm:pt-12 sm:pb-14 md:flex-row md:items-end md:justify-between">
            <div className="min-w-0">
              <p className="text-apoio text-realce font-semibold">Sua loja</p>
              <h1 className="font-titulo text-pagina mt-1 font-semibold tracking-tight text-balance wrap-anywhere">
                {nome}
              </h1>
              <div className="mt-1">
                <SeletorDeLoja lojas={lojas} atual={loja.id} />
              </div>
            </div>
            <div className="flex shrink-0 flex-wrap gap-3">
              <Link href={enviarHref} className={buttonStyles()}>
                <Upload aria-hidden="true" className="size-5" />
                Enviar fotos e vídeos
              </Link>
              {zipHref && !erro && temArquivos && cabeTudo && (
                <a
                  href={zipHref()}
                  download=""
                  aria-label={`Baixar tudo de ${nome} em .zip`}
                  className={buttonStyles({ variant: "secondary" })}
                >
                  <Download aria-hidden="true" className="size-5" />
                  Baixar tudo
                </a>
              )}
              {zipHref && !erro && temArquivos && !cabeTudo && (
                <p className="text-apoio max-w-64 self-center text-white">
                  {AVISO_GRANDE_DEMAIS}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-8 sm:py-10">
          {erro ? (
            <div className="flex flex-col items-start gap-4">
              <Aviso tom="erro" className="w-full">
                Não deu para carregar o material agora. Tente de novo em alguns
                minutos.
              </Aviso>
              <BotaoTentarDeNovo />
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {secoes.map((secao) => (
                <SecaoDaLoja
                  key={secao.id}
                  secao={secao}
                  zipHref={zipHref?.(secao.id)}
                >
                  {secao.tipo === "fotos" && (
                    <GradeDeFotos arquivos={secao.arquivos} />
                  )}
                </SecaoDaLoja>
              ))}
            </div>
          )}
        </div>
      </main>

      <footer className="border-t border-gray-200">
        <p className="text-apoio mx-auto max-w-5xl px-4 py-6 text-gray-600 sm:px-8">
          Setor de PDV · Farmácias Associadas
        </p>
      </footer>
    </div>
  );
}
