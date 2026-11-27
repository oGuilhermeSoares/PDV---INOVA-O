import { crc32 } from "node:zlib";

// Gerador de .zip sem compressão (método STORE) em streaming. Fotos e vídeos
// já são comprimidos, então comprimir de novo só gastaria CPU. Cada arquivo é
// aberto só na sua vez e passa direto para a saída: a memória usada não
// depende do tamanho do zip. Sem dependência nova: só Web Streams e node:zlib.
//
// Como o tamanho e o CRC só são conhecidos depois de ler o arquivo, o
// cabeçalho local sai com o bit 3 ligado (data descriptor) e os valores reais
// vêm depois dos dados. O bit 11 avisa que os nomes estão em UTF-8.

export type EntradaDoZip = {
  /** Caminho dentro do zip, com "/" entre as pastas. */
  nome: string;
  /** Data de modificação. Sem ela, vale a data atual. */
  data?: Date;
  /** Tamanho conhecido de antemão; só serve para decidir se precisa de ZIP64. */
  tamanho?: number;
  /** Abre o conteúdo. Recebe um sinal que aborta se o zip for cancelado. */
  abrir: (sinal: AbortSignal) => Promise<ReadableStream<Uint8Array>>;
};

export type OpcoesDoZip = {
  /**
   * Valor a partir do qual o formato de 32 bits não basta. O padrão é o do
   * formato (0xFFFFFFFF); os testes passam um valor baixo para exercitar o
   * ZIP64 sem gerar gigabytes.
   */
  limiteZip64?: number;
  /**
   * Defesa extra: conta os bytes que de fato foram lidos e aborta o zip se
   * passarem disso, mesmo que o tamanho declarado pelo SharePoint estivesse
   * errado.
   */
  limiteBytes?: number;
  /**
   * Chamado quando o zip falha no meio, só com o nome do erro (nunca a
   * mensagem, que pode ter URL ou token). Serve ao log.
   */
  aoFalhar?: (nomeDoErro: string) => void;
};

/** Falha própria do gerador; a mensagem nunca leva nome de arquivo nem URL. */
class ErroDoZip extends Error {
  constructor(nome: string, mensagem: string) {
    super(mensagem);
    this.name = nome;
  }
}

const LIMITE_32_BITS = 0xffffffff;
const LIMITE_16_BITS = 0xffff;
const FLAGS = 0x0808; // bit 3 (data descriptor) + bit 11 (UTF-8)

const ASSINATURA_LOCAL = 0x04034b50;
const ASSINATURA_DESCRITOR = 0x08074b50;
const ASSINATURA_CENTRAL = 0x02014b50;
const ASSINATURA_EOCD = 0x06054b50;
const ASSINATURA_EOCD64 = 0x06064b50;
const ASSINATURA_LOCALIZADOR64 = 0x07064b50;

const codificador = new TextEncoder();

type Registro = {
  nome: Uint8Array;
  hora: number;
  dia: number;
  crc: number;
  tamanho: number;
  deslocamento: number;
  zip64: boolean;
};

const FORMATO_DE_DATA = new Intl.DateTimeFormat("en-US", {
  timeZone: "America/Sao_Paulo",
  hourCycle: "h23",
  year: "numeric",
  month: "numeric",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
  second: "numeric",
});

/**
 * Data e hora no formato do MS-DOS, no horário de Brasília (e não no fuso do
 * servidor, que na Vercel é UTC): o zip não tem fuso, e quem abre vê o relógio
 * da loja. O formato vai de 1980 a 2107, com passo de 2 segundos.
 */
export function dataDos(data: Date): { hora: number; dia: number } {
  if (Number.isNaN(data.getTime())) return { hora: 0, dia: (1 << 5) | 1 };
  const partes: Record<string, number> = {};
  for (const { type, value } of FORMATO_DE_DATA.formatToParts(data)) {
    if (type !== "literal") partes[type] = Number(value);
  }
  if (partes.year < 1980) return { hora: 0, dia: (1 << 5) | 1 };
  if (partes.year > 2107) {
    return {
      hora: (23 << 11) | (59 << 5) | 29,
      dia: (127 << 9) | (12 << 5) | 31,
    };
  }
  return {
    hora: (partes.hour << 11) | (partes.minute << 5) | (partes.second >> 1),
    dia: ((partes.year - 1980) << 9) | (partes.month << 5) | partes.day,
  };
}

function bytes(tamanho: number): { buffer: Uint8Array; vista: DataView } {
  const buffer = new Uint8Array(tamanho);
  return { buffer, vista: new DataView(buffer.buffer) };
}

function extra64(valores: number[]): Uint8Array {
  const { buffer, vista } = bytes(4 + valores.length * 8);
  vista.setUint16(0, 0x0001, true);
  vista.setUint16(2, valores.length * 8, true);
  valores.forEach((v, i) => vista.setBigUint64(4 + i * 8, BigInt(v), true));
  return buffer;
}

