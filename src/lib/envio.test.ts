import { describe, expect, test } from "vitest";

import {
  SECAO_DO_MOMENTO,
  TAMANHO_MAXIMO,
  contar,
  descreverQuantidade,
  faseDoEnvio,
  filaDeEnvio,
  formatarTamanho,
  mensagemDeFalha,
  motivoDaRecusa,
  progressoDoEnvio,
  resumoDaEscolha,
  rotuloDoEnvio,
  textoAoVivo,
  tituloDoConcluido,
  type ArquivoEscolhido,
  type ArquivoNaFila,
} from "@/lib/envio";
import { montarSecoes } from "@/lib/loja";

const escolhido = (
  nome: string,
  tamanho = 4_000_000,
  chave = nome,
): ArquivoEscolhido => ({ id: chave, chave, nome, tamanho });

const naFila = (
  nome: string,
  situacao: ArquivoNaFila["situacao"],
  extra: Partial<ArquivoNaFila> = {},
): ArquivoNaFila =>
  ({
    ...escolhido(nome),
    situacao,
    ...(situacao === "enviando" ? { progresso: 0 } : {}),
    ...(situacao === "recusado" ? { motivo: "tipo" } : {}),
    ...extra,
  }) as ArquivoNaFila;

describe("motivoDaRecusa", () => {
  test.each([
    "IMG_2041.HEIC",
    "a.JPG",
    "b.jpeg",
    "c.png",
    "d.mp4",
    "VID_0007.MOV",
  ])("aceita %s", (nome) => {
    expect(motivoDaRecusa({ nome, tamanho: 1000 })).toBeNull();
  });

  test.each(["Planograma.pdf", "foto.gif", "foto.jpg.pdf", "foto.", "foto"])(
    "recusa %s pelo tipo, olhando a última extensão",
    (nome) => {
      expect(motivoDaRecusa({ nome, tamanho: 1000 })).toBe("tipo");
    },
  );

  test("o limite de 1 GB passa; um byte a mais, não", () => {
    expect(
      motivoDaRecusa({ nome: "VID.MOV", tamanho: TAMANHO_MAXIMO }),
    ).toBeNull();
    expect(
      motivoDaRecusa({ nome: "VID.MOV", tamanho: TAMANHO_MAXIMO + 1 }),
    ).toBe("tamanho");
  });

  test("arquivo vazio é recusado", () => {
    expect(motivoDaRecusa({ nome: "IMG.HEIC", tamanho: 0 })).toBe("vazio");
  });
});

describe("formatarTamanho", () => {
  test.each([
    [820_000, "820 KB"],
    [4_200_000, "4,2 MB"],
    [1_300_000_000, "1,3 GB"],
    [312, "1 KB"],
  ])("%d bytes = %s", (bytes, texto) => {
    expect(formatarTamanho(bytes)).toBe(texto);
  });
});

