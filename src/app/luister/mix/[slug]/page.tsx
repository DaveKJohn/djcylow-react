import React from 'react';
import Link from 'next/link';
import mixesData from '@/data/mixes.json';
import AudioPlayer from '@/components/ui/AudioPlayer';
import BackButton from '@/components/ui/BackButton'; // Die maken we hieronder even

import '@/styles/pages/_luister_mix.scss';

// 1. De Statische Params (geen verandering nodig, behalve import naam)
export async function generateStaticParams() {
    return mixesData.map((mix) => ({
        slug: mix.permalink.split('/').pop(), // We pakken alleen het laatste deel van de url
    }));
}

// 2. De Pagina (nu een Server Component)
export default async function MixDetail({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    // We zoeken de mix op basis van de slug
    const mix = mixesData.find((m) => m.permalink.endsWith(slug)) as any;

    if (!mix) {
        return (
            <main className="column wrapper spacing-m center v-push-m">
                <p>Mix niet gevonden.</p>
                <Link href="/luister" className="btn passive">Terug naar overzicht</Link>
            </main>
        );
    }

    return (
        <main className="luister mix">
            <section className="column text-wrapper WoB">
                <div className="column constrainer">
                    <div className="column wrapper spacing-m v-push-m">

                        <div className="column wrapper spacing-xs h-start return-wrapper">
                            {/* De terug-knop moet Client-side zijn, dus die zetten we in een component */}
                            <BackButton />
                        </div>

                        <div className="column text-wrapper header">
                            <h1 className="uppercase">
                                {mix.color} {mix.genre === 'edm' ? 'EDM' : 'D&B'} Mix {mix.power} {mix.frequency} · {mix.volume}
                            </h1>
                        </div>

                        <div className="column stack wrapper spacing-l audioplayer-wrapper"
                            data-color={mix.color?.toLowerCase()}
                            data-genre={mix.genre?.toLowerCase()}
                            data-power={mix.power?.toLowerCase()}
                            data-id={mix.id}>
                            <AudioPlayer
                                id={mix.id}
                                src={mix.audioSrc}
                                image={mix.image_wide_1200px || mix.image}
                                showVolumeSlider={true}
                            />
                        </div>

                        {/* TRACKLIST */}
                        <div className="column text-wrapper spacing-xs tracklist">
                            <div className="row text-wrapper">
                                <div className="column text-wrapper h-start header">
                                    <h3 className="size-s bold">Tracklist</h3>
                                </div>
                                {mix.spotify_url && (
                                    <div className="column text-wrapper h-end">
                                        <a href={mix.spotify_url} target="_blank" rel="noopener noreferrer" className="row center gap-xs">
                                            {/* ... SVG icoon ... */}
                                            <span className="size-s">Bekijk op Spotify</span>
                                        </a>
                                    </div>
                                )}
                            </div>
                            <div className="column text-wrapper table v-push-xs">
                                <table>
                                    <tbody>
                                        {/* Check of tracklist bestaat EN een array is */}
                                        {Array.isArray(mix.tracklist) ? (
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