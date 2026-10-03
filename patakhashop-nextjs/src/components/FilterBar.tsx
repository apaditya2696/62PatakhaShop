'use client'

import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react'
import CustomSelect from '@/components/CustomSelect'
import styles from './FilterBar.module.css'

interface FilterBarProps {
  categories: { id: string; label: string; count?: number }[]
  activeCategory: string
  onCategoryChange: (catId: string) => void
  searchQuery: string
  onSearchChange: (q: string) => void
  sortBy: string
  onSortChange: (sort: string) => void
  selectedSize: string
  onSizeChange: (size: string) => void
  brands?: string[]
  selectedBrand?: string
  onBrandChange?: (brand: string) => void
  totalCount: number
}

const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured', icon: '✦' },
  { value: 'price-asc', label: 'Price: Low → High', icon: '↑' },
  { value: 'price-desc', label: 'Price: High → Low', icon: '↓' },
  { value: 'name-asc', label: 'Name: A → Z', icon: 'Aa' },
]

const SIZE_OPTIONS = [
  { value: 'all', label: 'All Sizes', icon: '◈' },
  { value: '1.5', label: '1.5 Inch (Small)', icon: '•' },
  { value: '2', label: '2 Inch (Medium)', icon: '•' },
  { value: '2.5', label: '2.5 Inch (Standard)', icon: '•' },
  { value: '3', label: '3 Inch (Large)', icon: '•' },
  { value: '4', label: '4 Inch (Extra Large)', icon: '•' },
  { value: '5', label: '5 Inch (Jumbo)', icon: '•' },
]

const CHAKKAR_OPTIONS = [
  { value: 'all', label: 'All Chakkars', icon: '◈' },
  { value: '45cm', label: '45 cm', icon: '•' },
  { value: '70cm', label: '70 cm', icon: '•' },
  { value: 'whistling-wheel', label: 'Whistling Wheel', icon: '•' },
  { value: 'nattya-dhara', label: 'Nattya Dhara', icon: '•' },
]

const SHOT_OPTIONS = [
  { value: 'all', label: 'All Shot Counts', icon: '◈' },
  { value: '7', label: '7 Shots', icon: '•' },
  { value: '12', label: '12 Shots', icon: '•' },
  { value: '15', label: '15 Shots', icon: '•' },
  { value: '25', label: '25 Shots', icon: '•' },
  { value: '30', label: '30 Shots', icon: '•' },
  { value: '50', label: '50 Shots', icon: '•' },
  { value: '60', label: '60 Shots', icon: '•' },
  { value: '72', label: '72 Shots', icon: '•' },
  { value: '80', label: '80 Shots', icon: '•' },
  { value: '100', label: '100 Shots', icon: '•' },
  { value: '120', label: '120 Shots', icon: '•' },
  { value: '130', label: '130 Shots', icon: '•' },
  { value: '150', label: '150 Shots', icon: '•' },
  { value: '160', label: '160 Shots', icon: '•' },
  { value: '180', label: '180 Shots', icon: '•' },
  { value: '200', label: '200 Shots', icon: '•' },
  { value: '240', label: '240 Shots', icon: '•' },
  { value: '500', label: '500 Shots', icon: '•' },
  { value: '1000', label: '1000 Shots', icon: '•' },
]

