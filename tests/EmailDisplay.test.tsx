// @vitest-environment jsdom
/**
 * EmailDisplay stelt het e-mailadres pas in de browser samen, zodat het niet in de statische HTML
 * staat die scrapers uitlezen. Op 2026-08-14 is die component van een useEffect met setState
 * overgezet naar useSyncExternalStore -- de lege waarde is nu de SERVERSNAPSHOT in plaats van een
 * beginstate die een effect moet overschrijven.
 *
 * Deze suite bewaakt beide kanten: dat het adres in de browser zichtbaar wordt, en dat het NIET in
 * de server-HTML staat.
 *
 * DIE TWEEDE KANT STOND HIER TOT 2026-08-15 AFGESCHREVEN ALS NIET-TESTBAAR, en dat was te breed
 * geformuleerd. De redenering -- "jsdom rendert altijd de clientsnapshot" -- klopt voor `render()`
 * uit Testing Library, maar niet voor `renderToStaticMarkup`: die neemt precies de tak die de
 * component voor de server heeft (`getEmptyOnServer`), en dat is exact het pad dat de statische
 * export uitlevert. De eigenschap die ertoe doet is dus wel in een unittest vast te leggen.
 *
 * Waarom dat de moeite waard is: deze bescherming was ooit begonnen en niet afgemaakt, waarna
 * `info@djcylow.com` op zes pagina's scrape-baar stond terwijl de component ernaast ongebruikt in
 * de imports hing. Tot vandaag bewaakte alleen een eenmalige build-meting dat -- een meting die
 * niemand opnieuw draait. De build-meting blijft waardevol als integratiebewijs (0 treffers in 86
 * pagina's), maar hij loopt niet mee bij elke wijziging en deze test wel.
 */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { renderToStaticMarkup } from 'react-dom/server';
import './setup-dom';
import EmailDisplay from '@/components/common/EmailDisplay';

describe('EmailDisplay', () => {
    it('stelt het adres samen uit user en domain', () => {
        render(<EmailDisplay user="info" domain="djcylow.com" />);
        expect(screen.getByText('info@djcylow.com')).toBeInTheDocument();
    });

    it('zet de meegegeven className op de span, zodat de styling blijft werken', () => {
        const { container } = render(
            <EmailDisplay user="info" domain="djcylow.com" className="size-xs" />
        );
        const span = container.querySelector('span');
        expect(span?.className).toBe('size-xs');
    });

    it('rendert een span zonder className als die niet is meegegeven', () => {
        // Regressiebewaking op een detail dat makkelijk stilletjes verandert: de component wordt
        // zowel met als zonder className gebruikt (footer respectievelijk contactformulier).
        const { container } = render(<EmailDisplay user="test" domain="example.com" />);
        expect(container.querySelector('span')).toBeInTheDocument();
        expect(screen.getByText('test@example.com')).toBeInTheDocument();
    });
});

describe('EmailDisplay — de anti-scrape-eigenschap', () => {
    it('zet het adres niet in de server-HTML', () => {
        const markup = renderToStaticMarkup(<EmailDisplay user="info" domain="djcylow.com" />);
        expect(markup).not.toContain('info@djcylow.com');
        expect(markup).not.toContain('djcylow.com');
    });

    it('levert server-side een lege span, niet een ontbrekend element', () => {
        // De span moet er staan: hij draagt de styling en de layout mag niet verspringen zodra de
        // client hem vult. Alleen de inhoud hoort leeg te zijn.
        const markup = renderToStaticMarkup(<EmailDisplay user="info" domain="djcylow.com" className="size-xs" />);
        expect(markup).toBe('<span class="size-xs"></span>');
    });

    it('houdt ook het losse domein en de gebruikersnaam uit de server-HTML', () => {
        // Een scraper die op `user` of `domain` los zoekt, hoort evenmin iets te vinden -- anders
        // zou een halve treffer alsnog het adres verraden.
        const markup = renderToStaticMarkup(<EmailDisplay user="boekingen" domain="voorbeeld.nl" />);
        expect(markup).not.toContain('boekingen');
        expect(markup).not.toContain('voorbeeld.nl');
    });
});
