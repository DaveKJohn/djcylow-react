/**
 * De breakpoints staan op twee plekken, en die kunnen niet naar één bron worden teruggebracht:
 * Sass kan geen TypeScript lezen en de static export kan geen SCSS aan de clientkant evalueren. Wat
 * wél kan is ze aan elkaar binden met een test, en dat is wat hier gebeurt.
 *
 * WAAROM DIT ERTOE DOET
 * ---------------------
 * `MobileContent.tsx` bouwt zijn `matchMedia`-query uit `BREAKPOINTS.SMALL`, terwijl alle styling
 * omschakelt op `$breakpoints: small` uit `_config.scss`. Lopen die twee uit de pas, dan klapt de
 * drawer open op een andere breedte dan waarop het uiterlijk verandert -- een storing die alleen
 * zichtbaar is in een smalle band rond de breakpoint, precies waar niemand test.
 *
 * Dat risico was niet theoretisch. `MobileContent.tsx` droeg tot 2026-08-15 het comment
 * "($breakpoints small: 811px)" terwijl beide bronnen 884 zeggen. Wie dat comment geloofde en de
 * constante "corrigeerde", brak de koppeling die het comment beweerde te bewaken. Een comment is
 * hier dus aantoonbaar te zwak; deze test is de vervanging.
 *
 * De SCSS wordt met een regex gelezen in plaats van gecompileerd. Dat is bewust: compileren zou de
 * hele stylesheet-keten meebrengen voor drie getallen, en de vorm van deze map is stabiel. Verandert
 * die vorm toch, dan faalt de eerste test hieronder met een leesbare melding in plaats van stil nul
 * paren te vinden -- want een test die niets vindt en daarom groen blijft, is het probleem dat deze
 * suite juist oplost.
 */
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

import { BREAKPOINTS } from '@/constants/design';

const CONFIG = 'src/styles/abstracts/_config.scss';

/** Leest `$breakpoints: ("large": 1774px, ...)` uit de SCSS-config. */
function leesScssBreakpoints(): Record<string, number> {
	const bron = readFileSync(CONFIG, 'utf8');
	const blok = bron.match(/\$breakpoints\s*:\s*\(([^)]*)\)/);
	if (!blok) throw new Error(`Geen $breakpoints-map gevonden in ${CONFIG}`);

	const gevonden: Record<string, number> = {};
	for (const regel of blok[1].split(',')) {
		const m = regel.match(/"([a-z]+)"\s*:\s*(\d+)px/i);
		if (m) gevonden[m[1].toLowerCase()] = Number(m[2]);
	}
	return gevonden;
}

const scss = leesScssBreakpoints();

describe('breakpoints: de SCSS-config is leesbaar', () => {
	it('vindt de drie benoemde breakpoints', () => {
		// Faalt luid als de vorm van de map verandert, in plaats van stil niets te vergelijken.
		expect(Object.keys(scss).sort()).toEqual(['large', 'medium', 'small']);
	});

	it('leest ze als getallen groter dan nul', () => {
		const fout = Object.entries(scss).filter(([, v]) => !Number.isFinite(v) || v <= 0);
		expect(fout).toEqual([]);
	});
});

describe('breakpoints: JS en SCSS lopen gelijk', () => {
	it.each([
		['large', 'LARGE'],
		['medium', 'MEDIUM'],
		['small', 'SMALL'],
	] as const)('%s komt overeen', (scssKey, tsKey) => {
		expect(scss[scssKey]).toBe(BREAKPOINTS[tsKey]);
	});

	it('kent in TypeScript precies dezelfde sleutels als in SCSS', () => {
		const tsKeys = Object.keys(BREAKPOINTS).map((k) => k.toLowerCase()).sort();
		expect(tsKeys).toEqual(Object.keys(scss).sort());
	});

	it('houdt de volgorde large > medium > small aan', () => {
		// Niet cosmetisch: `respond-to` gebruikt max-width, dus een omgekeerde volgorde zou
		// betekenen dat de mobiele regels op brede schermen gelden.
		expect(BREAKPOINTS.LARGE).toBeGreaterThan(BREAKPOINTS.MEDIUM);
		expect(BREAKPOINTS.MEDIUM).toBeGreaterThan(BREAKPOINTS.SMALL);
	});
});

describe('breakpoints: het comment in MobileContent klopt met de code', () => {
	/**
	 * De aanleiding voor deze hele suite was een comment dat een getal noemde dat nergens bestond.
	 * Deze test bewaakt dat er nooit meer een los pixelgetal in dat bestand sluipt dat de indruk
	 * wekt de breakpoint te zijn.
	 */
	it('noemt geen ander pixelgetal dan de breakpoints zelf', () => {
		const bron = readFileSync('src/components/ui/MobileContent.tsx', 'utf8');
		const geldig = new Set(Object.values(BREAKPOINTS).map(String));
		const getallen = [...bron.matchAll(/(\d{3,4})\s*px/gi)].map((m) => m[1]);
		const vreemd = getallen.filter((g) => !geldig.has(g));
		expect(vreemd).toEqual([]);
	});

	it('leidt de query af uit BREAKPOINTS in plaats van uit een letterlijk getal', () => {
		const bron = readFileSync('src/components/ui/MobileContent.tsx', 'utf8');
		expect(bron).toMatch(/max-width:\s*\$\{BREAKPOINTS\.SMALL\}px/);
	});
});
