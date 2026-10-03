'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useCart } from '@/context/CartContext'
import styles from './checkout.module.css'

export default function CheckoutPage() {
  const router = useRouter()
  const { cart, subtotal, totalSavings, totalCount, clearCart } = useCart()

  // Form states
  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [customerEmail, setCustomerEmail] = useState('')
  const [deliveryMethod, setDeliveryMethod] = useState<'delivery' | 'pickup'>('delivery')
  
  // Delivery address details
  const [addressLine, setAddressLine] = useState('')
  const [areaJaipur, setAreaJaipur] = useState('')
  const [pincode, setPincode] = useState('')
  const [landmark, setLandmark] = useState('')
  
  // Event & celebration timing
  const [celebrationDate, setCelebrationDate] = useState('')
  const [celebrationOccasion, setCelebrationOccasion] = useState('Diwali')
  const [orderNotes, setOrderNotes] = useState('')
  
  // Payment option
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'upi'>('cod')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState('')

  // Delivery charge calculation (Free for pickup or orders above ₹3,000)
  const deliveryCharge = deliveryMethod === 'pickup' ? 0 : (subtotal >= 3000 ? 0 : 150)
  const grandTotal = subtotal + deliveryCharge

  // 10-Second Swiggy-style Hold Window state
  const [countdown, setCountdown] = useState<number | null>(null)
  const [pendingPayload, setPendingPayload] = useState<any>(null)

  // Countdown timer effect
  useEffect(() => {
    if (countdown === null) return
    if (countdown === 0) {
      finalizeOrder(pendingPayload)
      setCountdown(null)
      return
    }

    const timer = setTimeout(() => {
      setCountdown(c => (c !== null ? c - 1 : null))
    }, 1000)

    return () => clearTimeout(timer)
  }, [countdown, pendingPayload])

  const finalizeOrder = async (orderPayload: any) => {
    if (!orderPayload) return
    setIsSubmitting(true)
    setFormError('')

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      })
      const data = await res.json()

      if (data.success && data.order) {
        const host = typeof window !== 'undefined' ? window.location.origin : ''
        const pdfUrl = `${host}/api/orders/${data.order.orderId}/pdf`

        // Generate local PDF download for instant customer receipt
        try {
          const { generateOrderPDF } = await import('@/lib/pdfGenerator')
          const doc = generateOrderPDF({
            orderId: data.order.orderId,
            customerName: orderPayload.customerName,
            customerPhone: orderPayload.customerPhone,
            deliveryMethod: orderPayload.deliveryMethod,
            addressLine,
            areaJaipur,
            pincode,
            paymentMethod: orderPayload.paymentMethod,
            items: orderPayload.items,
            subtotal: orderPayload.subtotal,
            deliveryCharge: orderPayload.deliveryCharge,
            grandTotal: orderPayload.grandTotal,
            totalSavings: orderPayload.totalSavings,
            totalCount: orderPayload.totalCount,
          })
          doc.save(`Invoice-${data.order.orderId}.pdf`)
        } catch {
          // Ignore PDF error
        }

        const lines: string[] = []
        lines.push(`*62 PATAKHA SHOP — ORDER CONFIRMATION*`)
        lines.push(`===================================`)
        lines.push(`🧾 *Order ID*: #${data.order.orderId}`)
        lines.push(`👤 *Customer*: ${orderPayload.customerName}`)
        lines.push(`📞 *Phone*: ${orderPayload.customerPhone}`)
        lines.push(`🚚 *Fulfillment*: ${orderPayload.deliveryMethod === 'pickup' ? 'Store Pickup (Hawa Mahal Bazar)' : 'Jaipur Doorstep Delivery'}`)
        if (orderPayload.deliveryMethod === 'delivery') {
          lines.push(`📍 *Delivery Address*: ${addressLine}, ${areaJaipur} (PIN: ${pincode})`)
        }
        lines.push(`💳 *Payment Mode*: ${orderPayload.paymentMethod === 'cod' ? 'Cash on Delivery / Pickup' : 'Instant UPI / QR Code'}`)
        lines.push(`💰 *Grand Total*: ₹${orderPayload.grandTotal.toLocaleString('en-IN')} (${orderPayload.totalCount} Items)`)
        lines.push(`===================================`)
        lines.push(`📄 *Official Order PDF Invoice*:`)
        lines.push(pdfUrl)
        lines.push(`===================================`)
        lines.push(`📍 *62 Patakha Shop*, Near Old Vidhan Sabha, Hawa Mahal Bazar, Jaipur`)
        lines.push(`📞 *Helpline*: +91 85610 05357`)
        lines.push(`_Thank you for choosing 62 Patakha Shop! We are preparing your order safely._`)

        const fullMsg = lines.join('\n')
        const encodedMsg = encodeURIComponent(fullMsg)
        const waUrl = `https://api.whatsapp.com/send?phone=918561005357&text=${encodedMsg}`

        clearCart()
        sessionStorage.setItem('last_patakha_order', JSON.stringify({
          ...data.order,
          customerName: orderPayload.customerName,
          customerPhone: orderPayload.customerPhone,
          deliveryMethod: orderPayload.deliveryMethod,
          paymentMethod: orderPayload.paymentMethod,
          addressLine,
          areaJaipur,
          pincode,
          items: orderPayload.items,
          subtotal: orderPayload.subtotal,
          grandTotal: orderPayload.grandTotal,
          deliveryCharge: orderPayload.deliveryCharge,
          totalSavings: orderPayload.totalSavings,
          whatsappUrl: waUrl
        }))
        router.push(`/order-success/${data.order.orderId}`)
      } else {
        setFormError(data.error || 'Failed to submit order. Please try again.')
      }
    } catch {
      setFormError('Network error while placing order. Please try again or order on WhatsApp.')
    } finally {
      setIsSubmitting(false)
      setPendingPayload(null)
    }
  }

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError('')

    if (cart.length === 0) {
      setFormError('Your cart is empty. Please add items to proceed.')
      return
    }

    if (!customerName.trim() || !customerPhone.trim()) {
      setFormError('Please enter your full name and 10-digit mobile number.')
      return
    }

    if (deliveryMethod === 'delivery' && (!addressLine.trim() || !areaJaipur.trim() || !pincode.trim())) {
      setFormError('Please provide your complete delivery address, area, and PIN code.')
      return
    }

    const deliveryNoteDetails =
      deliveryMethod === 'pickup'
        ? `STORE PICKUP: 62 Hawa Mahal Bazar, Jaipur | Event: ${celebrationOccasion} (${celebrationDate || 'Immediate'})`
        : `DELIVERY: ${addressLine}, ${landmark ? landmark + ', ' : ''}${areaJaipur}, Jaipur - ${pincode} | Event: ${celebrationOccasion} (${celebrationDate || 'Standard'})`

    const orderPayload = {
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      customerEmail: customerEmail.trim(),
      deliveryMethod,
      paymentMethod,
      orderNote: `${deliveryNoteDetails} | Notes: ${orderNotes.trim()}`,
      items: cart,
      subtotal,
      deliveryCharge,
      grandTotal,
      totalSavings,
      totalCount,
    }

    // Initiate 10-second hold countdown
    setPendingPayload(orderPayload)
    setCountdown(10)
  }

  if (cart.length === 0) {
    return (
      <div className={styles.emptyWrap}>
        <div className="editorial-container">
          <div className={styles.emptyCard}>
            <div className={styles.emptyIcon}>✦</div>
            <h2 className={styles.emptyTitle}>Your Cart is Empty</h2>
            <p className={styles.emptySubtitle}>
              You have not added any fireworks to your cart yet. Explore our fresh Sivakasi stock to place your order.
            </p>
            <Link href="/catalog" className="btn-aurora-gold">
              Browse Fireworks Catalog
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.checkoutWrapper}>
      <div className="editorial-container">
        {/* Breadcrumb / Title */}
        <div className={styles.pageHeader}>
          <span className="eyebrow-pill">Secure Checkout</span>
          <h1 className={styles.title}>Complete Your Order</h1>
          <p className={styles.subtitle}>
            Order genuine Sivakasi fireworks for direct doorstep delivery in Jaipur or store pickup at Hawa Mahal Bazar.
          </p>
        </div>

        {formError && <div className={styles.errorBanner}>{formError}</div>}

        <form onSubmit={handleSubmitOrder} className={styles.checkoutGrid}>
          {/* Left Column: Form Details */}
          <div className={styles.formCol}>
            {/* 1. Contact Information */}
            <div className={styles.sectionCard}>
              <div className={styles.sectionHeader}>
                <span className={styles.stepNum}>1</span>
                <div>
                  <h3 className={styles.sectionTitle}>Customer Contact Details</h3>
                  <p className={styles.sectionSub}>We will send order confirmation and dispatch updates via SMS &amp; WhatsApp</p>
                </div>
              </div>

              <div className={styles.formRow2}>
                <div className={styles.inputGroup}>
                  <label>Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value.replace(/[^a-zA-Z\s]/g, ''))}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label>Phone / WhatsApp Number *</label>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    placeholder="10-digit mobile number"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  />
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label>Email Address (Optional)</label>
                <input
                  type="email"
                  placeholder="yourname@gmail.com"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                />
              </div>
            </div>

            {/* 2. Fulfillment Method (Pickup vs Delivery) */}
            <div className={styles.sectionCard}>
              <div className={styles.sectionHeader}>
                <span className={styles.stepNum}>2</span>
                <div>
                  <h3 className={styles.sectionTitle}>Delivery or Store Pickup</h3>
                  <p className={styles.sectionSub}>Choose how you would like to receive your fireworks</p>
                </div>
              </div>

              <div className={styles.deliverySelector}>
                <label className={`${styles.deliveryOption} ${deliveryMethod === 'delivery' ? styles.deliveryActive : ''}`}>
                  <input
                    type="radio"
                    name="deliveryMethod"
                    value="delivery"
                    checked={deliveryMethod === 'delivery'}
                    onChange={() => setDeliveryMethod('delivery')}
                  />
                  <div>
                    <div className={styles.optTitle}>Doorstep Delivery in Jaipur</div>
                    <div className={styles.optDesc}>Delivered safely in moisture-proof cartons (Free on ₹3,000+)</div>
                  </div>
                  <span className={styles.optBadge}>
                    {subtotal >= 3000 ? 'FREE' : '₹150'}
                  </span>
                </label>

                <label className={`${styles.deliveryOption} ${deliveryMethod === 'pickup' ? styles.deliveryActive : ''}`}>
                  <input
                    type="radio"
                    name="deliveryMethod"
                    value="pickup"
                    checked={deliveryMethod === 'pickup'}
                    onChange={() => setDeliveryMethod('pickup')}
                  />
                  <div>
                    <div className={styles.optTitle}>Store Pickup (Hawa Mahal Bazar)</div>
                    <div className={styles.optDesc}>Pick up ready order directly from 62 Hawa Mahal Bazar, Jaipur</div>
                  </div>
                  <span className={styles.optBadge}>FREE</span>
                </label>
              </div>

              {deliveryMethod === 'delivery' && (
                <div className={styles.addressFields}>
                  <div className={styles.inputGroup}>
                    <label>Street Address / House No. / Building *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Flat 302, Royal Residency, Plot 45"
                      value={addressLine}
                      onChange={(e) => setAddressLine(e.target.value)}
                    />
                  </div>

                  <div className={styles.formRow2}>
                    <div className={styles.inputGroup}>
                      <label>Area / Locality in Jaipur *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Vaishali Nagar / Mansarovar / Raja Park"
                        value={areaJaipur}
                        onChange={(e) => setAreaJaipur(e.target.value)}
                      />
                    </div>
                    <div className={styles.inputGroup}>
                      <label>Pin Code *</label>
                      <input
                        type="text"
                        required
                        maxLength={6}
                        placeholder="e.g. 302021"
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className={styles.inputGroup}>
                    <label>Nearby Landmark (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. Near Akshardham Temple / Big Bazaar"
                      value={landmark}
                      onChange={(e) => setLandmark(e.target.value)}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* 3. Celebration Occasion & Date */}
            <div className={styles.sectionCard}>
              <div className={styles.sectionHeader}>
                <span className={styles.stepNum}>3</span>
                <div>
                  <h3 className={styles.sectionTitle}>Event Timing &amp; Occasion</h3>
                  <p className={styles.sectionSub}>Helps us pack and prepare fireworks matching your timeline</p>
                </div>
              </div>

              <div className={styles.formRow2}>
                <div className={styles.inputGroup}>
                  <label>Occasion / Celebration</label>
                  <select
                    value={celebrationOccasion}
                    onChange={(e) => setCelebrationOccasion(e.target.value)}
                  >
                    <option value="Diwali">Diwali Celebration</option>
                    <option value="Wedding / Baraat">Wedding / Baraat / Reception</option>
                    <option value="Birthday / Party">Birthday / Anniversary Party</option>
                    <option value="New Year / Corporate">New Year / Corporate Event</option>
                    <option value="Other">Other Celebration</option>
                  </select>
                </div>

                <div className={styles.inputGroup}>
                  <label>Celebration Date (Optional)</label>
                  <input
                    type="date"
                    value={celebrationDate}
                    onChange={(e) => setCelebrationDate(e.target.value)}
                  />
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label>Special Instructions / Packing Note</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Please pack sky rockets carefully, call before arriving..."
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                />
              </div>
            </div>

            {/* 4. Payment Selection */}
            <div className={styles.sectionCard}>
              <div className={styles.sectionHeader}>
                <span className={styles.stepNum}>4</span>
                <div>
                  <h3 className={styles.sectionTitle}>Payment Method</h3>
                  <p className={styles.sectionSub}>Safe and hassle-free payment on delivery or pickup</p>
                </div>
              </div>

              <div className={styles.paymentMethods}>
                <label className={`${styles.paymentOption} ${paymentMethod === 'cod' ? styles.paymentActive : ''}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                  />
                  <div>
                    <div className={styles.optTitle}>
                      {deliveryMethod === 'pickup' ? 'Pay on Store Pickup (Cash / UPI)' : 'Cash on Delivery (COD)'}
                    </div>
                    <div className={styles.optDesc}>Inspect your fireworks carton and pay comfortably at receipt</div>
                  </div>
                </label>

                <label className={`${styles.paymentOption} ${paymentMethod === 'upi' ? styles.paymentActive : ''}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="upi"
                    checked={paymentMethod === 'upi'}
                    onChange={() => setPaymentMethod('upi')}
                  />
                  <div>
                    <div className={styles.optTitle}>Instant UPI / QR Code (GPay, PhonePe, Paytm)</div>
                    <div className={styles.optDesc}>Pay directly to official shop UPI upon order placement</div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <div className={styles.summaryCol}>
            <div className={styles.summaryCard}>
              <h3 className={styles.summaryTitle}>Order Summary</h3>
              <p className={styles.summaryCount}>{totalCount} fireworks items in carton</p>

              <div className={styles.orderItemsList}>
                {cart.map((item) => (
                  <div key={item.id} className={styles.summaryItem}>
                    <div className={styles.itemImgWrap}>
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={48}
                        height={48}
                        className={styles.itemImg}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/logo-62.png'
                        }}
                      />
                      <span className={styles.itemQtyBadge}>{item.quantity}</span>
                    </div>
                    <div className={styles.itemDetails}>
                      <span className={styles.itemName}>{item.name}</span>
                      <span className={styles.itemBrand}>{item.brand || 'Standard'}</span>
                    </div>
                    <span className={styles.itemPrice}>
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>

              <div className={styles.billBreakdown}>
                <div className={styles.billRow}>
                  <span>Subtotal</span>
                  <span>₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                {totalSavings > 0 && (
                  <div className={`${styles.billRow} ${styles.savingRow}`}>
                    <span>Festival Retail Discount</span>
                    <span>-₹{totalSavings.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className={styles.billRow}>
                  <span>Delivery Charges</span>
                  <span>{deliveryCharge === 0 ? <strong style={{ color: '#2e7d32' }}>FREE</strong> : `₹${deliveryCharge}`}</span>
                </div>
                {deliveryMethod === 'delivery' && subtotal < 3000 && (
                  <p className={styles.freeDeliveryHint}>
                    💡 Add ₹{(3000 - subtotal).toLocaleString('en-IN')} more to unlock <strong>FREE Delivery</strong>!
                  </p>
                )}
                <div className={styles.divider} />
                <div className={styles.totalRow}>
                  <span>Total Amount</span>
                  <span className={styles.grandPrice}>₹{grandTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || countdown !== null}
                className="btn-aurora-gold"
                style={{ width: '100%', padding: '16px', fontSize: '15px', marginTop: '20px' }}
              >
                {isSubmitting ? 'Confirming Order...' : `Place Fireworks Order (₹${grandTotal.toLocaleString('en-IN')})`}
              </button>

              <div className={styles.guaranteeBox}>
                <div className={styles.guaranteeItem}>✓ 100% Genuine Sivakasi Green Crackers</div>
                <div className={styles.guaranteeItem}>✓ Direct Shop Pickup at Hawa Mahal Bazar Available</div>
                <div className={styles.guaranteeItem}>✓ Safe Moisture-Proof Packaging</div>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* ── 10-SECOND SWIGGY/ZOMATO-STYLE HOLD MODAL ── */}
      {countdown !== null && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.75)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '20px',
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '20px',
            maxWidth: '460px',
            width: '100%',
            padding: '32px 24px',
            textAlign: 'center',
            boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
            animation: 'fadeInUp 0.3s ease',
          }}>
            {/* Animated Circular Timer Badge */}
            <div style={{
              width: '74px',
              height: '74px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #fef3c7, #fde68a)',
              border: '3px solid #f59e0b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px auto',
              fontSize: '28px',
              fontWeight: 800,
              color: '#b45309',
              boxShadow: '0 4px 15px rgba(245, 158, 11, 0.3)',
            }}>
              {countdown}s
            </div>

            <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#111827', margin: '0 0 8px 0' }}>
              Order Initiated!
            </h3>
            <p style={{ fontSize: '14px', color: '#4b5563', lineHeight: '1.5', margin: '0 0 20px 0' }}>
              Need to add something or change quantities? You have <strong style={{ color: '#b45309' }}>{countdown} seconds</strong> to modify your order.
            </p>

            {/* Visual progress bar */}
            <div style={{ width: '100%', height: '6px', background: '#f3f4f6', borderRadius: '99px', overflow: 'hidden', marginBottom: '22px' }}>
              <div style={{
                height: '100%',
                width: `${(countdown / 10) * 100}%`,
                background: 'linear-gradient(90deg, #f59e0b, #eab308)',
                transition: 'width 1s linear',
              }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {/* Button 1: Modify Order */}
              <button
                type="button"
                onClick={() => {
                  setCountdown(null)
                  setPendingPayload(null)
                }}
                style={{
                  width: '100%',
                  padding: '13px',
                  borderRadius: '10px',
                  background: '#fef2f2',
                  border: '1.5px solid #fecaca',
                  color: '#dc2626',
                  fontWeight: 700,
                  fontSize: '14px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                }}
              >
                ✏️ Modify / Change Items in Order
              </button>

              {/* Button 2: Proceed immediately without waiting */}
              <button
                type="button"
                onClick={() => {
                  setCountdown(null)
                  finalizeOrder(pendingPayload)
                }}
                className="btn-aurora-gold"
                style={{
                  width: '100%',
                  padding: '13px',
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontWeight: 800,
                  cursor: 'pointer',
                }}
              >
                Confirm Now &amp; Open WhatsApp ⚡
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
