import "server-only";

import {
  DependenciasNaoConfiguradas,
  type ChecagemDeAcesso,
  type DependenciasDoZip,
  type FonteDeArquivos,
} from "@/lib/arquivos/baixar-tudo";

// Onde o download em .zip se liga ao resto do portal. Hoje as duas fábricas
// lançam erro, e a rota responde 503. As versões em memória ficam em
// `src/testes/em-memoria.ts` e servem só aos testes: nunca devem ser usadas aqui.

/** Card #4: lista e lê os arquivos da loja no SharePoint, pelo Graph. */
export function criarFonteDeArquivos(): FonteDeArquivos {
  throw new DependenciasNaoConfiguradas();
}

/** Cards #10 e #12: descobre a sessão e a loja do usuário. */
export function criarChecagemDeAcesso(): ChecagemDeAcesso {
  throw new DependenciasNaoConfiguradas();
}

export function obterDependencias(): DependenciasDoZip {
  return {
    fonte: criarFonteDeArquivos(),
    checagem: criarChecagemDeAcesso(),
  };
}
