import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

const { queryRaw } = vi.hoisted(() => ({ queryRaw: vi.fn() }));

vi.mock("@/lib/db", () => ({ db: { $queryRaw: queryRaw } }));

import { GET } from "@/app/api/saude/route";

describe("GET /api/saude", () => {
  beforeEach(() => {
    queryRaw.mockReset();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test("responde 200 quando o banco responde", async () => {
    queryRaw.mockResolvedValue([{ "?column?": 1 }]);

    const resposta = await GET();

    expect(resposta.status).toBe(200);
    expect(await resposta.json()).toEqual({ status: "ok", banco: "ok" });
  });

  test("responde 503 quando o banco falha, sem expor o erro", async () => {
    queryRaw.mockRejectedValue(
      new Error("senha inválida para portal_pdv@10.0.0.5"),
    );

    const resposta = await GET();
    const corpo = await resposta.text();

    expect(resposta.status).toBe(503);
    expect(JSON.parse(corpo)).toEqual({
      status: "erro",
      banco: "indisponível",
    });
    expect(corpo).not.toContain("senha");
  });

  test("responde 503 quando o banco demora mais de 3 segundos", async () => {
    vi.useFakeTimers();
    queryRaw.mockReturnValue(new Promise(() => {}));

    const pendente = GET();
    await vi.advanceTimersByTimeAsync(3000);
    const resposta = await pendente;

    expect(resposta.status).toBe(503);
    expect(await resposta.json()).toEqual({
      status: "erro",
      banco: "indisponível",
    });
  });
});
