import type { Metadata } from 'next'
import Link from 'next/link'
import styles from '../legal.module.css'

export const metadata: Metadata = {
  title: 'Terms & Conditions | 62 Patakha Shop Jaipur',
  description:
    'Terms and conditions of sale, store pickup policies, safety compliance, and guidelines for 62 Patakha Shop, Jaipur.',
}

export default function TermsPage() {
  return (
    <>
      <div className={styles.pageHeader}>
        <div className={styles.headerContent}>
          <span className="eyebrow-pill">Legal &amp; Policy</span>
          <h1 className={styles.pageTitle}>Terms &amp; Conditions</h1>
          <p className={styles.headerSubtitle}>
            Please read these terms carefully before exploring our catalog, reserving products, or visiting our Jaipur showroom.
          </p>
        </div>
      </div>

      <div className={styles.contentWrap}>
        <div className={styles.card}>
          <Link href="/" className={styles.backLink}>
            ← Back to Home
          </Link>

          <div className={styles.lastUpdated}>Last Updated: September 2026</div>

          <div className={styles.highlightBox}>
            <strong>Store Identification:</strong><br />
            <strong>62 Patakha Shop</strong> • Shop No. 62, Hawa Mahal Bazar, Jaipur, Rajasthan 302002<br />
            GSTIN: <strong>08AAYPA5582F1ZC</strong> • Phone / WhatsApp: <strong>+91 85610 05357</strong>
          </div>

          <p className={styles.intro}>
            Welcome to <strong>62 Patakha Shop</strong>. By browsing our website, selecting fireworks, requesting quotations, or purchasing from our showroom, you agree to comply with and be bound by the following Terms &amp; Conditions, together with our Privacy Policy and Government Safety Regulations.
          </p>

          <div className={styles.section}>
            <h2>1. Nature of Website &amp; Order Inquiry System</h2>
            <p>
              In strict accordance with government guidelines and Supreme Court directives concerning fireworks and explosives:
            </p>
            <ul className={styles.termsList}>
              <li>
                This website functions as an <strong>online showroom, catalog, and quotation booking portal</strong>. We do not collect online payments or ship fireworks via postal couriers.
              </li>
              <li>
                Items added to your <strong>Order List (Cart)</strong> generate a formal inquiry and price estimation. Your booking is finalized upon customer confirmation and completed via in-store showroom pickup at Hawa Mahal Bazar, Jaipur, or local arrangement under valid license.
              </li>
              <li>
                All transactions are confirmed in Indian Rupees (INR) including applicable GST.
              </li>
            </ul>
          </div>

          <div className={styles.section}>
            <h2>2. Age Requirement &amp; Eligibility</h2>
            <p>
              Fireworks and pyrotechnic products can only be purchased by individuals who are at least <strong>18 years of age</strong>.
            </p>
            <p>
              By submitting an order list or purchasing in our showroom, you warrant that you are 18 years or older and legally qualified to purchase fireworks under Indian law. Minors must always be supervised by an adult parent or guardian when viewing or handling fireworks.
            </p>
          </div>

          <div className={styles.section}>
            <h2>3. Product Authenticity &amp; Green Crackers Compliance</h2>
            <p>
              At 62 Patakha Shop, safety and legal compliance are our top priorities:
            </p>
            <ul className={styles.termsList}>
              <li>
                We exclusively stock <strong>100% genuine Sivakasi fireworks</strong> sourced directly from licensed, certified manufacturers including Cock Brand, Sony, Sunshine, Vinayaga, and Cornation.
              </li>
              <li>
                All products comply with <strong>PESO (Petroleum and Explosives Safety Organisation)</strong> and <strong>CSIR-NEERI Green Cracker specifications</strong> (SWAS, STAR, and SAFAL formulas), reducing particulate emissions and smoke by up to 30%.
              </li>
              <li>
                We do not sell any prohibited or banned chemicals, including barium nitrate, lead, mercury, or lithium compounds.
              </li>
            </ul>
          </div>

          <div className={styles.section}>
            <h2>4. Pricing, Stock &amp; Discounts</h2>
            <p>
              We strive to offer wholesale prices directly to retail customers in Jaipur:
            </p>
            <ul className={styles.termsList}>
              <li>
                Prices listed on the website are inclusive of seasonal festival discounts. Prices may vary based on market raw material costs and festive peak demand.
              </li>
              <li>
                While we maintain live stock synchronization, high festive demand during Diwali or wedding season may occasionally cause certain high-demand sky shot boxes or sparklers to sell out. In such cases, our team will promptly suggest equivalent or superior alternatives.
              </li>
            </ul>
          </div>

          <div className={styles.section}>
            <h2>5. Return, Exchange &amp; Cancellation Policy</h2>
            <p>
              Due to the sensitive nature of fireworks and explosive safety regulations under the Explosives Act:
            </p>
            <ul className={styles.termsList}>
              <li>
                <strong>No Returns Once Delivered:</strong> Once fireworks have been handed over to the customer, they cannot be returned or refunded due to chemical safety and storage regulations.
              </li>
              <li>
                <strong>Defective Product Verification:</strong> If any item is found to have a genuine manufacturing defect upon inspection at our counter, we will immediately provide a free replacement of equal value.
              </li>
              <li>
                <strong>Pre-Pickup Order Cancellation:</strong> You can cancel or amend your order list at any time before in-store collection by messaging us on WhatsApp or calling our customer support.
              </li>
            </ul>
          </div>

          <div className={styles.section}>
            <h2>6. Safe Handling &amp; Customer Responsibility</h2>
            <p>
              Fireworks must be handled with utmost care and in accordance with manufacturer instructions printed on each box:
            </p>
            <ul className={styles.termsList}>
              <li>
                Always ignite fireworks in open outdoor areas away from dry grass, vehicles, electric poles, and residential windows.
              </li>
              <li>
                Keep water buckets and sand buckets readily available at the launch area.
              </li>
              <li>
                62 Patakha Shop is not liable for any bodily injury, property damage, or legal penalty resulting from improper handling, failure to follow instructions, or unauthorized use in restricted silence zones (e.g., near hospitals, schools, or courts).
              </li>
            </ul>
          </div>

          <div className={styles.section}>
            <h2>7. WhatsApp &amp; SMS Communication Policy</h2>
            <p>
              By submitting an order list, quotation inquiry, or phone number on our website, you expressly agree that:
            </p>
            <ul className={styles.termsList}>
              <li>
                We may contact you via WhatsApp, SMS, or telephone to provide order confirmations, price lists, showroom directions, and delivery updates, regardless of your National DND status.
              </li>
              <li>
                You may easily opt out of promotional messages at any time by replying &ldquo;STOP&rdquo; or contacting our support team directly.
              </li>
            </ul>
          </div>

          <div className={styles.section}>
            <h2>8. Governing Law &amp; Jurisdiction</h2>
            <p>
              These Terms &amp; Conditions and any transactions between you and 62 Patakha Shop shall be governed by and construed in accordance with the <strong>laws of India</strong>. Any dispute, claim, or controversy arising out of or relating to your use of this website or purchases shall be subject to the exclusive jurisdiction of the competent courts in <strong>Jaipur, Rajasthan, India</strong>.
            </p>
          </div>

          <div className={styles.section}>
            <h2>9. Contact Us Regarding Terms</h2>
            <p>
              If you have any questions or require clarification regarding these terms, please feel free to contact us:
            </p>
            <p>
              <strong>62 Patakha Shop</strong><br />
              Shop No. 62, Hawa Mahal Bazar, Jaipur, Rajasthan 302002<br />
              Direct Phone: <a href="tel:+918561005357" className={styles.inlineLink}>+91 85610 05357</a><br />
              Email: <a href="mailto:vagarwal3005@gmail.com" className={styles.inlineLink}>vagarwal3005@gmail.com</a><br />
              Operating Hours: Monday – Sunday: 9:00 AM – 10:00 PM IST
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
