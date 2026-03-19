"use client";

import { useState } from "react";


interface ReadMoreProps {
    teaser: React.ReactNode;
    hiddenContent: React.ReactNode;
    onToggle?: (isOpen: boolean) => void;
}

export default function ReadMore({ teaser, hiddenContent, onToggle }: ReadMoreProps) {
    const [isOpen, setIsOpen] = useState(false);

    const toggleReadMore = () => {
        const nextState = !isOpen;
        setIsOpen(nextState);
        onToggle?.(nextState);

        if (!nextState) {
            setTimeout(() => {
                document.getElementById("promo")?.scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                });
            }, 300);
        }
    };

    return (
        <div className={`column full-w h-start read-more-container ${isOpen ? "is-open" : ""}`}>
            <div className="column read-more-teaser">
                {teaser}
            </div>

            <div className="column hidden-content-animator">
                <div className="column animator-inner">
                    {hiddenContent}
                </div>
            </div>

            <div className="column extra spacing-2xl">
                <button className="btn passive read-more-btn" onClick={toggleReadMore}>
                    {isOpen ? "Lees minder" : "Lees meer"}
                </button>
            </div>
        </div>
    );
}