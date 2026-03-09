'use client';

import React, { useMemo, useRef, useEffect, useState } from 'react';
import AudioPlayer from '@/components/ui/AudioPlayer';

// 1. Importeer ALLE bestanden (Light én Full)
import lightBlue from '@/data/mixes/light-blue.json';
import lightCyan from '@/data/mixes/light-cyan.json';
import lightGreen from '@/data/mixes/light-green.json';
import lightYellow from '@/data/mixes/light-yellow.json';
import lightOrange from '@/data/mixes/light-orange.json';
import lightPurple from '@/data/mixes/light-purple.json';
import lightRed from '@/data/mixes/light-red.json';
import lightMagenta from '@/data/mixes/light-magenta.json';


const allMixesData = [
  ...lightBlue, ...lightCyan, ...lightGreen, ...lightYellow, ...lightOrange, ...lightPurple, ...lightRed, ...lightMagenta
];

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
      const mix = allMixesData.find(m =>
        m.color.toLowerCase() === config.name.toLowerCase() &&
        m.featured === true
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
              {/* CHECK: Alleen renderen als mix EN mix.audioSrc bestaan */}
              {mix && mix.audioSrc ? (
                <AudioPlayer
                  id={String(mix.id)}
                  src={mix.audioSrc}
                  // Als image_square null is in de JSON, sturen we "" naar de prop
                  // zodat TypeScript tevreden is, maar de player rendert alleen
                  // als de audio (de belangrijkste bron) oké is.
                  image={mix.image_square || ""}
                  showVolumeSlider={false}
                  activeId={activeMixId}
                  onPlay={(id) => setActiveMixId(id)}
                  className={name}
                />
              ) : (
                <div className="column center wrapper" style={{ height: '100%', minHeight: '150px' }}>
                  <p className="error size-xxs center">Geen mix.</p>
                </div>
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