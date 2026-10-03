'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { CATEGORY_CARDS } from '@/data/categories'
import styles from './PopularCategoriesRail.module.css'

export default function PopularCategoriesRail() {
  const popularCategories = CATEGORY_CARDS.slice(1, 7)

  return (
    <section className={styles.section}>
      <div className="editorial-container">
        <div className={styles.header}>
          <div>
            <span className="eyebrow-pill">Shop by Category</span>
            <h2 className={styles.title}>Popular Categories</h2>
          </div>
          <Link href="/catalog" className={styles.viewAll}>
            View All Categories <span>→</span>
          </Link>
        </div>

        <div className={styles.grid}>
          {popularCategories.map((cat) => (
            <Link
              key={cat.id}
              href={`/catalog?cat=${encodeURIComponent(cat.id)}`}
              className={styles.catCard}
            >
              <div className={styles.iconCircle}>
                <Image
                  src={cat.image}
                  alt={cat.label}
                  width={110}
                  height={110}
                  className={styles.catImg}
                />
              </div>
              <span className={styles.catName}>{cat.label}</span>
              <span className={styles.catHindi}>{cat.hindiName}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
