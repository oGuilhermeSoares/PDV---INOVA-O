import { createRef } from "react";
import { describe, expect, test } from "vitest";

import { AreaDeArquivos } from "@/components/envio/AreaDeArquivos";
import { EnvioConcluido } from "@/components/envio/EnvioConcluido";
import {
  EscolhaDoDestino,
  EscolhaDoMomento,
} from "@/components/envio/EscolhaDoDestino";
import { LinhaDoArquivo } from "@/components/envio/LinhaDoArquivo";
import {
  ACCEPT,
  DICA_DOS_TIPOS,
  ERROS,
  MENSAGEM_DE_FALHA,
  MOTIVOS,
  type ArquivoNaFila,
  type FaseDoEnvio,
} from "@/lib/envio";
import { renderizar } from "@/testes/renderizar";

const nada = () => {};
const JUMALTI = {
  id: "jumalti",
  nome: "Drogaria Jumalti - Caxias do Sul",
  href: "/loja/jumalti",
};
const GERAL = { id: "geral", nome: "Farmácia Geral", href: "/loja/geral" };

const foto = (extra: Partial<ArquivoNaFila> = {}): ArquivoNaFila =>
  ({
    id: "IMG_2041.HEIC",
    chave: "IMG_2041.HEIC",
    nome: "IMG_2041.HEIC",
    tamanho: 4_200_000,
    situacao: "pronto",
    ...extra,
  }) as ArquivoNaFila;

const linha = (arquivo: ArquivoNaFila, fase: FaseDoEnvio = "escolhendo") =>
  renderizar(
    <ul>
      <LinhaDoArquivo arquivo={arquivo} fase={fase} aoTirar={nada} />
    </ul>,
  );

const destino = (lojas = [JUMALTI]) =>
  renderizar(
    <EscolhaDoDestino
      lojas={lojas}
      lojaId="jumalti"
      aoMudarLoja={nada}
      aoMudarMomento={nada}
      desabilitado={false}
      refDoMomento={createRef()}
    />,
  );

describe("EscolhaDoDestino", () => {
  test("com uma loja, mostra o nome, sem campo de escolha", () => {
    const html = destino();
    expect(html).toContain(">Loja<");
    expect(html).toContain("Drogaria Jumalti - Caxias do Sul");
    expect(html).not.toContain("<select");
  });

  test("com duas lojas, a de origem vem escolhida", () => {
    const html = destino([JUMALTI, GERAL]);
    expect(html).toContain("<select");
    expect(html.match(/<option/g)).toHaveLength(2);
    expect(html).toMatch(/<option value="jumalti" selected="">/);
  });
});

describe("EscolhaDoMomento", () => {
  const momento = (erro?: string) =>
    renderizar(
      <EscolhaDoMomento
        aoMudar={nada}
        erro={erro}
        desabilitado={false}
        refDoPrimeiro={createRef()}
      />,
    );

  test("antes e depois, sem nenhum marcado", () => {
    const html = momento();
    expect(html.match(/type="radio"/g)).toHaveLength(2);
    expect(html.match(/name="momento"/g)).toHaveLength(2);
    expect(html).not.toMatch(/\schecked=""/);
    expect(html).toContain(
      "As fotos e os vídeos são de antes ou de depois da assessoria?",
    );
    expect(html).toContain("Como a loja estava");
    expect(html).toContain("Como a loja ficou");
  });

  test("o erro fica ligado à pergunta", () => {
    const html = momento(ERROS.momento);
    const id = html.match(/<p id="([^"]+)" role="alert"/)?.[1];
    expect(id).toBeTruthy();
    expect(html).toContain(ERROS.momento);
    expect(html).toMatch(new RegExp(`<fieldset[^>]*aria-describedby="${id}"`));
  });
});

describe("LinhaDoArquivo", () => {
  test("pronta: o tipo, o tamanho e o Tirar com o nome", () => {
    const html = linha(foto());
    expect(html).toContain('aria-label="Tirar IMG_2041.HEIC"');
    expect(html).toContain("Foto · 4,2 MB");
  });

  test("recusada: o motivo, e dá para tirar", () => {
    const html = linha(
      foto({ situacao: "recusado", motivo: "tamanho" } as never),
    );
    expect(html).toContain(MOTIVOS.tamanho);
    expect(html).toContain("Tirar");
  });

  test("enviando: a barra com a porcentagem, sem Tirar", () => {
    const html = linha(
      foto({ situacao: "enviando", progresso: 0.64 } as never),
      "enviando",
    );
    expect(html).toContain('role="progressbar"');
    expect(html).toContain('aria-valuenow="64"');
    expect(html).toContain("64%");
    expect(html).not.toContain("Tirar");
  });

  test("esperando a vez: Na fila, sem Tirar", () => {
    const html = linha(foto(), "enviando");
    expect(html).toContain("Na fila");
    expect(html).not.toContain("Tirar");
  });

  test("enviada: não dá para tirar", () => {
    const html = linha(foto({ situacao: "enviado" }));
    expect(html).toContain("Enviado");
    expect(html).not.toContain("Tirar");
  });

  test("falhou: a mensagem, e dá para tirar", () => {
    const html = linha(foto({ situacao: "falhou" }), "com-falha");
    expect(html).toContain(MENSAGEM_DE_FALHA);
    expect(html).toContain("Tirar");
  });
});

describe("AreaDeArquivos", () => {
  const area = (fila: ArquivoNaFila[], fase: FaseDoEnvio = "escolhendo") =>
    renderizar(
      <AreaDeArquivos
        fila={fila}
        fase={fase}
        aoEscolher={nada}
        aoTirar={nada}
        refDoBotao={createRef()}
      />,
    );

  test("vazia: o campo de arquivos e os tipos aceitos", () => {
    const html = area([]);
    expect(html).toContain('type="file"');
    expect(html).toContain('multiple=""');
    expect(html).toContain(`accept="${ACCEPT}"`);
    expect(html).toContain("Escolher fotos e vídeos");
    expect(html).toContain(DICA_DOS_TIPOS);
  });

  test("com arquivos: Escolher mais e a lista", () => {
    const html = area([foto()]);
    expect(html).toContain("Escolher mais");
    expect(html).toContain('aria-label="Arquivos escolhidos"');
  });

  test("durante o envio, não dá para escolher", () => {
    expect(area([foto()], "enviando")).toMatch(/<button[^>]*disabled=""/);
  });
});

describe("EnvioConcluido", () => {
  test("diz quanto foi, para onde, e o que fazer depois", () => {
    const html = renderizar(
      <EnvioConcluido
        contagem={{ fotos: 12, videos: 1 }}
        momento="antes"
        loja={JUMALTI}
        aoEnviarMais={nada}
      />,
    );
    expect(html).toContain("12 fotos e 1 vídeo enviados");
    expect(html).toContain("Já estão em Fotos e vídeos: antes");
    expect(html).toContain('href="/loja/jumalti"');
    expect(html).toContain("Enviar mais fotos e vídeos");
  });
});
