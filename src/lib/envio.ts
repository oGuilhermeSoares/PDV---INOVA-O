import { tipoDoArquivo } from "@/components/ui/ArquivoIcon";

// Regras da tela de envio, sem depender do SharePoint. Seguem a seção 6.3 da
// documentação e as perguntas 1 (o associado escolhe antes ou depois) e 5 (até
// 1 GB por arquivo), que ainda esperam a palavra da Camila. A segunda parte do
// card #20 confere tudo de novo no servidor antes de criar a sessão de envio.

export type Momento = "antes" | "depois";
export type Destino = { lojaId: string; momento: Momento };
export type MotivoDaRecusa = "tipo" | "tamanho" | "vazio";

export type ArquivoEscolhido = {
  id: string;
  /** Nome, tamanho e data: o mesmo arquivo escolhido duas vezes tem a mesma. */
  chave: string;
  nome: string;
  tamanho: number;
  /** URL local (`URL.createObjectURL`) da foto, para a miniatura. */
  miniatura?: string;
};

export type ArquivoNaFila = ArquivoEscolhido &
  (
    | { situacao: "pronto" }
    | { situacao: "recusado"; motivo: MotivoDaRecusa }
    | { situacao: "enviando"; progresso: number }
    | { situacao: "enviado" }
    | { situacao: "falhou" }
  );

export type AcaoDaFila =
  | { tipo: "escolheu"; arquivos: ArquivoEscolhido[] }
  | { tipo: "tirou" | "comecou" | "terminou" | "falhou"; id: string }
  | { tipo: "progrediu"; id: string; fracao: number }
  | { tipo: "parou" | "recomecou" | "limpou" };

export type FaseDoEnvio = "escolhendo" | "enviando" | "com-falha" | "concluido";
export type Contagem = { fotos: number; videos: number };

/**
 * Envia um arquivo para a pasta do destino. Na prévia, é uma simulação; na
 * segunda parte do #20, pede a sessão de envio ao portal e manda em partes.
 * Rejeita quando falha, e com o `sinal` abortado quando a pessoa sai.
 */
export type EnviarArquivo = (
  arquivo: File,
  destino: Destino,
  opcoes: { aoProgredir: (fracao: number) => void; sinal: AbortSignal },
) => Promise<void>;

export type ErrosDoEnvio = { momento?: string; arquivos?: string };

/** O estado de partida da tela. Só a prévia passa um. */
export type EstadoInicialDoEnvio = {
  momento?: Momento;
  fila?: ArquivoNaFila[];
  erros?: ErrosDoEnvio;
};

const EXTENSOES_DE_FOTO = ["jpg", "jpeg", "png", "heic"];
const EXTENSOES_DE_VIDEO = ["mp4", "mov"];

/** O `accept` do campo: a extensão vale no Windows, o tipo no celular. */
export const ACCEPT =
  ".jpg,.jpeg,.png,.heic,.mp4,.mov,image/jpeg,image/png,image/heic,video/mp4,video/quicktime";

/** 1 GB, em base 1000, como o celular mostra o tamanho (pergunta 5). */
export const TAMANHO_MAXIMO = 1_000_000_000;

export const DICA_DOS_TIPOS = "JPG, PNG, HEIC, MP4 ou MOV, até 1 GB cada";

export const MOTIVOS: Record<MotivoDaRecusa, string> = {
  tipo: "Este tipo de arquivo não é aceito. Envie JPG, PNG, HEIC, MP4 ou MOV.",
  tamanho: "Maior que 1 GB. Este arquivo não vai ser enviado.",
  vazio: "O arquivo está vazio.",
};

export const MENSAGEM_DE_FALHA =
  "Não foi enviado. A conexão caiu no meio do envio.";

export const ERROS = {
  momento:
    "Escolha se as fotos e os vídeos são de antes ou de depois da assessoria.",
  arquivos: "Escolha pelo menos uma foto ou um vídeo.",
};

