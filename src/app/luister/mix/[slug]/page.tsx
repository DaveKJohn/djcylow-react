import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import AudioPlayer from '@/components/ui/AudioPlayer';
import BackButton from '@/components/ui/BackButton';
import MixAnalytics from '@/components/analytics/MixAnalytics';

// Alle JSON-bestanden met mix-data inladen (één bestand per kleur + power-combinatie)
import lightBlue from '@/data/mixes/light-blue.json';
import lightCyan from '@/data/mixes/light-cyan.json';
import lightGreen from '@/data/mixes/light-green.json';
import lightMagenta from '@/data/mixes/light-magenta.json';
import lightOrange from '@/data/mixes/light-orange.json';
import lightPurple from '@/data/mixes/light-purple.json';
import lightRed from '@/data/mixes/light-red.json';
import lightYellow from '@/data/mixes/light-yellow.json';

import fullBlue from '@/data/mixes/full-blue.json';
import fullCyan from '@/data/mixes/full-cyan.json';
import fullGreen from '@/data/mixes/full-green.json';
import fullOrange from '@/data/mixes/full-orange.json';
import fullPurple from '@/data/mixes/full-purple.json';
import fullRed from '@/data/mixes/full-red.json';
import fullYellow from '@/data/mixes/full-yellow.json';

// Interface = een beschrijving van welke velden een mix-object heeft en wat voor type data erin zit.
// TypeScript gebruikt dit om fouten te vangen als je een veld verkeerd gebruikt.
interface Mix {
    id: string;
    featured: boolean;
    ignore: boolean;
    title: string;
    genre: string;
    subgenre: string;
    color: string;
    power: string;
    frequency: string;
    volume: string;
    date: string;
    jaar: string;
    maand: string;
    dag: string;
    permalink: string;
    audioSrc: string;
    image_wide_small: string;
    image_wide_large: string;
    image_square: string;
    description?: string;       // ? = optioneel veld (hoeft niet ingevuld te zijn)
    tags?: string[];            // ? = optioneel veld
    top_artists?: string[];     // ? = optioneel veld
    tracklist: { time: string; track: string }[];
}

// Alle losse JSON-arrays samenvoegen tot één grote lijst met alle mixen.
// De ... (spread-operator) pakt alle items uit een array en plakt ze erin.
const allMixes: Mix[] = [
    ...lightBlue, ...lightCyan, ...lightGreen, ...lightYellow, ...lightOrange, ...lightRed, ...lightMagenta, ...lightPurple,
    ...fullBlue, ...fullCyan, ...fullGreen, ...fullYellow, ...fullOrange, ...fullRed, ...fullPurple
] as any;

// Vertelt Next.js dat er geen dynamische URL's bestaan buiten de vooraf gegenereerde lijst.
// Bij een onbekend pad geeft de site een 404 in plaats van het op de server te proberen.
export const dynamicParams = false;

// Fallback: als top_artists leeg is, haal de eerste unieke artiesten op uit de tracklist.
// Niet ideaal (tracklist-volgorde ≠ populariteit) maar beter dan niets.
function getTopArtists(tracklist: any[], limit = 5) {
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

        const filename = m.permalink.split('/').pop() || '';
        const pureSlug = filename.split('.html')[0];
        const cleanCurrentSlug = decodeURIComponent(pureSlug).toLowerCase().trim();

        return cleanCurrentSlug === decodedIncomingSlug;
    });
}

