import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { homeContent } from "@/content/home";
import ReadMore from "@/components/ui/ReadMore";
import ContactForm from "@/components/sections/ContactForm";
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
            <section className="column stack wrapper pattern WoB" id="banner_index">
                <div className="column overlay stack wrapper spacing-l feather">
                    <div className="column overlay spacing-m bottom"></div>
                </div>

                <div className="column overlay constrainer spacing-l header">
                    <div className="column banner-wrapper spacing-xxl">
                        <div className="column text-wrapper spacing-s center">
                            <h1>{homeContent.title}</h1>
                            <h2 dangerouslySetInnerHTML={{ __html: homeContent.subtitle || "" }} />
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content Wrapper */}
            <section className="column index text-wrapper spacing-xxl">

                {/* Hero / Meet the DJ */}
                <div className="column wrapper spacing-xxl WoB" id="hero">
                    <div className="column stack constrainer hero">
                        <div className="column overlay wrapper hero_wrapper">
                            <Image
                                src="/images/face.webp"
                                width={500}
                                height={500}
                                alt="Dave Kok" 
                                priority
                                sizes="(max-width: 768px) 100vw, 500px"
                                style={{ height: 'auto', width: 'auto' }}
                            />
                        </div>

                        <div className="column overlay text-wrapper spacing-m hero_container anchor">
                            <div className="column text-wrapper header">
                                <h2 dangerouslySetInnerHTML={{ __html: homeContent.intro_h3 || "" }} />
                            </div>

                            {/* HIER GEBRUIKEN WE NU DE COMPONENT */}
                            <ReadMore
                                teaser={
                                    <p className="size-m">{homeContent.intro_story_p_one}</p>
                                }
                                hiddenContent={
                                    <>
                                        <p className="size-m">{homeContent.intro_story_p_two}</p>
                                        <p className="size-m" dangerouslySetInnerHTML={{ __html: homeContent.intro_story_p_three || "" }} />
                                        <p className="size-m">{homeContent.intro_story_p_four}</p>
                                    </>
                                }
                            />
                        </div>
                    </div>
                </div>

                {/* Diensten Sectie */}
                <div className="column wrapper center WoB" id="diensten">
                    <div className="column constrainer">
                        <div className="column text-wrapper spacing-m center flex">
                            <div className="column text-wrapper spacing-m header center">
                                <h2 dangerouslySetInnerHTML={{ __html: homeContent.diensten_h3 || "" }} />
                                <p className="subheader">Kies één van de onderstaande opties die het meest aansluit op jou wens.</p>
                            </div>

                            <div className="row wrapper spacing-s wrap flex buttons">
                                <Link className="btn passive size-m diensten-btn" href="/diensten/bruiloft-dj">Bruiloft DJ</Link>
                                <Link className="btn passive size-m diensten-btn" href="/diensten/bedrijfsfeest-dj">Bedrijfsfeest DJ</Link>
                                <Link className="btn passive size-m diensten-btn" href="/diensten/house-dj">House DJ</Link>
                                <Link className="btn passive size-m diensten-btn" href="/diensten">Iets anders!</Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Promo Sectie */}
                <div className="column wrapper center WoB" id="promo">
                    <div className="column constrainer">
                        <div className="column text-wrapper spacing-m">
                            <div className="column text-wrapper header flex">
                                <h2 dangerouslySetInnerHTML={{ __html: homeContent.promo_h3 || "" }} />
                            </div>

                            <div className="row wrapper flex v-start">
                                {/* De nieuwe, schone manier */}
                                <LazyVideo
                                    videoId="YLNznh1ixT8"
                                    thumbnail="https://i.ytimg.com/vi/YLNznh1ixT8/hqdefault.jpg"
                                />

                                <div className="column text-wrapper spacing-m right story h-start" id="promo_story">
                                    <ReadMore
                                        teaser={<p className="size-m">{homeContent.promo_story_p_one}</p>}
                                        hiddenContent={
                                            <>
                                                <p className="size-m">{homeContent.promo_story_p_two}</p>
                                                <p className="size-m">{homeContent.promo_story_p_three}</p>
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
                        <div className="column text-wrapper spacing-m flex">
                            <div className="column text-wrapper flex header">
                                <h2 dangerouslySetInnerHTML={{ __html: homeContent.verzoeknummers_h3 || "" }} />
                            </div>

                            <div className="row wrapper flex v-start">
                                <div className="column wrapper spacing-xs left">
                                    <Image
                                        src="/images/verzoek.webp"
                                        width={400}
                                        height={400}
                                        alt="verzoek"
                                        className="responsive-image" // Gebruik een class voor centrale styling
                                        style={{
                                            width: '100%',     // Neemt de breedte van de container aan
                                            maxWidth: '400px',  // Wordt nooit groter dan het origineel
                                            height: 'auto'      // Behoudt de verhouding
                                        }}
                                    />
                                </div>

                                <div className="column text-wrapper spacing-m right story h-start" id="verzoeknummers_story">
                                    <ReadMore
                                        teaser={
                                            <p className="size-m">{homeContent.verzoeknummers_story_p_one}</p>
                                        }
                                        hiddenContent={
                                            <>
                                                <p className="size-m">{homeContent.verzoeknummers_story_p_two}</p>
                                                <p className="size-m">{homeContent.verzoeknummers_story_p_three}</p>
                                                <p className="size-m">{homeContent.verzoeknummers_story_p_four}</p>
                                            </>
                                        }
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contactformulier Sectie */}
                <section className="column wrapper center v-push-xl BoW border-top" id="contactformulier">
                    <ContactForm />
                </section>

            </section> {/* Sluiting van de Main Content Wrapper */}
        </main>
    );
}