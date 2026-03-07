import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { GoogleTagManager } from '@next/third-parties/google'; // Installeer eerst: npm install @next/third-parties
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
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
      {/* Vervang GTM-KCH7Q5L door je ECHTE werkende ID (bijv. GTM-PK7VHJ46).
          Deze component regelt de head-script én de noscript automatisch voor je!
      */}
      <GoogleTagManager gtmId="GTM-PK7VHJ46" /> 
      
      <body className={`${poppins.variable} antialiased`}>
        <Navigation />
        {children}
        <Footer />
      </body>
    </html>
  );
}