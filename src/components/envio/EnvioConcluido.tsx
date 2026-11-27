import { useEffect, useRef } from "react";
import Link from "next/link";
import { CircleCheck } from "lucide-react";

import type { OpcaoDeLoja } from "@/components/loja/SeletorDeLoja";
import { Button, buttonStyles } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import {
  SECAO_DO_MOMENTO,
  tituloDoConcluido,
  type Contagem,
  type Momento,
} from "@/lib/envio";
import { nomeDaLoja } from "@/lib/loja";

/**
 * O fim do envio: quanto foi, para onde, e os dois caminhos. O título recebe
 * o foco ao aparecer, para o leitor de tela anunciar o resultado.
 */
export function EnvioConcluido({
  contagem,
  momento,
  loja,
  aoEnviarMais,
}: {
  contagem: Contagem;
  momento: Momento;
  loja: OpcaoDeLoja;
  aoEnviarMais: () => void;
}) {
  const titulo = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    titulo.current?.focus();
  }, []);

  return (
    <Card padding="lg" className="flex flex-col items-start">
      <span className="bg-status-resolvido-bg text-status-resolvido flex size-12 items-center justify-center rounded-xl">
        <CircleCheck aria-hidden="true" className="size-6" />
      </span>
      <h2
        ref={titulo}
        tabIndex={-1}
        className="font-titulo text-secao mt-4 font-semibold tracking-tight text-gray-900"
      >
        {tituloDoConcluido(contagem)}
      </h2>
      <p className="text-corpo mt-2 max-w-[72ch] text-gray-700">
        Já estão em {SECAO_DO_MOMENTO[momento]}, na tela da loja. A equipe de
        PDV recebe um aviso.
      </p>
      <p className="text-apoio mt-1 text-gray-600">
        Loja: {nomeDaLoja(loja.nome)}
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link href={loja.href} className={buttonStyles()}>
          Ver na tela da loja
        </Link>
        <Button variant="secondary" onClick={aoEnviarMais}>
          Enviar mais fotos e vídeos
        </Button>
      </div>
    </Card>
  );
}
