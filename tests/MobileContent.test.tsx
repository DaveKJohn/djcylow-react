// @vitest-environment jsdom
/**
 * MobileContent is de drawer achter de mobiele navigatie. Op 2026-08-14 zijn hier twee dingen
 * veranderd: de viewport en "draait dit al in de browser?" worden nu met useSyncExternalStore
 * gelezen in plaats van in state nagebouwd, en het sluiten van de drawer gebeurt TIJDENS DE RENDER
 * in plaats van in een effect.
 *
 * Dat tweede is waar deze suite op scherp staat. Een effect draait na de paint, dus de oude versie
 * liet de open drawer eerst nog een frame zien voordat hij dichtging. De render-phase reset heeft
 * die tussenstap niet -- maar het is ook precies het soort constructie dat een latere lezer voor een
 * vergissing aanziet en "netjes" terugzet naar een useEffect. Vandaar dat beide sluitmomenten
 * (schalen naar desktop, navigeren) hier een eigen test hebben.
 *
 * jsdom kent geen window.matchMedia, dus die staat hieronder gestubd -- met werkende listeners,
 * anders zou het schalen niets doen en zou de belangrijkste test slagen zonder iets te bewijzen.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import './setup-dom';
import MobileContent from '@/components/ui/MobileContent';

// De pathname is een mock die we tussen renders kunnen verzetten; zo simuleren we een navigatie.
let mockPathname = '/';
vi.mock('next/navigation', () => ({
    usePathname: () => mockPathname,
}));

// --- matchMedia-stub ---------------------------------------------------------------------------
// De component roept matchMedia twee keer aan: eenmalig om te subscriben, en bij elke render om de
// snapshot te lezen. Beide krijgen hetzelfde gedeelde `matches` en dezelfde listener-set, zodat een
// viewportwijziging zowel de listeners afvuurt als een nieuwe snapshot oplevert.
let matchesMobile = false;
const viewportListeners = new Set<() => void>();

function setViewport(isMobile: boolean) {
    matchesMobile = isMobile;
    act(() => {
        viewportListeners.forEach(listener => listener());
    });
}

beforeEach(() => {
    matchesMobile = false;
    viewportListeners.clear();
    mockPathname = '/';
    window.matchMedia = ((query: string) => ({
        get matches() { return matchesMobile; },
        media: query,
        onchange: null,
        addEventListener: (_type: string, listener: () => void) => { viewportListeners.add(listener); },
        removeEventListener: (_type: string, listener: () => void) => { viewportListeners.delete(listener); },
        addListener: () => { },
        removeListener: () => { },
        dispatchEvent: () => false,
    })) as unknown as typeof window.matchMedia;
});

afterEach(() => {
    // De component schrijft naar document.body; zonder opruimen lekt dat naar de volgende test.
    document.body.style.overflow = '';
});

const trigger = (toggle: () => void) => (
    <button onClick={toggle}>Menu</button>
);

function renderDrawer(children: React.ReactNode = <p>Inhoud</p>) {
    return render(
        <MobileContent id="nav" trigger={trigger} title="Navigatie" icon={<span>icoon</span>}>
            {children}
        </MobileContent>
    );
}

describe('MobileContent', () => {
    it('rendert de trigger, ongeacht de viewport', () => {
        renderDrawer();
        expect(screen.getByRole('button', { name: 'Menu' })).toBeInTheDocument();
    });

    it('vergrendelt de drawer op desktop en toont geen overlay of header', () => {
        const { container } = renderDrawer();

        const drawer = container.querySelector('.drawer');
        expect(drawer).toHaveClass('locked');
        expect(drawer).not.toHaveClass('ready');
        expect(container.querySelector('.drawer-overlay')).toBeNull();
        expect(container.querySelector('.drawer-header')).toBeNull();
    });

    it('maakt de drawer klaar op mobiel en toont overlay, titel en icoon', () => {
        matchesMobile = true;
        const { container } = renderDrawer();

        expect(container.querySelector('.drawer')).toHaveClass('ready');
        expect(container.querySelector('.drawer-overlay')).toBeInTheDocument();
        expect(screen.getByText('Navigatie')).toBeInTheDocument();
        expect(screen.getByText('icoon')).toBeInTheDocument();
    });

    it('opent en sluit via de toggle die aan de trigger wordt meegegeven', () => {
        matchesMobile = true;
        const { container } = renderDrawer();
        const drawer = container.querySelector('.drawer');

        expect(drawer).toHaveClass('closed');

        fireEvent.click(screen.getByRole('button', { name: 'Menu' }));
        expect(drawer).toHaveClass('open');

        fireEvent.click(screen.getByRole('button', { name: 'Menu' }));
        expect(drawer).toHaveClass('closed');
    });

    it('sluit een open drawer zodra de viewport naar desktop schaalt', () => {
        // De eerste van de twee render-phase resets. Zonder die reset blijft de drawer open staan
        // terwijl hij op desktop niet meer bedienbaar is: de sluitknop en de overlay verdwijnen mee.
        matchesMobile = true;
        const { container } = renderDrawer();
        fireEvent.click(screen.getByRole('button', { name: 'Menu' }));
        expect(container.querySelector('.drawer')).toHaveClass('open');

        setViewport(false);

        const drawer = container.querySelector('.drawer');
        expect(drawer).toHaveClass('closed');
        expect(drawer).toHaveClass('locked');
    });

    it('laat een open drawer met rust bij schalen naar mobiel', () => {
        // De reset is bewust eenrichtingsverkeer (`if (!isMobile)`). Een gebruiker die zijn venster
        // versmalt terwijl het menu openstaat, houdt het menu open.
        matchesMobile = true;
        const { container } = renderDrawer();
        fireEvent.click(screen.getByRole('button', { name: 'Menu' }));

        setViewport(false);
        setViewport(true);
        expect(container.querySelector('.drawer')).toHaveClass('closed');

        fireEvent.click(screen.getByRole('button', { name: 'Menu' }));
        setViewport(true);
        expect(container.querySelector('.drawer')).toHaveClass('open');
    });

    it('sluit de drawer bij een navigatie', () => {
        // De tweede render-phase reset. Zonder deze blijft het menu na een klik op een link openstaan
        // over de nieuwe pagina heen -- de klassieke bug van een mobiele navigatie.
        matchesMobile = true;
        const { container, rerender } = render(
            <MobileContent id="nav" trigger={trigger}><p>Inhoud</p></MobileContent>
        );
        fireEvent.click(screen.getByRole('button', { name: 'Menu' }));
        expect(container.querySelector('.drawer')).toHaveClass('open');

        mockPathname = '/mixes';
        rerender(<MobileContent id="nav" trigger={trigger}><p>Inhoud</p></MobileContent>);

        expect(container.querySelector('.drawer')).toHaveClass('closed');
    });

    it('sluit via de sluitknop en via de overlay', () => {
        matchesMobile = true;
        const { container } = renderDrawer();

        fireEvent.click(screen.getByRole('button', { name: 'Menu' }));
        fireEvent.click(screen.getByRole('button', { name: '✕' }));
        expect(container.querySelector('.drawer')).toHaveClass('closed');

        fireEvent.click(screen.getByRole('button', { name: 'Menu' }));
        fireEvent.click(container.querySelector('.drawer-overlay')!);
        expect(container.querySelector('.drawer')).toHaveClass('closed');
    });

    it('bevriest de pagina achter een open drawer en geeft hem daarna terug', () => {
        matchesMobile = true;
        renderDrawer();

        fireEvent.click(screen.getByRole('button', { name: 'Menu' }));
        expect(document.body.style.overflow).toBe('hidden');

        fireEvent.click(screen.getByRole('button', { name: 'Menu' }));
        expect(document.body.style.overflow).toBe('');
    });

    it('geeft de pagina ook terug wanneer de drawer sluit door het schalen naar desktop', () => {
        // De scroll-lock hangt aan isOpen EN isMobile. Sluit de drawer door de render-phase reset in
        // plaats van door een klik, dan moet de body alsnog vrijkomen -- anders zit een
        // desktopbezoeker met een pagina die niet scrollt en geen zichtbare oorzaak.
        matchesMobile = true;
        renderDrawer();
        fireEvent.click(screen.getByRole('button', { name: 'Menu' }));
        expect(document.body.style.overflow).toBe('hidden');

        setViewport(false);
        expect(document.body.style.overflow).toBe('');
    });

    it('geeft de toggle door aan children wanneer die een functie zijn', () => {
        matchesMobile = true;
        const { container } = render(
            <MobileContent
                id="nav"
                trigger={trigger}
            >
                {(toggle: () => void) => <button onClick={toggle}>Sluit vanuit de inhoud</button>}
            </MobileContent>
        );

        fireEvent.click(screen.getByRole('button', { name: 'Menu' }));
        expect(container.querySelector('.drawer')).toHaveClass('open');

        fireEvent.click(screen.getByRole('button', { name: 'Sluit vanuit de inhoud' }));
        expect(container.querySelector('.drawer')).toHaveClass('closed');
    });

    it('zet id en wrapperClass op de drawer', () => {
        // De wrapperClass is hoe de aanroepers hun eigen styling meegeven; het id koppelt de drawer
        // aan de aria-controls van de trigger op de aanroepplek.
        const { container } = render(
            <MobileContent id="nav-menu" wrapperClass="eigen-klasse" trigger={trigger}>
                <p>Inhoud</p>
            </MobileContent>
        );

        const drawer = container.querySelector('.drawer');
        expect(drawer).toHaveAttribute('id', 'nav-menu');
        expect(drawer).toHaveClass('eigen-klasse');
    });
});
