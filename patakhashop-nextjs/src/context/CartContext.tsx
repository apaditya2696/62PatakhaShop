'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

export interface CartItem {
  id: string
  name: string
  brand: string
  category?: string
  price: number
  originalPrice: number
  image: string
  quantity: number
}

interface CartContextType {
  cart: CartItem[]
  isDrawerOpen: boolean
  openDrawer: () => void
  closeDrawer: () => void
  addToCart: (product: {
    id: string
    name: string
    brand: string
    category?: string
    price: number
    originalPrice: number
    image: string
  }) => void
  removeFromCart: (id: string) => void
  updateQuantity: (id: string, delta: number) => void
  clearCart: () => void
  totalCount: number
  subtotal: number
  totalSavings: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([])
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('62_patakha_cart')
      if (saved) {
        setCart(JSON.parse(saved))
      }
    } catch {
      // Ignore storage errors
    }
  }, [])

  // Sync to localStorage on update
  useEffect(() => {
    try {
      localStorage.setItem('62_patakha_cart', JSON.stringify(cart))
    } catch {
      // Ignore
    }
  }, [cart])

  const openDrawer = () => setIsDrawerOpen(true)
  const closeDrawer = () => setIsDrawerOpen(false)

  const addToCart = (product: {
    id: string
    name: string
    brand: string
    category?: string
    price: number
    originalPrice: number
    image: string
  }) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id)
      if (existing) {
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      } else {
        return [...prev, { ...product, quantity: 1 }]
      }
    })
    // Drawer intentionally NOT opened here — user opens it manually via basket button
  }

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev =>
      prev
        .map(item => {
          if (item.id === id) {
            const newQty = item.quantity + delta
            return newQty > 0 ? { ...item, quantity: newQty } : null
          }
          return item
        })
        .filter((item): item is CartItem => item !== null)
    )
  }

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id))
  }

  const clearCart = () => setCart([])

  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0)
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const totalSavings = cart.reduce((sum, item) => {
    const orig = item.originalPrice > item.price ? item.originalPrice : item.price
    return sum + (orig - item.price) * item.quantity
  }, 0)

  return (
    <CartContext.Provider
      value={{
        cart,
        isDrawerOpen,
        openDrawer,
        closeDrawer,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalCount,
        subtotal,
        totalSavings,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
