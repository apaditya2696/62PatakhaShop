'use client'
import { useEffect, useRef } from 'react'

// Authentic high-grade Diwali fireworks color palettes
const PALETTES = [
  {
    name: 'royal-diwali', // Rani Pink, Gold, Champagne, White
    colors: ['#FF007F', '#FF1493', '#FFD700', '#FFA500', '#FFF5B8', '#FFFFFF'],
  },
  {
    name: 'electric-sky', // Cyan, Sky Blue, Royal Violet, Strobe White
    colors: ['#00F5FF', '#00BFFF', '#9D4EDD', '#7B2CBF', '#E0AAFF', '#FFFFFF'],
  },
  {
    name: 'golden-kamuro', // 24K Weeping Gold, Amber Spark, Champagne
    colors: ['#FFD700', '#FFB703', '#FB8500', '#FFE66D', '#FFF3B0', '#FFFFFF'],
  },
  {
    name: 'emerald-aurora', // Vivid Emerald, Mint Gold, Coral Ruby
    colors: ['#00FF88', '#05D577', '#FFD700', '#FF3366', '#FF5D8F', '#FFFFFF'],
  },
  {
    name: 'multi-celebration', // Sivakasi Festive Multi-Colour Shell
    colors: ['#FF2A6D', '#05D9E8', '#FFD166', '#06D6A0', '#F72585', '#FFFFFF'],
  },
]

interface TrailPoint {
  x: number
  y: number
}

interface Spark {
  x: number
  y: number
  vx: number
  vy: number
  alpha: number
  decay: number
  color: string
  size: number
  gravity: number
  friction: number
  flicker: boolean
  trail: TrailPoint[]
  maxTrail: number
  isWillow?: boolean
  canCrackle?: boolean
  crackleDone?: boolean
}

interface Shockwave {
  x: number
  y: number
  radius: number
  maxRadius: number
  alpha: number
  color: string
}

interface Rocket {
  x: number
  y: number
  targetY: number
  color: string
  palette: string[]
  vy: number
  vx: number
  trail: TrailPoint[]
  burstType: 'peony' | 'kamuro' | 'ring' | 'crackle'
  fizzTimer: number
}

interface FireworksCanvasProps {
  mode?: 'hero' | 'full'
}

