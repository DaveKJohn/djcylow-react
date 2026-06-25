"use client";

import { useState } from "react";
import { useTranslations } from 'next-intl';


interface ReadMoreProps {
    teaser: React.ReactNode;
    hiddenContent: React.ReactNode;
    onToggle?: (isOpen: boolean) => void;
}

export default function ReadMore({ teaser, hiddenContent, onToggle }: ReadMoreProps) {
    const t = useTranslations('common');
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
        <div className={`column read-more-container ${isOpen ? "is-open" : ""}`}>
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
                    {isOpen ? t('readLess') : t('readMore')}
                </button>
            </div>
        </div>
    );
}