import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import "@/styles/main.scss";
import Script from "next/script";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-poppins",
  display: "fallback", 
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
        {/* Deze ene Script-tag regelt alles. Hij laadt GTM pas als de gebruiker beweegt of na 6 seconden. */}
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
      </head>

      <body className={`${poppins.variable} antialiased`}>
        <Navigation />
        {children}
        <Footer />
      </body>
    </html>
  );
}