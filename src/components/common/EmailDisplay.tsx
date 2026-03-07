"use client";

import { useEffect, useState } from "react";

interface EmailDisplayProps {
    user: string;
    domain: string;
    className?: string;
}

export default function EmailDisplay({ user, domain, className }: EmailDisplayProps) {
    const [email, setEmail] = useState("");

    useEffect(() => {
        // We zetten de e-mail pas in de useEffect in elkaar. 
        // Bots die alleen de statische HTML scrapen zien de e-mail niet.
        setEmail(`${user}@${domain}`);
    }, [user, domain]);

    return (
        <span className={className}>
            {email || ""}
        </span>
    );
}