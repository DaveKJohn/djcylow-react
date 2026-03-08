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
                                {mix.color.charAt(0).toUpperCase() + mix.color.slice(1)} {mix.genre === 'edm' ? 'EDM' : 'D&B'} Mix {mix.power} {mix.frequency} · {mix.volume}
                            </h1>
                        </div>

                        <AudioPlayer
                            id={mix.id}
                            src={mix.audioSrc}
                            image={mix.image_wide_1200px || mix.image}
                            showVolumeSlider={true}
                            className={mix.color?.toLowerCase()}
                        />

                        {/* TRACKLIST */}
                        <div className="column text-wrapper spacing-xs tracklist">
                            <div className="row text-wrapper">
                                <div className="column text-wrapper h-start header">
                                    <h3 className="size-s bold">Tracklist</h3>
                                </div>
                                {mix.spotify_url && (
                                    <div className="column text-wrapper h-end">
                                        <a href={mix.spotify_url} target="_blank" rel="noopener noreferrer" className="row center gap-xs">
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.49 17.306c-.215.353-.674.463-1.025.249-2.856-1.745-6.45-2.14-10.683-1.173-.404.092-.81-.158-.902-.562-.092-.403.158-.81.562-.902 4.636-1.06 8.61-.6 11.798 1.348.351.214.462.673.25 1.03zm1.467-3.258c-.27.44-.847.58-1.287.31-3.267-2.007-8.25-2.59-12.113-1.417-.497.15-1.022-.128-1.173-.626-.15-.498.13-1.023.627-1.173 4.417-1.34 9.914-.688 13.637 1.6 0 .001.44.27.51.806zm.126-3.39c-3.92-2.328-10.374-2.543-14.135-1.402-.6.182-1.242-.164-1.424-.764-.182-.6.164-1.242.764-1.424 4.314-1.31 11.44-1.055 15.952 1.625.538.32.713 1.018.393 1.556-.32.538-1.018.713-1.55 1.41z" />
                                            </svg>
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