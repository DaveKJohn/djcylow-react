import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import AudioPlayer from '@/components/ui/AudioPlayer';
import BackButton from '@/components/ui/BackButton';
import MixAnalytics from '@/components/analytics/MixAnalytics';

// De vijftien JSON-bestanden, het Mix-type en de slug-afleiding komen uit één bron. Dit bestand had
// ze tot 2026-08-15 alle drie zelf overgeschreven, en de slug zelfs VIER keer -- twee daarvan mét
// `.toLowerCase().trim()` en twee zonder. Dat is geen schoonheidsfoutje: de routing hangt aan die
// slug, dus een vergelijking die anders normaliseert dan de generatie kan een pagina onvindbaar
// maken terwijl hij wel gebouwd is.
import { allMixes, mixSlug, type Track } from '@/data/mixes/all';

// Het `Mix`- en `Track`-type en de samengevoegde lijst stonden hier tot 2026-08-15 opnieuw
// gedefinieerd; ze komen nu uit `@/data/mixes/all` (zie de import hierboven).

// Vertelt Next.js dat er geen dynamische URL's bestaan buiten de vooraf gegenereerde lijst.
// Bij een onbekend pad geeft de site een 404 in plaats van het op de server te proberen.
export const dynamicParams = false;

/**
 * Zet een object om naar de inhoud van een `<script type="application/ld+json">`.
 *
 * WAAROM DIT NIET GEWOON `JSON.stringify` IS. Die escapet `</script>` niet. Staat die reeks in een
 * mix-titel of -beschrijving, dan sluit de browser de script-tag daar en leest hij de rest van de
 * JSON als HTML. Het vervangen van `<` door `<` sluit dat af: binnen een JSON-string is dat
 * dezelfde tekst, maar de HTML-parser ziet geen `<` meer.
 *
 * Waarom dit de moeite is terwijl de data uit de repo zelf komt: die grens is zwakker dan hij oogt.
 * `scripts/add-mix.js` laat de `description`-velden door een taalmodel genereren en schrijft die
 * rechtstreeks het datamodel in. Modeluitvoer is geen handgeschreven code, en dit is precies het
 * soort tekstveld waar zo'n reeks in kan belanden.
 *
 * De andere `dangerouslySetInnerHTML`-plekken in deze repo lezen uit `src/content/*.ts`, dat met de
 * hand geschreven is; daar is de grens wél hard en is deze behandeling niet nodig.
 */
function jsonLdScript(data: unknown) {
    return { __html: JSON.stringify(data).replace(/</g, '\\u003c') };
}

// Fallback: als top_artists leeg is, haal de eerste unieke artiesten op uit de tracklist.
// Niet ideaal (tracklist-volgorde ≠ populariteit) maar beter dan niets.
function getTopArtists(tracklist: Track[], limit = 5) {
    if (!Array.isArray(tracklist)) return '';
    const artists = tracklist.map(t => {
        const parts = t.track.split(' - ')[0];
        return parts.split(/[&,]/)[0].trim();
    });
    const uniqueArtists = Array.from(new Set(artists)).filter(Boolean);
    return uniqueArtists.slice(0, limit).join(', ');
}

// Zoek een mix op basis van de URL-slug (het stukje tekst achter /luister/mix/).
// Vergelijkt de slug uit de URL met de slug afgeleid uit het permalink-veld in de JSON.
function findMixBySlug(slug: string) {
    if (!slug) return undefined;

    const decodedIncomingSlug = decodeURIComponent(slug).toLowerCase().trim();

    return allMixes.find((m) => {
        if (!m || !m.permalink || m.ignore) return false;
        // `mixSlug` doet dezelfde drie bewerkingen als `generateStaticParams` hieronder -- dat is de
        // hele reden dat die functie bestaat. De decode blijft op de INKOMENDE slug staan (die komt
        // uit de URL en kan geëncodeerd zijn); de permalinks in de data zijn dat niet.
        return mixSlug(m) === decodedIncomingSlug;
    });
}

