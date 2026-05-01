'use client';

import React from 'react';

// @ts-ignore
import '@/styles/components/musicmoodcolours/kubusNeuro.scss';

export default function KubusNeuro() {
    return (
        <div className="column spacing-9xl fill-90" id="canvas_3Dspace_3">
            <div className="cube-outside">
                <div className="cube-inside">
                    {/* Level 2: De vlakken (Plates) */}
                    <div className="plates">
                        <div className="plate front"></div>
                        <div className="plate back"></div>
                        <div className="plate right"></div>
                        <div className="plate left"></div>
                        <div className="plate top"></div>
                        <div className="plate bottom"></div>
                    </div>

                    {/* Level 2: De assen (Lines) */}
                    <div className="lines">
                        <div className="line purple">
                            <svg viewBox="0 0 100 2" preserveAspectRatio="none">
                                <line x1="0" y1="1" x2="100" y2="1" />
                            </svg>
                        </div>
                        <div className="line magenta">
                            <svg viewBox="0 0 100 2" preserveAspectRatio="none">
                                <line x1="0" y1="1" x2="100" y2="1" />
                            </svg>
                        </div>
                        <div className="line cyan">
                            <svg viewBox="0 0 100 2" preserveAspectRatio="none">
                                <line x1="0" y1="1" x2="100" y2="1" />
                            </svg>
                        </div>
                    </div>

                    {/* Level 2: De hoekpunten met labels (Corners) */}
                    <div className="corners">
                        <div className="corner magenta">
                            <div className="colour magenta">
                                <p>Adrenaline</p>
                            </div>
                        </div>

                        <div className="corner cyan">
                            <div className="colour cyan">
                                <p>Dopamine</p>
                            </div>
                        </div>

                        <div className="corner purple">
                            <div className="colour purple">
                                <p>Serotonine</p>
                            </div>
                        </div>

                        {/* Lege hoek voor balans/structuur */}
                        <div className="corner blue"></div>
                    </div>
                </div>
            </div>
        </div >
    );
}