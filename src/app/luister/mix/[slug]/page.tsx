import React from 'react';
import Link from 'next/link';
import AudioPlayer from '@/components/ui/AudioPlayer';
import BackButton from '@/components/ui/BackButton';
import '@/styles/pages/_luister_mix.scss';

import lightBlue from '@/data/mixes/light-blue.json';
import lightCyan from '@/data/mixes/light-cyan.json';
import lightGreen from '@/data/mixes/light-green.json';
import lightYellow from '@/data/mixes/light-yellow.json';
import lightOrange from '@/data/mixes/light-orange.json';
import lightRed from '@/data/mixes/light-red.json';
import lightMagenta from '@/data/mixes/light-magenta.json';

import fullBlue from '@/data/mixes/full-blue.json';
import fullCyan from '@/data/mixes/full-cyan.json';
import fullGreen from '@/data/mixes/full-green.json';
import fullYellow from '@/data/mixes/full-yellow.json';
import fullOrange from '@/data/mixes/full-orange.json';
import fullRed from '@/data/mixes/full-red.json';

const allMixes = [
    ...lightBlue, ...lightCyan, ...lightGreen, ...lightYellow, ...lightOrange, ...lightRed, ...lightMagenta,
    ...fullBlue, ...fullCyan, ...fullGreen, ...fullYellow, ...fullOrange, ...fullRed
];

// 1. De Statische Params (geen verandering nodig, behalve import naam)
export async function generateStaticParams() {
    return allMixes.map((mix) => ({
        slug: mix.permalink.split('/').pop(),
    }));
}

// 2. De Pagina (nu een Server Component)
export default async function MixDetail({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    // Zoek de mix in de gecombineerde array
    const mix = allMixes.find((m) => m.permalink.endsWith(slug));

    if (!mix) {
        return (
            <main className="column wrapper spacing-3xl center v-push-7xl">
                <p>Mix niet gevonden.</p>
                <Link href="/luister" className="btn passive">Terug naar overzicht</Link>
            </main>
        );
    }

    return (
        <main className="luister mix">
            <section className="column text-wrapper WoB">
                <div className="column constrainer">
                    <div className="column wrapper spacing-5xl v-push-6xl">

                        <div className="column wrapper spacing-3xl h-start return-wrapper">
                            <BackButton />
                        </div>

                        <div className="column text-wrapper header">
                            <h1 className="uppercase">
                                {mix.color.charAt(0).toUpperCase() + mix.color.slice(1)} {mix.genre === 'edm' ? 'EDM' : 'D&B'} Mix {mix.power} {mix.frequency} · {mix.volume}
                            </h1>
                        </div>

                        <AudioPlayer
                            id={mix.id}
                            src={mix.audioSrc}
                            image={mix.image} // We gebruiken de image uit de JSON
                            showVolumeSlider={true}
                            className={mix.color?.toLowerCase()}
                        />

                        {/* TRACKLIST */}
                        <div className="column text-wrapper spacing-xl tracklist">
                            <div className="row text-wrapper">
                                <div className="column text-wrapper h-start header">
                                    <h3 className="size-base bold">Tracklist</h3>
                                </div>
                                {/* Spotify link logica blijft gelijk */}
                            </div>
                            <div className="column text-wrapper table v-push-xs">
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
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}