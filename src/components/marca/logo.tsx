import Image from "next/image";
import clsx from "clsx";

type LogoProps = {
  className?: string;
};

// Símbolo da Farmácias Associadas (a cruz laranja) com o nome ao lado.
export function Logo({ className }: LogoProps) {
  return (
    <span className={clsx("inline-flex items-center gap-3", className)}>
      <Image
        src="/logo-farmacias-associadas.png"
        alt="Farmácias Associadas"
        width={44}
        height={44}
        loading="eager"
        className="size-11 rounded-md bg-white p-1"
      />
      <span className="leading-tight">
        <span className="block text-sm font-semibold">
          Farmácias Associadas
        </span>
        <span className="block text-base font-bold">Portal PDV</span>
      </span>
    </span>
  );
}
