'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import styles from './ImageReveal.module.css'

interface ImageRevealProps {
  src: string
  alt: string
  aspectRatio?: string
  width?: number
  height?: number
  fill?: boolean
  sizes?: string
  priority?: boolean
  className?: string
  overlayContent?: React.ReactNode
}

export default function ImageReveal({
  src,
  alt,
  aspectRatio = '4/5',
  width,
  height,
  fill = false,
  sizes,
  priority = false,
  className = '',
  overlayContent,
}: ImageRevealProps) {
  const [isLoaded, setIsLoaded] = useState(false)

  return (
    <div
      className={`${styles.container} ${className}`}
      style={{ aspectRatio: fill ? undefined : aspectRatio }}
    >
      <div className={`${styles.imageWrapper} ${isLoaded ? styles.revealed : ''}`}>
        {fill ? (
          <Image
            src={src}
            alt={alt}
            fill
            quality={95}
            sizes={sizes || '(max-width: 768px) 100vw, 50vw'}
            priority={priority}
            className={styles.image}
            onLoad={() => setIsLoaded(true)}
          />
        ) : (
          <Image
            src={src}
            alt={alt}
            width={width || 600}
            height={height || 600}
            quality={95}
            priority={priority}
            className={styles.image}
            onLoad={() => setIsLoaded(true)}
          />
        )}
      </div>
      {overlayContent && <div className={styles.overlay}>{overlayContent}</div>}
    </div>
  )
}
