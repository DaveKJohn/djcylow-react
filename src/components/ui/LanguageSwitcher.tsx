"use client";

import { useLocale } from "next-intl";
import { usePathname, Link } from "@/i18n/navigation";

export default function LanguageSwitcher() {
    const locale = useLocale();
    const pathname = usePathname();

    return (
        <div className="row AMC lang-switcher" aria-label="Language switcher">
            <Link
                href={pathname}
                locale="en"
                className={`btn lang-btn${locale === 'en' ? ' active' : ''}`}
                aria-current={locale === 'en' ? 'true' : undefined}
            >
                EN
            </Link>
            <span className="lang-divider">|</span>
            <Link
                href={pathname}
                locale="nl"
                className={`btn lang-btn${locale === 'nl' ? ' active' : ''}`}
                aria-current={locale === 'nl' ? 'true' : undefined}
            >
                NL
            </Link>
        </div>
    );
}
