import React from 'react'
import styles from './ArchitectureShowcase.module.css'

export default function ArchitectureShowcase() {
  return (
    <section className={styles.techSection}>
      <p className={styles.techMetaDesc}>
        A production e-commerce store and admin management portal built for a premier crackers shop featuring live product catalog, cart management, dynamic pricing, and WhatsApp orders.
      </p>

      <div className={styles.techPairGrid}>
        <div className={styles.techBox}>
          <div className={styles.techBoxTag}>01. Business Problem</div>
          <div className={styles.techBoxText}>
            High festive season demand caused inventory overselling, phone line bottlenecks, and manual receipt calculation delays.
          </div>
        </div>
        <div className={styles.techBox}>
          <div className={styles.techBoxTag}>02. End-To-End System</div>
          <div className={styles.techBoxText}>
            Next.js App Router Storefront + Persistent Shopping Cart + Admin Inventory Dashboard + WhatsApp Order Webhook.
          </div>
        </div>
      </div>

      <div className={styles.archHeader}>
        <span style={{ color: '#818cf8', fontSize: '18px' }}>☲</span> Frontend Engineering Architecture
      </div>

      <div className={styles.archGrid}>
        <div className={styles.archCard}>
          <span className={styles.archCheckIcon}>✓</span>
          <span className={styles.archCardText}>
            Server-Side Rendered (SSR) product catalog for fast LCP &amp; SEO performance
          </span>
        </div>
        <div className={styles.archCard}>
          <span className={styles.archCheckIcon}>✓</span>
          <span className={styles.archCardText}>
            Lightweight state store for persistent local shopping cart
          </span>
        </div>
        <div className={styles.archCard}>
          <span className={styles.archCheckIcon}>✓</span>
          <span className={styles.archCardText}>
            Role-protected Admin Dashboard for real-time SKU stock updates and pricing
          </span>
        </div>
        <div className={styles.archCard}>
          <span className={styles.archCheckIcon}>✓</span>
          <span className={styles.archCardText}>
            Mobile-optimized responsive layouts tailored for festive mobile shoppers
          </span>
        </div>
      </div>

      <div className={styles.impactBox}>
        <div className={styles.impactHeader}>
          <span style={{ color: '#34d399', fontSize: '14px' }}>🛡</span> Verified Measured Impact
        </div>
        <ul className={styles.impactList}>
          <li className={styles.impactItem}>
            <span className={styles.impactDot} />
            Live production app deployed &amp; operational for peak festive demand
          </li>
          <li className={styles.impactItem}>
            <span className={styles.impactDot} />
            Streamlined order processing time by 60% through automated WhatsApp dispatch
          </li>
          <li className={styles.impactItem}>
            <span className={styles.impactDot} />
            100% stock accuracy managed via real-time admin inventory controls
          </li>
        </ul>
      </div>
    </section>
  )
}
