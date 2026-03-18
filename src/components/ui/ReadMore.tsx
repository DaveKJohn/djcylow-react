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

    // Breng de Promo.tsx op de hoogte om de .is-expanded class op de foreground te zetten
    if (onToggle) {
      onToggle(nextState);
    }

    if (!nextState) {
      // Wacht heel even tot de 'hidden' div op display: none staat
      requestAnimationFrame(() => {
        // Scroll naar de hoofdsectie (Promo) om de focus weer in het midden te krijgen
        const promoSection = document.getElementById("promo");
        if (promoSection) {
          promoSection.scrollIntoView({
            behavior: "smooth",
            block: "center", // Zet de 100vh sectie weer exact in het midden van het scherm
          });
        }
      });
    }
  };

  return (
    <div className="column spacing-3xl" ref={containerRef}>
      <div className="column spacing-3xl teaser">
        {teaser}
      </div>

      <div
        className="column spacing-3xl hidden"
        style={{ 
          display: isOpen ? "flex" : "none",
          flexDirection: "column" 
        }}
      >
        {hiddenContent}
      </div>

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