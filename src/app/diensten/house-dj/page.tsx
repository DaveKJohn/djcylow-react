import { Metadata } from "next";
import ContactForm from "@/components/sections/ContactForm";

export const metadata: Metadata = {
  title: "Boek DJ Cylow voor jouw evenement!",
  description: "De DJ die iedereen op de dansvloer krijgt.",
  alternates: {
    canonical: "https://www.djcylow.com/diensten/house-dj",
  },
  openGraph: {
    title: "Boek DJ Cylow voor jouw evenement!",
    description: "De DJ die iedereen op de dansvloer krijgt.",
    images: [{ url: "/images/diensten.jpg" }],
  },
};

export default function HouseDJPage() {
  return (
    <main className="diensten">
      <section className="column stack wrapper pattern WoB" id="banner_index">
        <div className="column overlay stack wrapper spacing-h7 feather">
          <div className="column overlay spacing-h7 bottom"></div>
        </div>

        <div className="column overlay constrainer spacing-h7 header">
          <div className="column banner-wrapper v-push-h1 center">
            <div className="column text-wrapper spacing-h7 center">
              <h1>Boek DJ Cylow voor jouw evenement!</h1>
            </div>
          </div>
        </div>
      </section>

      {/* Contactformulier sectie */}

      <ContactForm />

    </main>
  );
}