// Next.js roept deze functie aan tijdens het bouwen van de site.
// Het resultaat is een lijst van alle geldige URL-slugs — voor elke slug
// wordt bij de build alvast een statische HTML-pagina aangemaakt.
export async function generateStaticParams() {
    const params = allMixes
        .map((mix) => {
            if (!mix || !mix.permalink || mix.ignore) return null;

            const filename = mix.permalink.split('/').pop() || '';
            const pureSlug = filename.split('.html')[0];

            if (!pureSlug || pureSlug.trim() === '') return null;

            return {
                slug: decodeURIComponent(pureSlug).toLowerCase().trim(),
            };
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

    const titleText = `${mix.color} ${mix.subgenre || mix.genre} Mix ${mix.volume} | DJ Cylow`;

    // top_artists heeft prioriteit boven de tracklist-fallback
    const topArtists = mix.top_artists?.length ? mix.top_artists.join(', ') : getTopArtists(mix.tracklist, 4);

    // Gebruik de handgeschreven description als die bestaat; anders een automatisch gegenereerde tekst
    const descriptionText = mix.description || `Beluister de ${mix.color} ${mix.subgenre || mix.genre} set (${mix.volume}) van DJ Cylow. Een dikke non-stop mix met tracks van o.a. ${topArtists}. Stream nu gratis!`;

    // Zet de .html-extensie om naar een schone slug voor de canonieke URL
    const cleanFilename = mix.permalink.split('/').pop() || '';
    const cleanSlug = cleanFilename.split('.html')[0].toLowerCase().trim();
    const pageUrl = `https://www.djcylow.com/luister/mix/${cleanSlug}`;
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
                alt: `${mix.color} ${mix.subgenre || mix.genre} Mix ${mix.volume} - DJ Cylow`,
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

    const cleanFilename = mix.permalink.split('/').pop() || '';
    const cleanSlug = cleanFilename.split('.html')[0].toLowerCase().trim();
    const pageUrl = `https://www.djcylow.com/luister/mix/${cleanSlug}`;
    const mixDescription = mix.description || `Beluister de ${mix.color} ${mix.subgenre || mix.genre} set van DJ Cylow met tracks van top artiesten.`;

    // JSON-LD = gestructureerde data die Google leest om rich results te tonen in de zoekresultaten
    // (bijv. een muziekkaart met artiestnamen, trackaantal en een directe luisterknop).
    // Dit blok beschrijft de mix als een MusicPlaylist volgens het schema.org-standaard.
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'MusicPlaylist',
        'name': `${mix.color} ${mix.subgenre || mix.genre} Mix ${mix.volume} - DJ Cylow`,
        'description': mixDescription,
        'numTracks': Array.isArray(mix.tracklist) ? mix.tracklist.length : 0,
        'genre': mix.subgenre || mix.genre,
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
            { '@type': 'ListItem', 'position': 3, 'name': `${mix.color} ${mix.subgenre || mix.genre} Mix ${mix.volume}`, 'item': pageUrl },
        ],
    };

    return (
        <main className="luister mix">
            {/* JSON-LD structured data — onzichtbaar voor bezoekers, gelezen door Google */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
            />

            {/* Stuurt mix-gegevens naar Google Analytics zodat je kunt zien welke mixen bekeken worden */}
            <MixAnalytics
                id={mix.id}
                title={`${mix.color} ${mix.genre} Mix ${mix.volume}`}
                power={mix.power}
                color={mix.color}
                genre={mix.genre}
                subgenre={mix.subgenre || ''}
                volume={mix.volume}
            />

            <section className="WoB column w-fill AML P15 fill-100 v-push-3xl" id="luister_mix">
                <div className="column w-fill AML P20 ">
                    <div className="column w-fix AML constrainer">
                        <div className="column w-fill AML P30 spacing-3xl">

                            <div className="column w-hug AML P35 return-wrapper">
                                <BackButton />
                            </div>

                            {/* Titel, energieniveau en publicatiedatum */}
                            <div className="column w-hug AML P35 header">
                                <h1 className="uppercase">
                                    {mix.color} {mix.subgenre || mix.genre} Mix {mix.volume}
                                </h1>
                                <p className="size-sm uppercase">{mix.power} Energy{mix.frequency ? ` · ${mix.frequency}` : ''}</p>
                                {mix.jaar && (
                                    <p className="size-xs">
                                        {/* <time> met dateTime helpt zoekmachines de datum correct te lezen */}
                                        <time dateTime={mix.date}>{mix.dag} {mix.maand} {mix.jaar}</time>
                                    </p>
                                )}
                            </div>

                            {/* Gestructureerde feitenblok — duidelijk leesbaar voor zowel bezoekers als AI-zoekmachines */}
                            <div className="column w-fill AML P35 key-facts">
                                <dl className="row spacing-xl">
                                    <div>
                                        <dt className="size-xs uppercase">Genre</dt>
                                        <dd className="size-sm">{mix.subgenre || mix.genre}</dd>
                                    </div>
                                    <div>
                                        <dt className="size-xs uppercase">Energy</dt>
                                        <dd className="size-sm">{mix.power}</dd>
                                    </div>
                                    <div>
                                        <dt className="size-xs uppercase">Tracks</dt>
                                        <dd className="size-sm">{Array.isArray(mix.tracklist) ? mix.tracklist.length : '—'}</dd>
                                    </div>
                                </dl>
                            </div>

                            {/* Beschrijving: toon de handgeschreven tekst uit de JSON als die bestaat,
                                anders een automatisch gegenereerde fallback-tekst */}
                            <div className="column w-fill AML P35 seo-description">
                                {mix.description ? (
                                    <p className="size-base">{mix.description}</p>
                                ) : (
                                    <p className="size-base">
                                        Ben je op zoek naar een energieke {mix.subgenre || mix.genre} mix? In <strong>{mix.color} {mix.volume}</strong> brengt
                                        DJ Cylow een vloeiende, non-stop selectie van de beste tracks van dit moment.
                                        Deze set heeft een <strong>{mix.power}</strong> feel en is perfect geschikt voor tijdens het streamen, sporten of je pre-party.
                                        {topArtists && <span> Geniet van unieke overgangen en platen van top-producers zoals <em>{topArtists}</em> en vele anderen.</span>}
                                    </p>
                                )}
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

                            {/* Tracklist als tabel: linkerkolom = artiest + titel, rechterkolom = tijdcode */}
                            <div className="column w-hug AML P35 spacing-xl tracklist">
                                <div className="row text-wrapper">
                                    <div className="column text-wrapper h-start header">
                                        <h2 className="size-lg bold uppercase">
                                            Tracklist {mix.color} {mix.genre} Mix
                                        </h2>
                                    </div>
                                </div>

                                <table>
                                    <tbody>
                                        {Array.isArray(mix.tracklist) && mix.tracklist.length > 0 ? (
                                            mix.tracklist.map((track: any, index: number) => (
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
                                    <p><strong>Disclaimer:</strong> All music rights belong to their respective owners. Support the artists featured in this DJ Cylow {mix.genre} mix by buying their tracks.</p>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
