import { Metadata } from "next";
import { dienstenContent } from "@/content/diensten";
import ContactForm from "@/components/sections/ContactForm";



export const metadata: Metadata = {
    title: dienstenContent.title,
    description: dienstenContent.description,
    alternates: {
        canonical: "https://www.djcylow.com/",
    },
    openGraph: {
        type: "website",
        url: "https://www.djcylow.com/",
        title: dienstenContent.title,
        description: dienstenContent.description,
    },
};

export default function DienstenPage() {
    return (
        <main>


            <div className="banner stack WoB" id="banner_2">

                

                <div className="column background feather sides"></div>

                <div className="column background feather bottom"></div>

                <div className="column foreground spacing-4xl constrainer title">
                    <h1>{dienstenContent.title}</h1>
                </div>
            </div>



            <ContactForm />

        </main>
    );
}