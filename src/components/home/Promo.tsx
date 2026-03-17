"use client";
import React, { useState } from 'react';
import '@/styles/components/home/promo.scss';

import { homeContent } from "@/content/home";
import ReadMore from "@/components/ui/ReadMore";


const Promo = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const videoId = "YLNznh1ixT8";
    const thumbnail = "https://i.ytimg.com/vi/YLNznh1ixT8/hqdefault.jpg";

    return (
        <div className="fullscreen stack WoB" id="promo">
            <div className="column background gradient"></div>

            <div className="row foreground flex constrainer spacing-6xl front">
                
                {/* Video Sectie */}
                <div
                    className={`video ${isPlaying ? 'is-playing' : ''}`}
                    onClick={() => !isPlaying && setIsPlaying(true)}
                >
                    <div
                        className="lazyload-wrapper"
                        style={{
                            backgroundImage: !isPlaying ? `url(${thumbnail})` : 'none'
                        }}
                    >
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

                {/* Tekst Sectie */}
                <div className="column v-center spacing-4xl left">
                    <h2 dangerouslySetInnerHTML={{ __html: homeContent.promo_h3 || "" }} />

                    <div className="read-more-section">
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
    );
};

export default Promo;