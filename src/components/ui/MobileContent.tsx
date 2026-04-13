'use client';

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

interface MobileContentProps {
    title?: React.ReactNode;
    icon?: React.ReactNode;
    wrapperClass?: string;
    trigger: (toggle: () => void) => React.ReactNode;
    children: React.ReactNode | ((toggle: () => void) => React.ReactNode);
}

export default function MobileContent({
    children,
    trigger,
    title,
    wrapperClass = "",
    icon
}: MobileContentProps) {
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
        if (isMobile && isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [isOpen, isMobile]);

    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    const toggle = () => setIsOpen(prev => !prev);

    if (!mounted) return null;

    return (
        <>
            {trigger(toggle)}

            {/* 1. De donkere achtergrond (Overlay) */}
            {isMobile && (
                <div
                    className={`menu-overlay ${isOpen ? "active" : ""}`}
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* 2. De daadwerkelijke content schuifbalk */}
            <div className={`menu-wrapper ${isMobile ? "mobile" : "desktop"} ${isOpen ? "active" : ""} ${wrapperClass}`}>
                {isMobile && (
                    <div className="column mobileMenuHeader-border">
                        <div className="row mobileMenuHeader-wrapper v-center">
                            
                            {/* Gecentreerde Titel + Icoon Groep */}
                            <div className="headerTitleGroup">
                                {icon && (
                                    <div className="headerIcon">
                                        {icon}
                                    </div>
                                )}
                                {title && <p className="headerTitleText">{title}</p>}
                            </div>

                            {/* Sluitknop */}
                            <button
                                className="btn nav close-btn"
                                onClick={() => setIsOpen(false)}
                            >
                                ✕
                            </button>
                        </div>
                    </div>
                )}

                <div className="mainList-wrapper">
                    {typeof children === 'function' ? children(toggle) : children}
                </div>
            </div>
        </>
    );
}