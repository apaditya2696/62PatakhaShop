'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import styles from './PwaInstallBanner.module.css'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export default function PwaInstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showBanner, setShowBanner] = useState(false)
  const [isIos, setIsIos] = useState(false)

  useEffect(() => {
    // 1. Check if already running in standalone mode (PWA installed)
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true

    if (isStandalone) return

    // 2. Check if dismissed within last 7 days
    const dismissedUntil = localStorage.getItem('62_pwa_dismissed_until')
    if (dismissedUntil && Date.now() < Number(dismissedUntil)) return

    // 3. Detect iOS Safari
    const ua = window.navigator.userAgent.toLowerCase()
    const iosDevice = /iphone|ipad|ipod/.test(ua)
    if (iosDevice) {
      setIsIos(true)
      setShowBanner(true)
      return
    }

    // 4. Android / Chrome / Edge BeforeInstallPrompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      setShowBanner(true)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return
    deferredPrompt.prompt()
    const choiceResult = await deferredPrompt.userChoice
    if (choiceResult.outcome === 'accepted') {
      setShowBanner(false)
    }
    setDeferredPrompt(null)
  }

  const handleDismiss = () => {
    setShowBanner(false)
    // Dismiss for 7 days
    const sevenDaysMs = 7 * 24 * 60 * 60 * 1000
    localStorage.setItem('62_pwa_dismissed_until', String(Date.now() + sevenDaysMs))
  }

  if (!showBanner) return null

  return (
    <div className={styles.bannerWrap}>
      <div className={styles.leftSection}>
        <Image
          src="/logo-62.png"
          alt="62 Admin App"
          width={38}
          height={38}
          className={styles.appIcon}
        />
        <div>
          <div className={styles.titleText}>
            <span>Install 62 Admin Portal</span>
          </div>
          <p className={styles.subText}>
            {isIos
              ? "Tap Share (⎙/↑) ➔ 'Add to Home Screen' for 1-tap shop access"
              : 'Add to Home Screen for fast, 1-tap mobile billing'}
          </p>
        </div>
      </div>

      <div className={styles.rightSection}>
        {!isIos && deferredPrompt && (
          <button type="button" className={styles.btnInstall} onClick={handleInstallClick}>
            Install App
          </button>
        )}
        <button
          type="button"
          className={styles.btnClose}
          onClick={handleDismiss}
          title="Dismiss banner"
        >
          ✕
        </button>
      </div>
    </div>
  )
}
