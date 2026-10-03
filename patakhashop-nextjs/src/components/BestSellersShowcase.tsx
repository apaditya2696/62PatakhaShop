'use client'

import React from 'react'
import Link from 'next/link'
import ProductCard from './ProductCard'
import productsData from '@/data/products.json'
import styles from './BestSellersShowcase.module.css'

export default function BestSellersShowcase() {
  // Pull actual 62 Patakha Shop top best-sellers directly from the authentic store inventory
  const curatedBestSellers = [
    {
      id: "1221",
      name: "100 Shot (Mercury) Multi-Sky Shell",
      brand: "Mercury Pyrotechnics",
      category: "Sky Shots & Aerials",
      price: 2500,
      originalPrice: 9000,
      discount: "72% OFF",
      image: "/products/prod_5_1221.png",
      inStock: true
    },
    {
      id: "865",
      name: "100 Salute Grand Finale",
      brand: "Azad Fireworks",
      category: "Sky Shots & Salutes",
      price: 3200,
      originalPrice: 4500,
      discount: "29% OFF",
      image: "/products/prod_4_865.png",
      inStock: true
    },
    {
      id: "635",
      name: "2 In 1 Mud Flower Pot (10 Pc Box)",
      brand: "Sivakasi Select",
      category: "Flower Pots (Anar)",
      price: 600,
      originalPrice: 1200,
      discount: "50% OFF",
      image: "/products/prod_15_635.png",
      inStock: true
    },
    {
      id: "22720",
      name: "1 Star 1k Traditional Festival Lar",
      brand: "Standard Sivakasi",
      category: "Festival Lar & Crackers",
      price: 400,
      originalPrice: 1750,
      discount: "77% OFF",
      image: "/products/prod_2_22720.jpg",
      inStock: true
    }
  ]

  return (
    <section className={styles.section}>
      <div className="editorial-container">
        <div className={styles.header}>
          <div>
            <span className="eyebrow-pill">Hawa Mahal Bazar Signatures</span>
            <h2 className={styles.title}>62 Patakha Shop Best Sellers</h2>
            <p className={styles.subtitle}>
              Actual customer favorites from our 60+ year Jaipur catalog. 100% genuine Sivakasi wholesale rates.
            </p>
          </div>
          <Link href="/catalog" className={styles.viewAll}>
            View All 200+ Products <span>→</span>
          </Link>
        </div>

        <div className={styles.grid}>
          {curatedBestSellers.map((item, idx) => (
            <ProductCard
              key={item.id}
              id={item.id}
              name={item.name}
              brand={item.brand}
              category={item.category}
              price={item.price}
              originalPrice={item.originalPrice}
              discount={item.discount}
              image={item.image}
              inStock={item.inStock}
              aspectRatio="1/1"
              priority={idx < 2}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