/** O nome da seção na tela da loja, para onde o arquivo vai. */
export const SECAO_DO_MOMENTO: Record<Momento, string> = {
  antes: "Fotos e vídeos: antes",
  depois: "Fotos e vídeos: depois",
};

/** A extensão depois do último ponto, em minúsculas ("" sem ponto). */
function extensao(nome: string): string {
  const ponto = nome.lastIndexOf(".");
  return ponto < 0 ? "" : nome.slice(ponto + 1).toLowerCase();
}

/**
 * Por que o arquivo não vai, ou `null`. O tipo sai da extensão: o Windows e o
 * Chrome deixam o HEIC sem tipo (MIME).
 */
export function motivoDaRecusa({
  nome,
  tamanho,
}: {
  nome: string;
  tamanho: number;
}): MotivoDaRecusa | null {
  const ext = extensao(nome);
  if (![...EXTENSOES_DE_FOTO, ...EXTENSOES_DE_VIDEO].includes(ext)) {
    return "tipo";
  }
  if (tamanho === 0) return "vazio";
  if (tamanho > TAMANHO_MAXIMO) return "tamanho";
  return null;
}

const NUMERO = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 1 });

/** "820 KB", "4,2 MB", "1,3 GB": em base 1000, como no celular. */
export function formatarTamanho(bytes: number): string {
  if (bytes < 1_000_000) {
    return `${Math.max(1, Math.round(bytes / 1000))} KB`;
  }
  if (bytes < 1_000_000_000) return `${NUMERO.format(bytes / 1_000_000)} MB`;
  return `${NUMERO.format(bytes / 1_000_000_000)} GB`;
}

/** Vídeo é MP4 ou MOV; o resto conta como foto. */
export function contar(arquivos: { nome: string }[]): Contagem {
  let videos = 0;
  for (const { nome } of arquivos) {
    if (tipoDoArquivo(nome) === "video") videos++;
  }
  return { fotos: arquivos.length - videos, videos };
}

function plural(n: number, singular: string, plural: string): string {
  return `${n} ${n === 1 ? singular : plural}`;
}

/** "12 fotos e 1 vídeo", "1 foto", "2 vídeos". */
export function descreverQuantidade({ fotos, videos }: Contagem): string {
  return [
    fotos > 0 && plural(fotos, "foto", "fotos"),
    videos > 0 && plural(videos, "vídeo", "vídeos"),
  ]
    .filter(Boolean)
    .join(" e ");
}

/** "12 fotos e 1 vídeo enviados": o particípio concorda com o que foi. */
export function tituloDoConcluido(contagem: Contagem): string {
  const { fotos, videos } = contagem;
  const total = fotos + videos;
  const genero = videos > 0 ? "enviado" : "enviada";
  return `${descreverQuantidade(contagem)} ${genero}${total === 1 ? "" : "s"}`;
}

/** O texto do botão: diz quanto vai. */
export function rotuloDoEnvio(contagem: Contagem): string {
  return contagem.fotos + contagem.videos === 0
    ? "Enviar fotos e vídeos"
    : `Enviar ${descreverQuantidade(contagem)}`;
}

export function mensagemDeFalha(quantos: number): string {
  const quem =
    quantos === 1
      ? "1 arquivo não foi enviado"
      : `${quantos} arquivos não foram enviados`;
  return `${quem}. Confira a internet e tente de novo.`;
}

/** O que o leitor de tela anuncia depois de uma escolha. */
export function resumoDaEscolha(total: number, recusados: number): string {
  const escolhidos =
    total === 1 ? "1 arquivo escolhido." : `${total} arquivos escolhidos.`;
  if (recusados === 0) return escolhidos;
  const naoVao =
    recusados === 1
      ? "1 não vai ser enviado."
      : `${recusados} não vão ser enviados.`;
  return `${escolhidos} ${naoVao}`;
}

/** "3 de 13 enviados", sem contar os recusados. */
export function progressoDoEnvio(fila: ArquivoNaFila[]): string {
  const vao = fila.filter((a) => a.situacao !== "recusado");
  const enviados = vao.filter((a) => a.situacao === "enviado").length;
  return `${enviados} de ${vao.length} enviados`;
}