export default function FilterBar({
  categories,
  activeCategory,
  onCategoryChange,
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  selectedSize,
  onSizeChange,
  brands,
  selectedBrand,
  onBrandChange,
  totalCount,
}: FilterBarProps) {
  const brandOptions = useMemo(() => {
    if (!brands || brands.length === 0) return []
    return [
      { value: 'all', label: 'All Brands', icon: '◈' },
      ...brands.map(b => ({ value: b, label: b, icon: '•' }))
    ]
  }, [brands])
  const railRef = useRef<HTMLDivElement>(null)
  const isDragging = useRef(false)
  const startX = useRef(0)
  const scrollLeftStart = useRef(0)
  const hasMoved = useRef(false)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const checkScroll = useCallback(() => {
    const el = railRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 6)
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 6)
  }, [])

  useEffect(() => {
    const el = railRef.current
    if (!el) return

    // Convert mouse wheel to smooth horizontal scroll
    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY !== 0) {
        if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
          el.scrollLeft += e.deltaY * 1.2
          e.preventDefault()
          checkScroll()
        }
      }
    }

    let resizeRaf: number | null = null
    const handleResize = () => {
      if (resizeRaf) cancelAnimationFrame(resizeRaf)
      resizeRaf = requestAnimationFrame(() => {
        checkScroll()
      })
    }

    el.addEventListener('wheel', handleWheel, { passive: false })
    el.addEventListener('scroll', checkScroll, { passive: true })
    window.addEventListener('resize', handleResize)
    checkScroll()

    return () => {
      if (resizeRaf) cancelAnimationFrame(resizeRaf)
      el.removeEventListener('wheel', handleWheel)
      el.removeEventListener('scroll', checkScroll)
      window.removeEventListener('resize', handleResize)
    }
  }, [checkScroll])

  // Scroll active category into view
  useEffect(() => {
    const el = railRef.current
    if (!el) return
    const activeBtn = el.querySelector<HTMLButtonElement>(`.${styles.pillBtnActive}`)
    if (activeBtn) {
      activeBtn.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
    }
    setTimeout(checkScroll, 350)
  }, [activeCategory, checkScroll])

  // Mouse Drag to Swipe Left/Right
  const handleMouseDown = (e: React.MouseEvent) => {
    const el = railRef.current
    if (!el) return
    isDragging.current = true
    hasMoved.current = false
    startX.current = e.pageX - el.offsetLeft
    scrollLeftStart.current = el.scrollLeft
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return
    const el = railRef.current
    if (!el) return
    const x = e.pageX - el.offsetLeft
    const walk = (x - startX.current) * 1.5
    if (Math.abs(walk) > 5) {
      hasMoved.current = true
    }
    el.scrollLeft = scrollLeftStart.current - walk
    checkScroll()
  }

  const handleMouseUpOrLeave = () => {
    isDragging.current = false
  }

  const handlePillClick = (catId: string) => {
    if (hasMoved.current) {
      return // Was a drag/swipe, ignore click
    }
    onCategoryChange(catId)
  }

  const handleArrowScroll = (direction: 'left' | 'right') => {
    const el = railRef.current
    if (!el) return
    const amount = direction === 'left' ? -280 : 280
    el.scrollBy({ left: amount, behavior: 'smooth' })
  }

  return (
    <div className={styles.stickyBar}>
      <div className="editorial-container">
        <div className={styles.barInner}>
          {/* Search Input */}
          <div className={styles.searchWrapper}>
            <span className={styles.searchIcon}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search fireworks, brands or types..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className={styles.searchInput}
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className={styles.clearSearchBtn}
                aria-label="Clear search query"
              >
                ✕
              </button>
            )}
          </div>

          {/* Filters & Sort Controls */}
          <div className={styles.controlsRow}>
            {activeCategory === 'skyshots' && (
              <div className={styles.selectWrap}>
                <CustomSelect
                  value={selectedSize}
                  onChange={onSizeChange}
                  options={SIZE_OPTIONS}
                  variant="shop"
                  ariaLabel="Filter by size"
                />
              </div>
            )}

            {activeCategory === 'chakkar' && (
              <div className={styles.selectWrap}>
                <CustomSelect
                  value={selectedSize}
                  onChange={onSizeChange}
                  options={CHAKKAR_OPTIONS}
                  variant="shop"
                  ariaLabel="Filter by chakkar type or size"
                />
              </div>
            )}

            {(activeCategory === 'aerial cakes' || activeCategory === 'aerial-cakes') && (
              <div className={styles.selectWrap}>
                <CustomSelect
                  value={selectedSize}
                  onChange={onSizeChange}
                  options={SHOT_OPTIONS}
                  variant="shop"
                  ariaLabel="Filter by shot count"
                />
              </div>
            )}

            {brandOptions.length > 0 && selectedBrand !== undefined && onBrandChange && (
              <div className={styles.selectWrap}>
                <CustomSelect
                  value={selectedBrand}
                  onChange={onBrandChange}
                  options={brandOptions}
                  variant="shop"
                  ariaLabel="Filter catalog by brand"
                />
              </div>
            )}

            <div className={styles.selectWrap}>
              <CustomSelect
                value={sortBy}
                onChange={onSortChange}
                options={SORT_OPTIONS}
                variant="shop"
                ariaLabel="Sort catalog items"
              />
            </div>

            <div className={styles.countBadge}>
              <span>{totalCount} Items</span>
            </div>
          </div>
        </div>

        {/* Category Filter Pills Rail with Swiping & Arrow Controls */}
        <div className={styles.pillsContainer}>
          {canScrollLeft && (
            <button
              onClick={() => handleArrowScroll('left')}
              className={`${styles.arrowBtn} ${styles.arrowLeft}`}
              aria-label="Scroll categories left"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
          )}

          <div
            ref={railRef}
            className={styles.pillsRail}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUpOrLeave}
            onMouseLeave={handleMouseUpOrLeave}
          >
            {categories.map((cat) => {
              const isActive = activeCategory === cat.id
              return (
                <button
                  key={cat.id}
                  onClick={() => handlePillClick(cat.id)}
                  className={`${styles.pillBtn} ${isActive ? styles.pillBtnActive : ''}`}
                >
                  <span>{cat.label}</span>
                  {cat.count !== undefined && (
                    <span className={styles.pillCount}>{cat.count}</span>
                  )}
                </button>
              )
            })}
          </div>

          {canScrollRight && (
            <button
              onClick={() => handleArrowScroll('right')}
              className={`${styles.arrowBtn} ${styles.arrowRight}`}
              aria-label="Scroll categories right"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
