import "server-only";

import {
  AVISO_GRANDE_DEMAIS,
  cabeNoZip,
  LIMITE_DE_ENTRADAS_DO_ZIP,
  LIMITE_DO_ZIP_BYTES,
} from "@/lib/arquivos/limite-do-zip";
import { montarSecoes, type PastaDaLoja, type SecaoDaLoja } from "@/lib/loja";
import { nomeDoZip, nomeSeguro, nomesUnicos } from "@/lib/zip/nomes";
import { criarZip, type EntradaDoZip } from "@/lib/zip/zip-store";

// "Baixar tudo em .zip" (card #17): a lógica que decide o que entra no zip.
// Não conhece o Graph nem a sessão: tudo vem por duas portas, que os cards #4
// (SharePoint) e #10/#12 (login e permissão) implementam de verdade.

export { AVISO_GRANDE_DEMAIS, LIMITE_DE_ENTRADAS_DO_ZIP, LIMITE_DO_ZIP_BYTES };

/**
 * O erro que a fonte (card #4) lança. `status` é o HTTP do Graph, se houve
 * resposta; `tentarDeNovoEmMs` vem do Retry-After. Sem `status`, é falha de
 * rede. A mensagem NUNCA deve ter URL nem token: ela pode ir para o log.
 */
export type ErroDaFonte = Error & {
  status?: number;
  tentarDeNovoEmMs?: number;
};

/** O SharePoint (card #4). Só o servidor chama; o navegador nunca vê itemId. */
export type FonteDeArquivos = {
  listarPastasDaLoja(
    lojaId: string,
    sinal: AbortSignal,
  ): Promise<PastaDaLoja[]>;
  abrirConteudo(
    itemId: string,
    sinal: AbortSignal,
  ): Promise<ReadableStream<Uint8Array>>;
};

export type LojaDoUsuario = { id: string; nome: string };

/**
 * A sessão e a permissão (cards #10 e #12). Três respostas diferentes:
 * "sem-sessao" (401), `null` para loja que não é do usuário (404, igual a loja
 * que não existe, para não revelar quais lojas existem) e a loja, se for dele.
 */
export type ChecagemDeAcesso = {
  lojaDoUsuario(
    req: Request,
    lojaId: string,
  ): Promise<LojaDoUsuario | null | "sem-sessao">;
};

export type DependenciasDoZip = {
  fonte: FonteDeArquivos;
  checagem: ChecagemDeAcesso;
};

/** Faltam os cards #4 e #10: a rota responde 503 em vez de quebrar. */
export class DependenciasNaoConfiguradas extends Error {
  constructor() {
    super("Download em .zip não configurado (cards #4 e #10).");
    this.name = "DependenciasNaoConfiguradas";
  }
}

export type ResultadoDoZip =
  | { tipo: "ok"; nome: string; corpo: ReadableStream<Uint8Array> }
  | { tipo: "sem-sessao" }
  | { tipo: "nao-encontrado" }
  | { tipo: "vazio" }
  | { tipo: "grande-demais"; limiteBytes: number };

export type OpcoesDePrepararZip = {
  limiteBytes?: number;
  limiteEntradas?: number;
  limiteZip64?: number;
  /** Espera entre as tentativas; os testes trocam por uma versão instantânea. */
  esperar?: (ms: number, sinal: AbortSignal) => Promise<void>;
  /** Só o nome do erro (nunca a mensagem, que pode ter URL ou token). */
  aoFalhar?: (nomeDoErro: string) => void;
  aoTentarDeNovo?: (nomeDoErro: string) => void;
};

/** A folga sobre o teto na contagem dos bytes que de fato foram lidos. */
const FOLGA_DO_LIMITE = 1.1;
const ESPERA_PADRAO_MS = 500;
const ESPERA_MAXIMA_MS = 2000;

type ArquivoParaOZip = EntradaDoZip & { itemId: string };

function dataDe(iso: string): Date | undefined {
  const data = new Date(iso);
  return Number.isNaN(data.getTime()) ? undefined : data;
}

function nomeDoErro(erro: unknown): string {
  return erro instanceof Error ? erro.name : typeof erro;
}

/** 429, 5xx ou falha de rede (sem status) podem passar; 4xx definitivo não. */
function ehTransitorio(erro: unknown): boolean {
  const status = (erro as ErroDaFonte | undefined)?.status;
  if (status === undefined) return true;
  return status === 429 || status >= 500;
}

function esperarPadrao(ms: number, sinal: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (sinal.aborted) return reject(sinal.reason);
    const timer = setTimeout(() => {
      sinal.removeEventListener("abort", aoAbortar);
      resolve();
    }, ms);
    function aoAbortar() {
      clearTimeout(timer);
      reject(sinal.reason);
    }
    sinal.addEventListener("abort", aoAbortar, { once: true });
  });
}

