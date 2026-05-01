import React from 'react';
import { homeContent } from "@/content/home";
import Link from "next/link";

// @ts-ignore
import '@/styles/components/home/hero.scss';


const Hero = () => {
    return (
        <div className="WoB stack w-fill AMC-BC P10 fullscreen break-s v-push-9xl fill-100" id="hero">            

            <div className="layer AMC gradient" id="hero_back"></div>

            <div className="layer ATC visual" id="hero_middle">
                <img
                    className="hero-img-desktop"
                    src={homeContent.heroImageDesktop}
                    alt="heroDesktop"
                />
                <img
                    className="hero-img-mobile"
                    src={homeContent.heroImageMobile}
                    alt="heroMobile"
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