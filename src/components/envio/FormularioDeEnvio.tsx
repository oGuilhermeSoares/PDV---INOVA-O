import { useEffect, useReducer, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { RotateCw, Upload } from "lucide-react";

import type { OpcaoDeLoja } from "@/components/loja/SeletorDeLoja";
import { tipoDoArquivo } from "@/components/ui/ArquivoIcon";
import { Aviso } from "@/components/ui/Aviso";
import { Button } from "@/components/ui/Button";
import {
  ERROS,
  chaveDoArquivo,
  contar,
  faseDoEnvio,
  filaDeEnvio,
  mensagemDeFalha,
  motivoDaRecusa,
  resumoDaEscolha,
  rotuloDoEnvio,
  textoAoVivo,
  type ArquivoEscolhido,
  type EnviarArquivo,
  type ErrosDoEnvio,
  type EstadoInicialDoEnvio,
  type Momento,
} from "@/lib/envio";

import { AreaDeArquivos } from "./AreaDeArquivos";
import { EnvioConcluido } from "./EnvioConcluido";
import { EscolhaDoDestino } from "./EscolhaDoDestino";
import { ProtecaoDeSaida } from "./ProtecaoDeSaida";

/**
 * O formulário de envio: os dois passos, a barra de ação e o envio, um arquivo
 * de cada vez, na ordem da escolha. Quem envia de fato é `enviar`: a
 * simulação na prévia, o SharePoint na segunda parte do card #20.
 */
export function FormularioDeEnvio({
  lojas,
  lojaId,
  enviar,
  estadoInicial,
}: {
  lojas: OpcaoDeLoja[];
  lojaId: string;
  enviar: EnviarArquivo;
  /** `arquivos`: os `File` da fila de partida, que só a prévia passa. */
  estadoInicial?: EstadoInicialDoEnvio & { arquivos?: Map<string, File> };
}) {
  const [lojaEscolhida, setLojaEscolhida] = useState(lojaId);
  const [momento, setMomento] = useState(estadoInicial?.momento);
  const [erros, setErros] = useState<ErrosDoEnvio>(estadoInicial?.erros ?? {});
  const [fila, despachar] = useReducer(filaDeEnvio, estadoInicial?.fila ?? []);
  const [rodando, setRodando] = useState(false);
  const [mensagem, setMensagem] = useState("");

  // Barra o segundo toque em "Enviar" antes de o estado chegar à tela.
  const rodandoAgora = useRef(false);
  const arquivos = useRef(new Map<string, File>(estadoInicial?.arquivos));
  const miniaturas = useRef(new Set<string>());
  const controle = useRef<AbortController | null>(null);
  const proximoId = useRef(0);
  const refDoMomento = useRef<HTMLInputElement>(null);
  const refDoBotao = useRef<HTMLButtonElement>(null);

  // Ao sair da tela, libera as miniaturas da memória.
  useEffect(() => {
    const urls = miniaturas.current;
    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
      urls.clear();
    };
  }, []);

  const fase = faseDoEnvio(fila, rodando);
  const loja = lojas.find(({ id }) => id === lojaEscolhida) ?? lojas[0];
  const prontos = fila.filter((a) => a.situacao === "pronto");
  const falhas = fila.filter((a) => a.situacao === "falhou").length;

  function aoEscolher(escolhidos: File[]) {
    const chaves = new Set(fila.map((a) => a.chave));
    const novos: ArquivoEscolhido[] = [];
    for (const arquivo of escolhidos) {
      const chave = chaveDoArquivo(arquivo);
      if (chaves.has(chave)) continue;
      chaves.add(chave);
      const id = `arquivo-${proximoId.current++}`;
      const dados = { nome: arquivo.name, tamanho: arquivo.size };
      let miniatura: string | undefined;
      if (
        tipoDoArquivo(arquivo.name) === "imagem" &&
        motivoDaRecusa(dados) === null
      ) {
        miniatura = URL.createObjectURL(arquivo);
        miniaturas.current.add(miniatura);
      }
      arquivos.current.set(id, arquivo);
      novos.push({ id, chave, ...dados, miniatura });
    }

    if (novos.length === 0) {
      setMensagem("Esses arquivos já estão na lista.");
      return;
    }
    despachar({ tipo: "escolheu", arquivos: novos });
    const recusados = novos.filter((a) => motivoDaRecusa(a) !== null).length;
    setMensagem(resumoDaEscolha(novos.length, recusados));
    setErros(({ momento }) => ({ momento }));
  }

  function aoTirar(id: string) {
    const miniatura = fila.find((a) => a.id === id)?.miniatura;
    if (miniatura) {
      URL.revokeObjectURL(miniatura);
      miniaturas.current.delete(miniatura);
    }
    arquivos.current.delete(id);
    despachar({ tipo: "tirou", id });
  }

  async function enviarTudo() {
    if (rodandoAgora.current) return;
    const ids = fila
      .filter((a) => a.situacao === "pronto" || a.situacao === "falhou")
      .map((a) => a.id);
    if (!momento || ids.length === 0) {
      setErros({
        momento: momento ? undefined : ERROS.momento,
        arquivos: ids.length === 0 ? ERROS.arquivos : undefined,
      });
      if (!momento) refDoMomento.current?.focus();
      else refDoBotao.current?.focus();
      return;
    }

    rodandoAgora.current = true;
    setRodando(true);
    setErros({});
    setMensagem("");
    const controlador = new AbortController();
    controle.current = controlador;
    despachar({ tipo: "recomecou" });
    const destino = { lojaId: lojaEscolhida, momento };

    for (const id of ids) {
      if (controlador.signal.aborted) break;
      despachar({ tipo: "comecou", id });
      const arquivo = arquivos.current.get(id);
      if (!arquivo) {
        despachar({ tipo: "falhou", id });
        continue;
      }
      try {
        await enviar(arquivo, destino, {
          sinal: controlador.signal,
          aoProgredir: (fracao) => despachar({ tipo: "progrediu", id, fracao }),
        });
        despachar({ tipo: "terminou", id });
      } catch {
        if (controlador.signal.aborted) {
          despachar({ tipo: "parou" });
          break;
        }
        despachar({ tipo: "falhou", id });
      }
    }

    rodandoAgora.current = false;
    setRodando(false);
  }

  function enviarMais() {
    miniaturas.current.forEach((url) => URL.revokeObjectURL(url));
    miniaturas.current.clear();
    arquivos.current.clear();
    // Desenha os passos de novo antes de levar o foco à primeira pergunta.
    flushSync(() => {
      despachar({ tipo: "limpou" });
      setMomento(undefined);
      setErros({});
      setMensagem("");
    });
    refDoMomento.current?.focus();
  }

  return (
    <>
      {fase === "concluido" && momento ? (
        <EnvioConcluido
          contagem={contar(fila.filter((a) => a.situacao === "enviado"))}
          momento={momento}
          loja={loja}
          aoEnviarMais={enviarMais}
        />
      ) : (
        <div className="flex flex-col gap-6">
          <EscolhaDoDestino
            lojas={lojas}
            lojaId={lojaEscolhida}
            aoMudarLoja={setLojaEscolhida}
            momento={momento}
            aoMudarMomento={(escolhido: Momento) => {
              setMomento(escolhido);
              setErros(({ arquivos }) => ({ arquivos }));
            }}
            erro={erros.momento}
            desabilitado={fase === "enviando"}
            refDoMomento={refDoMomento}
          />
          <AreaDeArquivos
            fila={fila}
            fase={fase}
            aoEscolher={aoEscolher}
            aoTirar={aoTirar}
            erro={erros.arquivos}
            refDoBotao={refDoBotao}
          />
          {fase === "com-falha" && (
            <Aviso tom="erro">{mensagemDeFalha(falhas)}</Aviso>
          )}
          {/* Presa embaixo: numa lista longa, o botão continua à mão. */}
          <div className="sticky bottom-0 z-10 -mx-4 border-t border-gray-200 bg-white px-4 py-4 sm:mx-0 sm:rounded-2xl sm:border sm:px-6">
            {fase === "com-falha" ? (
              <Button
                onClick={() => void enviarTudo()}
                className="w-full sm:w-auto"
              >
                <RotateCw aria-hidden="true" className="size-5" />
                Tentar de novo
              </Button>
            ) : (
              <Button
                onClick={() => void enviarTudo()}
                pending={fase === "enviando"}
                className="w-full sm:w-auto"
              >
                {fase === "enviando" ? (
                  "Enviando…"
                ) : (
                  <>
                    <Upload aria-hidden="true" className="size-5" />
                    {rotuloDoEnvio(contar(prontos))}
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Anuncia o resultado da escolha e cada arquivo que termina, não cada
          pedaço da barra. */}
      <div aria-live="polite" className="sr-only">
        {textoAoVivo(fase, fila, mensagem)}
      </div>

      <ProtecaoDeSaida
        ativa={fase === "enviando"}
        aoSair={() => controle.current?.abort()}
      />
    </>
  );
}
