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
      // Scroll terug naar het begin van deze sectie (de anchor)
      containerRef.current?.scrollIntoView({ behavior: "smooth" });
    }
    setIsOpen(!isOpen);
  };

  return (
    <div className="column text-wrapper spacing-3xl story anchor" ref={containerRef}>
      <div className="column text-wrapper spacing-3xl teaser">
        {teaser}
      </div>

      {/* We toggelen de display via inline style, net als in je script */}
      <div 
        className="column text-wrapper spacing-3xl hidden" 
        style={{ display: isOpen ? "flex" : "none" }}
      >
        {hiddenContent}
      </div>

      <div className="column wrapper spacing-3xl">
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