'use client';

import React, { useState, useMemo } from 'react';
import AudioPlayer from '@/components/ui/AudioPlayer';

import lightBlue from '@/data/mixes/light-blue.json';
import lightCyan from '@/data/mixes/light-cyan.json';
import lightGreen from '@/data/mixes/light-green.json';
import lightYellow from '@/data/mixes/light-yellow.json';
import lightOrange from '@/data/mixes/light-orange.json';
import lightPurple from '@/data/mixes/light-purple.json';
import lightRed from '@/data/mixes/light-red.json';
import lightMagenta from '@/data/mixes/light-magenta.json';

// @ts-ignore
import '@/styles/components/musicmoodcolours/erlenmeyers.scss';


const allMixesData = [
    ...lightBlue, ...lightCyan, ...lightGreen, ...lightYellow, ...lightOrange, ...lightPurple, ...lightRed, ...lightMagenta,

];


const COLOR_TO_STATE: Record<string, { dopamine: boolean; serotonine: boolean; adrenaline: boolean; label: string }> = {
    "blue": { dopamine: false, serotonine: false, adrenaline: false, label: "Onverschillig" },
    "cyan": { dopamine: true, serotonine: false, adrenaline: false, label: "Vermaakt" },
    "purple": { dopamine: false, serotonine: true, adrenaline: false, label: "Verdrietig" },
    "magenta": { dopamine: false, serotonine: false, adrenaline: true, label: "Geirriteerd" },
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

    const currentMix = useMemo(() => {
        // !m.ignore weggehaald om de previews te kunnen laden
        return allMixesData.find(m =>
            m.color.toLowerCase() === activeColor &&
            m.featured === true
        );
    }, [activeColor]);

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
            <div className="column spacing-5xl black-90-bg in-push-6xl" id="canvas_erlenmeyers">
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

                        <div className="row text-wrapper spacing-xl center">
                            <div className="column h-end">
                                <svg viewBox="0 0 20 20" width="14" height="14">
                                    <circle cx="10" cy="10" r="9" fill={`var(--${activeColor}-default)`} />
                                </svg>
                            </div>
                            <div className="column h-start text">
                                <p className="text" id="emotion-text">"{COLOR_TO_STATE[activeColor].label}"</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. ERLENMEYERS */}
                <div className="column spacing-base erlenmeyers splitter-small">
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

                {/* 3. BUTTONS */}
                <div className="row spacing-xl center wrap buttons">
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