describe("resumo", () => {
  test("a quantidade junta fotos e vídeos", () => {
    expect(descreverQuantidade({ fotos: 12, videos: 1 })).toBe(
      "12 fotos e 1 vídeo",
    );
  });

  test.each([
    [{ fotos: 12, videos: 1 }, "12 fotos e 1 vídeo enviados"],
    [{ fotos: 1, videos: 0 }, "1 foto enviada"],
    [{ fotos: 2, videos: 0 }, "2 fotos enviadas"],
    [{ fotos: 0, videos: 1 }, "1 vídeo enviado"],
    [{ fotos: 0, videos: 2 }, "2 vídeos enviados"],
  ])("o particípio concorda: %o = %s", (contagem, titulo) => {
    expect(tituloDoConcluido(contagem)).toBe(titulo);
  });

  test("o botão diz quanto vai", () => {
    expect(rotuloDoEnvio({ fotos: 0, videos: 0 })).toBe(
      "Enviar fotos e vídeos",
    );
    expect(rotuloDoEnvio({ fotos: 12, videos: 1 })).toBe(
      "Enviar 12 fotos e 1 vídeo",
    );
  });

  test("a falha diz quantos não foram", () => {
    expect(mensagemDeFalha(1)).toBe(
      "1 arquivo não foi enviado. Confira a internet e tente de novo.",
    );
    expect(mensagemDeFalha(2)).toBe(
      "2 arquivos não foram enviados. Confira a internet e tente de novo.",
    );
  });

  test("a escolha diz quantos não vão", () => {
    expect(resumoDaEscolha(1, 0)).toBe("1 arquivo escolhido.");
    expect(resumoDaEscolha(13, 1)).toBe(
      "13 arquivos escolhidos. 1 não vai ser enviado.",
    );
    expect(resumoDaEscolha(13, 2)).toBe(
      "13 arquivos escolhidos. 2 não vão ser enviados.",
    );
  });

  test("MOV e mp4 são vídeos; o resto, fotos", () => {
    expect(
      contar([
        { nome: "VID_0007.MOV" },
        { nome: "Vídeo.mp4" },
        { nome: "IMG_2041.HEIC" },
      ]),
    ).toEqual({ fotos: 1, videos: 2 });
  });
});

describe("SECAO_DO_MOMENTO", () => {
  test("usa os mesmos títulos da tela da loja", () => {
    const [antes, depois] = montarSecoes([
      { nome: "Fotos antes", arquivos: [] },
      { nome: "Fotos Depois", arquivos: [] },
    ]);
    expect(SECAO_DO_MOMENTO.antes).toBe(antes.titulo);
    expect(SECAO_DO_MOMENTO.depois).toBe(depois.titulo);
  });
});

describe("filaDeEnvio", () => {
  const escolheu = (arquivos: ArquivoEscolhido[], fila: ArquivoNaFila[] = []) =>
    filaDeEnvio(fila, { tipo: "escolheu", arquivos });

  test("ao escolher, confere cada arquivo", () => {
    const fila = escolheu([
      escolhido("IMG_2041.HEIC", 4_000_000),
      escolhido("VID_0007.MOV", 1_300_000_000),
      escolhido("Planograma.pdf", 820_000),
    ]);
    expect(fila.map((a) => a.situacao)).toEqual([
      "pronto",
      "recusado",
      "recusado",
    ]);
    expect(fila[1]).toMatchObject({ motivo: "tamanho" });
    expect(fila[2]).toMatchObject({ motivo: "tipo" });
  });

  test("o mesmo arquivo duas vezes entra uma vez só", () => {
    const fila = escolheu([escolhido("IMG_2041.HEIC")]);
    expect(escolheu([escolhido("IMG_2041.HEIC")], fila)).toHaveLength(1);
    expect(
      escolheu([escolhido("IMG_2041.HEIC"), escolhido("IMG_2041.HEIC")]),
    ).toHaveLength(1);
  });

  test("dois arquivos diferentes com o mesmo nome entram os dois", () => {
    expect(
      escolheu([
        escolhido("IMG_0001.HEIC", 4_000_000, "a"),
        escolhido("IMG_0001.HEIC", 3_000_000, "b"),
      ]),
    ).toHaveLength(2);
  });

  test("tira o pronto, o recusado e o que falhou, mas não o enviado nem o que está indo", () => {
    const fila = [
      naFila("a.jpg", "pronto"),
      naFila("b.pdf", "recusado"),
      naFila("c.jpg", "falhou"),
      naFila("d.jpg", "enviado"),
      naFila("e.jpg", "enviando"),
    ];
    const tirar = (fila: ArquivoNaFila[], id: string) =>
      filaDeEnvio(fila, { tipo: "tirou", id });
    const depois = ["a.jpg", "b.pdf", "c.jpg", "d.jpg", "e.jpg"].reduce(
      tirar,
      fila,
    );
    expect(depois.map((a) => a.nome)).toEqual(["d.jpg", "e.jpg"]);
  });

  test("começa, anda, termina e falha", () => {
    let fila = [naFila("a.jpg", "pronto"), naFila("b.jpg", "pronto")];
    fila = filaDeEnvio(fila, { tipo: "comecou", id: "a.jpg" });
    expect(fila[0]).toMatchObject({ situacao: "enviando", progresso: 0 });
    fila = filaDeEnvio(fila, { tipo: "progrediu", id: "a.jpg", fracao: 1.5 });
    expect(fila[0]).toMatchObject({ situacao: "enviando", progresso: 1 });
    fila = filaDeEnvio(fila, { tipo: "terminou", id: "a.jpg" });
    expect(fila[0].situacao).toBe("enviado");
    fila = filaDeEnvio(fila, { tipo: "comecou", id: "b.jpg" });
    fila = filaDeEnvio(fila, { tipo: "falhou", id: "b.jpg" });
    expect(fila[1].situacao).toBe("falhou");
  });

  test("parar volta o que estava indo; recomeçar volta o que falhou", () => {
    const fila = [naFila("a.jpg", "enviando"), naFila("b.jpg", "falhou")];
    expect(filaDeEnvio(fila, { tipo: "parou" }).map((a) => a.situacao)).toEqual(
      ["pronto", "falhou"],
    );
    expect(
      filaDeEnvio(fila, { tipo: "recomecou" }).map((a) => a.situacao),
    ).toEqual(["enviando", "pronto"]);
  });

  test("limpar esvazia a fila", () => {
    expect(
      filaDeEnvio([naFila("a.jpg", "enviado")], { tipo: "limpou" }),
    ).toEqual([]);
  });
});

