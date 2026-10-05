'use client'

import React, { useState, useMemo, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import ProductCard from '@/components/ProductCard'
import FilterBar from '@/components/FilterBar'
import { CATEGORY_CARDS } from '@/data/categories'
import styles from './CatalogClient.module.css'

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

function matchesCategory(product: Product, catId: string): boolean {
  if (!catId || catId === 'all') return true
  const normalizedCatId = catId.toLowerCase().trim().replace(/-/g, ' ')
  const prodCat = (product.category || '').toLowerCase().trim().replace(/-/g, ' ')

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

  return normalize(prodCat) === normalize(normalizedCatId)
}

function matchesSize(productName: string, size: string): boolean {
  if (size === 'all') return true
  const name = productName.toLowerCase()
  if (size === '1.5') return name.includes('1.5″') || name.includes('1.5"') || name.includes('1.5')
  if (size === '2') return (name.includes('2″') || name.includes('2"')) && !name.includes('2.5')
  if (size === '2.5') return name.includes('2.5″') || name.includes('2.5"')
  if (size === '3') return (name.includes('3″') || name.includes('3"')) && !name.includes('3.5')
  if (size === '4') return name.includes('4″') || name.includes('4"')
  if (size === '5') return name.includes('5″') || name.includes('5"')
  return true
}

function matchesChakkarType(product: Product, filterType: string): boolean {
  if (!filterType || filterType === 'all') return true
  const text = `${product.name} ${product.tags || ''} ${product.category || ''}`.toLowerCase()
  if (filterType === '45cm') {
    return text.includes('45cm') || text.includes('45 cm') || text.includes('45') || text.includes('ashoka') || text.includes('special')
  }
  if (filterType === '70cm') {
    return text.includes('70cm') || text.includes('70 cm') || text.includes('70') || text.includes('deluxe') || text.includes('giant')
  }
  if (filterType === 'whistling-wheel') {
    return text.includes('whistling') || text.includes('musical')
  }
  if (filterType === 'nattya-dhara') {
    return text.includes('nattya') || text.includes('dhara') || text.includes('dhaara')
  }
  return true
}

function matchesShots(product: Product, shots: string): boolean {
  if (!shots || shots === 'all') return true
  const text = `${product.name} ${product.tags || ''} ${product.category || ''}`.toLowerCase()
  const pattern = new RegExp(`(?:^|\\b|\\s|\\()${shots}\\s*(?:shot|shots|sh|salute)?(?:\\b|\\s|\\)|$)`, 'i')
  if (pattern.test(text)) return true
  if (text.includes(`${shots} shot`) || text.includes(`${shots}shot`) || text.includes(`${shots} shots`)) return true
  return false
}

function CatalogContent({
  initialProducts,
  defaultCollectionTitle,
  defaultCollectionDesc,
}: {
  initialProducts: Product[]
  defaultCollectionTitle?: string
  defaultCollectionDesc?: string
}) {
  const searchParams = useSearchParams()
  const router = useRouter()

  const urlCat = searchParams.get('cat') || 'all'
  const urlSearch = searchParams.get('q') || ''
  const urlSort = searchParams.get('sort') || 'featured'
  const urlSize = searchParams.get('size') || 'all'
  const urlBrand = searchParams.get('brand') || 'all'

  const [activeCategory, setActiveCategory] = useState(urlCat)
  const [searchQuery, setSearchQuery] = useState(urlSearch)
  const [sortBy, setSortBy] = useState(urlSort)
  const [selectedSize, setSelectedSize] = useState(urlSize)
  const [selectedBrand, setSelectedBrand] = useState(urlBrand)
  const [visibleCount, setVisibleCount] = useState(32)

  const catalogContainerRef = React.useRef<HTMLDivElement>(null)
  const isFirstRender = React.useRef(true)

  const brands = useMemo(() => {
    const list = Array.from(new Set(initialProducts.map(p => p.brand).filter(Boolean)))
    return list.sort()
  }, [initialProducts])

  const scrollToCatalogTop = React.useCallback(() => {
    if (catalogContainerRef.current) {
      const topOffset = catalogContainerRef.current.getBoundingClientRect().top + window.scrollY - 80
      window.scrollTo({ top: Math.max(0, topOffset), behavior: 'smooth' })
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [])

  // Smooth scroll to top of catalog when active category, size or brand filter changes
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    scrollToCatalogTop()
  }, [activeCategory, selectedSize, selectedBrand, scrollToCatalogTop])

  // Keep state in sync whenever URL search parameters change
  useEffect(() => {
    setActiveCategory(searchParams.get('cat') || 'all')
    setSearchQuery(searchParams.get('q') || '')
    setSortBy(searchParams.get('sort') || 'featured')
    setSelectedSize(searchParams.get('size') || 'all')
    setSelectedBrand(searchParams.get('brand') || 'all')
    setVisibleCount(32)
  }, [searchParams])

  // Sync state to URL params cleanly
  const updateUrl = (cat: string, search: string, sort: string, size: string, brand: string) => {
    const params = new URLSearchParams()
    if (cat !== 'all') params.set('cat', cat)
    if (search.trim()) params.set('q', search.trim())
    if (sort !== 'featured') params.set('sort', sort)
    if (size !== 'all') params.set('size', size)
    if (brand !== 'all') params.set('brand', brand)

    const queryString = params.toString()
    router.replace(`/catalog${queryString ? `?${queryString}` : ''}`, { scroll: false })
  }

  const handleCategoryChange = (cat: string) => {
    if (cat === activeCategory) {
      scrollToCatalogTop()
      return
    }
    setActiveCategory(cat)
    const isFilterable = cat === 'skyshots' || cat === 'chakkar' || cat === 'aerial cakes' || cat === 'aerial-cakes'
    const nextSize = isFilterable && cat === activeCategory ? selectedSize : 'all'
    if (selectedSize !== 'all' && (cat !== activeCategory || !isFilterable)) {
      setSelectedSize('all')
    }
    updateUrl(cat, searchQuery, sortBy, nextSize, selectedBrand)
  }

  const handleSearchChange = (query: string) => {
    setSearchQuery(query)
    updateUrl(activeCategory, query, sortBy, selectedSize, selectedBrand)
  }

  const handleSortChange = (sort: string) => {
    setSortBy(sort)
    updateUrl(activeCategory, searchQuery, sort, selectedSize, selectedBrand)
  }

  const handleSizeChange = (size: string) => {
    setSelectedSize(size)
    updateUrl(activeCategory, searchQuery, sortBy, size, selectedBrand)
  }

  const handleBrandChange = (brand: string) => {
    setSelectedBrand(brand)
    updateUrl(activeCategory, searchQuery, sortBy, selectedSize, brand)
  }

  // Count items per category using full alias matching
  const categoriesWithCounts = useMemo(() => {
    return CATEGORY_CARDS.map((cat) => {
      if (cat.id === 'all') {
        return { id: cat.id, label: cat.label, count: initialProducts.length }
      }
      const count = initialProducts.filter((p) => matchesCategory(p, cat.id)).length
      return { id: cat.id, label: cat.label, count }
    })
  }, [initialProducts])

  // Filter and sort items
  const filteredProducts = useMemo(() => {
    return initialProducts.filter((product) => {
      // 1. Category Filter with Aliases
      if (!matchesCategory(product, activeCategory)) {
        return false
      }

      // 2. Search Query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim()
        const matchName = product.name.toLowerCase().includes(query)
        const matchBrand = (product.brand || '').toLowerCase().includes(query)
        const matchCat = (product.category || '').toLowerCase().includes(query)
        if (!matchName && !matchBrand && !matchCat) return false
      }

      // 2.5 Brand Filter
      if (selectedBrand !== 'all') {
        if ((product.brand || '').toLowerCase() !== selectedBrand.toLowerCase()) {
          return false
        }
      }

      // 3. Size Filter (for skyshots, chakkar, and aerial cakes categories)
      if (activeCategory === 'skyshots' && !matchesSize(product.name, selectedSize)) {
        return false
      }
      if (activeCategory === 'chakkar' && !matchesChakkarType(product, selectedSize)) {
        return false
      }
      if ((activeCategory === 'aerial cakes' || activeCategory === 'aerial-cakes') && !matchesShots(product, selectedSize)) {
        return false
      }

      return true
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price
      if (sortBy === 'price-desc') return b.price - a.price
      if (sortBy === 'name-asc') return a.name.localeCompare(b.name)
      return (a.sno || 0) - (b.sno || 0)
    })
  }, [initialProducts, activeCategory, searchQuery, sortBy, selectedSize, selectedBrand])

  // Previous and Next Category calculation
  const currentCatIndex = useMemo(() => {
    return CATEGORY_CARDS.findIndex((c) => c.id.toLowerCase() === activeCategory.toLowerCase())
  }, [activeCategory])

  const prevCategory = currentCatIndex > 0 ? CATEGORY_CARDS[currentCatIndex - 1] : null
  const nextCategory =
    currentCatIndex >= 0 && currentCatIndex < CATEGORY_CARDS.length - 1
      ? CATEGORY_CARDS[currentCatIndex + 1]
      : null

  return (
    <div ref={catalogContainerRef} className={styles.catalogWrapper}>
      {/* Editorial Header */}
      <div className={styles.editorialHeader}>
        <div className="editorial-container">
          <span className="eyebrow-pill">All Products</span>
          <h1 className={styles.catalogTitle}>
            {defaultCollectionTitle || 'All Fireworks & Crackers'}
          </h1>
          <p className={styles.catalogSubtitle}>
            {defaultCollectionDesc ||
              'Original Sivakasi fireworks, sky rockets, sparklers, and anars for Diwali, weddings, and celebrations at best prices in Jaipur.'}
          </p>
        </div>
      </div>

      {/* Sticky Filter Bar */}
      <FilterBar
        categories={categoriesWithCounts}
        activeCategory={activeCategory}
        onCategoryChange={handleCategoryChange}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        sortBy={sortBy}
        onSortChange={handleSortChange}
        selectedSize={selectedSize}
        onSizeChange={handleSizeChange}
        brands={brands}
        selectedBrand={selectedBrand}
        onBrandChange={handleBrandChange}
        totalCount={filteredProducts.length}
      />

      {/* Catalog Grid Section */}
      <div className={styles.contentArea}>
        <div className="editorial-container">
          {filteredProducts.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>✦</div>
              <h2 className={styles.emptyTitle}>No Fireworks Found</h2>
              <p className={styles.emptyDesc}>
                We could not find items matching your search or filters. Try clearing your filters to see all available fireworks.
              </p>
              <button
                onClick={() => {
                  setActiveCategory('all')
                  setSearchQuery('')
                  setSelectedSize('all')
                  setSelectedBrand('all')
                  setSortBy('featured')
                  router.replace('/catalog', { scroll: false })
                }}
                className="btn-aurora-gold"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <>
              <div className={styles.productGrid}>
                {filteredProducts.slice(0, visibleCount).map((p, idx) => (
                  <ProductCard
                    key={p.id}
                    id={p.id}
                    name={p.name}
                    brand={p.brand}
                    category={p.category}
                    price={p.price}
                    originalPrice={p.originalPrice}
                    discount={p.discount}
                    image={p.image}
                    inStock={p.inStock}
                    aspectRatio="1/1"
                    priority={idx < 4}
                  />
                ))}
              </div>

              {visibleCount < filteredProducts.length && (
                <div className={styles.loadMoreWrap}>
                  <button
                    type="button"
                    onClick={() => setVisibleCount(c => c + 32)}
                    className={styles.loadMoreBtn}
                    aria-label={`Load more fireworks, ${filteredProducts.length - visibleCount} remaining`}
                  >
                    <span>Load More Fireworks</span>
                    <span className={styles.loadMoreCount}>
                      +{filteredProducts.length - visibleCount}
                    </span>
                    <span className={styles.loadMoreSparkle}>✦</span>
                  </button>
                  <span className={styles.loadMoreSubtext}>
                    Showing {Math.min(visibleCount, filteredProducts.length)} of {filteredProducts.length} items
                  </span>
                </div>
              )}
            </>
          )}

          {/* Bottom Category Pagination: Clean Single-Line Text Links */}
          {filteredProducts.length > 0 && (prevCategory || nextCategory) && (
            <div className={styles.categoryNavSection}>
              {prevCategory && (
                <button
                  type="button"
                  className={`${styles.categoryNavBtn} ${styles.prevBtn}`}
                  onClick={() => {
                    handleCategoryChange(prevCategory.id)
                    window.scrollTo({ top: 120, behavior: 'smooth' })
                  }}
                  title={`Previous category: ${prevCategory.label}`}
                >
                  <span className={styles.navArrow}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="19" y1="12" x2="5" y2="12" />
                      <polyline points="12 19 5 12 12 5" />
                    </svg>
                  </span>
                  <div className={styles.navBtnText}>
                    <span className={styles.navLabel}>Previous</span>
                    <span className={styles.navCatName}>{prevCategory.label}</span>
                  </div>
                </button>
              )}

              {nextCategory && (
                <button
                  type="button"
                  className={`${styles.categoryNavBtn} ${styles.nextBtn}`}
                  onClick={() => {
                    handleCategoryChange(nextCategory.id)
                    window.scrollTo({ top: 120, behavior: 'smooth' })
                  }}
                  title={`Next category: ${nextCategory.label}`}
                >
                  <div className={styles.navBtnText}>
                    <span className={styles.navLabel}>Next</span>
                    <span className={styles.navCatName}>{nextCategory.label}</span>
                  </div>
                  <span className={styles.navArrow}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function CatalogClient(props: {
  initialProducts: Product[]
  defaultCollectionTitle?: string
  defaultCollectionDesc?: string
}) {
  return (
    <Suspense fallback={<div style={{ padding: '100px 0', textAlign: 'center' }}>Loading Catalog...</div>}>
      <CatalogContent {...props} />
    </Suspense>
  )
}
