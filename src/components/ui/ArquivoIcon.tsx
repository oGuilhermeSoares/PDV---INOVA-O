import {
  File,
  FileImage,
  FilePlay,
  FileSpreadsheet,
  FileText,
  type LucideIcon,
  type LucideProps,
} from "lucide-react";

export type TipoDeArquivo = "pdf" | "planilha" | "imagem" | "video" | "outro";

const EXTENSOES: Record<Exclude<TipoDeArquivo, "outro">, string[]> = {
  pdf: ["pdf"],
  planilha: ["xlsx", "xls", "csv", "ods"],
  imagem: ["jpg", "jpeg", "png", "heic", "heif", "webp", "gif"],
  video: ["mp4", "mov", "m4v", "webm", "avi", "3gp"],
};

/** O tipo pela extensão do nome, sem diferenciar maiúsculas. */
export function tipoDoArquivo(nome: string): TipoDeArquivo {
  const ponto = nome.lastIndexOf(".");
  if (ponto < 0) return "outro";
  const extensao = nome.slice(ponto + 1).toLowerCase();
  for (const [tipo, lista] of Object.entries(EXTENSOES)) {
    if (lista.includes(extensao)) return tipo as TipoDeArquivo;
  }
  return "outro";
}

/** Como o tipo aparece escrito ao lado do ícone. */
export const ROTULO_DO_TIPO: Record<TipoDeArquivo, string> = {
  pdf: "PDF",
  planilha: "Planilha",
  imagem: "Foto",
  video: "Vídeo",
  outro: "Arquivo",
};

const ICONES: Record<TipoDeArquivo, LucideIcon> = {
  pdf: FileText,
  planilha: FileSpreadsheet,
  imagem: FileImage,
  video: FilePlay,
  outro: File,
};

/**
 * Ícone do tipo de arquivo (relatório, estudo, foto, vídeo). É decorativo:
 * escreva o tipo ou o nome do arquivo ao lado. 16 px em linha, 20 px em
 * destaque.
 */
export function ArquivoIcon({
  tipo,
  ...props
}: LucideProps & { tipo: TipoDeArquivo }) {
  const Icone = ICONES[tipo];
  return <Icone aria-hidden="true" {...props} />;
}
