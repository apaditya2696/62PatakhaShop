'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import Image from 'next/image'
import styles from './RocketBoyHero.module.css'

interface BurstParticle {
  x: number
  y: number
  vx: number
  vy: number
  alpha: number
  color: string
  size: number
  decay: number
}

// Curated festive colors for grand screen burst
const BURST_COLORS = [
  '#FFD700', '#FFA500', '#FF007F', '#FF1493',
  '#00F5FF', '#00FF88', '#B026FF', '#FFFFFF', '#FF3366',
]

export default function RocketBoyHero() {
  const [animState, setAnimState] = useState<'idle' | 'igniting' | 'flying' | 'burst'>('idle')
  const [rocketTransform, setRocketTransform] = useState({
    x: 0,
    y: 0,
    scale: 0.25,
    rotateZ: -25,
    rotateX: 20,
    opacity: 0,
  })
  const [flashActive, setFlashActive] = useState(false)
  const [shockwaveActive, setShockwaveActive] = useState(false)
  const [bannerActive, setBannerActive] = useState(false)

  const cardRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const burstParticlesRef = useRef<BurstParticle[]>([])
  const rafRef = useRef<number>(0)
  const flightRafRef = useRef<number>(0)
  const autoTimerRef = useRef<NodeJS.Timeout | null>(null)
  const audioCtxRef = useRef<AudioContext | null>(null)

  // Safe synthesized sound effects via HTML5 Web Audio API
  const playSound = useCallback((type: 'whoosh' | 'pop') => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      if (!AudioCtx) return
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx()
      }
      const ctx = audioCtxRef.current
      if (ctx.state === 'suspended') {
        ctx.resume()
      }

      if (type === 'whoosh') {
        // Rocket ascending whoosh
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = 'sawtooth'
        osc.frequency.setValueAtTime(140, ctx.currentTime)
        osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 1.1)

        gain.gain.setValueAtTime(0.08, ctx.currentTime)
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.15)

        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.start()
        osc.stop(ctx.currentTime + 1.2)
      } else if (type === 'pop') {
        // Grand firework explosion pop
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = 'triangle'
        osc.frequency.setValueAtTime(120, ctx.currentTime)
        osc.frequency.exponentialRampToValueAtTime(35, ctx.currentTime + 0.35)

        gain.gain.setValueAtTime(0.22, ctx.currentTime)
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.55)

        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.start()
        osc.stop(ctx.currentTime + 0.6)
      }
    } catch {
      // Audio autoplay policy blocked or not supported - silently continue smoothly
    }
  }, [])

  // Full-screen burst explosion particle animation
  const triggerFullScreenBurst = useCallback(() => {
    playSound('pop')
    setFlashActive(true)
    setShockwaveActive(true)
    setBannerActive(true)

    setTimeout(() => setFlashActive(false), 650)
    setTimeout(() => setShockwaveActive(false), 900)
    setTimeout(() => setBannerActive(false), 1500)

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    // Generate 120 grand explosion particles
    const particles: BurstParticle[] = []
    const centerX = window.innerWidth / 2
    const centerY = window.innerHeight / 2

    for (let i = 0; i < 130; i++) {
      const angle = (i / 130) * Math.PI * 2 + (Math.random() - 0.5) * 0.25
      const speed = 4.5 + Math.random() * 14.5
      particles.push({
        x: centerX,
        y: centerY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        alpha: 1,
        color: BURST_COLORS[Math.floor(Math.random() * BURST_COLORS.length)],
        size: 2.2 + Math.random() * 3.5,
        decay: 0.012 + Math.random() * 0.018,
      })
    }
    burstParticlesRef.current = particles

    // Render loop for explosion
    cancelAnimationFrame(rafRef.current)
    let burstLastTime = performance.now()

    const burstLoop = (now: number) => {
      const dt = Math.min((now - burstLastTime) / 16.67, 2.5)
      burstLastTime = now

      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.globalCompositeOperation = 'lighter'

      const current = burstParticlesRef.current
      let anyAlive = false

      for (let i = 0; i < current.length; i++) {
        const p = current[i]
        p.x += p.vx * dt
        p.y += p.vy * dt
        p.vx *= Math.pow(0.96, dt)
        p.vy = (p.vy + 0.12 * dt) * Math.pow(0.96, dt)
        p.alpha -= p.decay * dt

        if (p.alpha <= 0.02) continue
        anyAlive = true

        ctx.globalAlpha = Math.max(0, Math.min(p.alpha, 1))
        ctx.fillStyle = p.color
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fill()

        // Glitter trail
        ctx.strokeStyle = p.color
        ctx.lineWidth = p.size * 0.7
        ctx.beginPath()
        ctx.moveTo(p.x, p.y)
        ctx.lineTo(p.x - p.vx * 1.8, p.y - p.vy * 1.8)
        ctx.stroke()
      }

      ctx.globalAlpha = 1
      ctx.globalCompositeOperation = 'source-over'

      if (anyAlive) {
        rafRef.current = requestAnimationFrame(burstLoop)
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        setAnimState('idle')
      }
    }

    rafRef.current = requestAnimationFrame(burstLoop)
  }, [playSound])

  // Launch sequence: Boy lights rocket -> Rocket flies in 3D towards user -> Fullscreen pop
  const launchRocket = useCallback(() => {
    if (animState !== 'idle') return

    setAnimState('igniting')

    // 1. Boy lights fuse with sparkler
    setTimeout(() => {
      setAnimState('flying')
      playSound('whoosh')

      // Starting coordinates from boy's launch stand
      const cardRect = cardRef.current?.getBoundingClientRect()
      const startX = cardRect ? cardRect.left + cardRect.width * 0.75 : window.innerWidth * 0.7
      const startY = cardRect ? cardRect.top + cardRect.height * 0.6 : window.innerHeight * 0.7

      // Destination: Center screen right in front of user camera
      const destX = window.innerWidth * 0.5
      const destY = window.innerHeight * 0.46

      const flightDuration = 1250 // ms
      const startTime = performance.now()

      const animateFlight = (now: number) => {
        const elapsed = now - startTime
        const progress = Math.min(elapsed / flightDuration, 1)

        // Ease-in acceleration (starts slow, whips towards camera)
        const t = Math.pow(progress, 1.6)

        // 3D trajectory: curves up and arches towards user
        const curX = startX + (destX - startX) * t
        const arcY = Math.sin(progress * Math.PI) * -160 // upward arch
        const curY = startY + (destY - startY) * t + arcY

        // Scale increases dramatically from 0.25 up to 5.2 (coming right at the user!)
        const curScale = 0.25 + Math.pow(progress, 2.2) * 5.2
        const curRotateZ = -25 + progress * 40
        const curRotateX = 20 - progress * 45

        setRocketTransform({
          x: curX,
          y: curY,
          scale: curScale,
          rotateZ: curRotateZ,
          rotateX: curRotateX,
          opacity: progress > 0.96 ? (1 - progress) / 0.04 : 1,
        })

        if (progress < 1) {
          flightRafRef.current = requestAnimationFrame(animateFlight)
        } else {
          // Reached the screen! Grand POP!
          setAnimState('burst')
          triggerFullScreenBurst()
        }
      }

      flightRafRef.current = requestAnimationFrame(animateFlight)
    }, 450)
  }, [animState, playSound, triggerFullScreenBurst])

  // Periodic auto-launch every 9.5 seconds & custom event listener
  useEffect(() => {
    const handleCustomLaunch = () => {
      launchRocket()
    }
    window.addEventListener('launch-rocket', handleCustomLaunch)

    autoTimerRef.current = setInterval(() => {
      if (animState === 'idle') {
        launchRocket()
      }
    }, 9500)

    return () => {
      window.removeEventListener('launch-rocket', handleCustomLaunch)
      if (autoTimerRef.current) clearInterval(autoTimerRef.current)
      cancelAnimationFrame(rafRef.current)
      cancelAnimationFrame(flightRafRef.current)
    }
  }, [animState, launchRocket])

  return (
    <>
      {/* ── Boy Character Interactive Card in Hero ── */}
      <div className={styles.boyWidget}>
        <div
          ref={cardRef}
          className={styles.boyCard}
          onClick={launchRocket}
          role="button"
          tabIndex={0}
          aria-label="Click to light the Diwali rocket"
          onKeyDown={(e) => e.key === 'Enter' && launchRocket()}
          title="Click to light the rocket!"
        >
          <Image
            src="/boy-lighting-rocket.webp"
            alt="Cute Indian boy in festive kurta lighting Diwali rocket"
            fill
            sizes="180px"
            className={styles.boyImg}
            priority
          />
          {/* Animated Sparkler tip glow */}
          <div className={styles.sparklerGlow} />
        </div>

        {/* Launch prompt badge */}
        <button
          type="button"
          className={styles.launchBadge}
          onClick={launchRocket}
        >
          <span className={styles.rocketIcon}>✦</span>
          <span>{animState === 'idle' ? 'Light Rocket!' : animState === 'flying' ? 'Whoosh!' : 'Boom!'}</span>
        </button>
      </div>

      {/* ════════════════════════════════════════════════
         FULL-SCREEN 3D ROCKET FLIGHT & BURST OVERLAY
         ════════════════════════════════════════════════ */}
      <div className={styles.overlay3D} aria-hidden="true">
        {/* Full-screen explosion particle canvas */}
        <canvas ref={canvasRef} className={styles.fullScreenCanvas} />

        {/* Screen Flash on burst */}
        <div className={`${styles.screenFlash} ${flashActive ? styles.screenFlashActive : ''}`} />

        {/* Shockwave expanding ring */}
        <div className={`${styles.shockwaveRing} ${shockwaveActive ? styles.shockwaveActive : ''}`} />

        {/* Celebratory Banner on burst */}
        <div className={`${styles.burstTitle} ${bannerActive ? styles.burstTitleActive : ''}`}>
          62 PATAKHA SHOP
        </div>

        {/* 3D Flying Rocket Model */}
        {animState === 'flying' && (
          <div
            className={styles.flyingRocketWrapper}
            style={{
              transform: `translate3d(${rocketTransform.x}px, ${rocketTransform.y}px, 0) scale(${rocketTransform.scale}) rotateZ(${rocketTransform.rotateZ}deg) rotateX(${rocketTransform.rotateX}deg)`,
              opacity: rocketTransform.opacity,
            }}
          >
            {/* High-detail vector SVG Rocket with Diwali livery & fiery exhaust */}
            <svg
              width="80"
              height="100"
              viewBox="0 0 80 100"
              fill="none"
              style={{ filter: 'drop-shadow(0 0 12px rgba(255, 215, 0, 0.85))' }}
            >
              {/* Rocket Nose Cone */}
              <polygon points="40,2 24,32 56,32" fill="#00E5FF" stroke="#FFFFFF" strokeWidth="1.5" />
              {/* Rocket Fuselage Body */}
              <rect x="24" y="32" width="32" height="42" rx="4" fill="#00B050" stroke="#FFD700" strokeWidth="1.5" />
              {/* Decorative Festive Diamond Livery */}
              <polygon points="40,36 50,46 40,56 30,46" fill="#FF007F" />
              <polygon points="40,58 48,66 40,74 32,66" fill="#FFD700" />
              <circle cx="40" cy="46" r="3.5" fill="#FFFFFF" />
              {/* Stabilizer Fins */}
              <polygon points="24,54 8,74 24,74" fill="#FF007F" />
              <polygon points="56,54 72,74 56,74" fill="#FF007F" />
              {/* Bamboo Launch Stick */}
              <line x1="38" y1="74" x2="36" y2="100" stroke="#D2B48C" strokeWidth="2.5" />
              {/* Rocket Engine Nozzle Flame / Exhaust */}
              <polygon points="34,74 46,74 40,94" fill="#FF4500" />
              <polygon points="36,74 44,74 40,88" fill="#FFD700" />
              <polygon points="38,74 42,74 40,82" fill="#FFFFFF" />
            </svg>
          </div>
        )}
      </div>
    </>
  )
}
