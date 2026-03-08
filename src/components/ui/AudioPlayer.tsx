'use client';

import { useState, useRef, useEffect } from 'react';

interface AudioPlayerProps {
  id: string;
  src: string;
  image: string;
  showVolumeSlider?: boolean;
  onPlay?: (id: string) => void;
  activeId?: string | null;
  className?: string; // Voeg deze regel toe aan je interface!
}

export default function AudioPlayer({
  id,
  src,
  image,
  showVolumeSlider = true,
  onPlay,
  activeId,
  className = ""
}: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);

  useEffect(() => {
    if (activeId !== undefined && activeId !== null && activeId !== id && isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
    }
  }, [activeId, id, isPlaying]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const formatTime = (time: number) => {
    if (isNaN(time)) return "00:00";
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleTogglePlay = async () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      setIsLoading(true);
      if (onPlay) onPlay(id);
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

  const stateClass = isLoading ? 'is-loading' : isPlaying ? 'is-playing' : 'is-ready';

  return (
    <div className={`column stack wrapper audioplayer-wrapper ${stateClass} ${className}`} data-id={id}>

      {/* Thumbnail */}
      <div
        className="column overlay wrapper thumbnail"
        style={{ backgroundImage: `url('${image}')` }}
      ></div>

      {/* Ready Wrapper */}
      <div className="column overlay wrapper center ready-wrapper">
        <div className="playfilters">
          <button onClick={handleTogglePlay} aria-label="Speel audio af">
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M8 5v14l11-7z"></path>
            </svg>
          </button>
        </div>
      </div>

      {/* Loading Wrapper */}
      <div className="column overlay wrapper loading-wrapper">
        <div className="loading spinner"></div>
      </div>

      {/* Playing Wrapper */}
      <div className="column overlay wrapper playing-wrapper">

        <div className="row wrapper timestamp-wrapper">
          <div className="column wrapper timestamp current">{formatTime(currentTime)}</div>
          <div className="column wrapper timestamp final">{formatTime(duration)}</div>
        </div>

        <div
          className="row stack wrapper center timeline-wrapper"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const percent = (e.clientX - rect.left) / rect.width;
            if (audioRef.current) audioRef.current.currentTime = percent * duration;
          }}
        >
          <div className="column overlay wrapper timeline total"></div>
          <div
            className="column overlay wrapper timeline progress"
            style={{ width: `${(currentTime / duration) * 100 || 0}%` }}
          ></div>
        </div>

        <div className="row wrapper split center layer-wrapper">
          <div className="column wrapper pausefilters">
            <button onClick={handleTogglePlay} aria-label="Pauzeer audio">
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"></path>
              </svg>
            </button>
          </div>

          <div className="row wrapper center volume-wrapper">
            <div className="column wrapper center left">
              <button
                aria-label="Audio dempen"
                onClick={() => setVolume(volume === 0 ? 1 : 0)}
              >
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.81 5 3.53 5 6.71s-2.11 5.9-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"></path>
                </svg>
              </button>
            </div>

            {showVolumeSlider && (
              <div className="column wrapper right">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  aria-label="Volumeregeling"
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <audio
        ref={audioRef}
        src={src}
        preload="none"
        onTimeUpdate={() => setCurrentTime(audioRef.current?.currentTime || 0)}
        onLoadedMetadata={() => setDuration(audioRef.current?.duration || 0)}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
      />
    </div>
  );
}