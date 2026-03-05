'use client';

import { useState, useRef, useEffect } from 'react';

interface AudioPlayerProps {
  id: string;
  src: string;
  image: string;
}

export default function AudioPlayer({ id, src, image }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [prevVolume, setPrevVolume] = useState(1);

  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || !isFinite(seconds)) return "00:00";
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    const formattedMins = String(mins).padStart(2, '0');
    const formattedSecs = String(secs).padStart(2, '0');
    return hrs > 0 ? `${hrs}:${formattedMins}:${formattedSecs}` : `${formattedMins}:${formattedSecs}`;
  };

  const handlePlay = async () => {
    if (audioRef.current) {
      setIsLoading(true);
      try {
        await audioRef.current.play();
        setIsPlaying(true);
      } catch (err) {
        console.error("Playback failed", err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handlePause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (audioRef.current) {
      if (volume > 0) {
        setPrevVolume(volume);
        setVolume(0);
        audioRef.current.volume = 0;
      } else {
        const target = prevVolume > 0.1 ? prevVolume : 1;
        setVolume(target);
        audioRef.current.volume = target;
      }
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (audioRef.current) audioRef.current.volume = val;
    if (val > 0.05) setPrevVolume(val);
  };

  const stateClass = isLoading ? 'is-loading' : isPlaying ? 'is-playing' : 'is-ready';

  return (
    <div className={`audioplayer-wrapper ${stateClass}`}>
      {/* Thumbnail */}
      <div 
        className="column overlay wrapper thumbnail" 
        style={{ backgroundImage: `url('${image}')` }}
      ></div>

      {/* Ready State */}
      <div className="column overlay wrapper center ready-wrapper">
        <div className="playfilters">
          <button aria-label="Speel audio af" onClick={handlePlay}>
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>
          </button>
        </div>
      </div>

      {/* Loading State */}
      <div className="column overlay wrapper loading-wrapper">
        <div className="loading spinner"></div>
      </div>

      {/* Playing State */}
      <div className="column overlay wrapper playing-wrapper">
        <div className="row wrapper timestamp-wrapper">
          <div className="column wrapper timestamp current">{formatTime(currentTime)}</div>
          <div className="column wrapper timestamp final">{formatTime(duration)}</div>
        </div>

        <div 
          className="row stack wrapper timeline-wrapper"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const percent = (e.clientX - rect.left) / rect.width;
            if (audioRef.current) audioRef.current.currentTime = percent * duration;
          }}
        >
          <div className="column overlay wrapper timeline total"></div>
          <div className="column overlay wrapper timeline progress" style={{ transform: `scaleX(${currentTime / duration || 0}) translateY(-50%)` }}></div>
        </div>

        <div className="row wrapper split center layer-wrapper">
          <div className="column wrapper pausefilters">
            <button aria-label="Pauzeer audio" onClick={handlePause}>
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
            </button>
          </div>

          <div className="row wrapper center volume-wrapper">
            <div className="column wrapper center left">
              <button aria-label="Audio dempen" onClick={toggleMute}>
                {volume > 0 ? (
                  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.81 5 3.53 5 6.71s-2.11 5.9-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.81 5 3.53 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg>
                )}
              </button>
            </div>
            <div className="column wrapper right">
              <input 
                type="range" 
                min="0" 
                max="1" 
                step="0.01" 
                value={volume} 
                onChange={handleVolumeChange} 
                aria-label="Volumeregeling"
              />
            </div>
          </div>
        </div>

        <audio 
          ref={audioRef}
          src={src}
          preload="metadata"
          onTimeUpdate={() => setCurrentTime(audioRef.current?.currentTime || 0)}
          onLoadedMetadata={() => setDuration(audioRef.current?.duration || 0)}
          onEnded={() => { setIsPlaying(false); setCurrentTime(0); }}
        />
      </div>
    </div>
  );
}