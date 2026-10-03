import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

export interface OrderPDFItem {
  name: string
  brand?: string
  quantity: number
  price: number
}

export interface OrderPDFData {
  orderId: string
  customerName?: string
  customerPhone?: string
  deliveryMethod?: string
  addressLine?: string
  areaJaipur?: string
  pincode?: string
  paymentMethod?: string
  orderNote?: string
  items: OrderPDFItem[]
  subtotal: number
  deliveryCharge?: number
  grandTotal?: number
  totalSavings?: number
  totalCount?: number
  createdAt?: string
}

export function generateOrderPDF(order: OrderPDFData): jsPDF {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  })

  const pageWidth = doc.internal.pageSize.getWidth()

  // Primary Colors (Warm Charcoal & Gold)
  const CHARCOAL = [28, 26, 23] as [number, number, number]
  const GOLD = [201, 158, 82] as [number, number, number]
  const LIGHT_BG = [251, 248, 242] as [number, number, number]
  const MUTED_TEXT = [110, 105, 95] as [number, number, number]

  // Top Header Gold Banner
  doc.setFillColor(...GOLD)
  doc.rect(0, 0, pageWidth, 5, 'F')

  // Company Header
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(22)
  doc.setTextColor(...CHARCOAL)
  doc.text('62 PATAKHA SHOP', 14, 18)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(...MUTED_TEXT)
  doc.text('SIVAKASI DIRECT FIREWORKS SHOWROOM • ESTD 1964', 14, 23)
  doc.text('62, Hawa Mahal Bazar, Near Old Vidhan Sabha, Jaipur, Rajasthan 302002', 14, 27)
  doc.text('Helpline: +91 85610 05357 | Website: www.62patakhashop.com', 14, 31)

  // Invoice Title Right Aligned
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(14)
  doc.setTextColor(...GOLD)
  doc.text('ORDER INVOICE', pageWidth - 14, 18, { align: 'right' })

  const now = new Date()
  const dateCode = `${String(now.getFullYear()).slice(-2)}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`
  const orderNum = order.orderId || `ORD-${dateCode}-${Math.floor(1000 + Math.random() * 9000)}`
  const orderDate = order.createdAt
    ? new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
    : new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(...CHARCOAL)
  doc.text(`Invoice No: #${orderNum}`, pageWidth - 14, 23, { align: 'right' })
  doc.text(`Date: ${orderDate}`, pageWidth - 14, 27, { align: 'right' })
  doc.text(`Status: CONFIRMED`, pageWidth - 14, 31, { align: 'right' })

  // Decorative Horizontal Divider Line
  doc.setDrawColor(220, 215, 205)
  doc.setLineWidth(0.4)
  doc.line(14, 35, pageWidth - 14, 35)

  // Customer & Fulfillment Information Box
  doc.setFillColor(...LIGHT_BG)
  doc.roundedRect(14, 39, pageWidth - 28, 28, 2, 2, 'F')

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(10)
  doc.setTextColor(...GOLD)
  doc.text('CUSTOMER & FULFILLMENT DETAILS', 18, 45)

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9)
  doc.setTextColor(...CHARCOAL)
  doc.text('Customer Name:', 18, 51)
  doc.text('Phone Number:', 18, 56)
  doc.text('Fulfillment Mode:', 18, 61)

  doc.setFont('helvetica', 'normal')
  doc.text(order.customerName || 'Valued Customer', 50, 51)
  doc.text(order.customerPhone || 'Not provided', 50, 56)

  const isPickup = order.deliveryMethod === 'pickup' || !order.deliveryMethod
  const modeText = isPickup
    ? 'Store Pickup (62 Hawa Mahal Bazar, Jaipur)'
    : 'Jaipur Doorstep Delivery'
  doc.text(modeText, 50, 61)

  doc.setFont('helvetica', 'bold')
  doc.text('Payment Method:', 115, 51)
  doc.text('Address:', 115, 56)

  doc.setFont('helvetica', 'normal')
  const payText = order.paymentMethod === 'upi' ? 'Instant UPI / QR Code' : 'Cash on Delivery / Pickup'
  doc.text(payText, 145, 51)

  const addrText = isPickup
    ? '62 Hawa Mahal Bazar, Jaipur'
    : `${order.addressLine || ''} ${order.areaJaipur || ''} (PIN: ${order.pincode || '302002'})`.trim()
  doc.text(doc.splitTextToSize(addrText, 50), 145, 56)

  // Itemized Products Table
  const tableRows = (order.items || []).map((item, idx) => {
    const brand = item.brand || 'Standard'
    const qty = item.quantity || 1
    const price = item.price || 0
    const total = qty * price
    return [
      String(idx + 1),
      item.name,
      brand,
      String(qty),
      `Rs. ${price.toLocaleString('en-IN')}`,
      `Rs. ${total.toLocaleString('en-IN')}`,
    ]
  })

  autoTable(doc, {
    startY: 72,
    head: [['#', 'Fireworks Item Name', 'Brand', 'Qty', 'Unit Price', 'Total Amount']],
    body: tableRows,
    theme: 'grid',
    headStyles: {
      fillColor: CHARCOAL,
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 9,
      halign: 'left',
    },
    bodyStyles: {
      fontSize: 8.5,
      textColor: [30, 30, 30],
    },
    columnStyles: {
      0: { cellWidth: 10, halign: 'center' },
      1: { cellWidth: 'auto' },
      2: { cellWidth: 28 },
      3: { cellWidth: 15, halign: 'center' },
      4: { cellWidth: 28, halign: 'right' },
      5: { cellWidth: 32, halign: 'right' },
    },
    styles: {
      cellPadding: 2.5,
    },
    margin: { left: 14, right: 14 },
  })

  // Calculation Summary at Bottom Right
  const finalY = (doc as any).lastAutoTable.finalY + 6

  const subtotal = order.subtotal || order.items?.reduce((acc, i) => acc + (i.price * i.quantity), 0) || 0
  const delCharge = order.deliveryCharge || 0
  const grandTotal = order.grandTotal || (subtotal + delCharge)
  const savings = order.totalSavings || 0

  const summaryStartX = pageWidth - 90

  doc.setFillColor(...LIGHT_BG)
  doc.roundedRect(summaryStartX, finalY, 76, savings > 0 ? 32 : 26, 2, 2, 'F')

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(...CHARCOAL)

  doc.text('Subtotal:', summaryStartX + 4, finalY + 6)
  doc.text(`Rs. ${subtotal.toLocaleString('en-IN')}`, summaryStartX + 72, finalY + 6, { align: 'right' })

  if (delCharge > 0) {
    doc.text('Delivery Charge:', summaryStartX + 4, finalY + 11)
    doc.text(`Rs. ${delCharge.toLocaleString('en-IN')}`, summaryStartX + 72, finalY + 11, { align: 'right' })
  } else {
    doc.text('Delivery Fee:', summaryStartX + 4, finalY + 11)
    doc.text('FREE', summaryStartX + 72, finalY + 11, { align: 'right' })
  }

  doc.setDrawColor(200, 195, 185)
  doc.line(summaryStartX + 4, finalY + 14, summaryStartX + 72, finalY + 14)

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(10)
  doc.setTextColor(...CHARCOAL)
  doc.text('Grand Total:', summaryStartX + 4, finalY + 20)
  doc.text(`Rs. ${grandTotal.toLocaleString('en-IN')}`, summaryStartX + 72, finalY + 20, { align: 'right' })

  if (savings > 0) {
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(8.5)
    doc.setTextColor(46, 139, 87) // Forest Green
    doc.text(`Total Discount Savings: Rs. ${savings.toLocaleString('en-IN')}`, summaryStartX + 4, finalY + 26)
  }

  // Footer Note & Verification
  const footerY = Math.max(finalY + 38, doc.internal.pageSize.getHeight() - 25)

  doc.setDrawColor(220, 215, 205)
  doc.line(14, footerY, pageWidth - 14, footerY)

  doc.setFont('helvetica', 'italic')
  doc.setFontSize(8)
  doc.setTextColor(...MUTED_TEXT)
  doc.text('Thank you for ordering with 62 Patakha Shop Jaipur! Safe & Certified Sivakasi Fireworks.', 14, footerY + 5)
  doc.text('Showroom Address: Shop No. 62, Hawa Mahal Bazar, Near Old Vidhan Sabha, Jaipur (RJ) • Helpline: +91 85610 05357', 14, footerY + 9)

  return doc
}
