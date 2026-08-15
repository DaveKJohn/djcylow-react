"use client";

import { useState } from "react";


interface ReadMoreProps {
    teaser: React.ReactNode;
    hiddenContent: React.ReactNode;
    onToggle?: (isOpen: boolean) => void;
    /**
     * Het id waar na het inklappen naartoe wordt gescrold. Standaard `promo`, want dat is de enige
     * sectie die deze component vandaag gebruikt.
     *
     * Waarom dit een prop is geworden: het id stond hardgecodeerd, terwijl `MeetTheDJ` en
     * `Verzoeknummers` deze component óók gebruiken. Vanuit die twee sprong de pagina dus naar een
     * heel andere sectie. Dat is nu onschadelijk juist omdát die twee niet gerenderd worden -- en
     * precies daarom breekt het zodra er één terugkomt, zonder dat iets waarschuwt.
     */
    scrollDoelId?: string;
}

export default function ReadMore({ teaser, hiddenContent, onToggle, scrollDoelId = "promo" }: ReadMoreProps) {
    const [isOpen, setIsOpen] = useState(false);

    const toggleReadMore = () => {
        const nextState = !isOpen;
        setIsOpen(nextState);
        onToggle?.(nextState);

        if (!nextState) {
            setTimeout(() => {
                document.getElementById(scrollDoelId)?.scrollIntoView({
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
                    {isOpen ? "Lees minder" : "Lees meer"}
                </button>
            </div>
        </div>
    );
}