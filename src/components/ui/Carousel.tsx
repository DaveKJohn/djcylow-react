'use client';

import React, { useRef, useState, useEffect } from 'react';

interface CarouselProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export default function Carousel({ children, className = "", id }: CarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

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
    <div className={`row wrapper spacing-s visual carousels black-90-bg in-push-l ${className}`}>
      {/* Linker Pijl */}
      <div className={`arrow left ${!showLeftArrow ? 'hidden' : ''}`} onClick={() => scroll(-1)}>
        <button className="btn">
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path fill="currentColor" fillRule="evenodd" d="M8.793 5.293a1 1 0 0 1 1.414 0l6 6a1 1 0 0 1 0 1.414l-6 6a1 1 0 0 1-1.414-1.414L14.086 12 8.793 6.707a1 1 0 0 1 0-1.414" clipRule="evenodd" transform="rotate(180 12 12)" />
          </svg>
        </button>
      </div>

      {/* De Scroll Container */}
      <div 
        className="column wrapper spacing-xxs no-scrollbar" 
        id={id} 
        ref={scrollRef} 
        style={{ overflowX: 'auto', scrollBehavior: 'smooth' }}
      >
        {children}
      </div>

      {/* Rechter Pijl */}
      <div className={`arrow right ${!showRightArrow ? 'hidden' : ''}`} onClick={() => scroll(1)}>
        <button className="btn">
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path fill="currentColor" fillRule="evenodd" d="M8.793 5.293a1 1 0 0 1 1.414 0l6 6a1 1 0 0 1 0 1.414l-6 6a1 1 0 0 1-1.414-1.414L14.086 12 8.793 6.707a1 1 0 0 1 0-1.414" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
}