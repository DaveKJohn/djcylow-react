'use client';

import React, { useMemo, useRef, useEffect, useState } from 'react';
import mixesData from '@/data/mixes.json';
import AudioPlayer from '@/components/ui/AudioPlayer';

const COLORS_CONFIG = [
  { id: 1, name: 'cyan', description: 'Vermaakt' },
  { id: 2, name: 'green', description: 'Dankbaar' },
  { id: 3, name: 'yellow', description: 'Ambitieus' },
  { id: 4, name: 'orange', description: 'Hoopvol' },
  { id: 5, name: 'red', description: 'Bang' },
  { id: 6, name: 'magenta', description: 'Geïrriteerd' },
  { id: 7, name: 'purple', description: 'Verdrietig' },
  { id: 8, name: 'blue', description: 'Onverschillig' },
];

export default function BasiskleurenCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [activeMixId, setActiveMixId] = useState<string | null>(null);

  const featuredMixes = useMemo(() => {
    return COLORS_CONFIG.map(config => {
      const mix = mixesData.find(m =>
        m.color.toLowerCase() === config.name.toLowerCase() &&
        m.featured === true &&
        m.ignore === true
      );
      return { ...config, mix };
    });
  }, []);

  const updateArrows = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftArrow(scrollLeft > 10);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      el.addEventListener('scroll', updateArrows);
      window.addEventListener('resize', updateArrows);
      updateArrows();
    }
    return () => {
      el?.removeEventListener('scroll', updateArrows);
      window.removeEventListener('resize', updateArrows);
    };
  }, []);

  const scroll = (direction: number) => {
    if (scrollRef.current) {
      const scrollAmount = 320;
      scrollRef.current.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="row wrapper spacing-s visual carousels black-90-bg in-push-l">
      <div className={`arrow left ${!showLeftArrow ? 'hidden' : ''}`} id="arrow-left-canvas" onClick={() => scroll(-1)}>
        <button className="btn">
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path fill="currentColor" fillRule="evenodd" d="M8.793 5.293a1 1 0 0 1 1.414 0l6 6a1 1 0 0 1 0 1.414l-6 6a1 1 0 0 1-1.414-1.414L14.086 12 8.793 6.707a1 1 0 0 1 0-1.414" clipRule="evenodd" transform="rotate(180 12 12)" />
          </svg>
        </button>
      </div>

      <div className="column wrapper spacing-xxs no-scrollbar" id="basiskleuren" ref={scrollRef} style={{ overflowX: 'auto', scrollBehavior: 'smooth' }}>
        <div className="row wrapper spacing-xxs gradient"></div>

        <div className="row wrapper numbers">
          {COLORS_CONFIG.map(c => (
            <div key={c.id} className={`column stack wrapper number ${c.name}`}>
              <div className="column overlay wrapper back"></div>
              <div className="column overlay wrapper front center">
                <p className="size-xxs">{c.id}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="row content labels">
          {COLORS_CONFIG.map(c => (
            <div key={c.name} className="column wrapper label center">
              <div className={`colour ${c.name}`}>
                <p>{c.name.charAt(0).toUpperCase() + c.name.slice(1)}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="row colours">
          {featuredMixes.map(({ name, mix }) => (
            <div key={name} className={`column stack colour ${name}`}>
              {mix ? (
                <AudioPlayer
                  id={String(mix.id)}
                  src={mix.audioSrc}
                  image={mix.image_square}
                  showVolumeSlider={false}
                  activeId={activeMixId}
                  onPlay={(id) => setActiveMixId(id)}
                />
              ) : (
                <p className="error size-xxs">Geen mix gevonden voor {name}.</p>
              )}
            </div>
          ))}
        </div>

        <div className="content row circles">
          {COLORS_CONFIG.map(c => <div key={c.name} className={`column circle ${c.name}`}></div>)}
        </div>

        <div className="row-6 row text descriptions">
          {COLORS_CONFIG.map(c => (
            <div key={c.name} className={`column text description ${c.name}`}>
              <p className="size-xs">"{c.description}"</p>
            </div>
          ))}
        </div>
      </div>

      <div className={`arrow right ${!showRightArrow ? 'hidden' : ''}`} id="arrow-right-canvas" onClick={() => scroll(1)}>
        <button className="btn">
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path fill="currentColor" fillRule="evenodd" d="M8.793 5.293a1 1 0 0 1 1.414 0l6 6a1 1 0 0 1 0 1.414l-6 6a1 1 0 0 1-1.414-1.414L14.086 12 8.793 6.707a1 1 0 0 1 0-1.414" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
}