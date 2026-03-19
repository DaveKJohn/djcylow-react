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
        <div className="stack fullscreen WoB" id="promo">
            <div className="column layer gradient"></div>

            {/* Zet de class HIER op de foreground */}
            <div className={`row layer text flex full-w constrainer spacing-6xl  ${isExpanded ? 'is-expanded' : ''}`}>

                <div className={`stack video ${isPlaying ? 'is-playing' : ''}`} onClick={() => !isPlaying && setIsPlaying(true)}>
                    <div className="lazyload-wrapper" style={{ backgroundImage: !isPlaying ? `url(${thumbnail})` : 'none' }}>
                        {!isPlaying ? <div className="play-button"></div> :
                            <iframe src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`} allow="autoplay; picture-in-picture" allowFullScreen></iframe>}
                    </div>
                </div>

                <div className="column full-w h-start spacing-4xl">
                    <h2 dangerouslySetInnerHTML={{ __html: homeContent.promo_h3 || "" }} />
                    <ReadMore
                        onToggle={(state) => setIsExpanded(state)}
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
    );
};

export default Promo;