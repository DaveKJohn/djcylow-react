import { Metadata } from "next";
import { dienstenContent } from "@/content/diensten";
import ContactForm from "@/components/sections/ContactForm";
import { SITE_URL } from "../../constants/site";



export const metadata: Metadata = {
    title: dienstenContent.title,
    description: dienstenContent.description,
    alternates: {
        canonical: `${SITE_URL}/diensten`,
    },
    openGraph: {
        type: "website",
        url: `${SITE_URL}/diensten`,
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