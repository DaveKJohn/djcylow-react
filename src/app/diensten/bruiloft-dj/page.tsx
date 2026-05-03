import { Metadata } from "next";
import ContactForm from "@/components/sections/ContactForm";

export const metadata: Metadata = {
  title: "Boek DJ Cylow voor je bruiloft!",
  description: "De DJ die iedereen op de dansvloer krijgt.",
  alternates: {
    canonical: "https://www.djcylow.com/diensten/bruiloft-dj",
  },
  openGraph: {
    title: "Boek DJ Cylow voor je bruiloft!",
    description: "De DJ die iedereen op de dansvloer krijgt.",
    images: [{ url: "/images/diensten.jpg" }],
  },
};

export default function BruiloftDJPage() {
  return (
    <main className="diensten">
      {/* Banner - Gebruikt de vertrouwde njk-structuur */}
      <section className="column stack pattern WoB" id="banner_index">
        <div className="column overlay stack spacing-3xl feather">
          <div className="column overlay spacing-3xl bottom"></div>
        </div>

        <div className="column overlay constrainer spacing-3xl header">
          <div className="column banner-wrapper v-push-9xl center">
            <div className="column text-wrapper spacing-3xl center">
              <h1>Boek DJ Cylow voor je bruiloft!</h1>
            </div>
          </div>
        </div>
      </section>

      {/* contact-formulier sectie */}

      <ContactForm />

    </main>
  );
}