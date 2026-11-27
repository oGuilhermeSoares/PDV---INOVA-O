import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
    alias: {
      // `server-only` lança fora do servidor do Next. Nos testes vale o
      // módulo vazio que o próprio pacote usa no React Server.
      "server-only": fileURLToPath(
        new URL("./node_modules/server-only/empty.js", import.meta.url),
      ),
    },
  },
  test: {
    environment: "node",
    // .tsx: testes de componente, que conferem o HTML gerado no servidor.
    include: ["src/**/*.test.{ts,tsx}"],
  },
});
