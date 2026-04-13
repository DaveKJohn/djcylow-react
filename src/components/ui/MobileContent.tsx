'use client';

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

interface MobileContentProps {
    children: React.ReactNode;
    trigger: (toggle: () => void) => React.ReactNode;
    title?: string;
    wrapperClass?: string;
}

export default function MobileContent({ children, trigger, title, wrapperClass = "" }: MobileContentProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [mounted, setMounted] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        setMounted(true);
        const checkSize = () => {
            const mobile = window.innerWidth <= 1080;
            setIsMobile(mobile);
            if (!mobile) setIsOpen(false);
        };

        checkSize();
        window.addEventListener("resize", checkSize);
        return () => window.removeEventListener("resize", checkSize);
    }, []);

    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    const toggle = () => setIsOpen(prev => !prev);

    if (!mounted) return null;

    return (
        <>
            {trigger(toggle)}

            {/* Overlay / Backdrop */}
            {isMobile && (
                <div
                    className={`menu-overlay ${isOpen ? "active" : ""}`}
                    onClick={() => setIsOpen(false)}
                />
            )}

            <div className={`menu-wrapper ${isMobile ? "mobile" : "desktop"} ${isOpen ? "active" : ""} ${wrapperClass}`}>
                {isMobile && (
                    <div className="column mobileMenuHeader-border">
                        <div className="row mobileMenuHeader-wrapper">
                            {title && <p className="bold">{title}</p>}
                            <button className="btn nav close-btn" onClick={() => setIsOpen(false)}>✕</button>
                        </div>
                    </div>
                )}

                <div className="mainList-wrapper">
                    {children}
                </div>
            </div>
        </>
    );
}