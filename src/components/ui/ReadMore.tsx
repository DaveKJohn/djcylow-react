"use client";

import { useState, useRef } from "react";

interface ReadMoreProps {
  teaser: React.ReactNode;
  hiddenContent: React.ReactNode;
  onToggle?: (isOpen: boolean) => void;
}

export default function ReadMore({ teaser, hiddenContent, onToggle }: ReadMoreProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const toggleReadMore = () => {
    const nextState = !isOpen;
    setIsOpen(nextState);

    if (onToggle) {
      onToggle(nextState);
    }

    if (!nextState) {
      // Wacht tot de animatie halverwege is voordat we gaan scrollen
      setTimeout(() => {
        const promoSection = document.getElementById("promo");
        if (promoSection) {
          promoSection.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }
      }, 150); 
    }
  };

  return (
    <div className="column spacing-3xl" ref={containerRef}>
      {/* 1. De Teaser: Altijd zichtbaar, buiten de animatie-wrapper */}
      <div className="column spacing-3xl teaser">
        {teaser}
      </div>

      {/* 2. De Animatie Wrapper: Alleen voor de verborgen content */}
      <div
        className="hidden-content-animator"
        style={{
          display: "grid",
          gridTemplateRows: isOpen ? "1fr" : "0fr",
          transition: "grid-template-rows 0.5s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.4s ease",
          opacity: isOpen ? 1 : 0,
          overflow: "hidden",
        }}
      >
        {/* De 'inner' div is nodig voor de grid-hoogte berekening */}
        <div style={{ minHeight: 0 }}>
          <div className="column spacing-3xl hidden-inner">
            {hiddenContent}
          </div>
        </div>
      </div>

      {/* 3. De Knop: Altijd onderaan de stack */}
      <div className="column extra spacing-7xl">
        <button
          className="btn passive read-more-btn"
          onClick={toggleReadMore}
        >
          {isOpen ? "Lees minder" : "Lees meer"}
        </button>
      </div>
    </div>
  );
}