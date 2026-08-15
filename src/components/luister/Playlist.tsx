'use client';

import { useMemo, useState } from 'react';
import AudioPlayer from '../ui/AudioPlayer';
import Link from 'next/link';

import { allMixes, mixSlug } from '@/data/mixes/all';

import '@/styles/components/luister/playlist.scss';

interface PlaylistProps {
    activeColor: string;
    activeGenre: string;
    activePower: string;
}

export default function Luister({ activeColor, activeGenre, activePower }: PlaylistProps) {
    const [limit, setLimit] = useState(10);
    // Welke speler er nu klinkt. AudioPlayer had de mechaniek hiervoor al -- onPlay meldt zich aan
    // en activeId pauzeert de rest -- maar deze lijst gaf die twee niet door, waardoor alle spelers
    // tegelijk konden spelen (issue #56).
    const [activeId, setActiveId] = useState<string | null>(null);
    const filterKey = `${activeColor}|${activeGenre}|${activePower}`;
    const [prevFilterKey, setPrevFilterKey] = useState(filterKey);

    if (prevFilterKey !== filterKey) {
        setLimit(10);
        setPrevFilterKey(filterKey);
    }

    const showMore = () => {
        setLimit((prevLimit) => prevLimit + 10);
    };

    const filteredMixes = useMemo(() => {
        return allMixes
            .filter(mix => {
                if (mix.ignore === true) return false;
                const matchColor = activeColor === 'all' || mix.color?.toLowerCase() === activeColor.toLowerCase();
                const matchGenre = activeGenre === 'all' || mix.genre === activeGenre;
                const matchPower = activePower === 'all' || mix.power === activePower;
                return matchColor && matchGenre && matchPower;
            })
            .sort((a, b) => b.id.localeCompare(a.id));
    }, [activeColor, activeGenre, activePower]);

    return (

        <div className="column w-fill AMC P30 spacing-xl " id="luister_content_playlist">

            <div className="column w-fill AMC P35 spacing-xl">

                <div className="row wrap w-fill AMC P40-xl spacing-xl fill-90">



                    {filteredMixes.length > 0 ? (
                        filteredMixes.slice(0, limit).map((mix) => {
                            const cleanSlug = mixSlug(mix);
                            const filterParams = new URLSearchParams();
                            if (activeColor !== 'all') filterParams.set('color', activeColor);
                            if (activeGenre !== 'all') filterParams.set('genre', activeGenre);
                            if (activePower !== 'all') filterParams.set('power', activePower);
                            const filterQs = filterParams.toString();
                            const mixHref = filterQs ? `/luister/mix/${cleanSlug}?${filterQs}` : `/luister/mix/${cleanSlug}`;

                            return (
                                <div key={mix.id} className="column w-hug AML P45 spacing-xl card">
                                    <AudioPlayer
                                        id={mix.id}
                                        src={mix.audioSrc}
                                        image={mix.image_wide_small}
                                        className={mix.color?.toLowerCase()}
                                        onPlay={setActiveId}
                                        activeId={activeId}
                                    />
                                    <div className="column w-hug AML ">
                                        <div className="column w-hug AML spacing-xs">
                                            {/* Wijs nu naar de dynamic route met de schone slug */}
                                            <Link className="size-sm" href={mixHref}>
                                                {mix.color} {mix.subgenre} Mix · {mix.volume}
                                            </Link>
                                            <p className="size-xs">{mix.maand} {mix.dag}, {mix.jaar}</p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <p>Geen mixen gevonden voor deze combinatie.</p>
                    )}

                    {filteredMixes.length > limit && (
                        <div className="column w-hug AMC P45-xl extra spacing-6xl">
                            <button onClick={showMore} className="btn passive P50 load-more">
                                Laad meer
                            </button>
                        </div>
                    )}

                </div>
            </div>
        </div>



    );
}