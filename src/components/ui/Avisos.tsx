"use client";

import { useEffect, useSyncExternalStore } from "react";
import clsx from "clsx";
import { X } from "lucide-react";

import { TONS_DO_AVISO, type TomDoAviso } from "./Aviso";

/**
 * Avisos flutuantes: a resposta curta a uma ação ("12 fotos enviadas",
 * "Associado avisado"). Qualquer componente cliente chama `avisar(...)`; a
 * região `<Avisos />`, montada uma vez no layout, mostra e anuncia.
 *
 * Erros de formulário não vêm para cá: ficam ao lado do campo, onde a pessoa
 * vai corrigir.
 */
type AvisoFlutuante = { id: number; texto: string; tom: TomDoAviso };

const DURACAO_MS = 6000;
const VAZIO: AvisoFlutuante[] = [];

let fila: AvisoFlutuante[] = VAZIO;
let proximoId = 1;
const ouvintes = new Set<() => void>();

function publicar(nova: AvisoFlutuante[]) {
  fila = nova;
  ouvintes.forEach((ouvinte) => ouvinte());
}

function assinar(ouvinte: () => void) {
  ouvintes.add(ouvinte);
  return () => {
    ouvintes.delete(ouvinte);
  };
}

export function avisar(texto: string, tom: TomDoAviso = "sucesso") {
  // No máximo três na tela; o mais antigo sai.
  publicar([...fila, { id: proximoId++, texto, tom }].slice(-3));
}

function dispensar(id: number) {
  publicar(fila.filter((aviso) => aviso.id !== id));
}

function Item({ aviso }: { aviso: AvisoFlutuante }) {
  const { caixa, Icone } = TONS_DO_AVISO[aviso.tom];

  // Os avisos de atenção e de erro ficam até a pessoa fechar: eles pedem uma
  // providência. Sucesso e info somem sozinhos.
  useEffect(() => {
    if (aviso.tom === "atencao" || aviso.tom === "erro") return;
    const timer = setTimeout(() => dispensar(aviso.id), DURACAO_MS);
    return () => clearTimeout(timer);
  }, [aviso.id, aviso.tom]);

  return (
    <li
      className={clsx(
        "text-corpo shadow-flutuante pointer-events-auto flex items-start gap-2.5 rounded-xl border py-2 pr-1 pl-4",
        caixa,
      )}
    >
      <Icone aria-hidden="true" className="mt-3 size-4 shrink-0" />
      <p className="min-w-0 flex-1 py-2 font-semibold wrap-break-word">
        {aviso.texto}
      </p>
      <button
        type="button"
        aria-label="Fechar aviso"
        onClick={() => dispensar(aviso.id)}
        className="flex size-11 shrink-0 items-center justify-center rounded-full hover:bg-gray-900/5"
      >
        <X aria-hidden="true" className="size-4" />
      </button>
    </li>
  );
}

export function Avisos() {
  const avisos = useSyncExternalStore(
    assinar,
    () => fila,
    () => VAZIO,
  );

  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-center p-4 sm:justify-end md:p-6"
    >
      <ul className="flex w-full max-w-sm flex-col gap-2">
        {avisos.map((aviso) => (
          <Item key={aviso.id} aviso={aviso} />
        ))}
      </ul>
    </div>
  );
}
