// @vitest-environment jsdom
/**
 * De scroll-lock van `MobileContent`, en met name wat er gebeurt als er TWEE instanties zijn.
 *
 * Op /luister is dat de normale situatie: de nav-drawer en de filter-drawer leven naast elkaar. Tot
 * 2026-08-15 schreef elke instantie rechtstreeks naar `document.body.style.overflow` zonder cleanup,
 * en dat gaf twee manieren om het mis te laten gaan (issue #58). Beide staan hieronder als test, want
 * beide zijn onzichtbaar in de UI: de pagina ziet er goed uit en scrollt alleen niet meer.
 *
 * De bestaande `MobileContent.test.tsx` blijft over het gedrag van de drawer zelf gaan; dit bestand
 * gaat alleen over de globale bijwerking op `document.body`.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { render, fireEvent, screen } from '@testing-library/react';
import './setup-dom';

import MobileContent from '@/components/ui/MobileContent';

/** Zet de viewport op mobiel; de component leest dit via matchMedia. */
function zetMobiel(mobiel: boolean) {
	window.matchMedia = ((query: string) => ({
		matches: mobiel,
		media: query,
		onchange: null,
		addListener: () => {},
		removeListener: () => {},
		addEventListener: () => {},
		removeEventListener: () => {},
		dispatchEvent: () => false,
	})) as unknown as typeof window.matchMedia;
}

function drawer(naam: string) {
	return (
		<MobileContent
			id={naam}
			trigger={(toggle) => (
				<button onClick={toggle}>open-{naam}</button>
			)}
		>
			<p>inhoud van {naam}</p>
		</MobileContent>
	);
}

beforeEach(() => {
	document.body.style.overflow = '';
	zetMobiel(true);
});

describe('scroll-lock: één drawer', () => {
	it('vergrendelt bij openen en geeft weer vrij bij sluiten', () => {
		render(drawer('nav'));
		expect(document.body.style.overflow).toBe('');

		fireEvent.click(screen.getByText('open-nav'));
		expect(document.body.style.overflow).toBe('hidden');

		fireEvent.click(screen.getByText('open-nav'));
		expect(document.body.style.overflow).toBe('');
	});

	/**
	 * Faalscenario (a) uit het issue: unmount terwijl de drawer openstaat — browser-back weg van
	 * /luister met het filterpaneel open. Zonder cleanup bleef `overflow: hidden` staan en was de
	 * VOLGENDE pagina niet meer scrollbaar.
	 */
	it('laat de pagina niet vergrendeld achter als hij open unmount', () => {
		const { unmount } = render(drawer('filter'));
		fireEvent.click(screen.getByText('open-filter'));
		expect(document.body.style.overflow).toBe('hidden');

		unmount();
		expect(document.body.style.overflow).toBe('');
	});
});

describe('scroll-lock: twee drawers naast elkaar', () => {
	/**
	 * Faalscenario (b): de ene instantie mocht de lock van de andere niet wissen. Zonder teller
	 * volstond het dat de nav-instantie zijn effect opnieuw draaide met `isOpen === false`.
	 */
	it('houdt de lock zolang er nog één open is', () => {
		render(
			<>
				{drawer('nav')}
				{drawer('filter')}
			</>,
		);

		fireEvent.click(screen.getByText('open-nav'));
		fireEvent.click(screen.getByText('open-filter'));
		expect(document.body.style.overflow).toBe('hidden');

		// De nav sluit; de filter staat nog open, dus de pagina moet vergrendeld blijven.
		fireEvent.click(screen.getByText('open-nav'));
		expect(document.body.style.overflow).toBe('hidden');

		// Pas als de laatste sluit, gaat de lock eraf.
		fireEvent.click(screen.getByText('open-filter'));
		expect(document.body.style.overflow).toBe('');
	});

	it('geeft pas vrij als de laatst overgebleven drawer unmount', () => {
		const { unmount } = render(
			<>
				{drawer('nav')}
				{drawer('filter')}
			</>,
		);
		fireEvent.click(screen.getByText('open-nav'));
		fireEvent.click(screen.getByText('open-filter'));
		expect(document.body.style.overflow).toBe('hidden');

		unmount();
		expect(document.body.style.overflow).toBe('');
	});
});

describe('scroll-lock: de bestaande waarde', () => {
	/**
	 * De oude code zette `overflow` bij het vrijgeven hard op `''`. Dat wist ook een waarde die er
	 * al stond -- en `base/_reset.scss` zet `body { overflow-y: auto }`. Nu wordt de vorige waarde
	 * bewaard en teruggezet.
	 */
	it('herstelt wat er stond in plaats van leeg te maken', () => {
		document.body.style.overflow = 'scroll';
		const { unmount } = render(drawer('nav'));

		fireEvent.click(screen.getByText('open-nav'));
		expect(document.body.style.overflow).toBe('hidden');

		fireEvent.click(screen.getByText('open-nav'));
		expect(document.body.style.overflow).toBe('scroll');

		unmount();
	});
});

describe('scroll-lock: desktop', () => {
	it('vergrendelt niets op een breed scherm', () => {
		zetMobiel(false);
		render(drawer('nav'));
		fireEvent.click(screen.getByText('open-nav'));
		expect(document.body.style.overflow).toBe('');
	});
});
