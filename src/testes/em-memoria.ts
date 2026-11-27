import type {
  ChecagemDeAcesso,
  FonteDeArquivos,
  LojaDoUsuario,
} from "@/lib/arquivos/baixar-tudo";
import type { PastaDaLoja } from "@/lib/loja";

// Dublês das portas do download em .zip, só para testes. Ficam fora de
// `src/lib` para nunca serem importados pelo código de produção.

function streamDeBytes(dados: Uint8Array): ReadableStream<Uint8Array> {
  const PEDACO = 64 * 1024;
  let pos = 0;
  return new ReadableStream<Uint8Array>(
    {
      pull(c) {
        if (pos >= dados.length) return c.close();
        c.enqueue(dados.subarray(pos, pos + PEDACO));
        pos += PEDACO;
      },
    },
    { highWaterMark: 0 },
  );
}

export type FonteEmMemoria = FonteDeArquivos & {
  /** Os itens que foram abertos, na ordem. */
  abertos: string[];
};

export function criarFonteDeArquivosEmMemoria(dados: {
  pastas: Record<string, PastaDaLoja[]>;
  conteudos: Record<string, Uint8Array>;
}): FonteEmMemoria {
  const abertos: string[] = [];
  return {
    abertos,
    async listarPastasDaLoja(lojaId) {
      return dados.pastas[lojaId] ?? [];
    },
    async abrirConteudo(itemId) {
      const conteudo = dados.conteudos[itemId];
      if (!conteudo) throw new Error(`Item ${itemId} não existe.`);
      abertos.push(itemId);
      return streamDeBytes(conteudo);
    },
  };
}

export function criarChecagemEmMemoria(dados: {
  logado: boolean;
  lojas: LojaDoUsuario[];
}): ChecagemDeAcesso {
  return {
    async lojaDoUsuario(_req, lojaId) {
      if (!dados.logado) return "sem-sessao";
      return dados.lojas.find((l) => l.id === lojaId) ?? null;
    },
  };
}
