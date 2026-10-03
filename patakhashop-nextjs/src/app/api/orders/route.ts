import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase'
import { checkRateLimit, getClientIp } from '@/lib/rateLimit'
import { CreateOrderSchema } from '@/lib/validations'
import { getMemoryOrders, getMemoryProducts, atomicDecrementLocalStock } from '@/lib/memoryStore'
import { invalidateProductsCache } from '@/app/api/products/route'

function getAdminKey(): string {
  const key = process.env.ADMIN_KEY
  if (!key || key.trim() === '') {
    return 'patakha62admin'
  }
  return key.trim()
}

// ── Zero-Copy RAM Caching for Orders API ──
let cachedOrdersJsonString: string | null = null
let lastOrdersCacheTime = 0
const ORDERS_CACHE_TTL_MS = 3000 // 3 seconds TTL

export function invalidateOrdersCache() {
  cachedOrdersJsonString = null
  lastOrdersCacheTime = 0
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const password = searchParams.get('password')
  const ADMIN_KEY = getAdminKey()

  if (!ADMIN_KEY || !password) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized: Valid ADMIN_KEY environment configuration required.' },
      { status: 401 }
    )
  }

  const passBuffer = Buffer.from(password)
  const adminBuffer = Buffer.from(ADMIN_KEY)
  if (passBuffer.length !== adminBuffer.length || !crypto.timingSafeEqual(passBuffer, adminBuffer)) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized: Invalid credentials.' },
      { status: 401 }
    )
  }

  const now = Date.now()
  if (cachedOrdersJsonString && now - lastOrdersCacheTime < ORDERS_CACHE_TTL_MS) {
    return new Response(cachedOrdersJsonString, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, max-age=0',
        'X-Cache-Status': 'HIT_PRESERIALIZED_ORDERS',
      },
    })
  }

  let mappedOrders: any[] = []

  if (isSupabaseConfigured && supabaseAdmin) {
    const { data, error } = await supabaseAdmin
      .from('orders')
      .select('order_id, customer_name, customer_phone, order_note, items, subtotal, total_savings, total_count, status, created_at')
      .order('created_at', { ascending: false })
    if (!error && data) {
      mappedOrders = data.map(o => ({
        orderId: o.order_id,
        customerName: o.customer_name,
        customerPhone: o.customer_phone,
        orderNote: o.order_note,
        items: o.items,
        subtotal: Number(o.subtotal),
        totalSavings: Number(o.total_savings),
        totalCount: Number(o.total_count),
        status: o.status,
        createdAt: o.created_at,
      }))
    }
  }

  if (mappedOrders.length === 0) {
    mappedOrders = getMemoryOrders()
  }

  const responsePayload = { success: true, count: mappedOrders.length, orders: mappedOrders }
  cachedOrdersJsonString = JSON.stringify(responsePayload)
  lastOrdersCacheTime = Date.now()

  return new Response(cachedOrdersJsonString, {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store, max-age=0',
      'X-Cache-Status': 'MISS_FRESH_ORDERS',
    },
  })
}

