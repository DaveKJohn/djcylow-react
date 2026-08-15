'use client';

import React, { useMemo, useState } from 'react';
import AudioPlayer from '@/components/ui/AudioPlayer';

// De acht light-bestanden stonden hier los geimporteerd en samengevoegd. Zie @/data/mixes/all:
// featuredMixByColor draagt nu ook het power-filter dat voorheen impliciet in die imports zat.
import { featuredMixByColor } from '@/data/mixes/all';
import Carousel from '@/components/ui/Carousel';


import '@/styles/components/musicmoodcolours/vsKleurenCarousel.scss';


const VS_CONFIG = [
    { top: 'cyan', bottom: 'red', id: 'cyan-vs-red' },
    { top: 'yellow', bottom: 'purple', id: 'yellow-vs-purple' },
    { top: 'green', bottom: 'magenta', id: 'green-vs-magenta' },
    { top: 'orange', bottom: 'blue', id: 'orange-vs-blue' },
];

export default function VsKleurenCarousel() {
    const [activeMixId, setActiveMixId] = useState<string | null>(null);

    // Deze logica moet blijven staan zodat de component weet welke mixen hij moet tonen
    const vsPairs = useMemo(() => {
        return VS_CONFIG.map(pair => ({
            ...pair,
            topMix: featuredMixByColor(pair.top),
            bottomMix: featuredMixByColor(pair.bottom),
        }));
    }, []);

    return (
        <Carousel id="carousel-vs">
            <div className="row w-fill AMC carousel-wrapper">
                {vsPairs.map((pair, index) => (
                    <React.Fragment key={pair.id}>
                        <div className={`column ${pair.id}`}>

                            {/* Bovenste Mix */}
                            <div className={`stack colour ${pair.top.toLowerCase()}`}>
                                {pair.topMix && pair.topMix.audioSrc ? (
                                    <AudioPlayer
                                        id={String(pair.topMix.id)}
                                        src={pair.topMix.audioSrc}
                                        image={pair.topMix.image_square || ""}
                                        showVolumeSlider={false}
                                        activeId={activeMixId}
                                        onPlay={(id) => setActiveMixId(id)}
                                        className={pair.top.toLowerCase()}
                                    />
                                ) : (
                                    <div className="column center placeholder-mix">
                                        <p className="size-xs">Geen mix</p>
                                    </div>
                                )}
                            </div>

                            <div className="column center middle">
                                <div className={`column center colour ${pair.top}`}>
                                    <p>{pair.top.charAt(0).toUpperCase() + pair.top.slice(1)}</p>
                                </div>
                                <div className="column center vs">
                                    <p>vs</p>
                                </div>
                                <div className={`column center colour ${pair.bottom}`}>
                                    <p>{pair.bottom.charAt(0).toUpperCase() + pair.bottom.slice(1)}</p>
                                </div>
                            </div>

                            {/* Onderste Mix */}
                            <div className={`stack colour ${pair.bottom}`}>
                                {pair.bottomMix && pair.bottomMix.audioSrc ? (
                                    <AudioPlayer
                                        id={String(pair.bottomMix.id)}
                                        src={pair.bottomMix.audioSrc}
                                        image={pair.bottomMix.image_square || ""}
                                        showVolumeSlider={false}
                                        activeId={activeMixId}
                                        onPlay={(id) => setActiveMixId(id)}
                                        className={pair.bottom.toLowerCase()}
                                    />
                                ) : (
                                    <div className="column center placeholder-mix">
                                        <p className="size-xs">Geen mix</p>
                                    </div>
                                )}
                            </div>

                        </div>
                        {index < vsPairs.length - 1 && <div className="vr"></div>}
                    </React.Fragment>
                ))}
            </div>
        </Carousel>
    );
}