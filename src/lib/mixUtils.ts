import mixes from '@/data/mixes.json';

export const getMixesByColor = (color: string, power: 'Light' | 'Full') => {
  return mixes.filter(mix =>
    mix.color.toLowerCase() === color.toLowerCase() &&
    mix.power === power &&
    mix.image_square
  ).sort((a, b) => {
    // We bouwen een geldige datumstring van de losse velden: jaar-maand-dag
    const dateA = new Date(`${a.jaar}-${a.maand}-${a.dag}`).getTime();
    const dateB = new Date(`${b.jaar}-${b.maand}-${b.dag}`).getTime();

    return dateB - dateA; // Nieuwste bovenaan
  });
};