'use client'

import React from 'react'
import Link from 'next/link'
import ImageReveal from './ImageReveal'
import FireworksSparkHover from './FireworksSparkHover'
import { useCart } from '@/context/CartContext'
import { useWishlist } from '@/context/WishlistContext'
import styles from './ProductCard.module.css'

export interface ProductCardProps {
  id: string
  name: string
  brand: string
  category: string
  price: number
  originalPrice?: number
  discount?: string
  image: string
  inStock?: boolean
  aspectRatio?: string
  priority?: boolean
}

const ProductCard = React.memo(function ProductCard({
  id,
  name,
  brand,
  category,
  price,
  originalPrice,
  discount,
  image,
  inStock = true,
  aspectRatio = '1/1',
  priority = false
}: ProductCardProps) {
  const { cart, addToCart, updateQuantity } = useCart()
  const { isInWishlist, toggleWishlist } = useWishlist()
  const favorited = isInWishlist(id)

  const cartItem = cart.find((item) => String(item.id) === String(id))
  const quantityInCart = cartItem ? cartItem.quantity : 0

  return (
    <div className={styles.card}>
      <div className={styles.imageBox}>
        <Link href={`/catalog/product/${id}`} className={styles.imageLink} aria-label={`View ${name}`}>
          <ImageReveal
            src={image}
            alt={name}
            aspectRatio={aspectRatio}
            priority={priority}
          />
        </Link>

        <button
          type="button"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            toggleWishlist({
              id,
              name,
              brand,
              category,
              price,
              originalPrice: originalPrice || price,
              image,
            })
          }}
          className={`${styles.wishlistBtn} ${favorited ? styles.wishlistActive : ''}`}
          aria-label={favorited ? `Remove ${name} from wishlist` : `Add ${name} to wishlist`}
          title={favorited ? 'In Wishlist' : 'Add to Wishlist'}
        >
          <svg
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill={favorited ? '#e53e3e' : 'none'}
            stroke={favorited ? '#e53e3e' : 'currentColor'}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
          </svg>
        </button>

        {discount && (
          <span className={styles.badgeDiscount}>{discount}</span>
        )}

        {!inStock && (
          <span className={styles.badgeStock}>Out of Stock</span>
        )}

        <span className={styles.badgeBrand}>
          <span className={styles.brandDot} />
          {brand || 'Standard'}
        </span>
      </div>

      <div className={styles.details}>
        <div className={styles.metaRow}>
          <span className={styles.brand}>{brand || 'Standard'}</span>
          <span className={styles.category}>{category}</span>
        </div>

        <Link href={`/catalog/product/${id}`} className={styles.titleLink}>
          <h3 className={styles.name}>{name}</h3>
        </Link>

        <div className={styles.footerRow}>
          <div className={styles.pricing}>
            <span className={styles.currentPrice}>₹{price.toLocaleString('en-IN')}</span>
            {originalPrice && originalPrice > price && (
              <span className={styles.originalPrice}>₹{originalPrice.toLocaleString('en-IN')}</span>
            )}
          </div>

          <div className={styles.actions}>
            {quantityInCart > 0 ? (
              <div className={styles.qtyControl} role="group" aria-label={`Quantity for ${name}`}>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    updateQuantity(id, -1)
                  }}
                  className={styles.qtyBtn}
                  aria-label={`Decrease ${name} quantity`}
                  title="Decrease quantity"
                >
                  –
                </button>
                <span className={styles.qtyVal} aria-live="polite">
                  {quantityInCart}
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    updateQuantity(id, 1)
                  }}
                  className={styles.qtyBtn}
                  aria-label={`Increase ${name} quantity`}
                  title="Increase quantity"
                >
                  +
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  addToCart({
                    id,
                    name,
                    brand,
                    price,
                    originalPrice: originalPrice || price,
                    image,
                  })
                }}
                className={styles.addBtn}
                aria-label={`Add ${name} to list`}
              >
                + Add to List
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
})

export default ProductCard
