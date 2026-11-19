import { z } from "zod";

// Variável opcional: string vazia (`CHAVE=` no .env) conta como ausente.
function opcional<T extends z.ZodType>(schema: T) {
  return z.preprocess(
    (valor) =>
      typeof valor === "string" && valor.trim() === "" ? undefined : valor,
    schema.optional(),
  );
}

// Módulo puro, sem efeito colateral: testes e scripts importam o schema sem
// validar o ambiente do processo atual. A validação de verdade fica em env.ts.
//
// As opcionais passam a obrigatórias no card que começar a usá-las.
export const envSchema = z.object({
  DATABASE_URL: z.url("precisa ser uma URL de conexão do banco"),
  APP_URL: z.url("precisa ser a URL pública do portal"),
  NODE_ENV: z.enum(["development", "test", "production"]),

  // Login do setor (card #6)
  AUTH_SECRET: opcional(
    z.string().min(32, "precisa ter pelo menos 32 caracteres"),
  ),
  ADMIN_EMAIL: opcional(z.email("precisa ser um e-mail")),

  // App "Portal PDV" no Entra (cards #3, #4, #6, #9)
  ENTRA_TENANT_ID: opcional(z.string().trim().min(1)),
  ENTRA_CLIENT_ID: opcional(z.string().trim().min(1)),
  ENTRA_CLIENT_SECRET: opcional(z.string().trim().min(1)),

  // SharePoint do setor de PDV (card #4)
  SHAREPOINT_SITE_ID: opcional(z.string().trim().min(1)),
  SHAREPOINT_DRIVE_ID: opcional(z.string().trim().min(1)),
  SHAREPOINT_PASTA_LOJAS_ID: opcional(z.string().trim().min(1)),

  // Caixa do setor que envia os e-mails (card #9)
  EMAIL_REMETENTE: opcional(z.email("precisa ser um e-mail")),
});

export type Env = z.infer<typeof envSchema>;

export function formatarErrosEnv(issues: readonly z.core.$ZodIssue[]): string {
  const linhas = issues.map(
    (issue) => `  - ${issue.path.join(".") || "(raiz)"}: ${issue.message}`,
  );
  return `Configuração de ambiente inválida:\n${linhas.join("\n")}`;
}
