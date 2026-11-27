"use client";

import { useRouter } from "next/navigation";
import { RotateCw } from "lucide-react";

import { Button } from "@/components/ui/Button";

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
