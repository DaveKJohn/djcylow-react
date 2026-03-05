'use client'; // Dit MOET regel 1 zijn

import React, { useMemo } from 'react';
import mixesData from '@/data/mixes.json';

// De configuratie van de 8 basiskleuren en hun labels
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
  // We zoeken voor elke kleur de eerste mix die "featured" is
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

  const scroll = (direction: 'left' | 'right') => {
    const container = document.getElementById('basiskleuren-scroll');
    if (container) {
      const scrollAmount = 300; // Pas aan naar wens
      container.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="row wrapper spacing-s visual carousels black-90-bg in-push-l">
      {/* Linker Pijl */}
      <div className="arrow left" onClick={() => scroll('left')}>
        <button className="btn">
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path fill="currentColor" d="M8.793 5.293a1 1 0 0 1 1.414 0l6 6a1 1 0 0 1 0 1.414l-6 6a1 1 0 0 1-1.414-1.414L14.086 12 8.793 6.707a1 1 0 0 1 0-1.414" transform="rotate(180 12 12)" />
          </svg>
        </button>
      </div>

      <div className="column wrapper spacing-xxs overflow-hidden" id="basiskleuren" style={{ width: '100%' }}>
        <div id="basiskleuren-scroll" className="row wrapper no-scrollbar" style={{ overflowX: 'auto', scrollBehavior: 'smooth' }}>

          <div className="column wrapper spacing-xxs" style={{ minWidth: 'fit-content' }}>
            {/* 1. Gradient Balk */}
            <div className="row wrapper spacing-xxs gradient"></div>

            {/* 2. Nummers */}
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

            {/* 3. Kleur Labels */}
            <div className="row content labels">
              {COLORS_CONFIG.map(c => (
                <div key={c.name} className="column wrapper label center">
                  <div className={`colour ${c.name}`}>
                    <p>{c.name.charAt(0).toUpperCase() + c.name.slice(1)}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* 4. Audio Players (De Mixen) */}
            <div className="row colours">
              {featuredMixes.map(({ name, mix }) => (
                <div key={name} className={`column stack colour ${name}`}>
                  {mix ? (
                    <div className="content stack audioplayer-wrapper">
                      {/* Jouw specifieke HTML structuur */}

                      <div className="layer-1 content h2-content-6 overlay column thumbnail"
                        style={{ backgroundImage: `url('${mix.image_square}')` }}>
                      </div>

                      <div className="layer-2 content h2-content-6 overlay column center ready-wrapper">
                        <button className="btn" aria-label="Speel audio af">
                          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </button>
                      </div>

                      <div className="layer-3 content h2-content-6 overlay column loading-wrapper">
                        <div className="loading spinner"></div>
                      </div>

                      <div className="layer-4 content h2-content-6 overlay column playing-wrapper">

                        <div className="row-2 content h2-content-7 row timestamp-wrapper">
                          <div className="col-1 content h2-content-8 column timestamp current"></div>
                          <div className="col-2 content h2-content-8 column timestamp final"></div>
                        </div>

                        <div className="row-3 content h2-content-7 stack column timeline-wrapper">
                          <div className="layer-1 content h2-content-8 overlay column timeline total"></div>
                          <div className="layer-2 content h2-content-8 overlay column timeline progress"></div>
                        </div>

                        <div className="row-4 content h2-content-7 row split layer-wrapper">
                          <div className="col-1 content h2-content-8 column pausefilters">
                            <button className="btn" aria-label="Pauzeer audio">
                              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                              </svg>
                            </button>
                          </div>
                          <div className="col-2 content h2-content-8 row column volume-wrapper">
                            <div className="col-1 content h2-content-9 column left">
                              <button className="btn" aria-label="Audio dempen">
                                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                  <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
                                </svg>
                              </button>
                            </div>
                            <div className="col-2 content h2-content-9 column right" style={{ display: 'none' }}>
                              <input type="range" min="0" max="1" step="0.01" defaultValue="1" aria-label="Volumeregeling" />
                            </div>
                          </div>
                        </div>
                      </div>

                      <audio id={`audio-${mix.id}`} preload="auto" data-src={mix.audioSrc}></audio>
                    </div>


                  ) : (
                    <p className="error size-xxs">Geen mix</p>
                  )}
                </div>
              ))}
            </div>

            {/* 5. Cirkels */}
            <div className="content row circles">
              {COLORS_CONFIG.map(c => (
                <div key={c.name} className={`column circle ${c.name}`}></div>
              ))}
            </div>

            {/* 6. Beschrijvingen */}
            <div className="row-6 row text descriptions">
              {COLORS_CONFIG.map(c => (
                <div key={c.name} className={`column text description ${c.name}`}>
                  <p className="size-xs">"{c.description}"</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Rechter Pijl */}
      <div className="arrow right" onClick={() => scroll('right')}>
        <button className="btn">
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path fill="currentColor" d="M8.793 5.293a1 1 0 0 1 1.414 0l6 6a1 1 0 0 1 0 1.414l-6 6a1 1 0 0 1-1.414-1.414L14.086 12 8.793 6.707a1 1 0 0 1 0-1.414" />
          </svg>
        </button>
      </div>
    </div>
  );
}