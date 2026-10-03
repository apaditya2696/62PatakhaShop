import type { Metadata, Viewport } from 'next'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import CartDrawer from '@/components/CartDrawer'
import { CartProvider } from '@/context/CartContext'
import { WishlistProvider } from '@/context/WishlistContext'

import MobileBottomBar from '@/components/MobileBottomBar'
import LayoutBody from '@/components/LayoutBody'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
}

export const metadata: Metadata = {
  title: '62 Patakha Shop – Jaipur Fireworks & Crackers Store',
  description:
    'Shop genuine Sivakasi fireworks and crackers in Jaipur at 62 Patakha Shop. Best prices for Diwali, weddings, parties, and celebrations since 1964.',
  icons: { icon: '/logo-62.png' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <CartProvider>
          <WishlistProvider>
            <Navbar />
            <LayoutBody>{children}</LayoutBody>
            <MobileBottomBar />
            <CartDrawer />
            <Footer />
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  )
}
