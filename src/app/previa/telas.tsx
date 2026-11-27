import type { ReactNode } from "react";

import { EntradaDaEquipe } from "@/components/entrada/EntradaDaEquipe";
import { FormularioCnpj } from "@/components/entrada/FormularioCnpj";
import { FormularioCodigo } from "@/components/entrada/FormularioCodigo";
import { TelaDaEquipe, TelaDoAssociado } from "@/components/entrada/Telas";
import { TelaDaLoja } from "@/components/loja/TelaDaLoja";
import { MENSAGENS, type RespostaDaEntrada } from "@/lib/entrada";
import { ERROS, type EstadoInicialDoEnvio } from "@/lib/envio";

import {
  ESCOLHIDOS_DE_EXEMPLO,
  FARMACIA_GERAL,
  JUMALTI,
  LEVA_DE_EXEMPLO,
  filaDeExemplo,
  secoesDaFarmaciaGeral,
  secoesDaJumalti,
  secoesVazias,
  zipDaPrevia,
} from "./dados-de-exemplo";
import { EnvioDaPrevia } from "./EnvioDaPrevia";

const EMAIL = "jo***@gmail.com";

/** A loja única da prévia; "Sua loja" e "Ver na tela da loja" voltam para ela. */
const UMA_LOJA = [{ ...JUMALTI, href: "/previa/loja" }];

/** O seletor da prévia troca entre as duas telas do associado com duas lojas. */
const DUAS_LOJAS = [
  { ...JUMALTI, href: "/previa/loja-varias-lojas" },
  { ...FARMACIA_GERAL, href: "/previa/loja-farmacia-geral" },
];

type ItemDaPrevia = {
  titulo: string;
  grupo: "Associado" | "Loja" | "Envio" | "Equipe";
  /** A página inteira, já no estado. */
  tela: ReactNode;
};

function cnpj(estadoInicial?: RespostaDaEntrada) {
  return (
    <TelaDoAssociado>
      <FormularioCnpj estadoInicial={estadoInicial} />
    </TelaDoAssociado>
  );
}

function codigo({
  estadoInicial,
  segundos,
  email = EMAIL,
}: {
  estadoInicial?: RespostaDaEntrada;
  segundos?: number;
  email?: string;
} = {}) {
  return (
    <TelaDoAssociado>
      <FormularioCodigo
        emailMascarado={email}
        segundosParaReenviar={segundos}
        estadoInicial={estadoInicial}
      />
    </TelaDoAssociado>
  );
}

function envio(estadoInicial?: EstadoInicialDoEnvio, lojas = UMA_LOJA) {
  return (
    <EnvioDaPrevia
      lojas={lojas}
      lojaId={JUMALTI.id}
      estadoInicial={estadoInicial}
    />
  );
}

function equipe(estadoInicial?: RespostaDaEntrada) {
  return (
    <TelaDaEquipe>
      <EntradaDaEquipe estadoInicial={estadoInicial} />
    </TelaDaEquipe>
  );
}

