import { z } from 'zod'

// ── Order Item Validation Schema ──
export const OrderItemSchema = z.object({
  id: z.string().min(1, 'Product ID is required'),
  name: z.string().min(1, 'Product name is required').max(150),
  brand: z.string().optional().default('Standard'),
  price: z.number().positive('Price must be greater than 0'),
  quantity: z.number().int().min(1, 'Quantity must be at least 1').max(1000, 'Max quantity exceeded')
})

// ── Order Creation Schema ──
export const CreateOrderSchema = z.object({
  customerName: z.string().min(2, 'Customer name must be at least 2 characters').max(100, 'Name too long'),
  customerPhone: z.string().min(10, 'Mobile number must be at least 10 digits').max(15, 'Invalid phone number'),
  orderNote: z.string().max(500, 'Order note too long').optional().default('Counter / Walk-in Customer'),
  deliveryMethod: z.enum(['pickup', 'delivery']).optional().default('pickup'),
  paymentMethod: z.enum(['cash_on_pickup', 'upi', 'card', 'cash']).optional().default('cash_on_pickup'),
  items: z.array(OrderItemSchema).min(1, 'Order must contain at least 1 item')
})

// ── Product Creation Schema ──
export const ProductSchema = z.object({
  name: z.string().min(2, 'Product name is required').max(150),
  brand: z.string().min(1, 'Brand is required').max(100),
  category: z.string().min(1, 'Category is required').max(100),
  tags: z.string().max(250).optional().default(''),
  price: z.number().min(0, 'Price cannot be negative'),
  originalPrice: z.number().min(0, 'Original price cannot be negative').optional(),
  stockQuantity: z.number().int().min(0, 'Stock quantity cannot be negative').default(50),
  inStock: z.boolean().default(true),
  image: z.string().optional().default('/logo-62.png')
})

// ── Lead / Enquiry Schema ──
export const LeadSchema = z.object({
  name: z.string().min(2, 'Name is required').max(100),
  email: z.string().email('Invalid email address').or(z.literal('')).optional(),
  mobile: z.string().min(10, 'Mobile number required').max(15),
  requirement: z.string().min(3, 'Requirement details required').max(1000)
})
