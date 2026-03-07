'use client';

import React from 'react';
import BasiskleurenCarousel from '@/components/canvas/BasiskleurenCarousel';
import CanvasCircle from '@/components/canvas/CanvasCircle';
import VsKleurenCarousel from '@/components/canvas/VsKleurenCarousel';
import KubusNeuro from '@/components/canvas/KubusNeuro';
import KubusHoeken from '@/components/canvas/KubusHoeken';
import Erlenmeyers from '@/components/canvas/Erlenmeyers';
import ContactForm from "@/components/sections/ContactForm";

const CONTENT = {
    intro: {
        s1p1: "Naarmate je muziekcollectie groeit, wordt het soms een uitdaging om het overzicht te behouden. Helemaal als je een brede muzieksmaak hebt. De logische stap is dan om je bibliotheek in te delen op genre of artiest. Dat werkt uitstekend om de boel visueel op orde te krijgen, maar toch dekt het niet altijd de lading van het moment.",
        s1p2: "Ik merkte bij mezelf dat ik behoefte had aan een diepere laag dan alleen het genre. Die zoektocht begon al op mijn veertiende, toen ik animaties maakte en ontdekte hoe bepalend muziek is voor de sfeer van een beeld. Jaren later kon ik die kennis direct toepassen in mijn rol als DJ Cylow. In de DJ-booth moet ik de sfeer op de dansvloer feilloos aanvoelen, maar diezelfde logica gebruik ik ook in het dagelijks leven. Want hoewel je al je opgeslagen nummers geweldig vindt, vraagt de explosieve energie van het sporten nu eenmaal om een heel andere soundtrack dan de diepe focus tijdens het studeren.",
        s1p3: "Ik laat je zien hoe ik mijn muziek categoriseer op basis van muziekstemmingen en waarom dat de luisterervaring voor mij nog krachtiger maakt."
    },
    spectrum: {
        s2p1: "Om die verschillende muziekstemmingen tastbaar te maken, maak ik gebruik van een visuele vergelijking. In het kleurenspectrum bestaan miljoenen kleuren, maar om mijn verhaal helder te houden, focus ik mij alleen op de acht meest herkenbare basiskleuren. Door een muziekstemming aan een specifieke kleur te koppelen, wordt het makkelijker om de sferen voor je te zien en ze een plek te geven in je bibliotheek.",
        s2p2: "Om te laten horen hoe dit werkt, heb ik acht fragmenten gekozen die qua instrumentatie en genre vrijwel identiek zijn. Juist door die basis hetzelfde te houden, hoor je pas echt hoe groot de impact van een specifieke muziekstemming is. Kleine nuances in de compositie zorgen voor een compleet andere energie; het zijn juist die details die het fundamentele verschil in sfeer maken.",
        s2p3: "De omschrijvingen zoals 'Verdriet' of 'Dankbaar' die onder de muziekfragmenten staan, moet je niet zien als een absolute waarheid. Muziek is een persoonlijke ervaring die gevormd wordt door je eigen leven en herinneringen; wat mij doet denken aan verdriet, roept bij jou misschien een heel ander beeld op. Ik ben me ervan bewust dat deze woorden voor iedereen een andere lading hebben. De omschrijvingen zijn slechts een tool om de verschillende sferen in de muziek van elkaar te kunnen onderscheiden.",
        s2p4: "Uiteindelijk draait dit systeem vooral om het verschil tussen de kleuren. Hoe je een stemming ook noemt, je voelt direct dat 'paars' een heel andere energie heeft dan 'geel'. Paars voelt nu zwaarder of ingetogener aan, ook als geel voor jou niet per se 'vrolijk' hoeft te zijn. Het gaat er niet om dat we de exacte definitie van een woord vinden, maar dat je de verschuiving in sfeer herkent."
    },
    complementair: {
        s3p1: "Net als op een kleurenwiel bestaan er in muziek ook tegenpolen: stemmingen die lijnrecht tegenover elkaar staan. Wanneer je deze uitersten direct naast elkaar zet, ontstaat er een maximaal contrast dat de sfeer in één klap kan laten omslaan.",
        s3p2: "Zo’n overgang tussen twee uitersten zorgt voor een scherpe breuk die je als luisteraar direct uit de flow kan halen. Als DJ is dit systeem voor mij essentieel om die flow te bewaken. Door te weten welke stemmingen met elkaar botsen, voorkom ik dat ik een nummer kies dat de sfeer op de dansvloer onbedoeld verstoort.",
        s3p3: "Hieronder vind je vier duo's van muziekstemmingen die lijnrecht tegenover elkaar staan. Luister en ervaar hoe de sfeer abrupt kantelt wanneer je de duo's na elkaar hoort. Dit is de plek waar je waarschijnlijk het meest direct ervaart hoe een muzikale verschuiving de hele beleving van een fragment transformeert."
    },
    neuro: {
        s4p1: "Dat we het verschil tussen de fragmenten kunnen voelen, komt waarschijnlijk doordat het verankerd zit in onze biologie. Volgens het Lövheim Cube-model kunnen we onze emoties in kaart brengen als een driedimensionale matrix, opgebouwd uit de volgende drie neurotransmitters:",
        dopamine: "Het 'beloningssysteem'. Het is de motor achter motivatie, genot en focus. Wanneer dit niveau stijgt, voelen we de drang om doelen na te streven en successen te vieren.",
        serotonine: "De 'regulator'. Deze stof bepaalt onze innerlijke rust en zelfvertrouwen. Een hoog niveau zorgt voor een gevoel van status en tevredenheid, terwijl een tekort vaak omslaat in angst of onrust.",
        adrenaline: "De 'actie-stof'. Het reguleert onze alertheid en energie. Het is de knop die ons klaarmaakt voor actie en opwinding, of ons juist in een staat van passiviteit en rust brengt bij lage niveaus.",
        s4p5: "In het model van Lövheim vormt elke neurotransmitter een eigen as: de hoogte van de adrenaline, de diepte van de dopamine en de breedte van de serotonine. Samen vormen zij de ribben van een kubus.",
        s4p6: "Wanneer we mijn acht basiskleuren koppelen aan de hoeken van deze kubus, ontstaat er een soort biologische kaart van onze emoties. Mijn theorie is dat deze kaart voor emoties direct vertaalbaar is naar muziekstemmingen.",
        s4p7: "In het interactieve gedeelte hieronder kun je zelf experimenteren met je hersenchemie. Klik op de erlenmeyers om de neurotransmitters aan te vullen of te legen, en ervaar direct hoe de muziekstemming mee verandert met de inhoud van het glas."
    },
    conclusie: {
        s5p1: "Een gesprek voeren over muziekstemmingen is uit mijn ervaring altijd lastig gebleken. Muziek blijft een diep persoonlijke ervaring; iedereen maakt eigen associaties op basis van levenservaring, herinneringen en cultuur.",
        s5p2: "Music Mood Colours maakt de relatie tussen onze hersenchemie en muziekstemmingen meer tastbaar. Het is een tool die de ongrijpbare kracht van muziek in kaart kan brengen en het biedt een kader om de sfeer van een track makkelijker aan te duiden, los van het genre.",
        s5p3: "Ik ben dan ook erg benieuwd hoe jij de muziekfragmenten hebt ervaren. Geloof jij dat een indeling op basis van stemming je kan helpen om meer uit je muziekcollectie te halen? Of denk je dat het indelen op genre en artiest altijd de basis zal blijven? Deel je gedachten of stel je vraag via het formulier hieronder, dan spreken we elkaar snel!"
    }
};

