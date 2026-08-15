import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { SITE_URL } from '../src/constants/site';

/**
 * WAAROM DEZE TEST BESTAAT.
 *
 * De site staat op het kale domein: de www-variant geeft `301 Moved Permanently` naar het kale
 * domein, dat zelf 200 antwoordt. Toch stond de www-variant tot 2026-08-15 hard in elf bestanden,
 * waardoor de `canonical`, de `og:url`, de JSON-LD en alle 84 URL's in `sitemap.xml` naar het
 * domein wezen dat wegredirect -- een canonical die zelf geen 200 geeft.
 *
 * Dat is nu één constante (`src/constants/site.ts`). Deze test controleert het RESULTAAT en niet de
 * constante, want een `SITE_URL` die klopt zegt niets zolang iemand er ergens weer een letterlijke
 * URL naast kan zetten. Hij leest daarom de gebouwde export.
 *
 * Slaat zichzelf over zonder build, net als `overflow-propagatie.test.ts` -- in de poort en in CI
 * gaat `npm run build` eraan vooraf.
 */

const OUT = join(process.cwd(), 'out');

function bestanden(exts: string[]): string[] {
    const uit: string[] = [];
    const loop = (map: string) => {
        for (const item of readdirSync(map, { withFileTypes: true })) {
            const pad = join(map, item.name);
            if (item.isDirectory()) loop(pad);
            else if (exts.some((e) => item.name.endsWith(e))) uit.push(pad);
        }
    };
    loop(OUT);
    return uit;
}

describe('canonieke URLs in de gebouwde export', () => {
    it('nergens in de export staat een absolute URL naar het www-domein', () => {
        if (!existsSync(OUT)) return;

        const kaal = SITE_URL.replace(/^https?:\/\//, '');
        const raak: string[] = [];
        for (const f of bestanden(['.html', '.xml', '.txt', '.json'])) {
            const inhoud = readFileSync(f, 'utf8');
            if (inhoud.includes(`www.${kaal}`)) raak.push(f.replace(OUT, ''));
        }

        expect(
            raak.slice(0, 10),
            `Deze bestanden noemen www.${kaal}, dat 301 redirect naar ${SITE_URL}:\n` +
                `${raak.join('\n')}\n\nGebruik SITE_URL uit src/constants/site.ts.`
        ).toEqual([]);
    });

    it('elke canonical wijst naar de basis-URL', () => {
        if (!existsSync(OUT)) return;

        const fout: string[] = [];
        let gezien = 0;
        for (const f of bestanden(['.html'])) {
            const m = readFileSync(f, 'utf8').match(/<link rel="canonical" href="([^"]+)"/);
            if (!m) continue;
            gezien++;
            if (!m[1].startsWith(SITE_URL)) fout.push(`${f.replace(OUT, '')} -> ${m[1]}`);
        }

        expect(gezien).toBeGreaterThan(50); // er zijn 86 pagina's; als dit kelddert, klopt de selector niet
        expect(fout).toEqual([]);
    });

    it('de sitemap noemt alleen URLs op de basis-URL', () => {
        if (!existsSync(OUT)) return;
        const pad = join(OUT, 'sitemap.xml');
        if (!existsSync(pad)) return;

        const locs = [...readFileSync(pad, 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
        expect(locs.length).toBeGreaterThan(50);
        expect(locs.filter((u) => !u.startsWith(SITE_URL))).toEqual([]);
    });
});
