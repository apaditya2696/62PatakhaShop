'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useCart } from '@/context/CartContext'
import { useWishlist } from '@/context/WishlistContext'
import styles from './Navbar.module.css'

const NAV_ITEMS = [
  { href: '/', label: 'Home' },
  { href: '/catalog', label: 'Catalog' },
  { href: '/catalog/diwali', label: 'Diwali' },
  { href: '/catalog/wedding', label: 'Weddings' },
  { href: '/track-order', label: 'Track Order' },
  { href: '/safety', label: 'Safety' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const { totalCount, openDrawer } = useCart()
  const { wishlistCount } = useWishlist()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  // Hide customer navbar on admin portal page
  if (pathname?.startsWith('/admin')) {
    return null
  }

  return (
    <>
      <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
        <div className={styles.inner}>
          {/* Brand Identity */}
          <Link href="/" className={styles.brand} aria-label="62 Patakha Shop Homepage">
            <div className={styles.brandLogoWrap}>
              <Image
                src="/logo-62.png"
                alt="62 Patakha Shop Logo"
                width={36}
                height={36}
                className={styles.brandLogo} style={{ width: 'auto', height: 'auto' }}
                priority
              />
            </div>
            <div className={styles.brandText}>
              <span className={styles.brandTitle}>PATAKHA SHOP</span>
              <span className={styles.brandSubtitle}>Hawa Mahal Bazar • Jaipur</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className={styles.desktopNav} aria-label="Main Navigation">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}
                >
                  {item.label}
                </Link>
              )
            })}
          </nav>

          {/* Actions: Catalog Search / Wishlist / Inquiry Basket */}
          <div className={styles.actions}>
            <Link href="/catalog" className={styles.iconBtn} aria-label="Search Catalog" title="Search Fireworks">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </Link>

            <Link href="/wishlist" className={styles.iconBtn} aria-label={`Wishlist with ${wishlistCount} items`} title="My Wishlist">
              <svg width="18" height="18" viewBox="0 0 24 24" fill={wishlistCount > 0 ? '#e53e3e' : 'none'} stroke={wishlistCount > 0 ? '#e53e3e' : 'currentColor'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
              </svg>
              {wishlistCount > 0 && (
                <span className={styles.wishlistBadge}>{wishlistCount}</span>
              )}
            </Link>

            <button
              onClick={openDrawer}
              className={styles.basketBtn}
              aria-label={`Open Cart with ${totalCount} items`}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                <path d="M3 6h18" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              <span className={styles.basketText}>Cart</span>
              {totalCount > 0 && (
                <span className={styles.basketBadge}>{totalCount}</span>
              )}
            </button>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`${styles.hamburger} ${mobileMenuOpen ? styles.hamburgerActive : ''}`}
              aria-label="Toggle mobile navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className={styles.mobileBackdrop} onClick={() => setMobileMenuOpen(false)}>
          <aside className={styles.mobileDrawer} onClick={(e) => e.stopPropagation()}>
            <div className={styles.drawerHead}>
              <div className={styles.brandText}>
                <span className={styles.brandTitle}>62 PATAKHA SHOP</span>
                <span className={styles.brandSubtitle}>Hawa Mahal Bazar • Jaipur</span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className={styles.closeBtn}
                aria-label="Close menu"
              >
                ✕
              </button>
            </div>

            <nav className={styles.drawerNav}>
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`${styles.drawerLink} ${pathname === item.href ? styles.drawerLinkActive : ''}`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className={styles.drawerFooter}>
              <p className={styles.drawerFootnote}>
                Hawa Mahal Bazar, Jaipur • 100% Genuine Sivakasi Fireworks
              </p>
            </div>
          </aside>
        </div>
      )}
    </>
  )
}
