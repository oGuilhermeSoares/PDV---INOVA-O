// Content-Disposition com nome acentuado (RFC 6266 / RFC 5987): o `filename`
// é o plano B em ASCII e o `filename*` leva o nome real em UTF-8.

function fallbackAscii(nome: string): string {
  return nome
    .toWellFormed()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^\x20-\x7e]|["\\/]/g, "_");
}

function codificarRfc5987(nome: string): string {
  return encodeURIComponent(nome.toWellFormed()).replace(
    /['()*]/g,
    (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`,
  );
}

export function contentDisposition(nome: string): string {
  return `attachment; filename="${fallbackAscii(nome)}"; filename*=UTF-8''${codificarRfc5987(nome)}`;
}
