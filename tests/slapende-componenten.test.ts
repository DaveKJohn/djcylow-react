/**
 * De vijf componenten die wél bestaan maar nergens gerenderd worden.
 *
 * WAAROM DIT EEN TESTSUITE VERDIENT terwijl die componenten niets doen. Juist dáárom: de bundler
 * compileert dode modules niet, dus fouten erin blijven onzichtbaar tot iemand ze terugzet. Op dat
 * moment breekt de build — in een repo zonder staging, waar de build de laatste wacht is vóór live.
 * Een test die de dode code wél leest, verplaatst dat moment naar nu.
 *
 * Concreet stond er één zo'n bom: `Diensten.tsx` importeerde een stylesheet die nooit heeft bestaan.
 * Deze suite bewaakt dat elke import in die vijf bestanden ergens naar wijst.
 *
 * De componenten zelf zijn bewust NIET verwijderd. Ze staan uitgecommentarieerd in `page.tsx`, wat
 * "later misschien weer" betekent, en dat is een beslissing over het product en niet over de code.
 */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const SLAPERS = [
	'src/components/home/Diensten.tsx',
	'src/components/home/MeetTheDJ.tsx',
	'src/components/home/Verzoeknummers.tsx',
	'src/components/home/Referenties.tsx',
	'src/components/home/GoogleReviews.tsx',
];

/** Lost een importpad op naar een pad op schijf; `@/` wijst naar `src/`. */
function resolveerImport(vanuit: string, spec: string): string | null {
	if (spec.startsWith('@/')) return resolve('src', spec.slice(2));
	if (spec.startsWith('.')) return resolve(dirname(vanuit), spec);
	return null; // een package uit node_modules; die controleert de build zelf
}

/** Probeert de gangbare extensies, zoals de bundler dat ook doet. */
function bestaatModule(pad: string): boolean {
	const kandidaten = [pad, `${pad}.ts`, `${pad}.tsx`, `${pad}.js`, `${pad}.jsx`, `${pad}.scss`, `${pad}.json`];
	// Een SCSS-partial mag ook als `_naam.scss` op schijf staan.
	const map = dirname(pad);
	const naam = pad.slice(map.length + 1);
	kandidaten.push(join(map, `_${naam}`), join(map, `_${naam}.scss`));
	kandidaten.push(join(pad, 'index.ts'), join(pad, 'index.tsx'));
	return kandidaten.some((k) => existsSync(k));
}

describe('slapende componenten: elke import wijst ergens naartoe', () => {
	it.each(SLAPERS)('%s', (pad) => {
		expect(existsSync(pad), `${pad} bestaat niet meer -- pas deze lijst aan`).toBe(true);
		const bron = readFileSync(pad, 'utf8');

		const specs = [...bron.matchAll(/^\s*import\s+(?:[^'"]*?from\s+)?['"]([^'"]+)['"]/gm)].map((m) => m[1]);
		const kapot = specs
			.map((s) => ({ spec: s, doel: resolveerImport(pad, s) }))
			.filter((x) => x.doel !== null && !bestaatModule(x.doel!))
			.map((x) => x.spec);

		expect(kapot, `deze imports wijzen nergens naartoe en breken de build zodra ${pad} weer gerenderd wordt`).toEqual([]);
	});
});

describe('referenties: geen plaatsvullers in de contentlaag', () => {
	const bron = readFileSync('src/content/referenties.ts', 'utf8');
	/**
	 * Alleen de DATA, niet de toelichting erboven. Die noemt de oude plaatsvullers namelijk
	 * letterlijk, als waarschuwing voor wie ze ooit terug wil zetten — en dat is precies de uitleg
	 * die je wilt houden. Een test die op het hele bestand kijkt, dwingt af dat je die uitleg
	 * weglaat, en dan wint de test van het doel.
	 */
	const data = bron.slice(bron.indexOf('export const referentiesData'));

	it('bevat geen dummy-klantnamen meer', () => {
		// Deze stonden er letterlijk: vier verzonnen klanten op een boekingssite.
		for (const dummy of ['Klant Naam', 'Bedrijfsnaam', 'Nieuwe Partner', 'Tech Start-up']) {
			expect(data).not.toContain(dummy);
		}
	});

	it('bevat geen tags die bij een webbureau horen in plaats van bij een DJ', () => {
		for (const tag of ['Web Design', 'Development', 'Branding', 'SEO', 'Copywriting', 'React', 'Next.js']) {
			expect(data).not.toContain(tag);
		}
	});

	it('levert een lege lijst, zodat aanzetten geen neptestimonials publiceert', async () => {
		const mod = await import('@/content/referenties');
		expect(Array.isArray(mod.referentiesData)).toBe(true);
		expect(mod.referentiesData).toHaveLength(0);
	});
});

describe('ReadMore: het scrolldoel is niet meer hardgecodeerd', () => {
	const bron = readFileSync('src/components/ui/ReadMore.tsx', 'utf8');

	it('gebruikt een prop in plaats van een vast id', () => {
		// `MeetTheDJ` en `Verzoeknummers` gebruiken deze component ook; met een vast "promo" sprong
		// de pagina daar naar een heel andere sectie.
		expect(bron).not.toMatch(/getElementById\(["']promo["']\)/);
		expect(bron).toContain('scrollDoelId');
	});

	it('houdt `promo` als standaard, want dat is het enige huidige gebruik', () => {
		expect(bron).toMatch(/scrollDoelId\s*=\s*["']promo["']/);
	});
});
