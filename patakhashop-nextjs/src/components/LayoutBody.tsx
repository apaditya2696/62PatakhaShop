'use client'

import React, { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export default function LayoutBody({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdmin = pathname?.startsWith('/admin')

  useEffect(() => {
    if (isAdmin) {
      document.documentElement.style.backgroundColor = '#0A0A0D'
      document.body.style.backgroundColor = '#0A0A0D'
    } else {
      document.documentElement.style.backgroundColor = ''
      document.body.style.backgroundColor = ''
    }
  }, [isAdmin])

  return (
    <main
      style={{
        paddingTop: isAdmin ? 0 : 'var(--nav-height)',
        minHeight: '100dvh',
        background: isAdmin ? '#0A0A0D' : 'var(--bg-primary)',
      }}
    >
      {children}
    </main>
  )
}
