import React from 'react';
import BasiskleurenCarousel from '@/components/canvas/BasiskleurenCarousel'; // Geen rood meer na herstart TS server
import CanvasCircle from '@/components/canvas/CanvasCircle';

export const metadata = {
    title: 'Music Mood Colours | DJ CYLOW',
    description: 'Ontdek hoe DJ Cylow muziek organiseert op basis van kleur en stemming. Leer de biologische blauwdruk achter elke track herkennen.',
    alternates: {
        canonical: 'https://www.djcylow.com/musicmoodcolours',
    },
};

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
                {/* 2. INTRO SECTIE */}
                <div className="column text-wrapper spacing-m" id="intro_1">
                    <div className="column constrainer">
                        <div className="column text-wrapper spacing-xl">
                            <p className="size-m">{CONTENT.intro.s1p1}</p>
                            <p className="size-m">{CONTENT.intro.s1p2}</p>
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

                    {/* Eerste Canvas: De Cirkel */}
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

                    {/* Tweede Canvas: De Carousel met fragmenten */}
                    <BasiskleurenCarousel />

                    <div className="column constrainer">
                        <div className="column text-wrapper spacing-xxs">
                            <h3>De taal van emotie</h3>
                            <p className="size-m">{CONTENT.spectrum.s2p3}</p>
                            <p className="size-m">{CONTENT.spectrum.s2p4}</p>
                        </div>
                    </div>
                </div>

                {/* 4. COMPLEMENTAIRE KLEUREN (Uitersten) */}
                <div className="column text-wrapper spacing-m" id="complementaire_kleuren_3">
                    <div className="column constrainer header">
                        <h2>Complementaire muziekstemmingen</h2>
                    </div>
                    <div className="column constrainer">
                        <p className="size-m">Uitleg over tegenpolen...</p>
                        <div className="row wrapper spacing-s visual carousels black-90-bg in-push-l" id="vs">
                            <div className="placeholder-box">Interactieve Audio Duo's</div>
                        </div>
                    </div>
                </div>

                {/* 5. NEUROTRANSMITTERS (De Kubus) */}
                <div className="column text-wrapper spacing-m" id="neurotransmitters_4">
                    <div className="column constrainer header">
                        <h2>Muzikale kaart</h2>
                    </div>
                    {/* Lijst met Dopamine, Serotonine, Adrenaline */}
                    <div className="column constrainer visual">
                        <div className="column wrapper spacing-s black-90-bg in-push-m">
                            <div className="placeholder-box">Lövheim Cube Matrix</div>
                        </div>
                    </div>
                    <div className="column constrainer visual">
                        <div className="column wrapper spacing-s black-90-bg in-push-l">
                            <div className="placeholder-box">Interactieve Erlenmeyers</div>
                        </div>
                    </div>
                </div>

                {/* 6. CONCLUSIE & CONTACT */}
                <div className="column text-wrapper spacing-m" id="conclusie_5">
                    <div className="constrainer column header">
                        <h2>Conclusie</h2>
                    </div>
                    <div className="column constrainer">
                        <p className="size-m">Muziek blijft diep persoonlijk...</p>
                    </div>
                </div>

                <div className="column wrapper center v-push-xl BoW" id="contactformulier">
                    {/* <ContactForm /> */}
                    <p>[Contactformulier Placeholder]</p>
                </div>
            </section>
        </main>
    );
}