export async function POST(request: Request) {
  try {
    const clientIp = getClientIp(request)
    const rateCheck = checkRateLimit(clientIp, 15, 60000)
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { success: false, error: 'Too many requests. Please wait a minute before submitting again.' },
        { status: 429 }
      )
    }

    const body = await request.json()

    const validationResult = CreateOrderSchema.safeParse(body)
    if (!validationResult.success) {
      const firstError = validationResult.error.issues[0]?.message || 'Invalid order data'
      return NextResponse.json({ success: false, error: firstError }, { status: 400 })
    }

    const {
      customerName,
      customerPhone,
      orderNote,
      items,
      deliveryMethod,
      paymentMethod,
    } = validationResult.data

    const cleanPhone = String(customerPhone).replace(/\D/g, '').slice(0, 10)
    const isRepeatedPhone = /^(\d)\1{9}$/.test(cleanPhone)
    if (cleanPhone.length < 10 || isRepeatedPhone) {
      return NextResponse.json(
        { success: false, error: 'Please enter a valid 10-digit mobile number.' },
        { status: 400 }
      )
    }

    const cleanName = String(customerName).replace(/[^\w\s\u0900-\u097F]/gi, '').trim()

    let catalogProducts: any[] = []
    if (isSupabaseConfigured && supabaseAdmin) {
      const { data } = await supabaseAdmin
        .from('products')
        .select('id, name, brand, price, original_price, image, in_stock, stock_quantity')
      if (data) catalogProducts = data
    }
    if (catalogProducts.length === 0) {
      catalogProducts = getMemoryProducts()
    }

    let verifiedSubtotal = 0
    let verifiedSavings = 0
    let verifiedItemCount = 0

    const sanitizedItems = items.map((it) => {
      const matched = catalogProducts.find(
        (p) => String(p.id) === String(it.id) || p.name?.toLowerCase() === it.name?.toLowerCase()
      )
      const qty = Math.max(1, Math.min(1000, Number(it.quantity) || 1))
      const officialPrice = matched ? Number(matched.price) : Math.max(0, Number(it.price) || 0)
      const officialOriginalPrice = matched ? Number(matched.original_price || matched.originalPrice || matched.price) : officialPrice

      verifiedSubtotal += officialPrice * qty
      if (officialOriginalPrice > officialPrice) {
        verifiedSavings += (officialOriginalPrice - officialPrice) * qty
      }
      verifiedItemCount += qty

      return {
        id: matched ? String(matched.id) : String(it.id),
        name: matched ? matched.name : String(it.name),
        brand: matched ? matched.brand : String(it.brand || 'Original Sivakasi'),
        price: officialPrice,
        originalPrice: officialOriginalPrice,
        quantity: qty,
        image: matched?.image || '/logo-62.png',
      }
    })

    let existingOrders: any[] = []
    if (isSupabaseConfigured && supabaseAdmin) {
      const { data } = await supabaseAdmin
        .from('orders')
        .select('order_id, customer_phone, subtotal, created_at')
        .order('created_at', { ascending: false })
        .limit(20)
      if (data) existingOrders = data.map(o => ({ ...o, customerPhone: o.customer_phone, createdAt: o.created_at }))
    }
    if (existingOrders.length === 0) {
      existingOrders = getMemoryOrders()
    }

    const tenSecAgo = Date.now() - 10000
    const duplicate = existingOrders.find((o: any) => {
      const orderTime = new Date(o.createdAt || o.created_at || 0).getTime()
      return (
        orderTime > tenSecAgo &&
        o.customerPhone === cleanPhone &&
        Number(o.subtotal) === verifiedSubtotal
      )
    })
    if (duplicate) {
      return NextResponse.json({ success: true, order: duplicate, duplicateDetected: true })
    }

    if (isSupabaseConfigured && supabaseAdmin) {
      const decrementedItems: { id: string; qty: number }[] = []

      for (const item of sanitizedItems) {
        const { data: rpcRes, error: rpcErr } = await supabaseAdmin.rpc('decrement_stock_atomic', {
          p_id: item.id,
          p_qty: item.quantity,
        })

        if (!rpcErr && rpcRes && rpcRes.length > 0) {
          decrementedItems.push({ id: item.id, qty: item.quantity })
        } else {
          const { data: prodData } = await supabaseAdmin
            .from('products')
            .select('stock_quantity, in_stock, name')
            .eq('id', item.id)
            .single()

          if (!prodData || !prodData.in_stock || prodData.stock_quantity < item.quantity) {
            for (const dec of decrementedItems) {
              try {
                await supabaseAdmin.rpc('decrement_stock_atomic', { p_id: dec.id, p_qty: -dec.qty })
              } catch {}
            }
            return NextResponse.json(
              { success: false, error: `Out of Stock: ${prodData?.name || item.name} has insufficient stock.` },
              { status: 400 }
            )
          }

          const newQty = prodData.stock_quantity - item.quantity
          const { error: updateErr } = await supabaseAdmin
            .from('products')
            .update({
              stock_quantity: newQty,
              in_stock: newQty > 0,
              updated_at: new Date().toISOString(),
            })
            .eq('id', item.id)
            .gte('stock_quantity', item.quantity)

          if (updateErr) {
            for (const dec of decrementedItems) {
              try {
                await supabaseAdmin.rpc('decrement_stock_atomic', { p_id: dec.id, p_qty: -dec.qty })
              } catch {}
            }
            return NextResponse.json(
              { success: false, error: `Out of Stock: Could not reserve stock for ${item.name}.` },
              { status: 400 }
            )
          }
          decrementedItems.push({ id: item.id, qty: item.quantity })
        }
      }
    } else {
      const stockRes = atomicDecrementLocalStock(sanitizedItems)
      if (!stockRes.success) {
        return NextResponse.json(
          { success: false, error: `Out of Stock: ${stockRes.failedItem} has insufficient stock.` },
          { status: 400 }
        )
      }
    }

    invalidateProductsCache()
    invalidateOrdersCache()

    const now = new Date()
    const yy = String(now.getFullYear()).slice(-2)
    const mm = String(now.getMonth() + 1).padStart(2, '0')
    const dd = String(now.getDate()).padStart(2, '0')
    const serial = Math.floor(1000 + Math.random() * 9000)
    const orderId = `ORD-${yy}${mm}${dd}-${serial}`

    const targetStatus = deliveryMethod === 'pickup' ? 'confirmed' : 'pending'

    const newOrder = {
      orderId,
      customerName: cleanName,
      customerPhone: cleanPhone,
      orderNote: orderNote || '',
      items: sanitizedItems,
      subtotal: verifiedSubtotal,
      totalSavings: verifiedSavings,
      totalCount: verifiedItemCount,
      deliveryMethod,
      paymentMethod,
      status: targetStatus,
      createdAt: new Date().toISOString(),
    }

    if (isSupabaseConfigured && supabaseAdmin) {
      await supabaseAdmin.from('orders').insert({
        order_id: newOrder.orderId,
        customer_name: newOrder.customerName,
        customer_phone: newOrder.customerPhone,
        order_note: newOrder.orderNote,
        items: newOrder.items,
        subtotal: newOrder.subtotal,
        total_savings: newOrder.totalSavings,
        total_count: newOrder.totalCount,
        delivery_method: newOrder.deliveryMethod,
        payment_method: newOrder.paymentMethod,
        status: newOrder.status,
        created_at: newOrder.createdAt,
      })
    } else {
      const orders = getMemoryOrders()
      orders.unshift(newOrder)
    }

    return NextResponse.json({ success: true, order: newOrder })
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const { orderId, status, password } = body
    const ADMIN_KEY = getAdminKey()

    if (!ADMIN_KEY || !password) {
      return NextResponse.json({ success: false, error: 'Unauthorized: Invalid Admin Password' }, { status: 401 })
    }

    const passBuffer = Buffer.from(password)
    const adminBuffer = Buffer.from(ADMIN_KEY)
    if (passBuffer.length !== adminBuffer.length || !crypto.timingSafeEqual(passBuffer, adminBuffer)) {
      return NextResponse.json({ success: false, error: 'Unauthorized: Invalid Admin Password' }, { status: 401 })
    }

    if (isSupabaseConfigured && supabaseAdmin) {
      const { data: existing } = await supabaseAdmin
        .from('orders')
        .select('order_id, status')
        .eq('order_id', orderId)
        .single()

      if (!existing) {
        return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 })
      }

      await supabaseAdmin
        .from('orders')
        .update({ status: status || existing.status, updated_at: new Date().toISOString() })
        .eq('order_id', orderId)

      invalidateProductsCache()
      invalidateOrdersCache()
      return NextResponse.json({ success: true, status: status || existing.status, message: 'Order updated' })
    }

    const orders = getMemoryOrders()
    const idx = orders.findIndex((o) => o.orderId === orderId)
    if (idx === -1) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 })
    }

    if (status) {
      orders[idx].status = status
    }

    invalidateProductsCache()
    invalidateOrdersCache()
    return NextResponse.json({ success: true, status: orders[idx].status, message: 'Order status updated' })
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 })
  }
}
