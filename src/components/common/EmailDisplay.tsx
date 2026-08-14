"use client";

import { useSyncExternalStore } from "react";

interface EmailDisplayProps {
    user: string;
    domain: string;
    className?: string;
}

const subscribeNever = () => () => { };
const getEmptyOnServer = () => "";

export default function EmailDisplay({ user, domain, className }: EmailDisplayProps) {
    // De e-mail wordt pas in de browser samengesteld, zodat bots die alleen de statische HTML
    // scrapen hem niet zien. Dat is exact wat de useEffect hier deed; het verschil is dat de lege
    // waarde nu de SERVERSNAPSHOT is in plaats van een beginstate die een effect moet overschrijven.
    // De uitgeleverde HTML blijft dus even leeg, en het scheelt een renderronde.
    const email = useSyncExternalStore(
        subscribeNever,
        () => `${user}@${domain}`,
        getEmptyOnServer
    );

    return (
        <span className={className}>
            {email}
        </span>
    );
}