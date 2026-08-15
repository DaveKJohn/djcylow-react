import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';

/**
 * Vitest-configuratie. Tot 2026-08-14 stond die er niet: de enige suite (tests/mix-data.test.ts)
 * leest JSON en had aan de defaults genoeg. Componenttests hebben wel iets nodig -- een DOM en de
 * `@/`-alias -- en dat staat hier.
 *
 * DE OMGEVING IS PER BESTAND EN NIET GLOBAAL. De default blijft `node`, want mix-data.test.ts heeft
 * geen DOM nodig en draait in ~15 ms; die in jsdom zetten kost tijd zonder iets te bewijzen. De
 * componenttests vragen hun omgeving zelf aan met de regel `// @vitest-environment jsdom` bovenaan
 * het bestand. Zo betaalt alleen wie een DOM nodig heeft ervoor.
 */
export default defineConfig({
    test: {
        environment: 'node',
    },
    resolve: {
        alias: {
            // Dezelfde alias als in tsconfig.json ("@/*" -> "./src/*"). Zonder deze regel vindt
            // Vitest de imports in de componenten niet, want die resolver leest de tsconfig niet.
            '@': fileURLToPath(new URL('./src', import.meta.url)),
        },
    },
});