export default function FireworksCanvas({ mode = 'hero' }: FireworksCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    let rafId = 0
    let isVisible = true
    let width = 0
    let height = 0

    const rockets: Rocket[] = []
    let freeSparks: Spark[] = []
    const shockwaves: Shockwave[] = []

    // High performance size sync with DPR clamp for mobile GPU speed
    const handleResize = () => {
      const rect = canvas.getBoundingClientRect()
      const newW = Math.floor(rect.width)
      const newH = Math.floor(rect.height)
      if (newW === width && newH === height && canvas.width > 0) return

      width = Math.max(newW, 100)
      height = Math.max(newH, 100)
      const dpr = Math.min(window.devicePixelRatio || 1, 1.25)
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    handleResize()

    const ro = new ResizeObserver(handleResize)
    ro.observe(canvas)

    // Zero-overhead pause when scrolled out of view
    const io = new IntersectionObserver(
      ([entry]) => {
        const wasVisible = isVisible
        isVisible = entry.isIntersecting
        if (!wasVisible && isVisible) {
          lastTime = performance.now()
          rafId = requestAnimationFrame(renderLoop)
        }
      },
      { threshold: 0 }
    )
    io.observe(canvas)

    const randomPalette = () => PALETTES[Math.floor(Math.random() * PALETTES.length)]

    const isFullMode = mode === 'full'
    const maxRockets = isFullMode ? 4 : 3

    function getCeilingLimit() {
      const isMobile = width < 600
      if (isMobile) return Math.max(height * 0.14, 52)
      if (isFullMode) return Math.max(height * 0.14, 55)
      return Math.max(height * 0.12, 70)
    }

    function spawnRocket(targetX?: number, targetY?: number) {
      if (rockets.length >= maxRockets) return

      const pal = randomPalette()
      const isMobile = width < 600
      const ceilingLimit = getCeilingLimit()

      // Horizontal positioning strictly padded away from canvas borders
      const startX = targetX !== undefined
        ? Math.max(25, Math.min(width - 25, targetX))
        : isFullMode
        ? width * (0.16 + Math.random() * 0.68)
        : isMobile
        ? width * (0.35 + Math.random() * 0.32)
        : width * (0.22 + Math.random() * 0.56)

      const startY = height + 12

      // Burst altitude: higher altitude for grand, elevated sky shots
      const maxAlt = height * (isMobile ? 0.36 : isFullMode ? 0.40 : 0.35)
      const altRange = Math.max(20, maxAlt - ceilingLimit)
      const destY = targetY !== undefined
        ? Math.max(targetY, ceilingLimit)
        : ceilingLimit + Math.random() * altRange

      const types: ('peony' | 'kamuro' | 'ring' | 'crackle')[] = [
        'peony', 'kamuro', 'crackle', 'peony', 'kamuro', 'ring'
      ]
      const burstType = types[Math.floor(Math.random() * types.length)]

      // Keep rocket horizontal drift minimal so it doesn't drift toward screen edges
      const vx = (Math.random() - 0.5) * (isMobile ? 0.35 : 0.6)
      const vy = -(8.5 + Math.random() * 3.0)

      rockets.push({
        x: startX,
        y: startY,
        targetY: destY,
        color: pal.colors[0],
        palette: pal.colors,
        vx,
        vy,
        trail: [],
        burstType,
        fizzTimer: 0,
      })
    }

    function explode(rocket: Rocket) {
      const palette = rocket.palette
      const isKamuro = rocket.burstType === 'kamuro'
      const isCrackle = rocket.burstType === 'crackle'
      const isRing = rocket.burstType === 'ring'
      const isMobile = width < 600
      const ceilingLimit = getCeilingLimit()

      // Ensure explosion origin stays comfortably within safe boundary
      const burstX = Math.max(30, Math.min(width - 30, rocket.x))
      const burstY = Math.max(ceilingLimit, Math.min(height - 40, rocket.y))

      // Instant shockwave detonation flash ring
      shockwaves.push({
        x: burstX,
        y: burstY,
        radius: 3,
        maxRadius: isKamuro ? (isMobile ? 26 : 36) : (isMobile ? 20 : 28),
        alpha: 0.95,
        color: palette[0] || '#FFFFFF',
      })

      // Rich particle count for celebratory impact, scaled for mobile clarity
      const baseCount = isKamuro
        ? 65 + Math.floor(Math.random() * 15)
        : isRing
        ? 46
        : 54 + Math.floor(Math.random() * 12)
      const count = isMobile ? Math.floor(baseCount * 0.8) : baseCount

      const ringAngleOffset = Math.random() * Math.PI
      const speedScale = isMobile ? 0.72 : 1.0

      for (let i = 0; i < count; i++) {
        let angle = (i / count) * Math.PI * 2
        let speed: number

        if (isRing) {
          speed = (3.5 + (Math.random() - 0.5) * 0.3) * speedScale
          angle = ringAngleOffset + (i / count) * Math.PI * 2
        } else if (isKamuro) {
          speed = (1.8 + Math.random() * 4.2) * speedScale
          angle = (i / count) * Math.PI * 2
        } else {
          speed = (2.4 + Math.random() * 3.8) * speedScale
          angle += (Math.random() - 0.5) * 0.22
        }

        const color = isKamuro
          ? palette[Math.floor(Math.random() * 3)] // Gold / amber dominance
          : palette[Math.floor(Math.random() * palette.length)]

        freeSparks.push({
          x: burstX,
          y: burstY,
          vx: Math.cos(angle) * speed + (isRing ? 0 : (Math.random() - 0.5) * 0.3),
          vy: Math.sin(angle) * speed - (isKamuro ? 0.30 : 0.50),
          alpha: 1,
          decay: isKamuro
            ? 0.008 + Math.random() * 0.006 // Long lingering golden weeping willow
            : 0.012 + Math.random() * 0.008,
          color,
          size: isKamuro ? 1.7 + Math.random() * 0.7 : 2.0 + Math.random() * 0.8,
          gravity: isKamuro ? 0.10 : 0.08,
          friction: isKamuro ? 0.966 : 0.958,
          flicker: isCrackle || Math.random() > 0.3,
          trail: [],
          maxTrail: isKamuro ? (isMobile ? 4 : 6) : (isMobile ? 3 : 4),
          isWillow: isKamuro,
          canCrackle: isCrackle && Math.random() > 0.4,
          crackleDone: false,
        })
      }

      // Brilliant hot-white core star flash
      const flashCount = isMobile ? 8 : 12
      for (let c = 0; c < flashCount; c++) {
        const cAngle = Math.random() * Math.PI * 2
        const cSpd = (0.7 + Math.random() * 2.0) * speedScale
        freeSparks.push({
          x: burstX,
          y: burstY,
          vx: Math.cos(cAngle) * cSpd,
          vy: Math.sin(cAngle) * cSpd,
          alpha: 1,
          decay: 0.042,
          color: '#FFFFFF',
          size: 2.6,
          gravity: 0.02,
          friction: 0.91,
          flicker: true,
          trail: [],
          maxTrail: 2,
        })
      }
    }

    let lastTime = performance.now()
    let spawnTimer = 0
    let nextSpawnDelay = isFullMode ? 500 : 700

    function renderLoop(currentTime: number) {
      if (!ctx || !isVisible) {
        rafId = 0
        return
      }

      rafId = requestAnimationFrame(renderLoop)

      const elapsed = currentTime - lastTime
      lastTime = currentTime

      const dt = Math.min(Math.max(elapsed / 16.67, 0.4), 2.2)
      const isMobile = width < 600
      const ceilingLimit = getCeilingLimit()

      // 1. Instant GPU clear
      ctx.clearRect(0, 0, width, height)

      // 2. Additive blending: vibrant glowing pyrotechnics
      ctx.globalCompositeOperation = 'lighter'

      // Periodic automatic launch
      spawnTimer += elapsed
      if (spawnTimer >= nextSpawnDelay) {
        spawnTimer = 0
        nextSpawnDelay = isFullMode
          ? 850 + Math.random() * 650
          : 950 + Math.random() * 750
        spawnRocket()
      }

      // ── Draw Shockwaves ──
      for (let i = shockwaves.length - 1; i >= 0; i--) {
        const sw = shockwaves[i]
        sw.radius += 3.2 * dt
        sw.alpha -= 0.068 * dt

        // Early fade if shockwave approaches canvas edge
        if (
          sw.alpha <= 0.02 ||
          sw.radius >= sw.maxRadius ||
          sw.x - sw.radius <= 0 ||
          sw.x + sw.radius >= width ||
          sw.y - sw.radius <= 0
        ) {
          shockwaves.splice(i, 1)
          continue
        }

        ctx.save()
        ctx.beginPath()
        ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2)
        ctx.strokeStyle = sw.color
        ctx.lineWidth = 2.2
        ctx.globalAlpha = Math.max(0, sw.alpha)
        ctx.stroke()
        ctx.restore()
      }

      // ── Update & Draw Ascending Rockets ──
      for (let i = rockets.length - 1; i >= 0; i--) {
        const r = rockets[i]
        r.trail.unshift({ x: r.x, y: r.y })
        if (r.trail.length > 5) r.trail.pop()

        r.x += r.vx * dt
        r.y += r.vy * dt
        r.vy += 0.08 * dt

        // Draw ascending rocket tracer tail
        if (r.trail.length >= 2) {
          ctx.beginPath()
          ctx.moveTo(r.trail[0].x, r.trail[0].y)
          for (let t = 1; t < r.trail.length; t++) {
            ctx.lineTo(r.trail[t].x, r.trail[t].y)
          }
          ctx.strokeStyle = r.color
          ctx.lineWidth = 2.4
          ctx.lineCap = 'round'
          ctx.globalAlpha = 0.9
          ctx.stroke()
        }

        // Rocket burning head (hot white glowing tip)
        ctx.beginPath()
        ctx.arc(r.x, r.y, 2.4, 0, Math.PI * 2)
        ctx.fillStyle = '#FFFFFF'
        ctx.globalAlpha = 1
        ctx.fill()

        // Ascending golden sparks trail
        r.fizzTimer += dt
        if (r.fizzTimer >= 0.8) {
          r.fizzTimer = 0
          freeSparks.push({
            x: r.x + (Math.random() - 0.5) * 3,
            y: r.y + 4,
            vx: (Math.random() - 0.5) * 0.8,
            vy: 1.2 + Math.random() * 2.0,
            alpha: 0.9,
            decay: 0.05,
            color: '#FFA500',
            size: 1.4,
            gravity: 0.06,
            friction: 0.93,
            flicker: true,
            trail: [],
            maxTrail: 2,
          })
        }

        // Strict ceiling guard: detonate if reached target altitude, reached ceiling limit, or upward momentum stalled
        if (r.y <= r.targetY || r.y <= ceilingLimit || r.vy >= -0.8) {
          explode(r)
          rockets.splice(i, 1)
        }
      }

      // ── Update & Draw Burst Sparks ──
      const aliveSparks: Spark[] = []
      const edgeFadeMargin = 22

      for (let i = 0; i < freeSparks.length; i++) {
        const s = freeSparks[i]

        s.trail.unshift({ x: s.x, y: s.y })
        if (s.trail.length > s.maxTrail) s.trail.pop()

        s.x += s.vx * dt
        s.y += s.vy * dt

        s.vx *= Math.pow(s.friction, dt)
        s.vy = (s.vy + s.gravity * dt) * Math.pow(s.friction, dt)
        s.alpha -= s.decay * dt

        // ── BOUNDARY CONTAINMENT: Soft edge dissolve ──
        // Seamlessly fades out particles before they ever contact screen edges
        if (s.y < edgeFadeMargin) {
          const factor = Math.max(0, s.y / edgeFadeMargin)
          s.alpha = Math.min(s.alpha, factor * 0.75)
          if (s.y <= 2) s.alpha = 0
        }
        if (s.x < edgeFadeMargin) {
          const factor = Math.max(0, s.x / edgeFadeMargin)
          s.alpha = Math.min(s.alpha, factor * 0.75)
          if (s.x <= 2) s.alpha = 0
        } else if (s.x > width - edgeFadeMargin) {
          const factor = Math.max(0, (width - s.x) / edgeFadeMargin)
          s.alpha = Math.min(s.alpha, factor * 0.75)
          if (s.x >= width - 2) s.alpha = 0
        }
        if (s.y > height - 12) {
          const factor = Math.max(0, (height - s.y) / 12)
          s.alpha = Math.min(s.alpha, factor * 0.75)
          if (s.y >= height - 2) s.alpha = 0
        }

        // Secondary crackle pop (only if well inside screen bounds)
        if (s.canCrackle && !s.crackleDone && s.alpha < 0.25 && s.y > 30 && s.x > 30 && s.x < width - 30) {
          s.crackleDone = true
          for (let k = 0; k < 3; k++) {
            const pAngle = Math.random() * Math.PI * 2
            aliveSparks.push({
              x: s.x,
              y: s.y,
              vx: Math.cos(pAngle) * 1.8 * (isMobile ? 0.7 : 1),
              vy: Math.sin(pAngle) * 1.8 * (isMobile ? 0.7 : 1),
              alpha: 0.9,
              decay: 0.08,
              color: '#FFFFFF',
              size: 1.2,
              gravity: 0.05,
              friction: 0.92,
              flicker: true,
              trail: [],
              maxTrail: 2,
            })
          }
        }

        if (s.alpha <= 0.015) continue

        const currentAlpha = s.flicker && Math.random() > 0.35
          ? s.alpha * 0.5
          : s.alpha

        // 1. Glowing streamer trail
        if (s.trail.length >= 2) {
          ctx.beginPath()
          ctx.moveTo(s.trail[0].x, s.trail[0].y)
          for (let t = 1; t < s.trail.length; t++) {
            ctx.lineTo(s.trail[t].x, s.trail[t].y)
          }
          ctx.strokeStyle = s.color
          ctx.lineWidth = s.isWillow ? s.size * 0.85 : s.size
          ctx.lineCap = 'round'
          ctx.globalAlpha = Math.max(0, Math.min(currentAlpha * 0.85, 1))
          ctx.stroke()
        }

        // 2. Glowing star head
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.isWillow ? s.size * 0.85 : s.size, 0, Math.PI * 2)
        ctx.fillStyle = s.color
        ctx.globalAlpha = Math.max(0, Math.min(currentAlpha, 1))
        ctx.fill()

        // 3. Hot-white burning core center
        if (currentAlpha > 0.35) {
          ctx.beginPath()
          ctx.arc(s.x, s.y, s.size * 0.42, 0, Math.PI * 2)
          ctx.fillStyle = '#FFFFFF'
          ctx.globalAlpha = Math.min(1, currentAlpha * 1.1)
          ctx.fill()
        }

        aliveSparks.push(s)
      }
      freeSparks = aliveSparks

      ctx.globalAlpha = 1
      ctx.globalCompositeOperation = 'source-over'
    }

    // Launch initial celebratory bursts on load safely within boundary limits
    const initialCeiling = getCeilingLimit()
    if (isFullMode) {
      spawnRocket(width * 0.28, Math.max(height * 0.25, initialCeiling + 15))
      setTimeout(() => spawnRocket(width * 0.72, Math.max(height * 0.28, initialCeiling + 15)), 280)
      setTimeout(() => spawnRocket(width * 0.50, Math.max(height * 0.18, initialCeiling + 10)), 600)
    } else {
      const isMobile = width < 600
      spawnRocket(
        width * (isMobile ? 0.45 : 0.36),
        Math.max(height * (isMobile ? 0.24 : 0.24), initialCeiling + 15)
      )
      setTimeout(() => spawnRocket(
        width * (isMobile ? 0.58 : 0.62),
        Math.max(height * (isMobile ? 0.18 : 0.18), initialCeiling + 10)
      ), 320)
    }

    rafId = requestAnimationFrame(renderLoop)

    return () => {
      cancelAnimationFrame(rafId)
      ro.disconnect()
      io.disconnect()
    }
  }, [mode])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        display: 'block',
      }}
    />
  )
}
