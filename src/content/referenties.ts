export interface Referentie {
    id: number;
    client: string;
    text: string;
    tags: string[];
}

export const referentiesData = [
    {
        id: 1,
        client: "Klant Naam",
        text: "Hier komt de getuigenis of referentie tekst te staan over de samenwerking. Het formaat is exact 300 bij 300 pixels.",
        tags: ["Web Design", "Development"]
    },
    {
        id: 2,
        client: "Bedrijfsnaam",
        text: "Een korte beschrijving van het project en het resultaat dat we hebben behaald binnen dit vaste kader.",
        tags: ["Branding"]
    },
    {
        id: 3,
        client: "Nieuwe Partner",
        text: "Samenwerken was een plezier. De communicatie liep soepel en het eindresultaat overtrof de verwachtingen.",
        tags: ["SEO", "Copywriting"]
    },
    {
        id: 4,
        client: "Tech Start-up",
        text: "Innovatieve oplossingen voor complexe problemen. Absoluut een aanrader voor elk technisch project.",
        tags: ["React", "Next.js"]
    }
];