'use client';

import React from 'react';
import { musicMoodColoursContent } from "@/content/musicmoodcolours";

import BasiskleurenCarousel from '@/components/musicmoodcolours/BasiskleurenCarousel';
import CanvasCircle from '@/components/musicmoodcolours/CanvasCircle';
import VsKleurenCarousel from '@/components/musicmoodcolours/VsKleurenCarousel';
import KubusNeuro from '@/components/musicmoodcolours/KubusNeuro';
import KubusHoeken from '@/components/musicmoodcolours/KubusHoeken';
import Erlenmeyers from '@/components/musicmoodcolours/Erlenmeyers';
import ContactForm from "@/components/sections/ContactForm";



export default function MusicMoodColoursPage() {
    return (
        <main className="musicmoodcolours">
            {/* 1. BANNER */}
            <section className="column stack wrapper pattern WoB" id="banner_2">
                <div className="stack overlay wrapper spacing-h6 feather">
                    <div className="column overlay spacing-h6 sides"></div>
                    <div className="column overlay spacing-h6 bottom"></div>
                </div>
                <div className="column overlay constrainer spacing-h6 header">
                    <div className="column banner-wrapper v-push-h1 center">
                        <div className="column text-wrapper spacing-h6 left">
                            <h1>Music Mood Colours</h1>
                        </div>
                    </div>
                </div>
            </section>


            <section className="column text-wrapper spacing-h1 WoB">

                {/* 2. INTRO */}
                <div className="column text-wrapper spacing-h3" id="intro_1">
                    <div className="column text-constrainer spacing-h5">
                        <div className="column text-wrapper spacing-h6">
                            <p>{musicMoodColoursContent.intro.s1p1}</p>
                            <p>{musicMoodColoursContent.intro.s1p2}</p>
                            <p>{musicMoodColoursContent.intro.s1p3}</p>
                        </div>
                    </div>
                </div>

                {/* 3. KLEURENSPECTRUM */}
                <div className="column text-wrapper spacing-h3" id="kleurenspectrum_2">
                    <div className="column text-constrainer spacing-h5">

                        <h2>Het kleurenspectrum van muziek</h2>

                        <div className="column text-wrapper spacing-h6">
                            <p>{musicMoodColoursContent.spectrum.s2p1}</p>
                            <CanvasCircle />
                            <p>{musicMoodColoursContent.spectrum.s2p2}</p>
                        </div>

                    </div>

                    <BasiskleurenCarousel />

                    <div className="column text-constrainer spacing-h9">

                        <h3>De taal van emotie</h3>
                        <div className="column text-wrapper spacing-h6">
                            <p>{musicMoodColoursContent.spectrum.s2p3}</p>
                            <p>{musicMoodColoursContent.spectrum.s2p4}</p>
                        </div>

                    </div>
                </div>

                {/* 4. COMPLEMENTAIR */}
                <div className="column wrapper spacing-h3" id="complementaire_kleuren_3">
                    <div className="column text-constrainer spacing-h5">

                        <h2>Complementaire muziekstemmingen</h2>

                        <div className="column text-wrapper spacing-h6">
                            <p>{musicMoodColoursContent.complementair.s3p1}</p>
                            <p>{musicMoodColoursContent.complementair.s3p2}</p>
                            <p>{musicMoodColoursContent.complementair.s3p3}</p>
                        </div>
                    </div>
                    <VsKleurenCarousel />
                </div>

                {/* 5. NEURO (Muziekale kaart) */}
                <div className="column text-wrapper spacing-h3" id="neurotransmitters_4">
                    <div className="column text-constrainer spacing-h5">

                        <h2>Muziekale kaart</h2>

                        <div className="column text-wrapper spacing-h6">

                            <p>{musicMoodColoursContent.neuro.s4p1}</p>

                            <ul className="column text-wrapper spacing-h7">
                                <li className="column text-wrapper spacing-h9">
                                    <h3>Dopamine</h3>
                                    <p>{musicMoodColoursContent.neuro.dopamine}</p>
                                </li>
                                <li className="column text-wrapper spacing-h9">
                                    <h3>Serotonine</h3>
                                    <p>{musicMoodColoursContent.neuro.serotonine}</p>
                                </li>
                                <li className="column text-wrapper spacing-h9">
                                    <h3>(nor)Adrenaline</h3>
                                    <p>{musicMoodColoursContent.neuro.adrenaline}</p>
                                </li>
                            </ul>

                            <p>{musicMoodColoursContent.neuro.s4p5}</p>

                            <KubusNeuro />


                            <p>{musicMoodColoursContent.neuro.s4p6}</p>

                            <KubusHoeken />

                            <p>{musicMoodColoursContent.neuro.s4p7}</p>

                            <Erlenmeyers />

                        </div>
                    </div>
                </div>

                {/* 6. CONCLUSIE */}
                <div className="column text-wrapper spacing-h3" id="conclusie_5">

                    <div className="column text-constrainer spacing-h5">
                        <h2>Conclusie</h2>

                        <div className="column text-wrapper spacing-h6">

                            <p>{musicMoodColoursContent.conclusie.s5p1}</p>
                            <p>{musicMoodColoursContent.conclusie.s5p2}</p>
                            <p>{musicMoodColoursContent.conclusie.s5p3}</p>

                        </div>
                    </div>
                </div>

                <ContactForm />

            </section>
        </main >
    );
}