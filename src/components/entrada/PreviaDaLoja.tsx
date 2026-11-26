import { ChevronDown } from "lucide-react";

import { Logo } from "@/components/marca/Logo";

import { BlocoDeFoto, LinhaDeArquivo, PilulaDeEnvio } from "./MiniaturasDaLoja";

/**
 * Prévia da tela da loja, numa moldura que entra por cima da borda do hero e
 * sobe ao rolar (`subir-ao-rolar`), como a do clinia. No celular a moldura é
 * de telefone; a partir de 640 px, de navegador.
 *
 * Para o leitor de tela, é uma imagem com descrição.
 */
export function PreviaDaLoja() {
  return (
    <figure className="subir-ao-rolar relative z-10 -mt-36 px-4 sm:px-8 lg:-mt-44">
      <div
        role="img"
        aria-label="Prévia da tela da loja, com o botão de enviar fotos e vídeos, os relatórios, o estudo de mercado e as fotos de antes e depois."
        className="shadow-flutuante mx-auto max-w-[22rem] overflow-hidden rounded-[2.25rem] border-8 border-gray-950 bg-gray-50 sm:max-w-5xl sm:rounded-2xl sm:border sm:border-gray-200"
      >
        <div className="flex items-center justify-between gap-3 border-b border-gray-200 bg-white px-4 py-3 sm:px-6">
          <span className="flex items-center gap-2">
            <Logo tamanho={36} />
            <span className="text-apoio font-bold text-gray-900">
              Portal PDV
            </span>
          </span>
          <span className="text-apoio flex items-center gap-4 text-gray-600">
            <span className="inline-flex items-center gap-1 rounded-full border border-gray-200 px-3 py-1 font-semibold text-gray-900">
              Sua loja
              <ChevronDown aria-hidden="true" className="size-3.5" />
            </span>
            <span className="hidden sm:inline">Sair</span>
          </span>
        </div>

        <div className="space-y-6 p-4 sm:p-6">
          <PilulaDeEnvio />

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <p className="text-apoio font-semibold text-gray-900">
                Relatórios
              </p>
              <LinhaDeArquivo
                className="mt-2"
                tipo="pdf"
                nome="Relatório da assessoria"
              />
            </div>
            <div className="hidden sm:block">
              <p className="text-apoio font-semibold text-gray-900">
                Estudo de mercado
              </p>
              <div className="mt-2 space-y-2">
                <LinhaDeArquivo tipo="pdf" nome="Estudo BRICK" />
                <LinhaDeArquivo tipo="planilha" nome="Planilha de produtos" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <p className="text-apoio font-semibold text-gray-900">
                Fotos e vídeos: antes
              </p>
              <div className="mt-2 grid grid-cols-4 gap-2">
                <BlocoDeFoto video />
                <BlocoDeFoto />
                <BlocoDeFoto />
                <BlocoDeFoto />
              </div>
            </div>
            <div className="hidden sm:block">
              <p className="text-apoio font-semibold text-gray-900">
                Fotos e vídeos: depois
              </p>
              <div className="mt-2 grid grid-cols-4 gap-2">
                <BlocoDeFoto />
                <BlocoDeFoto />
                <BlocoDeFoto />
              </div>
            </div>
          </div>
        </div>
      </div>
    </figure>
  );
}
