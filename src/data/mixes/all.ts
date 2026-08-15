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

export interface Mix {
    id: string;
    ignore: boolean;
    color: string;
    genre: string;
    subgenre: string;
    power: string;
    frequency: string;
    volume: string;
    audioSrc: string;
    image_wide_small: string;
    permalink: string;
    maand: string;
    dag: string;
    jaar: string;
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
