import { Metadata } from 'next'
import CatalogClient from './CatalogClient'
import fs from 'fs'
import path from 'path'

export const metadata: Metadata = {
  title: 'All Fireworks & Crackers | 62 Patakha Shop Jaipur',
  description:
    'Explore 200+ authentic Sivakasi fireworks, sky rockets, sparklers, and anars. Best prices and direct pickup at Hawa Mahal Bazar, Jaipur.',
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

export default function CatalogPage() {
  const products = getInitialProducts()

  return <CatalogClient initialProducts={products} />
}
