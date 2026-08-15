import { describe, it, expect, beforeAll } from 'vitest';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

/**
 * WAAROM DEZE TEST BESTAAT.
 *
 * `src/styles/base/_reset.scss` zet `body { overflow-x: hidden; overflow-y: auto; }`. Issue #79
 * stelde dat dat `position: sticky` breekt bij afstammelingen -- en `#luister_content_filter` IS
 * sticky. Dat klopt als `body` daardoor een scroll-container wordt, maar dat wordt hij hier niet.
 *
 * De reden is de overflow-propagatieregel uit css-overflow-3: staat de gebruikte overflow van het
 * ROOT-element (`html`) op `visible`, dan wordt de overflow van `body` naar de VIEWPORT gepropageerd
 * en is de gebruikte waarde op `body` zelf weer `visible`. `body` is dan geen scroll-container, en
 * sticky werkt gewoon. Dat is ook de reden dat `body { overflow: hidden }` de páginascroll uitzet in
 * plaats van alleen die van de body.
 *
 * Dus hangt het geheel op één voorwaarde: `html` mag geen eigen overflow krijgen. Zodra iemand
 * `html { overflow-x: hidden }` toevoegt -- de meest voor de hand liggende "reparatie" van
 * horizontale overflow die er is -- stopt de propagatie, wordt `body` alsnog een scroll-container,
 * en breekt de sticky filter. Zonder foutmelding, en alleen zichtbaar door op de luisterpagina te
 * scrollen.
 *
 * Die voorwaarde stond nergens vastgelegd. Nu wel: deze test leest de GEBOUWDE CSS, want alleen daar
 * staat wat de browser werkelijk krijgt.
 *
 * De test slaat zichzelf over als er geen build staat -- hij hoort de suite niet te blokkeren voor
 * wie alleen `npm test` draait. In de poort en in CI draait `npm run build` er wel aan vooraf.
 */

const OUT = join(process.cwd(), 'out');

function verzamelCss(): string {
    const gevonden: string[] = [];
    const loop = (map: string) => {
        for (const item of readdirSync(map, { withFileTypes: true })) {
            const pad = join(map, item.name);
            if (item.isDirectory()) loop(pad);
            else if (item.name.endsWith('.css')) gevonden.push(readFileSync(pad, 'utf8'));
        }
    };
    loop(OUT);
    return gevonden.join('\n');
}

describe('overflow-propagatie', () => {
    let css = '';
    let erIsEenBuild = false;

    beforeAll(() => {
        erIsEenBuild = existsSync(OUT);
        if (erIsEenBuild) css = verzamelCss();
    });

    it('het root-element krijgt geen eigen overflow -- anders breekt de sticky filter', () => {
        if (!erIsEenBuild) return;

        // Elke regelset waarvan de selector `html` als element noemt. `.html-iets` telt niet mee,
        // vandaar de grens erachter.
        const regels = css.match(/(^|[},])\s*(html\b[^{,]*(?:,[^{]*)?)\{([^}]*)\}/g) ?? [];
        const metOverflow = regels.filter((r) => /overflow[-a-z]*\s*:/.test(r));

        expect(
            metOverflow,
            `Er staat een overflow op het root-element:\n${metOverflow.join('\n')}\n\n` +
                'Daarmee stopt de viewport-propagatie van body\'s overflow en wordt body een ' +
                'scroll-container. Gevolg: `position: sticky` op #luister_content_filter werkt niet ' +
                'meer. Los horizontale overflow op bij het element dat te breed is, niet hier.'
        ).toEqual([]);
    });

    it('body draagt de overflow-declaratie nog, want daar leunt de paginascroll op', () => {
        if (!erIsEenBuild) return;

        const bodyRegels = (css.match(/(^|[},])\s*body\b[^{,]*\{[^}]*\}/g) ?? []).join('\n');
        expect(bodyRegels).toMatch(/overflow/);
    });

    it('de luisterfilter is nog sticky -- dat is wat de eerste test beschermt', () => {
        if (!erIsEenBuild) return;

        const filter = css.match(/#luister_content_filter\{[^}]*\}/g) ?? [];
        expect(filter.some((r) => /position:\s*sticky/.test(r))).toBe(true);
    });
});
