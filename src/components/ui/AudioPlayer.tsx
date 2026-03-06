'use client';

import { useState, useRef, useEffect } from 'react';

interface AudioPlayerProps {
  id: string;
  src: string;
  image: string;
  showVolumeSlider?: boolean;
  onPlay?: (id: string) => void; // Optioneel gemaakt
  activeId?: string | null;      // Optioneel gemaakt
  layerClass?: string;
  contentClass?: string;
}

export default function AudioPlayer({
  id, src, image, showVolumeSlider = true, onPlay, activeId, layerClass = "", contentClass = ""
}: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);

  // FIX: Alleen pauzeren als activeId is gezet EN het niet mijn ID is
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
    if (isNaN(time)) return "0:00";
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleTogglePlay = async () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      setIsLoading(true);
      // Geef aan de parent door dat we gaan spelen (voor de LuisterFilter)
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
    <div className={`content stack audioplayer-wrapper ${stateClass}`}>
      {/* Layer 1: Thumbnail */}
      <div className={`layer-1 ${layerClass} overlay column thumbnail`} style={{ backgroundImage: `url('${image}')` }}></div>

      {/* Layer 2: Ready (Play Button) */}
      <div className={`layer-2 ${layerClass} overlay column center ready-wrapper`}>
        <button className="btn" onClick={handleTogglePlay} aria-label="Speel audio af">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
        </button>
      </div>

      {/* Layer 3: Loading */}
      <div className={`layer-3 ${layerClass} overlay column loading-wrapper`}>
        <div className="loading spinner"></div>
      </div>

      {/* Layer 4: Playing (Controls) */}
      <div className={`layer-4 ${layerClass} overlay column playing-wrapper`}>
        <div className={`row-2 ${contentClass} row timestamp-wrapper`}>
          <div className={`col-1 ${layerClass} column timestamp current`}>{formatTime(currentTime)}</div>
          <div className={`col-2 ${layerClass} column timestamp final`}>{formatTime(duration)}</div>
        </div>

        <div className={`row-3 ${contentClass} stack column timeline-wrapper`} onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const percent = (e.clientX - rect.left) / rect.width;
          if (audioRef.current) audioRef.current.currentTime = percent * duration;
        }}>
          <div className={`layer-1 ${layerClass} overlay column timeline total`}></div>
          <div className={`layer-2 ${layerClass} overlay column timeline progress`} style={{ width: `${(currentTime / duration) * 100 || 0}%` }}></div>
        </div>

        <div className={`row-4 ${contentClass} row split layer-wrapper`}>
          <div className={`col-1 ${layerClass} column pausefilters`}>
            <button className="btn" onClick={handleTogglePlay} aria-label="Pauzeer audio">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>
            </button>
          </div>
          <div className={`col-2 ${layerClass} row column volume-wrapper`}>
            <div className={`col-1 ${contentClass} column left`}>
              <button className="btn" onClick={() => setVolume(volume === 0 ? 1 : 0)}>
                <svg viewBox="0 0 24 24" fill="currentColor">
                  {volume === 0 ? (
                    <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.81 5 3.53 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
                  ) : (
                    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.81 5 3.53 5 6.71s-2.11 5.9-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                  )}
                </svg>
              </button>
            </div>
            {showVolumeSlider && (
              <div className={`col-2 ${contentClass} column right`}>
                <input type="range" min="0" max="1" step="0.01" value={volume} onChange={(e) => setVolume(parseFloat(e.target.value))} />
              </div>
            )}
          </div>
        </div>
      </div>

      <audio
        ref={audioRef}
        src={src}
        onTimeUpdate={() => setCurrentTime(audioRef.current?.currentTime || 0)}
        onLoadedMetadata={() => setDuration(audioRef.current?.duration || 0)}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
        style={{ display: 'none' }}
      />
    </div>
  );
}