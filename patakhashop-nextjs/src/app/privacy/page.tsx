import type { Metadata } from 'next'
import Link from 'next/link'
import styles from '../legal.module.css'

export const metadata: Metadata = {
  title: 'Privacy Policy | 62 Patakha Shop Jaipur',
  description:
    'Learn how 62 Patakha Shop collects, uses, and safeguards your personal data, order details, and WhatsApp communication preferences.',
  alternates: {
    canonical: '/privacy',
  },
}

export default function PrivacyPage() {
  return (
    <>
      <div className={styles.pageHeader}>
        <div className={styles.headerContent}>
          <span className="eyebrow-pill">Your Privacy</span>
          <h1 className={styles.pageTitle}>Privacy Policy</h1>
          <p className={styles.headerSubtitle}>
            At 62 Patakha Shop, we take your trust seriously. Here is exactly how we handle and protect your personal information.
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
            <strong>Our Privacy Commitment:</strong><br />
            We collect only the essential details needed to process your fireworks inquiries, quotes, and store pickups. We <strong>never sell, rent, or trade your personal data</strong> with any third-party marketing companies.
          </div>

          <p className={styles.intro}>
            This Privacy Policy explains how <strong>62 Patakha Shop</strong> (&ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;) collects, uses, and safeguards information when you visit our website, submit an order inquiry, or communicate with our store via phone or WhatsApp.
          </p>

          <div className={styles.section}>
            <h2>1. Information We Collect</h2>
            <p>
              When you use our website or order system, we may collect the following information:
            </p>
            <ul className={styles.termsList}>
              <li>
                <strong>Contact Details:</strong> Your full name, mobile phone number, WhatsApp number, and email address provided during checkout inquiry or contact forms.
              </li>
              <li>
                <strong>Order Details:</strong> The list of fireworks, quantities, estimated budget, occasion (e.g. Diwali, Wedding, Birthday), and event date.
              </li>
              <li>
                <strong>Store Pickup &amp; Location Details:</strong> Delivery address or preferred showroom pickup schedule in Jaipur.
              </li>
              <li>
                <strong>Technical Information:</strong> Standard, non-identifying browser data such as device type, IP address, and pages viewed, used solely to ensure fast loading and responsive website performance.
              </li>
            </ul>
          </div>

          <div className={styles.section}>
            <h2>2. How We Use Your Information</h2>
            <p>
              We use your information strictly for legitimate retail and customer service purposes:
            </p>
            <ul className={styles.termsList}>
              <li>To prepare your personalized fireworks estimate, price list, and festival discounts.</li>
              <li>To coordinate showroom order pickups, packing, and counter reservations at 62 Hawa Mahal Bazar, Jaipur.</li>
              <li>To answer product questions, provide safety advice, and recommend suitable fireworks for your venue or family.</li>
              <li>To send order confirmation slips and invoices via WhatsApp or SMS.</li>
              <li>To fulfill tax and accounting compliance under GST and legal statutory requirements.</li>
            </ul>
          </div>

          <div className={styles.section}>
            <h2>3. No Online Payment Data Stored</h2>
            <p>
              In accordance with safety and legal guidelines for fireworks retail:
            </p>
            <p>
              Our website does not collect or store credit card numbers, debit card PINs, CVV codes, or net-banking passwords. Payments are processed in-person at our showroom counter via UPI, Card, or Cash, or via direct merchant UPI verified by our authorized representative.
            </p>
          </div>

          <div className={styles.section}>
            <h2>4. WhatsApp &amp; SMS Communication Policy</h2>
            <p>
              We prioritize direct, transparent communication with our customers:
            </p>
            <ul className={styles.termsList}>
              <li>
                <strong>Transactional Updates:</strong> When you submit an order list, you consent to receive direct transactional messages on WhatsApp and SMS regarding your quote status, order readiness, and pickup timing, regardless of your National DND status.
              </li>
              <li>
                <strong>Promotional Updates:</strong> Before major festivals like Diwali, we may occasionally share new catalogue releases, wholesale price lists, or early bird discounts.
              </li>
              <li>
                <strong>Easy Opt-Out:</strong> You can stop receiving promotional messages at any time. Simply reply with &ldquo;STOP&rdquo; on WhatsApp or call our support line at <a href="tel:+918561005357" className={styles.inlineLink}>+91 85610 05357</a>, and you will be immediately removed from our promotional list.
              </li>
            </ul>
          </div>

          <div className={styles.section}>
            <h2>5. Data Security &amp; Confidentiality</h2>
            <p>
              We implement industry-standard technical and operational safeguards:
            </p>
            <ul className={styles.termsList}>
              <li>All web traffic between your device and our website is encrypted using 256-bit SSL (HTTPS) encryption.</li>
              <li>Access to customer order data is strictly restricted to authorized staff members involved in order fulfillment.</li>
              <li>We will never sell, lease, or distribute your personal contact information to third-party telemarketers or advertisers.</li>
            </ul>
          </div>

          <div className={styles.section}>
            <h2>6. Cookies &amp; Local Storage</h2>
            <p>
              Our website uses basic functional cookies and browser local storage solely to remember the items in your cart (Order List) and your active category filters. We do not use intrusive tracking cookies or cross-site tracking pixels.
            </p>
          </div>

          <div className={styles.section}>
            <h2>7. Your Privacy Rights</h2>
            <p>
              You have the right to request access to the personal data we hold about you, request corrections to your contact details, or ask us to permanently delete your inquiry history from our records. To make such a request, simply email us or contact us via WhatsApp.
            </p>
          </div>

          <div className={styles.section}>
            <h2>8. Contact Our Privacy Representative</h2>
            <p>
              If you have any questions, concerns, or requests regarding this Privacy Policy, please reach out to us directly:
            </p>
            <p>
              <strong>62 Patakha Shop</strong><br />
              Shop No. 62, Hawa Mahal Bazar, Jaipur, Rajasthan 302002<br />
              Call / WhatsApp: <a href="tel:+918561005357" className={styles.inlineLink}>+91 85610 05357</a><br />
              Email: <a href="mailto:vagarwal3005@gmail.com" className={styles.inlineLink}>vagarwal3005@gmail.com</a><br />
              Store Timings: Monday – Sunday: 9:00 AM – 10:00 PM IST
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
