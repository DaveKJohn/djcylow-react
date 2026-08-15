/**
 * Klantreferenties voor de (nu uitgeschakelde) Referenties-sectie op de homepage.
 *
 * DIT BESTAND IS BEWUST LEEG, EN DAT IS EEN VEILIGHEIDSMAATREGEL.
 *
 * Tot 2026-08-15 stonden hier vier plaatsvullers: "Klant Naam", "Bedrijfsnaam", "Nieuwe Partner",
 * "Tech Start-up", met teksten als *"Hier komt de getuigenis of referentie tekst te staan over de
 * samenwerking. Het formaat is exact 300 bij 300 pixels."* en tags als "React" en "Next.js" — die bij
 * een webbureau horen en niet bij een DJ.
 *
 * Ze stonden niet live, want `<Referenties />` is uitgecommentarieerd in `src/app/page.tsx`. Maar
 * `CLAUDE.md` en `README.md` beschrijven dit bestand als "de referenties", dus wie die sectie ooit
 * aanzet, publiceert in één handeling vier neptestimonials op een boekingssite. Dat is geen
 * theoretisch risico: de sectie aanzetten is één regel uncommenten, en niets zou waarschuwen.
 *
 * Een lege array kan dat niet. De carousel rendert dan niets, en dat is de eerlijke weergave van
 * "er zijn nog geen referenties" — in plaats van verzonnen citaten die er echt uitzien.
 *
 * ZET HIER PAS IETS IN ALS HET ECHTE KLANTCITATEN ZIJN, met toestemming van de klant om ze te
 * publiceren. De vorm staat hieronder in het type; `tags` beschrijft het soort klus (bijvoorbeeld
 * "Bruiloft", "Bedrijfsfeest") en niet een technologie.
 */
export interface Referentie {
    id: number;
    /** De naam van de klant zoals die gepubliceerd mag worden. */
    client: string;
    /** Het citaat zelf, in de woorden van de klant. */
    text: string;
    /** Het soort opdracht, bijvoorbeeld ["Bruiloft"] of ["Bedrijfsfeest"]. */
    tags: string[];
}

export const referentiesData: Referentie[] = [];
