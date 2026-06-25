import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import CookieBanner from "@/components/ui/CookieBanner";
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
        <html lang="en">
            <head>
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
                <CookieBanner />
            </body>
        </html>
    );
}