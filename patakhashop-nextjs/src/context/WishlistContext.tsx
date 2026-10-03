'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

export interface WishlistItem {
  id: string
  name: string
  brand: string
  category?: string
  price: number
  originalPrice: number
  image: string
}

interface WishlistContextType {
  wishlist: WishlistItem[]
  isInWishlist: (id: string) => boolean
  toggleWishlist: (item: WishlistItem) => void
  removeFromWishlist: (id: string) => void
  clearWishlist: () => void
  wishlistCount: number
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([])

  useEffect(() => {
    try {
      const saved = localStorage.getItem('62_patakha_wishlist')
      if (saved) {
        setWishlist(JSON.parse(saved))
      }
    } catch {
      // Ignore storage errors
    }
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem('62_patakha_wishlist', JSON.stringify(wishlist))
    } catch {
      // Ignore
    }
  }, [wishlist])

  const isInWishlist = (id: string) => wishlist.some(item => String(item.id) === String(id))

  const toggleWishlist = (item: WishlistItem) => {
    setWishlist(prev => {
      const exists = prev.some(i => String(i.id) === String(item.id))
      if (exists) {
        return prev.filter(i => String(i.id) !== String(item.id))
      } else {
        return [...prev, item]
      }
    })
  }

  const removeFromWishlist = (id: string) => {
    setWishlist(prev => prev.filter(item => String(item.id) !== String(id)))
  }

  const clearWishlist = () => setWishlist([])

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        isInWishlist,
        toggleWishlist,
        removeFromWishlist,
        clearWishlist,
        wishlistCount: wishlist.length,
      }}
    >
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider')
  }
  return context
}