// Next.js roept deze functie aan tijdens het bouwen van de site.
// Het resultaat is een lijst van alle geldige URL-slugs — voor elke slug
// wordt bij de build alvast een statische HTML-pagina aangemaakt.
export async function generateStaticParams() {
    const params = allMixes
        .map((mix) => {
            if (!mix || !mix.permalink || mix.ignore) return null;

            const slug = mixSlug(mix);
            if (!slug) return null;

            return { slug };
        })
        .filter((param): param is { slug: string } => param !== null);

    return params;
}

// Genereert de SEO-metatags voor deze pagina: de <title>, description, Open Graph (voor
// linkpreviews op social media) en Twitter card. Next.js plaatst dit automatisch in de <head>.
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const mix = findMixBySlug(slug);

    if (!mix) return { title: 'Mix Niet Gevonden | DJ Cylow' };

    const titleText = `${mix.color} ${mix.subgenre} Mix ${mix.volume} | DJ Cylow`;

    // top_artists heeft prioriteit boven de tracklist-fallback
    const topArtists = mix.top_artists?.length ? mix.top_artists.join(', ') : getTopArtists(mix.tracklist, 4);

    // Gebruik de handgeschreven description als die bestaat; anders een automatisch gegenereerde tekst
    const descriptionText = mix.description_nl || `Beluister de ${mix.color} ${mix.subgenre} set (${mix.volume}) van DJ Cylow. Een dikke non-stop mix met tracks van o.a. ${topArtists}. Stream nu gratis!`;

    // Dezelfde afleiding als generateStaticParams gebruikt, zodat de canonieke URL gegarandeerd naar
    // een pagina wijst die ook echt gebouwd is.
    const pageUrl = `https://www.djcylow.com/luister/mix/${mixSlug(mix)}`;
    const ogImageUrl = mix.image_wide_large || '';

    return {
        metadataBase: new URL('https://www.djcylow.com'),
        title: titleText,
        description: descriptionText,
        keywords: mix.tags,     // Zoekwoorden uit het tags-veld in de JSON
        alternates: {
            canonical: pageUrl, // Vertelt Google wat de "officiële" URL van deze pagina is
        },
        openGraph: {
            // Open Graph = de preview die verschijnt als je de link deelt op Facebook, WhatsApp, etc.
            title: titleText,
            description: descriptionText,
            url: pageUrl,
            type: 'music.playlist',
            siteName: 'DJ Cylow',
            locale: 'en_US',
            images: ogImageUrl ? [{
                url: ogImageUrl,
                width: 1200,
                height: 630,
                alt: `${mix.color} ${mix.subgenre} Mix ${mix.volume} - DJ Cylow`,
            }] : [],
        },
        twitter: {
            // Twitter card = de preview die verschijnt als je de link deelt op X/Twitter
            card: 'summary_large_image',
            title: titleText,
            description: descriptionText,
            images: ogImageUrl ? [ogImageUrl] : [],
        },
    };
}

