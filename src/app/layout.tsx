import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import Script from "next/script";

// @ts-ignore
import "@/styles/main.scss";

const poppins = Poppins({
    subsets: ["latin"],
    weight: ["300", "400", "500", "600", "700", "800"],
    variable: "--font-poppins",
    display: "swap",
});

export const metadata: Metadata = {
    title: "DJ Cylow",
    description: "DJ Cylow - Professional DJ for your events",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
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

                {/* UX Toggle Script */}
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

                                if (e.code === 'KeyW' && !isTyping) {
                                    toggle();
                                }
                            });
                        })();
                    `}
                </Script>
            </head>

            <body className={`${poppins.variable} antialiased`}>
                <Navigation />
                {children}
                <Footer />
            </body>
        </html>
    );
}