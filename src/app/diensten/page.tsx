import { Metadata } from "next";
import ContactForm from "@/components/sections/ContactForm";

// 1. De data die voorheen in je Frontmatter stond
const pageData = {
  title: "Boek DJ Cylow voor jouw evenement!",
  description: "De DJ die iedereen op de dansvloer krijgt.",
  image: "/image/diensten.jpg",
  permalink: "diensten"
};

// 2. Metadata (vervangt de <head> sectie uit je njk)
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
      <section className="column stack wrapper pattern WoB" id="banner_index">
        {/* De achtergrondafbeelding uit je markdown kun je hier via CSS of een inline style toepassen */}
        <div className="column overlay constrainer spacing-l header">
          <div className="column banner-wrapper spacing-xxl">
            <div className="column text-wrapper spacing-s center">
              {/* Gebruik de title uit je oude markdown */}
              <h1>{pageData.title}</h1>
            </div>
          </div>
        </div>
      </section>

      {/* Hier komt de rest van je pagina-inhoud */}

      <div className="column wrapper center BoW v-push-xl" id="contactformulier">
        <ContactForm />
      </div>
    </main>
  );
}