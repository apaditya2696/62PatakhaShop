'use client'

import React from 'react'
import Link from 'next/link'
import ImageReveal from './ImageReveal'
import { EDITORIAL_STORIES } from '@/data/stories'
import styles from './EditorialStory.module.css'

export default function EditorialStory() {
  const primaryStory = EDITORIAL_STORIES[0]
  const secondaryStories = EDITORIAL_STORIES.slice(1)

  return (
    <section className={styles.section}>
      <div className="editorial-container">
        <div className={styles.header}>
          <div>
            <span className="eyebrow-pill">Helpful Guides</span>
            <h2 className={styles.title}>Fireworks Guides &amp; Tips</h2>
          </div>
          <Link href="/stories" className={styles.viewAll}>
            Read All Guides <span>→</span>
          </Link>
        </div>

        <div className={styles.editorialGrid}>
          {/* Main Hero Story */}
          <Link href={`/stories/${primaryStory.slug}`} className={styles.mainStory}>
            <div className={styles.mainImageWrap}>
              <ImageReveal
                src={primaryStory.coverImage}
                alt={primaryStory.title}
                aspectRatio="16/10"
              />
              <div className={styles.categoryPill}>{primaryStory.collection}</div>
            </div>
            <div className={styles.mainStoryContent}>
              <div className={styles.metaRow}>
                <span>{primaryStory.date}</span>
                <span>•</span>
                <span>{primaryStory.readTime}</span>
              </div>
              <h3 className={styles.mainTitle}>{primaryStory.title}</h3>
              <p className={styles.mainExcerpt}>{primaryStory.excerpt}</p>
              <div className={styles.readMore}>
                <span>Read Full Guide</span>
                <span>→</span>
              </div>
            </div>
          </Link>

          {/* Secondary Stack */}
          <div className={styles.sideStack}>
            {secondaryStories.map((story) => (
              <Link key={story.slug} href={`/stories/${story.slug}`} className={styles.sideStory}>
                <div className={styles.sideImageWrap}>
                  <ImageReveal
                    src={story.coverImage}
                    alt={story.title}
                    aspectRatio="1/1"
                  />
                </div>
                <div className={styles.sideContent}>
                  <div className={styles.metaRowSmall}>
                    <span className={styles.sideCollection}>{story.collection}</span>
                    <span>{story.readTime}</span>
                  </div>
                  <h4 className={styles.sideTitle}>{story.title}</h4>
                  <p className={styles.sideExcerpt}>{story.subtitle}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
