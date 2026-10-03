import fs from 'fs'
import path from 'path'

export interface ProductItem {
  id: string
  sno: number
  name: string
  brand: string
  category: string
  tags: string
  price: number
  originalPrice: number
  discount: string
  inStock: boolean
  stockQuantity: number
  image: string
}

export interface OrderItem {
  id: string
  name: string
  brand?: string
  price: number
  originalPrice?: number
  quantity: number
  image?: string
}

export interface Order {
  orderId: string
  customerName: string
  customerPhone: string
  orderNote: string
  items: OrderItem[]
  subtotal: number
  totalSavings: number
  totalCount: number
  deliveryMethod: string
  paymentMethod: string
  addressLine?: string
  areaJaipur?: string
  pincode?: string
  status: string
  createdAt: string
}

export interface Lead {
  id: string
  name: string
  email: string
  mobile: string
  requirement: string
  status: string
  createdAt: string
}

const productsFilePath = path.join(process.cwd(), 'src', 'data', 'products.json')
const ordersFilePath = path.join(process.cwd(), 'src', 'data', 'orders.json')
const leadsFilePath = path.join(process.cwd(), 'src', 'data', 'leads.json')

let memoryProducts: ProductItem[] | null = null
let memoryOrders: Order[] | null = null
let memoryLeads: Lead[] | null = null

export function getMemoryProducts(): ProductItem[] {
  if (!memoryProducts) {
    try {
      if (fs.existsSync(productsFilePath)) {
        const raw = fs.readFileSync(productsFilePath, 'utf-8')
        memoryProducts = JSON.parse(raw).map((p: any) => ({
          ...p,
          id: String(p.id),
          stockQuantity: p.stockQuantity !== undefined ? Number(p.stockQuantity) : (p.inStock ? 50 : 0),
          inStock: p.inStock !== undefined ? Boolean(p.inStock) : true,
        }))
      } else {
        memoryProducts = []
      }
    } catch {
      memoryProducts = []
    }
  }
  return memoryProducts || []
}

export function getMemoryOrders(): Order[] {
  if (!memoryOrders) {
    try {
      if (fs.existsSync(ordersFilePath)) {
        const raw = fs.readFileSync(ordersFilePath, 'utf-8')
        memoryOrders = JSON.parse(raw)
      } else {
        memoryOrders = []
      }
    } catch {
      memoryOrders = []
    }
  }
  return memoryOrders || []
}

export function getMemoryLeads(): Lead[] {
  if (!memoryLeads) {
    try {
      if (fs.existsSync(leadsFilePath)) {
        const raw = fs.readFileSync(leadsFilePath, 'utf-8')
        memoryLeads = JSON.parse(raw)
      } else {
        memoryLeads = []
      }
    } catch {
      memoryLeads = []
    }
  }
  return memoryLeads || []
}

/**
 * Atomic stock decrement in local memory fallback mode.
 * Returns { success: true } if stock was successfully reserved for all items,
 * or { success: false, failedItem: string } if stock was insufficient.
 */
export function atomicDecrementLocalStock(items: { id: string; quantity: number; name?: string }[]): { success: boolean; failedItem?: string } {
  const prods = getMemoryProducts()

  // 1. Verify all items have sufficient stock
  for (const item of items) {
    const matched = prods.find(p => p.id === String(item.id))
    if (!matched) {
      continue
    }
    if (!matched.inStock || matched.stockQuantity < item.quantity) {
      return { success: false, failedItem: matched.name || item.name || item.id }
    }
  }

  // 2. Perform atomic decrements
  for (const item of items) {
    const matched = prods.find(p => p.id === String(item.id))
    if (matched) {
      matched.stockQuantity = Math.max(0, matched.stockQuantity - item.quantity)
      if (matched.stockQuantity <= 0) {
        matched.inStock = false
      }
    }
  }

  return { success: true }
}
