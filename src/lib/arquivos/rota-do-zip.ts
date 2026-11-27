import "server-only";

import { z } from "zod";

import {
  DependenciasNaoConfiguradas,
  prepararZip,
  type DependenciasDoZip,
} from "@/lib/arquivos/baixar-tudo";
import { formatoDeIdDeSecaoValido } from "@/lib/loja";
import { contentDisposition } from "@/lib/zip/cabecalhos";

// A lógica da rota GET /arquivos/lojas/[lojaId]/zip, separada do `route.ts`
// para os testes injetarem as dependências sem carregar o Graph.

// Só o formato: se a seção existe, quem decide é `prepararZip` (404).
const secaoSchema = z.string().refine(formatoDeIdDeSecaoValido);

const lojaIdSchema = z.string().min(1).max(200);

type Contexto = { params: Promise<{ lojaId: string }> };

function texto(mensagem: string, status: number): Response {
  return Response.json(
    { erro: mensagem },
    { status, headers: { "Cache-Control": "private, no-store" } },
  );
}

export function criarGetDoZip(obterDependencias: () => DependenciasDoZip) {
  return async function GET(
    request: Request,
    { params }: Contexto,
  ): Promise<Response> {
    let deps: DependenciasDoZip;
    try {
      deps = obterDependencias();
    } catch (erro) {
      if (erro instanceof DependenciasNaoConfiguradas) {
        return texto("O download em .zip ainda não está disponível.", 503);
      }
      throw erro;
    }

    const bruta = new URL(request.url).searchParams.get("secao");
    let secaoId: string | null = null;
    if (bruta !== null) {
      const secao = secaoSchema.safeParse(bruta);
      if (!secao.success) return texto("Seção inválida.", 400);
      secaoId = secao.data;
    }

    const loja = lojaIdSchema.safeParse((await params).lojaId);
    if (!loja.success) return texto("Loja não encontrada.", 404);

    let resultado;
    try {
      // Só o nome do erro, e o id da loja e da seção: nunca URL nem token.
      const contexto = { lojaId: loja.data, secao: secaoId };
      resultado = await prepararZip(deps, request, loja.data, secaoId, {
        aoFalhar: (nome) =>
          console.error("[zip] falha ao gerar o zip:", nome, contexto),
        aoTentarDeNovo: (nome) =>
          console.error(
            "[zip] nova tentativa ao abrir um arquivo:",
            nome,
            contexto,
          ),
      });
    } catch (erro) {
      // Só o tipo do erro: a mensagem do Graph pode trazer URL ou token.
      console.error(
        "[zip] falha ao preparar o download:",
        erro instanceof Error ? erro.name : typeof erro,
      );
      return texto("Não foi possível preparar o download agora.", 502);
    }

    switch (resultado.tipo) {
      case "sem-sessao":
        return texto("Entre no portal para baixar os arquivos.", 401);
      case "nao-encontrado":
        return texto("Loja ou seção não encontrada.", 404);
      case "vazio":
        return texto("Não há arquivos para baixar aqui.", 404);
      case "grande-demais":
        return texto(
          "Os arquivos são grandes demais para um .zip, ou não informam o tamanho. Baixe os arquivos um por um.",
          413,
        );
      case "ok": {
        // O cabeçalho é calculado com o stream já criado: se falhar, o corpo
        // é cancelado em vez de ficar aberto.
        let disposicao: string;
        try {
          disposicao = contentDisposition(resultado.nome);
        } catch {
          await resultado.corpo.cancel().catch(() => {});
          return texto("Não foi possível preparar o download agora.", 500);
        }
        return new Response(resultado.corpo, {
          status: 200,
          headers: {
            "Content-Type": "application/zip",
            "Content-Disposition": disposicao,
            "Cache-Control": "private, no-store",
            "X-Content-Type-Options": "nosniff",
          },
        });
      }
    }
  };
}
