import React from 'react'
import type { Metadata } from 'next'
import HeroParallax from '@/components/HeroParallax'
import PopularCategoriesRail from '@/components/PopularCategoriesRail'
import ShowroomGallerySection from '@/components/ShowroomGallerySection'
import CollectionRail from '@/components/CollectionRail'
import ComplianceSection from '@/components/ComplianceSection'
import Image from 'next/image'
import Link from 'next/link'
import styles from './page.module.css'

export const metadata: Metadata = {
  title: '62 Patakha Shop – Best Fireworks & Crackers Shop in Jaipur | Sivakasi Crackers',
  description:
    'Buy best quality fireworks and crackers in Jaipur for Diwali, weddings, and parties. 100% original Sivakasi products at best prices since 1964.',
}

export default function HomePage() {
  return (
    <div className={styles.pageWrap}>
      {/* 1. Full-Bleed Hero with Parallax & Warm Transition */}
      <HeroParallax />

      {/* 2. Popular Categories Circular Rail */}
      <PopularCategoriesRail />

      {/* 3. Inside 62 Patakha Shop — Actual Showroom Photography & Heritage */}
      <ShowroomGallerySection />

      {/* 4. Curated Seasonal Collections (Diwali, Wedding, Celebration, Family-Friendly) */}
      <CollectionRail />

      {/* 5. Editorial Section: Responsible Celebration & Local Compliance */}
      <ComplianceSection />

      <section className={styles.panoramicBanner}>
        <div className={styles.bannerImageWrap}>
          <Image
            src="/shop-front-2.jpg"
            alt="62 Patakha Shop – Hawa Mahal Bazar, Jaipur"
            fill
            className={styles.bannerImg}
          />
          <div className={styles.bannerOverlay} />
        </div>
        <div className="editorial-container">
          <div className={styles.bannerContent}>
            <span className={styles.bannerEyebrow}>Since 1964 • Jaipur</span>
            <h2 className={styles.bannerHeading}>
              Make Every Celebration <br />
              <span className={styles.bannerHeadingItalic}>Extra Special</span>
            </h2>
            <p className={styles.bannerText}>
              Visit our store at Hawa Mahal Bazar and choose from 200+ fireworks for Diwali, weddings, birthdays and all your celebrations.
            </p>
            <div className={styles.bannerCtaRow}>
              <Link href="/catalog" className="btn-aurora-gold">
                Explore Full Catalog
              </Link>
              <Link href="/contact" className="btn-aurora-secondary" style={{ color: '#FFFFFF', borderColor: 'rgba(255,255,255,0.4)' }}>
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
