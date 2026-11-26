"use client";

import { useActionState, useEffect, useRef } from "react";
import { ArrowRight } from "lucide-react";

import { pedirCodigo } from "@/app/entrar/acoes";
import { RegiaoDeAviso } from "@/components/ui/Aviso";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import type { RespostaDaEntrada } from "@/lib/entrada";

const VAZIO: RespostaDaEntrada = {};

/**
 * Passo 1 da entrada do associado: o CNPJ de uma das lojas. `estadoInicial`
 * mostra a tela num estado (erro, aviso), para a prévia.
 */
export function FormularioCnpj({
  estadoInicial = VAZIO,
}: {
  estadoInicial?: RespostaDaEntrada;
}) {
  const [estado, acao, enviando] = useActionState(pedirCodigo, estadoInicial);
  const campo = useRef<HTMLInputElement>(null);

  // Com erro, o foco volta ao campo, com o que foi digitado.
  useEffect(() => {
    if (estado.erro) campo.current?.focus();
  }, [estado]);

  return (
    <Card padding="lg" elevado>
      <form action={acao} noValidate>
        <h1 className="font-titulo text-pagina font-semibold tracking-tight text-gray-900">
          Entrar no portal
        </h1>
        <p className="text-corpo mt-2 text-gray-600">
          Digite o CNPJ de uma das suas lojas. Vamos mandar um código para o
          e-mail cadastrado.
        </p>

        <div className="mt-6">
          <Field
            id="cnpj"
            label="CNPJ da loja"
            dica="Com ou sem pontuação."
            erro={estado.erro}
          >
            {(controle) => (
              <Input
                {...controle}
                ref={campo}
                name="cnpj"
                defaultValue={estado.valor}
                // Teclado com letras: o CNPJ novo tem letras e números.
                autoCapitalize="characters"
                autoCorrect="off"
                spellCheck={false}
                autoComplete="off"
                enterKeyHint="send"
              />
            )}
          </Field>
        </div>

        <RegiaoDeAviso aviso={estado.aviso} className="mt-4" />

        <Button
          type="submit"
          size="lg"
          pending={enviando}
          iconeFinal={ArrowRight}
          className="mt-6 w-full"
        >
          {enviando ? "Enviando código…" : "Enviar código"}
        </Button>
      </form>
    </Card>
  );
}
