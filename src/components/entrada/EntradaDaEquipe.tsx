"use client";

import { useActionState } from "react";
import Image from "next/image";

import { entrarComMicrosoft } from "@/app/admin/entrar/acoes";
import { RegiaoDeAviso } from "@/components/ui/Aviso";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import type { RespostaDaEntrada } from "@/lib/entrada";

const VAZIO: RespostaDaEntrada = {};

/** Entrada da equipe de PDV, com a conta Microsoft do domínio. */
export function EntradaDaEquipe({
  estadoInicial = VAZIO,
}: {
  estadoInicial?: RespostaDaEntrada;
}) {
  const [estado, acao, abrindo] = useActionState(
    entrarComMicrosoft,
    estadoInicial,
  );

  return (
    <Card padding="lg" elevado>
      <form action={acao} noValidate>
        <h1 className="font-titulo text-pagina font-semibold tracking-tight text-gray-900">
          Entrar como equipe
        </h1>
        <p className="text-corpo mt-2 wrap-break-word text-gray-600">
          Use a sua conta @farmaciasassociadas.com.br.
        </p>

        <RegiaoDeAviso aviso={estado.aviso} className="mt-6" />

        <Button
          type="submit"
          variant="escuro"
          size="lg"
          pending={abrindo}
          // No celular, texto de 16 px e menos margem, para caber numa linha a
          // partir de 360 px; abaixo disso, a quebra fica equilibrada.
          className="max-sm:text-corpo mt-6 w-full text-balance max-sm:px-5"
        >
          {!abrindo && (
            <Image src="/logo-microsoft.svg" alt="" width={20} height={20} />
          )}
          {/* O texto oficial do botão da Microsoft em português. */}
          {abrindo ? "Abrindo a Microsoft…" : "Entrar com a Microsoft"}
        </Button>
      </form>
    </Card>
  );
}
