import type { Metadata, Viewport } from 'next'
import { Outfit, Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import CartDrawer from '@/components/CartDrawer'
import { CartProvider } from '@/context/CartContext'
import { WishlistProvider } from '@/context/WishlistContext'
import MobileBottomBar from '@/components/MobileBottomBar'
import LayoutBody from '@/components/LayoutBody'

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-outfit',
  display: 'swap',
})

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-plus-jakarta',
  display: 'swap',
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
}

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.62patakhashop.com'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: '62 Patakha Shop – Best Fireworks & Crackers Shop in Jaipur | Sivakasi Crackers',
    template: '%s | 62 Patakha Shop Jaipur',
  },
  description:
    'Buy 100% genuine Sivakasi fireworks and green crackers in Jaipur at 62 Patakha Shop. Wholesale prices for Diwali, weddings, corporate events & celebrations since 1964.',
  keywords: [
    'Patakha Shop Jaipur',
    '62 Patakha Shop',
    'Sivakasi Crackers Jaipur',
    'Fireworks Shop Jaipur',
    'Green Crackers Jaipur',
    'Diwali Crackers Wholesale Jaipur',
    'Wedding Fireworks Jaipur',
    'Buy Crackers Online Jaipur',
    'Hawa Mahal Bazar Fireworks',
  ],
  alternates: {
    canonical: './',
  },
  icons: { icon: '/logo-62.png', apple: '/logo-62.png' },
  openGraph: {
    title: '62 Patakha Shop – Best Fireworks & Crackers Shop in Jaipur',
    description:
      'Buy 100% genuine Sivakasi fireworks and green crackers in Jaipur at 62 Patakha Shop. Estd 1964 at Hawa Mahal Bazar.',
    url: siteUrl,
    siteName: '62 Patakha Shop Jaipur',
    images: [
      {
        url: '/shop-front-1.jpg',
        width: 1200,
        height: 630,
        alt: '62 Patakha Shop Hawa Mahal Bazar Storefront Jaipur',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '62 Patakha Shop – Best Fireworks & Crackers Shop in Jaipur',
    description:
      'Buy 100% genuine Sivakasi fireworks and green crackers in Jaipur at 62 Patakha Shop since 1964.',
    images: ['/shop-front-1.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || '',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${outfit.variable} ${plusJakartaSans.variable}`}>
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

