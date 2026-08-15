/**
 * De JSON-LD op de mixdetailpagina wordt met `dangerouslySetInnerHTML` in een
 * `<script type="application/ld+json">` gezet. `JSON.stringify` escapet `</script>` niet, dus een
 * mix-titel of -beschrijving die die reeks bevat zou de script-tag daar sluiten en de rest van de
 * JSON als HTML laten lezen.
 *
 * WAAROM DIT GETEST WORDT TERWIJL DE DATA UIT DE REPO KOMT. `scripts/add-mix.js` laat de
 * `description`-velden door een taalmodel genereren en schrijft die rechtstreeks het datamodel in.
 * Modeluitvoer is geen handgeschreven code, en een beschrijving is precies het vrije tekstveld waar
 * zo'n reeks in kan belanden. De vertrouwensgrens is dus zwakker dan "het staat in onze eigen JSON"
 * suggereert.
 *
 * De escape-functie is hier bewust NAGEBOUWD in plaats van geïmporteerd: `page.tsx` exporteert hem
 * niet (het is een Next-route met `generateStaticParams`, geen module die je los kunt laden). Deze
 * suite bewaakt daarom twee dingen tegelijk — dat de bewerking doet wat hij moet doen, én dat de
 * broncode hem daadwerkelijk toepast. Zonder die tweede test zou een refactor die terugvalt op een
 * kale `JSON.stringify` hier ongemerkt langskomen.
 */
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const PAGE = 'src/app/luister/mix/[slug]/page.tsx';

/** Dezelfde bewerking als `jsonLdScript` in de pagina. */
const escape = (data: unknown) => JSON.stringify(data).replace(/</g, '\\u003c');

describe('json-ld: de escaping zelf', () => {
	it('laat een sluitende script-tag niet intact', () => {
		const out = escape({ name: 'Mix </script><img src=x onerror=alert(1)>' });
		expect(out).not.toContain('</script>');
		expect(out).not.toContain('<img');
	});

	it('escapet elke `<`, niet alleen die van een script-tag', () => {
		expect(escape({ a: '<' })).not.toContain('<');
		expect(escape({ a: 'a<b<c' })).not.toContain('<');
	});

	it('levert nog steeds geldige JSON op die exact hetzelfde object teruggeeft', () => {
		// Dit is de kern: `<` is binnen een JSON-string dezelfde tekst als `<`, dus de
		// betekenis voor Google verandert niet -- alleen de HTML-parser ziet geen tag meer.
		const origineel = { '@type': 'MusicPlaylist', name: 'X </script> Y', n: 3, ok: true };
		expect(JSON.parse(escape(origineel))).toEqual(origineel);
	});

	it('laat gewone inhoud ongemoeid', () => {
		const gewoon = { name: 'Red Tech House Mix Vol. 3', numTracks: 22 };
		expect(escape(gewoon)).toBe(JSON.stringify(gewoon));
	});
});

describe('json-ld: de pagina past de escaping ook echt toe', () => {
	const bron = readFileSync(PAGE, 'utf8');

	it('zet geen kale JSON.stringify in een dangerouslySetInnerHTML', () => {
		// Vangt de vorm die hier tot 2026-08-15 stond:
		//   dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
		const kaal = /dangerouslySetInnerHTML=\{\{\s*__html:\s*JSON\.stringify/;
		expect(bron).not.toMatch(kaal);
	});

	it('voert elke ld+json-injectie via `jsonLdScript`', () => {
		const injecties = [...bron.matchAll(/dangerouslySetInnerHTML=\{([^}]*)\}/g)].map((m) => m[1]);
		expect(injecties.length).toBeGreaterThan(0);
		const fout = injecties.filter((i) => !i.includes('jsonLdScript'));
		expect(fout).toEqual([]);
	});

	it('houdt de escape-stap in die functie', () => {
		expect(bron).toMatch(/function jsonLdScript[\s\S]*?replace\(\/<\/g, '\\\\u003c'\)/);
	});
});
