import mixes from '@/data/mixes.json';

export const getMixesByColor = (color: string, power: 'Light' | 'Full') => {
  return mixes.filter(mix => 
    mix.color.toLowerCase() === color.toLowerCase() && 
    mix.power === power &&
    mix.image_square
  ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};