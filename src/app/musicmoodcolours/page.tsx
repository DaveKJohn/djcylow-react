'use client';

import React from 'react';
import styles from '@/styles/modules/musicmoodcolours.module.scss';

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
        <main className={styles.pageWrapper} >
            {/* 1. BANNER */}
            <div className="banner stack WoB" id="banner_2">

                <div className="column layer visual"></div>

                <div className="column layer feather sides"></div>

                <div className="column layer feather bottom"></div>

                <div className="column layer spacing-4xl constrainer v-center title">
                    <h1>Music Mood Colours</h1>
                </div>
            </div>

            <div className="column spacing-7xl paper WoB">

                <div className="column spacing-7xl  ">

                    {/* 2. INTRO */}
                    <div className="column spacing-5xl" id="intro">

                        <div className="column constrainer spacing-4xl">

                            <p>{musicMoodColoursContent.intro.s1p1}</p>
                            <p>{musicMoodColoursContent.intro.s1p2}</p>
                            <p>{musicMoodColoursContent.intro.s1p3}</p>

                        </div>
                    </div>

                    <div className="column spacing-5xl" id="kleurenspectrum_2">

                        <div className="column constrainer spacing-4xl">

                            {/* 3. KLEURENSPECTRUM */}
                            <div className="column spacing-5xl">


                                <h2>Het kleurenspectrum van muziek</h2>

                                <div className="column spacing-4xl">
                                    <p>{musicMoodColoursContent.spectrum.s2p1}</p>
                                    <CanvasCircle />
                                    <p>{musicMoodColoursContent.spectrum.s2p2}</p>
                                </div>
                            </div>
                        </div>

                        <BasiskleurenCarousel />

                        <div className="column constrainer spacing-2xl">

                            <h3>De taal van emotie</h3>
                            <div className="column spacing-4xl">
                                <p>{musicMoodColoursContent.spectrum.s2p3}</p>
                                <p>{musicMoodColoursContent.spectrum.s2p4}</p>
                            </div>
                        </div>

                    </div>









                    <div className="column spacing-5xl" id="complementair_3">

                        <div className="column constrainer spacing-2xl">

                            <div className="column spacing-6xl" id="complementaire_kleuren_3">


                                <h2>Complementaire muziekstemmingen</h2>

                                <div className="column spacing-4xl">
                                    <p>{musicMoodColoursContent.complementair.s3p1}</p>
                                    <p>{musicMoodColoursContent.complementair.s3p2}</p>
                                    <p>{musicMoodColoursContent.complementair.s3p3}</p>
                                </div>

                            </div>

                        </div>


                        <VsKleurenCarousel />

                        <div className="column constrainer spacing-5xl">

                            {/* 5. NEURO (Muziekale kaart) */}
                            <div className="column spacing-6xl" id="neurotransmitters_4">


                                <h2>Muziekale kaart</h2>

                                <div className="column spacing-4xl">

                                    <p>{musicMoodColoursContent.neuro.s4p1}</p>

                                    <ul className="column spacing-3xl">
                                        <li className="column spacing-xl">
                                            <h3>Dopamine</h3>
                                            <p>{musicMoodColoursContent.neuro.dopamine}</p>
                                        </li>
                                        <li className="column spacing-xl">
                                            <h3>Serotonine</h3>
                                            <p>{musicMoodColoursContent.neuro.serotonine}</p>
                                        </li>
                                        <li className="column spacing-xl">
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

                            {/* 6. CONCLUSIE */}
                            <div className="column spacing-6xl" id="conclusie_5">


                                <h2>Conclusie</h2>

                                <div className="column spacing-4xl">

                                    <p>{musicMoodColoursContent.conclusie.s5p1}</p>
                                    <p>{musicMoodColoursContent.conclusie.s5p2}</p>
                                    <p>{musicMoodColoursContent.conclusie.s5p3}</p>

                                </div>

                            </div>


                        </div>


                    </div>


                </div >

            </div>
            <ContactForm />

        </main >
    );
}