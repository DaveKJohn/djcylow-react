"use client";
import React, { useState } from 'react';
import { homeContent } from "@/content/home";
import ReadMore from "@/components/ui/ReadMore";

// @ts-ignore
import '@/styles/components/home/promo.scss';

const Promo = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false); // Nieuwe state voor hoogte

    const videoId = "YLNznh1ixT8";
    const thumbnail = "https://i.ytimg.com/vi/YLNznh1ixT8/hqdefault.jpg";


    return (
        <div className="WoB stack w-fill AMC P10 fullscreen v-push-7xl fill-100" id="promo">

            <div className="layer gradient" id="promo_back"></div>

            <div className="column w-fill AMC P20" id="promo_front">
        
                <div className={`column w-fix AMC constrainer  ${isExpanded ? 'is-expanded' : ''}`}>

                    <div className="row-c break-m w-fill AMC P30 spacing-2xl">

                        <div className="column w-fill AML P35 spacing-3xl">
                            <h2 dangerouslySetInnerHTML={{ __html: homeContent.promo_h3 || "" }} />
                            <ReadMore
                                onToggle={(state) => setIsExpanded(state)}
                                teaser={<p className="left">{homeContent.promo_story_p_one}</p>}
                                hiddenContent={
                                    <>
                                        <p className="left">{homeContent.promo_story_p_two}</p>
                                        <p className="left">{homeContent.promo_story_p_three}</p>
                                    </>
                                }
                            />
                        </div>




                        <div className={`column w-fix AMC P35 stack video ${isPlaying ? 'is-playing' : ''}`} onClick={() => !isPlaying && setIsPlaying(true)}>
                            <div className="lazyload-wrapper" style={{ backgroundImage: !isPlaying ? `url(${thumbnail})` : 'none' }}>
                                {!isPlaying ? (
                                    <div className="play-button"></div>
                                ) : (
                                    <iframe
                                        src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`}
                                        allow="autoplay; picture-in-picture"
                                        allowFullScreen
                                    ></iframe>
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>

    );
};

export default Promo;