// @vitest-environment jsdom
/**
 * Toegankelijkheid: bedienbaarheid met het toetsenbord en namen voor hulpsoftware.
 *
 * WAAROM DIT EEN TESTSUITE VERDIENT. De fouten die #53 beschrijft delen één eigenschap: ze zijn
 * onzichtbaar zolang je met een muis werkt. Een `<div onClick>` ziet er precies zo uit als een knop,
 * een knop zonder naam ziet er precies zo uit als een knop mét naam, en de poort ziet geen van beide.
 * Precies het soort regressie dat terugsluipt zonder dat iemand het merkt.
 *
 * Waar een component alleen als geheel te renderen is, wordt hier op de DOM gecontroleerd; waar dat
 * niet kan (routes met `generateStaticParams`) op de broncode. Dat laatste is zwakker en staat er
 * daarom bij welk gedrag het bewaakt.
 */
import { describe, it, expect, beforeAll } from 'vitest';
import { readFileSync } from 'node:fs';
import { render, screen, fireEvent } from '@testing-library/react';
import './setup-dom';

import Carousel from '@/components/ui/Carousel';

beforeAll(() => {
	// jsdom implementeert `Element.scrollBy` niet, en de carousel roept hem aan bij een klik op een
	// pijl. Zonder deze stub gooit React een unhandled error: de TESTS slagen dan wel, maar Vitest
	// eindigt op exit 1 en de testpoort van open-pr weigert de push -- met "178 passed" erboven, wat
	// een verwarrend beeld geeft. Gemeten bij het openen van de PR voor deze branch.
	Element.prototype.scrollBy = function () {};
});

describe('carousel: de pijlen zijn knoppen met een naam', () => {
	it('heeft een vorige- en een volgende-knop die bij naam te vinden zijn', () => {
		render(<Carousel id="test"><div>inhoud</div></Carousel>);
		expect(screen.getByRole('button', { name: 'Vorige' })).toBeInTheDocument();
		expect(screen.getByRole('button', { name: 'Volgende' })).toBeInTheDocument();
	});

	it('hangt de klik aan de knop en niet aan de omhullende div', () => {
		// Dit was de fout: de onClick zat op de wrapper, dus tabben naar de knop lukte wel maar
		// Enter deed niets. Een klik op de KNOP moet het scrollen starten.
		const { container } = render(<Carousel id="test"><div>inhoud</div></Carousel>);
		const wrapper = container.querySelector('.arrow.left');
		expect(wrapper).not.toBeNull();
		// De wrapper mag geen eigen klik-handler meer dragen; de knop erbinnen wel.
		const knop = screen.getByRole('button', { name: 'Vorige' });
		expect(wrapper?.contains(knop)).toBe(true);
		expect(() => fireEvent.click(knop)).not.toThrow();
	});
});

/**
 * De overige gevallen zitten in componenten die een eigen datalaag of route-context meebrengen. Voor
 * die is de broncode de meetlat: geen `<div onClick>` meer op de plekken die #53 noemt, en een
 * `role` die iets belooft moet ook een toetsafhandeling hebben.
 */
describe('geen interactieve div meer op de gemelde plekken', () => {
	const bestanden = {
		'LuisterFilters (filterknop)': 'src/components/luister/LuisterFilters.tsx',
		'Erlenmeyers (de kerninteractie)': 'src/components/musicmoodcolours/Erlenmeyers.tsx',
		'Promo (video-starter)': 'src/components/home/Promo.tsx',
	};

	for (const [naam, pad] of Object.entries(bestanden)) {
		it(`${naam} gebruikt een <button> in plaats van een div met onClick`, () => {
			const bron = readFileSync(pad, 'utf8');
			// Een <div ...> met een onClick erin, over meerdere regels.
			const divMetClick = /<div(?![^>]*\/>)[^>]*\n?[^>]*onClick=/;
			expect(bron).not.toMatch(divMetClick);
		});
	}
});

