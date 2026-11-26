import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Cliente Prisma gerado por `prisma generate` — nunca é lintado.
    "src/generated/**",
    ".superpowers/**",
    // Skills e plugins do Claude Code instalados no projeto: ferramenta, não
    // código do portal.
    ".claude/**",
  ]),
  {
    rules: {
      // Elementos clicáveis vêm de componentes acessíveis (button, a),
      // nunca de div/span com onClick.
      "no-restricted-syntax": [
        "error",
        {
          selector:
            "JSXOpeningElement[name.name=/^(div|span)$/] JSXAttribute[name.name='onClick']",
          message:
            "Não use div/span com onClick — use um elemento interativo acessível (button, a).",
        },
      ],
    },
  },
]);

export default eslintConfig;
