export interface EditorialStory {
  slug: string
  title: string
  subtitle: string
  collection: string
  readTime: string
  date: string
  coverImage: string
  excerpt: string
  content: {
    lead: string
    sections: {
      heading: string
      body: string
      quote?: string
    }[]
    safetyTip: string
    suggestedProducts: string[]
  }
}

export const EDITORIAL_STORIES: EditorialStory[] = [
  {
    slug: 'the-art-of-diwali-skies',
    title: 'Diwali Fireworks Guide: How to Plan a Great Night',
    subtitle: 'From simple sparklers to grand sky shots, how to celebrate safely with family.',
    collection: 'Diwali Guide',
    readTime: '3 min read',
    date: 'Festive Season 2025',
    coverImage: '/shop-products-1.jpg',
    excerpt: 'Tips on choosing the best golden anars, bright sparklers, and colorful sky shots for your family Diwali celebration.',
    content: {
      lead: 'In Indian festivals, fireworks bring families and neighbors together under the night sky in joy and celebration.',
      sections: [
        {
          heading: 'How to Start Your Evening',
          body: 'We suggest starting your evening with gentle sparklers (phuljhadi) and ground spinners (chakkars). As the evening goes on, light up colorful flowerpot fountains (anars), followed by high-flying sky shots.',
          quote: 'The best celebrations are those where everyone stays safe and enjoys bright, colorful lights together.'
        },
        {
          heading: 'Choosing Low-Smoke Green Fireworks',
          body: 'Approved green crackers produce much less smoke and no toxic chemicals. They keep the air clearer and make celebrations enjoyable for everyone, including elders and children.'
        }
      ],
      safetyTip: 'Always keep an open space of at least 15 to 25 meters. Keep buckets of water and sand nearby before lighting fireworks.',
      suggestedProducts: ['1221', '865', '22752']
    }
  },
  {
    slug: 'royal-wedding-fireworks',
    title: 'Wedding Fireworks Guide: Best Fireworks for Baraat & Sangeet',
    subtitle: 'Tips on sparkling entries, golden fountains, and grand sky shots for weddings.',
    collection: 'Wedding Guide',
    readTime: '4 min read',
    date: 'Wedding Season',
    coverImage: '/shop-products-2.jpg',
    excerpt: 'How to choose golden sparkling fountains, anars, and grand sky fireworks for wedding functions and parties.',
    content: {
      lead: 'Weddings and celebrations are unforgettable moments that look even more magical with the right fireworks display.',
      sections: [
        {
          heading: 'Grand Sky Fireworks for the Baraat',
          body: 'For the groom’s arrival and key moments, multi-shot sky cakes create colorful bursts and glitter trails across the open sky.',
          quote: 'A grand golden sky shower makes the wedding entry truly memorable for all guests.'
        },
        {
          heading: 'Cold Spark Entry Fountains',
          body: 'For stage entries and garland exchange (varmala), cold spark fireworks create dazzling 3-meter fountains that are safe, smokeless, and odorless.'
        }
      ],
      safetyTip: 'For wedding venues, always assign an open, clear area for sky fireworks away from tents, canopies, and parked cars.',
      suggestedProducts: ['865', '1221', '22846']
    }
  },
  {
    slug: 'responsible-celebrations-and-compliance',
    title: 'Safety & Green Crackers: Celebrate Responsibly',
    subtitle: 'Government approved green crackers, safety rules, and good timing.',
    collection: 'Safety Guide',
    readTime: '3 min read',
    date: 'Safety Standards',
    coverImage: '/shop-products-3.jpg',
    excerpt: 'Our commitment to certified green crackers, safe sound limits, and respect for neighbors.',
    content: {
      lead: 'At 62 Patakha Shop, we want every family to celebrate with joy while keeping children, elders, and pets safe.',
      sections: [
        {
          heading: 'What Are Green Crackers?',
          body: 'All fireworks in our shop follow certified green cracker standards. They reduce airborne dust and smoke by up to 30% and do not use harmful banned chemicals.',
          quote: 'Enjoying tradition means caring for both our celebration and the air we breathe.'
        },
        {
          heading: 'Best Timings and Courtesy',
          body: 'We recommend celebrating between 8:00 PM and 10:00 PM. Focusing on colorful lights and visual fountains rather than loud sound helps everyone enjoy the festival peacefully.'
        }
      ],
      safetyTip: 'Always drop used sparkler wires and fireworks in a bucket of water before throwing them away to avoid any fire risk.',
      suggestedProducts: ['22846', '22720']
    }
  }
]
