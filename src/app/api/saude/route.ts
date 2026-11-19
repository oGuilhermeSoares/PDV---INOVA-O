import { db } from "@/lib/db";

// Para monitorar a hospedagem: responde se o portal e o banco estão de pé.
export const dynamic = "force-dynamic";

const LIMITE_MS = 3000;

async function bancoResponde(): Promise<boolean> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const limite = new Promise<false>((resolve) => {
    timer = setTimeout(() => resolve(false), LIMITE_MS);
  });

  try {
    // SELECT 1 funciona igual em Postgres e MySQL.
    const consulta = db.$queryRaw`SELECT 1`.then(() => true as const);
    return await Promise.race([consulta, limite]);
  } catch {
    return false;
  } finally {
    clearTimeout(timer);
  }
}

export async function GET(): Promise<Response> {
  if (await bancoResponde()) {
    return Response.json({ status: "ok", banco: "ok" });
  }
  return Response.json(
    { status: "erro", banco: "indisponível" },
    { status: 503 },
  );
}
