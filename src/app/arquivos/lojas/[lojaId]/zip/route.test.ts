import { describe, expect, test, vi } from "vitest";

import {
  DependenciasNaoConfiguradas,
  type DependenciasDoZip,
} from "@/lib/arquivos/baixar-tudo";
import { criarGetDoZip } from "@/lib/arquivos/rota-do-zip";
import { montarSecoes } from "@/lib/loja";
import {
  criarChecagemEmMemoria,
  criarFonteDeArquivosEmMemoria,
} from "@/testes/em-memoria";
import { lerTudo, lerZip } from "@/testes/ler-zip";

// O `dependencias.ts` é server-only; aqui ele é trocado pela versão real das
// fábricas, que lançam "não configurado".
vi.mock("@/lib/arquivos/dependencias", () => ({
  obterDependencias: () => {
    throw new DependenciasNaoConfiguradas();
  },
}));

import { GET as GET_REAL, maxDuration } from "./route";

const FOTO = {
  id: "d1",
  nome: "foto.jpg",
  atualizadoEm: "2026-10-28T12:00:00Z",
  tamanho: 4,
};

function dependencias(logado = true): DependenciasDoZip {
  return {
    fonte: criarFonteDeArquivosEmMemoria({
      pastas: {
        "loja-1": [
          { nome: "Fotos Depois", arquivos: [FOTO] },
          { nome: "Fotos antes", arquivos: [] },
        ],
      },
      conteudos: { d1: new TextEncoder().encode("foto") },
    }),
    checagem: criarChecagemEmMemoria({
      logado,
      lojas: [{ id: "loja-1", nome: "Farmácia Brick - Salvador" }],
    }),
  };
}

function chamarCom(deps: DependenciasDoZip, consulta = "") {
  return criarGetDoZip(() => deps)(
    new Request(`http://localhost/arquivos/lojas/loja-1/zip${consulta}`),
    { params: Promise.resolve({ lojaId: "loja-1" }) },
  );
}

function chamar(lojaId: string, consulta = "", logado = true) {
  const GET = criarGetDoZip(() => dependencias(logado));
  return GET(
    new Request(`http://localhost/arquivos/lojas/${lojaId}/zip${consulta}`),
    { params: Promise.resolve({ lojaId }) },
  );
}

