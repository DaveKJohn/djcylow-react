"use client";
import { useState } from "react";

export default function LazyVideo({ videoId, thumbnail }: { videoId: string; thumbnail: string }) {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div 
      className={`column stack wrapper spacing-h7 left ${isPlaying ? 'is-playing' : ''}`} 
      onClick={() => setIsPlaying(true)}
      style={{ cursor: 'pointer' }}
    >
      {!isPlaying ? (
        <>
          <div className="column overlay wrapper">
            <div 
              className="lazyload-wrapper" 
              style={{ backgroundImage: `url(${thumbnail})` }}
            ></div>
          </div>
          <div className="column overlay wrapper">
            <div className="play-button"></div>
          </div>
        </>
      ) : (
        <div className="column overlay wrapper">
          <div className="lazyload-wrapper loaded">
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`}
              frameBorder="0"
              allow="autoplay; picture-in-picture"
              allowFullScreen
              style={{ width: '100%', height: '100%', position: 'absolute' }}
            ></iframe>
          </div>
        </div>
      )}
    </div>
  );
}