'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import styles from './order-success.module.css'

export default function OrderSuccessPage() {
  const params = useParams()
  const orderId = (params?.orderId as string) || ''
  const [orderData, setOrderData] = useState<any>(null)

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem('last_patakha_order')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed.orderId === orderId || !orderId) {
          setOrderData(parsed)
        }
      }
    } catch {
      // Ignore
    }
  }, [orderId])

  const handleDownloadPDF = async () => {
    try {
      const { generateOrderPDF } = await import('@/lib/pdfGenerator')
      const targetId = orderData?.orderId || orderId || 'ORD-NEW'
      const doc = generateOrderPDF({
        orderId: targetId,
        customerName: orderData?.customerName,
        customerPhone: orderData?.customerPhone,
        deliveryMethod: orderData?.deliveryMethod,
        addressLine: orderData?.addressLine,
        areaJaipur: orderData?.areaJaipur,
        pincode: orderData?.pincode,
        paymentMethod: orderData?.paymentMethod,
        orderNote: orderData?.orderNote,
        items: orderData?.items || [],
        subtotal: orderData?.subtotal || 0,
        deliveryCharge: orderData?.deliveryCharge,
        grandTotal: orderData?.grandTotal || orderData?.subtotal || 0,
        totalSavings: orderData?.totalSavings,
        totalCount: orderData?.totalCount,
        createdAt: orderData?.createdAt,
      })
      doc.save(`Invoice-${targetId}.pdf`)
    } catch {
      const targetId = orderData?.orderId || orderId
      if (targetId) window.open(`/api/orders/${targetId}/pdf`, '_blank')
    }
  }

  // Build clean WhatsApp message URL with guaranteed newlines (%0A)
  const getWhatsAppOrderUrl = () => {
    const id = orderData?.orderId || orderId || 'ORD-NEW'
    const host = typeof window !== 'undefined' ? window.location.origin : ''
    const pdfUrl = `${host}/api/orders/${id}/pdf`

    const lines: string[] = []
    lines.push(`*62 PATAKHA SHOP — ORDER CONFIRMATION*`)
    lines.push(`===================================`)
    lines.push(`🧾 *Order ID*: #${id}`)
    lines.push(`👤 *Customer*: ${orderData?.customerName || 'Customer'}`)
    if (orderData?.customerPhone) lines.push(`📞 *Phone*: ${orderData.customerPhone}`)
    lines.push(`🚚 *Fulfillment*: ${orderData?.deliveryMethod === 'pickup' ? 'Store Pickup (Hawa Mahal Bazar)' : 'Jaipur Doorstep Delivery'}`)
    if (orderData?.deliveryMethod === 'delivery' && (orderData?.addressLine || orderData?.areaJaipur)) {
      lines.push(`📍 *Delivery Address*: ${orderData.addressLine || ''}, ${orderData.areaJaipur || ''} (PIN: ${orderData.pincode || '302002'})`)
    }
    lines.push(`💳 *Payment Mode*: ${orderData?.paymentMethod === 'upi' ? 'UPI / QR Code' : 'Cash on Delivery'}`)
    lines.push(`💰 *Total Amount*: ₹${(orderData?.grandTotal || orderData?.subtotal || 0).toLocaleString('en-IN')} (${orderData?.totalCount || orderData?.items?.length || 0} Items)`)
    lines.push(`===================================`)
    lines.push(`📄 *Official Order PDF Invoice*:`)
    lines.push(pdfUrl)
    lines.push(`===================================`)
    lines.push(`📍 *62 Patakha Shop*, Near Old Vidhan Sabha, Hawa Mahal Bazar, Jaipur`)
    lines.push(`📞 *Helpline*: +91 85610 05357`)
    lines.push(`_Thank you for choosing 62 Patakha Shop! We are preparing your order safely._`)

    const fullMsg = lines.join('\n')
    const text = encodeURIComponent(fullMsg)
    return `https://api.whatsapp.com/send?phone=918561005357&text=${text}`
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className={styles.pageWrapper}>
      <div className="editorial-container">
        <div className={styles.receiptCard}>
          {/* Official Print Header (Only visible on invoice print) */}
          <div className={styles.printHeader}>
            <div className={styles.printHeaderLeft}>
              <h2 className={styles.printBrandName}>62 PATAKHA SHOP</h2>
              <p className={styles.printBrandSub}>SIVAKASI DIRECT FIREWORKS SHOWROOM</p>
              <p className={styles.printAddress}>62, Hawa Mahal Bazar, Near Old Vidhan Sabha, Jaipur, RJ 302002</p>
              <p className={styles.printContact}>Helpline: +91 85610 05357 | contact@62patakhashop.com</p>
            </div>
            <div className={styles.printHeaderRight}>
              <span className={styles.printInvoiceTag}>CUSTOMER ORDER INVOICE</span>
              <p className={styles.printDate}>Date: {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
            </div>
          </div>

          {/* Header */}
          <div className={styles.successBanner}>
            <div className={styles.checkCircle}>✓</div>
            <span className={styles.tagline}>Order Confirmed</span>
            <h1 className={styles.title}>Thank You for Celebrating With Us!</h1>
            <p className={styles.subtext}>
              Your order has been recorded in our system. We are preparing your fireworks with utmost safety.
            </p>
          </div>

          {/* Order Details Bar */}
          <div className={styles.metaGrid}>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Order Number</span>
              <span className={styles.metaVal}>{orderId || orderData?.orderId || 'ORD-NEW'}</span>
            </div>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Fulfillment</span>
              <span className={styles.metaVal}>
                {orderData?.deliveryMethod === 'pickup'
                  ? 'Store Pickup (Hawa Mahal Bazar)'
                  : 'Jaipur Doorstep Delivery'}
              </span>
            </div>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Payment Mode</span>
              <span className={styles.metaVal}>
                {orderData?.paymentMethod === 'upi' ? 'UPI / QR Code' : 'Cash on Delivery / Pickup'}
              </span>
            </div>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Customer</span>
              <span className={styles.metaVal}>{orderData?.customerName || 'Celebration Customer'}</span>
            </div>
          </div>

          {/* Items breakdown if present */}
          {orderData?.items && orderData.items.length > 0 && (
            <div className={styles.itemsSection}>
              <h3 className={styles.sectionHead}>Fireworks Packed in Carton</h3>
              <div className={styles.itemsTable}>
                {orderData.items.map((it: any, idx: number) => (
                  <div key={idx} className={styles.itemRow}>
                    <div className={styles.itemInfo}>
                      <span className={styles.itemName}>{it.name}</span>
                      <span className={styles.itemSub}>Brand: {it.brand || 'Standard'}</span>
                    </div>
                    <span className={styles.itemQty}>Qty: {it.quantity}</span>
                    <span className={styles.itemPrice}>
                      ₹{(it.price * it.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>

              <div className={styles.receiptTotals}>
                <div className={styles.totalLine}>
                  <span>Subtotal</span>
                  <span>₹{(orderData.subtotal || 0).toLocaleString('en-IN')}</span>
                </div>
                {orderData.deliveryCharge !== undefined && (
                  <div className={styles.totalLine}>
                    <span>Delivery</span>
                    <span>
                      {orderData.deliveryCharge === 0 ? 'FREE' : `₹${orderData.deliveryCharge}`}
                    </span>
                  </div>
                )}
                <div className={`${styles.totalLine} ${styles.grandLine}`}>
                  <span>Grand Total</span>
                  <span>
                    ₹{(orderData.grandTotal || orderData.subtotal || 0).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Shop Instructions / Pickup Address */}
          <div className={styles.storeAddressBox}>
            <h4>Pickup &amp; Support Address:</h4>
            <p>
              <strong>62 Patakha Shop</strong>, Hawa Mahal Bazar, Jaipur, Rajasthan 302002
            </p>
            <p>Support Helpline: +91 85610 05357 (WhatsApp Available)</p>
          </div>

          {/* Action Buttons */}
          <div className={styles.actionButtons}>
            <button type="button" onClick={handleDownloadPDF} className={styles.printBtn} style={{ background: '#C99E52', color: '#FFFFFF' }}>
              📄 Download Official Order PDF Invoice
            </button>

            {(getWhatsAppOrderUrl() || orderData?.whatsappUrl) && (
              <a
                href={getWhatsAppOrderUrl() || orderData?.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.whatsappBtn}
              >
                Send Order Receipt &amp; PDF Link to WhatsApp
              </a>
            )}

            <button type="button" onClick={handlePrint} className={styles.printBtn}>
              🖨️ Print Slip
            </button>

            <Link href={`/track-order?orderId=${orderId || orderData?.orderId || ''}`} className={styles.trackBtn}>
              Track Order Status →
            </Link>

            <Link href="/catalog" className={styles.returnBtn}>
              Return to Catalog
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
