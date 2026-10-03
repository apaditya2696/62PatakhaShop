'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'

const SLIDES = [
  { src: '/shop-front-1.webp',           alt: '62 Patakha Shop Entrance – Hawa Mahal Bazar Jaipur' },
  { src: '/shop-products-1.webp',        alt: 'Fancy fireworks collection – Nayabra Falls, Angels' },
  { src: '/shop-customer-entrance.jpg',  alt: 'Customer with celebration fireworks at 62 Patakha Shop' },
  { src: '/shop-products-2.webp',        alt: 'Rockets & aerial shots display' },
  { src: '/shop-products-3.webp',        alt: 'Full firework collection – all brands' },
]

export default function HeroSlideshow() {
  const [cur, setCur] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setCur(c => (c + 1) % SLIDES.length), 4500)
    return () => clearInterval(id)
  }, [])

  return (
    <>
      {SLIDES.map((s, i) => (
        <div
          key={s.src}
          aria-hidden={i !== cur}
          style={{
            position: 'absolute',
            inset: 0,
            opacity: i === cur ? 1 : 0,
            transition: 'opacity 1s ease-in-out',
            zIndex: i === cur ? 1 : 0,
            pointerEvents: 'none',
            willChange: 'opacity',
          }}
        >
          <Image
            src={s.src}
            alt={s.alt}
            fill
            sizes="(max-width: 800px) 100vw, 55vw"
            quality={80}
            priority={i === 0}
            style={{
              objectFit: 'cover',
              objectPosition: 'center',
            }}
          />
        </div>
      ))}

      {/* Slide indicator dots */}
      <div
        style={{
          position: 'absolute',
          bottom: 14,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10,
          display: 'flex',
          gap: 6,
        }}
      >
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCur(i)}
            aria-label={`Slide ${i + 1}`}
            style={{
              width: i === cur ? 20 : 6,
              height: 6,
              borderRadius: 3,
              background: i === cur ? 'var(--pink)' : 'rgba(255,255,255,0.4)',
              border: 'none',
              cursor: 'pointer',
              transition: 'width 0.3s ease, background 0.3s ease',
              padding: 0,
            }}
          />
        ))}
      </div>
    </>
  )
}
