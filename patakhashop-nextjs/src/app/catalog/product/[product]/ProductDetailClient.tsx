'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import ImageReveal from '@/components/ImageReveal'
import ProductCard from '@/components/ProductCard'
import { useCart } from '@/context/CartContext'
import { useWishlist } from '@/context/WishlistContext'
import { getCategoryForProduct } from '@/data/categories'
import styles from './ProductDetailClient.module.css'

interface ReviewItem {
  id: string
  author: string
  rating: number
  comment: string
  date: string
  verified: boolean
}

export default function ProductDetailClient({
  product,
  relatedProducts,
}: {
  product: any
  relatedProducts: any[]
}) {
  const { addToCart, openDrawer } = useCart()
  const { isInWishlist, toggleWishlist } = useWishlist()
  const favorited = isInWishlist(String(product.id))

  const [reviews, setReviews] = useState<ReviewItem[]>([])
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [authorName, setAuthorName] = useState('')
  const [userRating, setUserRating] = useState(5)
  const [reviewComment, setReviewComment] = useState('')
  const [isSubmittingReview, setIsSubmittingReview] = useState(false)
  const [reviewSuccess, setReviewSuccess] = useState(false)

  // Ensure instant scroll to top immediately upon opening product
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [product.id])

  // Fetch reviews on mount
  useEffect(() => {
    fetch(`/api/reviews?productId=${product.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.reviews) {
          setReviews(data.reviews)
        }
      })
      .catch(() => {})
  }, [product.id])

  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
      : '5.0'

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!authorName.trim() || !reviewComment.trim()) return

    setIsSubmittingReview(true)
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: String(product.id),
          author: authorName.trim(),
          rating: userRating,
          comment: reviewComment.trim(),
        }),
      })
      const data = await res.json()
      if (data.success && data.review) {
        setReviews([data.review, ...reviews])
        setReviewSuccess(true)
        setTimeout(() => {
          setShowReviewModal(false)
          setReviewSuccess(false)
          setAuthorName('')
          setReviewComment('')
        }, 1200)
      }
    } catch {
      // Ignore
    } finally {
      setIsSubmittingReview(false)
    }
  }

  const canonicalCategory = getCategoryForProduct(product.category, product.name)

  return (
    <div className={styles.pageWrap}>
      {/* Flipkart-Style Clean Breadcrumb Navigation */}
      <div className={styles.breadcrumbBar}>
        <div className="editorial-container">
          <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
            <Link href="/" className={styles.crumbLink}>Home</Link>
            <span className={styles.crumbDivider}>/</span>
            <Link href="/catalog" className={styles.crumbLink}>Catalog</Link>
            {product.category && (
              <>
                <span className={styles.crumbDivider}>/</span>
                <Link
                  href={`/catalog?cat=${encodeURIComponent(canonicalCategory.id)}`}
                  className={styles.crumbLink}
                  title={`View all ${canonicalCategory.label}`}
                >
                  {product.category}
                </Link>
              </>
            )}
            <span className={styles.crumbDivider}>/</span>
            <span className={styles.currentCrumb}>{product.name}</span>
          </nav>
        </div>
      </div>

      {/* Main Editorial Presentation */}
      <div className="editorial-container">
        <div className={styles.mainGrid}>
          {/* Left Column: Product Photography */}
          <div className={styles.imageColumn}>
            <div className={styles.stickyImage}>
              <div className={styles.imageWrapper}>
                <ImageReveal
                  src={product.image}
                  alt={product.name}
                  aspectRatio="1/1"
                  priority
                />

                <button
                  type="button"
                  onClick={() =>
                    toggleWishlist({
                      id: String(product.id),
                      name: product.name,
                      brand: product.brand,
                      category: product.category,
                      price: product.price,
                      originalPrice: product.originalPrice || product.price,
                      image: product.image,
                    })
                  }
                  className={`${styles.pdpWishlistBtn} ${favorited ? styles.wishlistActive : ''}`}
                  aria-label={favorited ? 'Remove from wishlist' : 'Add to wishlist'}
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill={favorited ? '#e53e3e' : 'none'}
                    stroke={favorited ? '#e53e3e' : 'currentColor'}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                  </svg>
                  <span>{favorited ? 'In Wishlist' : 'Add to Wishlist'}</span>
                </button>
              </div>

              <div className={styles.imageFooter}>
                <span className={styles.originTag}>✦ Masterwork Sivakasi Pyrotechnics</span>
                <span className={styles.greenTag}>CSIR-NEERI Certified Green Cracker</span>
              </div>
            </div>
          </div>

          {/* Right Column: Specifications & Purchasing */}
          <div className={styles.dossierColumn}>
            <div className={styles.brandRow}>
              <span className="eyebrow-pill">{product.brand || 'Standard'}</span>
              <Link
                href={`/catalog?cat=${encodeURIComponent(canonicalCategory.id)}`}
                className={styles.categoryBadge}
                style={{ textDecoration: 'none' }}
                title={`Explore ${canonicalCategory.label}`}
              >
                {product.category}
              </Link>
            </div>

            <h1 className={styles.title}>{product.name}</h1>

            {/* Ratings Summary */}
            <div className={styles.ratingBar}>
              <div className={styles.stars}>★★★★★</div>
              <span className={styles.ratingNum}>{avgRating} / 5.0</span>
              <span className={styles.reviewCount}>({reviews.length} verified reviews)</span>
              <button
                type="button"
                onClick={() => setShowReviewModal(true)}
                className={styles.writeReviewLink}
              >
                Write a Review
              </button>
            </div>

            <div className={styles.pricingRow}>
              <span className={styles.price}>₹{product.price.toLocaleString('en-IN')}</span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className={styles.origPrice}>₹{product.originalPrice.toLocaleString('en-IN')}</span>
              )}
              {product.discount && (
                <span className={styles.discountBadge}>{product.discount}</span>
              )}
            </div>

            {/* Live Stock Indicator */}
            <div className={styles.stockNotice}>
              <span className={styles.stockDot} />
              <span>
                <strong>In Stock:</strong> Fresh Batch available for immediate Jaipur pickup or delivery
              </span>
            </div>

            <div className="gold-rule" />

            <div className={styles.ctaRow}>
              <button
                type="button"
                onClick={() => {
                  addToCart({
                    id: String(product.id),
                    name: product.name,
                    brand: product.brand,
                    price: product.price,
                    originalPrice: product.originalPrice || product.price,
                    image: product.image,
                  })
                  openDrawer()
                }}
                className={styles.addToCartBtn}
              >
                Add to Cart
              </button>
              <Link href="/checkout" className={styles.instantCheckoutBtn}>
                Instant Checkout →
              </Link>
            </div>

            {/* Fireworks Experience Rating */}
            <div className={styles.intensityCard}>
              <h4 className={styles.intensityTitle}>Fireworks Visual &amp; Sound Profile</h4>
              <div className={styles.intensityGrid}>
                <div className={styles.intensityItem}>
                  <div className={styles.intensityMeta}>
                    <span className={styles.intensityLabel}>Sound Decibels</span>
                    <span className={styles.intensityVal}>Crisp / Moderate</span>
                  </div>
                  <div className={styles.meter}>
                    <div className={styles.meterFill} style={{ width: '75%' }} />
                  </div>
                </div>
                <div className={styles.intensityItem}>
                  <div className={styles.intensityMeta}>
                    <span className={styles.intensityLabel}>Sky Brightness &amp; Sparkle</span>
                    <span className={styles.intensityVal}>Vibrant Gold / Colors</span>
                  </div>
                  <div className={styles.meter}>
                    <div className={styles.meterFill} style={{ width: '92%' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Technical Specifications Matrix */}
            <div className={styles.specsSection}>
              <h3 className={styles.specsHeader}>Product Details &amp; Safety Compliance</h3>
              <dl className={styles.specList}>
                <div className={styles.specItem}>
                  <dt>Manufacturer Origin</dt>
                  <dd>Standard, Sivakasi (Tamil Nadu)</dd>
                </div>
                <div className={styles.specItem}>
                  <dt>Clearance Distance</dt>
                  <dd>Minimum 15 - 20 meters in open ground</dd>
                </div>
                <div className={styles.specItem}>
                  <dt>Environmental Norms</dt>
                  <dd>CSIR-NEERI Green Cracker Formulation</dd>
                </div>
                <div className={styles.specItem}>
                  <dt>Suitability</dt>
                  <dd>Diwali, Weddings, Rooftops &amp; Family Parties</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>

        {/* Customer Reviews Section */}
        <div className={styles.reviewsSection}>
          <div className={styles.reviewsHeader}>
            <div>
              <span className="eyebrow-pill">Customer Testimonials</span>
              <h2 className={styles.reviewsTitle}>Customer Reviews &amp; Ratings</h2>
            </div>
            <button
              type="button"
              onClick={() => setShowReviewModal(true)}
              className="btn-aurora-gold"
            >
              + Write a Review
            </button>
          </div>

          <div className={styles.reviewsList}>
            {reviews.map((rev) => (
              <div key={rev.id} className={styles.reviewCard}>
                <div className={styles.reviewTop}>
                  <div>
                    <h4 className={styles.reviewAuthor}>{rev.author}</h4>
                    <span className={styles.verifiedBadge}>✓ Verified Buyer</span>
                  </div>
                  <div className={styles.reviewStars}>
                    {'★'.repeat(rev.rating)}
                    {'☆'.repeat(5 - rev.rating)}
                  </div>
                </div>
                <p className={styles.reviewComment}>&ldquo;{rev.comment}&rdquo;</p>
                <span className={styles.reviewDate}>{rev.date}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Related Creations */}
        {relatedProducts.length > 0 && (
          <div className={styles.relatedSection}>
            <div className={styles.relatedHead}>
              <span className="eyebrow-pill">Related Fireworks</span>
              <h2 className={styles.relatedTitle}>You May Also Like</h2>
            </div>
            <div className={styles.relatedGrid}>
              {relatedProducts.map((item) => (
                <ProductCard
                  key={item.id}
                  id={String(item.id)}
                  name={item.name}
                  brand={item.brand}
                  category={item.category}
                  price={item.price}
                  originalPrice={item.originalPrice}
                  discount={item.discount}
                  image={item.image}
                  inStock={item.inStock}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Write a Review Modal */}
      {showReviewModal && (
        <div className={styles.modalOverlay} onClick={() => setShowReviewModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Review {product.name}</h3>
              <button
                type="button"
                className={styles.modalClose}
                onClick={() => setShowReviewModal(false)}
              >
                ✕
              </button>
            </div>

            {reviewSuccess ? (
              <div className={styles.successState}>
                <span className={styles.successIcon}>✓</span>
                <h4>Thank you!</h4>
                <p>Your review has been successfully posted.</p>
              </div>
            ) : (
              <form onSubmit={handleReviewSubmit} className={styles.reviewForm}>
                <div className={styles.formGroup}>
                  <label>Your Name &amp; Area</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Sharma (Jaipur)"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Rating</label>
                  <select
                    value={userRating}
                    onChange={(e) => setUserRating(Number(e.target.value))}
                  >
                    <option value={5}>★★★★★ (5/5 Excellent)</option>
                    <option value={4}>★★★★☆ (4/5 Very Good)</option>
                    <option value={3}>★★★☆☆ (3/5 Good)</option>
                    <option value={2}>★★☆☆☆ (2/5 Fair)</option>
                    <option value={1}>★☆☆☆☆ (1/5 Poor)</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label>Your Feedback / Experience</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Tell other shoppers about the altitude, spark, or sound quality of this firework..."
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingReview}
                  className="btn-aurora-gold"
                  style={{ width: '100%' }}
                >
                  {isSubmittingReview ? 'Submitting...' : 'Submit Review'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
