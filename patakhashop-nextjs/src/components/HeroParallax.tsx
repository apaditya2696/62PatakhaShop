'use client'

import React, { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import styles from './HeroParallax.module.css'

const SHOP_HERO_SLIDES = [
  {
    src: '/shop-front-1.jpg',
    alt: '62 Patakha Shop Hawa Mahal Bazar Flagship Entrance',
    caption: 'Flagship Storefront • Hawa Mahal Bazar, Jaipur'
  },
  {
    src: '/shop-interior-counter.jpg',
    alt: 'Inside 62 Patakha Shop Showroom Counter',
    caption: 'Authentic Showroom & Festive Hospitality Since 1964'
  },
  {
    src: '/shop-products-1.jpg',
    alt: 'Curated Fancy Sky Shots & Shells Display',
    caption: 'Certified Green Crackers & Fireworks'
  },
  {
    src: '/shop-customer-entrance.jpg',
    alt: 'Satisfied Customer at 62 Patakha Shop',
    caption: 'Trusted by Generations of Jaipur Celebrators'
  }
]

export default function HeroParallax() {
  const [offsetY, setOffsetY] = useState(0)
  const [activeSlide, setActiveSlide] = useState(0)

  // Gentle subtle parallax on scroll
  useEffect(() => {
    const handleScroll = () => {
      const scroll = window.scrollY
      const clampedOffset = Math.min(8, Math.max(0, scroll * 0.04))
      setOffsetY(clampedOffset)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Auto-rotating shop slideshow every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % SHOP_HERO_SLIDES.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const handleSelectSlide = useCallback((index: number) => {
    setActiveSlide(index)
  }, [])

  return (
    <section className={styles.heroSection}>
      {/* Background Slideshow Container with Parallax Movement */}
      <div
        className={styles.parallaxBg}
        style={{ transform: `translateY(${offsetY}px)` }}
      >
        {SHOP_HERO_SLIDES.map((slide, idx) => (
          <div
            key={slide.src}
            className={`${styles.slideLayer} ${idx === activeSlide ? styles.slideActive : ''}`}
            aria-hidden={idx !== activeSlide}
          >
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              priority={idx === 0}
              sizes="100vw"
              className={styles.heroImg}
            />
          </div>
        ))}

        {/* Ambient Dark Gradient for high text contrast */}
        <div className={styles.overlayDim} />
        <div className={styles.overlayTop} />
      </div>

      <div className={styles.heroContent}>
        <div className="editorial-container">
          <div className={styles.innerBox}>
            <span className={styles.heroEyebrow}>
              ✦ HAWA MAHAL BAZAR, JAIPUR • ESTD. 1964 ✦
            </span>

            <h1 className={styles.heroTitle}>
              <span className={styles.brandMain}>
                62 <span className={styles.heroTitleItalic}>Patakha Shop</span>
              </span>
              <span className={styles.heroTagline}>
                Light Up <span className={styles.heroTaglineGold}>Your Moments</span>
              </span>
            </h1>

            <p className={styles.heroSub}>
              Jaipur&apos;s trusted <strong>62 Patakha Shop</strong> — open since 1964. Shop 200+ genuine Sivakasi fireworks for Diwali, weddings, birthdays and more at great prices.
            </p>

            <div className={styles.ctaRow}>
              <Link href="/catalog" className="btn-aurora-gold">
                Explore Catalog
              </Link>
              <Link href="/contact" className={styles.heroContactBtn}>
                Contact Us
              </Link>
            </div>

            {/* Quick Value Pillars */}
            <div className={styles.heritageStrip}>
              <div className={styles.pillarItem}>
                <span className={styles.pillarDot}>✦</span>
                <span>Certified Green Crackers</span>
              </div>
              <div className={styles.pillarItem}>
                <span className={styles.pillarDot}>✦</span>
                <span>Direct from Sivakasi Factories</span>
              </div>
              <div className={styles.pillarItem}>
                <span className={styles.pillarDot}>✦</span>
                <span>Visit Our Store • Mon–Sun 9AM–10PM</span>
              </div>
            </div>

            
          </div>
        </div>
      </div>
    </section>
  )
}
