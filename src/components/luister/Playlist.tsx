'use client';

// Zorg dat useState en useEffect hier staan:
import { useMemo, useState, useEffect } from 'react';
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
    image_wide_small: string;
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
    const [limit, setLimit] = useState(10);

    // Reset de limiet naar 15 als de filters veranderen
    useEffect(() => {
        setLimit(10);
    }, [activeColor, activeGenre, activePower]);

    const showMore = () => {
        setLimit((prevLimit) => prevLimit + 10);
    };

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

        <div className="column w-fill AMC P30 spacing-xl " id="luister_content_playlist">

            <div className="column w-hug AMC P35 spacing-xl">

                <div className="row wrap w-hug AMC P40 spacing-xl fill-90">



                    {filteredMixes.length > 0 ? (
                        filteredMixes.slice(0, limit).map((mix) => (
                            <div key={mix.id} className="column w-hug AML P45 spacing-xl card">
                                <AudioPlayer
                                    id={mix.id}
                                    src={mix.audioSrc}
                                    image={mix.image_wide_small}
                                    className={mix.color?.toLowerCase()}
                                />
                                <div className="column w-hug AML ">
                                    <div className="column w-hug AML spacing-xs">
                                        <Link className="size-sm" href={`/${mix.permalink}`}>
                                            {mix.color.charAt(0).toUpperCase() + mix.color.slice(1)} {mix.genre} Mix {mix.power} {mix.frequency} · {mix.volume}
                                        </Link>
                                        <p className="size-xs">{mix.maand} {mix.dag}, {mix.jaar}</p>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>Geen mixen gevonden voor deze combinatie.</p>
                    )}

                    <div className="column w-hug AMC P45 extra spacing-6xl"> 
                        {filteredMixes.length > limit && (
                            <button onClick={showMore} className="btn passive P50 load-more">
                                Laad meer
                            </button>
                        )}
                    </div>

                </div>
            </div>
        </div>



    );
}