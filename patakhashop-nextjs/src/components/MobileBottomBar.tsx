'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import styles from './MobileBottomBar.module.css'

export default function MobileBottomBar() {
  const pathname = usePathname()

  // Do not show on admin page
  if (pathname.startsWith('/admin')) {
    return null
  }

  const isHome = pathname === '/'
  const isCatalog = pathname.startsWith('/catalog') || pathname.startsWith('/category')

  const phoneNumber = '+918561005357'
  const mapsUrl = 'https://www.google.com/maps/dir//62+Patakha+Shop,+Shop+No,+Shop+No.62,+Near+Old+Vidhan+Sabha+Hawa+Mahal+Bazaar,+62,+Hawa+Mahal+Rd,+J.D.A.+Market,+Kanwar+Nagar,+Jaipur,+Rajasthan+302002/@26.9326448,75.8185309,15z/data=!4m8!4m7!1m0!1m5!1m1!1s0x396db139b7ab706d:0xf00cea1eab046d75!2m2!1d75.8272519!2d26.9250151'
  const whatsappUrl = 'https://wa.me/918561005357?text=Hello%2062%20Patakha%20Shop%2C%20I%20want%20to%20inquire%20about%20crackers'

  return (
    <nav className={styles.bottomBar} aria-label="Mobile Navigation Bar">
      {/* 1. Home */}
      <Link
        href="/"
        className={`${styles.tabBtn} ${isHome ? styles.tabActive : ''}`}
        aria-label="Home"
      >
        <span className={styles.iconWrap}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
        </span>
        <span className={styles.tabLabel}>Home</span>
      </Link>

      {/* 2. Catalog */}
      <Link
        href="/catalog"
        className={`${styles.tabBtn} ${isCatalog ? styles.tabActive : ''}`}
        aria-label="Catalog"
      >
        <span className={styles.iconWrap}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="14" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" />
          </svg>
        </span>
        <span className={styles.tabLabel}>Catalog</span>
      </Link>

      {/* 3. Call */}
      <a
        href={`tel:${phoneNumber}`}
        className={styles.tabBtn}
        aria-label="Call Shop"
      >
        <span className={styles.iconWrap}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
        </span>
        <span className={styles.tabLabel}>Call</span>
      </a>

      {/* 4. Direction (Direct to shop Google Maps location) */}
      <a
        href={mapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.tabBtn}
        aria-label="Get Directions to 62 Patakha Shop Hawa Mahal Bazar"
      >
        <span className={styles.iconWrap}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="3 11 22 2 13 21 11 13 3 11" />
          </svg>
        </span>
        <span className={styles.tabLabel}>Direction</span>
      </a>

      {/* 5. WhatsApp (with WhatsApp icon) */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`${styles.tabBtn} ${styles.tabWhatsApp}`}
        aria-label="Chat on WhatsApp"
      >
        <span className={styles.iconWrap}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.456 5.711 1.457h.004c6.554 0 11.89-5.335 11.893-11.893a11.82 11.82 0 00-3.48-8.413z" />
          </svg>
        </span>
        <span className={styles.tabLabel}>WhatsApp</span>
      </a>
    </nav>
  )
}
