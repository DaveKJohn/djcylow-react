import mixes from '@/data/mixes.json';

// Dit vervangt jouw "featuredOrangeMix" etc.
export function getFeaturedMixesByColor(color: string) {
  return mixes.filter(mix => 
    mix.color.toLowerCase() === color.toLowerCase()
  );
}

// Dit vervangt jouw "luister_edm" collectie
export function getMixesByGenre(genre: string) {
  return mixes.filter(mix => mix.genre === genre);
}