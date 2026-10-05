import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import ArchitectureShowcase from '@/components/ArchitectureShowcase'
import JsonLd, { shopLocalBusinessSchema } from '@/components/JsonLd'
import styles from './about.module.css'

export const metadata: Metadata = {
  title: 'About Us | 62 Patakha Shop Jaipur',
  description:
    'Since 1964, providing genuine Sivakasi fireworks at Hawa Mahal Bazar, Jaipur. Over 60 years of trust, quality, and celebrations.',
  alternates: {
    canonical: '/about',
  },
}

export default function AboutPage() {
  return (
    <div className={styles.pageWrap}>
      <JsonLd data={shopLocalBusinessSchema} />
      <header className={styles.header}>
        <div className="editorial-container">
          <span className="eyebrow-pill">Our Story</span>
          <h1 className={styles.title}>Over 60 Years of Lighting Celebrations</h1>
          <p className={styles.subtitle}>
            From the bustling lanes of Hawa Mahal Bazar in 1964 to homes and weddings across Rajasthan, 62 Patakha Shop has been bringing families together for every joyful moment.
          </p>
        </div>
      </header>


      <div className="editorial-container">
        {/* Heritage Story Section */}
        <section className={styles.storySection}>
          <div className={styles.grid}>
            <div className={styles.textContent}>
              <span className="eyebrow-pill">Our Jaipur Roots</span>
              <h2>Born in the Heart of Jaipur</h2>
              <div className="gold-rule" />
              <p>
                Located right near the iconic Hawa Mahal in Jaipur, 62 Patakha Shop began as a humble store bringing genuine Sivakasi fireworks to local families. For three generations, customers have trusted our quality, honest pricing, and friendly service.
              </p>
              <p>
                Today, we continue that tradition with the same dedication: offering 100% certified green crackers, safe handling guidelines, and honest recommendations for every festival, wedding, and celebration.
              </p>
            </div>

            <div className={styles.imageWrap}>
              <Image
                src="/shop-customer-entrance.jpg"
                alt="62 Patakha Shop Customer Entrance at Hawa Mahal Bazar, Jaipur"
                width={600}
                height={500}
                className={styles.heritageImg}
              />
            </div>
          </div>
        </section>

        {/* Pillars of Excellence */}
        <section className={styles.pillarsSection}>
          <div className={styles.pillarsHeader}>
            <span className="eyebrow-pill">Why Choose Us</span>
            <h2>What We Stand For</h2>
          </div>

          <div className={styles.pillarsGrid}>
            <div className={styles.pillarCard}>
              <span className={styles.pillarNum}>I</span>
              <h3>Direct from Sivakasi</h3>
              <p>
                We source directly from licensed, top-tier Sivakasi manufacturers. Every box is fresh stock with tested quality, vibrant colors, and consistent performance.
              </p>
            </div>

            <div className={styles.pillarCard}>
              <span className={styles.pillarNum}>II</span>
              <h3>Certified Green Fireworks</h3>
              <p>
                Celebrate with peace of mind. We stock approved green crackers with reduced smoke, safe sound levels, and zero harmful chemicals like barium or lead.
              </p>
            </div>

            <div className={styles.pillarCard}>
              <span className={styles.pillarNum}>III</span>
              <h3>Help for Every Event</h3>
              <p>
                Whether it is a family Diwali at home, a wedding celebration, or a big party, we help you choose the right fireworks for your space, safety, and budget.
              </p>
            </div>
          </div>
        </section>

        {/* ── Engineering & System Architecture Showcase ── */}
        <ArchitectureShowcase />

        {/* CTA Banner */}
        <div className={styles.ctaBox}>
          <h3>Visit 62 Patakha Shop in Person</h3>
          <p>
            Visit our shop at 62 Hawa Mahal Bazar, Jaipur, or message us on WhatsApp for fast help with your order.
          </p>
          <div className={styles.ctaBtns}>
            <Link href="/catalog" className="btn-aurora-gold">
              View Fireworks Catalog
            </Link>
            <Link href="/contact" className="btn-aurora-secondary">
              Contact Our Shop
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
