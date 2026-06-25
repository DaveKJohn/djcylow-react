import React from 'react';
import { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import AudioPlayer from '@/components/ui/AudioPlayer';
import BackButton from '@/components/ui/BackButton';

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
    const slugs = allMixes
        .map((mix) => {
            if (!mix || !mix.permalink || mix.ignore) return null;
            const filename = mix.permalink.split('/').pop() || '';
            const pureSlug = filename.split('.html')[0];
            if (!pureSlug || pureSlug.trim() === '') return null;
            return { slug: decodeURIComponent(pureSlug).toLowerCase().trim() };
        })
        .filter((param): param is { slug: string } => param !== null);

    return slugs;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
    const { locale, slug } = await params;
    const mix = findMixBySlug(slug);

    if (!mix) return { title: 'Mix Not Found | DJ Cylow' };

    const colorName = mix.color.charAt(0).toUpperCase() + mix.color.slice(1);
    const titleText = `${colorName} ${mix.genre} Mix ${mix.volume} (${mix.power} Energy) | DJ Cylow`;
    const topArtists = getTopArtists(mix.tracklist, 4);
    const descriptionText = mix.description || `Listen to the ${colorName} ${mix.genre} set (${mix.volume}) by DJ Cylow. A non-stop mix featuring ${topArtists}. Stream free now!`;

    const cleanFilename = mix.permalink.split('/').pop() || '';
    const cleanSlug = cleanFilename.split('.html')[0].toLowerCase().trim();
    const pageUrl = `https://www.djcylow.com/${locale}/luister/mix/${cleanSlug}`;

    return {
        metadataBase: new URL('https://www.djcylow.com'),
        title: titleText,
        description: descriptionText,
        alternates: { canonical: pageUrl },
        openGraph: {
            title: titleText,
            description: descriptionText,
            url: pageUrl,
            type: 'music.playlist',
            images: mix.image_wide_large ? [{ url: mix.image_wide_large }] : [],
        },
    };
}

export default async function MixDetail({ params }: { params: Promise<{ locale: string; slug: string }> }) {
    const { locale, slug } = await params;
    setRequestLocale(locale);
    const t = await getTranslations('mix');
    const tc = await getTranslations('common');

    const mix = findMixBySlug(slug);

    if (!mix) {
        return (
            <main className="column spacing-3xl center v-push-7xl">
                <p>{t('notFound')}</p>
                <Link href="/luister" className="btn passive">{tc('backToOverview')}</Link>
            </main>
        );
    }

    const colorName = mix.color.charAt(0).toUpperCase() + mix.color.slice(1);
    const topArtists = getTopArtists(mix.tracklist, 6);

    const cleanFilename = mix.permalink.split('/').pop() || '';
    const cleanSlug = cleanFilename.split('.html')[0].toLowerCase().trim();

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'MusicPlaylist',
        'name': `${colorName} ${mix.genre} Mix ${mix.volume} - DJ Cylow`,
        'description': mix.description || `Listen to the ${colorName} ${mix.genre} set by DJ Cylow.`,
        'numTracks': Array.isArray(mix.tracklist) ? mix.tracklist.length : 0,
        'genre': mix.subgenre || mix.genre,
        ...(mix.date && { 'datePublished': mix.date }),
        'image': `https://www.djcylow.com${mix.image_wide_large}`,
        'url': `https://www.djcylow.com/${locale}/luister/mix/${cleanSlug}`,
        'creator': {
            '@type': 'Person',
            'name': 'DJ Cylow',
            'url': 'https://www.djcylow.com'
        },
        'track': (Array.isArray(mix.tracklist) ? mix.tracklist : []).map((t, index) => {
            const artistPart = t.track ? t.track.split(' - ')[0] || 'Unknown Artist' : 'Unknown Artist';
            const trackPart = t.track ? t.track.split(' - ')[1] || t.track : 'Unknown Track';
            return {
                '@type': 'MusicRecording',
                'position': index + 1,
                'name': trackPart.trim(),
                'byArtist': { '@type': 'MusicGroup', 'name': artistPart.trim() }
            };
        })
    };

    return (
        <main className="luister mix">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

            <section className="WoB column w-fill AML P15 fill-100 v-push-3xl" id="luister_mix">
                <div className="column w-fill AML P20">
                    <div className="column w-fix AML constrainer">
                        <div className="column w-fill AML P30 spacing-3xl">

                            <div className="column w-hug AML P35 return-wrapper">
                                <BackButton />
                            </div>

                            <div className="column w-hug AML P35 header">
                                <h1 className="uppercase">
                                    {colorName} {mix.genre} Mix {mix.power} {mix.frequency} · {mix.volume}
                                </h1>
                                {mix.subgenre && (
                                    <p className="size-sm uppercase">{mix.subgenre}</p>
                                )}
                                {mix.jaar && (
                                    <p className="size-xs">{mix.dag} {mix.maand} {mix.jaar}</p>
                                )}
                            </div>

                            <div className="column w-fill AML P35 seo-description">
                                <p className="size-base">
                                    {t('seoIntro', { genre: mix.genre, title: `${colorName} ${mix.volume}`, power: mix.power })}
                                    {topArtists && <span> {t('seoArtists', { artists: topArtists })}</span>}
                                </p>
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
                                            {t('tracklist')} {colorName} {mix.genre} Mix
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
                                                <td colSpan={2} className="size-xs italic">{t('noTracklist')}</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>

                                <div className="seo-disclaimer">
                                    <p><strong>{t('disclaimerTitle')}:</strong> {t('disclaimerText', { genre: mix.genre })}</p>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