export default async function MixDetail({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const mix = findMixBySlug(slug);

    // Als de mix niet gevonden wordt (onbekende slug), toon een foutpagina
    if (!mix) {
        return (
            <main className="column spacing-3xl center v-push-7xl">
                <p>Mix niet gevonden.</p>
                <Link href="/luister" className="btn passive">Terug naar overzicht</Link>
            </main>
        );
    }

    // top_artists heeft prioriteit; als het veld leeg is valt het terug op de tracklist
    const topArtists = mix.top_artists?.length ? mix.top_artists.join(', ') : getTopArtists(mix.tracklist, 6);

    const pageUrl = `https://www.djcylow.com/luister/mix/${mixSlug(mix)}`;
    const mixDescription = mix.description_nl || `Beluister de ${mix.color} ${mix.subgenre} set van DJ Cylow met tracks van top artiesten.`;

    // JSON-LD = gestructureerde data die Google leest om rich results te tonen in de zoekresultaten
    // (bijv. een muziekkaart met artiestnamen, trackaantal en een directe luisterknop).
    // Dit blok beschrijft de mix als een MusicPlaylist volgens het schema.org-standaard.
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'MusicPlaylist',
        'name': `${mix.color} ${mix.subgenre} Mix ${mix.volume} - DJ Cylow`,
        'description': mixDescription,
        'numTracks': Array.isArray(mix.tracklist) ? mix.tracklist.length : 0,
        'genre': mix.subgenre,
        ...(mix.date && { 'datePublished': mix.date, 'dateModified': mix.date }),
        'image': `https://www.djcylow.com${mix.image_wide_large}`,
        'url': pageUrl,
        'isAccessibleForFree': true,
        ...(mix.tags && mix.tags.length > 0 && { 'keywords': mix.tags.join(', ') }),
        'creator': {
            '@type': 'Person',
            'name': 'DJ Cylow',
            'jobTitle': 'DJ',
            'url': 'https://www.djcylow.com',
        },
        // AudioObject vertelt Google dat er een beluisterbaar audiobestand aan deze pagina gekoppeld is
        'associatedMedia': {
            '@type': 'AudioObject',
            'contentUrl': mix.audioSrc,
            'encodingFormat': 'audio/mpeg',
        },
        // Elke track in de tracklist wordt als afzonderlijk MusicRecording-object meegestuurd
        'track': (Array.isArray(mix.tracklist) ? mix.tracklist : []).map((t, index) => {
            const artistPart = t.track ? t.track.split(' - ')[0] || 'Unknown Artist' : 'Unknown Artist';
            const trackPart = t.track ? t.track.split(' - ')[1] || t.track : 'Unknown Track';
            return {
                '@type': 'MusicRecording',
                'position': index + 1,
                'name': trackPart.trim(),
                'byArtist': {
                    '@type': 'Person',
                    'name': artistPart.trim(),
                },
            };
        }),
    };

    // BreadcrumbList = de "kruimelpad"-navigatie die Google toont in de zoekresultaten:
    // djcylow.com › Listen › Red Tech House Mix Vol. 6
    const breadcrumbLd = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        'itemListElement': [
            { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': 'https://www.djcylow.com' },
            { '@type': 'ListItem', 'position': 2, 'name': 'Listen', 'item': 'https://www.djcylow.com/luister' },
            { '@type': 'ListItem', 'position': 3, 'name': `${mix.color} ${mix.subgenre} Mix ${mix.volume}`, 'item': pageUrl },
        ],
    };

    return (
        <main className="luister mix">
            {/* JSON-LD structured data — onzichtbaar voor bezoekers, gelezen door Google.
                Via `jsonLdScript` en niet via een kale `JSON.stringify`: zie de toelichting bij die
                functie bovenaan dit bestand. */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={jsonLdScript(jsonLd)}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={jsonLdScript(breadcrumbLd)}
            />

            {/* Stuurt mix-gegevens naar Google Analytics zodat je kunt zien welke mixen bekeken worden */}
            <MixAnalytics
                id={mix.id}
                title={`${mix.color} ${mix.subgenre} Mix ${mix.volume}`}
                power={mix.power}
                color={mix.color}
                genre={mix.genre}
                subgenre={mix.subgenre || ''}
                volume={mix.volume}
            />

            <section className="WoB column w-fill AML P15 fill-100 v-push-3xl" id="luister_mix">
                <div className="column w-fill AML P20 ">
                    <div className="column AML constrainer">
                        <div className="column w-fill AML P30 spacing-3xl">

                            <div className="column w-hug AML P35 return-wrapper">
                                <BackButton />
                            </div>

                            {/* Titel */}
                            <div className="column w-hug AML P35 header">
                                <h1>
                                    {mix.color} {mix.subgenre} Mix {mix.volume}
                                </h1>
                            </div>

                            <div className="column w-fill AML P35">
                                <AudioPlayer
                                    id={mix.id}
                                    src={mix.audioSrc}
                                    image={mix.image_wide_large}
                                    showVolumeSlider={true}
                                    className={mix.color?.toLowerCase()}
                                />
                            </div>






                            {/* Beschrijving: toon de handgeschreven tekst uit de JSON als die bestaat,
                                anders een automatisch gegenereerde fallback-tekst */}
                            <div className="column w-fill AML P35 seo-description">

                                {mix.jaar && (
                                    <p className="size-base bold">
                                        {/* <time> met dateTime helpt zoekmachines de datum correct te lezen */}
                                        <time dateTime={mix.date}>{mix.dag} {mix.maand}, {mix.jaar}</time>
                                    </p>
                                )}
                                {mix.description_nl ? (
                                    <p className="size-base">{mix.description_nl}</p>
                                ) : (
                                    <p className="size-base">
                                        Ben je op zoek naar een energieke {mix.subgenre} mix? In <strong>{mix.color} {mix.volume}</strong> brengt
                                        DJ Cylow een vloeiende, non-stop selectie van de beste tracks van dit moment.
                                        Deze set heeft een <strong>{mix.power}</strong> feel en is perfect geschikt voor tijdens het streamen, sporten of je pre-party.
                                        {topArtists && <span> Geniet van unieke overgangen en platen van topproducers zoals <em>{topArtists}</em> en vele anderen.</span>}
                                    </p>
                                )}
                            </div>

                            {/* Gestructureerde feitenblok — duidelijk leesbaar voor zowel bezoekers als AI-zoekmachines */}
                            <div className="column w-fill AML P35 key-facts">


                                {/* <dl> = description list: semantisch HTML voor sleutel-waarde-paren.
                                    Zoekmachines en AI-crawlers herkennen <dt> (term) + <dd> (waarde)
                                    als gestructureerde feitenparen — beter dan een generieke <div> met tekst. */}
                                <dl className="row spacing-5xl">

                                    <div>
                                        <dt className="size-xs">Colour</dt>
                                        <dd className="size-sm">{mix.color}</dd>
                                    </div>
                                    <div>
                                        <dt className="size-xs">Shade</dt>
                                        <dd className="size-sm">{mix.power} {mix.frequency}</dd>
                                    </div>

                                    <div>
                                        <dt className="size-xs">Subgenre</dt>
                                        <dd className="size-sm">{mix.subgenre}</dd>
                                    </div>

                                    <div>
                                        <dt className="size-xs">Tracks</dt>
                                        <dd className="size-sm">{Array.isArray(mix.tracklist) ? mix.tracklist.length : '—'}</dd>
                                    </div>
                                </dl>
                            </div>



                            {/* Tracklist als tabel: linkerkolom = artiest + titel, rechterkolom = tijdcode */}
                            <div className="column w-hug AML P35 spacing-xl tracklist">
                                <div className="row text-wrapper">
                                    <div className="column text-wrapper h-start header">
                                        <h2 className="size-lg bold">Tracklist</h2>
                                    </div>
                                </div>

                                <table>
                                    <tbody>
                                        {Array.isArray(mix.tracklist) && mix.tracklist.length > 0 ? (
                                            mix.tracklist.map((track: Track, index: number) => (
                                                <tr key={index}>
                                                    <td className="track">{track.track}</td>
                                                    <td className="time">{track.time}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={2} className="size-xs italic">Geen tracklist beschikbaar</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>

                                <div className="seo-disclaimer">
                                    <p><strong>Disclaimer:</strong> All music rights belong to their respective owners. Support the artists featured in this DJ Cylow {mix.subgenre} mix by buying their tracks.</p>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
