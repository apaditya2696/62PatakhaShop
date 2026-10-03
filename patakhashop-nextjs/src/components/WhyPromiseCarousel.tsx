'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import styles from './WhyPromiseCarousel.module.css'

interface PromiseItem {
  id: string
  title: string
  desc: string
}

const PROMISE_ITEMS: PromiseItem[] = [
  {
    id: 'trust',
    title: '60+ Years of Trust',
    desc: 'Jaipur’s trusted fireworks shop for over 60 years. Generations of families trust us for every Diwali and wedding.',
  },
  {
    id: 'collection',
    title: 'Biggest Variety',
    desc: 'From affordable sparklers and anars to big sky shot boxes. Over 500+ items ready for every celebration.',
  },
  {
    id: 'brands',
    title: 'Top Brands Only',
    desc: 'Authorized seller for Cock Brand, Sony, Sunshine, Vinayaga, Cornation and all top Sivakasi brands.',
  },
  {
    id: 'sivakasi',
    title: 'Direct Sivakasi Stock',
    desc: 'Fresh direct stock from Sivakasi factories with bright lights, loud sound and 100% original quality.',
  },
]

// 3 sets for seamless infinite loop (clones before and after)
const TRIPLED_ITEMS = [...PROMISE_ITEMS, ...PROMISE_ITEMS, ...PROMISE_ITEMS]
const BASE_COUNT = PROMISE_ITEMS.length
const START_INDEX = BASE_COUNT // Start at middle set (index 4)

export default function WhyPromiseCarousel() {
  const [currentIndex, setCurrentIndex] = useState(START_INDEX)
  const [isTransitioning, setIsTransitioning] = useState(true)
  const [translateX, setTranslateX] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState(0)

  const containerRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const autoPlayTimer = useRef<NodeJS.Timeout | null>(null)
  const dragStartX = useRef<number | null>(null)
  const isInteracting = useRef(false)

  // Calculate translation so that card at currentIndex is centered in the container
  const updatePosition = useCallback((targetIndex: number) => {
    const container = containerRef.current
    const track = trackRef.current
    if (!container || !track) return

    const cards = track.children
    const targetCard = cards[targetIndex] as HTMLElement | undefined
    if (!targetCard) return

    const containerWidth = container.offsetWidth
    const cardCenter = targetCard.offsetLeft + targetCard.offsetWidth / 2
    const targetTranslate = containerWidth / 2 - cardCenter
    setTranslateX(targetTranslate)
  }, [])

  // Update position whenever currentIndex changes or on window resize
  useEffect(() => {
    updatePosition(currentIndex)

    const handleResize = () => {
      updatePosition(currentIndex)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [currentIndex, updatePosition])

  // Move to next card
  const nextSlide = useCallback(() => {
    setIsTransitioning(true)
    setCurrentIndex((prev) => prev + 1)
  }, [])

  // Move to prev card
  const prevSlide = useCallback(() => {
    setIsTransitioning(true)
    setCurrentIndex((prev) => prev - 1)
  }, [])

  // Handle transition end for seamless infinite loop
  const handleTransitionEnd = useCallback(() => {
    // If reached 3rd set, silently jump back to 2nd set (middle)
    if (currentIndex >= BASE_COUNT * 2) {
      setIsTransitioning(false)
      const normalized = START_INDEX + (currentIndex % BASE_COUNT)
      setCurrentIndex(normalized)
    }
    // If reached 1st set, silently jump forward to 2nd set (middle)
    else if (currentIndex < BASE_COUNT) {
      setIsTransitioning(false)
      const normalized = START_INDEX + (currentIndex % BASE_COUNT)
      setCurrentIndex(normalized)
    }
  }, [currentIndex])

  // Auto-play horizontal slideshow loop
  useEffect(() => {
    if (isDragging) return

    const intervalTime = 2800 // 2.8 seconds between slides

    autoPlayTimer.current = setInterval(() => {
      if (!isInteracting.current) {
        nextSlide()
      }
    }, intervalTime)

    return () => {
      if (autoPlayTimer.current) clearInterval(autoPlayTimer.current)
    }
  }, [nextSlide, isDragging])

  // Touch and Mouse Drag Support
  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    isInteracting.current = true
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
    dragStartX.current = clientX
    setIsDragging(true)
    setDragOffset(0)
  }

  const handleTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDragging || dragStartX.current === null) return
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
    const diff = clientX - dragStartX.current
    setDragOffset(diff)
  }

  const handleTouchEnd = () => {
    if (!isDragging || dragStartX.current === null) return
    setIsDragging(false)

    // Threshold of 45px to trigger slide change
    if (dragOffset < -45) {
      nextSlide()
    } else if (dragOffset > 45) {
      prevSlide()
    }

    setDragOffset(0)
    dragStartX.current = null

    // Resume auto-slideshow after 2.5s
    setTimeout(() => {
      isInteracting.current = false
    }, 2500)
  }

  return (
    <div
      ref={containerRef}
      className={styles.carouselContainer}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleTouchStart}
      onMouseMove={handleTouchMove}
      onMouseUp={handleTouchEnd}
      onMouseLeave={handleTouchEnd}
    >
      {/* Sliding Track */}
      <div
        ref={trackRef}
        className={styles.track}
        style={{
          transform: `translate3d(${translateX + dragOffset}px, 0, 0)`,
          transition: isTransitioning && !isDragging ? 'transform 0.65s cubic-bezier(0.22, 1, 0.36, 1)' : 'none',
        }}
        onTransitionEnd={handleTransitionEnd}
      >
        {TRIPLED_ITEMS.map((item, idx) => {
          const isCurrent = idx === currentIndex
          return (
            <div
              key={`${item.id}-${idx}`}
              className={`${styles.card} ${isCurrent ? styles.cardActive : ''}`}
              onClick={() => {
                if (Math.abs(dragOffset) < 5) {
                  setIsTransitioning(true)
                  setCurrentIndex(idx)
                }
              }}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  setIsTransitioning(true)
                  setCurrentIndex(idx)
                }
              }}
              aria-label={item.title}
            >
              <h3 className={styles.cardTitle}>{item.title}</h3>
              <p className={styles.cardDesc}>{item.desc}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}


