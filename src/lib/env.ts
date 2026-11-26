import { envSchema, formatarErrosEnv, type Env } from "@/lib/env-schema";

// O portal se recusa a subir com variável ausente ou inválida, dizendo quais
// são. Todo ponto de entrada do servidor (db, auth, Graph) importa este módulo,
// então a validação roda na subida, e não no meio de uma requisição.
function carregarEnv(): Env {
  const resultado = envSchema.safeParse(process.env);
  if (!resultado.success) {
    throw new Error(formatarErrosEnv(resultado.error.issues));
  }
  return resultado.data;
}

export const env: Env = carregarEnv();
export type { Env };
