// @vitest-environment jsdom
/**
 * Het contactformulier — het enige conversiepad van de site, en tot 2026-08-15 zonder enkele test
 * op de component zelf (issue #73). De Netlify-function erachter was al gedekt door
 * `send-email.test.ts`; dit is de clientkant.
 *
 * WAT HIER GETEST WORDT EN WAAROM. De component doet vier dingen die stil kunnen breken:
 *
 *   1. de knop blokkeren tot de captcha is opgelost — anders komt elke aanvraag als fout terug
 *   2. de velden opsturen onder de namen die de function verwacht — een hernoemd veld levert
 *      "Boekingsaanvraag: undefined undefined" op, en dat is hier echt gebeurd (issue #42)
 *   3. de succesbevestiging tonen in plaats van het formulier
 *   4. bij een fout het token verversen — een reCAPTCHA-token is eenmalig, dus zonder reset blijft
 *      een tweede poging hangen op 'timeout-or-duplicate' tot de pagina herlaadt (issue #51)
 *
 * `fetch` en reCAPTCHA gaan als mock naar binnen. De captcha mocken is normaal en geen concessie:
 * hij praat met Google, en wat hier telt is wat de component met het tóken doet.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import './setup-dom';

/**
 * De echte reCAPTCHA-widget vervangen door een knop die een token teruggeeft. Dit moet vóór de
 * import van ContactForm staan; `next/dynamic` laadt de module lui, maar vi.mock wordt gehoist.
 */
vi.mock('react-google-recaptcha', () => ({
	default: ({ onChange }: { onChange: (v: string | null) => void }) => (
		<button type="button" onClick={() => onChange('test-token')}>
			los-captcha-op
		</button>
	),
}));

import ContactForm from '@/components/sections/ContactForm';

const fetchMock = vi.fn();

/** Vult de drie velden en lost de captcha op, zodat het formulier verstuurd kan worden. */
async function vulInEnLosCaptchaOp() {
	fireEvent.change(screen.getByPlaceholderText('Naam'), { target: { value: 'Dave Kok' } });
	fireEvent.change(screen.getByPlaceholderText('E-mail'), { target: { value: 'dave@example.com' } });
	fireEvent.change(screen.getByPlaceholderText('Vraag / opmerking'), { target: { value: 'Is 12 juli vrij?' } });
	// De captcha wordt lui geladen via een IntersectionObserver; die vuurt in jsdom niet, dus we
	// wachten tot hij er staat nadat de fallback-timer hem heeft aangezet.
	const knop = await screen.findByText('los-captcha-op', undefined, { timeout: 3000 });
	fireEvent.click(knop);
}

beforeEach(() => {
	fetchMock.mockReset();
	vi.stubGlobal('fetch', fetchMock);
	// jsdom kent IntersectionObserver niet; de component gebruikt hem om de captcha lui te laden.
	// Deze stub roept de callback meteen aan, zodat de widget verschijnt zonder op de 6-secondentimer
	// te wachten.
	vi.stubGlobal(
		'IntersectionObserver',
		class {
			constructor(private cb: (entries: { isIntersecting: boolean }[]) => void) {
				setTimeout(() => this.cb([{ isIntersecting: true }]), 0);
			}
			observe() {}
			disconnect() {}
			unobserve() {}
		},
	);
	Element.prototype.scrollIntoView = function () {};
});

describe('contactformulier: de verzendknop', () => {
	it('staat uit tot de captcha is opgelost', async () => {
		render(<ContactForm />);
		const knop = screen.getByRole('button', { name: /verstuur|verzend/i });
		expect(knop).toBeDisabled();

		await vulInEnLosCaptchaOp();
		expect(knop).toBeEnabled();
	});
});

