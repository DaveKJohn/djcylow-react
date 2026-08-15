/**
 * Deze suite bewaakte tot 2026-08-15 vijf componenten die wél bestonden maar nergens gerenderd
 * werden — en één daarvan importeerde een stylesheet die nooit heeft bestaan, wat pas zou breken op
 * het moment dat iemand hem terugzette.
 *
 * **Die vijf zijn nu verwijderd**, samen met hun stylesheets en `src/content/referenties.ts`. Wat
 * hier overblijft is het deel dat nog iets bewaakt:
 *
 * 1. Dat er geen nieuwe slapers ontstaan: elke component in `src/components/home/` moet ook
 *    daadwerkelijk ergens gerenderd worden. Dat is de regel die de vijf destijds had gevangen.
 * 2. Dat `ReadMore` zijn scrolldoel niet weer hardcodeert.
 *
 * De referentie-tests zijn vervallen met het bestand dat ze bewaakten: er is geen contentlaag meer
 * waarin een plaatsvuller kan sluipen.
 */
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

/** Alle plekken die een home-component zouden kunnen gebruiken. */
function alleBronbestanden(map = 'src'): string[] {
	return readdirSync(map, { withFileTypes: true }).flatMap((e) => {
		const pad = `${map}/${e.name}`;
		if (e.isDirectory()) return alleBronbestanden(pad);
		return /\.(tsx?|jsx?)$/.test(e.name) ? [pad] : [];
	});
}

describe('geen nieuwe slapers in src/components/home', () => {
	const componenten = readdirSync('src/components/home')
		.filter((f) => f.endsWith('.tsx'))
		.map((f) => f.replace(/\.tsx$/, ''));

	it('vindt de componenten die er zijn', () => {
		// Faalt luid als de map leeg raakt of hernoemd wordt, in plaats van stil nul dingen te
		// controleren — dat is precies de fout die deze suite hoort te vangen.
		expect(componenten.length).toBeGreaterThan(0);
	});

	it.each(readdirSync('src/components/home').filter((f) => f.endsWith('.tsx')))(
		'%s wordt ergens gerenderd',
		(bestand) => {
			const naam = bestand.replace(/\.tsx$/, '');
			const gebruikers = alleBronbestanden()
				.filter((p) => p !== `src/components/home/${bestand}`)
				.filter((p) => {
					const bron = readFileSync(p, 'utf8');
					// Alleen een echt gebruik telt: `<Naam` of `<Naam/`. Een vermelding in een
					// comment of in een string haalt dit niet.
					return new RegExp(`<${naam}[\\s/>]`).test(bron);
				});

			expect(
				gebruikers,
				`${bestand} wordt nergens gerenderd. Vijf van zulke slapers zijn op 2026-08-15 opgeruimd; ` +
					`fouten erin blijven onzichtbaar omdat de bundler dode modules niet compileert. ` +
					`Zet hem in gebruik of verwijder hem.`,
			).not.toEqual([]);
		},
	);
});

describe('de opgeruimde bestanden zijn ook echt weg', () => {
	it.each([
		'src/components/home/Diensten.tsx',
		'src/components/home/MeetTheDJ.tsx',
		'src/components/home/Verzoeknummers.tsx',
		'src/components/home/Referenties.tsx',
		'src/components/home/GoogleReviews.tsx',
		'src/content/referenties.ts',
		'src/styles/components/home/meetTheDJ.scss',
		'src/styles/components/home/verzoeknummers.scss',
		'src/styles/components/home/referenties.scss',
	])('%s bestaat niet meer', (pad) => {
		expect(existsSync(pad)).toBe(false);
	});

	it('laat geen uitgecommentarieerde secties achter in page.tsx', () => {
		// Er stonden `{/* <Referenties /> */}` en `{/* <GoogleReviews /> */}`. Zulke regels lezen als
		// "staat klaar om aan te zetten", terwijl de component er niet meer is.
		const bron = readFileSync('src/app/page.tsx', 'utf8');
		expect(bron).not.toMatch(/\{\/\*\s*<[A-Z]\w*\s*\/>\s*\*\/\}/);
	});
});

describe('ReadMore: het scrolldoel is niet hardgecodeerd', () => {
	const bron = readFileSync('src/components/ui/ReadMore.tsx', 'utf8');

	it('gebruikt een prop in plaats van een vast id', () => {
		expect(bron).not.toMatch(/getElementById\(["']promo["']\)/);
		expect(bron).toContain('scrollDoelId');
	});

	it('houdt `promo` als standaard, want dat is het enige huidige gebruik', () => {
		expect(bron).toMatch(/scrollDoelId\s*=\s*["']promo["']/);
	});
});
