import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import reactPlugin from "eslint-plugin-react";
import prettierConfig from "eslint-config-prettier";

/** @type {import("eslint").Linter.Config[]} */
export default [
  {
    ignores: [
      "**/node_modules/**",
      "**/dist/**",
      "**/.next/**",
      "**/*.js",
      "**/*.mjs",
      // vitest/next config files don't belong to a workspace tsconfig
      "**/vitest.config.ts",
      "**/next.config.ts",
      "**/tailwind.config.ts",
      "**/postcss.config.ts",
    ],
  },
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
      "react-hooks": reactHooksPlugin,
      react: reactPlugin,
    },
    rules: {
      ...tsPlugin.configs["strict-type-checked"].rules,
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-unsafe-assignment": "error",
      "@typescript-eslint/consistent-type-imports": [
        "error",
        { prefer: "type-imports" },
      ],
      // Allow _-prefixed unused arguments (Express error handler signature, etc.)
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      // void is valid as a generic type arg in RTK Query (e.g. QueryDefinition<void, ...>)
      "@typescript-eslint/no-invalid-void-type": [
        "error",
        { allowAsThisParameter: false, allowInGenericTypeArguments: true },
      ],
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      // Enforce data-layer-only HTTP access
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "cross-fetch",
              message: "Use RTK Query hooks or thunks for data fetching.",
            },
          ],
          patterns: [
            {
              group: ["axios", "axios/*"],
              message:
                "Import axios only in RTK Query baseQuery, not in components or hooks.",
            },
          ],
        },
      ],
    },
  },
  prettierConfig,
];
