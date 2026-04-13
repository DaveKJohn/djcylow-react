'use client';

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

interface MobileContentProps {
    title?: React.ReactNode;
    icon?: React.ReactNode;
    wrapperClass?: string;
    id?: string;           // Prop is aanwezig in interface
    trigger: (toggle: () => void) => React.ReactNode;
    children: React.ReactNode | ((toggle: () => void) => React.ReactNode);
}

export default function MobileContent({
    children,
    trigger,
    title,
    wrapperClass = "",
    id, // 1. Destructureer de id prop hier
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

            {isMobile && (
                <div
                    className={`menu-overlay ${isOpen ? "active" : ""}`}
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* 2. Voeg de id={id} toe aan de div */}
            <div
                id={id}
                className={`drawer ${isMobile ? "ready" : "locked"} ${isOpen ? "open" : "closed"} ${wrapperClass}`}
            >
                {isMobile && (
                    /* 3. Match de classnaam met je SCSS (drawer-header) */
                    <div className="row drawer-header v-center">

                        <div className="headerTitleGroup">
                            {icon && (
                                <div className="headerIcon">
                                    {icon}
                                </div>
                            )}
                            {title && <p className="headerTitleText">{title}</p>}
                        </div>

                        <button
                            className="btn nav close-btn"
                            onClick={() => setIsOpen(false)}
                        >
                            ✕
                        </button>
                    </div>
                )}

                <div className="drawer-content">
                    {typeof children === 'function' ? children(toggle) : children}
                </div>
            </div>
        </>
    );
}