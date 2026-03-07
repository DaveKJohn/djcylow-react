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
        {/* 1. Eerst de dataLayer initialiseren (nodig voor GTM) */}
        <Script id="gtm-init" strategy="lazyOnload">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'GTM-PK7VHJ46');
          `}
        </Script>
        
        {/* 2. Dan het eigenlijke GTM script laden met lazyOnload */}
        <Script
          id="gtm-strategy"
          strategy="lazyOnload"
          src="https://www.googletagmanager.com/gtm.js?id=GTM-PK7VHJ46"
        />
      </head>

      <body className={`${poppins.variable} antialiased`}>
        <Navigation />
        {children}
        <Footer />
      </body>
    </html>
  );
}