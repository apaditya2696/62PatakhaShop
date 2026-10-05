import { MetadataRoute } from 'next'
import { CATEGORY_CARDS } from '@/data/categories'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.62patakhashop.com'
  const lastModified = new Date()

  // Static site pages
  const staticRoutes = [
    '',
    '/catalog',
    '/about',
    '/contact',
    '/safety',
    '/themes',
    '/privacy',
    '/terms',
    '/wishlist',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified,
    changeFrequency: route === '' || route === '/catalog' ? ('daily' as const) : ('monthly' as const),
    priority: route === '' ? 1.0 : route === '/catalog' ? 0.9 : 0.7,
  }))

  // Dynamic category pages
  const categoryRoutes = CATEGORY_CARDS.filter((cat) => cat.slug !== 'all').map((cat) => ({
    url: `${baseUrl}/category/${cat.slug}`,
    lastModified,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  return [...staticRoutes, ...categoryRoutes]
}
