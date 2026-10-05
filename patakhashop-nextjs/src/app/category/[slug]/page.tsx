import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ShopClient from '@/app/shop/ShopClient'
import { CATEGORY_CARDS } from '@/data/categories'
import fs from 'fs'
import path from 'path'

interface PageProps {
  params: Promise<{
    slug: string
  }>
}

function getInitialProducts() {
  try {
    const pPath = path.join(process.cwd(), 'src', 'data', 'products.json')
    const file = fs.readFileSync(pPath, 'utf-8')
    return JSON.parse(file)
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const cat = CATEGORY_CARDS.find(c => c.slug === slug)
  if (!cat) {
    return {
      title: 'Fireworks Category | 62 Patakha Shop Jaipur',
    }
  }

  return {
    title: `${cat.label} Online | 62 Patakha Shop Jaipur`,
    description: `Buy genuine ${cat.label} at wholesale prices from 62 Patakha Shop Jaipur. 100% Sivakasi authentic crackers with instant WhatsApp ordering.`,
  }
}

export async function generateStaticParams() {
  return CATEGORY_CARDS.filter(c => c.slug !== 'all').map(c => ({
    slug: c.slug,
  }))
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params
  const cat = CATEGORY_CARDS.find(c => c.slug === slug)

  if (!cat) {
    notFound()
  }

  const products = getInitialProducts()

  return (
    <ShopClient
      initialProducts={products}
      defaultCategory={cat.id}
      categoryInfo={cat}
      isCategoryPage={true}
      pageTitle={cat.label}
    />
  )
}

