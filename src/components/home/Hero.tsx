import React from 'react';
import { getLocale } from 'next-intl/server';
import { getHomeContent } from "@/content/home";
import { Link } from "@/i18n/navigation";

// @ts-ignore
import '@/styles/components/home/hero.scss';


const Hero = async () => {
    const locale = await getLocale();
    const content = getHomeContent(locale);

    return (
        <div className="WoB stack w-fill AMC-BC P15 fullscreen break-s v-push-7xl fill-100" id="hero">

            <div className="layer AMC gradient" id="hero_back"></div>

            <div className="layer ATC visual" id="hero_middle">
                <img
                    className="hero-img-desktop"
                    src={content.heroImageDesktop}
                    alt="heroDesktop"
                />
                <img
                    className="hero-img-mobile"
                    src={content.heroImageMobile}
                    alt="heroMobile"
                />
            </div>

            <div className="column w-fill AMC P20" id="hero_front">

                <div className="column w-fix constrainer AML-C break-s spacing-2xl">

                    <div className="column w-hug AMC P30">
                        <div className="column w-hug P35 AML-C break-s spacing-2xl text-wrapper">
                            <h1>{content.title}</h1>
                            <h2 dangerouslySetInnerHTML={{ __html: content.subtitle || "" }} />
                        </div>
                    </div>

                    <div className="column w-hug AMC P30">

                        <div className="row w-hug AMC P35 spacing-2xl button-group">
                            <Link className="btn cta" href="/diensten">
                                <span>{content.heroBookNow}</span>
                            </Link>
                            <Link className="btn passive" href="/musicmoodcolours">
                                <span>{content.heroReadMore}</span>
                            </Link>
                        </div>
                    </div>

                </div>
            </div>



        </div >
    );
};

export default Hero;
