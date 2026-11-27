import { describe, expect, test } from "vitest";

import { TelaDeEnvio } from "@/components/envio/TelaDeEnvio";
import {
  ERROS,
  mensagemDeFalha,
  type ArquivoNaFila,
  type EstadoInicialDoEnvio,
} from "@/lib/envio";
import { renderizar } from "@/testes/renderizar";

const JUMALTI = {
  id: "jumalti",
  nome: "Drogaria Jumalti - Caxias do Sul",
  href: "/loja/jumalti",
};

const item = (
  nome: string,
  situacao: ArquivoNaFila["situacao"],
  extra: object = {},
): ArquivoNaFila =>
  ({
    id: nome,
    chave: nome,
    nome,
    tamanho: 4_000_000,
    situacao,
    ...extra,
  }) as ArquivoNaFila;

const fotos = (n: number, situacao: ArquivoNaFila["situacao"]) =>
  Array.from({ length: n }, (_, i) => item(`IMG_${2041 + i}.HEIC`, situacao));

const tela = (estadoInicial?: EstadoInicialDoEnvio) =>
  renderizar(
    <TelaDeEnvio
      lojas={[JUMALTI]}
      lojaId="jumalti"
      enviar={async () => {}}
      estadoInicial={estadoInicial}
    />,
  );

describe("TelaDeEnvio", () => {
  test("vazia: o título, o caminho de volta e o botão livre", () => {
    const html = tela();
    expect(html).toMatch(/<h1[^>]*>Enviar fotos e vídeos<\/h1>/);
    expect(html).toMatch(/<a[^>]*href="\/loja\/jumalti"[^>]*>[\s\S]*?Sua loja/);
    expect(html).not.toContain("<select");
    expect(html).toContain(">Enviar fotos e vídeos</button>");
    expect(html).not.toContain('aria-busy="true"');
  });

  test("o botão conta só o que vai", () => {
    const html = tela({
      fila: [
        ...fotos(2, "pronto"),
        item("VID_0008.MOV", "pronto"),
        item("Planograma.pdf", "recusado", { motivo: "tipo" }),
      ],
    });
    expect(html).toContain("Enviar 2 fotos e 1 vídeo");
  });

  test("enviando: o botão ocupado e o destino travado", () => {
    const html = tela({
      momento: "antes",
      fila: [item("IMG_2041.HEIC", "enviando", { progresso: 0.5 })],
    });
    expect(html).toContain('aria-busy="true"');
    expect(html).toContain("Enviando…");
    expect(html).toMatch(/<fieldset[^>]*disabled=""/);
  });

  test("com falha: o aviso e o Tentar de novo", () => {
    const html = tela({
      momento: "antes",
      fila: [...fotos(2, "enviado"), item("VID_0008.MOV", "falhou")],
    });
    expect(html).toContain(mensagemDeFalha(1));
    expect(html).toContain("Tentar de novo");
  });

  test("concluído: o resumo no lugar dos passos", () => {
    const html = tela({
      momento: "antes",
      fila: [...fotos(12, "enviado"), item("VID_0008.MOV", "enviado")],
    });
    expect(html).toContain("12 fotos e 1 vídeo enviados");
    expect(html).not.toContain('type="file"');
  });

  test("sem antes ou depois: o erro na pergunta", () => {
    const html = tela({
      fila: fotos(1, "pronto"),
      erros: { momento: ERROS.momento },
    });
    expect(html).toMatch(new RegExp(`role="alert"[^>]*>${ERROS.momento}`));
  });
});
