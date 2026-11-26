"use client";

import { useRouter } from "next/navigation";
import { RotateCw, Upload } from "lucide-react";

import { avisar } from "@/components/ui/Avisos";
import { Button } from "@/components/ui/Button";

/**
 * A ação principal da tela da loja. Por enquanto só avisa que o envio chega
 * na próxima etapa; o card #20 troca pela tela de envio.
 */
export function BotaoEnviar() {
  return (
    <Button
      onClick={() =>
        avisar(
          "O envio de fotos e vídeos pelo portal chega na próxima etapa.",
          "info",
        )
      }
      className="shrink-0 self-start md:self-auto"
    >
      <Upload aria-hidden="true" className="size-5" />
      Enviar fotos e vídeos
    </Button>
  );
}

/** Pede a página de novo ao servidor, quando o SharePoint não respondeu. */
export function BotaoTentarDeNovo() {
  const router = useRouter();
  return (
    <Button variant="secondary" onClick={() => router.refresh()}>
      <RotateCw aria-hidden="true" className="size-4" />
      Tentar de novo
    </Button>
  );
}
