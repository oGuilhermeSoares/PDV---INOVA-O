import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: { tsconfigPaths: true },
  test: {
    environment: "node",
    // .tsx: testes de componente, que conferem o HTML gerado no servidor.
    include: ["src/**/*.test.{ts,tsx}"],
  },
});