/** Cada tela de entrada em cada estado, desenhada inteira. */
export const TELAS: Record<string, ItemDaPrevia> = {
  cnpj: { titulo: "CNPJ", grupo: "Associado", tela: cnpj() },
  "cnpj-incompleto": {
    titulo: "CNPJ incompleto",
    grupo: "Associado",
    tela: cnpj({ erro: MENSAGENS.cnpjTamanho, valor: "11.222.333/0001" }),
  },
  "cnpj-nao-confere": {
    titulo: "CNPJ que não confere",
    grupo: "Associado",
    tela: cnpj({ erro: MENSAGENS.cnpjNaoConfere, valor: "11.222.333/0001-82" }),
  },
  "cnpj-nao-liberado": {
    titulo: "CNPJ válido, acesso ainda não liberado",
    grupo: "Associado",
    tela: cnpj({
      aviso: { tom: "atencao", texto: MENSAGENS.acessoNaoLiberado },
      valor: "11.222.333/0001-81",
    }),
  },
  codigo: { titulo: "Código", grupo: "Associado", tela: codigo() },
  "codigo-reenvio-liberado": {
    titulo: "Código, reenvio liberado",
    grupo: "Associado",
    tela: codigo({ segundos: 0 }),
  },
  "codigo-errado": {
    titulo: "Código errado",
    grupo: "Associado",
    tela: codigo({ estadoInicial: { erro: MENSAGENS.codigoErrado } }),
  },
  "codigo-vencido": {
    titulo: "Código vencido",
    grupo: "Associado",
    tela: codigo({
      estadoInicial: {
        aviso: { tom: "atencao", texto: MENSAGENS.codigoVencido },
      },
    }),
  },
  "codigo-bloqueado": {
    titulo: "Código bloqueado depois de 5 erros",
    grupo: "Associado",
    tela: codigo({
      estadoInicial: {
        aviso: { tom: "erro", texto: MENSAGENS.codigoBloqueado },
      },
    }),
  },
  "codigo-reenviado": {
    titulo: "Código reenviado",
    grupo: "Associado",
    tela: codigo({
      estadoInicial: {
        aviso: { tom: "sucesso", texto: MENSAGENS.codigoReenviado(EMAIL) },
      },
    }),
  },
  "codigo-email-longo": {
    titulo: "Código, e-mail longo",
    grupo: "Associado",
    tela: codigo({ email: "ma***@farmaciasassociadas.com.br" }),
  },
  loja: {
    titulo: "Drogaria Jumalti (uma loja)",
    grupo: "Loja",
    tela: (
      <TelaDaLoja
        loja={JUMALTI}
        lojas={UMA_LOJA}
        secoes={secoesDaJumalti()}
        enviarHref="/previa/envio"
        zipHref={zipDaPrevia(JUMALTI.id)}
      />
    ),
  },
  "loja-varias-lojas": {
    titulo: "Associado com duas lojas",
    grupo: "Loja",
    tela: (
      <TelaDaLoja
        loja={JUMALTI}
        lojas={DUAS_LOJAS}
        secoes={secoesDaJumalti()}
        enviarHref="/previa/envio-varias-lojas"
        zipHref={zipDaPrevia(JUMALTI.id)}
      />
    ),
  },
  "loja-farmacia-geral": {
    titulo: "Segunda loja, quase vazia",
    grupo: "Loja",
    tela: (
      <TelaDaLoja
        loja={FARMACIA_GERAL}
        lojas={DUAS_LOJAS}
        secoes={secoesDaFarmaciaGeral()}
        enviarHref="/previa/envio-varias-lojas"
        zipHref={zipDaPrevia(FARMACIA_GERAL.id)}
      />
    ),
  },
  "loja-secao-vazia": {
    titulo: "Seção vazia (sem fotos de depois)",
    grupo: "Loja",
    tela: (
      <TelaDaLoja
        loja={JUMALTI}
        lojas={[{ ...JUMALTI, href: "/previa/loja-secao-vazia" }]}
        secoes={secoesDaJumalti({ semFotosDeDepois: true })}
        enviarHref="/previa/envio"
        zipHref={zipDaPrevia(JUMALTI.id)}
      />
    ),
  },
  "loja-grande-demais": {
    titulo: "Fotos e vídeos grandes demais para um .zip",
    grupo: "Loja",
    tela: (
      <TelaDaLoja
        loja={JUMALTI}
        lojas={[{ ...JUMALTI, href: "/previa/loja-grande-demais" }]}
        secoes={secoesDaJumalti({ videoGrande: true })}
        enviarHref="/previa/envio"
        zipHref={zipDaPrevia(JUMALTI.id)}
      />
    ),
  },
  "loja-vazia": {
    titulo: "Loja sem nenhum arquivo ainda",
    grupo: "Loja",
    tela: (
      <TelaDaLoja
        loja={JUMALTI}
        lojas={[{ ...JUMALTI, href: "/previa/loja-vazia" }]}
        secoes={secoesVazias()}
        enviarHref="/previa/envio"
        zipHref={zipDaPrevia(JUMALTI.id)}
      />
    ),
  },
  "loja-erro": {
    titulo: "SharePoint fora do ar",
    grupo: "Loja",
    tela: (
      <TelaDaLoja
        loja={JUMALTI}
        lojas={[{ ...JUMALTI, href: "/previa/loja-erro" }]}
        secoes={[]}
        enviarHref="/previa/envio"
        zipHref={zipDaPrevia(JUMALTI.id)}
        erro
      />
    ),
  },
  envio: { titulo: "Envio, com uma loja", grupo: "Envio", tela: envio() },
  "envio-varias-lojas": {
    titulo: "Envio, com duas lojas",
    grupo: "Envio",
    tela: envio(undefined, DUAS_LOJAS),
  },
  "envio-escolhendo": {
    titulo: "Arquivos escolhidos, dois recusados",
    grupo: "Envio",
    tela: envio({
      momento: "antes",
      fila: filaDeExemplo(ESCOLHIDOS_DE_EXEMPLO, () => "pronto"),
    }),
  },
  "envio-faltou-escolher": {
    titulo: "Faltou escolher antes ou depois",
    grupo: "Envio",
    tela: envio({
      fila: filaDeExemplo(ESCOLHIDOS_DE_EXEMPLO, () => "pronto"),
      erros: { momento: ERROS.momento },
    }),
  },
  "envio-enviando": {
    titulo: "Enviando",
    grupo: "Envio",
    tela: envio({
      momento: "antes",
      fila: filaDeExemplo(LEVA_DE_EXEMPLO, (i) =>
        i < 2 ? "enviado" : i === 2 ? { progresso: 0.64 } : "pronto",
      ),
    }),
  },
  "envio-com-falha": {
    titulo: "Um arquivo não foi",
    grupo: "Envio",
    tela: envio({
      momento: "antes",
      fila: filaDeExemplo(LEVA_DE_EXEMPLO, (i) =>
        i === LEVA_DE_EXEMPLO.length - 1 ? "falhou" : "enviado",
      ),
    }),
  },
  "envio-concluido": {
    titulo: "Envio concluído",
    grupo: "Envio",
    tela: envio({
      momento: "antes",
      fila: filaDeExemplo(LEVA_DE_EXEMPLO, () => "enviado"),
    }),
  },
  equipe: { titulo: "Equipe", grupo: "Equipe", tela: equipe() },
  "equipe-nao-ligada": {
    titulo: "Entrada ainda não ligada",
    grupo: "Equipe",
    tela: equipe({
      aviso: { tom: "atencao", texto: MENSAGENS.equipeNaoLigada },
    }),
  },
  "equipe-sem-acesso": {
    titulo: "Conta sem acesso",
    grupo: "Equipe",
    tela: equipe({ aviso: { tom: "erro", texto: MENSAGENS.equipeSemAcesso } }),
  },
  "equipe-fora-do-dominio": {
    titulo: "Conta de fora do domínio",
    grupo: "Equipe",
    tela: equipe({
      aviso: { tom: "erro", texto: MENSAGENS.equipeForaDoDominio },
    }),
  },
};

/** O item da prévia, ou nada. Ignora chaves herdadas, como "constructor". */
export function itemDaPrevia(chave: string): ItemDaPrevia | undefined {
  return Object.hasOwn(TELAS, chave) ? TELAS[chave] : undefined;
}
