import "server-only";

import { PrismaPg } from "@prisma/adapter-pg";

import { PrismaClient } from "@/generated/prisma/client";
import { env } from "@/lib/env";

// Uma instância só, reaproveitada entre os hot reloads do `next dev`.
const globalParaPrisma = globalThis as unknown as { prisma?: PrismaClient };

function criarCliente() {
  const adapter = new PrismaPg({ connectionString: env.DATABASE_URL });
  return new PrismaClient({ adapter });
}

export const db = globalParaPrisma.prisma ?? criarCliente();

if (env.NODE_ENV !== "production") {
  globalParaPrisma.prisma = db;
}