describe('contactformulier: versturen', () => {
	it('stuurt de velden onder de namen die de function verwacht', async () => {
		fetchMock.mockResolvedValue({ ok: true, json: async () => ({}) });
		render(<ContactForm />);
		await vulInEnLosCaptchaOp();

		fireEvent.click(screen.getByRole('button', { name: /verstuur|verzend/i }));

		await waitFor(() => expect(fetchMock).toHaveBeenCalled());
		const [url, opties] = fetchMock.mock.calls[0];
		expect(url).toBe('/.netlify/functions/send-email');

		const body = JSON.parse(opties.body);
		// Precies deze drie namen: de function las ooit firstName en lastName, die nergens bestonden,
		// en elke aanvraag kwam binnen als "undefined undefined".
		expect(body.name).toBe('Dave Kok');
		expect(body.email).toBe('dave@example.com');
		expect(body.message).toBe('Is 12 juli vrij?');
		expect(body['g-recaptcha-response']).toBe('test-token');
	});

	it('stuurt het honeypot-veld mee, zodat de function het kan controleren', async () => {
		fetchMock.mockResolvedValue({ ok: true, json: async () => ({}) });
		render(<ContactForm />);
		await vulInEnLosCaptchaOp();
		fireEvent.click(screen.getByRole('button', { name: /verstuur|verzend/i }));

		await waitFor(() => expect(fetchMock).toHaveBeenCalled());
		const body = JSON.parse(fetchMock.mock.calls[0][1].body);
		expect(body).toHaveProperty('bot-field');
		expect(body['bot-field']).toBe('');
	});

	it('toont de bevestiging en niet meer het formulier', async () => {
		fetchMock.mockResolvedValue({ ok: true, json: async () => ({}) });
		render(<ContactForm />);
		await vulInEnLosCaptchaOp();
		fireEvent.click(screen.getByRole('button', { name: /verstuur|verzend/i }));

		expect(await screen.findByText('Bericht verzonden!')).toBeInTheDocument();
		expect(screen.queryByPlaceholderText('Naam')).toBeNull();
	});

	it('brengt je met de knop terug naar een leeg formulier', async () => {
		fetchMock.mockResolvedValue({ ok: true, json: async () => ({}) });
		render(<ContactForm />);
		await vulInEnLosCaptchaOp();
		fireEvent.click(screen.getByRole('button', { name: /verstuur|verzend/i }));
		await screen.findByText('Bericht verzonden!');

		fireEvent.click(screen.getByRole('button', { name: 'Nieuw bericht sturen' }));
		expect(await screen.findByPlaceholderText('Naam')).toHaveValue('');
	});
});

describe('contactformulier: foutafhandeling', () => {
	it('toont de foutmelding van de server', async () => {
		fetchMock.mockResolvedValue({ ok: false, json: async () => ({ error: 'Vul een geldig e-mailadres in.' }) });
		render(<ContactForm />);
		await vulInEnLosCaptchaOp();
		fireEvent.click(screen.getByRole('button', { name: /verstuur|verzend/i }));

		expect(await screen.findByText('Vul een geldig e-mailadres in.')).toBeInTheDocument();
	});

	it('blijft overeind als de server geen bruikbare JSON teruggeeft', async () => {
		fetchMock.mockResolvedValue({ ok: false, json: async () => { throw new Error('geen json'); } });
		render(<ContactForm />);
		await vulInEnLosCaptchaOp();
		fireEvent.click(screen.getByRole('button', { name: /verstuur|verzend/i }));

		expect(await screen.findByText('Server fout')).toBeInTheDocument();
	});

	it('vraagt na een fout om een nieuwe captcha in plaats van het oude token te hergebruiken', async () => {
		// Een reCAPTCHA-token is eenmalig en ongeveer twee minuten geldig. Zonder reset probeert de
		// bezoeker het opnieuw met hetzelfde token, antwoordt Google 'timeout-or-duplicate', en
		// herhaalt dat zich tot de pagina herlaadt -- één tijdelijke serverfout kostte zo de hele
		// aanvraag (issue #51).
		fetchMock.mockResolvedValue({ ok: false, json: async () => ({ error: 'Server fout' }) });
		render(<ContactForm />);
		await vulInEnLosCaptchaOp();

		const knop = screen.getByRole('button', { name: /verstuur|verzend/i });
		fireEvent.click(knop);
		await screen.findByText('Server fout');

		// Token weg, dus de knop staat weer uit tot er een verse challenge is opgelost.
		expect(knop).toBeDisabled();
	});

	it('verstuurt niets als de captcha nog niet is opgelost', async () => {
		render(<ContactForm />);
		fireEvent.change(screen.getByPlaceholderText('Naam'), { target: { value: 'Dave' } });
		fireEvent.click(screen.getByRole('button', { name: /verstuur|verzend/i }));

		expect(fetchMock).not.toHaveBeenCalled();
	});
});
