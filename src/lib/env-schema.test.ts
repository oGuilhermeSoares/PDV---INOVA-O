import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, test } from "vitest";

import { envSchema, formatarErrosEnv } from "@/lib/env-schema";

const minimo = {
  DATABASE_URL: "postgresql://portal_pdv:portal_pdv@localhost:5432/portal_pdv",
  APP_URL: "http://localhost:3000",
  NODE_ENV: "development",
};

describe("envSchema", () => {
  test("aceita o mínimo obrigatório", () => {
    expect(envSchema.safeParse(minimo).success).toBe(true);
  });

  test("recusa DATABASE_URL ausente e informa o nome", () => {
    const semBanco: Partial<typeof minimo> = { ...minimo };
    delete semBanco.DATABASE_URL;
    const resultado = envSchema.safeParse(semBanco);

    expect(resultado.success).toBe(false);
    if (!resultado.success) {
      expect(formatarErrosEnv(resultado.error.issues)).toContain(
        "DATABASE_URL",
      );
    }
  });

  test("recusa DATABASE_URL vazia", () => {
    const resultado = envSchema.safeParse({ ...minimo, DATABASE_URL: "" });

    expect(resultado.success).toBe(false);
  });

  test("trata opcional vazia como ausente", () => {
    const resultado = envSchema.safeParse({ ...minimo, ENTRA_CLIENT_ID: "" });

    expect(resultado.success).toBe(true);
    if (resultado.success) {
      expect(resultado.data.ENTRA_CLIENT_ID).toBeUndefined();
    }
  });

  test("recusa AUTH_SECRET curto", () => {
    const resultado = envSchema.safeParse({ ...minimo, AUTH_SECRET: "curto" });

    expect(resultado.success).toBe(false);
  });

  test(".env.example tem exatamente as chaves do schema", () => {
    const exemplo = readFileSync(join(process.cwd(), ".env.example"), "utf8");
    const chavesExemplo = exemplo
      .split(/\r?\n/)
      .map((linha) => linha.match(/^([A-Z][A-Z0-9_]*)=/)?.[1])
      .filter((chave): chave is string => Boolean(chave))
      .sort();

    expect(chavesExemplo).toEqual(Object.keys(envSchema.shape).sort());
  });
});
