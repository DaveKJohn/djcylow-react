// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import './setup-dom';

import Filter from '@/components/luister/Filter';

/**
 * Issue #44: `activeColor` komt ongefilterd uit `searchParams.get('color')` en ging rechtstreeks
 * in `MOOD_DATA[activeColor].colorVar`. Elke onbekende waarde dereferencete `undefined` en gaf een
 * TypeError tijdens de client-render. Er is geen `error.tsx`, dus dat was een witte pagina.
 *
 * Twee reproduceerbare ingangen stonden in het issue: `?color=Red` (hoofdletter, terwijl MOOD_DATA
 * kleine-lettersleutels heeft) en `?color=magenta` (de achtste kleur, die er niet in stond).
 */

const noop = () => {};

function toon(activeColor: string) {
    return render(
        <Filter
            activeColor={activeColor}
            setActiveColor={noop}
            activeGenre="all"
            setActiveGenre={noop}
            activePower="all"
            setActivePower={noop}
        />,
    );
}

describe('Filter — onbekende kleur', () => {
    it.each(['Red', 'magenta', 'onzin', '', 'constructor'])(
        'valt niet om op ?color=%s',
        (kleur) => {
            expect(() => toon(kleur)).not.toThrow();
        },
    );

    it('toont geen moodblok voor een onbekende kleur', () => {
        toon('onzin');
        expect(screen.queryByText(/·/)).toBeNull();
    });

    it('toont wel het moodblok voor een bekende kleur', () => {
        toon('purple');
        expect(screen.getByText(/verdriet/)).toBeTruthy();
    });
});

describe('Filter — magenta', () => {
    // De mix-data kent acht kleuren en er ligt een preview klaar in light-magenta.json, maar
    // MOOD_DATA kende er zeven. Magenta liet de pagina dus omvallen op een kleur die bestaat.
    it('kent magenta als filterknop', () => {
        toon('all');
        expect(screen.getByRole('button', { name: 'Magenta' })).toBeTruthy();
    });

    it('toont de moodtekst van magenta', () => {
        toon('magenta');
        expect(screen.getByText(/geïrriteerd/)).toBeTruthy();
    });

    it('heeft voor elke kleur in MOOD_DATA een knop', () => {
        toon('all');
        for (const kleur of ['Yellow', 'Cyan', 'Green', 'Orange', 'Red', 'Magenta', 'Purple', 'Blue']) {
            expect(screen.getByRole('button', { name: kleur })).toBeTruthy();
        }
    });
});

describe('Filter — geen console-fout', () => {
    it('logt niets naar console.error bij een onbekende kleur', () => {
        const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
        toon('Red');
        expect(spy).not.toHaveBeenCalled();
        spy.mockRestore();
    });
});
