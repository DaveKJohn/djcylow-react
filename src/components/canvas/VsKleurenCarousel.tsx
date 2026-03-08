'use client';

import React, { useMemo, useRef, useEffect, useState } from 'react';
import mixesData from '@/data/mixes.json';
import AudioPlayer from '@/components/ui/AudioPlayer';

const VS_CONFIG = [
    { top: 'cyan', bottom: 'red', id: 'cyan-vs-red' },
    { top: 'yellow', bottom: 'purple', id: 'yellow-vs-purple' },
    { top: 'green', bottom: 'magenta', id: 'green-vs-magenta' },
    { top: 'orange', bottom: 'blue', id: 'orange-vs-blue' },
];

export default function VsKleurenCarousel() {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(true);
    const [activeMixId, setActiveMixId] = useState<string | null>(null);

    const vsPairs = useMemo(() => {
        return VS_CONFIG.map(pair => ({
            ...pair,
            topMix: mixesData.find(m => m.color.toLowerCase() === pair.top && m.featured === true),
            bottomMix: mixesData.find(m => m.color.toLowerCase() === pair.bottom && m.featured === true),
        }));
    }, []);

    const updateArrows = () => {
        if (scrollRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
            setShowLeftArrow(scrollLeft > 10);
            setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
        }
    };

    useEffect(() => {
        const el = scrollRef.current;
        if (el) {
            el.addEventListener('scroll', updateArrows);
            window.addEventListener('resize', updateArrows);
            updateArrows();
        }
        return () => {
            el?.removeEventListener('scroll', updateArrows);
            window.removeEventListener('resize', updateArrows);
        };
    }, []);

    const scroll = (direction: number) => {
        if (scrollRef.current) {
            const scrollAmount = 320;
            scrollRef.current.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' });
        }
    };

    return (
        <div className="row wrapper spacing-s visual carousels black-90-bg in-push-l">
            <div className={`arrow left ${!showLeftArrow ? 'hidden' : ''}`} onClick={() => scroll(-1)}>
                <button className="btn">
                    <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path fill="currentColor" fillRule="evenodd" d="M8.793 5.293a1 1 0 0 1 1.414 0l6 6a1 1 0 0 1 0 1.414l-6 6a1 1 0 0 1-1.414-1.414L14.086 12 8.793 6.707a1 1 0 0 1 0-1.414" clipRule="evenodd" transform="rotate(180 12 12)" />
                    </svg>
                </button>
            </div>

            <div className="column wrapper spacing-xxs no-scrollbar" id="carousel-vs" ref={scrollRef}>
                <div className="row carousel-wrapper center">
                    {vsPairs.map((pair, index) => (
                        <React.Fragment key={pair.id}>
                            <div className={`column ${pair.id}`}>

                                {/* Bovenste Mix - Verpakt in een div voor de kleur-styling */}
                                <div className={`stack colour ${pair.top.toLowerCase()}`}>
                                    <AudioPlayer
                                        id={String(pair.topMix?.id ?? "")}
                                        src={pair.topMix?.audioSrc ?? ""}
                                        image={pair.topMix?.image_square ?? ""}
                                        showVolumeSlider={false}
                                        activeId={activeMixId}
                                        onPlay={(id) => setActiveMixId(id)}
                                        className={pair.top.toLowerCase()} // Directe kleur-klasse hier!
                                    />
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

                                {/* Onderste Mix - Verpakt in een div voor de kleur-styling */}
                                <div className={`stack colour ${pair.bottom}`}>
                                    <AudioPlayer
                                        id={String(pair.bottomMix?.id ?? "")}
                                        src={pair.bottomMix?.audioSrc ?? ""}
                                        image={pair.bottomMix?.image_square ?? ""}
                                        showVolumeSlider={false}
                                        activeId={activeMixId}
                                        onPlay={(id) => setActiveMixId(id)}
                                         className={pair.bottom.toLowerCase()} // Directe kleur-klasse hier!
                                    />
                                </div>

                            </div>
                            {index < vsPairs.length - 1 && <div className="vr"></div>}
                        </React.Fragment>
                    ))}
                </div>
            </div>

            <div className={`arrow right ${!showRightArrow ? 'hidden' : ''}`} onClick={() => scroll(1)}>
                <button className="btn">
                    <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path fill="currentColor" fillRule="evenodd" d="M8.793 5.293a1 1 0 0 1 1.414 0l6 6a1 1 0 0 1 0 1.414l-6 6a1 1 0 0 1-1.414-1.414L14.086 12 8.793 6.707a1 1 0 0 1 0-1.414" clipRule="evenodd" />
                    </svg>
                </button>
            </div>
        </div>
    );
}