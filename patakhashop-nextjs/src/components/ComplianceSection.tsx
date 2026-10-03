'use client'

import React from 'react'
import Link from 'next/link'
import styles from './ComplianceSection.module.css'

export default function ComplianceSection() {
  return (
    <section className={styles.section}>
      <div className="editorial-container">
        <div className={styles.wrapper}>
          <div className={styles.leftCol}>
            <span className="eyebrow-pill">Safe &amp; Responsible</span>
            <h2 className={styles.heading}>
              Celebrate With Care. <br />
              <span className={styles.goldText}>Stay Safe &amp; Legal.</span>
            </h2>
            <div className="gold-rule" />
            <p className={styles.description}>
              At 62 Patakha Shop, we only sell fireworks that meet government safety standards. All our products are certified green crackers from trusted Sivakasi manufacturers — safer for you, your family, and the environment.
            </p>

            <div className={styles.btnRow}>
              <Link href="/safety" className="btn-aurora-primary">
                View Safety Guide
              </Link>
              <Link href="/about" className="btn-aurora-secondary">
                About Our Shop
              </Link>
            </div>
          </div>

          <div className={styles.pillarsGrid}>
            <div className={styles.pillar}>
              <div className={styles.pillarIcon}>01</div>
              <h3 className={styles.pillarTitle}>Certified Green Crackers</h3>
              <p className={styles.pillarText}>
                We only stock CSIR-NEERI certified green crackers that produce less smoke and are safer for health and air quality.
              </p>
            </div>

            <div className={styles.pillar}>
              <div className={styles.pillarIcon}>02</div>
              <h3 className={styles.pillarTitle}>Low-Sound Options Available</h3>
              <p className={styles.pillarText}>
                We carry a range of low-sound fireworks — great for areas with elderly people, children, or pets who are sensitive to loud noise.
              </p>
            </div>

            <div className={styles.pillar}>
              <div className={styles.pillarIcon}>03</div>
              <h3 className={styles.pillarTitle}>Safe Usage Tips</h3>
              <p className={styles.pillarText}>
                Every product comes with clear safety instructions including how far to stand and how to light fireworks properly.
              </p>
            </div>

            <div className={styles.pillar}>
              <div className={styles.pillarIcon}>04</div>
              <h3 className={styles.pillarTitle}>Legal &amp; Government Approved</h3>
              <p className={styles.pillarText}>
                All fireworks we sell follow Supreme Court guidelines and local rules. We are a licensed store operating within all legal limits.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
