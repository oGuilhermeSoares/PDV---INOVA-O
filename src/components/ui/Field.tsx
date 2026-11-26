import type { ReactNode } from "react";

export type ControleDoCampo = {
  id: string;
  "aria-invalid": true | undefined;
  "aria-describedby": string | undefined;
};

/**
 * Rótulo, controle, dica e erro de um campo de formulário, já ligados entre
 * si. O controle vem como função para receber `id`, `aria-invalid` e
 * `aria-describedby`.
 *
 * O erro tem `role="alert"`: quando chega depois do envio, o leitor de tela o
 * anuncia sem a pessoa precisar procurar.
 */
export function Field({
  id,
  label,
  obrigatorio = false,
  opcional = false,
  dica,
  erro,
  children,
}: {
  id: string;
  label: ReactNode;
  obrigatorio?: boolean;
  opcional?: boolean;
  dica?: ReactNode;
  erro?: string | null;
  children: (controle: ControleDoCampo) => ReactNode;
}) {
  const idDica = dica ? `${id}-dica` : undefined;
  const idErro = erro ? `${id}-erro` : undefined;
  const descricao = [idDica, idErro].filter(Boolean).join(" ") || undefined;

  return (
    <div>
      <label
        htmlFor={id}
        className="text-corpo mb-1.5 block font-semibold text-gray-900"
      >
        {label}
        {obrigatorio && (
          <span className="font-normal text-gray-600"> (obrigatório)</span>
        )}
        {opcional && (
          <span className="font-normal text-gray-600"> (opcional)</span>
        )}
      </label>
      {children({
        id,
        "aria-invalid": erro ? true : undefined,
        "aria-describedby": descricao,
      })}
      {dica && (
        <p id={idDica} className="text-apoio mt-1.5 text-gray-600">
          {dica}
        </p>
      )}
      {erro && (
        <p
          id={idErro}
          role="alert"
          className="text-apoio mt-1.5 font-semibold text-red-700"
        >
          {erro}
        </p>
      )}
    </div>
  );
}
