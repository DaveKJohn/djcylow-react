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


            <div className="stack banner WoB" id="luister_banner">                

                <div className="column layer feather sides"></div>

                <div className="column layer feather bottom"></div>

                <div className="column layer spacing-4xl constrainer center title">
                    <h1>{dienstenContent.title}</h1>
                </div>
            </div>



            <ContactForm />

        </main>
    );
}