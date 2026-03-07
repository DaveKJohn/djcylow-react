'use client';

import { useMemo } from 'react';
import AudioPlayer from '../ui/AudioPlayer';
import mixesData from '@/data/mixes.json';
import Link from 'next/link';

export default function Luister({ activeColor, activeGenre, activePower }: any) {
    const filteredMixes = useMemo(() => {
        return mixesData.filter(mix => {
            if (mix.ignore === true) return false;
            const matchColor = activeColor === 'all' || mix.color === activeColor;
            const matchGenre = activeGenre === 'all' || mix.genre === activeGenre;
            const matchPower = activePower === 'all' || mix.power === activePower;
            return matchColor && matchGenre && matchPower;
        });
    }, [activeColor, activeGenre, activePower]);

    return (
        <div className="column wrapper spacing-xs center">
            <div className="column text-wrapper spacing-xs header">
                <h2>Luister</h2>
            </div>
            <div className="row wrapper spacing-s wrap center card-wrapper">
                {filteredMixes.length > 0 ? (
                    filteredMixes.map((mix) => (
                        <div key={mix.id} className="column wrapper spacing-xxs card">
                            <AudioPlayer id={mix.id} src={mix.audioSrc} image={mix.image} />
                            <div className="column wrapper h-start text">
                                <Link className="size-xs bold" href={`/${mix.permalink}`}>
                                    {mix.color.charAt(0).toUpperCase() + mix.color.slice(1)} {mix.genre === 'edm' ? 'EDM' : 'D&B'} Mix {mix.power}
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
    );
}