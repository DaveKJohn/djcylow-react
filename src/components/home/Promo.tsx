"use client";
import React, { useState } from 'react';
import '@/styles/components/home/promo.scss';
import { homeContent } from "@/content/home";
import ReadMore from "@/components/ui/ReadMore";

const Promo = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false); // Nieuwe state voor hoogte

    const videoId = "YLNznh1ixT8";
    const thumbnail = "https://i.ytimg.com/vi/YLNznh1ixT8/hqdefault.jpg";


    return (
        <div className="fullscreen stack WoB" id="promo">
            <div className="column background gradient"></div>

            {/* Zet de class HIER op de foreground */}
            <div className={`row foreground flex constrainer spacing-6xl front ${isExpanded ? 'is-expanded' : ''}`}>

                <div className={`video ${isPlaying ? 'is-playing' : ''}`} onClick={() => !isPlaying && setIsPlaying(true)}>
                    <div className="lazyload-wrapper" style={{ backgroundImage: !isPlaying ? `url(${thumbnail})` : 'none' }}>
                        {!isPlaying ? <div className="play-button"></div> :
                            <iframe src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`} allow="autoplay; picture-in-picture" allowFullScreen></iframe>}
                    </div>
                </div>

                <div className="column v-center spacing-4xl left">
                    <h2 dangerouslySetInnerHTML={{ __html: homeContent.promo_h3 || "" }} />
                    <ReadMore
                        onToggle={(state) => setIsExpanded(state)}
                        teaser={<p>{homeContent.promo_story_p_one}</p>}
                        hiddenContent={<p>{homeContent.promo_story_p_two}</p>}
                    />
                </div>
            </div>
        </div>
    );
};

export default Promo;