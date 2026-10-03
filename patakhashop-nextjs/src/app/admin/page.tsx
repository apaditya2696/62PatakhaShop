import { Metadata } from 'next'
import AdminClient from './AdminClient'

export const metadata: Metadata = {
  title: 'Admin Stock & Price Portal | 62 Patakha Shop',
  robots: 'noindex, nofollow',
}

export default function AdminPage() {
  return <AdminClient />
}
