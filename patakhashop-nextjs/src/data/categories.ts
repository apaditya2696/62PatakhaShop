export interface CategoryCardInfo {
  id: string
  slug: string
  label: string
  hindiName: string
  icon: string
  desc: string
  image: string
}

export const CATEGORY_CARDS: CategoryCardInfo[] = [
  {
    id: 'all',
    slug: 'all',
    label: 'All Fireworks',
    hindiName: 'सभी पटाखे',
    icon: '',
    desc: 'Over 200+ fireworks and crackers for celebrations',
    image: '/cat-aerial-cakes.jpg',
  },
  {
    id: 'rockets',
    slug: 'rockets',
    label: 'Sky Rockets',
    hindiName: 'रॉकेट्स',
    icon: '',
    desc: 'High flying whistling rockets with bright lights',
    image: '/cat-sky-rockets.jpg',
  },
  {
    id: 'flowerpots',
    slug: 'flowerpots',
    label: 'Flower Pots & Anars',
    hindiName: 'शानदार अनार',
    icon: '',
    desc: 'Color fountains and sparkling golden anars',
    image: '/cat-fountains.jpg',
  },
  {
    id: 'torches',
    slug: 'torches',
    label: 'Roman Candles/Torches',
    hindiName: 'टॉर्च / कैंडल',
    icon: '',
    desc: 'Color flares, torches and bright light candles',
    image: '/cat-roman-candles.jpg',
  },
  {
    id: 'sparklers',
    slug: 'sparklers',
    label: 'Sparklers (Phuljhadi)',
    hindiName: 'फुलझड़ी',
    icon: '',
    desc: 'Electric sparklers and color crackling phuljhadi',
    image: '/cat-sparklers.jpg',
  },
  {
    id: 'aerial cakes',
    slug: 'aerial-cakes',
    label: 'Multi-Shot Cakes',
    hindiName: 'मल्टीशॉट एरियल केक्स',
    icon: '',
    desc: 'Multi-shot sky fireworks from 7 to 1,000 shots',
    image: '/cat-aerial-cakes.jpg',
  },
  {
    id: 'crackers',
    slug: 'crackers',
    label: 'Traditional Crackers & Lar',
    hindiName: 'पटाखे / लड़ी',
    icon: '',
    desc: 'Red sound crackers, chorsa and festive ladi',
    image: '/cat-crackers.jpg',
  },
  {
    id: 'skyshots',
    slug: 'skyshots',
    label: 'Sky Shots & Shells',
    hindiName: 'आसमानी सिंगल शॉट्स',
    icon: '',
    desc: 'Single pipe sky shots in 1.5 to 5 inch sizes',
    image: '/best-2.jpg',
  },
  {
    id: 'chakkar',
    slug: 'chakkar',
    label: 'Chakkar & Spinners',
    hindiName: 'चक्र',
    icon: '',
    desc: 'Ground spinning wheels and chakkars',
    image: '/products/prod_105_359.png',
  },
  {
    id: 'bombs',
    slug: 'bombs',
    label: 'Bombs',
    hindiName: 'धमाकेदार बम',
    icon: '',
    desc: 'Hydro, Classic, Atom and loud sound bombs',
    image: '/products/prod_48_551.png',
  },
  {
    id: 'kids special',
    slug: 'kids-special',
    label: 'Family & Kids Special',
    hindiName: 'बच्चों व परिवार के पटाखे',
    icon: '',
    desc: 'Safe pop pops, whistles, magic toys and fun items for kids & family',
    image: '/products/prod_44_16262.png',
  },
]

/**
 * Maps any raw product category or text to the best matching canonical category
 */
export function getCategoryForProduct(categoryString: string = '', productName: string = ''): CategoryCardInfo {
  const text = `${categoryString} ${productName}`.toLowerCase()

  if (text.includes('flower pot') || text.includes('flowerpot') || text.includes('anar') || text.includes('fountain') || text.includes('3d pot')) {
    return CATEGORY_CARDS.find(c => c.id === 'flowerpots') || CATEGORY_CARDS[0]
  }
  if (text.includes('rocket')) {
    return CATEGORY_CARDS.find(c => c.id === 'rockets') || CATEGORY_CARDS[0]
  }
  if (text.includes('torch') || text.includes('candle')) {
    return CATEGORY_CARDS.find(c => c.id === 'torches') || CATEGORY_CARDS[0]
  }
  if (text.includes('sparkler') || text.includes('phuljhadi')) {
    return CATEGORY_CARDS.find(c => c.id === 'sparklers') || CATEGORY_CARDS[0]
  }
  if (text.includes('aerial') || text.includes('cake') || text.includes('multi-shot') || (text.includes('shot') && !text.includes('sky shot') && !text.includes('single'))) {
    return CATEGORY_CARDS.find(c => c.id === 'aerial cakes') || CATEGORY_CARDS[0]
  }
  if (text.includes('sky shot') || text.includes('skyshots') || text.includes('shell')) {
    return CATEGORY_CARDS.find(c => c.id === 'skyshots') || CATEGORY_CARDS[0]
  }
  if (text.includes('chakkar') || text.includes('spinner') || text.includes('wheel')) {
    return CATEGORY_CARDS.find(c => c.id === 'chakkar') || CATEGORY_CARDS[0]
  }
  if (text.includes('bomb') || text.includes('hydro') || text.includes('atom')) {
    return CATEGORY_CARDS.find(c => c.id === 'bombs') || CATEGORY_CARDS[0]
  }
  if (text.includes('cracker') || text.includes('lar') || text.includes('chorsa') || text.includes('ladi')) {
    return CATEGORY_CARDS.find(c => c.id === 'crackers') || CATEGORY_CARDS[0]
  }
  if (text.includes('kid') || text.includes('novelty') || text.includes('novelties') || text.includes('pop') || text.includes('toy')) {
    return CATEGORY_CARDS.find(c => c.id === 'kids special') || CATEGORY_CARDS[0]
  }

  return CATEGORY_CARDS.find(c => c.id === 'all') || CATEGORY_CARDS[0]
}