describe("GET /arquivos/lojas/[lojaId]/zip", () => {
  test("a função pode durar até 300 s", () => {
    expect(maxDuration).toBe(300);
  });

  test("200 com o zip e os cabeçalhos de download", async () => {
    const resposta = await chamar("loja-1", "?secao=depois");

    expect(resposta.status).toBe(200);
    expect(resposta.headers.get("Content-Type")).toBe("application/zip");
    expect(resposta.headers.get("Content-Disposition")).toBe(
      `attachment; filename="Farmacia Brick - Salvador - Fotos depois.zip"; filename*=UTF-8''Farm%C3%A1cia%20Brick%20-%20Salvador%20-%20Fotos%20depois.zip`,
    );
    expect(resposta.headers.get("Cache-Control")).toBe("private, no-store");
    expect(resposta.headers.get("X-Content-Type-Options")).toBe("nosniff");
    expect(resposta.headers.get("Content-Length")).toBeNull();

    const { entradas } = lerZip(await lerTudo(resposta.body!));
    expect(entradas.map((e) => e.nome)).toEqual(["foto.jpg"]);
  });

  test("sem ?secao baixa a loja inteira", async () => {
    const resposta = await chamar("loja-1");

    expect(resposta.status).toBe(200);
    const { entradas } = lerZip(await lerTudo(resposta.body!));
    expect(entradas.map((e) => e.nome)).toEqual(["Fotos depois/foto.jpg"]);
  });

  test("401 sem sessão", async () => {
    expect((await chamar("loja-1", "", false)).status).toBe(401);
  });

  test("404 para loja de outro usuário", async () => {
    expect((await chamar("loja-2")).status).toBe(404);
  });

  test("404 para seção que não existe, vazia ou a pasta Interno", async () => {
    expect((await chamar("loja-1", "?secao=pasta-xyz")).status).toBe(404);
    expect((await chamar("loja-1", "?secao=antes")).status).toBe(404);
    expect((await chamar("loja-1", "?secao=interno")).status).toBe(404);
  });

  test("o id de uma pasta de nome longo (120 caracteres) é aceito", async () => {
    const nome = "Pasta " + "x".repeat(114);
    const [secao] = montarSecoes([{ nome, arquivos: [] }]);
    expect(nome).toHaveLength(120);

    const resposta = await chamar("loja-1", `?secao=${secao.id}`);

    // 404 porque a pasta não existe nesta loja; o que importa é não dar 400.
    expect(resposta.status).toBe(404);
  });

  test("400 para seção inválida", async () => {
    for (const secao of [
      "../etc",
      "Depois",
      "",
      "d1;rm",
      "pasta-" + "a".repeat(300),
    ]) {
      const resposta = await chamar(
        "loja-1",
        `?secao=${encodeURIComponent(secao)}`,
      );
      expect(resposta.status, secao).toBe(400);
    }
  });

  test("503 em pt-BR quando as dependências não estão configuradas", async () => {
    const resposta = await GET_REAL(
      new Request("http://localhost/arquivos/lojas/loja-1/zip"),
      { params: Promise.resolve({ lojaId: "loja-1" }) },
    );

    expect(resposta.status).toBe(503);
    expect((await resposta.json()).erro).toContain("não está disponível");
  });

  test("502 sem expor a mensagem do erro nem logar URL", async () => {
    const quebrada: DependenciasDoZip = {
      ...dependencias(),
      fonte: {
        listarPastasDaLoja: async () => {
          throw new Error("https://graph.microsoft.com/x?token=segredo");
        },
        abrirConteudo: async () => {
          throw new Error("não deveria abrir");
        },
      },
    };
    const log = vi.spyOn(console, "error").mockImplementation(() => {});

    const resposta = await chamarCom(quebrada);
    const corpo = await resposta.text();

    expect(resposta.status).toBe(502);
    expect(corpo).not.toContain("segredo");
    expect(JSON.stringify(log.mock.calls)).not.toContain("segredo");
    log.mockRestore();
  });

  test("413 quando o arquivo não informa o tamanho", async () => {
    const deps = dependencias();
    deps.fonte = {
      ...deps.fonte,
      listarPastasDaLoja: async () => [
        {
          nome: "Fotos Depois",
          arquivos: [{ ...FOTO, tamanho: undefined }],
        },
      ],
    };

    const resposta = await chamarCom(deps);

    expect(resposta.status).toBe(413);
    expect((await resposta.json()).erro).toContain("um por um");
  });

  test("nome de loja com surrogate solto não derruba a resposta", async () => {
    const deps = dependencias();
    deps.checagem = criarChecagemEmMemoria({
      logado: true,
      lojas: [{ id: "loja-1", nome: "Loja \ud83d Centro" }],
    });

    const resposta = await chamarCom(deps);

    expect(resposta.status).toBe(200);
    await resposta.body?.cancel();
  });

  test("falha no meio do zip é registrada só com o nome do erro e o contexto", async () => {
    const deps = dependencias();
    deps.fonte = {
      ...deps.fonte,
      abrirConteudo: async () => {
        throw Object.assign(
          new Error("https://graph.microsoft.com/x?token=segredo"),
          { name: "ErroDoGraph", status: 400 },
        );
      },
    };
    const log = vi.spyOn(console, "error").mockImplementation(() => {});

    const resposta = await chamarCom(deps, "?secao=depois");
    await lerTudo(resposta.body!).catch(() => {});

    const registrado = JSON.stringify(log.mock.calls);
    expect(registrado).toContain("ErroDoGraph");
    expect(registrado).toContain("loja-1");
    expect(registrado).not.toContain("segredo");
    expect(registrado).not.toContain("graph.microsoft");
    log.mockRestore();
  });
});
