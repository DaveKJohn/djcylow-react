// @vitest-environment jsdom
/**
 * EmailDisplay stelt het e-mailadres pas in de browser samen, zodat het niet in de statische HTML
 * staat die scrapers uitlezen. Op 2026-08-14 is die component van een useEffect met setState
 * overgezet naar useSyncExternalStore -- de lege waarde is nu de SERVERSNAPSHOT in plaats van een
 * beginstate die een effect moet overschrijven.
 *
 * Deze suite bewaakt de kant die je in een browser ziet: dat het adres er daadwerkelijk staat. De
 * andere kant -- dat het NIET in de gebouwde HTML staat -- is met opzet geen unittest: jsdom rendert
 * altijd de clientsnapshot, dus hier zou zo'n test niets bewijzen. Die kant is gemeten op de echte
 * build en op de deploy preview (0 treffers in 86 pagina's), en dat is waar hij hoort.
 */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
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
