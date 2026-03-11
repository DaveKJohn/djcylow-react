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
                <div className="stack overlay wrapper spacing-h3 feather">
                    <div className="column overlay spacing-h3 sides"></div>
                    <div className="column overlay spacing-h3 bottom"></div>
                </div>
                <div className="column overlay constrainer spacing-h3 header">
                    <div className="column banner-wrapper v-push-h1 center">
                        <div className="column text-wrapper spacing-h3 left">
                            <h1>Music Mood Colours</h1>
                        </div>
                    </div>
                </div>
            </section>


            <section className="column text-wrapper spacing-h2 WoB">

                {/* 2. INTRO */}
                <div className="column text-wrapper spacing-h3" id="intro_1">
                    <div className="column constrainer">
                        <div className="column text-wrapper spacing-h1">
                            <p className="size-base">{musicMoodColoursContent.intro.s1p1}</p>
                        </div>
                    </div>
                    <div className="column constrainer">
                        <div className="column text-wrapper spacing-h1">
                            <p className="size-base">{musicMoodColoursContent.intro.s1p2}</p>
                        </div>
                    </div>
                    <div className="column constrainer">
                        <div className="column text-wrapper spacing-h1">
                            <p className="size-base">{musicMoodColoursContent.intro.s1p3}</p>
                        </div>
                    </div>
                </div>

                {/* 3. KLEURENSPECTRUM */}
                <div className="column text-wrapper spacing-h3" id="kleurenspectrum_2">
                    <div className="column constrainer header">
                        <div className="text-wrapper spacing-h1 column header">
                            <h2>Het kleurenspectrum van muziek</h2>
                        </div>
                    </div>
                    <div className="column constrainer">
                        <div className="column text-wrapper spacing-h1">
                            <p className="size-base">{musicMoodColoursContent.spectrum.s2p1}</p>
                        </div>
                    </div>
                    <div className="column constrainer">
                        <div className="column stack wrapper spacing-h1 black-90-bg in-push-h3" id="canvas_circle">
                            <CanvasCircle />
                        </div>
                    </div>
                    <div className="column constrainer">
                        <div className="column text-wrapper spacing-h1">
                            <p className="size-base">{musicMoodColoursContent.spectrum.s2p2}</p>
                        </div>
                    </div>

                    <BasiskleurenCarousel />

                    <div className="column constrainer">
                        <div className="column text-wrapper spacing-h5">
                            <h3>De taal van emotie</h3>
                            <p className="size-base">{musicMoodColoursContent.spectrum.s2p3}</p>

                        </div>
                    </div>

                    <div className="column constrainer">
                        <div className="column text-wrapper spacing-h3">


                            <p className="size-base">{musicMoodColoursContent.spectrum.s2p4}</p>
                        </div>
                    </div>
                </div>

                {/* 4. COMPLEMENTAIR */}
                <div className="column text-wrapper spacing-h3" id="complementaire_kleuren_3">
                    <div className="column constrainer header">
                        <div className="column text-wrapper spacing-h1 header">
                            <h2>Complementaire muziekstemmingen</h2>
                        </div>
                    </div>
                    <div className="column constrainer">
                        <div className="column text-wrapper spacing-h1">
                            <p className="size-base">{musicMoodColoursContent.complementair.s3p1}</p>
                        </div>
                    </div>
                    <div className="column constrainer">
                        <div className="column text-wrapper spacing-h1">
                            <p className="size-base">{musicMoodColoursContent.complementair.s3p2}</p>
                        </div>
                    </div>
                    <div className="column constrainer">
                        <div className="column text-wrapper spacing-h1">
                            <p className="size-base">{musicMoodColoursContent.complementair.s3p3}</p>
                        </div>
                    </div>
                    <div className="row wrapper spacing-h3 visual carousels black-90-bg" id="vs">
                        <VsKleurenCarousel />
                    </div>
                </div>

                {/* 5. NEURO (Muziekale kaart) */}
                <div className="column text-wrapper spacing-h3" id="neurotransmitters_4">
                    <div className="column constrainer header">
                        <div className="column text-wrapper spacing-h1">
                            <h2>Muziekale kaart</h2>
                        </div>
                    </div>
                    <div className="column constrainer">
                        <div className="column text-wrapper spacing-h1">
                            <p className="size-base">{musicMoodColoursContent.neuro.s4p1}</p>
                        </div>
                    </div>
                    <div className="column constrainer">
                        <ul className="column text-wrapper spacing-h3">
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
                        <div className="column text-wrapper spacing-h3">
                            <p className="size-base">{musicMoodColoursContent.neuro.s4p5}</p>
                        </div>
                    </div>
                    <div className="column constrainer visual">
                        <div className="column wrapper spacing-h1 black-90-bg in-push-h3" id="canvas_3Dspace_3">
                            <KubusNeuro />
                        </div>
                    </div>
                    <div className="column constrainer">
                        <div className="column text-wrapper spacing-h3">
                            <p className="size-base">{musicMoodColoursContent.neuro.s4p6}</p>
                        </div>
                    </div>
                    <div className="column constrainer visual">
                        <div className="column wrapper spacing-h3 black-90-bg in-push-h3" id="canvas_3Dspace">
                            <KubusHoeken />
                        </div>
                    </div>
                    <div className="column constrainer">
                        <div className="column text-wrapper spacing-h3">
                            <p className="size-base">{musicMoodColoursContent.neuro.s4p7}</p>
                        </div>
                    </div>
                    <div className="column constrainer visual">
                        <div className="column wrapper spacing-h3 black-90-bg in-push-h3" id="canvas_erlenmeyers">
                            <Erlenmeyers />
                        </div>
                    </div>
                </div>

                {/* 6. CONCLUSIE */}
                <div className="column text-wrapper spacing-h3" id="conclusie_5">
                    <div className="column constrainer">
                        <div className="column text-wrapper spacing-h1">
                            <p className="size-base">{musicMoodColoursContent.conclusie.s5p1}</p>
                        </div>
                    </div>
                    <div className="column constrainer">
                        <div className="column text-wrapper spacing-h1">
                            <p className="size-base">{musicMoodColoursContent.conclusie.s5p2}</p>
                        </div>
                    </div>
                    <div className="column constrainer">
                        <div className="column text-wrapper spacing-h1">
                            <p className="size-base">{musicMoodColoursContent.conclusie.s5p3}</p>
                        </div>
                    </div>
                </div>


                <ContactForm />

            </section>
        </main>
    );
}