import { crc32 } from "node:zlib";

// Verificador de .zip só para os testes. Lê o fim do arquivo (EOCD e, se
// houver, EOCD64 e o localizador), percorre o diretório central e confere cada
// entrada contra o cabeçalho local e o data descriptor, incluindo a
// contiguidade dos blocos. Lança erro se algo estiver fora do formato.

export type DataDosLida = {
  ano: number;
  mes: number;
  dia: number;
  hora: number;
  minuto: number;
  segundo: number;
};

export type EntradaLida = {
  nome: string;
  dados: Uint8Array;
  crc: number;
  flags: number;
  /** Tamanho em 64 bits (extra no cabeçalho local). */
  zip64: boolean;
  /** Quantos valores o extra ZIP64 do diretório central trazia (0 a 3). */
  valoresZip64NoCentral: number;
  data: DataDosLida;
};

export type ZipLido = { entradas: EntradaLida[]; usouEocd64: boolean };

export async function lerTudo(
  stream: ReadableStream<Uint8Array>,
): Promise<Uint8Array> {
  const partes: Uint8Array[] = [];
  const leitor = stream.getReader();
  for (;;) {
    const { done, value } = await leitor.read();
    if (done) break;
    partes.push(value);
  }
  return Buffer.concat(partes);
}

export function decodificarDataDos(hora: number, dia: number): DataDosLida {
  return {
    ano: 1980 + (dia >> 9),
    mes: (dia >> 5) & 0xf,
    dia: dia & 0x1f,
    hora: hora >> 11,
    minuto: (hora >> 5) & 0x3f,
    segundo: (hora & 0x1f) * 2,
  };
}

function exigir(condicao: boolean, mensagem: string): void {
  if (!condicao) throw new Error(mensagem);
}

/** Procura o extra 0x0001 e devolve os valores de 64 bits que ele traz. */
function lerExtra64(
  v: DataView,
  inicio: number,
  tamanho: number,
): bigint[] | null {
  let p = inicio;
  while (p < inicio + tamanho) {
    const id = v.getUint16(p, true);
    const tam = v.getUint16(p + 2, true);
    if (id === 0x0001) {
      const valores: bigint[] = [];
      for (let q = p + 4; q < p + 4 + tam; q += 8) {
        valores.push(v.getBigUint64(q, true));
      }
      return valores;
    }
    p += 4 + tam;
  }
  return null;
}

