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
        <div className="column overlay stack wrapper spacing-lg feather">
          <div className="column overlay spacing-lg bottom"></div>
        </div>

        <div className="column overlay constrainer spacing-lg header">
           <div className="column banner-wrapper v-push-8xl center">
            <div className="column text-wrapper spacing-lg center">
              <h1>Boek DJ Cylow voor jouw evenement!</h1>
            </div>
          </div>
        </div>
      </section>

      {/* Contactformulier sectie */}
      <div className="column wrapper center BoW v-push-8xl" id="contactformulier">
        <ContactForm />
      </div>
    </main>
  );
}