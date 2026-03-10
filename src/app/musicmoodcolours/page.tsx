'use client';

import React from 'react';
import { musicMoodColoursContent } from "@/content/musicmoodcolours";

import BasiskleurenCarousel from '@/components/canvas/BasiskleurenCarousel';
import CanvasCircle from '@/components/canvas/CanvasCircle';
import VsKleurenCarousel from '@/components/canvas/VsKleurenCarousel';
import KubusNeuro from '@/components/canvas/KubusNeuro';
import KubusHoeken from '@/components/canvas/KubusHoeken';
import Erlenmeyers from '@/components/canvas/Erlenmeyers';
import ContactForm from "@/components/sections/ContactForm";



export default function MusicMoodColoursPage() {
    return (
        <main className="musicmoodcolours">
            {/* 1. BANNER */}
            <section className="column stack wrapper pattern WoB" id="banner_2">
                <div className="stack overlay wrapper spacing-7xl feather">
                    <div className="column overlay spacing-4xl sides"></div>
                    <div className="column overlay spacing-4xl bottom"></div>
                </div>
                <div className="column overlay constrainer spacing-7xl header">
                    <div className="column banner-wrapper v-push-8xl center">
                        <div className="column text-wrapper spacing-2xl left">
                            <h1>Music Mood Colours</h1>
                        </div>
                    </div>
                </div>
            </section>

            <section className="column text-wrapper spacing-7xl WoB">

                {/* 2. INTRO */}
                <div className="column text-wrapper spacing-4xl" id="intro_1">
                    <div className="column constrainer">
                        <div className="column text-wrapper spacing-7xl">
                            <p className="size-base">{musicMoodColoursContent.intro.s1p1}</p>
                        </div>
                    </div>
                    <div className="column constrainer">
                        <div className="column text-wrapper spacing-7xl">
                            <p className="size-base">{musicMoodColoursContent.intro.s1p2}</p>
                        </div>
                    </div>
                    <div className="column constrainer">
                        <div className="column text-wrapper spacing-7xl">
                            <p className="size-base">{musicMoodColoursContent.intro.s1p3}</p>
                        </div>
                    </div>
                </div>

                {/* 3. KLEURENSPECTRUM */}
                <div className="column text-wrapper spacing-4xl" id="kleurenspectrum_2">
                    <div className="column constrainer header">
                        <div className="text-wrapper spacing-7xl column header">
                            <h2>Het kleurenspectrum van muziek</h2>
                        </div>
                    </div>
                    <div className="column constrainer">
                        <div className="column text-wrapper spacing-7xl">
                            <p className="size-base">{musicMoodColoursContent.spectrum.s2p1}</p>
                        </div>
                    </div>
                    <div className="column constrainer">
                        <div className="column stack wrapper spacing-7xl black-90-bg in-push-6xl" id="canvas_circle">
                            <CanvasCircle />
                        </div>
                    </div>
                    <div className="column constrainer">
                        <div className="column text-wrapper spacing-7xl">
                            <p className="size-base">{musicMoodColoursContent.spectrum.s2p2}</p>
                        </div>
                    </div>

                    <BasiskleurenCarousel />

                    <div className="column constrainer">
                        <div className="column text-wrapper spacing-2xl">
                            <h3>De taal van emotie</h3>
                            <p className="size-base">{musicMoodColoursContent.spectrum.s2p3}</p>

                        </div>
                    </div>

                    <div className="column constrainer">
                        <div className="column text-wrapper spacing-2xl">


                            <p className="size-base">{musicMoodColoursContent.spectrum.s2p4}</p>
                        </div>
                    </div>
                </div>

                {/* 4. COMPLEMENTAIR */}
                <div className="column text-wrapper spacing-4xl" id="complementaire_kleuren_3">
                    <div className="column constrainer header">
                        <div className="column text-wrapper spacing-7xl header">
                            <h2>Complementaire muziekstemmingen</h2>
                        </div>
                    </div>
                    <div className="column constrainer">
                        <div className="column text-wrapper spacing-7xl">
                            <p className="size-base">{musicMoodColoursContent.complementair.s3p1}</p>
                        </div>
                    </div>
                    <div className="column constrainer">
                        <div className="column text-wrapper spacing-7xl">
                            <p className="size-base">{musicMoodColoursContent.complementair.s3p2}</p>
                        </div>
                    </div>
                    <div className="column constrainer">
                        <div className="column text-wrapper spacing-7xl">
                            <p className="size-base">{musicMoodColoursContent.complementair.s3p3}</p>
                        </div>
                    </div>
                    <div className="row wrapper spacing-2xl visual carousels black-90-bg" id="vs">
                        <VsKleurenCarousel />
                    </div>
                </div>

                {/* 5. NEURO (Muziekale kaart) */}
                <div className="column text-wrapper spacing-4xl" id="neurotransmitters_4">
                    <div className="column constrainer header">
                        <div className="column text-wrapper spacing-7xl">
                            <h2>Muziekale kaart</h2>
                        </div>
                    </div>
                    <div className="column constrainer">
                        <div className="column text-wrapper spacing-7xl">
                            <p className="size-base">{musicMoodColoursContent.neuro.s4p1}</p>
                        </div>
                    </div>
                    <div className="column constrainer">
                        <ul className="column text-wrapper spacing-3xl">
                            <li className="column text-wrapper spacing-base">
                                <h3>Dopamine</h3>
                                <p className="size-base">{musicMoodColoursContent.neuro.dopamine}</p>
                            </li>
                            <li className="column text-wrapper spacing-base">
                                <h3>Serotonine</h3>
                                <p className="size-base">{musicMoodColoursContent.neuro.serotonine}</p>
                            </li>
                            <li className="column text-wrapper spacing-base">
                                <h3>(nor)Adrenaline</h3>
                                <p className="size-base">{musicMoodColoursContent.neuro.adrenaline}</p>
                            </li>
                        </ul>
                    </div>
                    <div className="column constrainer">
                        <div className="column text-wrapper spacing-2xl">
                            <p className="size-base">{musicMoodColoursContent.neuro.s4p5}</p>
                        </div>
                    </div>
                    <div className="column constrainer visual">
                        <div className="column wrapper spacing-7xl black-90-bg in-push-5xl" id="canvas_3Dspace_3">
                            <KubusNeuro />
                        </div>
                    </div>
                    <div className="column constrainer">
                        <div className="column text-wrapper spacing-2xl">
                            <p className="size-base">{musicMoodColoursContent.neuro.s4p6}</p>
                        </div>
                    </div>
                    <div className="column constrainer visual">
                        <div className="column wrapper spacing-2xl black-90-bg in-push-5xl" id="canvas_3Dspace">
                            <KubusHoeken />
                        </div>
                    </div>
                    <div className="column constrainer">
                        <div className="column text-wrapper spacing-2xl">
                            <p className="size-base">{musicMoodColoursContent.neuro.s4p7}</p>
                        </div>
                    </div>
                    <div className="column constrainer visual">
                        <div className="column wrapper spacing-4xl black-90-bg in-push-5xl" id="canvas_erlenmeyers">
                            <Erlenmeyers />
                        </div>
                    </div>
                </div>

                {/* 6. CONCLUSIE */}
                <div className="column text-wrapper spacing-4xl" id="conclusie_5">
                    <div className="column constrainer">
                        <div className="column text-wrapper spacing-7xl">
                            <p className="size-base">{musicMoodColoursContent.conclusie.s5p1}</p>
                        </div>
                    </div>
                    <div className="column constrainer">
                        <div className="column text-wrapper spacing-7xl">
                            <p className="size-base">{musicMoodColoursContent.conclusie.s5p2}</p>
                        </div>
                    </div>
                    <div className="column constrainer">
                        <div className="column text-wrapper spacing-7xl">
                            <p className="size-base">{musicMoodColoursContent.conclusie.s5p3}</p>
                        </div>
                    </div>
                </div>

              
                    <ContactForm />
               
            </section>
        </main>
    );
}