/**
 * Uma nova tentativa só se a abertura falhar (o que acontece antes do
 * primeiro byte) e só por erro transitório. Depois que os bytes começam a
 * sair não dá para recomeçar o arquivo sem corromper o zip, então a falha
 * derruba o stream.
 */
async function abrirComNovaTentativa(
  fonte: FonteDeArquivos,
  itemId: string,
  sinal: AbortSignal,
  opcoes: OpcoesDePrepararZip,
): Promise<ReadableStream<Uint8Array>> {
  try {
    return await fonte.abrirConteudo(itemId, sinal);
  } catch (erro) {
    if (sinal.aborted || !ehTransitorio(erro)) throw erro;
    opcoes.aoTentarDeNovo?.(nomeDoErro(erro));
    const pedida = (erro as ErroDaFonte | undefined)?.tentarDeNovoEmMs;
    const ms = Math.min(
      Number.isFinite(pedida) && pedida! >= 0 ? pedida! : ESPERA_PADRAO_MS,
      ESPERA_MAXIMA_MS,
    );
    await (opcoes.esperar ?? esperarPadrao)(ms, sinal);
    return await fonte.abrirConteudo(itemId, sinal);
  }
}

function entradasDaSecao(
  fonte: FonteDeArquivos,
  secao: SecaoDaLoja,
  pasta: string,
  opcoes: OpcoesDePrepararZip,
): ArquivoParaOZip[] {
  const nomes = nomesUnicos(secao.arquivos.map((a) => nomeSeguro(a.nome)));
  return secao.arquivos.map((arquivo, i) => ({
    itemId: arquivo.id,
    nome: pasta ? `${pasta}/${nomes[i]}` : nomes[i],
    data: dataDe(arquivo.atualizadoEm),
    tamanho: arquivo.tamanho,
    abrir: (sinal) => abrirComNovaTentativa(fonte, arquivo.id, sinal, opcoes),
  }));
}

/**
 * Monta o zip de uma seção ou da loja inteira (`secaoId` nulo).
 *
 * Segurança: o navegador só manda o id da loja e o id da seção. Os itens vêm
 * da pasta da loja do usuário, passam por `montarSecoes` (que tira a pasta
 * Interno) e só os arquivos da seção pedida são baixados.
 */
export async function prepararZip(
  deps: DependenciasDoZip,
  req: Request,
  lojaId: string,
  secaoId: string | null,
  opcoes: OpcoesDePrepararZip = {},
): Promise<ResultadoDoZip> {
  const loja = await deps.checagem.lojaDoUsuario(req, lojaId);
  if (loja === "sem-sessao") return { tipo: "sem-sessao" };
  if (loja === null) return { tipo: "nao-encontrado" };

  const pastas = await deps.fonte.listarPastasDaLoja(loja.id, req.signal);
  const secoes = montarSecoes(pastas);

  let nome: string;
  let entradas: ArquivoParaOZip[];

  if (secaoId === null) {
    const comArquivos = secoes.filter((s) => s.arquivos.length > 0);
    const pastasDoZip = nomesUnicos(
      comArquivos.map((s) => nomeSeguro(s.nomeNoZip ?? s.titulo)),
    );
    entradas = comArquivos.flatMap((s, i) =>
      entradasDaSecao(deps.fonte, s, pastasDoZip[i], opcoes),
    );
    nome = nomeDoZip(loja.nome);
  } else {
    const secao = secoes.find((s) => s.id === secaoId);
    if (!secao) return { tipo: "nao-encontrado" };
    entradas = entradasDaSecao(deps.fonte, secao, "", opcoes);
    nome = nomeDoZip(loja.nome, secao.nomeNoZip ?? secao.titulo);
  }

  if (entradas.length === 0) return { tipo: "vazio" };

  const limiteBytes = opcoes.limiteBytes ?? LIMITE_DO_ZIP_BYTES;
  const limiteEntradas = opcoes.limiteEntradas ?? LIMITE_DE_ENTRADAS_DO_ZIP;
  // Arquivo sem tamanho, entradas demais ou soma acima do teto: recusa. Sem
  // essa checagem, um item sem `tamanho` furaria o teto.
  if (!cabeNoZip(entradas, { bytes: limiteBytes, entradas: limiteEntradas })) {
    return { tipo: "grande-demais", limiteBytes };
  }

  const corpo = criarZip(entradas, req.signal, {
    limiteZip64: opcoes.limiteZip64,
    // Defesa extra: o tamanho vem do SharePoint e pode estar errado.
    limiteBytes: Math.ceil(limiteBytes * FOLGA_DO_LIMITE),
    aoFalhar: opcoes.aoFalhar,
  });
  return { tipo: "ok", nome, corpo };
}
