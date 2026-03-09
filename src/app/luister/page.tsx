'use client';

import { useState } from 'react';
import Filter from '@/components/sections/Filter';
import Luister from '@/components/sections/FilterResult';

export default function LuisterPage() {
    const [activeColor, setActiveColor] = useState('all');
    const [activeGenre, setActiveGenre] = useState('all');
    const [activePower, setActivePower] = useState('all');

    return (
        <main>
            {/* 1. Banner Sectie */}
            <section className="column stack wrapper pattern WoB" id="banner_luister">
                <div className="column overlay stack wrapper spacing-l feather">
                    <div className="column overlay spacing-m bottom"></div>
                </div>
                <div className="column overlay constrainer spacing-l header">
                    <div className="column banner-wrapper spacing-xxl">
                        <div className="column text-wrapper spacing-s center">
                            <h1>Luister</h1>
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. Filter & Content Sectie */}
            <section className="column wrapper spacing-xl center WoB">
                <div className="column constrainer">
                    <Filter 
                        activeColor={activeColor} setActiveColor={setActiveColor}
                        activeGenre={activeGenre} setActiveGenre={setActiveGenre}
                        activePower={activePower} setActivePower={setActivePower}
                    />
                </div>

                <div className="column constrainer">
                    <Luister 
                        activeColor={activeColor} 
                        activeGenre={activeGenre} 
                        activePower={activePower} 
                    />
                </div>
            </section>
        </main>
    );
}