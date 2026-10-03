'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useWishlist } from '@/context/WishlistContext'
import { useCart } from '@/context/CartContext'
import styles from './wishlist.module.css'

export default function WishlistPage() {
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist()
  const { addToCart, openDrawer } = useCart()

  const handleAddAllToCart = () => {
    wishlist.forEach((item) => {
      addToCart({
        id: item.id,
        name: item.name,
        brand: item.brand,
        category: item.category,
        price: item.price,
        originalPrice: item.originalPrice,
        image: item.image,
      })
    })
    openDrawer()
  }

  return (
    <div className={styles.wishlistWrapper}>
      <div className="editorial-container">
        {/* Header */}
        <div className={styles.header}>
          <div>
            <span className="eyebrow-pill">Saved Favorites</span>
            <h1 className={styles.title}>My Fireworks Wishlist</h1>
            <p className={styles.subtitle}>
              Keep track of fireworks you love for Diwali, weddings, and parties.
            </p>
          </div>

          {wishlist.length > 0 && (
            <div className={styles.headerActions}>
              <button
                type="button"
                onClick={handleAddAllToCart}
                className="btn-aurora-gold"
              >
                + Add All ({wishlist.length}) to Cart
              </button>
              <button
                type="button"
                onClick={clearWishlist}
                className={styles.clearBtn}
              >
                Clear Wishlist
              </button>
            </div>
          )}
        </div>

        {/* Content */}
        {wishlist.length === 0 ? (
          <div className={styles.emptyCard}>
            <div className={styles.emptyIcon}>✦</div>
            <h2 className={styles.emptyTitle}>Your Wishlist is Empty</h2>
            <p className={styles.emptyDesc}>
              Tap the heart icon on any firework in our catalog to save it here for later.
            </p>
            <Link href="/catalog" className="btn-aurora-gold">
              Explore Fireworks Catalog
            </Link>
          </div>
        ) : (
          <div className={styles.grid}>
            {wishlist.map((item) => (
              <div key={item.id} className={styles.card}>
                <div className={styles.imgWrap}>
                  <Link href={`/catalog/product/${item.id}`}>
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={280}
                      height={280}
                      className={styles.image}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/logo-62.png'
                      }}
                    />
                  </Link>

                  <button
                    type="button"
                    onClick={() => removeFromWishlist(item.id)}
                    className={styles.removeBtn}
                    aria-label={`Remove ${item.name} from wishlist`}
                    title="Remove"
                  >
                    ✕
                  </button>
                </div>

                <div className={styles.cardBody}>
                  <span className={styles.brand}>{item.brand || 'Original Sivakasi'}</span>
                  <Link href={`/catalog/product/${item.id}`} className={styles.nameLink}>
                    <h3 className={styles.name}>{item.name}</h3>
                  </Link>

                  <div className={styles.priceRow}>
                    <span className={styles.price}>₹{item.price.toLocaleString('en-IN')}</span>
                    {item.originalPrice > item.price && (
                      <span className={styles.originalPrice}>
                        ₹{item.originalPrice.toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      addToCart({
                        id: item.id,
                        name: item.name,
                        brand: item.brand,
                        category: item.category,
                        price: item.price,
                        originalPrice: item.originalPrice,
                        image: item.image,
                      })
                      openDrawer()
                    }}
                    className={styles.addToCartBtn}
                  >
                    + Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
