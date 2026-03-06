import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import Script from "next/script";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import "@/styles/main.scss";
import '@/styles/luister.scss';
import '@/styles/musicmoodcolours.scss';



const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-poppins",
  display: "swap", // Zorgt dat tekst direct zichtbaar is
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
        {/* Google Tag Manager - Head */}
        <Script id="gtm-script" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','GTM-KCH7Q5L');`}
        </Script>

      
      </head>
      <body className={`${poppins.variable} antialiased`}>
        {/* Google Tag Manager - Noscript (voor als JS uit staat) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-KCH7Q5L"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          ></iframe>
        </noscript>

        <Navigation />
        {children}
        <Footer />
      </body>
    </html>
  );
}