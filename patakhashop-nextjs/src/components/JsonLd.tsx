import React from 'react'

interface JsonLdProps {
  data: Record<string, any>
}

export default function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

export const shopLocalBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'Store',
  '@id': 'https://www.62patakhashop.com/#store',
  name: '62 Patakha Shop',
  alternateName: '62 Crackers & Fireworks Store Jaipur',
  description:
    'Jaipur’s authentic 62 Patakha Shop operating at Hawa Mahal Bazar since 1964. Selling certified Sivakasi green crackers and fancy fireworks.',
  url: 'https://www.62patakhashop.com',
  telephone: '+918561005357',
  priceRange: '₹₹',
  image: ['https://www.62patakhashop.com/shop-front-1.jpg', 'https://www.62patakhashop.com/logo-62.png'],
  logo: 'https://www.62patakhashop.com/logo-62.png',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '62, Hawa Mahal Bazar, Near Old Vidhan Sabha',
    addressLocality: 'Jaipur',
    addressRegion: 'Rajasthan',
    postalCode: '302002',
    addressCountry: 'IN',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 26.9239,
    longitude: 75.8267,
  },
  openingHoursSpecification: {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday',
    ],
    opens: '09:00',
    closes: '22:00',
  },
  hasMap: 'https://maps.google.com/?q=62+Hawa+Mahal+Bazar+Jaipur',
}
