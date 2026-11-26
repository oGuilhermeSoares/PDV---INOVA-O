import type { ReactNode } from "react";

import { EntradaDaEquipe } from "@/components/entrada/EntradaDaEquipe";
import { FormularioCnpj } from "@/components/entrada/FormularioCnpj";
import { FormularioCodigo } from "@/components/entrada/FormularioCodigo";
import { TelaDaEquipe, TelaDoAssociado } from "@/components/entrada/Telas";
import { TelaDaLoja } from "@/components/loja/TelaDaLoja";
import { MENSAGENS, type RespostaDaEntrada } from "@/lib/entrada";

import {
  FARMACIA_GERAL,
  JUMALTI,
  secoesDaFarmaciaGeral,
  secoesDaJumalti,
} from "./dados-de-exemplo";

const EMAIL = "jo***@gmail.com";

/** O seletor da prévia troca entre as duas telas do associado com duas lojas. */
const DUAS_LOJAS = [
  { ...JUMALTI, href: "/previa/loja-varias-lojas" },
  { ...FARMACIA_GERAL, href: "/previa/loja-farmacia-geral" },
];

type ItemDaPrevia = {
  titulo: string;
  grupo: "Associado" | "Loja" | "Equipe";
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
        lojas={[{ ...JUMALTI, href: "/previa/loja" }]}
        secoes={secoesDaJumalti()}
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
        erro
      />
    ),
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