/**
 * O que a região ao vivo da tela diz. No fim, nada: o aviso de erro e o título
 * do sucesso já anunciam, e o texto da última escolha seria repetido.
 */
export function textoAoVivo(
  fase: FaseDoEnvio,
  fila: ArquivoNaFila[],
  mensagemDaEscolha: string,
): string {
  if (fase === "enviando") return progressoDoEnvio(fila);
  return fase === "escolhendo" ? mensagemDaEscolha : "";
}

export function chaveDoArquivo(arquivo: {
  name: string;
  size: number;
  lastModified: number;
}): string {
  return `${arquivo.name}|${arquivo.size}|${arquivo.lastModified}`;
}

function mudar(
  fila: ArquivoNaFila[],
  id: string,
  de: ArquivoNaFila["situacao"][],
  para: (arquivo: ArquivoNaFila) => ArquivoNaFila,
): ArquivoNaFila[] {
  return fila.map((a) =>
    a.id === id && de.includes(a.situacao) ? para(a) : a,
  );
}

/** A fila de arquivos da tela, como reducer. */
export function filaDeEnvio(
  fila: ArquivoNaFila[],
  acao: AcaoDaFila,
): ArquivoNaFila[] {
  switch (acao.tipo) {
    case "escolheu": {
      const chaves = new Set(fila.map((a) => a.chave));
      const novos: ArquivoNaFila[] = [];
      for (const arquivo of acao.arquivos) {
        if (chaves.has(arquivo.chave)) continue;
        chaves.add(arquivo.chave);
        const motivo = motivoDaRecusa(arquivo);
        novos.push(
          motivo
            ? { ...arquivo, situacao: "recusado", motivo }
            : { ...arquivo, situacao: "pronto" },
        );
      }
      return [...fila, ...novos];
    }
    case "tirou":
      return fila.filter(
        (a) =>
          a.id !== acao.id ||
          a.situacao === "enviado" ||
          a.situacao === "enviando",
      );
    case "comecou":
      return mudar(fila, acao.id, ["pronto"], (a) => ({
        ...a,
        situacao: "enviando",
        progresso: 0,
      }));
    case "progrediu":
      return mudar(fila, acao.id, ["enviando"], (a) => ({
        ...a,
        situacao: "enviando",
        progresso: Math.min(1, Math.max(0, acao.fracao)),
      }));
    case "terminou":
      return mudar(fila, acao.id, ["enviando"], (a) => ({
        ...semEstado(a),
        situacao: "enviado",
      }));
    case "falhou":
      return mudar(fila, acao.id, ["enviando"], (a) => ({
        ...semEstado(a),
        situacao: "falhou",
      }));
    case "parou":
      return fila.map((a) =>
        a.situacao === "enviando" ? { ...semEstado(a), situacao: "pronto" } : a,
      );
    case "recomecou":
      return fila.map((a) =>
        a.situacao === "falhou" ? { ...semEstado(a), situacao: "pronto" } : a,
      );
    case "limpou":
      return [];
  }
}

/** Só os dados do arquivo, sem a situação e o que vem com ela. */
function semEstado(arquivo: ArquivoNaFila): ArquivoEscolhido {
  const { id, chave, nome, tamanho, miniatura } = arquivo;
  return { id, chave, nome, tamanho, miniatura };
}

/**
 * A fase da tela. Um arquivo "enviando" conta mesmo sem nada rodando: é a
 * prévia parada no meio do envio.
 */
export function faseDoEnvio(
  fila: ArquivoNaFila[],
  rodando: boolean,
): FaseDoEnvio {
  if (rodando || fila.some((a) => a.situacao === "enviando")) return "enviando";
  if (fila.some((a) => a.situacao === "falhou")) return "com-falha";
  const vao = fila.filter((a) => a.situacao !== "recusado");
  if (vao.length > 0 && vao.every((a) => a.situacao === "enviado")) {
    return "concluido";
  }
  return "escolhendo";
}
