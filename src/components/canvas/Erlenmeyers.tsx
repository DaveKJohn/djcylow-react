'use client';

import React, { useState, useMemo } from 'react';
import AudioPlayer from '@/components/ui/AudioPlayer';
import mixesData from '@/data/mixes.json';

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
        return mixesData.find(m => m.color.toLowerCase() === activeColor && m.featured === true);
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

    // Directe return, geen interne functie Erlenmeyers meer
    return (
        <>
            {/* 1. OUTPUT */}
            <div className="column wrapper spacing-xs output">
                <div className={`column wrapper spacing-xxs center emotion-wrapper ${activeColor}`}>
                    <div className={`column wrapper stack spacing-s colour ${activeColor} audioplayer-wrapper`}>
                        <AudioPlayer
                            id={String(currentMix?.id ?? "")}
                            key={String(currentMix?.id ?? "empty")}
                            src={currentMix?.audioSrc ?? ""}
                            image={currentMix?.image_square ?? ""}
                            showVolumeSlider={false}
                            activeId={activeMixId}
                            onPlay={(id) => setActiveMixId(id)}
                            layerClass="h5-content-1"
                            contentClass="h4-content-4"
                        />
                    </div>

                    <div className="row text-wrapper spacing-s center">
                        <div className="column wrapper h-end">
                            <svg viewBox="0 0 20 20">
                                <circle cx="10" cy="10" r="9" fill={`var(--${activeColor}-default)`} />
                            </svg>
                        </div>
                        <div className="column wrapper h-start text">
                            <p className="text" id="emotion-text">"{COLOR_TO_STATE[activeColor].label}"</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. ERLENMEYERS */}
            <div className="column wrapper spacing-xxs erlenmeyers show_border_bottom">
                <div className="row wrapper spacing-s">
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
                                <p className="status-text">{isActive ? 'Hoog' : 'Laag'}</p>
                            </div>
                        );
                    })}
                </div>

                <div className="row text-wrapper spacing-s">
                    {SUBSTANCES.map((sub) => (
                        <div key={`label-${sub}`} className={`label ${sub}`}>
                            <p>{sub}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* 3. BUTTONS */}
            <div className="row wrapper spacing-xs center wrap buttons">
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
        </>
    );
}