export interface CuratedCollection {
  id: string
  slug: string
  title: string
  subtitle: string
  tagline: string
  description: string
  heroImage: string
  accentColor: string
  highlightBadge: string
  filterTag: string
}

export const CURATED_COLLECTIONS: CuratedCollection[] = [
  {
    id: 'diwali',
    slug: 'diwali',
    title: 'Diwali Special Pack',
    subtitle: 'Golden Sparkles & Family Crackers',
    tagline: 'Best Fireworks for Diwali Night',
    description: 'A great selection of golden anars, spinning chakkars, and colorful sky shots for your family Diwali celebration.',
    heroImage: '/shop-front-1.jpg',
    accentColor: '#C99E52',
    highlightBadge: 'Diwali Special',
    filterTag: 'diwali'
  },
  {
    id: 'wedding',
    slug: 'wedding',
    title: 'Weddings & Parties',
    subtitle: 'Grand Sky Shots & Entry Fireworks',
    tagline: 'Perfect for Baraat & Sangeet',
    description: 'Big multi-shot sky fireworks, sparkling golden showers, and vibrant celebrations for wedding functions and parties.',
    heroImage: '/shop-products-2.jpg',
    accentColor: '#B68D40',
    highlightBadge: 'Wedding Special',
    filterTag: 'wedding'
  },
  {
    id: 'celebration',
    slug: 'celebration',
    title: 'Grand Celebrations',
    subtitle: 'High Sky Fireworks & Loud Sound',
    tagline: 'Birthdays, Parties & New Year',
    description: 'High flying sky shots, multi-color bursts, and exciting sound crackers to celebrate your big occasions.',
    heroImage: '/best-3.jpg',
    accentColor: '#A37937',
    highlightBadge: 'Sky Fireworks',
    filterTag: 'celebration'
  },
  {
    id: 'family-friendly',
    slug: 'family-friendly',
    title: 'Safe Family & Kids Pack',
    subtitle: 'Low Smoke & Safe Sparklers',
    tagline: 'Safe Fun for Kids & Pets',
    description: 'Gentle sparklers, soundless pop pops, color candles, and safe ground fireworks for children and family.',
    heroImage: '/cat-sparklers.jpg',
    accentColor: '#8C6D38',
    highlightBadge: 'Child & Pet Safe',
    filterTag: 'family'
  }
]
