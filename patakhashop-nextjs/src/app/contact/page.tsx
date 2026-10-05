import { Metadata } from 'next'
import ContactClient from './ContactClient'

export const metadata: Metadata = {
  title: 'Contact Us | 62 Patakha Shop Jaipur',
  description:
    'Visit our shop at 62 Hawa Mahal Bazar, Jaipur or contact us on WhatsApp for orders, prices, and celebration guidance.',
  alternates: {
    canonical: '/contact',
  },
}

export default function ContactPage() {
  return <ContactClient />
}

