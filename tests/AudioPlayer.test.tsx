// @vitest-environment jsdom
/**
 * AudioPlayer speelt de mixen af. Op 2026-08-14 is hier een setState-in-effect verdwenen: het effect
 * dat een andere speler pauzeert, zette daarna ZELF isPlaying op false. Dat was een tweede bron voor
 * dezelfde waarheid, want pause() laat het audio-element een pause-event vuren en de onPause-handler
 * zet die state al.
 *
 * De fix was een verwijdering, en dat is precies het soort wijziging dat stil kapotgaat: haalt
 * iemand later de onPause-handler weg, dan blijft de speler er "spelend" uitzien terwijl er niets
 * klinkt, en niets in de code wijst nog naar de verdwenen regel. De test 'het pause-event zet de
 * speler terug' hieronder is de wacht die daarop staat.
 *
 * jsdom implementeert play() en pause() niet -- die zijn gestubd. Gevolg: een gestubde pause() vuurt
 * geen pause-event, dus waar de echte browser dat event levert, vuren we het hier met de hand. Dat
 * is geen omweg maar de kern van wat er getest wordt: de component vertrouwt erop dat het element
 * dat event stuurt, en die aanname staat hier expliciet.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import './setup-dom';
import AudioPlayer from '@/components/ui/AudioPlayer';

let playMock: ReturnType<typeof vi.fn>;
let pauseMock: ReturnType<typeof vi.fn>;

beforeEach(() => {
    playMock = vi.fn().mockResolvedValue(undefined);
    pauseMock = vi.fn();
    HTMLMediaElement.prototype.play = playMock as unknown as HTMLMediaElement['play'];
    HTMLMediaElement.prototype.pause = pauseMock as unknown as HTMLMediaElement['pause'];
});

function renderPlayer(props: Partial<React.ComponentProps<typeof AudioPlayer>> = {}) {
    const result = render(
        <AudioPlayer id="mix-1" src="https://example.com/mix.mp3" image="/afbeelding.webp" {...props} />
    );
    const audio = result.container.querySelector('audio')!;
    return { ...result, audio };
}

/** Zet een read-only mediaproperty die jsdom vastzet op 0, en meldt het bijbehorende event. */
function meldMediaWaarde(audio: HTMLAudioElement, property: 'duration' | 'currentTime', waarde: number) {
    Object.defineProperty(audio, property, { value: waarde, configurable: true });
    if (property === 'duration') {
        fireEvent.loadedMetadata(audio);
    } else {
        fireEvent.timeUpdate(audio);
    }
}

