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

// @ts-ignore
import '@/styles/components/luister/playlist.scss';

interface MixData {
    id: string;
    ignore: boolean;
    color: string;
    genre: string;
    power: string;
    frequency: string;
    volume: string;
    audioSrc: string;
    image_wide_small: string; // Deze gebruiken we nu voor het overzicht
    permalink: string;
    maand: string;
    dag: string;
    jaar: string;
}

const allMixesData: MixData[] = [
    ...lightBlue, ...lightCyan, ...lightGreen, ...lightYellow, ...lightOrange, ...lightPurple, ...lightRed, ...lightMagenta,
    ...fullBlue, ...fullCyan, ...fullGreen, ...fullYellow, ...fullOrange, ...fullPurple, ...fullRed
] as any;

export default function Luister({ activeColor, activeGenre, activePower }: any) {
    const filteredMixes = useMemo(() => {
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
        
            <div className="row spacing-4xl wrap card-wrapper">
                {filteredMixes.length > 0 ? (
                    filteredMixes.map((mix) => (
                        <div key={mix.id} className="column extra spacing-xl card">
                            <AudioPlayer
                                id={mix.id}
                                src={mix.audioSrc}                               
                                image={mix.image_wide_small}
                                className={mix.color?.toLowerCase()}
                            />
                            <div className="column full-w spacing-xs h-start text">
                                <Link className="size-sm bold" href={`/${mix.permalink}`}>
                                    {mix.color.charAt(0).toUpperCase() + mix.color.slice(1)} {mix.genre} Mix {mix.power} {mix.frequency} · {mix.volume}
                                </Link>
                                <p className="size-xs">{mix.maand} {mix.dag}, {mix.jaar}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>Geen mixen gevonden voor deze combinatie.</p>
                )}
                <div className="card-dummy"></div>
                <div className="card-dummy"></div>
            </div>
       
    );
}
