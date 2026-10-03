import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ImageReveal from '@/components/ImageReveal'
import ProductDetailClient from './ProductDetailClient'
import fs from 'fs'
import path from 'path'

interface PageProps {
  params: Promise<{
    product: string
  }>
}

function getAllProducts() {
  try {
    const pPath = path.join(process.cwd(), 'src', 'data', 'products.json')
    const file = fs.readFileSync(pPath, 'utf-8')
    return JSON.parse(file)
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { product: productId } = await params
  const products = getAllProducts()
  const p = products.find((item: any) => String(item.id) === String(productId))
  if (!p) {
    return { title: 'Fireworks Item | 62 Patakha Shop' }
  }
  return {
    title: `${p.name} | 62 Patakha Shop Jaipur`,
    description: `Detailed fireworks specifications, altitude, duration and safety clearances for ${p.name} by ${p.brand || '62 Patakha Shop'}.`,
  }
}

export async function generateStaticParams() {
  const products = getAllProducts()
  // Generate first 30 products statically for performance
  return products.slice(0, 30).map((p: any) => ({
    product: String(p.id),
  }))
}

export default async function ProductPage({ params }: PageProps) {
  const { product: productId } = await params
  const products = getAllProducts()
  const p = products.find((item: any) => String(item.id) === String(productId))

  if (!p) {
    notFound()
  }

  // Related products from same category
  const related = products
    .filter((item: any) => item.category === p.category && String(item.id) !== String(p.id))
    .slice(0, 4)

  return <ProductDetailClient product={p} relatedProducts={related} />
}
