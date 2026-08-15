'use client';

import React, { useState, useMemo } from 'react';
import AudioPlayer from '@/components/ui/AudioPlayer';

// De acht light-bestanden stonden hier los geimporteerd en samengevoegd. Zie @/data/mixes/all:
// featuredMixByColor draagt nu ook het power-filter dat voorheen impliciet in die imports zat.
import { featuredMixByColor } from '@/data/mixes/all';


import '@/styles/components/musicmoodcolours/erlenmeyers.scss';




const COLOR_TO_STATE: Record<string, { dopamine: boolean; serotonine: boolean; adrenaline: boolean; label: string }> = {
    "blue": { dopamine: false, serotonine: false, adrenaline: false, label: "Onverschillig" },
    "cyan": { dopamine: true, serotonine: false, adrenaline: false, label: "Vermaakt" },
    "purple": { dopamine: false, serotonine: true, adrenaline: false, label: "Verdrietig" },
    "magenta": { dopamine: false, serotonine: false, adrenaline: true, label: "Geïrriteerd" },
    "green": { dopamine: true, serotonine: true, adrenaline: false, label: "Dankbaar" },
    "yellow": { dopamine: true, serotonine: false, adrenaline: true, label: "Ambitieus" },
    "red": { dopamine: false, serotonine: true, adrenaline: true, label: "Bang" },
    "orange": { dopamine: true, serotonine: true, adrenaline: true, label: "Hoopvol" }
};

const SUBSTANCES = ['dopamine', 'serotonine', 'adrenaline'] as const;

export default function Erlenmeyers() {
    const [substances, setSubstances] = useState({ dopamine: false, serotonine: false, adrenaline: false });
    const [activeMixId, setActiveMixId] = useState<string | null>(null);

    const activeColor = useMemo(() => {
        const combo = `${substances.dopamine}-${substances.serotonine}-${substances.adrenaline}`;
        const emotions: Record<string, string> = {
            "false-false-false": "blue", "true-false-false": "cyan", "false-true-false": "purple",
            "false-false-true": "magenta", "true-true-false": "green", "true-false-true": "yellow",
            "false-true-true": "red", "true-true-true": "orange"
        };
        return emotions[combo] || 'blue';
    }, [substances]);

    // Bewust géén ignore-filter: de acht covers ZIJN preview-entries. `featuredMixByColor` houdt dat
    // zo en voegt het power-filter toe dat hier voorheen impliciet in de acht light-imports zat.
    const currentMix = useMemo(() => featuredMixByColor(activeColor), [activeColor]);

    const toggleSubstance = (type: keyof typeof substances) => {
        setSubstances(prev => ({ ...prev, [type]: !prev[type] }));
    };

    const setPreset = (color: string) => {
        const newState = COLOR_TO_STATE[color];
        if (newState) {
            setSubstances({
                dopamine: newState.dopamine,
                serotonine: newState.serotonine,
                adrenaline: newState.adrenaline
            });
        }
    };

    return (
        <>
            {/* 1. OUTPUT */}
            <div className="column spacing-4xl fill-90 in-push-5xl" id="canvas_erlenmeyers">
                <div className="column spacing-3xl output">

                     
                    <div className={`column spacing-2xl center emotion-wrapper ${activeColor}`}>

                        {/* Check op audioSrc om Console Error te voorkomen */}
                        {currentMix && currentMix.audioSrc ? (
                            <AudioPlayer
                                id={String(currentMix.id)}
                                key={String(currentMix.id)}
                                src={currentMix.audioSrc}
                                image={currentMix.image_square || ""} // TS Fix: fallback naar string
                                showVolumeSlider={false}
                                activeId={activeMixId}
                                onPlay={(id) => setActiveMixId(id)}
                                className={activeColor}
                            />
                        ) : (
                            <div className="column center wrapper" style={{ minHeight: '150px' }}>
                                <p className="size-xs">Selecteer stoffen...</p>
                            </div>
                        )}

                        <div className="row AMC text-wrapper spacing-xl">
                            <div className="column h-end">
                                <svg viewBox="0 0 20 20" width="14" height="14">
                                    <circle cx="10" cy="10" r="9" fill={`var(--${activeColor}-default)`} />
                                </svg>
                            </div>
                            <div className="column h-start text">
                                <p className="text" id="emotion-text">&quot;{COLOR_TO_STATE[activeColor].label}&quot;</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="splitter"></div>

                {/* 2. ERLENMEYERS */}
                <div className="column spacing-base erlenmeyers">
                    <div className="row text-wrapper spacing-3xl">
                        {SUBSTANCES.map((sub) => {
                            const isActive = substances[sub];
                            return (
                                <div
                                    key={sub}
                                    className={`erlenmeyer ${sub} ${isActive ? 'is-active is-filled' : ''}`}
                                    onClick={() => toggleSubstance(sub)}
                                >
                                    <svg viewBox="0 0 100 100" className="erlenmeyer-svg">
                                        <defs>
                                            <clipPath id={`clip-${sub}`}>
                                                <rect x="0" y={isActive ? 20 : 100} width="100" height="110" />
                                            </clipPath>
                                        </defs>
                                        <g clipPath={`url(#clip-${sub})`}>
                                            <path d="M35 20 L35 40 L15 85 Q10 95 25 95 L75 95 Q90 95 85 85 L65 40 L65 20 Z" className="liquid" strokeWidth="0" />
                                            <circle className="bubble" cx="40" cy="80" r="2" />
                                            <circle className="bubble" cx="60" cy="70" r="3" />
                                            <circle className="bubble" cx="50" cy="85" r="1.5" />
                                        </g>
                                        <path d="M35 10 L35 40 L15 85 Q10 95 25 95 L75 95 Q90 95 85 85 L65 40 L65 10" fill="none" stroke="white" strokeWidth="1" className="glass-outline" />
                                    </svg>
                                    <p className="status-text size-sm">{isActive ? 'Hoog' : 'Laag'}</p>
                                </div>
                            );
                        })}
                    </div>

                    <div className="row spacing-3xl labels">
                        {SUBSTANCES.map((sub) => (
                            <div key={`label-${sub}`} className={`label ${sub} size-sm`} >
                                <p>{sub}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="splitter"></div>

                {/* 3. BUTTONS */}
                <div className="row AMC wrap extra spacing-xl buttons">
                    {["cyan", "green", "yellow", "orange", "red", "magenta", "purple", "blue"].map((color) => (
                        <button
                            key={color}
                            className={`btn passive colour ${activeColor === color ? 'is-active' : ''}`}
                            data-filter-color={color}
                            aria-pressed={activeColor === color ? "true" : "false"}
                            onClick={() => setPreset(color)}
                        >
                            {color.charAt(0).toUpperCase() + color.slice(1)}
                        </button>
                    ))}
                </div>
            </div>
        </>
    );
}