"use client";

import { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";

import { conferirCodigo } from "@/app/entrar/acoes";
import { RegiaoDeAviso } from "@/components/ui/Aviso";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Field } from "@/components/ui/Field";
import { VoltarLink } from "@/components/ui/VoltarLink";
import type { RespostaDaEntrada } from "@/lib/entrada";

import { CampoCodigo } from "./CampoCodigo";
import { ReenvioDeCodigo } from "./ReenvioDeCodigo";

const VAZIO: RespostaDaEntrada = {};

/**
 * Passo 2 da entrada do associado: o código que chegou no e-mail. O e-mail
 * chega mascarado do servidor (`jo***@gmail.com`); o inteiro nunca vem para o
 * navegador. A rota deste passo nasce no card #10; por enquanto, ele aparece
 * na prévia.
 */
export function FormularioCodigo({
  emailMascarado,
  segundosParaReenviar = 45,
  estadoInicial = VAZIO,
}: {
  emailMascarado: string;
  segundosParaReenviar?: number;
  estadoInicial?: RespostaDaEntrada;
}) {
  const [estado, acao] = useActionState(conferirCodigo, estadoInicial);
  const campo = useRef<HTMLInputElement>(null);

  // Com erro, o foco volta ao campo do código.
  useEffect(() => {
    if (estado.erro) campo.current?.focus();
  }, [estado]);

  return (
    <Card padding="lg" elevado>
      <VoltarLink href="/entrar">Trocar CNPJ</VoltarLink>

      <form action={acao} noValidate className="mt-2">
        <h1 className="font-titulo text-pagina font-semibold tracking-tight text-gray-900">
          Digite o código
        </h1>
        <p className="text-corpo mt-2 text-gray-600">
          Mandamos um código de 6 números para{" "}
          <span className="font-semibold wrap-break-word text-gray-900">
            {emailMascarado}
          </span>
          . Ele vale por 10 minutos.
        </p>

        <div className="mt-6">
          <Field id="codigo" label="Código de acesso" erro={estado.erro}>
            {(controle) => <CampoCodigo {...controle} ref={campo} autoFocus />}
          </Field>
        </div>

        <RegiaoDeAviso aviso={estado.aviso} className="mt-4" />

        <BotaoEntrar />
        <div className="mt-4">
          <ReenvioDeCodigo
            segundos={segundosParaReenviar}
            acao={<BotaoReenviar />}
          />
        </div>
      </form>
    </Card>
  );
}

// Os dois botões enviam o mesmo formulário. O useFormStatus diz qual deles foi
// apertado, para só ele mostrar o gerúndio.
function useEnvio() {
  const { pending, data } = useFormStatus();
  const reenviando = pending && data?.get("intencao") === "reenviar";
  return { enviando: pending, entrando: pending && !reenviando, reenviando };
}

function BotaoEntrar() {
  const { enviando, entrando } = useEnvio();
  return (
    <Button
      type="submit"
      size="lg"
      pending={entrando}
      disabled={enviando}
      className="mt-6 w-full"
    >
      {entrando ? "Entrando…" : "Entrar"}
    </Button>
  );
}

function BotaoReenviar() {
  const { enviando, reenviando } = useEnvio();
  return (
    <Button
      type="submit"
      name="intencao"
      value="reenviar"
      variant="ghost"
      pending={reenviando}
      disabled={enviando}
    >
      {reenviando ? "Reenviando código…" : "Reenviar código"}
    </Button>
  );
}
