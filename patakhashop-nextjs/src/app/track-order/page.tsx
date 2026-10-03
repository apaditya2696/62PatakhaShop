'use client'

import React, { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import styles from './track-order.module.css'

const STATUS_STEPS = [
  { key: 'pending', label: 'Order Received', desc: 'Order logged & awaiting review' },
  { key: 'confirmed', label: 'Confirmed', desc: 'Stock allocated in warehouse' },
  { key: 'packed', label: 'Moisture-Proof Packed', desc: 'Safety corrugated carton sealed' },
  { key: 'out_for_delivery', label: 'Out for Delivery / Ready', desc: 'Ready for showroom pickup or vehicle dispatch' },
  { key: 'delivered', label: 'Delivered / Completed', desc: 'Celebration fireworks received safely' },
]

function getStepIndex(status: string) {
  const s = (status || '').toLowerCase()
  if (s === 'delivered' || s === 'completed') return 4
  if (s === 'out_for_delivery' || s === 'ready' || s === 'dispatched') return 3
  if (s === 'packed') return 2
  if (s === 'confirmed') return 1
  return 0
}

function getStatusPillClass(status: string) {
  const s = (status || '').toLowerCase()
  if (s === 'delivered' || s === 'completed') return styles.statusDelivered
  if (s === 'out_for_delivery' || s === 'ready' || s === 'dispatched') return styles.statusOut
  if (s === 'packed') return styles.statusPacked
  if (s === 'confirmed') return styles.statusConfirmed
  return styles.statusPending
}

function TrackOrderContent() {
  const searchParams = useSearchParams()
  const initialOrderId = searchParams.get('orderId') || ''

  const [orderQuery, setOrderQuery] = useState(initialOrderId)
  const [phoneQuery, setPhoneQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [orders, setOrders] = useState<any[]>([])
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const copyOrderId = (orderId: string) => {
    navigator.clipboard?.writeText(orderId)
    setCopiedId(orderId)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const printOrderReceipt = (order: any) => {
    const now = new Date(order.createdAt || Date.now())
    const dateFormatted = now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
    const timeFormatted = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })

    const rows = (order.items || []).map((it: any) => `
      <tr style="page-break-inside: avoid; break-inside: avoid;">
        <td style="padding: 3.5px 6px; border-bottom: 1px solid #e5e7eb; font-size: 11px;">
          <span style="font-weight: 700; color: #111;">${it.name}</span>
          ${it.brand ? `<span style="font-size: 9px; color: #6b7280; font-weight: 600; text-transform: uppercase; margin-left: 5px;">(${it.brand})</span>` : ''}
        </td>
        <td style="padding: 3.5px 6px; border-bottom: 1px solid #e5e7eb; text-align: center; font-weight: 700; font-size: 11px;">${it.quantity}</td>
        <td style="padding: 3.5px 6px; border-bottom: 1px solid #e5e7eb; text-align: right; font-size: 11px; color: #374151;">&#x20B9;${Number(it.price || 0).toLocaleString('en-IN')}</td>
        <td style="padding: 3.5px 6px; border-bottom: 1px solid #e5e7eb; text-align: right; font-weight: 700; font-size: 11px; color: #111;">&#x20B9;${(Number(it.quantity || 1) * Number(it.price || 0)).toLocaleString('en-IN')}</td>
      </tr>
    `).join('')

    const receiptHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Customer Receipt — ${order.orderId}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
    @page { size: A4 portrait; margin: 4mm 6mm; }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Plus Jakarta Sans', sans-serif; background: #fff; color: #111827; padding: 10px 14px; max-width: 680px; margin: 0 auto; font-size: 11px; line-height: 1.3; }
    .receipt-card { border: 1px solid #e5e7eb; border-radius: 8px; padding: 12px 14px; background: #ffffff; page-break-inside: avoid; break-inside: avoid; }
    .header { display: flex; justify-content: space-between; align-items: flex-start; padding-bottom: 6px; border-bottom: 1.5px dashed #d1d5db; margin-bottom: 8px; page-break-inside: avoid; break-inside: avoid; }
    .brand-title { font-size: 15px; font-weight: 800; color: #111; letter-spacing: -0.3px; }
    .brand-sub { font-size: 10px; color: #4b5563; margin-top: 1px; }
    .badge-order { background: #fef3c7; color: #92400e; padding: 2px 7px; border-radius: 4px; font-weight: 800; font-size: 11px; text-align: right; display: inline-block; }
    .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 4px 12px; margin-bottom: 8px; padding: 6px 10px; background: #f9fafb; border-radius: 6px; border: 1px solid #f0f0f0; page-break-inside: avoid; break-inside: avoid; }
    .info-label { font-size: 8.5px; text-transform: uppercase; letter-spacing: 0.4px; color: #6b7280; font-weight: 700; margin-bottom: 1px; }
    .info-val { font-size: 11px; font-weight: 700; color: #111; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 8px; }
    th { background: #f3f4f6; padding: 4px 6px; text-align: left; font-size: 9.5px; text-transform: uppercase; letter-spacing: 0.4px; color: #374151; font-weight: 800; }
    .totals-box { margin-top: 6px; border-top: 1.5px solid #111; padding-top: 5px; page-break-inside: avoid; break-inside: avoid; }
    .total-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2px; font-size: 11px; color: #374151; }
    .grand-total { font-size: 14px; font-weight: 800; color: #111; border-top: 1px dashed #d1d5db; padding-top: 4px; margin-top: 3px; }
    .footer { text-align: center; margin-top: 8px; padding-top: 5px; border-top: 1px solid #e5e7eb; font-size: 9px; color: #6b7280; page-break-inside: avoid; break-inside: avoid; }
    @media print {
      body { padding: 0; max-width: 100%; }
      .receipt-card { border: none; padding: 0; }
    }
  </style>
</head>
<body>
  <div class="receipt-card">
    <div class="header">
      <div>
        <div class="brand-title">&#127879; 62 PATAKHA SHOP</div>
        <div class="brand-sub">Hawa Mahal Bazar, Jaipur, Rajasthan &bull; +91 85610 05357</div>
        <div class="brand-sub">Govt. Authorized Licensed Green Fireworks Store &bull; Sivakasi Direct</div>
      </div>
      <div style="text-align: right;">
        <span class="badge-order">${order.orderId}</span>
        <div style="font-size: 11.5px; color: #6b7280; margin-top: 6px;">${dateFormatted} &bull; ${timeFormatted}</div>
        <div style="font-size: 11px; font-weight: 700; color: ${order.status === 'confirmed' ? '#15803d' : '#b45309'}; text-transform: uppercase; margin-top: 4px;">Status: ${order.status || 'Pending'}</div>
      </div>
    </div>

    <div class="info-grid">
      <div>
        <div class="info-label">Customer Name</div>
        <div class="info-val">${order.customerName || 'Customer'}</div>
      </div>
      <div>
        <div class="info-label">Contact Phone</div>
        <div class="info-val">${order.customerPhone || 'N/A'}</div>
      </div>
      <div style="grid-column: span 2;">
        <div class="info-label">Order Note / Delivery Preference</div>
        <div class="info-val" style="font-weight: 500;">${order.orderNote || 'Showroom Store Pickup / Express Delivery'}</div>
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th>Purchased Item</th>
          <th style="text-align: center;">Qty</th>
          <th style="text-align: right;">Price</th>
          <th style="text-align: right;">Total</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>

    <div class="totals-box">
      <div class="total-row">
        <span>Items Purchased:</span>
        <span style="font-weight: 700;">${order.totalCount || (order.items ? order.items.length : 0)} items</span>
      </div>
      ${Number(order.totalSavings || 0) > 0 ? `
      <div class="total-row" style="color: #15803d;">
        <span>Total Festive Savings:</span>
        <span style="font-weight: 700;">-&#x20B9;${Number(order.totalSavings).toLocaleString('en-IN')}</span>
      </div>
      ` : ''}
      <div class="total-row grand-total">
        <span>Grand Total Amount:</span>
        <span>&#x20B9;${Number(order.subtotal || 0).toLocaleString('en-IN')}</span>
      </div>
    </div>

    <div class="footer">
      <p style="font-weight: 600; color: #4b5563; margin-bottom: 4px;">Thank you for celebrating with 62 Patakha Shop!</p>
      <p>Showroom: 62, Hawa Mahal Bazar, Near Old Vidhan Sabha, Kanwar Nagar, Jaipur &bull; Support: +91 85610 05357</p>
    </div>
  </div>
</body>
</html>`

    let printFrame = document.getElementById('customer-print-iframe') as HTMLIFrameElement
    if (!printFrame) {
      printFrame = document.createElement('iframe')
      printFrame.id = 'customer-print-iframe'
      printFrame.style.position = 'fixed'
      printFrame.style.right = '0'
      printFrame.style.bottom = '0'
      printFrame.style.width = '0'
      printFrame.style.height = '0'
      printFrame.style.border = '0'
      document.body.appendChild(printFrame)
    }

    const frameDoc = printFrame.contentWindow?.document || printFrame.contentDocument
    if (frameDoc && printFrame.contentWindow) {
      frameDoc.open()
      frameDoc.write(receiptHtml)
      frameDoc.close()
      setTimeout(() => {
        printFrame.contentWindow?.focus()
        printFrame.contentWindow?.print()
      }, 300)
    }
  }

  const handleDownloadPDF = async (ord: any) => {
    try {
      const { generateOrderPDF } = await import('@/lib/pdfGenerator')
      const doc = generateOrderPDF({
        orderId: ord.orderId,
        customerName: ord.customerName,
        customerPhone: ord.customerPhone,
        deliveryMethod: ord.deliveryMethod,
        addressLine: ord.addressLine,
        areaJaipur: ord.areaJaipur,
        pincode: ord.pincode,
        paymentMethod: ord.paymentMethod,
        orderNote: ord.orderNote,
        items: ord.items || [],
        subtotal: Number(ord.subtotal) || 0,
        totalSavings: Number(ord.totalSavings) || 0,
        totalCount: Number(ord.totalCount) || ord.items?.length || 0,
        createdAt: ord.createdAt,
      })
      doc.save(`Invoice-${ord.orderId}.pdf`)
    } catch {
      window.open(`/api/orders/${ord.orderId}/pdf`, '_blank')
    }
  }

  const getWhatsAppTrackShareUrl = (ord: any) => {
    const host = typeof window !== 'undefined' ? window.location.origin : ''
    const trackUrl = `${host}/track-order?orderId=${ord.orderId}`
    const text = encodeURIComponent(
      `Hello 62 Patakha Shop! Checking live status for my Order #${ord.orderId} (${ord.customerName || 'Customer'}).\nTracking link: ${trackUrl}`
    )
    return `https://wa.me/918561005357?text=${text}`
  }

  const fetchOrder = async (oid?: string, ph?: string) => {
    const o = oid !== undefined ? oid : orderQuery
    const p = ph !== undefined ? ph : phoneQuery
    if (!o.trim() && !p.trim()) {
      setErrorMsg('Please enter either your Order ID or registered mobile number.')
      return
    }

    setIsLoading(true)
    setErrorMsg('')
    try {
      const params = new URLSearchParams()
      if (o.trim()) params.set('orderId', o.trim())
      if (p.trim()) params.set('phone', p.trim())

      const res = await fetch(`/api/orders/track?${params.toString()}`)
      const data = await res.json()

      if (data.success && data.orders && data.orders.length > 0) {
        setOrders(data.orders)
      } else {
        setErrorMsg(data.error || 'No orders found matching this information.')
        setOrders([])
      }
    } catch {
      setErrorMsg('Unable to retrieve tracking data. Please try again or WhatsApp us directly.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (initialOrderId) {
      fetchOrder(initialOrderId, '')
    }
  }, [initialOrderId])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    fetchOrder()
  }

  return (
    <div className={styles.trackWrapper}>
      <div className="editorial-container">
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerPill}>
            <span className={styles.pulseDot} />
            Live Dispatch Tracking
          </div>
          <h1 className={styles.title}>Track Fireworks Order</h1>
          <p className={styles.subtitle}>
            Enter your Order ID (e.g. ORD-614466) or mobile number to view real-time warehouse packing, dispatch stage &amp; download receipts.
          </p>
        </div>

        {/* Search Card */}
        <div className={styles.searchCard}>
          <form onSubmit={handleSearchSubmit} className={styles.searchForm}>
            <div className={styles.formCol}>
              <label>Order ID</label>
              <input
                type="text"
                placeholder="e.g. ORD-614466"
                value={orderQuery}
                onChange={(e) => setOrderQuery(e.target.value)}
              />
            </div>

            <div className={styles.orDivider}>OR</div>

            <div className={styles.formCol}>
              <label>Registered Mobile Number</label>
              <input
                type="tel"
                placeholder="10-digit mobile number"
                maxLength={10}
                value={phoneQuery}
                onChange={(e) => setPhoneQuery(e.target.value.replace(/\D/g, '').slice(0, 10))}
              />
            </div>

            <button type="submit" disabled={isLoading} className={`btn-aurora-gold ${styles.searchBtn}`}>
              {isLoading ? 'Searching Warehouse...' : 'Track Order ✦'}
            </button>
          </form>

          {errorMsg && (
            <div className={styles.errorBox}>
              <span>⚠️</span>
              <span>{errorMsg}</span>
            </div>
          )}
        </div>

        {/* Results */}
        {orders.length > 0 && (
          <div className={styles.resultsList}>
            {orders.map((ord, idx) => {
              const currentStep = getStepIndex(ord.status)
              const statusPillClass = getStatusPillClass(ord.status)
              const isPickup = ord.deliveryMethod === 'pickup' || (ord.orderNote && ord.orderNote.toLowerCase().includes('pickup'))

              return (
                <div key={idx} className={styles.orderCard}>
                  {/* Order Head */}
                  <div className={styles.orderHead}>
                    <div>
                      <div className={styles.ordIdRow}>
                        <span className={styles.ordId}>{ord.orderId}</span>
                        <button
                          type="button"
                          onClick={() => copyOrderId(ord.orderId)}
                          className={styles.copyBtn}
                          title="Copy Order ID"
                        >
                          {copiedId === ord.orderId ? '✓ Copied' : '📋 Copy'}
                        </button>
                      </div>
                      <h2 className={styles.custName}>{ord.customerName}</h2>
                      <p className={styles.ordDate}>
                        Booked on {new Date(ord.createdAt || Date.now()).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })} at {new Date(ord.createdAt || Date.now()).toLocaleTimeString('en-IN', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>

                    <div className={`${styles.statusPill} ${statusPillClass}`}>
                      <span>●</span>
                      Status: <strong>{(ord.status || 'Confirmed').toUpperCase()}</strong>
                    </div>
                  </div>

                  {/* Dispatch & Fulfillment Banner */}
                  <div className={styles.dispatchBanner}>
                    <div className={styles.dispatchInfo}>
                      <span className={styles.dispatchIcon}>{isPickup ? '🏬' : '🚚'}</span>
                      <div>
                        <div className={styles.dispatchTag}>
                          {isPickup ? 'Store Counter Pickup' : 'Jaipur Express Delivery'}
                        </div>
                        <div style={{ fontSize: '12px', color: '#64748b' }}>
                          {isPickup
                            ? '62, Hawa Mahal Bazar, Near Old Vidhan Sabha, Jaipur'
                            : (ord.addressLine ? `${ord.addressLine}, ${ord.areaJaipur || 'Jaipur'}` : 'Doorstep Dispatch via Safe Transport')}
                        </div>
                      </div>
                    </div>
                    <span className={styles.fulfillmentBadge}>
                      {ord.paymentMethod === 'upi' ? '💳 UPI Prepaid' : '💵 Cash on Fulfillment'}
                    </span>
                  </div>

                  {/* Progress Tracker Bar */}
                  <div className={styles.trackerBar}>
                    {STATUS_STEPS.map((st, sIdx) => {
                      const isPassed = sIdx <= currentStep
                      const isCurrent = sIdx === currentStep
                      return (
                        <div
                          key={st.key}
                          className={`${styles.stepNode} ${isPassed ? styles.stepDone : ''} ${
                            isCurrent ? styles.stepActive : ''
                          }`}
                        >
                          {sIdx > 0 && (
                            <div
                              className={`${styles.connectorLine} ${
                                sIdx <= currentStep ? styles.connectorLineActive : ''
                              }`}
                            />
                          )}
                          <div className={styles.nodeCircle}>{isPassed ? '✓' : sIdx + 1}</div>
                          <div>
                            <span className={styles.stepTitle}>{st.label}</span>
                            <span className={styles.stepDesc}>{st.desc}</span>
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  {/* Order Details Grid */}
                  <div className={styles.detailsGrid}>
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Contact Phone</span>
                      <span className={styles.detailValue}>{ord.customerPhone || 'Not provided'}</span>
                    </div>
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Fulfillment Mode</span>
                      <span className={styles.detailValue}>{isPickup ? 'Showroom Pickup' : 'City Delivery'}</span>
                    </div>
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Total Items</span>
                      <span className={styles.detailValue}>{ord.totalCount || ord.items?.length || 0} Products</span>
                    </div>
                    {ord.orderNote && (
                      <div className={styles.detailItem} style={{ gridColumn: '1 / -1' }}>
                        <span className={styles.detailLabel}>Special Instructions</span>
                        <span className={styles.detailValue} style={{ fontWeight: 400, color: '#475569' }}>
                          {ord.orderNote}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Items summary */}
                  {ord.items && ord.items.length > 0 && (
                    <div className={styles.orderItems}>
                      <div className={styles.itemsHeader}>
                        <span className={styles.itemsLabel}>Order Items ({ord.items.length})</span>
                      </div>
                      <table className={styles.itemsTable}>
                        <thead>
                          <tr>
                            <th>Item Name &amp; Brand</th>
                            <th style={{ textAlign: 'center' }}>Qty</th>
                            <th style={{ textAlign: 'right' }}>Rate</th>
                            <th style={{ textAlign: 'right' }}>Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {ord.items.map((it: any, iIdx: number) => (
                            <tr key={iIdx}>
                              <td>
                                <div className={styles.itemName}>{it.name}</div>
                                <div className={styles.itemBrand}>{it.brand || 'Original Sivakasi'}</div>
                              </td>
                              <td style={{ textAlign: 'center', fontWeight: 600 }}>{it.quantity}</td>
                              <td style={{ textAlign: 'right' }}>₹{Number(it.price || 0).toLocaleString('en-IN')}</td>
                              <td className={styles.itemTotal}>
                                ₹{(Number(it.quantity || 1) * Number(it.price || 0)).toLocaleString('en-IN')}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* Footer & Actions */}
                  <div className={styles.orderFooter}>
                    <div className={styles.totalSummary}>
                      <span>Total Amount Payable:</span>
                      <div className={styles.totalAmount}>
                        ₹{Number(ord.subtotal || 0).toLocaleString('en-IN')}
                      </div>
                      {Number(ord.totalSavings || 0) > 0 && (
                        <div className={styles.savingsBadge}>
                          🎉 Total Festive Savings: ₹{Number(ord.totalSavings).toLocaleString('en-IN')}
                        </div>
                      )}
                    </div>

                    <div className={styles.actionButtons}>
                      <button
                        type="button"
                        onClick={() => printOrderReceipt(ord)}
                        className={styles.btnReceipt}
                        title="Print instant thermal/A4 receipt"
                      >
                        🖨️ Print Receipt
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDownloadPDF(ord)}
                        className={styles.btnPdf}
                        title="Download official PDF invoice document"
                      >
                        📄 Download PDF
                      </button>

                      <a
                        href={getWhatsAppTrackShareUrl(ord)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.btnWhatsApp}
                      >
                        💬 WhatsApp Support
                      </a>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default function TrackOrderPage() {
  return (
    <Suspense fallback={<div style={{ padding: '80px 0', textAlign: 'center' }}>Loading Order Tracking...</div>}>
      <TrackOrderContent />
    </Suspense>
  )
}
