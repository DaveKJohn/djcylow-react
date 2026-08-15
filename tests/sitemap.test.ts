/**
 * De sitemap en robots.txt -- twee pure functies waar niets op stond.
 *
 * WAAROM DIT DE MOEITE WAARD IS
 * -----------------------------
 * `sitemap()` bouwt zijn mix-URL's uit hetzelfde `permalink`-veld als de routing, met zijn eigen
 * kopie van de afleiding (`src/app/sitemap.ts:48-49`). Twee kopieën van dezelfde bewerking kunnen
 * uit elkaar lopen, en als dat gebeurt wijst de sitemap Google naar pagina's die niet bestaan --
 * of laat hij pagina's weg die er wel zijn. Geen van beide geeft een foutmelding: de build slaagt,
 * de site werkt, en alleen de indexering zakt weg.
 *
 * `sitemap.ts` filtert bovendien zelf op `!!mix.permalink && !mix.ignore`. Dat filter is stil: een
 * mix zonder permalink verdwijnt er geruisloos uit. De test hieronder telt daarom, want een aantal
 * is het enige dat zo'n stille daling zichtbaar maakt.
 *
 * DE KOPPELING MET DE ROUTE IS HET PUNT, NIET HET AANTAL
 * -----------------------------------------------------
 * De belangrijkste test is niet "er staan 84 URL's" maar "elke mix-URL in de sitemap komt overeen
 * met de slug die `mixSlug` uit dezelfde data afleidt". Dat is de eigenschap die kapot kan zonder
 * dat iemand het merkt, en die vandaag alleen klopt omdat beide kopieën toevallig gelijk zijn.
 */
import { describe, expect, it } from 'vitest';

import sitemap from '@/app/sitemap';
import robots from '@/app/robots';
import { liveMixes, mixSlug } from '@/data/mixes/all';

const BASE_URL = 'https://www.djcylow.com';

const alles = sitemap();
const mixUrls = alles.filter((e) => e.url.includes('/luister/mix/'));
const statischeUrls = alles.filter((e) => !e.url.includes('/luister/mix/'));

describe('sitemap: omvang', () => {
    it('bevat de zeven statische pagina\'s', () => {
        expect(statischeUrls).toHaveLength(7);
    });

    it('noemt elke statische route precies één keer', () => {
        const verwacht = [
            BASE_URL,
            `${BASE_URL}/luister`,
            `${BASE_URL}/musicmoodcolours`,
            `${BASE_URL}/diensten`,
            `${BASE_URL}/diensten/bedrijfsfeest-dj`,
            `${BASE_URL}/diensten/bruiloft-dj`,
            `${BASE_URL}/diensten/house-dj`,
        ];
        expect(statischeUrls.map((e) => e.url).sort()).toEqual([...verwacht].sort());
    });

    it('heeft een mix-URL voor elke live mix', () => {
        // Dit is de test die "de sitemap is stilletjes gehalveerd" vangt. Het getal komt uit de
        // data zelf en niet uit een constante, zodat een nieuwe mix hem niet laat falen -- wat wél
        // faalt is een mix die uit de sitemap verdwijnt terwijl hij live staat.
        expect(mixUrls).toHaveLength(liveMixes.length);
    });

    it('bevat geen dubbele URL\'s', () => {
        const urls = alles.map((e) => e.url);
        expect(urls.filter((u, i) => urls.indexOf(u) !== i)).toEqual([]);
    });
});

describe('sitemap: de slugs volgen dezelfde afleiding als de routing', () => {
    /**
     * `src/app/sitemap.ts` leidt de slug zelf af in plaats van `mixSlug` te gebruiken (issue #83
     * zet de overige gebruikers over; deze is er nog een). Zolang die tweede kopie er staat, is dit
     * de test die bewaakt dat ze niet uit elkaar lopen.
     */
    it('gebruikt voor elke live mix exact de slug van `mixSlug`', () => {
        const verwacht = liveMixes.map((mix) => `${BASE_URL}/luister/mix/${mixSlug(mix)}`).sort();
        expect(mixUrls.map((e) => e.url).sort()).toEqual(verwacht);
    });

    it('levert alleen url-veilige slugs op', () => {
        const fout = mixUrls.filter((e) => !/^[a-z0-9-]+$/.test(e.url.split('/luister/mix/')[1]));
        expect(fout.map((e) => e.url)).toEqual([]);
    });
});

describe('sitemap: velden', () => {
    it('geeft elke entry een geldige `lastModified`', () => {
        const fout = alles.filter((e) => !(e.lastModified instanceof Date) || Number.isNaN(e.lastModified.getTime()));
        expect(fout.map((e) => e.url)).toEqual([]);
    });

    it('houdt elke `priority` tussen 0 en 1', () => {
        const fout = alles.filter((e) => typeof e.priority !== 'number' || e.priority < 0 || e.priority > 1);
        expect(fout.map((e) => e.url)).toEqual([]);
    });

    it('laat elke URL op het canonieke domein staan, zonder dubbele slash', () => {
        const fout = alles.filter((e) => !e.url.startsWith(BASE_URL) || e.url.slice(8).includes('//'));
        expect(fout.map((e) => e.url)).toEqual([]);
    });

    it('geeft de homepage de hoogste prioriteit', () => {
        const home = alles.find((e) => e.url === BASE_URL);
        expect(home?.priority).toBe(1);
    });
});

describe('robots', () => {
    const r = robots();

    it('staat alle crawlers toe', () => {
        expect(r.rules).toEqual([{ userAgent: '*', allow: '/' }]);
    });

    it('wijst naar de sitemap op hetzelfde domein', () => {
        expect(r.sitemap).toBe(`${BASE_URL}/sitemap.xml`);
    });

    it('zet geen disallow die de hele site zou blokkeren', () => {
        // Een `disallow: '/'` die er per ongeluk in belandt haalt de site uit Google zonder dat
        // iets rood wordt. Deze test is er precies voor dat scenario.
        const regels = Array.isArray(r.rules) ? r.rules : [r.rules];
        const blokkerend = regels.filter((regel) => {
            const d = regel.disallow;
            return d === '/' || (Array.isArray(d) && d.includes('/'));
        });
        expect(blokkerend).toEqual([]);
    });
});
