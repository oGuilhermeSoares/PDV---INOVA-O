"use client";

import { useState } from "react";
import Image from "next/image";
import clsx from "clsx";
import { Plus } from "lucide-react";

const NOME = "Farmácias Associadas";

const TAMANHOS = { 36: "size-9", 64: "size-16" } as const;

/**
 * Só a marca da Farmácias Associadas (a cruz laranja). O nome do sistema,
 * "Portal PDV", é texto da tela, ao lado. Ponha sobre branco ou gray-50: no
 * painel escuro, ela vai numa placa branca. Nunca recolora nem redesenhe.
 *
 * `tamanho` é o tamanho na tela (36 px na barra, 64 px na entrada); um
 * `className` como `lg:size-16` muda o tamanho a partir de uma largura. A
 * imagem vem sempre em 64 px, nítida nos dois tamanhos.
 *
 * Se a imagem falhar, aparece a reserva: quadrado laranja com a cruz branca.
 */
export function Logo({
  tamanho = 36,
  className,
}: {
  tamanho?: keyof typeof TAMANHOS;
  className?: string;
}) {
  const [falhou, setFalhou] = useState(false);
  const classes = clsx("shrink-0", TAMANHOS[tamanho], className);

  if (falhou) {
    return (
      <span
        role="img"
        aria-label={NOME}
        className={clsx(
          "bg-accent inline-flex items-center justify-center rounded-xl text-white",
          classes,
        )}
      >
        <Plus aria-hidden="true" className="size-3/5" strokeWidth={3} />
      </span>
    );
  }

  return (
    <Image
      src="/logo-farmacias-associadas.png"
      alt={NOME}
      width={64}
      height={64}
      loading="eager"
      onError={() => setFalhou(true)}
      className={clsx("object-contain", classes)}
    />
  );
}
