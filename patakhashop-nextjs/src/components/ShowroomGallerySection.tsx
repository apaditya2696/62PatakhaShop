'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import styles from './ShowroomGallerySection.module.css'

const SHOWROOM_PHOTOS = [
  {
    title: 'Iconic Hawa Mahal Bazar Storefront',
    subtitle: 'Shop No. 62 • Near Old Vidhan Sabha',
    src: '/shop-front-1.jpg',
    tag: 'Main Store'
  },
  {
    title: 'Showroom Interior & Counter',
    subtitle: 'Warm Hospitality Since 1964',
    src: '/shop-interior-counter.jpg',
    tag: 'Since 1964'
  },
  {
    title: 'Fancy Sky Shots & Shells',
    subtitle: 'Cock Brand, Sony & Top Brands',
    src: '/shop-products-1.jpg',
    tag: 'Original Sivakasi'
  },
  {
    title: 'Festival Sparklers & Gift Boxes',
    subtitle: 'Diwali & Wedding Fireworks Collection',
    src: '/shop-products-2.jpg',
    tag: 'Festival Stock'
  }
]

export default function ShowroomGallerySection() {
  return (
    <section className={styles.section} id="showroom">
      <div className="editorial-container">
        <div className={styles.header}>
          <div>
            <span className="eyebrow-pill">Our Store</span>
            <h2 className={styles.title}>Inside 62 Patakha Shop</h2>
            <p className={styles.subtitle}>
              Real photos of our shop at Hawa Mahal Bazar, Jaipur. Welcoming families and festive shoppers since 1964.
            </p>
          </div>
          <Link href="/contact" className={styles.visitLink}>
            Store Location &amp; Hours <span>→</span>
          </Link>
        </div>

        <div className={styles.grid}>
          {SHOWROOM_PHOTOS.map((item, idx) => (
            <div key={idx} className={styles.card}>
              <div className={styles.imageWrap}>
                <Image
                  src={item.src}
                  alt={item.title}
                  fill
                  className={styles.img}
                  sizes="(max-width: 768px) 100vw, 25vw"
                />
                <div className={styles.badge}>{item.tag}</div>
              </div>
              <div className={styles.cardInfo}>
                <h3 className={styles.cardTitle}>{item.title}</h3>
                <p className={styles.cardSub}>{item.subtitle}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Live Store Status Strip */}
        <div className={styles.statusStrip}>
          <div className={styles.statusLeft}>
            <span className={styles.livePulse} />
            <div className={styles.statusTextWrap}>
              <span className={styles.statusHeadline}>Showroom Open Today:</span>
              <span className={styles.statusTime}>9:00 AM – 10:00 PM IST</span>
              <span className={styles.statusDot}>•</span>
              <span className={styles.statusLocation}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={styles.locIcon}>
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                Hawa Mahal Bazar, Jaipur
              </span>
            </div>
          </div>

          <div className={styles.statusRight}>
            <div className={styles.gstinPill}>
              <span className={styles.gstinLabel}>GSTIN:</span>
              <strong className={styles.gstinVal}>08AAYPA5582F1ZC</strong>
            </div>

            <a href="tel:+918561005357" className={styles.phoneBtn} aria-label="Call 62 Patakha Shop">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              <span>+91 85610 05357</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
