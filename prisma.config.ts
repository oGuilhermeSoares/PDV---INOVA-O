import "dotenv/config";
import { defineConfig, env } from "prisma/config";

// Prisma 7: a CLI (migrate, studio) lê a conexão daqui; o cliente usado pelo
// app recebe o driver adapter em src/lib/db.ts.
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});
