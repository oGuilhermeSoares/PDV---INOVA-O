"use client";

import { useState, type Ref } from "react";
import clsx from "clsx";

import { limparCodigo, TAMANHO_DO_CODIGO } from "@/lib/codigo";

/**
 * Campo do código de acesso: seis casas com algarismos grandes, como a senha
 * do balcão. Por trás há um campo só, transparente e por cima das casas.
 * Assim, colar funciona, o celular sugere o código que chegou
 * (`autocomplete="one-time-code"`) e o leitor de tela lê um campo comum.
 *
 * Encaixa no `Field`: recebe `id`, `aria-invalid` e `aria-describedby`.
 */
export function CampoCodigo({
  id,
  ref,
  name = "codigo",
  tamanho = TAMANHO_DO_CODIGO,
  defaultValue = "",
  autoFocus,
  disabled,
  "aria-invalid": invalido,
  "aria-describedby": descricao,
}: {
  id: string;
  /** Para levar o foco ao campo quando o código volta com erro. */
  ref?: Ref<HTMLInputElement>;
  name?: string;
  tamanho?: number;
  defaultValue?: string;
  autoFocus?: boolean;
  disabled?: boolean;
  "aria-invalid"?: boolean;
  "aria-describedby"?: string;
}) {
  const [valor, setValor] = useState(() => limparCodigo(defaultValue, tamanho));
  const [focado, setFocado] = useState(false);
  const casaDaVez = Math.min(valor.length, tamanho - 1);

  return (
    <div className="relative">
      <div
        aria-hidden="true"
        className="grid gap-1.5 sm:gap-2"
        style={{ gridTemplateColumns: `repeat(${tamanho}, minmax(0, 1fr))` }}
      >
        {Array.from({ length: tamanho }, (_, i) => (
          <span
            key={i}
            data-casa={i}
            className={clsx(
              "text-senha flex h-14 items-center justify-center rounded-xl border bg-white font-bold text-gray-900 tabular-nums transition-colors",
              invalido
                ? "border-red-700"
                : focado && i === casaDaVez
                  ? "border-primary-strong ring-primary/25 ring-3"
                  : "border-gray-500",
              disabled && "opacity-60",
            )}
          >
            {valor[i] ?? ""}
          </span>
        ))}
      </div>
      <input
        ref={ref}
        id={id}
        name={name}
        type="text"
        value={valor}
        onChange={(evento) =>
          setValor(limparCodigo(evento.target.value, tamanho))
        }
        // O maxLength cortaria o texto colado antes da limpeza ("123-456"
        // viraria "12345"). A colagem troca o valor pelo código limpo.
        onPaste={(evento) => {
          evento.preventDefault();
          setValor(limparCodigo(evento.clipboardData.getData("text"), tamanho));
        }}
        onFocus={() => setFocado(true)}
        onBlur={() => setFocado(false)}
        inputMode="numeric"
        autoComplete="one-time-code"
        pattern="[0-9]*"
        maxLength={tamanho}
        autoFocus={autoFocus}
        disabled={disabled}
        aria-invalid={invalido || undefined}
        aria-describedby={descricao}
        spellCheck={false}
        autoCorrect="off"
        className="text-corpo absolute inset-0 size-full rounded-xl bg-transparent text-transparent caret-transparent selection:bg-transparent disabled:cursor-not-allowed"
      />
    </div>
  );
}
