'use client'

import React, { useState, useMemo, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '@/context/CartContext'
import styles from './ShopClient.module.css'

export interface Product {
  id: string
  sno: number
  name: string
  brand: string
  category: string
  tags: string
  price: number
  originalPrice: number
  discount: string
  inStock: boolean
  image: string
}

import { CATEGORY_CARDS, type CategoryCardInfo } from '@/data/categories'
export { CATEGORY_CARDS, type CategoryCardInfo }
import CategoryAnimation from '@/components/CategoryAnimation'
import { useRouter } from 'next/navigation'
import CustomSelect from '@/components/CustomSelect'

const SIZE_OPTIONS = [
  { value: 'all', label: 'All Sizes (Inch)' },
  { value: '1.5', label: '1.5″ Inch' },
  { value: '2', label: '2″ Inch' },
  { value: '2.5', label: '2.5″ Inch' },
  { value: '3', label: '3″ Inch' },
  { value: '3.5', label: '3.5″ Inch' },
  { value: '4', label: '4″ Inch' },
  { value: '4.5', label: '4.5″ Inch' },
  { value: '5', label: '5″ Inch' },
]

const SHOT_OPTIONS = [
  { value: 'all', label: 'All Shot Counts' },
  { value: '7', label: '7 Shots' },
  { value: '12', label: '12 Shots' },
  { value: '15', label: '15 Shots' },
  { value: '25', label: '25 Shots' },
  { value: '30', label: '30 Shots' },
  { value: '50', label: '50 Shots' },
  { value: '60', label: '60 Shots' },
  { value: '72', label: '72 Shots' },
  { value: '80', label: '80 Shots' },
  { value: '100', label: '100 Shots' },
  { value: '120', label: '120 Shots' },
  { value: '130', label: '130 Shots' },
  { value: '150', label: '150 Shots' },
  { value: '160', label: '160 Shots' },
  { value: '180', label: '180 Shots' },
  { value: '200', label: '200 Shots' },
  { value: '240', label: '240 Shots' },
  { value: '500', label: '500 Shots' },
  { value: '1000', label: '1000 Shots' },
]

function matchesSize(productName: string, size: string): boolean {
  if (size === 'all') return true
  const name = productName.toLowerCase()
  if (size === '1.5') {
    return name.includes('1.5″') || name.includes('1.5"') || name.includes('1.5 inch') || name.includes('1.5-inch') || name.includes('1½') || name.includes('1.5 in')
  }
  if (size === '2') {
    return (name.includes('2″') || name.includes('2"') || name.includes('2 inch') || name.includes('2-inch') || name.includes('2 in ') || name.includes('2in')) && !name.includes('2.5') && !name.includes('2½')
  }
  if (size === '2.5') {
    return name.includes('2.5″') || name.includes('2.5"') || name.includes('2.5 inch') || name.includes('2.5-inch') || name.includes('2½') || name.includes('2.5 in')
  }
  if (size === '3') {
    return (name.includes('3″') || name.includes('3"') || name.includes('3 inch') || name.includes('3-inch') || name.includes('3 in ') || name.includes('3in')) && !name.includes('3.5') && !name.includes('3½')
  }
  if (size === '3.5') {
    return name.includes('3.5″') || name.includes('3.5"') || name.includes('3.5 inch') || name.includes('3.5-inch') || name.includes('3½') || name.includes('3.5 in')
  }
  if (size === '4') {
    return (name.includes('4″') || name.includes('4"') || name.includes('4 inch') || name.includes('4-inch') || name.includes('4 in ') || name.includes('4in')) && !name.includes('4.5') && !name.includes('4½')
  }
  if (size === '4.5') {
    return name.includes('4.5″') || name.includes('4.5"') || name.includes('4.5 inch') || name.includes('4.5-inch') || name.includes('4½') || name.includes('4.5 in')
  }
  if (size === '5') {
    return name.includes('5″') || name.includes('5"') || name.includes('5 inch') || name.includes('5-inch') || name.includes('5 in ')
  }
  return false
}

function matchesShots(product: Product, shots: string): boolean {
  if (shots === 'all') return true
  const name = product.name.toLowerCase()
  const tags = (product.tags || '').toLowerCase()
  const text = `${name} ${tags}`

  if (new RegExp(`\\b${shots}\\s*(shot|shots|sh\\b)`, 'i').test(text)) return true
  if (text.includes(`${shots} shot`) || text.includes(`${shots}shot`)) return true

  return false
}

function matchesCategory(product: Product, category: string): boolean {
  if (!category || category === 'all') return true
  const c = category.toLowerCase().trim().replace(/-/g, ' ')
  const pc = (product.category || '').toLowerCase().trim().replace(/-/g, ' ')

  const normalize = (cat: string) => {
    if (cat === 'aerial cakes' || cat === 'aerial-cakes' || cat === 'multishot cakes') return 'aerial cakes'
    if (cat === 'skyshots' || cat === 'sky shots' || cat === 'shells') return 'skyshots'
    if (cat === 'flowerpots' || cat === 'flower pots' || cat === 'flower pot' || cat === 'anars') return 'flowerpots'
    if (cat === 'crackers' || cat === 'sound crackers' || cat === 'lar') return 'crackers'
    if (cat === 'bombs' || cat === 'bomb') return 'bombs'
    if (cat === 'sparklers' || cat === 'sparkler' || cat === 'phuljhadi') return 'sparklers'
    if (cat === 'chakkar' || cat === 'chakkars' || cat === 'spinners') return 'chakkar'
    if (cat === 'torches' || cat === 'torch' || cat === 'candles') return 'torches'
    if (cat === 'rockets' || cat === 'rocket') return 'rockets'
    if (cat === 'kids special' || cat === 'kids-special' || cat === 'kids' || cat === 'family-friendly') return 'kids special'
    return cat
  }

  return normalize(pc) === normalize(c)
}

export default function ShopClient({
  initialProducts,
  defaultCategory = 'all',
  pageTitle,
  isCategoryPage = false,
  categoryInfo,
}: {
  initialProducts: Product[]
  defaultCategory?: string
  pageTitle?: string
  isCategoryPage?: boolean
  categoryInfo?: CategoryCardInfo
}) {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [selectedCategory, setSelectedCategory] = useState<string>(defaultCategory)
  const [selectedBrand, setSelectedBrand] = useState<string>('all')
  const [selectedSize, setSelectedSize] = useState<string>('all')
  const [selectedShots, setSelectedShots] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [sortBy, setSortBy] = useState<'featured' | 'price_low' | 'price_high' | 'discount'>('featured')
  const [detailProduct, setDetailProduct] = useState<Product | null>(null)

  const { addToCart, openDrawer } = useCart()
  const [toastVisible, setToastVisible] = useState(false)
  const [toastName, setToastName] = useState('')
  const toastTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  const shopContainerRef = React.useRef<HTMLDivElement>(null)
  const isFirstRender = React.useRef(true)

  const scrollToShopTop = React.useCallback(() => {
    if (shopContainerRef.current) {
      const topOffset = shopContainerRef.current.getBoundingClientRect().top + window.scrollY - 80
      window.scrollTo({ top: Math.max(0, topOffset), behavior: 'smooth' })
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [])

  // Auto-scroll to top when category or size/shot filters change
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    scrollToShopTop()
  }, [selectedCategory, selectedSize, selectedShots, scrollToShopTop])

  function handleAddToCart(product: Product) {
    addToCart(product)
    setToastName(product.name)
    setToastVisible(true)
    if (toastTimer.current) clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToastVisible(false), 2200)
  }

  // Sync defaultCategory prop if it changes and reset category-specific filters
  useEffect(() => {
    setSelectedCategory(defaultCategory)
    setSelectedBrand('all')
    setSelectedSize('all')
    setSelectedShots('all')
  }, [defaultCategory])

  const handleCategorySelect = (catId: string) => {
    setSelectedCategory(catId)
    setSelectedBrand('all')
    setSelectedSize('all')
    setSelectedShots('all')
  }

  // Only fetch client-side if initialProducts was not passed or is empty
  useEffect(() => {
    if (initialProducts && initialProducts.length > 0) return
    async function loadFreshProducts() {
      try {
        const res = await fetch('/api/products')
        const json = await res.json()
        if (json.success && json.products) {
          setProducts(json.products)
        }
      } catch {
        // Keep initialProducts
      }
    }
    loadFreshProducts()
  }, [initialProducts])

  const activeCategoryMeta = CATEGORY_CARDS.find(c => c.id === selectedCategory) || CATEGORY_CARDS[0]

  const isSkyShotCategory =
    selectedCategory === 'skyshots' ||
    selectedCategory === 'sky shots' ||
    activeCategoryMeta.slug === 'skyshots'

  const isAerialCakeCategory =
    selectedCategory === 'aerial cakes' ||
    selectedCategory === 'aerial-cakes' ||
    activeCategoryMeta.slug === 'aerial-cakes'

  // Context-aware list of brands for current selected category
  const brands = useMemo(() => {
    const catProducts = selectedCategory === 'all'
      ? products
      : products.filter(p => matchesCategory(p, selectedCategory))
    const list = Array.from(new Set(catProducts.map(p => p.brand).filter(Boolean)))
    return list.sort()
  }, [products, selectedCategory])

  const deferredSearchQuery = React.useDeferredValue(searchQuery)

  // Filtered & Sorted list - AUTOMATICALLY REMOVES OUT OF STOCK FROM SHOP
  const filteredProducts = useMemo(() => {
    return products
      .filter(p => {
        // Automatically hide out-of-stock items from customer view (managed via Admin panel)
        if (!p.inStock) {
          return false
        }

        // Search query
        if (deferredSearchQuery.trim()) {
          const q = deferredSearchQuery.toLowerCase().trim()
          const matchesName = p.name.toLowerCase().includes(q)
          const matchesBrand = p.brand.toLowerCase().includes(q)
          const matchesCategory = p.category.toLowerCase().includes(q)
          const matchesTags = p.tags.toLowerCase().includes(q)
          if (!matchesName && !matchesBrand && !matchesCategory && !matchesTags) {
            return false
          }
        }

        // Category filter
        if (selectedCategory !== 'all') {
          if (!matchesCategory(p, selectedCategory)) {
            return false
          }
        }

        // Brand filter
        if (selectedBrand !== 'all') {
          if (p.brand.toLowerCase() !== selectedBrand.toLowerCase()) {
            return false
          }
        }

        // Size (Inch) filter - ONLY applied when relevant (Sky Shots)
        if (isSkyShotCategory && selectedSize !== 'all') {
          if (!matchesSize(p.name, selectedSize)) {
            return false
          }
        }

        // Shot count filter - ONLY applied when relevant (Aerial Cakes)
        if (isAerialCakeCategory && selectedShots !== 'all') {
          if (!matchesShots(p, selectedShots)) {
            return false
          }
        }

        return true
      })
      .sort((a, b) => {
        if (sortBy === 'price_low') return a.price - b.price
        if (sortBy === 'price_high') return b.price - a.price
        if (sortBy === 'discount') {
          const discA = a.originalPrice > a.price ? (a.originalPrice - a.price) / a.originalPrice : 0
          const discB = b.originalPrice > b.price ? (b.originalPrice - b.price) / b.originalPrice : 0
          return discB - discA
        }
        return 0 // Default featured / sno
      })
  }, [products, deferredSearchQuery, selectedCategory, selectedBrand, selectedSize, selectedShots, sortBy, isSkyShotCategory, isAerialCakeCategory])

  const hasActiveFilters =
    searchQuery !== '' ||
    selectedBrand !== 'all' ||
    (isSkyShotCategory && selectedSize !== 'all') ||
    (isAerialCakeCategory && selectedShots !== 'all')

  function clearAllFilters() {
    setSearchQuery('')
    setSelectedBrand('all')
    setSelectedSize('all')
    setSelectedShots('all')
  }

  return (
    <>
      <div ref={shopContainerRef} className={styles.shopContainer}>
        {/* ── Conditional Header: Dedicated Category Page vs Marketplace Shop All ── */}
        {selectedCategory !== 'all' || isCategoryPage ? (
          /* ── DEDICATED CATEGORY HERO ── */
          <section className={styles.dedicatedCategoryHero}>
            <div className={styles.categoryHeroInner}>
              {/* Breadcrumb Navigation */}
              <nav className={styles.breadcrumbNav} aria-label="Breadcrumb">
                <Link href="/" className={styles.breadcrumbLink}>
                  Home
                </Link>
                <span className={styles.breadcrumbSep}>›</span>
                <Link href="/shop" className={styles.breadcrumbLink}>
                  All Fireworks
                </Link>
                <span className={styles.breadcrumbSep}>›</span>
                <span className={styles.breadcrumbCurrent}>{activeCategoryMeta.label}</span>
              </nav>

              <div className={styles.categoryHeroMain}>
                <div className={styles.categoryHeroText}>
                  <div className={styles.categoryHeaderTopRow}>
                    <Link href="/shop" className={styles.backToShopLink}>
                      ← All Categories
                    </Link>
                    <span className={styles.categoryBadge}>
                      ✦ {activeCategoryMeta.label.toUpperCase()} ✦
                    </span>
                    <span className={styles.itemCountBadge}>
                      <strong>{filteredProducts.length}</strong> Items
                    </span>
                  </div>

                  <div className={styles.dedicatedTitleWrap}>
                    <h1 className={styles.dedicatedCatTitle}>
                      {activeCategoryMeta.label}
                    </h1>
                    <span className={styles.dedicatedCatHindi}>{activeCategoryMeta.hindiName}</span>
                  </div>

                  <p className={styles.dedicatedCatDesc}>{activeCategoryMeta.desc}</p>
                </div>

                {/* Category Featured Badge / Visual */}
                <div className={styles.categoryHeroVisual}>
                  <div className={styles.categoryHeroImgWrap}>
                    <CategoryAnimation slug={activeCategoryMeta.slug} />
                    <div className={styles.dedicatedIconOverlay}>✦</div>
                  </div>
                </div>
              </div>

              {/* Quick Category Switcher Ribbon */}
              <div className={styles.quickCategoryRibbon}>
                <span className={styles.quickRibbonLabel}>Categories:</span>
                <div className={styles.quickRibbonTrack}>
                  <Link
                    href="/shop"
                    className={`${styles.ribbonPill} ${selectedCategory === 'all' ? styles.ribbonPillActive : ''}`}
                  >
                    All
                  </Link>
                  {CATEGORY_CARDS.filter(c => c.slug !== 'all').map(c => {
                    const isCurr = c.id === selectedCategory || c.slug === activeCategoryMeta.slug
                    return (
                      <Link
                        key={c.slug}
                        href={`/category/${c.slug}`}
                        className={`${styles.ribbonPill} ${isCurr ? styles.ribbonPillActive : ''}`}
                      >
                        {c.label}
                      </Link>
                    )
                  })}
                </div>
              </div>
            </div>
          </section>
        ) : (
          <>
            {/* ── Marketplace Hero Banner (Shop All) ── */}
            <section className={styles.heroSection}>
              <div className={styles.heroContent}>
                <div className={styles.heritageTag}>✦ 60+ YEARS OF FESTIVE EXCELLENCE ✦</div>
                <h1 className={styles.heroTitle}>
                  62 Patakha Shop <span className={styles.highlight}>Marketplace</span>
                </h1>
                <p className={styles.heroSub}>
                  Direct Sivakasi factory authenticity at wholesale prices. Browse fireworks by dedicated category below
                  or click any cracker to view high-res photo, specifications, and instant WhatsApp ordering.
                </p>

                <div className={styles.guaranteeRow}>
                  <span className={styles.badgeItem}>✦ 100% Sivakasi Certified</span>
                  <span className={styles.badgeItem}>✦ Express Store Pickup &amp; Delivery</span>
                  <span className={styles.badgeItem}>✦ Instant WhatsApp Orders</span>
                </div>
              </div>
            </section>

            {/* ── Category Cards Section (Shown ONLY on Shop All) ── */}
            <section className={styles.categorySection}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>
                  Explore Firework Categories
                </h2>
                <p className={styles.sectionSub}>Click any category to open its dedicated collection page</p>
              </div>

              <div className={styles.categoryCardsGrid}>
                {CATEGORY_CARDS.map(cat => {
                  return (
                    <Link
                      key={cat.id}
                      href={cat.slug === 'all' ? '/shop' : `/category/${cat.slug}`}
                      className={styles.catCard}
                    >
                      <div className={styles.catCardImgWrap}>
                        <CategoryAnimation slug={cat.slug} isActive={false} />
                        <div className={styles.catIconBadge}>✦</div>
                      </div>
                      <div className={styles.catCardContent}>
                        <h3 className={styles.catCardTitle}>{cat.label}</h3>
                        <span className={styles.catHindiSubtitle}>{cat.hindiName}</span>
                        <p className={styles.catCardDesc}>{cat.desc}</p>
                        <div className={styles.catCardFooter}>
                          <span className={styles.catViewArrow}>Open Dedicated Page →</span>
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </section>
          </>
        )}

        {/* ── Brand Filter Bar — Always visible on Main Shop Page ── */}
        {selectedCategory === 'all' && !isCategoryPage && (
          <section style={{ padding: '12px 16px 4px', maxWidth: '1400px', margin: '0 auto' }}>
            <div style={{
              background: '#fff',
              border: '1px solid rgba(201,158,82,0.22)',
              borderRadius: '14px',
              padding: '12px 16px 14px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.6px', color: '#7E786E' }}>
                  🏷️ Filter by Brand
                </span>
                {selectedBrand !== 'all' && (
                  <button
                    type="button"
                    onClick={() => setSelectedBrand('all')}
                    style={{
                      fontSize: '11px', fontWeight: 700, color: '#C99E52', background: 'rgba(201,158,82,0.1)',
                      border: '1px solid rgba(201,158,82,0.3)', borderRadius: '5px', padding: '2px 9px', cursor: 'pointer',
                    }}
                  >
                    ✕ Clear Brand Filter
                  </button>
                )}
              </div>
              <div style={{ display: 'flex', gap: '7px', flexWrap: 'wrap', alignItems: 'center' }}>
                <button
                  type="button"
                  onClick={() => setSelectedBrand('all')}
                  style={{
                    padding: '5px 13px', borderRadius: '99px', fontSize: '12.5px', fontWeight: 700, cursor: 'pointer',
                    border: '1.5px solid', transition: 'all 0.15s',
                    borderColor: selectedBrand === 'all' ? '#C99E52' : 'rgba(201,158,82,0.25)',
                    background: selectedBrand === 'all' ? '#C99E52' : 'rgba(255,255,255,0.5)',
                    color: selectedBrand === 'all' ? '#fff' : '#7E786E',
                  }}
                >
                  All ({brands.length})
                </button>
                {brands.map(b => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => setSelectedBrand(selectedBrand === b ? 'all' : b)}
                    style={{
                      padding: '5px 13px', borderRadius: '99px', fontSize: '12px', fontWeight: 600, cursor: 'pointer',
                      border: '1.5px solid', transition: 'all 0.15s',
                      borderColor: selectedBrand === b ? '#C99E52' : 'rgba(28,26,23,0.1)',
                      background: selectedBrand === b ? 'rgba(201,158,82,0.12)' : 'transparent',
                      color: selectedBrand === b ? '#C99E52' : '#4A4640',
                      fontFamily: 'inherit',
                    }}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── Products & Filters: Only Shown on Dedicated Category Pages, Active Search, or Brand Filter ── */}
        {(selectedCategory !== 'all' || isCategoryPage || searchQuery.trim() !== '' || selectedBrand !== 'all') && (
          <>
            {/* ── Filters & Search Controls ── */}
            <section id="products-section" className={styles.controlsSection}>
              <div className={styles.searchRow}>
                <div className={styles.searchBox}>
                  <span className={styles.searchIcon}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                  </span>
                  <input
                    type="text"
                    placeholder="Search by cracker name, brand (Sony, Mercury, Azad...), or category..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className={styles.searchInput}
                  />
                  {searchQuery && (
                    <button className={styles.clearSearch} onClick={() => setSearchQuery('')} aria-label="Clear search">
                      &times;
                    </button>
                  )}
                </div>

                <div className={styles.filterDropdownsGrid}>
                  {/* Size (Inch) Filter — ONLY shown for Sky Shots */}
                  {isSkyShotCategory && (
                    <div className={styles.filterDropdownWrap}>
                      <CustomSelect
                        value={selectedSize}
                        onChange={val => setSelectedSize(val)}
                        options={SIZE_OPTIONS}
                        variant="shop"
                        ariaLabel="Filter by size in inches"
                      />
                    </div>
                  )}

                  {/* Shot Count Filter — ONLY shown for Aerial Cakes */}
                  {isAerialCakeCategory && (
                    <div className={styles.filterDropdownWrap}>
                      <CustomSelect
                        value={selectedShots}
                        onChange={val => setSelectedShots(val)}
                        options={SHOT_OPTIONS}
                        variant="shop"
                        ariaLabel="Filter by aerial cake shot count"
                      />
                    </div>
                  )}

                  {/* Brand Filter */}
                  <div className={styles.filterDropdownWrap}>
                    <CustomSelect
                      value={selectedBrand}
                      onChange={val => setSelectedBrand(val)}
                      options={[
                        { value: 'all', label: `All Brands (${brands.length})` },
                        ...brands.map(b => ({ value: b, label: b })),
                      ]}
                      variant="shop"
                      ariaLabel="Filter by brand"
                    />
                  </div>

                  {/* Sort By */}
                  <div className={styles.filterDropdownWrap}>
                    <CustomSelect
                      value={sortBy}
                      onChange={val => setSortBy(val as any)}
                      options={[
                        { value: 'featured', label: 'Featured / Default' },
                        { value: 'price_low', label: 'Price: Low to High' },
                        { value: 'price_high', label: 'Price: High to Low' },
                        { value: 'discount', label: 'Biggest Discounts' },
                      ]}
                      variant="shop"
                      ariaLabel="Sort products"
                    />
                  </div>
                </div>
              </div>

              {/* ── Quick Spec Filter Chips Ribbon: ONLY shown when in Sky Shots (Size) or Aerial Cakes (Shots) ── */}
              {(isSkyShotCategory || isAerialCakeCategory) && (
                <div className={styles.specFilterBar}>
                  {/* 1. Size (Inch) Quick Chips — Sky Shots Only */}
                  {isSkyShotCategory && (
                    <div className={styles.specFilterRow}>
                      <span className={styles.specFilterLabel}>Size (Inch):</span>
                      <div className={styles.specPillsTrack}>
                        {SIZE_OPTIONS.map(opt => {
                          const isActive = selectedSize === opt.value
                          return (
                            <button
                              key={`size-${opt.value}`}
                              type="button"
                              onClick={() => setSelectedSize(opt.value)}
                              className={`${styles.specPillBtn} ${isActive ? styles.specPillBtnActive : ''}`}
                            >
                              {opt.value === 'all' ? 'All Sizes' : opt.label.split(' ')[0]}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {/* 2. Aerial Cakes & Shots Quick Chips — Aerial Cakes Only */}
                  {isAerialCakeCategory && (
                    <div className={styles.specFilterRow}>
                      <span className={styles.specFilterLabel}>Aerial Shots:</span>
                      <div className={styles.specPillsTrack}>
                        {SHOT_OPTIONS.map(opt => {
                          const isActive = selectedShots === opt.value
                          return (
                            <button
                              key={`shot-${opt.value}`}
                              type="button"
                              onClick={() => setSelectedShots(opt.value)}
                              className={`${styles.specPillBtn} ${isActive ? styles.specPillBtnActive : ''}`}
                            >
                              {opt.value === 'all' ? 'All Shots' : opt.label}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </section>

            {/* ── Product Results Counter & Active Filter Tags ── */}
            <div className={styles.resultsBar}>
              <div className={styles.resultsText}>
                <span>
                  Showing <strong>{filteredProducts.length}</strong> available fireworks in{' '}
                  <span className={styles.activeCatBadge}>
                    {activeCategoryMeta.label}
                  </span>
                </span>

                {isSkyShotCategory && selectedSize !== 'all' && (
                  <span className={styles.activeFilterTag}>
                    Size: {SIZE_OPTIONS.find(s => s.value === selectedSize)?.label}
                  </span>
                )}

                {isAerialCakeCategory && selectedShots !== 'all' && (
                  <span className={styles.activeFilterTag}>
                    Shots: {SHOT_OPTIONS.find(s => s.value === selectedShots)?.label}
                  </span>
                )}

                {selectedBrand !== 'all' && (
                  <span className={styles.activeFilterTag}>
                    Brand: {selectedBrand}
                  </span>
                )}

                {searchQuery && (
                  <span className={styles.activeFilterTag}>
                    Search: &ldquo;{searchQuery}&rdquo;
                  </span>
                )}
              </div>

              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className={styles.btnClearFilters}
                  aria-label="Clear all active filters"
                >
                  Reset All Filters
                </button>
              )}
            </div>

            {/* ── Products Grid ── */}
            <main className={styles.gridSection}>
              {filteredProducts.length === 0 ? (
                <div className={styles.noResults}>
                  <span className={styles.noResultsIcon}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                  </span>
                  <h3>No Fireworks Match Your Selection</h3>
                  <p>Try clearing your search keyword or switching category cards.</p>
                  <button
                    className={styles.btnReset}
                    onClick={() => {
                      setSearchQuery('')
                      setSelectedCategory('all')
                      setSelectedBrand('all')
                      setSelectedSize('all')
                      setSelectedShots('all')
                    }}
                  >
                    Show All Fireworks
                  </button>
                </div>
              ) : (
                <div className={styles.productGrid}>
                  {filteredProducts.map(p => {
                    return (
                      <div
                        key={p.id}
                        className={styles.card}
                        onClick={() => setDetailProduct(p)}
                      >
                        {/* Card Image Wrap */}
                        <div className={styles.cardImgWrap}>
                          <Image
                            src={p.image}
                            alt={p.name}
                            width={500}
                            height={500}
                            unoptimized
                            priority={p.sno <= 8}
                            className={styles.cardImg}
                            onError={e => {
                              (e.target as HTMLImageElement).src = '/logo-62.png'
                            }}
                          />

                          {/* Discount badge */}
                          {p.discount && (
                            <span className={styles.badgeDiscount}>{p.discount}</span>
                          )}

                          {/* Brand Tag */}
                          <span className={styles.badgeBrand}>{p.brand}</span>

                          {/* Quick view hover hint */}
                          <div className={styles.quickViewHint}>
                            <span>Tap for Full Details</span>
                          </div>
                        </div>

                        {/* Card Details */}
                        <div className={styles.cardBody}>
                          <div className={styles.categoryLabel}>{p.category}</div>
                          <h3 className={styles.productTitle} title={p.name}>
                            {p.name}
                          </h3>

                          {/* Pricing */}
                          <div className={styles.priceContainer}>
                            <span className={styles.salePrice}>₹{p.price.toLocaleString('en-IN')}</span>
                            {p.originalPrice > p.price && (
                              <span className={styles.mrpPrice}>₹{p.originalPrice.toLocaleString('en-IN')}</span>
                            )}
                          </div>

                          {/* Bottom Action */}
                          <div className={styles.cardActions} onClick={e => e.stopPropagation()}>
                            <button
                              className={styles.btnAddToCart}
                              onClick={() => handleAddToCart(p)}
                            >
                              <span className={styles.plusIcon}>+</span> Add to Basket
                            </button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </main>
          </>
        )}

        {/* ── Product Quick View & Detail Modal ── */}
        {detailProduct && (
          <div className={styles.detailModalBackdrop} onClick={() => setDetailProduct(null)}>
            <div className={styles.detailModalCard} onClick={e => e.stopPropagation()}>
              <button
                className={styles.detailModalClose}
                onClick={() => setDetailProduct(null)}
                aria-label="Close product details"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>

              <div className={styles.detailModalGrid}>
                <div className={styles.detailImgWrap}>
                  <Image
                    src={detailProduct.image}
                    alt={detailProduct.name}
                    width={600}
                    height={600}
                    unoptimized
                    className={styles.detailModalImg}
                    onError={e => {
                      (e.target as HTMLImageElement).src = '/logo-62.png'
                    }}
                  />
                  {detailProduct.discount && (
                    <span className={styles.detailDiscountBadge}>{detailProduct.discount}</span>
                  )}
                </div>

                <div className={styles.detailInfoBox}>
                  <div className={styles.detailCategoryBadge}>{detailProduct.category}</div>
                  <h2 className={styles.detailTitle}>{detailProduct.name}</h2>
                  <div className={styles.detailBrandRow}>
                    <span>Manufactured By:</span>
                    <strong className={styles.detailBrandName}>{detailProduct.brand}</strong>
                  </div>

                  {/* Price Display */}
                  <div className={styles.detailPriceRow}>
                    <span className={styles.detailSalePrice}>
                      ₹{detailProduct.price.toLocaleString('en-IN')}
                    </span>
                    {detailProduct.originalPrice > detailProduct.price && (
                      <span className={styles.detailMrpPrice}>
                        MRP: ₹{detailProduct.originalPrice.toLocaleString('en-IN')}
                      </span>
                    )}
                    {detailProduct.originalPrice > detailProduct.price && (
                      <span className={styles.detailSaveTag}>
                        Save ₹{(detailProduct.originalPrice - detailProduct.price).toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>

                  {/* Tags / Specifications */}
                  {detailProduct.tags && (
                    <div className={styles.detailSpecsBox}>
                      <h4>Product Highlights &amp; Tags</h4>
                      <div className={styles.tagPills}>
                        {detailProduct.tags.split(',').map((tag, idx) => (
                          <span key={idx} className={styles.tagPill}>
                            ✦ {tag.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Security and quality highlights */}
                  <div className={styles.qualityList}>
                    <div className={styles.qualityItem}>
                      <span className={styles.qualityItemIcon}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                        </svg>
                      </span>
                      <div>
                        <strong>Genuine Sivakasi Certified</strong>
                        <p>Sourced directly from authorized manufacturers in Sivakasi.</p>
                      </div>
                    </div>
                    <div className={styles.qualityItem}>
                      <span className={styles.qualityItemIcon}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
                        </svg>
                      </span>
                      <div>
                        <strong>Safe &amp; Tested Fireworks</strong>
                        <p>Complies with standard sound and emission norms for safe festivities.</p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className={styles.detailModalActions}>
                    <button
                      className={styles.detailBtnAdd}
                      onClick={() => {
                        handleAddToCart(detailProduct)
                        setDetailProduct(null)
                      }}
                    >
                      Add to Basket
                    </button>
                    <a
                      href={`https://wa.me/918561005357?text=${encodeURIComponent(`Hello 62 Patakha Shop! I want to inquire about *${detailProduct.name}* (Brand: ${detailProduct.brand}, Price: ₹${detailProduct.price}). Is this currently available?`)}`}
                      target="_blank"
                      rel="noreferrer"
                      className={styles.detailBtnWa}
                    >
                      Ask on WhatsApp
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Added to Basket Toast */}
      <div className={`${styles.addedToast} ${toastVisible ? styles.addedToastVisible : ''}`}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
        <span>Added to Basket</span>
        <button className={styles.toastViewBtn} onClick={openDrawer}>View</button>
      </div>
    </>
  )
}