describe('AudioPlayer', () => {
    it('start in de ready-stand met een lege tijdweergave', () => {
        const { container } = renderPlayer();

        expect(container.querySelector('.audioplayer-wrapper')).toHaveClass('is-ready');
        expect(screen.getAllByText('00:00')).toHaveLength(2);
    });

    it('meldt zich aan bij de ouder en start het afspelen', async () => {
        const onPlay = vi.fn();
        const { container } = renderPlayer({ onPlay });

        await act(async () => {
            fireEvent.click(screen.getByRole('button', { name: 'Speel audio af' }));
        });

        // onPlay meldt aan de ouder wie er nu speelt; die zet daarop activeId, waarmee de andere
        // spelers zichzelf pauzeren.
        expect(onPlay).toHaveBeenCalledWith('mix-1');
        expect(playMock).toHaveBeenCalled();
        expect(container.querySelector('.audioplayer-wrapper')).toHaveClass('is-playing');
    });

    it('pauzeert zichzelf wanneer een andere speler het overneemt', () => {
        const { rerender } = renderPlayer({ activeId: 'mix-1' });
        expect(pauseMock).not.toHaveBeenCalled();

        rerender(
            <AudioPlayer id="mix-1" src="https://example.com/mix.mp3" image="/afbeelding.webp" activeId="mix-2" />
        );

        expect(pauseMock).toHaveBeenCalledTimes(1);
    });

    it('pauzeert zichzelf niet als hijzelf de actieve speler is', () => {
        renderPlayer({ activeId: 'mix-1' });
        expect(pauseMock).not.toHaveBeenCalled();
    });

    it('pauzeert zichzelf niet zolang er nog niemand speelt', () => {
        // activeId is null tot de eerste klik. Een pause() daarop zou onschuldig zijn maar verraadt
        // dat de conditie de null-stand niet uitzondert.
        renderPlayer({ activeId: null });
        expect(pauseMock).not.toHaveBeenCalled();
    });

    it('zet de speler terug naar ready op het pause-event van het element', async () => {
        // Dit is de wacht op de verwijderde setIsPlaying(false): de state hangt sinds die wijziging
        // volledig aan het event dat het audio-element stuurt.
        const { container } = renderPlayer();

        await act(async () => {
            fireEvent.click(screen.getByRole('button', { name: 'Speel audio af' }));
        });
        expect(container.querySelector('.audioplayer-wrapper')).toHaveClass('is-playing');

        fireEvent.pause(container.querySelector('audio')!);
        expect(container.querySelector('.audioplayer-wrapper')).toHaveClass('is-ready');
    });

    it('zet de speler terug naar ready wanneer de mix is afgelopen', async () => {
        const { container, audio } = renderPlayer();

        await act(async () => {
            fireEvent.click(screen.getByRole('button', { name: 'Speel audio af' }));
        });

        fireEvent.ended(audio);
        expect(container.querySelector('.audioplayer-wrapper')).toHaveClass('is-ready');
    });

    it('pauzeert op de pauzeknop', async () => {
        const { audio } = renderPlayer();

        await act(async () => {
            fireEvent.click(screen.getByRole('button', { name: 'Speel audio af' }));
        });
        fireEvent.click(screen.getByRole('button', { name: 'Pauzeer audio' }));

        expect(pauseMock).toHaveBeenCalled();
        // De handler zet de state hier wel zelf, want dit is een gebruikershandeling en niet het
        // gevolg van een andere speler.
        expect(audio).toBeInTheDocument();
    });

    it('blijft leesbaar wanneer het afspelen mislukt', async () => {
        // Een geblokkeerde autoplay of een dode URL laat play() rejecten. De speler mag dan niet in
        // de laadstand blijven hangen -- dat is de spinner die nooit meer weggaat.
        playMock.mockRejectedValueOnce(new Error('NotAllowedError'));
        const consoleError = vi.spyOn(console, 'error').mockImplementation(() => { });
        const { container } = renderPlayer();

        await act(async () => {
            fireEvent.click(screen.getByRole('button', { name: 'Speel audio af' }));
        });

        expect(container.querySelector('.audioplayer-wrapper')).toHaveClass('is-ready');
        expect(container.querySelector('.audioplayer-wrapper')).not.toHaveClass('is-loading');
        consoleError.mockRestore();
    });

    it('toont minuten en seconden voor een gewone mix', () => {
        const { audio } = renderPlayer();

        meldMediaWaarde(audio, 'duration', 125);
        expect(screen.getByText('02:05')).toBeInTheDocument();
    });

    it('toont uren zodra de mix langer dan een uur duurt', () => {
        // De mixen op deze site duren standaard meer dan een uur; de uur-tak is dus de normale
        // situatie en niet het randgeval.
        const { audio } = renderPlayer();

        meldMediaWaarde(audio, 'duration', 3661);
        expect(screen.getByText('1:01:01')).toBeInTheDocument();
    });

    it('toont 00:00 zolang de duur nog onbekend is', () => {
        // Voor de metadata geladen is, is duration NaN. Zonder de isNaN-tak staat er "NaN:NaN".
        const { audio } = renderPlayer();

        meldMediaWaarde(audio, 'duration', NaN);
        expect(screen.getAllByText('00:00')).toHaveLength(2);
    });

    it('werkt de verstreken tijd bij tijdens het afspelen', () => {
        const { audio } = renderPlayer();

        meldMediaWaarde(audio, 'currentTime', 65);
        expect(screen.getByText('01:05')).toBeInTheDocument();
    });

    it('laat de voortgangsbalk meelopen met de verstreken tijd', () => {
        const { container, audio } = renderPlayer();

        meldMediaWaarde(audio, 'duration', 200);
        meldMediaWaarde(audio, 'currentTime', 50);

        expect(container.querySelector('.timeline.progress')).toHaveStyle({ width: '25%' });
    });

    it('houdt de voortgangsbalk op 0% zolang de duur nog onbekend is', () => {
        // currentTime / duration is dan NaN; de `|| 0` erachter vangt dat af. Zonder die vangnet
        // krijgt de balk "NaN%" en verdwijnt hij.
        const { container } = renderPlayer();

        expect(container.querySelector('.timeline.progress')).toHaveStyle({ width: '0%' });
    });

    it('dempt en herstelt het volume met de mute-knop', () => {
        const { audio } = renderPlayer();
        expect(audio.volume).toBe(1);

        fireEvent.click(screen.getByRole('button', { name: 'Audio dempen' }));
        expect(audio.volume).toBe(0);

        fireEvent.click(screen.getByRole('button', { name: 'Audio dempen' }));
        expect(audio.volume).toBe(1);
    });

    it('regelt het volume met de schuif', () => {
        const { audio } = renderPlayer();

        fireEvent.change(screen.getByRole('slider', { name: 'Volumeregeling' }), { target: { value: '0.4' } });
        expect(audio.volume).toBeCloseTo(0.4);
    });

    it('verbergt de volumeschuif waar daarom gevraagd wordt', () => {
        // De compacte speler op de overzichtspagina's zet deze uit; de mute-knop blijft wel staan.
        renderPlayer({ showVolumeSlider: false });

        expect(screen.queryByRole('slider')).toBeNull();
        expect(screen.getByRole('button', { name: 'Audio dempen' })).toBeInTheDocument();
    });

    it('zet de meegegeven className en het id op de wrapper', () => {
        const { container } = renderPlayer({ className: 'compact' });

        const wrapper = container.querySelector('.audioplayer-wrapper');
        expect(wrapper).toHaveClass('compact');
        expect(wrapper).toHaveAttribute('data-id', 'mix-1');
    });

    it('laadt de audio pas als de bezoeker erom vraagt', () => {
        // preload="none" houdt de mixen van de R2-bucket af tot iemand op play drukt. Een wijziging
        // hierin kost bandbreedte op elke paginaweergave.
        const { audio } = renderPlayer();

        expect(audio).toHaveAttribute('preload', 'none');
        expect(audio).toHaveAttribute('src', 'https://example.com/mix.mp3');
    });
});
