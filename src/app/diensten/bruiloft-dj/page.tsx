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
      <section className="column stack wrapper pattern WoB" id="banner_index">
        <div className="column overlay stack wrapper spacing-l feather">
          <div className="column overlay spacing-m bottom"></div>
        </div>

        <div className="column overlay constrainer spacing-l header">
          <div className="column banner-wrapper spacing-xxl">
            <div className="column text-wrapper spacing-s center">
              <h1>Boek DJ Cylow voor je bruiloft!</h1>
            </div>
          </div>
        </div>
      </section>

      {/* Contactformulier sectie */}
      <div className="column wrapper center BoW v-push-xl" id="contactformulier">
        <ContactForm />
      </div>
    </main>
  );
}