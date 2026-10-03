import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import CatalogClient, { Product } from '@/app/catalog/CatalogClient'
import { CURATED_COLLECTIONS } from '@/data/collections'
import fs from 'fs'
import path from 'path'

interface PageProps {
  params: Promise<{
    collection: string
  }>
}

function getInitialProducts(): Product[] {
  try {
    const pPath = path.join(process.cwd(), 'src', 'data', 'products.json')
    const file = fs.readFileSync(pPath, 'utf-8')
    return JSON.parse(file)
  } catch {
    return []
  }
}

function filterProductsByCollection(products: Product[], filterTag: string): Product[] {
  return products.filter((p) => {
    const text = `${p.name} ${p.category || ''} ${p.tags || ''} ${p.brand || ''}`.toLowerCase()
    if (filterTag === 'diwali') {
      return (
        text.includes('diwali') ||
        text.includes('anar') ||
        text.includes('flower pot') ||
        text.includes('chakkar') ||
        text.includes('sparkler') ||
        text.includes('lar')
      )
    }
    if (filterTag === 'wedding') {
      return (
        text.includes('shot') ||
        text.includes('salute') ||
        text.includes('wedding') ||
        text.includes('aerial') ||
        text.includes('shell') ||
        p.price >= 1500
      )
    }
    if (filterTag === 'celebration') {
      return (
        text.includes('shot') ||
        text.includes('cake') ||
        text.includes('bomb') ||
        text.includes('rocket') ||
        text.includes('mercury') ||
        text.includes('azad')
      )
    }
    if (filterTag === 'family') {
      return (
        text.includes('kids') ||
        text.includes('sparkler') ||
        text.includes('torch') ||
        text.includes('candle') ||
        text.includes('pot') ||
        text.includes('novelties') ||
        text.includes('pop')
      )
    }
    return true
  })
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { collection } = await params
  const col = CURATED_COLLECTIONS.find((c) => c.slug === collection)
  if (!col) {
    return { title: 'Collection Not Found | 62 Patakha Shop' }
  }
  return {
    title: `${col.title} | 62 Patakha Shop Jaipur`,
    description: col.description,
  }
}

export async function generateStaticParams() {
  return CURATED_COLLECTIONS.map((c) => ({
    collection: c.slug,
  }))
}

export default async function CollectionPage({ params }: PageProps) {
  const { collection } = await params
  const col = CURATED_COLLECTIONS.find((c) => c.slug === collection)

  if (!col) {
    notFound()
  }

  const allProducts = getInitialProducts()
  const curatedProducts = filterProductsByCollection(allProducts, col.filterTag)

  return (
    <CatalogClient
      initialProducts={curatedProducts}
      defaultCollectionTitle={col.title}
      defaultCollectionDesc={col.description}
    />
  )
}
