const dienstenContentNl = {
  title: "Boek DJ Cylow voor jouw evenement!",
  description: "De DJ die iedereen op de dansvloer krijgt.",
  image: "/images/diensten.jpg",
  permalink: "diensten"
};

const dienstenContentEn = {
  title: "Book DJ Cylow for your event!",
  description: "The DJ who gets everyone on the dance floor.",
  image: "/images/diensten.jpg",
  permalink: "diensten"
};

export function getDienstenContent(locale: string) {
  return locale === 'nl' ? dienstenContentNl : dienstenContentEn;
}

export const dienstenContent = dienstenContentEn;
