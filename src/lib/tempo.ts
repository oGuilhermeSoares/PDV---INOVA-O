/**
 * Segundos que faltam, no formato "m:ss" ("0:45", "2:05").
 *
 * Arredonda para cima: com 0,2 s restantes ainda aparece "0:01", e o "0:00" só
 * surge quando o tempo acabou de verdade. Tempo negativo vira "0:00".
 */
export function formatarContagem(segundos: number): string {
  const total = Math.max(0, Math.ceil(segundos));
  const minutos = Math.floor(total / 60);
  const resto = total % 60;
  return `${minutos}:${String(resto).padStart(2, "0")}`;
}