describe("faseDoEnvio", () => {
  test.each<[string, ArquivoNaFila[], boolean, string]>([
    ["vazia", [], false, "escolhendo"],
    ["só prontos", [naFila("a.jpg", "pronto")], false, "escolhendo"],
    ["rodando", [naFila("a.jpg", "pronto")], true, "enviando"],
    [
      "um indo (prévia parada)",
      [naFila("a.jpg", "enviando")],
      false,
      "enviando",
    ],
    [
      "um falhou",
      [naFila("a.jpg", "enviado"), naFila("b.jpg", "falhou")],
      false,
      "com-falha",
    ],
    [
      "todos os válidos enviados",
      [naFila("a.jpg", "enviado"), naFila("b.pdf", "recusado")],
      false,
      "concluido",
    ],
    ["só recusados", [naFila("b.pdf", "recusado")], false, "escolhendo"],
  ])("%s", (_, fila, rodando, fase) => {
    expect(faseDoEnvio(fila, rodando)).toBe(fase);
  });
});

describe("textoAoVivo", () => {
  const fila = [naFila("a.jpg", "enviado"), naFila("b.jpg", "enviando")];

  test("durante o envio, a contagem", () => {
    expect(textoAoVivo("enviando", fila, "2 arquivos escolhidos.")).toBe(
      "1 de 2 enviados",
    );
  });

  test("na escolha, o resultado da última escolha", () => {
    expect(textoAoVivo("escolhendo", [], "2 arquivos escolhidos.")).toBe(
      "2 arquivos escolhidos.",
    );
  });

  test("no fim, nada: o aviso de erro e o título do sucesso já anunciam", () => {
    expect(textoAoVivo("concluido", fila, "2 arquivos escolhidos.")).toBe("");
    expect(textoAoVivo("com-falha", fila, "2 arquivos escolhidos.")).toBe("");
  });
});

describe("progressoDoEnvio", () => {
  test("conta os enviados sobre os que vão, sem os recusados", () => {
    const fila = [
      naFila("a.jpg", "enviado"),
      naFila("b.jpg", "enviado"),
      naFila("c.jpg", "enviando"),
      ...Array.from({ length: 10 }, (_, i) => naFila(`p${i}.jpg`, "pronto")),
      naFila("x.pdf", "recusado"),
    ];
    expect(progressoDoEnvio(fila)).toBe("2 de 13 enviados");
  });
});