function cabecalhoLocal(registro: Registro): Uint8Array {
  const extra = registro.zip64 ? extra64([0, 0]) : new Uint8Array(0);
  const { buffer, vista } = bytes(30 + registro.nome.length + extra.length);
  vista.setUint32(0, ASSINATURA_LOCAL, true);
  vista.setUint16(4, registro.zip64 ? 45 : 20, true);
  vista.setUint16(6, FLAGS, true);
  vista.setUint16(8, 0, true); // STORE
  vista.setUint16(10, registro.hora, true);
  vista.setUint16(12, registro.dia, true);
  // CRC e tamanhos ficam zerados: vão no data descriptor.
  vista.setUint16(26, registro.nome.length, true);
  vista.setUint16(28, extra.length, true);
  buffer.set(registro.nome, 30);
  buffer.set(extra, 30 + registro.nome.length);
  return buffer;
}

function descritor(registro: Registro): Uint8Array {
  const larg = registro.zip64 ? 8 : 4;
  const { buffer, vista } = bytes(8 + larg * 2);
  vista.setUint32(0, ASSINATURA_DESCRITOR, true);
  vista.setUint32(4, registro.crc, true);
  if (registro.zip64) {
    vista.setBigUint64(8, BigInt(registro.tamanho), true);
    vista.setBigUint64(16, BigInt(registro.tamanho), true);
  } else {
    vista.setUint32(8, registro.tamanho, true);
    vista.setUint32(12, registro.tamanho, true);
  }
  return buffer;
}

function entradaCentral(registro: Registro, limite: number): Uint8Array {
  const offsetGrande = registro.deslocamento >= limite;
  const valores: number[] = [];
  if (registro.zip64) valores.push(registro.tamanho, registro.tamanho);
  if (offsetGrande) valores.push(registro.deslocamento);
  const extra = valores.length ? extra64(valores) : new Uint8Array(0);
  const precisa64 = valores.length > 0;

  const { buffer, vista } = bytes(46 + registro.nome.length + extra.length);
  vista.setUint32(0, ASSINATURA_CENTRAL, true);
  vista.setUint16(4, precisa64 ? 45 : 20, true);
  vista.setUint16(6, precisa64 ? 45 : 20, true);
  vista.setUint16(8, FLAGS, true);
  vista.setUint16(10, 0, true);
  vista.setUint16(12, registro.hora, true);
  vista.setUint16(14, registro.dia, true);
  vista.setUint32(16, registro.crc, true);
  vista.setUint32(20, registro.zip64 ? LIMITE_32_BITS : registro.tamanho, true);
  vista.setUint32(24, registro.zip64 ? LIMITE_32_BITS : registro.tamanho, true);
  vista.setUint16(28, registro.nome.length, true);
  vista.setUint16(30, extra.length, true);
  vista.setUint32(
    42,
    offsetGrande ? LIMITE_32_BITS : registro.deslocamento,
    true,
  );
  buffer.set(registro.nome, 46);
  buffer.set(extra, 46 + registro.nome.length);
  return buffer;
}

function juntar(partes: Uint8Array[]): Uint8Array {
  const total = partes.reduce((soma, p) => soma + p.length, 0);
  const saida = new Uint8Array(total);
  let pos = 0;
  for (const p of partes) {
    saida.set(p, pos);
    pos += p.length;
  }
  return saida;
}

function fimDoArquivo(
  total: number,
  tamanhoDoDiretorio: number,
  inicioDoDiretorio: number,
  limite: number,
): Uint8Array {
  const precisa64 =
    total >= LIMITE_16_BITS ||
    tamanhoDoDiretorio >= limite ||
    inicioDoDiretorio >= limite;
  const partes: Uint8Array[] = [];

  if (precisa64) {
    const eocd64 = bytes(56);
    eocd64.vista.setUint32(0, ASSINATURA_EOCD64, true);
    eocd64.vista.setBigUint64(4, BigInt(44), true);
    eocd64.vista.setUint16(12, 45, true);
    eocd64.vista.setUint16(14, 45, true);
    eocd64.vista.setBigUint64(24, BigInt(total), true);
    eocd64.vista.setBigUint64(32, BigInt(total), true);
    eocd64.vista.setBigUint64(40, BigInt(tamanhoDoDiretorio), true);
    eocd64.vista.setBigUint64(48, BigInt(inicioDoDiretorio), true);

    const localizador = bytes(20);
    localizador.vista.setUint32(0, ASSINATURA_LOCALIZADOR64, true);
    localizador.vista.setBigUint64(
      8,
      BigInt(inicioDoDiretorio + tamanhoDoDiretorio),
      true,
    );
    localizador.vista.setUint32(16, 1, true);
    partes.push(eocd64.buffer, localizador.buffer);
  }

  const eocd = bytes(22);
  eocd.vista.setUint32(0, ASSINATURA_EOCD, true);
  const n = precisa64 ? LIMITE_16_BITS : total;
  eocd.vista.setUint16(8, n, true);
  eocd.vista.setUint16(10, n, true);
  eocd.vista.setUint32(
    12,
    precisa64 ? LIMITE_32_BITS : tamanhoDoDiretorio,
    true,
  );
  eocd.vista.setUint32(
    16,
    precisa64 ? LIMITE_32_BITS : inicioDoDiretorio,
    true,
  );
  partes.push(eocd.buffer);
  return juntar(partes);
}

