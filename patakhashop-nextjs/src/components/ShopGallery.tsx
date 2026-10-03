'use client'
import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import styles from './ShopGallery.module.css'


interface GalleryItem {
  id: string
  title: string
  category: string
  categorySlug: 'all' | 'store' | 'fancy' | 'rockets' | 'shelves'
  desc: string
  src: string
  alt: string
  badge: string
}

const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'storefront-main',
    title: '62 Patakha Shop Main Storefront',
    category: 'Store & Showroom',
    categorySlug: 'store',
    desc: 'Our iconic entrance at 62, Hawa Mahal Bazar, Jaipur. Welcoming festive families for over 60 years.',
    src: '/shop-front-1.webp',
    alt: '62 Patakha Shop storefront at Hawa Mahal Bazar, Jaipur',
    badge: 'Main Showroom',
  },
  {
    id: 'fancy-collection',
    title: 'Fancy Fireworks & Aerial Sky Shots',
    category: 'Fancy Fireworks',
    categorySlug: 'fancy',
    desc: 'Nayabra Falls, Golden Angels, Crackling Stars, Olympic Torches and celebration boxes.',
    src: '/shop-products-1.webp',
    alt: 'Fancy fireworks boxes including Nayabra Falls and Olympic Torches',
    badge: 'Fancy Specials',
  },
  {
    id: 'rockets-display',
    title: 'High-Altitude Sky Rockets & Aerials',
    category: 'Rockets & Aerials',
    categorySlug: 'rockets',
    desc: 'Texas Rider, Raider Star, Reebok, and high-decibel multi-color aerial sky shots ready in stock.',
    src: '/shop-products-2.webp',
    alt: 'Rockets and aerial fireworks display at 62 Patakha Shop',
    badge: 'Sky Rockets',
  },
  {
    id: 'shelf-stock',
    title: 'Sivakasi Direct Master Inventory',
    category: 'Inventory Shelves',
    categorySlug: 'shelves',
    desc: 'Factory-direct genuine stock from Cock Brand, Sony, Sunshine, Vinayaga & Cornation.',
    src: '/shop-products-3.webp',
    alt: 'Extensive shelf collection of Sivakasi fireworks at 62 Patakha Shop',
    badge: '500+ Items',
  },
  {
    id: 'interior-counter',
    title: 'Showroom Counter & Pyrotechnic Shelves',
    category: 'Inventory Shelves',
    categorySlug: 'shelves',
    desc: 'Full-length showroom counter with hundreds of multi-shot aerial cakes, City Sky, Twister & Golden fireworks.',
    src: '/shop-interior-counter.jpg',
    alt: 'Long sales counter and fireworks shelves inside 62 Patakha Shop',
    badge: 'Showroom Inside',
  },
  {
    id: 'festive-customers',
    title: 'Festive Celebrations & Grand Aerial Packs',
    category: 'Store & Showroom',
    categorySlug: 'store',
    desc: 'Delighted customers with giant celebration aerial boxes (Pink Out & Jungle Party) at 62 Patakha Shop.',
    src: '/shop-customer-entrance.jpg',
    alt: 'Customer holding Pink Out and Jungle Party fireworks at 62 Patakha Shop entrance',
    badge: 'Festive Customers',
  },
]

const CATEGORIES = [
  { slug: 'all', label: 'All Photos (6)' },
  { slug: 'store', label: 'Store & Showroom' },
  { slug: 'fancy', label: 'Fancy Fireworks' },
  { slug: 'rockets', label: 'Rockets & Aerials' },
  { slug: 'shelves', label: 'Complete Shelves' },
] as const

export default function ShopGallery() {
  const [activeTab, setActiveTab] = useState<string>('all')
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const filteredItems = activeTab === 'all'
    ? GALLERY_ITEMS
    : GALLERY_ITEMS.filter(item => item.categorySlug === activeTab)

  const openLightbox = (index: number) => {
    setLightboxIndex(index)
  }

  const closeLightbox = () => {
    setLightboxIndex(null)
  }

  const nextImage = useCallback(() => {
    if (lightboxIndex === null) return
    setLightboxIndex((lightboxIndex + 1) % filteredItems.length)
  }, [lightboxIndex, filteredItems.length])

  const prevImage = useCallback(() => {
    if (lightboxIndex === null) return
    setLightboxIndex((lightboxIndex - 1 + filteredItems.length) % filteredItems.length)
  }, [lightboxIndex, filteredItems.length])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return
      if (e.key === 'Escape') closeLightbox()
      if (e.key === 'ArrowRight') nextImage()
      if (e.key === 'ArrowLeft') prevImage()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [lightboxIndex, nextImage, prevImage])

  return (
    <div className={styles.galleryWrap}>
      {/* Category Filter Tabs */}
      <div className={styles.filterTabs} role="tablist">
        {CATEGORIES.map(cat => (
          <button
            key={cat.slug}
            type="button"
            role="tab"
            aria-selected={activeTab === cat.slug}
            className={`${styles.tabBtn} ${activeTab === cat.slug ? styles.tabActive : ''}`}
            onClick={() => setActiveTab(cat.slug)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Gallery Grid */}
      <div className={styles.grid}>
        {filteredItems.map((item, idx) => (
          <div
            key={item.id}
            className={styles.card}
            onClick={() => openLightbox(idx)}
            role="button"
            tabIndex={0}
            aria-label={`View ${item.title} full screen`}
            onKeyDown={(e) => e.key === 'Enter' && openLightbox(idx)}
          >
            <div className={styles.imgContainer}>
              <Image
                src={item.src}
                alt={item.alt}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                quality={84}
                className={styles.img}
                loading={idx < 2 ? 'eager' : 'lazy'}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Fullscreen Interactive Lightbox Modal */}
      {lightboxIndex !== null && (
        <div
          className={styles.lightbox}
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
        >
          <div className={styles.lightboxContent} onClick={(e) => e.stopPropagation()}>
            <button
              className={styles.closeBtn}
              onClick={closeLightbox}
              aria-label="Close modal"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>

            {filteredItems.length > 1 && (
              <>
                <button
                  className={`${styles.navBtn} ${styles.prevBtn}`}
                  onClick={prevImage}
                  aria-label="Previous image"
                >
                  ‹
                </button>
                <button
                  className={`${styles.navBtn} ${styles.nextBtn}`}
                  onClick={nextImage}
                  aria-label="Next image"
                >
                  ›
                </button>
              </>
            )}

            <div className={styles.lightboxImageWrap}>
              <Image
                src={filteredItems[lightboxIndex].src}
                alt={filteredItems[lightboxIndex].alt}
                fill
                quality={92}
                style={{ objectFit: 'contain' }}
                priority
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

