import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase'

const ordersFilePath = path.join(process.cwd(), 'src', 'data', 'orders.json')

function getLocalOrders() {
  try {
    if (!fs.existsSync(ordersFilePath)) return []
    return JSON.parse(fs.readFileSync(ordersFilePath, 'utf-8'))
  } catch {
    return []
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const orderId = searchParams.get('orderId')
  const phone = searchParams.get('phone')

  if (!orderId && !phone) {
    return NextResponse.json({ success: false, error: 'Order ID or Phone number required' }, { status: 400 })
  }

  // 1. Try Supabase if configured
  if (isSupabaseConfigured && supabaseAdmin) {
    let query = supabaseAdmin.from('orders').select('*')
    if (orderId) {
      query = query.ilike('order_id', `%${orderId.trim()}%`)
    } else if (phone) {
      query = query.ilike('customer_phone', `%${phone.trim()}%`)
    }
    const { data } = await query.order('created_at', { ascending: false }).limit(5)
    if (data && data.length > 0) {
      const mapped = data.map(o => ({
        orderId: o.order_id,
        customerName: o.customer_name,
        customerPhone: o.customer_phone,
        status: o.status || 'confirmed',
        subtotal: o.subtotal,
        totalSavings: o.total_savings,
        totalCount: o.total_count,
        items: o.items,
        orderNote: o.order_note,
        createdAt: o.created_at,
        deliveryMethod: o.delivery_method,
        paymentMethod: o.payment_method,
        addressLine: o.address_line,
        areaJaipur: o.area_jaipur,
        pincode: o.pincode,
      }))
      return NextResponse.json({ success: true, orders: mapped })
    }
  }

  // 2. Fallback to local orders.json
  const localOrders = getLocalOrders()
  const matched = localOrders.filter((o: any) => {
    if (orderId && o.orderId && o.orderId.toLowerCase().includes(orderId.trim().toLowerCase())) return true
    if (phone && o.customerPhone && o.customerPhone.includes(phone.trim())) return true
    return false
  })

  if (matched.length > 0) {
    return NextResponse.json({ success: true, orders: matched })
  }

  return NextResponse.json({ success: false, error: 'No matching order found. Please check your Order ID or Phone number.' }, { status: 404 })
}
