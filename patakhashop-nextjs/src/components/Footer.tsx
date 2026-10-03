'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import styles from './Footer.module.css'

export default function Footer() {
  const pathname = usePathname()

  if (pathname?.startsWith('/admin')) {
    return null
  }
  return (
    <footer className={styles.footer}>
      {/* Editorial Newsletter / Consultation Banner */}
      <div className={styles.consultBanner}>
        <div className="editorial-container">
          <div className={styles.consultInner}>
            <div className={styles.consultText}>
              <span className="eyebrow-pill">Talk to Us</span>
              <h3 className={styles.consultHeading}>Planning a Big Celebration?</h3>
              <p className={styles.consultSub}>
                Call or WhatsApp us directly to get help choosing the right fireworks for your wedding, Diwali, or any special event.
              </p>
            </div>
            <div className={styles.consultAction}>
              <Link href="/contact" className="btn-aurora-gold">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Navigation & Heritage */}
      <div className="editorial-container">
        <div className={styles.mainGrid}>
          {/* Brand Column */}
          <div className={styles.brandCol}>
            <div className={styles.brandHeader}>
              <Image
                src="/logo-62.png"
                alt="62 Patakha Shop Emblem"
                width={42}
                height={42}
                className={styles.brandLogo}
              />
              <div>
                <span className={styles.brandTitle}>62 PATAKHA SHOP</span>
                <span className={styles.brandSubtitle}>Jaipur&apos;s Trusted Fireworks Store</span>
              </div>
            </div>
            <p className={styles.brandDesc}>
              62 Patakha Shop has been bringing joy to Jaipur families and celebrations for over 60 years. We stock genuine Sivakasi fireworks for every occasion.
            </p>
            <div className={styles.heritageBadge}>
              <span>✦ Since 1964 • Hawa Mahal Bazar, Jaipur</span>
            </div>
          </div>

          {/* Collections Column */}
          <div className={styles.col}>
            <h4 className={styles.colTitle}>Shop By Category</h4>
            <ul className={styles.linkList}>
              <li><Link href="/catalog/diwali">Diwali Collection</Link></li>
              <li><Link href="/catalog/wedding">Wedding &amp; Sangeet</Link></li>
              <li><Link href="/catalog/celebration">Birthday &amp; Milestones</Link></li>
              <li><Link href="/catalog/family-friendly">Family &amp; Low-Sound</Link></li>
              <li><Link href="/catalog">Full Catalog (200+ Items)</Link></li>
            </ul>
          </div>

          {/* Discovery & Journal */}
          <div className={styles.col}>
            <h4 className={styles.colTitle}>Info &amp; Help</h4>
            <ul className={styles.linkList}>
              <li><Link href="/safety">Fireworks Safety Guide</Link></li>
              <li><Link href="/about">About Our Shop</Link></li>
              <li><Link href="/contact">Contact Us</Link></li>
              <li><Link href="/terms">Terms &amp; Conditions</Link></li>
              <li><Link href="/privacy">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Flagship Showroom */}
          <div className={styles.col}>
            <h4 className={styles.colTitle}>Visit Our Store</h4>
            <address className={styles.address}>
              <p>62, Hawa Mahal Bazar</p>
              <p>Near Old Vidhan Sabha</p>
              <p>Jaipur, Rajasthan 302002</p>
              <p className={styles.phone}>Call / WhatsApp: +91 85610 05357</p>
              <p className={styles.email}>contact@62patakhashop.com</p>
            </address>
          </div>
        </div>

        {/* Legal Disclaimer & Compliance */}
        <div className={styles.complianceNotice}>
          <p>
            <strong>Important Notice:</strong> All fireworks shown on this website are for showroom reference only. Fireworks are available for purchase in-store at 62, Hawa Mahal Bazar, Jaipur. We follow all government rules, Supreme Court guidelines, and use only CSIR-NEERI certified green crackers.
          </p>
        </div>

        {/* Bottom Bar */}
        <div className={styles.bottomBar}>
          <span>© {new Date().getFullYear()} 62 Patakha Shop. All rights reserved.</span>
          <div className={styles.bottomLinks}>
            <span>Made with ❤️ in Jaipur</span>
            <span>•</span>
            <Link href="/admin">Admin Access</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
