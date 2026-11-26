import type { ReactNode } from "react";
import Link from "next/link";

import { buttonStyles } from "@/components/ui/Button";

import { BarraDoPortal } from "./BarraDoPortal";
import { ChamadaFinal } from "./ChamadaFinal";
import { MolduraDeEntrada } from "./MolduraDeEntrada";
import { PerguntasFrequentes } from "./PerguntasFrequentes";
import { PreviaDaLoja } from "./PreviaDaLoja";
import { RodapeDoPortal } from "./RodapeDoPortal";
import { SecaoComoFunciona } from "./SecaoComoFunciona";
import { SecaoOQueTem } from "./SecaoOQueTem";

const ATALHOS = [
  { href: "#o-que-tem", rotulo: "O que tem no portal" },
  { href: "#como-funciona", rotulo: "Como funciona" },
  { href: "#perguntas", rotulo: "Perguntas" },
];

// Sobre o petróleo: o teal da marca passa como texto (5,56:1).
const estiloDoLink =
  "inline-flex min-h-11 items-center font-semibold text-primary underline decoration-primary/40 underline-offset-4 transition-colors hover:decoration-primary";

/**
 * Entrada do associado: a página de apresentação, no estilo do clinia. O
 * login (o cartão em `children`) fica no primeiro bloco; abaixo, a prévia da
 * tela da loja, o que tem no portal, como funciona, as perguntas e a chamada
 * final.
 */
export function TelaDoAssociado({ children }: { children: ReactNode }) {
  return (
    <>
      <BarraDoPortal
        atalhos={ATALHOS}
        acao={
          <a href="#entrar" className={buttonStyles({ size: "sm" })}>
            Entrar
          </a>
        }
      />
      <main>
        <MolduraDeEntrada
          altura="pagina"
          idDoCartao="entrar"
          titulo="Tudo da sua loja,"
          destaque="num lugar só."
          selos={[
            "Relatórios da assessoria",
            "Estudos de mercado",
            "Fotos de antes e depois",
          ]}
          rodape={
            <p>
              É da equipe de PDV?{" "}
              <Link href="/admin/entrar" className={estiloDoLink}>
                Entre com a conta Microsoft
              </Link>
            </p>
          }
        >
          {children}
        </MolduraDeEntrada>
        <PreviaDaLoja />
        <SecaoOQueTem />
        <SecaoComoFunciona />
        <PerguntasFrequentes />
        <ChamadaFinal />
      </main>
      <RodapeDoPortal />
    </>
  );
}

/** Entrada da equipe de PDV. A palavra "admin" fica só no endereço. */
export function TelaDaEquipe({ children }: { children: ReactNode }) {
  return (
    <>
      <BarraDoPortal />
      <main>
        <MolduraDeEntrada
          altura="tela"
          rotulo="Área da equipe de PDV"
          titulo="Publique o material e acompanhe"
          destaque="cada loja."
          selos={[
            "Associados e lojas",
            "Avisos de material novo",
            "Fotos enviadas pelos associados",
          ]}
          rodape={
            <p>
              É associado?{" "}
              <Link href="/entrar" className={estiloDoLink}>
                Entre com o CNPJ
              </Link>
            </p>
          }
        >
          {children}
        </MolduraDeEntrada>
      </main>
    </>
  );
}
