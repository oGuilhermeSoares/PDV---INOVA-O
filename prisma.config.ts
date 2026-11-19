import "dotenv/config";
import { defineConfig } from "prisma/config";

// Prisma 7: a CLI (migrate, studio) lê a conexão daqui; o cliente usado pelo
// app recebe o driver adapter em src/lib/db.ts.
//
// Usa process.env, e não env() do Prisma, de propósito: o `prisma generate`
// roda no `npm install` (postinstall), antes de existir um .env, e não precisa
// do banco. env() lançaria erro ali. Sem a variável, o migrate falha avisando.
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env.DATABASE_URL,
  },
});
