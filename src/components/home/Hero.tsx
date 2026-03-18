import React from 'react';
import '@/styles/components/home/hero.scss';

import { homeContent } from "@/content/home";
import Link from "next/link";


const Hero = () => {
    return (
        <div className="fullscreen stack WoB" id="hero">

            <div className="column layer gradient"></div>

            <div className="column layer visual">
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

            <div className="column layer text constrainer spacing-7xl">


                <div className="column spacing-2xl text-wrapper">
                    <h1>{homeContent.title}</h1>
                    <h2 dangerouslySetInnerHTML={{ __html: homeContent.subtitle || "" }} />
                </div>

                <div className="row spacing-3xl button-group">
                    <Link className="btn cta" href="/diensten">
                        <span>Boek nu!</span>
                    </Link>
                    <Link className="btn passive" href="/musicmoodcolours">
                        <span>Lees meer</span>
                    </Link>
                </div>
            </div>

        </div >
    );
};

export default Hero;