export function lerZip(zip: Uint8Array): ZipLido {
  const v = new DataView(zip.buffer, zip.byteOffset, zip.byteLength);
  const u32 = (p: number): number => v.getUint32(p, true);
  const u16 = (p: number): number => v.getUint16(p, true);
  const u64 = (p: number): number => Number(v.getBigUint64(p, true));

  const eocd = zip.length - 22;
  exigir(eocd >= 0 && u32(eocd) === 0x06054b50, "sem EOCD");
  exigir(u16(eocd + 20) === 0, "comentário inesperado");

  let total = u16(eocd + 10);
  exigir(u16(eocd + 8) === total, "entradas no disco diferem do total");
  let tamanhoDoDiretorio = u32(eocd + 12);
  let inicio = u32(eocd + 16);
  let usouEocd64 = false;
  let fimDoDiretorio = eocd;

  if (
    total === 0xffff ||
    inicio === 0xffffffff ||
    tamanhoDoDiretorio === 0xffffffff
  ) {
    const loc = eocd - 20;
    exigir(loc >= 56 && u32(loc) === 0x07064b50, "sem localizador ZIP64");
    const e64 = u64(loc + 8);
    exigir(e64 === loc - 56, "o localizador não aponta para o EOCD64 real");
    exigir(u32(e64) === 0x06064b50, "sem EOCD64");
    exigir(u64(e64 + 4) === 44, "tamanho do EOCD64");
    usouEocd64 = true;
    total = u64(e64 + 32);
    exigir(u64(e64 + 24) === total, "entradas do EOCD64");
    tamanhoDoDiretorio = u64(e64 + 40);
    inicio = u64(e64 + 48);
    fimDoDiretorio = e64;
  }

  exigir(
    inicio + tamanhoDoDiretorio === fimDoDiretorio,
    "tamanho ou início do diretório central não conferem",
  );

  const entradas: EntradaLida[] = [];
  let p = inicio;
  let proximoLocal = 0; // os blocos locais são contíguos, a partir de 0

  for (let i = 0; i < total; i++) {
    exigir(u32(p) === 0x02014b50, `central ${i} inválido`);
    const flags = u16(p + 8);
    const metodo = u16(p + 10);
    const crc = u32(p + 16);
    const csize32 = u32(p + 20);
    const usize32 = u32(p + 24);
    const tn = u16(p + 28);
    const te = u16(p + 30);
    exigir(u16(p + 32) === 0, "comentário de entrada inesperado");
    let local = u32(p + 42);
    const nome = new TextDecoder("utf-8", { fatal: true }).decode(
      zip.subarray(p + 46, p + 46 + tn),
    );

    const extra = lerExtra64(v, p + 46 + tn, te);
    const valores = extra ? [...extra] : [];
    const total64 = valores.length;
    let tamanho = usize32;
    let compactado = csize32;
    if (usize32 === 0xffffffff) tamanho = Number(valores.shift());
    if (csize32 === 0xffffffff) compactado = Number(valores.shift());
    if (local === 0xffffffff) local = Number(valores.shift());
    exigir(valores.length === 0, `extra ZIP64 de ${nome} com valores demais`);
    exigir(metodo === 0, "método diferente de STORE");
    exigir(compactado === tamanho, `csize difere de usize em ${nome}`);

    // Cabeçalho local.
    exigir(local === proximoLocal, `${nome}: bloco local não é contíguo`);
    exigir(u32(local) === 0x04034b50, `local ${nome} inválido`);
    exigir((u16(local + 6) & 0x0808) === 0x0808, `flags locais de ${nome}`);
    exigir(u16(local + 6) === flags, `flags local e central de ${nome}`);
    exigir(
      u32(local + 14) === 0 && u32(local + 18) === 0 && u32(local + 22) === 0,
      `CRC e tamanhos do local de ${nome} deviam ser zero`,
    );
    const ln = u16(local + 26);
    const le = u16(local + 28);
    const nomeLocal = new TextDecoder("utf-8", { fatal: true }).decode(
      zip.subarray(local + 30, local + 30 + ln),
    );
    exigir(nomeLocal === nome, `nome local e central diferem: ${nome}`);
    const extraLocal = lerExtra64(v, local + 30 + ln, le);
    const zip64 = extraLocal !== null;
    const dataLocal = decodificarDataDos(u16(local + 10), u16(local + 12));
    const data = decodificarDataDos(u16(p + 12), u16(p + 14));
    exigir(
      JSON.stringify(dataLocal) === JSON.stringify(data),
      `data local e central de ${nome}`,
    );

    const ini = local + 30 + ln + le;
    const dados = zip.subarray(ini, ini + tamanho);
    exigir(dados.length === tamanho, `dados de ${nome} truncados`);
    exigir(crc32(dados) === crc, `CRC de ${nome} não confere`);

    // Data descriptor: a largura vem do extra ZIP64 do cabeçalho local.
    const d = ini + tamanho;
    exigir(u32(d) === 0x08074b50, `descriptor de ${nome} ausente`);
    exigir(u32(d + 4) === crc, `CRC do descriptor de ${nome}`);
    const csizeDescriptor = zip64 ? u64(d + 8) : u32(d + 8);
    const usizeDescriptor = zip64 ? u64(d + 8 + 8) : u32(d + 12);
    exigir(csizeDescriptor === tamanho, `csize do descriptor de ${nome}`);
    exigir(usizeDescriptor === tamanho, `usize do descriptor de ${nome}`);
    proximoLocal = d + 8 + (zip64 ? 16 : 8);

    entradas.push({
      nome,
      dados,
      crc,
      flags,
      zip64,
      valoresZip64NoCentral: total64,
      data,
    });
    p += 46 + tn + te;
  }

  exigir(p === fimDoDiretorio, "o diretório central não termina onde devia");
  exigir(proximoLocal === inicio, "há bytes entre os dados e o diretório");
  return { entradas, usouEocd64 };
}
