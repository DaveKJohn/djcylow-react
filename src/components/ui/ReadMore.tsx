"use client";

import { useState, useRef } from "react";

interface ReadMoreProps {
  teaser: React.ReactNode;
  hiddenContent: React.ReactNode;
}

export default function ReadMore({ teaser, hiddenContent }: ReadMoreProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const toggleReadMore = () => {
    if (isOpen) {
      // 1. Eerst inklappen
      setIsOpen(false);

      // 2. Wacht heel even tot de DOM is bijgewerkt, dan pas scrollen
      setTimeout(() => {
        containerRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center" // "center" is vaak fijner dan de default "start"
        });
      }, 0);
    } else {
      setIsOpen(true);
    }
  };

  return (
    <div className="column spacing-3xl" ref={containerRef}>
      <div className="column spacing-3xl teaser">
        {teaser}
      </div>

      {/* We toggelen de display via inline style, net als in je script */}
      <div
        className="column spacing-3xl hidden"
        style={{ display: isOpen ? "flex" : "none" }}
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