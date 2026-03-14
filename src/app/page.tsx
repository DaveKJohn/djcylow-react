import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { homeContent } from "@/content/home";
import ReadMore from "@/components/ui/ReadMore";
import ContactForm from "@/components/sections/ContactForm";
import MeetTheDJ from "@/components/home/MeetTheDJ";
import Diensten from "@/components/home/Diensten";
import LazyVideo from "@/components/common/LazyVideo";


export const metadata: Metadata = {
    title: homeContent.title,
    description: homeContent.description,
    alternates: {
        canonical: "https://www.djcylow.com/",
    },
    openGraph: {
        type: "website",
        url: "https://www.djcylow.com/",
        title: homeContent.title,
        description: homeContent.description,
    },
};

export default function HomePage() {
    return (
        <main>
            {/* Banner Index Sectie */}

            {/* Main Content Wrapper */}

            <section className="column wrapper stack WoB" id="hero">

                <div className="column wrapper layer back gradient"></div>


                <div className="column wrapper layer middle photo">
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




                <div className="column text-constrainer spacing-7xl layer front text">

                    <div className="column text-wrapper spacing-xl">
                        <h1>{homeContent.title}</h1>
                        <h2 dangerouslySetInnerHTML={{ __html: homeContent.subtitle || "" }} />
                    </div>

                    <div className="row wrapper spacing-3xl button-group">
                        <Link className="btn cta" href="/diensten">
                            <span>Boek nu!</span>
                        </Link>
                        <Link className="btn passive" href="/musicmoodcolours">
                            <span>Lees meer</span>
                        </Link>
                    </div>
                </div>
            </section>

            <section className="column index text-wrapper spacing-9xl">

                {/*<MeetTheDJ />*/}
                {/*<Diensten />  */}


                {/* Promo Sectie */}
                <div className="column wrapper center WoB" id="promo">
                    <div className="column constrainer">
                        <div className="column text-wrapper spacing-4xl">
                            <div className="column text-wrapper header flex">
                                <h2 dangerouslySetInnerHTML={{ __html: homeContent.promo_h3 || "" }} />
                            </div>

                            <div className="row wrapper flex spacing-5xl v-start">
                                {/* De nieuwe, schone manier */}
                                <LazyVideo
                                    videoId="YLNznh1ixT8"
                                    thumbnail="https://i.ytimg.com/vi/YLNznh1ixT8/hqdefault.jpg"
                                />

                                <div className="column text-wrapper spacing-3xl right story h-start" id="promo_story">
                                    <ReadMore
                                        teaser={<p>{homeContent.promo_story_p_one}</p>}
                                        hiddenContent={
                                            <>
                                                <p>{homeContent.promo_story_p_two}</p>
                                                <p>{homeContent.promo_story_p_three}</p>
                                            </>
                                        }
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Verzoeknummers Sectie */}
                <div className="column wrapper center WoB" id="verzoeknummers">
                    <div className="constrainer">
                        <div className="column text-wrapper spacing-4xl flex">
                            <div className="column text-wrapper flex header">
                                <h2 dangerouslySetInnerHTML={{ __html: homeContent.verzoeknummers_h3 || "" }} />
                            </div>

                            <div className="row wrapper flex spacing-5xl v-start">
                                <div className="column wrapper spacing-3xl left">
                                    <Image
                                        src="/images/verzoek.webp"
                                        width={400}
                                        height={400}
                                        alt="verzoek"
                                    />
                                </div>

                                <div className="column text-wrapper spacing-3xl right story h-start" id="verzoeknummers_story">
                                    <ReadMore
                                        teaser={
                                            <p>{homeContent.verzoeknummers_story_p_one}</p>
                                        }
                                        hiddenContent={
                                            <>
                                                <p>{homeContent.verzoeknummers_story_p_two}</p>
                                                <p>{homeContent.verzoeknummers_story_p_three}</p>
                                                <p>{homeContent.verzoeknummers_story_p_four}</p>
                                            </>
                                        }
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>



                <ContactForm />


            </section> {/* Sluiting van de Main Content Wrapper */}
        </main>
    );
}