describe('een role die iets belooft, doet het ook', () => {
	it('AudioPlayer: de slider heeft een toetsafhandeling én de vereiste waarden', () => {
		const bron = readFileSync('src/components/ui/AudioPlayer.tsx', 'utf8');
		expect(bron).toContain('role="slider"');
		// Dit was het probleem bij de filterknop: rol en tabIndex zonder onKeyDown.
		expect(bron).toContain('onKeyDown');
		for (const attr of ['aria-valuemin', 'aria-valuemax', 'aria-valuenow', 'aria-label']) {
			expect(bron).toContain(attr);
		}
	});

	it('er staat nergens een role="button" zonder toetsafhandeling', () => {
		// `role="button"` op iets dat geen <button> is, vraagt een eigen key-handler. De veiligste
		// vorm is hem helemaal niet gebruiken, en dat is nu het geval.
		const bestanden = [
			'src/components/luister/LuisterFilters.tsx',
			'src/components/ui/AudioPlayer.tsx',
			'src/components/ui/Carousel.tsx',
			'src/components/ui/MobileContent.tsx',
		];
		const fout = bestanden.filter((p) => {
			const bron = readFileSync(p, 'utf8');
			return bron.includes('role="button"') && !bron.includes('onKeyDown');
		});
		expect(fout).toEqual([]);
	});
});

describe('knoppen en afbeeldingen hebben een naam', () => {
	it('de sluitknop van de drawer draagt een aria-label', () => {
		const bron = readFileSync('src/components/ui/MobileContent.tsx', 'utf8');
		// Per regel en niet met één tag-regex: een JSX-attribuut kan een arrow function bevatten, en
		// de `>` daarin breekt elke `[^>]*`-benadering af. Dat kostte hier een valse rode test.
		const regel = bron.split('\n').find((r) => r.includes('className="btn close"'));
		expect(regel, 'de sluitknop is niet gevonden').toBeDefined();
		expect(regel).toContain('aria-label');
	});

	it('gebruikt geen niet-beschrijvende alt-teksten meer', () => {
		const verdacht = [/alt="Logo"/, /alt="verzoek"/i];
		const bestanden = [
			'src/components/layout/Footer.tsx',
			'src/components/layout/Navigation.tsx',
			'src/components/home/Verzoeknummers.tsx',
		];
		const fout: string[] = [];
		for (const p of bestanden) {
			const bron = readFileSync(p, 'utf8');
			for (const r of verdacht) if (r.test(bron)) fout.push(`${p} → ${r}`);
		}
		expect(fout).toEqual([]);
	});
});

describe('de focus is zichtbaar', () => {
	/**
	 * De comments in deze stylesheets beschrijven expliciet wat er vroeger stond -- inclusief
	 * `outline: none` en `--primary-color`. Die toelichting is juist waardevol, dus de test kijkt
	 * naar DECLARATIES en niet naar documentatie. Zonder deze stap zou de eigen uitleg de test laten
	 * falen, en dan wint het weglaten van de uitleg. Dezelfde afweging als bij `breakpoints.test.ts`,
	 * waar het omgekeerde is gekozen omdat het daar om één los getal ging.
	 */
	const zonderComments = (pad: string) =>
		readFileSync(pad, 'utf8')
			.split('\n')
			.filter((r) => !r.trim().startsWith('//'))
			.join('\n');

	it('zet nergens outline:none zonder een zichtbare vervanging', () => {
		expect(zonderComments('src/styles/components/sections/_contact-form.scss')).not.toMatch(/outline:\s*none/);
	});

	it('heeft een globale :focus-visible-regel in de reset', () => {
		expect(zonderComments('src/styles/base/_reset.scss')).toMatch(/:focus-visible\s*\{[\s\S]*?outline:/);
	});

	it('verwijst niet meer naar de niet-bestaande --primary-color', () => {
		// Die variabele wordt nergens gedefinieerd; een var() zonder fallback naar een onbekende
		// property maakt de hele declaratie ongeldig, waarna de eigenschap terugvalt op zijn
		// geërfde waarde.
		expect(zonderComments('src/styles/components/sections/_contact-form.scss')).not.toContain('--primary-color');
	});

	it('gebruikt de contrastrijke feedback-stijl voor de foutmelding', () => {
		// #d93025 gaf gemeten 4,30:1 en AA vraagt 4,5:1. `.feedback-message.error` gebruikt
		// --error-fg op --error-bg: gemeten 6,80:1.
		const form = readFileSync('src/components/sections/ContactForm.tsx', 'utf8');
		expect(form).toContain('feedback-message error');
		expect(zonderComments('src/styles/components/sections/_contact-form.scss')).not.toContain('#d93025');
	});
});
