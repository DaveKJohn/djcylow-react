/**
 * Eén bron voor de mix-data en voor de slug-afleiding.
 *
 * De vijftien JSON-bestanden werden op zes plekken los geimporteerd en samengevoegd, en de
 * slug werd op acht plekken opnieuw uit `permalink` gepeuterd -- deels mét `.toLowerCase().trim()`
 * en deels zonder. Dat laatste is geen schoonheidsfoutje: de routing hangt aan die slug, dus twee
 * varianten betekent dat een link en de pagina waar hij heen wijst uit elkaar kunnen lopen.
 *
 * Issue #83 zet de overige gebruikers hierop over; dit bestand is aangemaakt op het moment dat er
 * anders een zevende kopie bij was gekomen.
 */

import lightBlue from './light-blue.json';
import lightCyan from './light-cyan.json';
import lightGreen from './light-green.json';
import lightYellow from './light-yellow.json';
import lightOrange from './light-orange.json';
import lightPurple from './light-purple.json';
import lightRed from './light-red.json';
import lightMagenta from './light-magenta.json';

import fullBlue from './full-blue.json';
import fullCyan from './full-cyan.json';
import fullGreen from './full-green.json';
import fullYellow from './full-yellow.json';
import fullOrange from './full-orange.json';
import fullPurple from './full-purple.json';
import fullRed from './full-red.json';

/** Eén regel uit de tracklist van een mix. */
export interface Track {
    time: string;
    track: string;
}

export interface Mix {
    id: string;
    id_spotify: string;
    featured: boolean;
    ignore: boolean;
    title: string;
    title_spotify: string;
    genre: string;
    subgenre: string;
    bpm: number;
    color: string;
    power: string;
    frequency: string;
    volume: string;
    volume_spotify: number;
    date: string;
    jaar: string;
    maand: string;
    dag: string;
    /** De bron van de URL-slug. Zie `mixSlug()`; een lege of foute waarde levert géén pagina op. */
    permalink: string;
    audioSrc: string;
    image_wide_small: string;
    image_wide_large: string;
    image_square: string;
    description_nl?: string;
    description_en?: string;
    tags?: string[];
    top_artists?: string[];
    /** Aantal items in `tracklist`; vooraf geteld. De testsuite dwingt af dat de twee gelijk zijn. */
    tracks: number;
    tracklist: Track[];
}

/** Alle mixen uit alle bestanden, inclusief de preview-entries met `ignore: true`. */
export const allMixes: Mix[] = [
    ...lightBlue, ...lightCyan, ...lightGreen, ...lightYellow,
    ...lightOrange, ...lightPurple, ...lightRed, ...lightMagenta,
    ...fullBlue, ...fullCyan, ...fullGreen, ...fullYellow,
    ...fullOrange, ...fullPurple, ...fullRed,
] as Mix[];

/** Alleen wat live hoort te staan, nieuwste eerst. */
export const liveMixes: Mix[] = allMixes
    .filter((mix) => mix.ignore !== true)
    .sort((a, b) => b.id.localeCompare(a.id));

/**
 * De slug waaraan de routing hangt, afgeleid uit `permalink`.
 * `luister/mix/blue-full-f-DnB-176BPM-20240408.html` wordt `blue-full-f-dnb-176bpm-20240408`.
 */
export function mixSlug(mix: Pick<Mix, 'permalink'>): string {
    const filename = mix.permalink.split('/').pop() || '';
    return filename.split('.html')[0].toLowerCase().trim();
}

/**
 * De acht covers van de Music Mood Colours-pagina: per kleur de mix die als voorbeeld dient.
 *
 * Het filter is bewust `power === 'Light'` ÉN `featured`, en niet alleen `featured`. De drie
 * carousels op die pagina importeerden alleen de acht `light-*`-bestanden, dus "featured" betekende
 * daar impliciet ook "light". Gemeten op 2026-08-15 zijn alle acht featured entries inderdaad light
 * previews en staat er geen enkele in een `full-*`-bestand -- maar dat is een eigenschap van de data
 * van vandaag, niet van de regel. Zonder het power-filter zou een featured Full-mix die er ooit
 * bijkomt stilletjes een cover overnemen.
 */
export function featuredMixByColor(color: string): Mix | undefined {
    return allMixes.find(
        (mix) =>
            mix.color?.toLowerCase() === color.toLowerCase() &&
            mix.power === 'Light' &&
            mix.featured === true,
    );
}
