import React from 'react';
import '@/styles/components/home/verzoeknummers.scss';

import { homeContent } from "@/content/home";
import Image from 'next/image'; 
import ReadMore from "@/components/ui/ReadMore";




const Promo = () => {
    return (
        <section className="fullscreen column center WoB" id="verzoeknummers">
            <div className="column constrainer">
                <div className="column spacing-4xl flex">
                    <div className="column flex header">
                        <h2 dangerouslySetInnerHTML={{ __html: homeContent.verzoeknummers_h3 || "" }} />
                    </div>

                    <div className="column flex spacing-5xl v-start">
                        <div className="column spacing-3xl left">
                            <Image
                                src="/images/verzoek.webp"
                                width={400}
                                height={400}
                                alt="verzoek"
                            />
                        </div>

                        <div className="column spacing-3xl right story h-start" id="verzoeknummers_story">
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
        </section>
    );
};

export default Promo;