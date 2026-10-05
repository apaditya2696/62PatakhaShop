'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '@/context/CartContext'
import styles from './CartDrawer.module.css'

export default function CartDrawer() {
  const {
    cart,
    isDrawerOpen,
    closeDrawer,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    totalSavings,
    totalCount,
  } = useCart()

  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [celebrationDate, setCelebrationDate] = useState('')
  const [celebrationVenue, setCelebrationVenue] = useState('')
  const [inquiryNotes, setInquiryNotes] = useState('')
  const [showDetails, setShowDetails] = useState(false)
  const [showContactPromptModal, setShowContactPromptModal] = useState(false)
  const [phoneError, setPhoneError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Try to pre-fill from previously entered checkout / customer info
  useEffect(() => {
    try {
      const savedName = localStorage.getItem('62_customer_name')
      const savedPhone = localStorage.getItem('62_customer_phone')
      if (savedName && !customerName) setCustomerName(savedName)
      if (savedPhone && !customerPhone) setCustomerPhone(savedPhone)
    } catch { }
  }, [customerName, customerPhone])

  useEffect(() => {
    if (isDrawerOpen) {
      const originalOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = originalOverflow
      }
    }
  }, [isDrawerOpen])

  if (!isDrawerOpen) return null

  // Initiate WhatsApp Order: check if customer details exist first
  const handleWhatsAppClick = () => {
    if (cart.length === 0) return
    const cleanPhone = customerPhone.replace(/\D/g, '')
    if (!customerName.trim() || cleanPhone.length < 10) {
      setShowContactPromptModal(true)
      return
    }
    executeOrderSubmission(customerName.trim(), cleanPhone)
  }

  const handleModalSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const cleanPhone = customerPhone.replace(/\D/g, '')
    if (!customerName.trim()) {
      setPhoneError('Please enter your name')
      return
    }
    if (cleanPhone.length < 10) {
      setPhoneError('Please enter a valid 10-digit mobile number')
      return
    }
    setPhoneError('')
    setShowContactPromptModal(false)
    executeOrderSubmission(customerName.trim(), cleanPhone)
  }

  const executeOrderSubmission = async (name: string, phone: string) => {
    setIsSubmitting(true)
    try {
      localStorage.setItem('62_customer_name', name)
      localStorage.setItem('62_customer_phone', phone)
    } catch { }

    const orderPayload = {
      customerName: name,
      customerPhone: phone,
      orderNote: `${celebrationDate ? 'Date: ' + celebrationDate + ' | ' : ''}${celebrationVenue ? 'Venue: ' + celebrationVenue + ' | ' : ''}${inquiryNotes.trim()}`,
      items: cart,
      subtotal,
      totalSavings,
      totalCount,
    }

    const now = new Date()
    const dateCode = `${String(now.getFullYear()).slice(-2)}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`
    let assignedOrderId = `ORD-${dateCode}-${Math.floor(1000 + Math.random() * 9000)}`

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      })
      const json = await res.json()
      if (json.success && json.order?.orderId) {
        assignedOrderId = json.order.orderId
      }
    } catch {
      // Fallback order ID
    }

    // Generate local PDF invoice receipt with customer's name & phone
    try {
      const { generateOrderPDF } = await import('@/lib/pdfGenerator')
      const doc = generateOrderPDF({
        orderId: assignedOrderId,
        customerName: name,
        customerPhone: phone,
        items: cart,
        subtotal,
        totalSavings,
        totalCount,
        orderNote: orderPayload.orderNote,
      })
      doc.save(`Invoice-${assignedOrderId}.pdf`)
    } catch {
      // Ignore PDF save error
    } finally {
      setIsSubmitting(false)
    }

    const host = window.location.origin
    const pdfUrl = `${host}/api/orders/${assignedOrderId}/pdf`

    const lines: string[] = []
    lines.push(`*62 PATAKHA SHOP — FIREWORKS ORDER INVOICE*`)
    lines.push(`===================================`)
    lines.push(`🧾 *Order ID*: #${assignedOrderId}`)
    lines.push(`👤 *Customer*: ${name}`)
    lines.push(`📞 *Phone*: ${phone}`)
    if (celebrationDate.trim()) lines.push(`📅 *Event Date*: ${celebrationDate.trim()}`)
    if (celebrationVenue.trim()) lines.push(`📍 *Location*: ${celebrationVenue.trim()}`)
    lines.push(`💰 *Total Amount*: ₹${subtotal.toLocaleString('en-IN')} (${totalCount} Items)`)
    if (totalSavings > 0) lines.push(`🎉 *Discount Savings*: ₹${totalSavings.toLocaleString('en-IN')}`)
    lines.push(`===================================`)
    lines.push(`📄 *Official Order PDF Invoice*:`)
    lines.push(pdfUrl)
    lines.push(`===================================`)
    lines.push(`📞 *Helpline*: +91 85610 05357`)
    lines.push(`_Direct Pickup / Delivery at 62, Hawa Mahal Bazar, Jaipur._`)

    const fullMsg = lines.join('\n')
    const msgText = encodeURIComponent(fullMsg)
    window.open(`https://api.whatsapp.com/send?phone=918561005357&text=${msgText}`, '_blank')
  }

  return (
    <>
      <div className={styles.backdrop} onClick={closeDrawer} />

      <aside className={styles.drawer} role="dialog" aria-label="Fireworks Order List">
        {/* Header */}
        <div className={styles.header}>
          <div>
            <span className={styles.eyebrow}>Your Selection</span>
            <h3 className={styles.title}>Your Fireworks List</h3>
            <p className={styles.countText}>{totalCount} {totalCount === 1 ? 'item' : 'items'} selected</p>
          </div>
          <button className={styles.closeBtn} onClick={closeDrawer} aria-label="Close cart">
            ✕
          </button>
        </div>

        {/* List of items */}
        <div className={styles.itemList}>
          {cart.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>✦</div>
              <h4 className={styles.emptyTitle}>Your List is Empty</h4>
              <p className={styles.emptySub}>
                Explore our fireworks catalog and add your favorite crackers to the list.
              </p>
              <button className="btn-aurora-gold" onClick={closeDrawer}>
                View Fireworks Catalog
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className={styles.cartItem}>
                <div className={styles.imgWrap}>
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={72}
                    height={72}
                    className={styles.itemImg}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/logo-62.png'
                    }}
                  />
                </div>

                <div className={styles.itemInfo}>
                  <div className={styles.itemTop}>
                    <h4 className={styles.itemName}>{item.name}</h4>
                    <button
                      className={styles.removeBtn}
                      onClick={() => removeFromCart(item.id)}
                      title="Remove from list"
                      aria-label="Remove item"
                    >
                      ✕
                    </button>
                  </div>

                  <span className={styles.itemBrand}>{item.brand}</span>

                  <div className={styles.itemBottom}>
                    <div className={styles.priceRow}>
                      <span className={styles.price}>₹{item.price.toLocaleString('en-IN')}</span>
                      {item.originalPrice > item.price && (
                        <span className={styles.origPrice}>₹{item.originalPrice.toLocaleString('en-IN')}</span>
                      )}
                    </div>

                    <div className={styles.qtyControl}>
                      <button
                        className={styles.qtyBtn}
                        onClick={() => updateQuantity(item.id, -1)}
                        aria-label="Decrease quantity"
                      >
                        –
                      </button>
                      <span className={styles.qtyVal}>{item.quantity}</span>
                      <button
                        className={styles.qtyBtn}
                        onClick={() => updateQuantity(item.id, 1)}
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer & Order Actions */}
        {cart.length > 0 && (
          <div className={styles.footer}>
            <button
              type="button"
              className={styles.toggleDetailsBtn}
              onClick={() => setShowDetails(!showDetails)}
            >
              <span>{showDetails ? '▲ Hide extra event details' : '+ Add event notes or contact details (optional)'}</span>
              <span>{showDetails ? '−' : '+'}</span>
            </button>

            {showDetails && (
              <div className={styles.formFields}>
                <input
                  type="text"
                  placeholder="Your Full Name"
                  className={styles.input}
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value.replace(/[^a-zA-Z\s]/g, ''))}
                />
                <input
                  type="tel"
                  placeholder="Mobile Number"
                  maxLength={10}
                  className={styles.input}
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                />
                <div className={styles.inputRow}>
                  <input
                    type="text"
                    placeholder="Celebration Date (e.g. Diwali)"
                    className={styles.input}
                    value={celebrationDate}
                    onChange={(e) => setCelebrationDate(e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Area / City (e.g. Jaipur)"
                    className={styles.input}
                    value={celebrationVenue}
                    onChange={(e) => setCelebrationVenue(e.target.value)}
                  />
                </div>
                <textarea
                  placeholder="Any special requirements, preferred brands or questions..."
                  className={`${styles.input} ${styles.textarea}`}
                  rows={2}
                  value={inquiryNotes}
                  onChange={(e) => setInquiryNotes(e.target.value)}
                />
              </div>
            )}

            <div className={styles.calculation}>
              <div className={styles.summaryRow}>
                <span>Total Amount</span>
                <span className={styles.totalValue}>₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              {totalSavings > 0 && (
                <div className={styles.savingsRow}>
                  <span>Discount Savings</span>
                  <span className={styles.savingsValue}>– ₹{totalSavings.toLocaleString('en-IN')}</span>
                </div>
              )}
            </div>

            <div className={styles.ctaButtonGroup}>
              <Link
                href="/checkout"
                onClick={closeDrawer}
                className="btn-aurora-gold"
                style={{ flex: 1, textAlign: 'center', minHeight: '44px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '8px 12px', fontSize: '13px' }}
              >
                Checkout →
              </Link>

              <button
                className={styles.whatsAppOrderBtn}
                onClick={handleWhatsAppClick}
                disabled={isSubmitting}
                style={{ flex: 1, minHeight: '44px', padding: '8px 12px', fontSize: '13px' }}
              >
                {isSubmitting ? 'Generating...' : 'WhatsApp Order'}
              </button>
            </div>

            <div className={styles.footerBottomRow}>
              <span className={styles.disclaimerText}>
                ✦ Pick up at 62 Hawa Mahal Bazar, Jaipur • 100% Genuine
              </span>
              <button type="button" className={styles.clearBtn} onClick={clearCart}>
                Clear All
              </button>
            </div>
          </div>
        )}
      </aside>

      {/* ── Smart Customer Details Prompt Modal ── */}
      {showContactPromptModal && (
        <div className={styles.modalBackdrop} onClick={() => setShowContactPromptModal(false)}>
          <div className={styles.contactModal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div className={styles.modalHeaderLeft}>
                <span className={styles.modalBadge}>Quick Order &amp; Invoice</span>
                <h4 className={styles.modalTitle}>Enter Details For Your Bill</h4>
                <p className={styles.modalSub}>
                  Please provide your name &amp; phone number so your official GST-compliant estimate invoice has your complete details.
                </p>
              </div>
              <button
                type="button"
                className={styles.modalCloseBtn}
                onClick={() => setShowContactPromptModal(false)}
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleModalSubmit} className={styles.modalForm}>
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>Your Full Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Rahul Sharma"
                  value={customerName}
                  onChange={e => setCustomerName(e.target.value)}
                  className={styles.modalInput}
                  autoFocus
                  required
                />
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>WhatsApp / Mobile Number *</label>
                <div className={styles.phoneInputWrap}>
                  <span className={styles.countryCode}>+91</span>
                  <input
                    type="tel"
                    placeholder="98765 43210"
                    maxLength={10}
                    value={customerPhone}
                    onChange={e => setCustomerPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    className={styles.modalInput}
                    required
                  />
                </div>
                {phoneError && <span className={styles.fieldError}>{phoneError}</span>}
              </div>

              <div className={styles.orderSummarySnippet}>
                <span>Order Total: <strong>₹{subtotal.toLocaleString('en-IN')}</strong> ({totalCount} items)</span>
                <span className={styles.snippetHint}>Instant PDF Invoice + WhatsApp chat</span>
              </div>

              <div className={styles.modalActions}>
                <button
                  type="button"
                  className={styles.btnSecondary}
                  onClick={() => setShowContactPromptModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={styles.btnPrimarySubmit}
                >
                  {isSubmitting ? 'Generating Invoice...' : 'Generate Bill & Open WhatsApp →'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
