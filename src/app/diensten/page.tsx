import { Metadata } from "next";
import ContactForm from "@/components/sections/ContactForm";

// 1. De data die voorheen in je Frontmatter stond
const pageData = {
  title: "Boek DJ Cylow voor jouw evenement!",
  description: "De DJ die iedereen op de dansvloer krijgt.",
  image: "/images/diensten.jpg",
  permalink: "diensten"
};

// 2. Metadata
export const metadata: Metadata = {
  title: pageData.title,
  description: pageData.description,
  openGraph: {
    title: pageData.title,
    description: pageData.description,
    images: [{ url: pageData.image }],
    url: `https://www.djcylow.com/${pageData.permalink}`,
  },
  alternates: {
    canonical: `https://www.djcylow.com/${pageData.permalink}`,
  },
};

export default function DienstenPage() {
  return (
    <main className="diensten">
      {/* 1. Banner Sectie (Nu met volledige index-structuur) */}
      <section className="column stack wrapper pattern WoB" id="banner_diensten">
        {/* De feather en bottom overlays voor het verloop */}
        <div className="column overlay stack wrapper spacing-l feather">
            <div className="column overlay spacing-m bottom"></div>
        </div>

        <div className="column overlay constrainer spacing-l header">
          <div className="column banner-wrapper spacing-xxl">
            <div className="column text-wrapper spacing-s center">
              <h1>{pageData.title}</h1>              
            </div>
          </div>
        </div>
      </section>

      {/* 2. Content Sectie (Tussen de banner en het formulier) */}
      <section className="column wrapper spacing-xl center WoB">
        <div className="column constrainer">
          {/* Hier kun je je tekst of diensten-blokken plaatsen */}
        </div>
      </section>

      {/* 3. Contact Sectie */}
      <div className="column wrapper center BoW v-push-xl" id="contactformulier">
        <ContactForm />
      </div>
    </main>
  );
}