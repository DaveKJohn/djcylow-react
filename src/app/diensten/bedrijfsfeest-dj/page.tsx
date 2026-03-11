import { Metadata } from "next";
import ContactForm from "@/components/sections/ContactForm";

export const metadata: Metadata = {
  title: "Boek DJ Cylow voor je bedrijfsfeest!",
  description: "De DJ die iedereen op de dansvloer krijgt.",
  alternates: {
    canonical: "https://www.djcylow.com/diensten/bedrijfsfeest-dj",
  },
  openGraph: {
    title: "Boek DJ Cylow voor je bedrijfsfeest!",
    description: "De DJ die iedereen op de dansvloer krijgt.",
    images: [{ url: "/images/diensten.jpg" }],
  },
};

export default function BedrijfsfeestDJ() {
  return (
    <main className="diensten">
      {/* Banner - Gebruikt de styles uit je diensten.njk */}
      <section className="column stack wrapper pattern WoB" id="banner_index">
        <div className="column overlay stack wrapper spacing-h4 feather">
          <div className="column overlay spacing-h4 bottom"></div>
        </div>

        <div className="column overlay constrainer spacing-h4 header">
          <div className="column banner-wrapper v-push-h1 center">
            <div className="column text-wrapper spacing-h4 center">
              <h1>Boek DJ Cylow voor je bedrijfsfeest!</h1>
            </div>
          </div>
        </div>
      </section>

      {/* Contactformulier sectie */}

      <ContactForm />

    </main>
  );
}