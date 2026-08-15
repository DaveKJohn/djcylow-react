import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import Script from "next/script";

import "@/styles/main.scss";
import { SITE_URL } from "../constants/site";

const poppins = Poppins({
    subsets: ["latin"],
    weight: ["300", "400", "500", "600", "700", "800"],
    variable: "--font-poppins",
    display: "swap",
});

export const metadata: Metadata = {
    // Basis waartegen Next.js relatieve URL's in metadata oplost (og:image, twitter:image).
    // Zonder deze regel valt Next terug op http://localhost:3000 en belanden die URL's zo in de
    // gebouwde HTML, waardoor linkpreviews op social media een onbereikbaar adres krijgen.
    metadataBase: new URL(SITE_URL),
    title: "DJ Cylow",
    // Nederlands, net als de rest van de site. Dit is de FALLBACK: de vier hoofdpagina's zetten hun
    // eigen description, maar wat dat niet doet krijgt deze -- en tot 2026-08-15 was dat de Engelse
    // "DJ Cylow - Professional DJ for your events", die zo in `out/404.html` belandde.
    description: "DJ Cylow draait house en nu-disco op bruiloften, bedrijfsfeesten en events in heel Nederland. Bekijk de mixen en vraag een datum aan.",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        // `nl` en niet `en`: alle content op deze site is Nederlands -- de teksten in
        // `src/content/`, alle koppen, alle UI-strings. Tot 2026-08-15 stond hier `en`, wat twee
        // dingen kostte: schermlezers spraken Nederlandse tekst met een Engelse stem uit, en Google
        // kreeg een taalsignaal dat de rest van de pagina tegensprak -- op een site die juist lokaal
        // gevonden wil worden.
        <html lang="nl">
            <head>
                {/* GTM Script */}
                <Script id="gtm-delayed" strategy="afterInteractive">
                    {`
                        (function() {
                        var gtmLoaded = false;
                        function loadGTM() {
                            if (gtmLoaded) return;
                            gtmLoaded = true;
                            window.removeEventListener('scroll', loadGTM);
                            window.removeEventListener('mousemove', loadGTM);
                            window.removeEventListener('touchstart', loadGTM);
                            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                            })(window,document,'script','dataLayer','GTM-PK7VHJ46');
                        }
                        window.addEventListener('scroll', loadGTM, {passive: true});
                        window.addEventListener('mousemove', loadGTM);
                        window.addEventListener('touchstart', loadGTM, {passive: true});
                        setTimeout(loadGTM, 6000); 
                        })();
                    `}
                </Script>

                {/* UX Toggle Script -- alleen buiten productie.

                    Dit registreerde tot 2026-08-15 op ELKE pagina een globale keydown-listener op de
                    losse toets `w`. Elke bezoeker die buiten een invoerveld op die toets drukte, zette
                    de klasse `ux-mode` op <html> en <body> en veranderde daarmee het uiterlijk van de
                    site. Dat is bereikbaar bij gewone toetsenbordnavigatie en bij type-ahead-zoeken op
                    een pagina zonder gefocust veld.

                    De combinatie is meteen Ctrl+Shift+W geworden in plaats van de losse toets: ook in
                    ontwikkeling is een enkele letter te makkelijk per ongeluk te raken. */}
                {process.env.NODE_ENV !== 'production' && (
                    <Script id="ux-mode-toggle" strategy="afterInteractive">
                        {`
                        (function() {

                            function toggle() {
                                document.body.classList.toggle('ux-mode');
                                document.documentElement.classList.toggle('ux-mode');

                                const isEnabled = document.body.classList.contains('ux-mode');
                                console.log('✅ UX Mode:', isEnabled ? 'AAN' : 'UIT');
                            }

                            window.addEventListener('keydown', (e) => {
                                const isTyping = e.target.tagName === 'INPUT' ||
                                                e.target.tagName === 'TEXTAREA' ||
                                                e.target.isContentEditable;

                                if (e.code === 'KeyW' && e.ctrlKey && e.shiftKey && !isTyping) {
                                    toggle();
                                }
                            });
                        })();
                    `}
                    </Script>
                )}
            </head>

            <body className={`${poppins.variable} antialiased`}>
                <Navigation />
                {children}
                <Footer />
            </body>
        </html>
    );
}