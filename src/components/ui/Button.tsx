import type { ComponentProps } from "react";
import clsx from "clsx";
import { LoaderCircle, type LucideIcon } from "lucide-react";

const variantes = {
  // A ação principal da área: teal da marca com texto quase preto (7,9:1).
  primary:
    "border-transparent bg-primary text-gray-950 hover:-translate-y-px hover:bg-primary-dark hover:shadow-flutuante",
  secondary:
    "border-gray-300 bg-white text-gray-900 hover:border-primary-strong hover:bg-primary-light",
  ghost:
    "border-transparent text-gray-700 hover:bg-gray-100 hover:text-gray-900",
  // Destrutivo discreto: numa linha com várias ações, apagar ou cancelar não
  // pode ser o botão que mais chama atenção.
  danger: "border-transparent text-red-700 hover:bg-red-50",
  // Só no diálogo de confirmação, onde a ação destrutiva é a principal.
  "danger-solid": "border-transparent bg-red-700 text-white hover:bg-red-800",
  // No tom dos painéis da marca, para a ação principal sobre fundo claro que
  // não é do associado (como a entrada da equipe).
  escuro:
    "border-transparent bg-petroleo-700 text-white hover:-translate-y-px hover:bg-petroleo-800 hover:shadow-flutuante",
};

// Todo botão tem pelo menos 44 px de altura, o alvo mínimo de toque.
const tamanhos = {
  sm: "min-h-11 px-4 text-apoio",
  md: "min-h-12 px-6 text-corpo",
  lg: "min-h-14 px-7 text-destaque",
};

type OpcoesDeEstilo = {
  variant?: keyof typeof variantes;
  size?: keyof typeof tamanhos;
  className?: string;
};

/** As classes do botão, para um link que precisa ter cara de botão. */
export function buttonStyles({
  variant = "primary",
  size = "md",
  className,
}: OpcoesDeEstilo = {}) {
  return clsx(
    "inline-flex items-center justify-center gap-2 rounded-full border font-semibold transition duration-150 active:translate-y-0 disabled:pointer-events-none disabled:opacity-50",
    variantes[variant],
    tamanhos[size],
    className,
  );
}

/**
 * Botão de ação, em pílula. `iconeFinal` desenha o ícone num círculo escuro no
 * fim do botão (para "seguir em frente"). Com `pending`, o botão fica
 * desabilitado, marca `aria-busy` e mostra o indicador de envio no lugar do
 * ícone; troque o texto pelo gerúndio ("Enviando código…").
 */
export function Button({
  variant,
  size,
  className,
  pending = false,
  iconeFinal: IconeFinal,
  disabled,
  children,
  type = "button",
  ...props
}: ComponentProps<"button"> &
  OpcoesDeEstilo & { pending?: boolean; iconeFinal?: LucideIcon }) {
  const comIcone = IconeFinal && !pending;

  return (
    <button
      {...props}
      type={type}
      disabled={disabled || pending}
      aria-busy={pending || undefined}
      className={buttonStyles({
        variant,
        size,
        className: clsx(comIcone && "pr-2", className),
      })}
    >
      {pending && (
        <LoaderCircle
          aria-hidden="true"
          className="size-4 animate-spin motion-reduce:animate-none"
        />
      )}
      {children}
      {comIcone && <IconeNoCirculo icone={IconeFinal} />}
    </button>
  );
}

/**
 * O círculo escuro com o ícone no fim do botão principal. Use num link com
 * cara de botão (`buttonStyles({ className: "pr-2" })`), como "Entrar no
 * portal".
 */
export function IconeNoCirculo({ icone: Icone }: { icone: LucideIcon }) {
  return (
    <span
      aria-hidden="true"
      className="text-primary ml-1 flex size-8 shrink-0 items-center justify-center rounded-full bg-gray-950"
    >
      <Icone aria-hidden="true" className="size-4" />
    </span>
  );
}
