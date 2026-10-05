import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Checkout | 62 Patakha Shop',
  robots: 'noindex, nofollow',
}

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
