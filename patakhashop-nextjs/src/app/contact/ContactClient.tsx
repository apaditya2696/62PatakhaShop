'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import styles from './contact.module.css'

export default function ContactClient() {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [eventType, setEventType] = useState('Wedding / Sangeet')
  const [eventDate, setEventDate] = useState('')
  const [venue, setVenue] = useState('')
  const [message, setMessage] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const msg = `*62 PATAKHA SHOP — WEBSITE CONTACT INQUIRY*\n` +
      `*Name*: ${name}\n` +
      `*Phone*: ${phone}\n` +
      `*Email*: ${email || 'Not provided'}\n` +
      `*Celebration*: ${eventType}\n` +
      `*Date*: ${eventDate || 'Not specified'}\n` +
      `*Venue/City*: ${venue || 'Jaipur'}\n` +
      `*Message*: ${message || 'Inquiry regarding fireworks selection'}\n`

    // Save lead to local db
    fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, phone, email, eventType, eventDate, venue, message }),
    }).catch(() => {})

    setSubmitted(true)
    const encoded = encodeURIComponent(msg)
    window.open(`https://wa.me/918561005357?text=${encoded}`, '_blank')
  }

  return (
    <div className={styles.pageWrap}>
      <header className={styles.header}>
        <div className="editorial-container">
          <span className="eyebrow-pill">Contact Us</span>
          <h1 className={styles.title}>Get in Touch With Us</h1>
          <p className={styles.subtitle}>
            Call us, WhatsApp us, or fill the form below. We&apos;ll help you pick the right fireworks for your wedding, Diwali, birthday, or any celebration.
          </p>
        </div>
      </header>

      <div className="editorial-container">
        <div className={styles.grid}>
          {/* Form Column */}
          <div className={styles.formCol}>
            <div className={styles.card}>
              <span className="eyebrow-pill">Send Us a Message</span>
              <h2 className={styles.cardHeading}>Tell Us About Your Event</h2>
              <div className="gold-rule" />

              {submitted ? (
                <div className={styles.successState}>
                  <div className={styles.successIcon}>✦</div>
                  <h3>We&apos;ve Received Your Message!</h3>
                  <p>
                    Thank you, {name}. We&apos;ll get back to you shortly on WhatsApp.
                  </p>
                  <button onClick={() => setSubmitted(false)} className="btn-aurora-secondary">
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className={styles.form}>
                  <div className={styles.inputRow}>
                    <div className={styles.inputGroup}>
                      <label>Your Full Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Ravi Sharma"
                        value={name}
                        onChange={(e) => setName(e.target.value.replace(/[^a-zA-Z\s]/g, ''))}
                        className={styles.input}
                      />
                    </div>
                    <div className={styles.inputGroup}>
                      <label>Mobile Number (WhatsApp) *</label>
                      <input
                        type="tel"
                        required
                        maxLength={10}
                        placeholder="98765 43210"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                        className={styles.input}
                      />
                    </div>
                  </div>

                  <div className={styles.inputRow}>
                    <div className={styles.inputGroup}>
                      <label>Email Address (Optional)</label>
                      <input
                        type="email"
                        placeholder="e.g. name@gmail.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={styles.input}
                      />
                    </div>
                    <div className={styles.inputGroup}>
                      <label>Type of Celebration</label>
                      <select
                        value={eventType}
                        onChange={(e) => setEventType(e.target.value)}
                        className={styles.input}
                      >
                        <option>Wedding / Sangeet</option>
                        <option>Diwali</option>
                        <option>Birthday / Anniversary</option>
                        <option>Party / Farmhouse Gathering</option>
                        <option>Festival / Cultural Event</option>
                      </select>
                    </div>
                  </div>

                  <div className={styles.inputRow}>
                    <div className={styles.inputGroup}>
                      <label>Event Date (Optional)</label>
                      <input
                        type="text"
                        placeholder="e.g. 12 November"
                        value={eventDate}
                        onChange={(e) => setEventDate(e.target.value)}
                        className={styles.input}
                      />
                    </div>
                    <div className={styles.inputGroup}>
                      <label>Location / Area (Optional)</label>
                      <input
                        type="text"
                        placeholder="e.g. Mansarovar, Jaipur"
                        value={venue}
                        onChange={(e) => setVenue(e.target.value)}
                        className={styles.input}
                      />
                    </div>
                  </div>

                  <div className={styles.inputGroup}>
                    <label>Your Message / Requirements</label>
                    <textarea
                      rows={4}
                      placeholder="Tell us what you need — budget, type of crackers, event date, questions..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className={styles.input}
                    />
                  </div>

                  <button type="submit" className="btn-aurora-gold" style={{ width: '100%' }}>
                    Send Message on WhatsApp
                  </button>

                  <p className={styles.legalNotice}>
                    ✦ Quick response on WhatsApp. We are open all 7 days in Jaipur.
                  </p>
                </form>
              )}
            </div>
          </div>

          {/* Showroom & Directions Column */}
          <div className={styles.infoCol}>
            <div className={styles.infoCard}>
              <span className="eyebrow-pill">Our Jaipur Shop</span>
              <h2 className={styles.infoHeading}>62 Patakha Shop</h2>
              <p className={styles.infoSub}>Hawa Mahal Bazar, Jaipur</p>

              <div className={styles.contactList}>
                <div className={styles.contactItem}>
                  <div className={styles.itemHeader}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={styles.itemIcon}>
                      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    <strong>Showroom Address:</strong>
                  </div>
                  <span className={styles.addressText}>
                    62, Hawa Mahal Bazar, Near Old Vidhan Sabha, Kanwar Nagar, Jaipur, Rajasthan 302002
                  </span>
                </div>

                <div className={styles.contactItem}>
                  <div className={styles.itemHeader}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={styles.itemIcon}>
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                    <strong>Phone / WhatsApp:</strong>
                  </div>
                  <div className={styles.phoneList}>
                    <a href="tel:+918561005357" className={styles.phoneLink}>+91 85610 05357</a>
                    <a href="tel:+919414361426" className={styles.phoneLink}>+91 94143 61426</a>
                  </div>
                </div>

                <div className={styles.contactItem}>
                  <div className={styles.itemHeader}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={styles.itemIcon}>
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                    <strong>Showroom Hours:</strong>
                  </div>
                  <span className={styles.hoursText}>
                    Monday – Sunday | 9:00 AM – 10:00 PM IST
                  </span>
                </div>
              </div>

              {/* Map embed */}
              <div className={styles.mapBox}>
                <iframe
                  title="62 Patakha Shop Flagship Showroom Jaipur"
                  src="https://maps.google.com/maps?q=26.9250151,75.8272519&hl=en&z=17&output=embed"
                  width="100%"
                  height="260"
                  style={{ border: 0, borderRadius: 8, display: 'block' }}
                  allowFullScreen
                  loading="lazy"
                />
              </div>

              <a
                href="https://www.google.com/maps/dir//62+Patakha+Shop,+Shop+No,+Shop+No.62,+Near+Old+Vidhan+Sabha+Hawa+Mahal+Bazaar,+62,+Hawa+Mahal+Rd,+J.D.A.+Market,+Kanwar+Nagar,+Jaipur,+Rajasthan+302002/@26.9326448,75.8185309,15z/data=!4m8!4m7!1m0!1m5!1m1!1s0x396db139b7ab706d:0xf00cea1eab046d75!2m2!1d75.8272519!2d26.9250151"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.directionsBtn}
              >
                Get Google Maps Directions <span>→</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
