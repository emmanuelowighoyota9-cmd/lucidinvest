// Flat ESLint config for Next.js 16 (App Router, TypeScript).
// eslint-config-next 16 ships a flat config array, so it is spread directly.
import next from "eslint-config-next";
import tseslint from "typescript-eslint";

const eslintConfig = [
  ...next,
  {
    files: ["**/*.ts", "**/*.tsx"],
    plugins: { "@typescript-eslint": tseslint.plugin },
    rules: {
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
];

export default eslintConfig;
