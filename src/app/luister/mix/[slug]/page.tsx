import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import AudioPlayer from '@/components/ui/AudioPlayer';
import BackButton from '@/components/ui/BackButton';
import MixAnalytics from '@/components/analytics/MixAnalytics';

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
    description?: string;
    tags?: string[];
    tracklist: { time: string; track: string }[];
}

const allMixes: Mix[] = [
    ...lightBlue, ...lightCyan, ...lightGreen, ...lightYellow, ...lightOrange, ...lightRed, ...lightMagenta, ...lightPurple,
    ...fullBlue, ...fullCyan, ...fullGreen, ...fullYellow, ...fullOrange, ...fullRed, ...fullPurple
] as any;

export const dynamicParams = false;

function getTopArtists(tracklist: any[], limit = 5) {
    if (!Array.isArray(tracklist)) return '';
    const artists = tracklist.map(t => {
        const parts = t.track.split(' - ')[0];
        return parts.split(/[&,]/)[0].trim();
    });
    const uniqueArtists = Array.from(new Set(artists)).filter(Boolean);
    return uniqueArtists.slice(0, limit).join(', ');
}

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

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const mix = findMixBySlug(slug);

    if (!mix) return { title: 'Mix Niet Gevonden | DJ Cylow' };

    const colorName = mix.color.charAt(0).toUpperCase() + mix.color.slice(1);
    const genreLabel = mix.subgenre || mix.genre;
    const titleText = `${colorName} ${genreLabel} Mix ${mix.volume} | DJ Cylow`;
    const topArtists = getTopArtists(mix.tracklist, 4);

    const descriptionText = mix.description || `Beluister de ${colorName} ${genreLabel} set (${mix.volume}) van DJ Cylow. Een dikke non-stop mix met tracks van o.a. ${topArtists}. Stream nu gratis!`;

    const cleanFilename = mix.permalink.split('/').pop() || '';
    const cleanSlug = cleanFilename.split('.html')[0].toLowerCase().trim();
    const pageUrl = `https://www.djcylow.com/luister/mix/${cleanSlug}`;
    const ogImageUrl = mix.image_wide_large || '';

    return {
        metadataBase: new URL('https://www.djcylow.com'),
        title: titleText,
        description: descriptionText,
        keywords: mix.tags,
        alternates: {
            canonical: pageUrl,
        },
        openGraph: {
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
                alt: `${colorName} ${genreLabel} Mix ${mix.volume} - DJ Cylow`,
            }] : [],
        },
        twitter: {
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

    if (!mix) {
        return (
            <main className="column spacing-3xl center v-push-7xl">
                <p>Mix niet gevonden.</p>
                <Link href="/luister" className="btn passive">Terug naar overzicht</Link>
            </main>
        );
    }

    const colorName = mix.color.charAt(0).toUpperCase() + mix.color.slice(1);
    const genreLabel = mix.subgenre || mix.genre;
    const topArtists = getTopArtists(mix.tracklist, 6);

    const cleanFilename = mix.permalink.split('/').pop() || '';
    const cleanSlug = cleanFilename.split('.html')[0].toLowerCase().trim();
    const pageUrl = `https://www.djcylow.com/luister/mix/${cleanSlug}`;
    const mixDescription = mix.description || `Beluister de ${colorName} ${genreLabel} set van DJ Cylow met tracks van top artiesten.`;

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'MusicPlaylist',
        'name': `${colorName} ${genreLabel} Mix ${mix.volume} - DJ Cylow`,
        'description': mixDescription,
        'numTracks': Array.isArray(mix.tracklist) ? mix.tracklist.length : 0,
        'genre': genreLabel,
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
        'associatedMedia': {
            '@type': 'AudioObject',
            'contentUrl': mix.audioSrc,
            'encodingFormat': 'audio/mpeg',
        },
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

    const breadcrumbLd = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        'itemListElement': [
            { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': 'https://www.djcylow.com' },
            { '@type': 'ListItem', 'position': 2, 'name': 'Listen', 'item': 'https://www.djcylow.com/luister' },
            { '@type': 'ListItem', 'position': 3, 'name': `${colorName} ${genreLabel} Mix ${mix.volume}`, 'item': pageUrl },
        ],
    };

    return (
        <main className="luister mix">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
            />
            <MixAnalytics
                id={mix.id}
                title={`${colorName} ${mix.genre} Mix ${mix.volume}`}
                power={mix.power}
                color={colorName}
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

                            <div className="column w-hug AML P35 header">
                                <h1 className="uppercase">
                                    {colorName} {genreLabel} Mix {mix.volume}
                                </h1>
                                <p className="size-sm uppercase">{mix.power} Energy{mix.frequency ? ` · ${mix.frequency}` : ''}</p>
                                {mix.jaar && (
                                    <p className="size-xs">
                                        <time dateTime={mix.date}>{mix.dag} {mix.maand} {mix.jaar}</time>
                                    </p>
                                )}
                            </div>

                            <div className="column w-fill AML P35 key-facts">
                                <dl className="row spacing-xl">
                                    <div>
                                        <dt className="size-xs uppercase">Genre</dt>
                                        <dd className="size-sm">{genreLabel}</dd>
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

                            <div className="column w-fill AML P35 seo-description">
                                {mix.description ? (
                                    <p className="size-base">{mix.description}</p>
                                ) : (
                                    <p className="size-base">
                                        Ben je op zoek naar een energieke {genreLabel} mix? In <strong>{colorName} {mix.volume}</strong> brengt
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

                            <div className="column w-hug AML P35 spacing-xl tracklist">
                                <div className="row text-wrapper">
                                    <div className="column text-wrapper h-start header">
                                        <h2 className="size-lg bold uppercase">
                                            Tracklist {colorName} {mix.genre} Mix
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