'use client';

import { useState, useMemo } from 'react';
import AudioPlayer from '../ui/AudioPlayer';
// 1. Importeer de gegenereerde JSON data
import mixesData from '@/data/mixes.json';
import Link from 'next/link';

const MOOD_DATA: Record<string, { colorVar: string; text: string }> = {
    yellow: { colorVar: '--yellow-default', text: 'avontuur · passie · ambitie · gretig' },
    cyan: { colorVar: '--cyan-default', text: 'vrolijk · feestelijk · gezellig · blij · sfeervol' },
    green: { colorVar: '--green-default', text: 'romantisch · vredig · euforisch · warm · trots' },
    orange: { colorVar: '--orange-default', text: 'inspirerend · episch · resoluut · heldhaftig' },
    red: { colorVar: '--red-default', text: 'eng · duister · Luguber · beklemmend · vies' },
    purple: { colorVar: '--purple-default', text: 'verdriet · pijn · verlies · rouw · schaamte' },
    blue: { colorVar: '--blue-default', text: 'neutraal · nuchter · stabiel · tevreden · serene' },
};

export default function LuisterFilter() {
    const [activeColor, setActiveColor] = useState('all');
    const [activeGenre, setActiveGenre] = useState('all');
    const [activePower, setActivePower] = useState('all');

    // 2. Filter de data op basis van de geselecteerde filters
    const filteredMixes = useMemo(() => {
        return mixesData.filter(mix => {
            // 1. Als de mix op negeren staat, toon hem dan NOOIT
            if (mix.ignore === true) {
                return false;
            }

            // 2. De rest van de bestaande filters
            const matchColor = activeColor === 'all' || mix.color === activeColor;
            const matchGenre = activeGenre === 'all' || mix.genre === activeGenre;
            const matchPower = activePower === 'all' || mix.power === activePower;

            return matchColor && matchGenre && matchPower;
        });
    }, [activeColor, activeGenre, activePower]);

    return (
        <>
            <div className="column wrapper spacing-s black-90-bg in-push-l">
                <div className="column text-wrapper spacing-m show_border_bottom">
                    <div className="column text-wrapper spacing-xs">
                        <h2>Filter</h2>
                    </div>
                    <div className="column text-wrapper spacing-xs center">
                        <p className="size-s">Kies hieronder jouw voorkeuren.</p>
                    </div>
                </div>

                {/* MOOD */}
                <div className="column text-wrapper spacing-m h-push-m">
                    <div className="column wrapper spacing-xxs">
                        <div className="column text-wrapper spacing-xs header">
                            <h3>Mood</h3>
                        </div>
                        <div className="row wrapper spacing-xs center wrap">
                            <button
                                className={`btn passive select ${activeColor === 'all' ? 'is-active' : ''}`}
                                onClick={() => setActiveColor('all')}
                            >
                                Alles
                            </button>
                            {Object.keys(MOOD_DATA).map(color => (
                                <button
                                    key={color}
                                    className={`btn passive select ${activeColor === color ? 'is-active' : ''}`}
                                    onClick={() => setActiveColor(color)}
                                >
                                    {color.charAt(0).toUpperCase() + color.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="column wrapper spacing-xxs center show_border_bottom" style={{ minHeight: '40px' }}>
                        {activeColor !== 'all' && (
                            <div className="row text-wrapper spacing-xs color-wrapper center flex">
                                <svg viewBox="0 0 20 20" style={{ width: '15px', height: '15px' }}>
                                    <circle cx="10" cy="10" r="9" fill={`var(${MOOD_DATA[activeColor].colorVar})`} />
                                </svg>
                                <p className="output">{MOOD_DATA[activeColor].text}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* GENRE */}
                <div className="column wrapper spacing-xxs center show_border_bottom padding-bottom-m">
                    <div className="column text-wrapper spacing-xs header">
                        <h3>Genre</h3>
                    </div>
                    <div className="row wrapper spacing-xs center wrap">
                        {['all', 'edm', 'drum & bass'].map((genre) => (
                            <button
                                key={genre}
                                className={`btn passive select ${activeGenre === genre ? 'is-active' : ''}`}
                                onClick={() => setActiveGenre(genre)}
                            >
                                {genre === 'all' ? 'Alles' : genre.toUpperCase()}
                            </button>
                        ))}
                    </div>
                </div>

                {/* INTENSITEIT */}
                <div className="column wrapper spacing-xxs center padding-bottom-m">
                    <div className="column text-wrapper spacing-xs header">
                        <h3>Intensiteit</h3>
                    </div>
                    <div className="row wrapper spacing-xs center wrap">
                        {['all', 'full', 'light'].map((power) => (
                            <button
                                key={power}
                                className={`btn passive select ${activePower === power ? 'is-active' : ''}`}
                                onClick={() => setActivePower(power)}
                            >
                                {power.charAt(0).toUpperCase() + power.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* RESULTATEN */}
            <div className="column wrapper spacing-xs center">
                <div className="column text-wrapper spacing-xs header">
                    <h2>Luister</h2>
                </div>
                <div className="row wrapper spacing-s wrap center card-wrapper">
                    {filteredMixes.length > 0 ? (
                        filteredMixes.map((mix) => (
                            <div key={mix.id} className="column wrapper spacing-xxs card">
                                {/* 3. Gebruik de data uit de JSON voor de AudioPlayer */}
                                <AudioPlayer id={mix.id} src={mix.audioSrc} image={mix.image} />
                                <div className="column wrapper h-start text">                                

                                    <Link className="size-xs bold" href={`/${mix.permalink}`}>
                                        {mix.color.charAt(0).toUpperCase() + mix.color.slice(1)} {mix.genre === 'edm' ? 'EDM' : 'D&B'} Mix {mix.power} {mix.frequency} · {mix.volume}
                                    </Link>
                                    <p className="size-xxs">{mix.maand} {mix.dag}, {mix.jaar}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="size-s">Geen mixen gevonden voor deze combinatie.</p>
                    )}
                    <div className="card-dummy"></div>
                    <div className="card-dummy"></div>
                </div>
            </div>
        </>
    );
}