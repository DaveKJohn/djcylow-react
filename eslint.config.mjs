import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  // Node-land: deze bestanden draaien op Node en niet in de browser, dus CommonJS
  // is er het juiste module-systeem in plaats van een fout. De hulpscripts worden
  // met `node scripts/<naam>.js` gestart en de Netlify-function draait in de
  // Lambda-runtime; geen van beide gaat door de Next-bundler heen.
  {
    files: ["scripts/**/*.js", "netlify/functions/**/*.js"],
    rules: {
      "@typescript-eslint/no-require-imports": "off",
    },
  },
]);

export default eslintConfig;
