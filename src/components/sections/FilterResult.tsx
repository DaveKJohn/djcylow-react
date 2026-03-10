'use client';

import { useMemo } from 'react';
import AudioPlayer from '../ui/AudioPlayer';
import Link from 'next/link';

import lightBlue from '@/data/mixes/light-blue.json';
import lightCyan from '@/data/mixes/light-cyan.json';
import lightGreen from '@/data/mixes/light-green.json';
import lightYellow from '@/data/mixes/light-yellow.json';
import lightOrange from '@/data/mixes/light-orange.json';
import lightPurple from '@/data/mixes/light-purple.json';
import lightRed from '@/data/mixes/light-red.json';
import lightMagenta from '@/data/mixes/light-magenta.json';

import fullBlue from '@/data/mixes/full-blue.json';
import fullCyan from '@/data/mixes/full-cyan.json';
import fullGreen from '@/data/mixes/full-green.json';
import fullYellow from '@/data/mixes/full-yellow.json';
import fullOrange from '@/data/mixes/full-orange.json';
import fullPurple from '@/data/mixes/full-purple.json';
import fullRed from '@/data/mixes/full-red.json';

const allMixesData = [
    ...lightBlue, ...lightCyan, ...lightGreen, ...lightYellow, ...lightOrange, ...lightPurple, ...lightRed, ...lightMagenta,
    ...fullBlue, ...fullCyan, ...fullGreen, ...fullYellow, ...fullOrange, ...fullPurple, ...fullRed
];

export default function Luister({ activeColor, activeGenre, activePower }: any) {
    const filteredMixes = useMemo(() => {
        // We sorteren ze ook direct op ID (datum) omdat de losse bestanden dat niet overkoepelend zijn
        return allMixesData
            .filter(mix => {
                if (mix.ignore === true) return false;
                const matchColor = activeColor === 'all' || mix.color === activeColor;
                const matchGenre = activeGenre === 'all' || mix.genre === activeGenre;
                const matchPower = activePower === 'all' || mix.power === activePower;
                return matchColor && matchGenre && matchPower;
            })
            .sort((a, b) => b.id.localeCompare(a.id));
    }, [activeColor, activeGenre, activePower]);

    return (
        <div className="column wrapper spacing-lg center">
            <div className="column text-wrapper spacing-lg header">
                <h2>Luister</h2>
            </div>
            <div className="row wrapper spacing-lg wrap center card-wrapper">
                {filteredMixes.length > 0 ? (
                    filteredMixes.map((mix) => (
                        <div key={mix.id} className="column wrapper spacing-lg card">
                            <AudioPlayer 
                                id={mix.id} 
                                src={mix.audioSrc} 
                                image={mix.image} 
                                className={mix.color} // Zorgt voor de outline
                            />
                            <div className="column wrapper h-start text">
                                <Link className="size-sm bold" href={`/${mix.permalink}`}>
                                    {mix.color.charAt(0).toUpperCase() + mix.color.slice(1)} {mix.genre === 'edm' ? 'EDM' : 'D&B'} Mix {mix.power}
                                </Link>
                                <p className="size-xs">{mix.maand} {mix.dag}, {mix.jaar}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="size-base">Geen mixen gevonden voor deze combinatie.</p>
                )}
                <div className="card-dummy"></div>
                <div className="card-dummy"></div>
            </div>
        </div>
    );
}