import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Order Confirmation | 62 Patakha Shop',
  robots: 'noindex, nofollow',
}

export default function OrderSuccessLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
