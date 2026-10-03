import type { Metadata } from 'next'
import { CartProvider } from '@/context/CartContext'
import '../globals.css'

export const metadata: Metadata = {
  title: 'Admin Panel | 62 Patakha Shop',
  robots: 'noindex, nofollow',
}

/**
 * Dedicated admin layout — intentionally excludes the public-facing
 * Navbar, Footer, CartDrawer and padding-top so the admin dashboard
 * renders full-screen without any shop chrome on top.
 */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      {children}
    </CartProvider>
  )
}
