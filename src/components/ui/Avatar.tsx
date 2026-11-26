import clsx from "clsx";

/**
 * Iniciais de uma pessoa ou loja. O tom vem de uma chave estável (o e-mail),
 * então a mesma pessoa aparece sempre com a mesma cor em todas as telas.
 *
 * As classes precisam ser literais para o Tailwind detectá-las: por isso a
 * paleta é uma lista de strings completas, não montada por concatenação. Os
 * pares são os tokens `avatar-N`, conferidos no teste de contraste.
 */
const TONS = [
  "bg-avatar-1-bg text-avatar-1",
  "bg-avatar-2-bg text-avatar-2",
  "bg-avatar-3-bg text-avatar-3",
  "bg-avatar-4-bg text-avatar-4",
] as const;

const TAMANHOS = {
  sm: "size-8 text-apoio",
  md: "size-10 text-corpo",
} as const;

/** Primeira letra do primeiro e do último nome. */
export function iniciais(nome: string) {
  const partes = nome.trim().split(/\s+/).filter(Boolean);
  if (partes.length === 0) return "?";
  const primeira = partes[0][0];
  const ultima = partes.length > 1 ? partes[partes.length - 1][0] : "";
  return (primeira + ultima).toUpperCase();
}

/** Soma simples e estável: só precisa distribuir, não resistir a colisão. */
export function tomDoAvatar(chave: string) {
  let soma = 0;
  for (let i = 0; i < chave.length; i += 1) {
    soma = (soma + chave.charCodeAt(i)) % 9973;
  }
  return TONS[soma % TONS.length];
}

/** É decorativo (`aria-hidden`): o nome tem de estar escrito ao lado. */
export function Avatar({
  nome,
  chave,
  size = "md",
  className,
}: {
  nome: string;
  /** Identificador estável; sem ele o tom vem do próprio nome. */
  chave?: string;
  size?: keyof typeof TAMANHOS;
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={clsx(
        "inline-flex shrink-0 items-center justify-center rounded-full font-bold",
        TAMANHOS[size],
        tomDoAvatar(chave ?? nome),
        className,
      )}
    >
      {iniciais(nome)}
    </span>
  );
}
