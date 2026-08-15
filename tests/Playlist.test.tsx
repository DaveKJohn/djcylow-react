// @vitest-environment jsdom
/**
 * Het filter van de Luister-pagina (`Playlist.tsx:35-45`).
 *
 * WAAROM DIT GETEST WORDT EN DE PAGINA ZELF NIET
 * ----------------------------------------------
 * De filterlogica is een pure `useMemo` over geïmporteerde JSON: kleur, genre en power, plus de
 * sorteervolgorde. Een fout hier laat mixen stil verdwijnen -- de pagina rendert, de build slaagt,
 * er is geen foutmelding, en de bezoeker ziet alleen een kortere lijst. Precies de klasse die geen
 * enkele poort vangt.
 *
 * De verwachtingen worden uit de data zélf afgeleid en niet als getallen opgeschreven. Een nieuwe
 * mix mag deze suite niet rood maken; wat hem rood hoort te maken is een filter dat anders gaat
 * selecteren dan de data zegt.
 *
 * `Playlist` toont er standaard tien tegelijk, dus tellen gebeurt op de links in de lijst en op de
 * aanwezigheid van de "Laad meer"-knop -- niet op het totaal.
 */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import './setup-dom';

import Playlist from '@/components/luister/Playlist';
import { allMixes, liveMixes, mixSlug } from '@/data/mixes/all';

const LIMIET = 10;

/** De mixen die het filter hoort over te houden, los van de component berekend. */
const verwacht = (color: string, genre: string, power: string) =>
    liveMixes.filter(
        (mix) =>
            (color === 'all' || mix.color?.toLowerCase() === color.toLowerCase()) &&
            (genre === 'all' || mix.genre === genre) &&
            (power === 'all' || mix.power === power),
    );

function toon(color = 'all', genre = 'all', power = 'all') {
    return render(<Playlist activeColor={color} activeGenre={genre} activePower={power} />);
}

/** De mix-links die de component werkelijk rendert. */
const getoondeSlugs = (container: HTMLElement) =>
    Array.from(container.querySelectorAll('a[href*="/luister/mix/"]')).map(
        (a) => (a.getAttribute('href') ?? '').split('/luister/mix/')[1].split('?')[0],
    );

describe('Playlist — het filter selecteert wat de data zegt', () => {
    it('toont zonder filter de eerste tien nieuwste mixen', () => {
        const { container } = toon();
        const slugs = getoondeSlugs(container);
        expect(slugs).toHaveLength(LIMIET);
        expect(slugs).toEqual(verwacht('all', 'all', 'all').slice(0, LIMIET).map(mixSlug));
    });

    it('filtert op kleur', () => {
        const kleur = liveMixes[0].color;
        const { container } = toon(kleur);
        const slugs = getoondeSlugs(container);
        expect(slugs).toEqual(verwacht(kleur, 'all', 'all').slice(0, LIMIET).map(mixSlug));
        expect(slugs.length).toBeGreaterThan(0);
    });

    it('filtert op kleur ongeacht de letterkast -- de URL levert hem ongefilterd aan', () => {
        const kleur = liveMixes[0].color;
        const { container: a } = toon(kleur.toLowerCase());
        const kleinLetter = getoondeSlugs(a);
        expect(kleinLetter).toEqual(verwacht(kleur, 'all', 'all').slice(0, LIMIET).map(mixSlug));
    });

    it('filtert op power', () => {
        const { container } = toon('all', 'all', 'Full');
        expect(getoondeSlugs(container)).toEqual(verwacht('all', 'all', 'Full').slice(0, LIMIET).map(mixSlug));
    });

    it('filtert op genre', () => {
        const genre = liveMixes[0].genre;
        const { container } = toon('all', genre);
        expect(getoondeSlugs(container)).toEqual(verwacht('all', genre, 'all').slice(0, LIMIET).map(mixSlug));
    });

    it('combineert kleur, genre en power', () => {
        const mix = liveMixes[0];
        const { container } = toon(mix.color, mix.genre, mix.power);
        const slugs = getoondeSlugs(container);
        expect(slugs).toEqual(verwacht(mix.color, mix.genre, mix.power).slice(0, LIMIET).map(mixSlug));
        expect(slugs).toContain(mixSlug(mix));
    });
});

describe('Playlist — wat er nooit in mag staan', () => {
    it('toont geen preview-entries, ook niet als hun kleur wordt gefilterd', () => {
        const previews = allMixes.filter((mix) => mix.ignore === true);
        expect(previews.length).toBeGreaterThan(0);

        // Een preview-entry heeft geen permalink; zou hij toch meekomen, dan valt `mixSlug` erover.
        // Deze test controleert de kleur waarop hij zou verschijnen, niet zomaar het totaal.
        for (const preview of previews.slice(0, 3)) {
            const { container, unmount } = toon(preview.color);
            const slugs = getoondeSlugs(container);
            expect(slugs).not.toContain('');
            expect(slugs.every((s) => s.length > 0)).toBe(true);
            unmount();
        }
    });

    it('meldt netjes dat er niets is bij een combinatie die niet bestaat', () => {
        toon('Blue', 'Nu-Disco', 'Light');
        const treffers = verwacht('Blue', 'Nu-Disco', 'Light');
        if (treffers.length === 0) {
            expect(screen.getByText('Geen mixen gevonden voor deze combinatie.')).toBeInTheDocument();
        } else {
            // De data heeft deze combinatie wél; dan hoort de melding er juist niet te staan.
            expect(screen.queryByText('Geen mixen gevonden voor deze combinatie.')).toBeNull();
        }
    });

    it('toont niets bij een onbekende kleur uit de URL, zonder om te vallen', () => {
        expect(() => toon('onzin')).not.toThrow();
        expect(screen.getByText('Geen mixen gevonden voor deze combinatie.')).toBeInTheDocument();
    });
});

describe('Playlist — volgorde en links', () => {
    it('sorteert nieuwste eerst', () => {
        const { container } = toon();
        const slugs = getoondeSlugs(container);
        const ids = slugs.map((slug) => liveMixes.find((m) => mixSlug(m) === slug)?.id ?? '');
        expect(ids).toEqual([...ids].sort((a, b) => b.localeCompare(a)));
    });

    it('hangt het actieve filter aan de mix-link, zodat de terugweg het filter behoudt', () => {
        const kleur = liveMixes[0].color;
        const { container } = toon(kleur);
        const href = container.querySelector('a[href*="/luister/mix/"]')?.getAttribute('href') ?? '';
        expect(href).toContain(`color=${encodeURIComponent(kleur)}`);
    });

    it('laat de link zonder querystring als er geen filter aanstaat', () => {
        const { container } = toon();
        const href = container.querySelector('a[href*="/luister/mix/"]')?.getAttribute('href') ?? '';
        expect(href).not.toContain('?');
    });

    it('toont "Laad meer" alleen als er meer dan tien treffers zijn', () => {
        const { unmount } = toon();
        expect(verwacht('all', 'all', 'all').length).toBeGreaterThan(LIMIET);
        expect(screen.getByRole('button', { name: 'Laad meer' })).toBeInTheDocument();
        unmount();

        // Een combinatie met tien of minder treffers hoort de knop niet te tonen.
        const smal = liveMixes[0];
        const treffers = verwacht(smal.color, smal.genre, smal.power);
        if (treffers.length <= LIMIET) {
            toon(smal.color, smal.genre, smal.power);
            expect(screen.queryByRole('button', { name: 'Laad meer' })).toBeNull();
        }
    });
});
