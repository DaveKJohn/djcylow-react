import React from 'react';
import { homeContent } from "@/content/home";
import Link from "next/link";

import '@/styles/components/home/hero.scss';


const Hero = () => {
    return (
        <div className="WoB stack w-fill AMC-BC P15 fullscreen break-s v-push-7xl fill-100" id="hero">            

            <div className="layer AMC gradient" id="hero_back"></div>

            <div className="layer ATC visual" id="hero_middle">
                {/* BEWUST <img> en geen next/image. Deze repo draait op `images: { unoptimized: true }`
                    (vereist voor de static export), dus next/image doet hier geen resizing en geen
                    formaatconversie -- precies de twee dingen waar de lint-regel om vraagt. Wat het
                    wel zou toevoegen is lazy loading, en dat is voor een hero juist ongewenst.

                    WEL EEN ECHT PROBLEEM, EN DAT IS GEMETEN: beide afbeeldingen staan in de DOM en
                    worden door de CSS met display:none geschakeld, terwijl een browser een <img src>
                    met display:none in de regel gewoon ophaalt. Een mobiele bezoeker downloadt dus
                    hero_desktop.webp (105 KB) bovenop de hero_mobile.webp (56 KB) die hij ziet --
                    bijna tweemaal de nuttige lading, juist op de verbinding waar dat het meest telt.
                    De oplossing is <picture> met een <source media=...>, zodat de browser er een
                    kiest. Dat vraagt ook een samenvoeging in hero.scss (de mobiele variant heeft een
                    eigen height/transform) en dus een blik op het resultaat; het staat daarom apart
                    en niet hier. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    className="hero-img-desktop"
                    src={homeContent.heroImageDesktop}
                    alt="DJ Cylow met koptelefoon achter zijn Pioneer DJ-controller"
                />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    className="hero-img-mobile"
                    src={homeContent.heroImageMobile}
                    alt="DJ Cylow met koptelefoon achter zijn Pioneer DJ-controller"
                />
            </div>

            <div className="column w-fill AMC P20" id="hero_front">

                <div className="column w-fix constrainer AML-C break-s spacing-2xl">

                    <div className="column w-hug AMC P30">
                        <div className="column w-hug P35 AML-C break-s spacing-2xl text-wrapper">
                            <h1>{homeContent.title}</h1>
                            <h2 dangerouslySetInnerHTML={{ __html: homeContent.subtitle || "" }} />
                        </div>
                    </div>

                    <div className="column w-hug AMC P30">

                        <div className="row w-hug AMC P35 spacing-2xl button-group">
                            <Link className="btn cta" href="/diensten">
                                <span>Boek nu!</span>
                            </Link>
                            <Link className="btn passive" href="/musicmoodcolours">
                                <span>Lees meer</span>
                            </Link>
                        </div>
                    </div>

                </div>
            </div>



        </div >
    );
};

export default Hero;