export default function MusicMoodColoursPage() {
    return (
        <main className="musicmoodcolours">
            {/* 1. BANNER */}
            <section className="column stack wrapper pattern WoB" id="banner_2">
                <div className="stack overlay wrapper spacing-xl feather">
                    <div className="column overlay spacing-m sides"></div>
                    <div className="column overlay spacing-m bottom"></div>
                </div>
                <div className="column overlay constrainer spacing-xl header">
                    <div className="column banner-wrapper spacing-xxl center">
                        <div className="column text-wrapper spacing-s left">
                            <h1>Music Mood Colours</h1>
                        </div>
                    </div>
                </div>
            </section>

            <section className="column text-wrapper spacing-xl WoB">

                {/* 2. INTRO */}
                <div className="column text-wrapper spacing-m" id="intro_1">
                    <div className="column constrainer">
                        <div className="column text-wrapper spacing-xl">
                            <p className="size-m">{CONTENT.intro.s1p1}</p>
                        </div>
                    </div>
                    <div className="column constrainer">
                        <div className="column text-wrapper spacing-xl">
                            <p className="size-m">{CONTENT.intro.s1p2}</p>
                        </div>
                    </div>
                    <div className="column constrainer">
                        <div className="column text-wrapper spacing-xl">
                            <p className="size-m">{CONTENT.intro.s1p3}</p>
                        </div>
                    </div>
                </div>

                {/* 3. KLEURENSPECTRUM */}
                <div className="column text-wrapper spacing-m" id="kleurenspectrum_2">
                    <div className="column constrainer header">
                        <div className="text-wrapper spacing-xl column header">
                            <h2>Het kleurenspectrum van muziek</h2>
                        </div>
                    </div>
                    <div className="column constrainer">
                        <div className="column text-wrapper spacing-xl">
                            <p className="size-m">{CONTENT.spectrum.s2p1}</p>
                        </div>
                    </div>
                    <div className="column constrainer">
                        <div className="column stack wrapper spacing-xl black-90-bg in-push-l" id="canvas_circle">
                            <CanvasCircle />
                        </div>
                    </div>
                    <div className="column constrainer">
                        <div className="column text-wrapper spacing-xl">
                            <p className="size-m">{CONTENT.spectrum.s2p2}</p>
                        </div>
                    </div>

                    <BasiskleurenCarousel />

                    <div className="column constrainer">
                        <div className="column text-wrapper spacing-xxs">
                            <h3>De taal van emotie</h3>
                            <p className="size-m">{CONTENT.spectrum.s2p3}</p>
                            <p className="size-m">{CONTENT.spectrum.s2p4}</p>
                        </div>
                    </div>
                </div>

                {/* 4. COMPLEMENTAIR */}
                <div className="column text-wrapper spacing-m" id="complementaire_kleuren_3">
                    <div className="column constrainer header">
                        <div className="column text-wrapper spacing-xl header">
                            <h2>Complementaire muziekstemmingen</h2>
                        </div>
                    </div>
                    <div className="column constrainer">
                        <div className="column text-wrapper spacing-xl">
                            <p className="size-m">{CONTENT.complementair.s3p1}</p>
                        </div>
                    </div>
                    <div className="column constrainer">
                        <div className="column text-wrapper spacing-xl">
                            <p className="size-m">{CONTENT.complementair.s3p2}</p>
                        </div>
                    </div>
                    <div className="column constrainer">
                        <div className="column text-wrapper spacing-xl">
                            <p className="size-m">{CONTENT.complementair.s3p3}</p>
                        </div>
                    </div>
                    <div className="row wrapper spacing-s visual carousels black-90-bg" id="vs">
                        <VsKleurenCarousel />
                    </div>
                </div>

                {/* 5. NEURO (Muziekale kaart) */}
                <div className="column text-wrapper spacing-m" id="neurotransmitters_4">
                    <div className="column constrainer header">
                        <div className="column text-wrapper spacing-xl">
                            <h2>Muziekale kaart</h2>
                        </div>
                    </div>
                    <div className="column constrainer">
                        <div className="column text-wrapper spacing-xl">
                            <p className="size-m">{CONTENT.neuro.s4p1}</p>
                        </div>
                    </div>
                    <div className="column constrainer">
                        <ul className="column text-wrapper spacing-s">
                            <li className="column text-wrapper spacing-xxs">
                                <h3>Dopamine</h3>
                                <p className="size-m">{CONTENT.neuro.dopamine}</p>
                            </li>
                            <li className="column text-wrapper spacing-xxs">
                                <h3>Serotonine</h3>
                                <p className="size-m">{CONTENT.neuro.serotonine}</p>
                            </li>
                            <li className="column text-wrapper spacing-xxs">
                                <h3>(nor)Adrenaline</h3>
                                <p className="size-m">{CONTENT.neuro.adrenaline}</p>
                            </li>
                        </ul>
                    </div>
                    <div className="column constrainer">
                        <div className="column text-wrapper spacing-xxs">
                            <p className="size-m">{CONTENT.neuro.s4p5}</p>
                        </div>
                    </div>
                    <div className="column constrainer visual">
                        <div className="column wrapper spacing-s black-90-bg in-push-m" id="canvas_3Dspace_3">
                            <KubusNeuro />
                        </div>
                    </div>
                    <div className="column constrainer">
                        <div className="column text-wrapper spacing-xxs">
                            <p className="size-m">{CONTENT.neuro.s4p6}</p>
                        </div>
                    </div>
                    <div className="column constrainer visual">
                        <div className="column wrapper spacing-s black-90-bg in-push-m" id="canvas_3Dspace">
                            <KubusHoeken />
                        </div>
                    </div>
                    <div className="column constrainer">
                        <div className="column text-wrapper spacing-xxs">
                            <p className="size-m">{CONTENT.neuro.s4p7}</p>
                        </div>
                    </div>
                    <div className="column constrainer visual">
                        <div className="column wrapper spacing-s black-90-bg in-push-l" id="canvas_erlenmeyers">
                            <Erlenmeyers />
                        </div>
                    </div>
                </div>

                {/* 6. CONCLUSIE */}
                <div className="column text-wrapper spacing-m" id="conclusie_5">
                    <div className="column constrainer">
                        <div className="column text-wrapper spacing-xl">
                            <p className="size-m">{CONTENT.conclusie.s5p1}</p>
                        </div>
                    </div>
                    <div className="column constrainer">
                        <div className="column text-wrapper spacing-xl">
                            <p className="size-m">{CONTENT.conclusie.s5p2}</p>
                        </div>
                    </div>
                    <div className="column constrainer">
                        <div className="column text-wrapper spacing-xl">
                            <p className="size-m">{CONTENT.conclusie.s5p3}</p>
                        </div>
                    </div>
                </div>

                <div className="column wrapper center BoW v-push-xl" id="contactformulier">
                    <ContactForm />
                </div>
            </section>
        </main>
    );
}