import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Hawa Mahal Heritage Theme Concepts | 62 Patakha Shop Jaipur',
  description: 'Explore visual design concepts for 62 Patakha Shop Jaipur.',
  alternates: {
    canonical: '/themes',
  },
}

export default function ThemesPage() {
  return (
    <main style={{ minHeight: '100vh', background: '#0a001a', color: '#fff', padding: '100px 24px 80px', maxWidth: 1200, margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: 48 }}>
        <span style={{ color: '#FF0090', fontSize: 13, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase' }}>Design Concepts</span>
        <h1 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 900, marginTop: 8, marginBottom: 12 }}>
          Jaipur &amp; Hawa Mahal <span style={{ color: '#FF0090' }}>Heritage Themes</span>
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.75)', maxWidth: 620, margin: '0 auto', fontSize: 16 }}>
          Review the two visual design concepts below and let us know which aesthetic you prefer for 62 Patakha Shop.
        </p>
      </div>

      {/* Option 1 */}
      <section style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,0,144,0.25)', borderRadius: 20, padding: '32px 24px', marginBottom: 48 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 20 }}>
          <div>
            <span style={{ background: '#D96B4F', color: '#fff', padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 800 }}>OPTION 1</span>
            <h2 style={{ fontSize: 24, fontWeight: 800, marginTop: 8 }}>Classic Royal Rajasthani Palace Theme</h2>
          </div>
          <a href="/theme-option-1.jpg" target="_blank" rel="noopener noreferrer" style={{ background: '#FF0090', color: '#fff', padding: '8px 18px', borderRadius: 20, fontSize: 13, fontWeight: 700 }}>
            View Full Size Image ↗
          </a>
        </div>
        <p style={{ color: 'rgba(255,255,255,0.8)', lineHeight: 1.6, marginBottom: 24 }}>
          <strong>Color Palette:</strong> Hawa Mahal terracotta-rose sandstone (#D96B4F), deep royal crimson/maroon, and antique palace gold (#D4AF37).<br />
          <strong>Motifs:</strong> Traditional Rajasthani <em>Jharokha cusped arches</em> framing product cards, jaali lattice accents, and heritage calligraphy.
        </p>
        <div style={{ position: 'relative', width: '100%', aspectRatio: '16 / 9', borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
          <Image
            src="/theme-option-1.jpg"
            alt="Option 1: Classic Royal Palace Theme"
            fill
            style={{ objectFit: 'contain', background: '#000' }}
            priority
          />
        </div>
      </section>

      {/* Option 2 */}
      <section style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,215,0,0.25)', borderRadius: 20, padding: '32px 24px', marginBottom: 48 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 20 }}>
          <div>
            <span style={{ background: '#FFD700', color: '#000', padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 800 }}>OPTION 2</span>
            <h2 style={{ fontSize: 24, fontWeight: 800, marginTop: 8 }}>Midnight Hawa Mahal &amp; Fireworks Theme</h2>
          </div>
          <a href="/theme-option-2.jpg" target="_blank" rel="noopener noreferrer" style={{ background: '#FFD700', color: '#000', padding: '8px 18px', borderRadius: 20, fontSize: 13, fontWeight: 700 }}>
            View Full Size Image ↗
          </a>
        </div>
        <p style={{ color: 'rgba(255,255,255,0.8)', lineHeight: 1.6, marginBottom: 24 }}>
          <strong>Color Palette:</strong> Deep midnight obsidian (#0C0714), luminous Jaipur Pink Neon (#FF3E83), and warm celebration gold.<br />
          <strong>Motifs:</strong> Illuminated nighttime Hawa Mahal glowing under Diwali sky fireworks, dark glassmorphism cards with subtle arch tops.
        </p>
        <div style={{ position: 'relative', width: '100%', aspectRatio: '16 / 9', borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
          <Image
            src="/theme-option-2.jpg"
            alt="Option 2: Midnight Hawa Mahal & Fireworks Theme"
            fill
            style={{ objectFit: 'contain', background: '#000' }}
          />
        </div>
      </section>

      <div style={{ textAlign: 'center', marginTop: 32 }}>
        <Link href="/" style={{ color: '#FF0090', fontWeight: 700, fontSize: 15, textDecoration: 'underline' }}>
          ← Back to Homepage
        </Link>
      </div>
    </main>
  )
}
