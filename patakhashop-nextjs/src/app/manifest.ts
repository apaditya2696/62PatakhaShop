import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: '62 Patakha Shop Admin',
    short_name: '62 Admin',
    description: '62 Patakha Shop Jaipur — Central Orders & Inventory Portal',
    start_url: '/admin',
    display: 'standalone',
    background_color: '#0b0f19',
    theme_color: '#0b0f19',
    icons: [
      {
        src: '/logo-62.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/logo-62.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  }
}
