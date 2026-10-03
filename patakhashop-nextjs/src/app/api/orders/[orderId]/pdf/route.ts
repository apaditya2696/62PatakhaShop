import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase'
import { generateOrderPDF, OrderPDFData } from '@/lib/pdfGenerator'

const ordersFilePath = path.join(process.cwd(), 'src', 'data', 'orders.json')

function getLocalOrders() {
  try {
    if (!fs.existsSync(ordersFilePath)) return []
    return JSON.parse(fs.readFileSync(ordersFilePath, 'utf-8'))
  } catch {
    return []
  }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const resolvedParams = await params
    const orderId = resolvedParams.orderId

    if (!orderId) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 })
    }

    let orderData: OrderPDFData | null = null

    // 1. Check Supabase Database
    if (isSupabaseConfigured && supabaseAdmin) {
      const { data } = await supabaseAdmin
        .from('orders')
        .select('*')
        .eq('order_id', orderId)
        .single()

      if (data) {
        orderData = {
          orderId: data.order_id,
          customerName: data.customer_name,
          customerPhone: data.customer_phone,
          orderNote: data.order_note,
          items: data.items || [],
          subtotal: Number(data.subtotal) || 0,
          totalSavings: Number(data.total_savings) || 0,
          totalCount: Number(data.total_count) || 0,
          createdAt: data.created_at,
        }
      }
    }

    // 2. Check local JSON fallback if not found in Supabase
    if (!orderData) {
      const localOrders = getLocalOrders()
      const found = localOrders.find((o: any) => o.orderId === orderId || o.order_id === orderId)
      if (found) {
        orderData = {
          orderId: found.orderId || found.order_id,
          customerName: found.customerName || found.customer_name,
          customerPhone: found.customerPhone || found.customer_phone,
          deliveryMethod: found.deliveryMethod,
          addressLine: found.addressLine,
          areaJaipur: found.areaJaipur,
          pincode: found.pincode,
          paymentMethod: found.paymentMethod,
          orderNote: found.orderNote || found.order_note,
          items: found.items || [],
          subtotal: Number(found.subtotal) || 0,
          deliveryCharge: Number(found.deliveryCharge) || 0,
          grandTotal: Number(found.grandTotal) || Number(found.subtotal) || 0,
          totalSavings: Number(found.totalSavings) || 0,
          totalCount: Number(found.totalCount) || 0,
          createdAt: found.createdAt || found.created_at,
        }
      }
    }

    if (!orderData) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    const pdfDoc = generateOrderPDF(orderData)
    const pdfBuffer = pdfDoc.output('arraybuffer')

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="Invoice-${orderId}.pdf"`,
        'Cache-Control': 'no-cache',
      },
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to generate PDF invoice', details: error?.message },
      { status: 500 }
    )
  }
}
