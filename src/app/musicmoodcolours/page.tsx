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
            <div className="WoB stack w-fill AMC P10 banner  v-push-7xl" id="mmc_banner">

                <div className="layer AMC visual back" id="mmc_banner_back"></div>

                <div className="layer stack AMC feathers middle" id="mmc_banner_middle">
                    <div className="layer feather sides"></div>

                    <div className="layer feather bottom"></div>
                </div>


                <div className="column w-fill AMC P20 front" id="mmc_banner_front">

                    <div className="column w-fix constrainer AML spacing-2xl">

                        <div className="column w-hug AMC P30">

                            <div className="column w-hug P35 AML spacing-2xl text-wrapper">
                                <h1>Music Mood Colours</h1>
                            </div>
                        </div>
                    </div>
                </div>

            </div>


            <div className="WoB column w-fill AMC P10 spacing-7xl bot-push-7xl">

                {/* 2. INTRO */}
                <div className="column w-fill AMC P20 spacing-6xl" id="intro">

                    <div className="column w-fix AML constrainer">

                        <div className="column w-hug AML P30">

                            <div className="column w-hug AML P35 spacing-4xl">

                                <p>{musicMoodColoursContent.intro.s1p1}</p>
                                <p>{musicMoodColoursContent.intro.s1p2}</p>
                                <p>{musicMoodColoursContent.intro.s1p3}</p>

                            </div>
                        </div>
                    </div>
                </div>

                <div className="column w-fill AMC P20 spacing-6xl" id="kleurenspectrum_2">

                    <div className="column w-fix AML constrainer spacing-4xl">

                        <div className="column w-hug AML P30 spacing-4xl">

                            {/* 3. KLEURENSPECTRUM */}
                            <div className="column w-hug AML P35 spacing-5xl">

                                <h2>Het kleurenspectrum van muziek</h2>
                            </div>

                            <div className="column w-hug AML P35 spacing-5xl">

                                <p>{musicMoodColoursContent.spectrum.s2p1}</p>

                            </div>

                            <div className="column w-fill AML P35 spacing-5xl">

                                <CanvasCircle />

                            </div>

                            <div className="column w-hug AML P35 spacing-5xl">
                                <p>{musicMoodColoursContent.spectrum.s2p2}</p>
                            </div>
                        </div>
                    </div>

                 
                            <BasiskleurenCarousel />

                
                    <div className="column w-fix AML constrainer spacing-2xl">


                        <div className="column w-hug AML P30 spacing-2xl">

                            <div className="column w-hug AML P35 spacing-5xl">

                                <h3>De taal van emotie</h3>

                            </div>

                            <div className="column w-hug AML P35 spacing-5xl">

                                <p>{musicMoodColoursContent.spectrum.s2p3}</p>
                                <p>{musicMoodColoursContent.spectrum.s2p4}</p>
                            </div>

                        </div>

                    </div>

                </div>



                <div className="column w-fill AMC P20 spacing-6xl" id="complementair_3">

                    <div className="column w-fix AML constrainer spacing-2xl">

                        <div className="column w-hug AML P30 spacing-2xl">

                            <div className="column w-hug AML P35 spacing-5xl">

                                <h2>Complementaire muziekstemmingen</h2>



                            </div>

                            <div className="column w-hug AML P35 spacing-5xl">


                                <div className="column spacing-4xl">
                                    <p>{musicMoodColoursContent.complementair.s3p1}</p>
                                    <p>{musicMoodColoursContent.complementair.s3p2}</p>
                                    <p>{musicMoodColoursContent.complementair.s3p3}</p>
                                </div>

                            </div>

                        </div>

                    </div>

                   


                            <VsKleurenCarousel />

                    


                </div>

                {/* 5. NEURO (Muziekale kaart) */}
                <div className="column w-fill AMC P20 spacing-6xl" id="neurotransmitters_4">

                    <div className="column w-fix AML constrainer spacing-2xl">

                        <div className="column w-hug AML P30 spacing-2xl">

                            <div className="column w-hug AML P35 spacing-5xl">



                                <h2>Muziekale kaart</h2>


                            </div>





                            <div className="column w-hug AML P35 spacing-5xl">

                                <p>{musicMoodColoursContent.neuro.s4p1}</p>

                            </div>

                            <div className="column w-hug AML P35 spacing-5xl">

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

                            </div>

                            <div className="column w-hug AML P35 spacing-5xl">

                                <p>{musicMoodColoursContent.neuro.s4p5}</p>

                            </div>

                            <div className="column w-fill AML P35 spacing-5xl">

                                <KubusNeuro />

                            </div>

                            <div className="column w-hug AML P35 spacing-5xl">

                                <p>{musicMoodColoursContent.neuro.s4p6}</p>
                            </div>

                            <div className="column w-fill AML P35 spacing-5xl">
                                <KubusHoeken />
                            </div>

                            <div className="column w-hug AML P35 spacing-5xl">
                                <p>{musicMoodColoursContent.neuro.s4p7}</p>
                            </div>

                            <div className="column w-fill AML P35 spacing-5xl">

                                <Erlenmeyers />
                            </div>




                        </div>

                    </div>

                </div>

                {/* 6. CONCLUSIE */}
                <div className="column w-fill AMC P20 spacing-6xl" id="conclusie_5">

                    <div className="column w-fix AML constrainer spacing-2xl">

                        <div className="column w-hug AML P30 spacing-2xl">

                            <div className="column w-hug AML P35 spacing-5xl">


                                <h2>Conclusie</h2>


                            </div>

                            <div className="column w-hug AML P35 spacing-5xl">


                                <div className="column spacing-4xl">

                                    <p>{musicMoodColoursContent.conclusie.s5p1}</p>
                                    <p>{musicMoodColoursContent.conclusie.s5p2}</p>
                                    <p>{musicMoodColoursContent.conclusie.s5p3}</p>

                                </div>
                            </div>
                        </div>
                    </div>

                </div>




            </div>
            <ContactForm />



        </main >
    );
}