/**
 * Cria o .zip como um stream. Só lê a próxima entrada quando quem consome
 * pede mais dados (contrapressão). Se qualquer arquivo falhar, o stream dá
 * erro e o fim do zip nunca é escrito: o download chega truncado e inválido
 * em vez de parecer completo. Cancelar o stream ou o `sinal` aborta a fonte
 * atual e não abre a próxima.
 */
export function criarZip(
  entradas: EntradaDoZip[],
  sinal?: AbortSignal,
  opcoes: OpcoesDoZip = {},
): ReadableStream<Uint8Array> {
  // O ZIP64 por entrada (arquivo de 4 GiB ou mais) é inalcançável com o teto
  // atual do download (500 MB, veja `LIMITE_DO_ZIP_BYTES`), mas fica pronto
  // para quando o teto subir, por exemplo com o plano Pro da Vercel.
  const limite = opcoes.limiteZip64 ?? LIMITE_32_BITS;
  const interno = new AbortController();
  const registros: Registro[] = [];

  let controlador!: ReadableStreamDefaultController<Uint8Array>;
  let proxima = 0;
  let deslocamento = 0;
  let encerrado = false;
  let leitor: ReadableStreamDefaultReader<Uint8Array> | null = null;
  let atual: Registro | null = null;
  let totalLido = 0;

  const emitir = (pedaco: Uint8Array): void => {
    deslocamento += pedaco.length;
    controlador.enqueue(pedaco);
  };

  const parar = (motivo: unknown): void => {
    if (encerrado) return;
    encerrado = true;
    interno.abort(motivo);
    const l = leitor;
    leitor = null;
    l?.cancel(motivo).catch(() => {});
    sinal?.removeEventListener("abort", aoAbortar);
  };

  function aoAbortar(): void {
    const motivo = sinal?.reason ?? new Error("zip cancelado");
    parar(motivo);
    try {
      controlador.error(motivo);
    } catch {
      // stream já fechado
    }
  }

  async function abrirProxima(): Promise<void> {
    const entrada = entradas[proxima++];
    const { hora, dia } = dataDos(entrada.data ?? new Date());
    const registro: Registro = {
      nome: codificador.encode(entrada.nome),
      hora,
      dia,
      crc: 0,
      tamanho: 0,
      deslocamento,
      zip64: (entrada.tamanho ?? 0) >= limite,
    };
    const fonte = await entrada.abrir(interno.signal);
    if (encerrado) {
      fonte.cancel().catch(() => {});
      return;
    }
    atual = registro;
    leitor = fonte.getReader();
    emitir(cabecalhoLocal(registro));
  }

  async function lerPedaco(): Promise<void> {
    const registro = atual!;
    const { done, value } = await leitor!.read();
    if (encerrado) return;
    if (done) {
      leitor = null;
      atual = null;
      emitir(descritor(registro));
      registros.push(registro);
      return;
    }
    registro.crc = crc32(value, registro.crc);
    registro.tamanho += value.length;
    totalLido += value.length;
    if (opcoes.limiteBytes !== undefined && totalLido > opcoes.limiteBytes) {
      throw new ErroDoZip("LimiteDoZip", "O zip passou do limite de tamanho.");
    }
    if (!registro.zip64 && registro.tamanho >= limite) {
      throw new ErroDoZip(
        "LimiteDoArquivo",
        "Um arquivo passou do limite do zip comum sem avisar o tamanho.",
      );
    }
    emitir(value);
  }

  function fechar(): void {
    const inicio = deslocamento;
    const diretorio = juntar(registros.map((r) => entradaCentral(r, limite)));
    emitir(diretorio);
    emitir(fimDoArquivo(registros.length, diretorio.length, inicio, limite));
    encerrado = true;
    sinal?.removeEventListener("abort", aoAbortar);
    controlador.close();
  }

  return new ReadableStream<Uint8Array>(
    {
      start(c) {
        controlador = c;
        if (sinal?.aborted) {
          aoAbortar();
          return;
        }
        sinal?.addEventListener("abort", aoAbortar, { once: true });
      },
      async pull() {
        if (encerrado) return;
        try {
          if (atual) await lerPedaco();
          else if (proxima < entradas.length) await abrirProxima();
          else fechar();
        } catch (erro) {
          if (encerrado) return;
          // O erro da fonte pode ter URL, token ou nome de arquivo: quem
          // consome o stream só vê uma mensagem genérica.
          opcoes.aoFalhar?.(erro instanceof Error ? erro.name : typeof erro);
          const generico = new Error("falha ao gerar o zip");
          parar(generico);
          controlador.error(generico);
        }
      },
      cancel(motivo) {
        parar(motivo ?? new Error("zip cancelado"));
      },
    },
    { highWaterMark: 1 },
  );
}
