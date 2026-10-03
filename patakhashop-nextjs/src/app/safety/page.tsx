import { Metadata } from 'next'
import Link from 'next/link'
import styles from './safety.module.css'

export const metadata: Metadata = {
  title: 'Safety Guidelines & Rules | 62 Patakha Shop',
  description:
    'Simple fireworks safety tips, green cracker guidelines, safe distances, and responsible celebration advice from 62 Patakha Shop Jaipur.',
}

export default function SafetyPage() {
  return (
    <div className={styles.pageWrap}>
      <header className={styles.header}>
        <div className="editorial-container">
          <span className="eyebrow-pill">Safety Guide</span>
          <h1 className={styles.title}>Celebrate Safely &amp; Responsibly</h1>
          <p className={styles.subtitle}>
            Simple, practical safety tips to keep your family, friends, and neighbors safe while enjoying fireworks.
          </p>
        </div>
      </header>

      <div className="editorial-container">
        <div className={styles.contentLayout}>
          {/* Main Pillars */}
          <div className={styles.mainContent}>
            <section className={styles.sectionBlock}>
              <h2 className={styles.sectionTitle}>01. Certified Green Crackers Only</h2>
              <div className="gold-rule" />
              <p>
                Every firework in our store is a certified green cracker tested according to government and CSIR-NEERI standards.
              </p>
              <ul className={styles.bulletList}>
                <li>
                  <strong>No Harmful Chemicals:</strong> Made without dangerous chemicals like barium, arsenic, or lead for cleaner air.
                </li>
                <li>
                  <strong>30-35% Less Smoke:</strong> Formulated to reduce smoke and dust significantly, making celebrations easier on kids and elders.
                </li>
                <li>
                  <strong>Safer Sound Levels:</strong> Designed for vibrant colors and joyful effects while keeping sound within safe, legal decibel limits.
                </li>
              </ul>
            </section>

            <section className={styles.sectionBlock}>
              <h2 className={styles.sectionTitle}>02. Recommended Safe Distances</h2>
              <div className="gold-rule" />
              <p>
                Always burst fireworks in wide, open outdoor spaces away from dry grass, parked vehicles, and overhead wires.
              </p>
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Type of Firework</th>
                      <th>Safe Distance to Keep</th>
                      <th>Best Ground Surface</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Sparklers (Phuljhari) &amp; Pencils</td>
                      <td>3 – 5 Meters (10 – 15 ft)</td>
                      <td>Paved courtyard, open ground</td>
                    </tr>
                    <tr>
                      <td>Ground Pots (Anar) &amp; Wheels (Chakkar)</td>
                      <td>8 – 10 Meters (25 – 30 ft)</td>
                      <td>Flat, smooth floor or masonry</td>
                    </tr>
                    <tr>
                      <td>Rockets &amp; Sky Shots</td>
                      <td>20 – 30 Meters (65 – 100 ft)</td>
                      <td>Open outdoor ground with stable support</td>
                    </tr>
                    <tr>
                      <td>Multi-Shot Sky Cakes (12 to 240 Shots)</td>
                      <td>35 – 50 Meters (100 – 150 ft)</td>
                      <td>Firm, level ground away from trees/wires</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section className={styles.sectionBlock}>
              <h2 className={styles.sectionTitle}>03. Respecting Neighbors &amp; Timing</h2>
              <div className="gold-rule" />
              <p>
                Keep celebrations enjoyable for everyone. Please finish bursting fireworks before 10:00 PM in residential neighborhoods. Be especially considerate of infants, hospital areas, elderly neighbors, and family pets who get startled by loud sounds.
              </p>
            </section>

            <section className={styles.sectionBlock}>
              <h2 className={styles.sectionTitle}>04. Safe Lighting &amp; Disposal</h2>
              <div className="gold-rule" />
              <p>
                Always keep a bucket of water and a bucket of sand nearby before lighting fireworks.
              </p>
              <ul className={styles.bulletList}>
                <li>
                  <strong>Never relight a dud:</strong> If a firework does not go off, wait at least 15 minutes. Never lean over it. Submerge it into a bucket of water.
                </li>
                <li>
                  <strong>Supervise children:</strong> An adult should always be present. Children should only handle mild sparklers under direct guidance.
                </li>
                <li>
                  <strong>Cool down sparkler wires:</strong> Drop used hot sparkler wires directly into a bucket of water to avoid accidental burns or foot injuries.
                </li>
              </ul>
            </section>
          </div>

          {/* Sticky Side Card */}
          <aside className={styles.sideCard}>
            <span className="eyebrow-pill">Need Assistance?</span>
            <h3>Have Questions About Safety?</h3>
            <p>
              Our experienced team in Jaipur is happy to advise you on the right fireworks for your home terrace, garden, or wedding venue.
            </p>
            <div className={styles.sideCta}>
              <Link href="/contact" className="btn-aurora-gold" style={{ width: '100%' }}>
                Contact Our Shop
              </Link>
            </div>
            <div className={styles.complianceNote}>
              <span>✦ All products compliant with Indian safety laws &amp; guidelines</span>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
