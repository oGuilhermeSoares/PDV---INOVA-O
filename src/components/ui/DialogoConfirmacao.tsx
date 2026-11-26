"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";

/**
 * Confirmação de uma ação que não dá para desfazer. Substitui o `confirm()`
 * do navegador, cujos botões "OK" e "Cancelar" ficam ambíguos quando a própria
 * ação é cancelar alguma coisa.
 *
 * Usa `<dialog>` nativo: o navegador prende o foco dentro dele, fecha com Esc
 * e devolve o foco ao botão que abriu. Os botões vêm em `children`, com o
 * verbo da ação: primeiro o que mantém (recebe o foco ao abrir), depois o que
 * confirma.
 */
export function DialogoConfirmacao({
  aberto,
  aoFechar,
  titulo,
  descricao,
  children,
}: {
  aberto: boolean;
  aoFechar: () => void;
  titulo: string;
  descricao?: ReactNode;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const idTitulo = useId();
  const idDescricao = useId();

  useEffect(() => {
    const dialogo = ref.current;
    if (!dialogo) return;
    if (aberto && !dialogo.open) dialogo.showModal();
    if (!aberto && dialogo.open) dialogo.close();
  }, [aberto]);

  return (
    <dialog
      ref={ref}
      aria-labelledby={idTitulo}
      aria-describedby={descricao ? idDescricao : undefined}
      onClose={aoFechar}
      // Clique fora da caixa (no fundo escurecido) fecha sem confirmar. Pelo
      // teclado, o Esc faz o mesmo.
      onClick={(evento) => {
        if (evento.target === ref.current) aoFechar();
      }}
      className="shadow-flutuante m-auto w-[min(28rem,calc(100vw-2rem))] rounded-2xl border border-gray-200 bg-white p-0 text-left backdrop:bg-gray-900/50"
    >
      <div className="p-6">
        <h2 id={idTitulo} className="text-destaque font-semibold text-gray-900">
          {titulo}
        </h2>
        {descricao && (
          <p id={idDescricao} className="text-corpo mt-2 text-gray-600">
            {descricao}
          </p>
        )}
        <div className="mt-6 flex flex-wrap justify-end gap-2">{children}</div>
      </div>
    </dialog>
  );
}
