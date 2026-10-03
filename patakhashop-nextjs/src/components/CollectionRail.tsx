'use client'

import React from 'react'
import Link from 'next/link'
import ImageReveal from './ImageReveal'
import { CURATED_COLLECTIONS } from '@/data/collections'
import styles from './CollectionRail.module.css'

export default function CollectionRail() {
  return (
    <section className={styles.section}>
      <div className="editorial-container">
        <div className={styles.header}>
          <div className={styles.headerText}>
            <span className="eyebrow-pill">Special Packs</span>
            <h2 className={styles.title}>Fireworks For Every Occasion</h2>
            <p className={styles.subtitle}>
              Handpicked firecracker sets for Diwali, weddings, birthday parties, and family gatherings.
            </p>
          </div>
          <Link href="/catalog" className={styles.viewAllLink}>
            View All Fireworks <span>→</span>
          </Link>
        </div>

        <div className={styles.grid}>
          {CURATED_COLLECTIONS.map((col, index) => (
            <Link
              key={col.id}
              href={`/catalog/${col.slug}`}
              className={`${styles.card} ${index === 0 ? styles.featuredCard : ''}`}
            >
              <div className={styles.imageBox}>
                <ImageReveal
                  src={col.heroImage}
                  alt={col.title}
                  aspectRatio={index === 0 ? '16/10' : '4/3'}
                />
                <div className={styles.imageShade} />
              </div>

              <div className={styles.content}>
                <span className={styles.badge}>{col.highlightBadge}</span>
                <h3 className={styles.colTitle}>{col.title}</h3>
                <p className={styles.colSub}>{col.subtitle}</p>
                <p className={styles.colDesc}>{col.description}</p>

                <div className={styles.exploreCta}>
                  <span>View Products</span>
                  <span className={styles.arrowIcon}>→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
