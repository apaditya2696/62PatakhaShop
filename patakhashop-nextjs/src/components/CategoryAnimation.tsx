'use client'
import React, { useEffect, useRef } from 'react'
import styles from './CategoryAnimation.module.css'

interface CategoryAnimationProps {
  slug: string
  isActive?: boolean
}

// Reusable color palettes for realistic fireworks
const COLORS = {
  gold: ['#FFE600', '#FFAA00', '#FF8800', '#FFF5C2', '#FFFFFF'],
  silver: ['#FFFFFF', '#E2E8F0', '#94A3B8', '#CBD5E1'],
  crimson: ['#FF0055', '#FF3366', '#FF6688', '#FFAAC2', '#FFFFFF'],
  emerald: ['#00FF88', '#00DD77', '#33FFBB', '#AAFFDD', '#FFFFFF'],
  cyan: ['#00F0FF', '#00BBFF', '#66EEFF', '#FFFFFF'],
  purple: ['#B800FF', '#D946EF', '#EC4899', '#FFAAF5', '#FFFFFF'],
  flame: ['#FF2200', '#FF6600', '#FFAA00', '#FFDD44', '#FFFFFF'],
}

export default function CategoryAnimation({ slug }: CategoryAnimationProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const animFrameId = useRef<number | null>(null)
  const isVisibleRef = useRef<boolean>(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    const dpr = typeof window !== 'undefined' ? Math.min(window.devicePixelRatio || 1, 2) : 1
    let width = canvas.offsetWidth || 280
    let height = canvas.offsetHeight || 160
    canvas.width = width * dpr
    canvas.height = height * dpr
    ctx.scale(dpr, dpr)

    // Normalize slug
    const normalizedSlug = slug.toLowerCase().replace(/_/g, '-')

    // Particle pool setup for zero garbage collection
    const MAX_PARTICLES = 70
    const particles: Array<{
      x: number
      y: number
      vx: number
      vy: number
      color: string
      size: number
      alpha: number
      decay: number
      gravity: number
      flicker: boolean
      active: boolean
      life: number
      maxLife: number
    }> = []

    for (let i = 0; i < MAX_PARTICLES; i++) {
      particles.push({
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        color: '#FFFFFF',
        size: 2,
        alpha: 0,
        decay: 0.02,
        gravity: 0,
        flicker: false,
        active: false,
        life: 0,
        maxLife: 1,
      })
    }

    const spawnParticle = (
      x: number,
      y: number,
      vx: number,
      vy: number,
      color: string,
      size: number,
      decay: number,
      gravity = 0,
      flicker = false
    ) => {
      const p = particles.find((item) => !item.active)
      if (!p) return
      p.x = x
      p.y = y
      p.vx = vx
      p.vy = vy
      p.color = color
      p.size = size
      p.alpha = 1
      p.decay = decay
      p.gravity = gravity
      p.flicker = flicker
      p.active = true
      p.life = 0
      p.maxLife = 1 / decay
    }

    let frameCount = 0
    let customState: Record<string, any> = {}

    // Initialize custom category state
    if (normalizedSlug === 'ring-caps') {
      customState = { angle: 0, hammerSnap: 0, flashAlpha: 0 }
    } else if (normalizedSlug === 'bombs') {
      customState = { fuseProgress: 0, shockwaveR: 0, shockwaveAlpha: 0, flashAlpha: 0 }
    } else if (normalizedSlug === 'chakkar') {
      customState = { spinAngle: 0, speed: 0.22 }
    } else if (normalizedSlug === 'crackers') {
      customState = { burstIdx: 0, nextBurstTime: 0 }
    } else if (normalizedSlug === 'skyshots') {
      customState = { rocketY: height, rocketActive: true, rocketVy: -4.5, burstDone: false }
    } else if (normalizedSlug === 'aerial-cakes') {
      customState = { shots: [] as Array<{ x: number; y: number; vx: number; vy: number; color: string; burst: boolean }> }
    } else if (normalizedSlug === 'rockets') {
      customState = { rocketY: height + 10, rocketX: width * 0.5, rocketVy: -5, tailSparks: 0 }
    } else if (normalizedSlug === 'torches') {
      customState = { flameHue: 30 }
    } else if (normalizedSlug === 'flowerpots') {
      customState = { fountainHeight: 0 }
    } else if (normalizedSlug === 'sparklers') {
      customState = { tipY: 20, tipX: width * 0.4 }
    } else if (normalizedSlug === 'kids-special') {
      customState = { pops: [] as Array<{ x: number; y: number; r: number; color: string; alpha: number }> }
    } else {
      // all
      customState = { burstTimer: 0 }
    }

    // Main animation step
    const render = () => {
      if (!isVisibleRef.current) return

      frameCount++
      ctx.clearRect(0, 0, width, height)

      // ─── 1. RING CAPS ───
      if (normalizedSlug === 'ring-caps') {
        const cx = width * 0.5
        const cy = height * 0.52
        const ringR = Math.min(width, height) * 0.32

        // Draw 8-chamber red cap ring
        ctx.save()
        ctx.translate(cx, cy)
        ctx.rotate(customState.angle)

        // Outer red plastic ring
        ctx.beginPath()
        ctx.arc(0, 0, ringR, 0, Math.PI * 2)
        ctx.strokeStyle = 'rgba(239, 68, 68, 0.4)'
        ctx.lineWidth = 14
        ctx.stroke()

        // Ring inner hub
        ctx.beginPath()
        ctx.arc(0, 0, ringR * 0.4, 0, Math.PI * 2)
        ctx.fillStyle = '#1E1B4B'
        ctx.fill()
        ctx.strokeStyle = '#F59E0B'
        ctx.lineWidth = 2
        ctx.stroke()

        // 8 Red Cap Cups
        for (let i = 0; i < 8; i++) {
          const a = (i * Math.PI * 2) / 8
          const cupX = Math.cos(a) * ringR
          const cupY = Math.sin(a) * ringR

          ctx.beginPath()
          ctx.arc(cupX, cupY, 5, 0, Math.PI * 2)
          ctx.fillStyle = i === 0 && customState.hammerSnap > 0 ? '#FFFFFF' : '#DC2626'
          ctx.shadowColor = '#EF4444'
          ctx.shadowBlur = 8
          ctx.fill()

          ctx.beginPath()
          ctx.arc(cupX, cupY, 2.5, 0, Math.PI * 2)
          ctx.fillStyle = '#991B1B'
          ctx.fill()
        }
        ctx.restore()

        // Hammer Striking Action
        if (frameCount % 45 === 0) {
          customState.hammerSnap = 1
          customState.flashAlpha = 1
          customState.angle += (Math.PI * 2) / 8

          // Spawn snap sparks
          const snapX = cx + Math.cos(customState.angle) * ringR
          const snapY = cy + Math.sin(customState.angle) * ringR
          for (let s = 0; s < 12; s++) {
            const spA = Math.random() * Math.PI * 2
            const spSpd = 1.5 + Math.random() * 3.5
            spawnParticle(
              snapX,
              snapY,
              Math.cos(spA) * spSpd,
              Math.sin(spA) * spSpd,
              COLORS.gold[Math.floor(Math.random() * COLORS.gold.length)],
              1.5 + Math.random() * 1.5,
              0.05 + Math.random() * 0.04,
              0.05
            )
          }
        }

        if (customState.flashAlpha > 0) {
          ctx.beginPath()
          ctx.arc(cx, cy, ringR * 1.4, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(255, 230, 0, ${customState.flashAlpha * 0.25})`
          ctx.fill()
          customState.flashAlpha -= 0.08
        }
      }

      // ─── 2. BOMBS ───
      else if (normalizedSlug === 'bombs') {
        const cx = width * 0.5
        const cy = height * 0.58
        const bombW = 34
        const bombH = 42

        // Bomb Body (Green/Red Sutli bomb pyramid/cylinder)
        ctx.save()
        // Sutli Bomb Box/Cone
        ctx.beginPath()
        ctx.roundRect(cx - bombW / 2, cy - bombH / 2, bombW, bombH, 6)
        const bombGrad = ctx.createLinearGradient(cx - bombW / 2, cy, cx + bombW / 2, cy)
        bombGrad.addColorStop(0, '#065F46')
        bombGrad.addColorStop(0.5, '#10B981')
        bombGrad.addColorStop(1, '#047857')
        ctx.fillStyle = bombGrad
        ctx.fill()
        ctx.strokeStyle = '#F59E0B'
        ctx.lineWidth = 1.5
        ctx.stroke()

        // Sutli Twine Cross Stripes
        ctx.beginPath()
        ctx.moveTo(cx - bombW / 2, cy - 8)
        ctx.lineTo(cx + bombW / 2, cy + 8)
        ctx.moveTo(cx - bombW / 2, cy + 8)
        ctx.lineTo(cx + bombW / 2, cy - 8)
        ctx.strokeStyle = '#D97706'
        ctx.lineWidth = 1.2
        ctx.stroke()

        // Burning Fuse
        const fuseStartX = cx
        const fuseStartY = cy - bombH / 2
        const fuseLen = 28
        const burnLen = fuseLen * (1 - (frameCount % 90) / 90)

        ctx.beginPath()
        ctx.moveTo(fuseStartX, fuseStartY)
        ctx.quadraticCurveTo(fuseStartX + 12, fuseStartY - 10, fuseStartX + 8, fuseStartY - burnLen)
        ctx.strokeStyle = '#78350F'
        ctx.lineWidth = 2
        ctx.stroke()

        // Spark at burning tip
        const sparkTipX = fuseStartX + 8 * (burnLen / fuseLen)
        const sparkTipY = fuseStartY - burnLen
        ctx.beginPath()
        ctx.arc(sparkTipX, sparkTipY, 4, 0, Math.PI * 2)
        ctx.fillStyle = '#FFE600'
        ctx.shadowColor = '#FF0055'
        ctx.shadowBlur = 12
        ctx.fill()

        // Emit fuse sparks
        if (frameCount % 3 === 0) {
          spawnParticle(
            sparkTipX,
            sparkTipY,
            (Math.random() - 0.5) * 2,
            -Math.random() * 2 - 0.5,
            COLORS.gold[Math.floor(Math.random() * COLORS.gold.length)],
            1.5,
            0.08,
            0.02
          )
        }

        // Bomb Detonation Flash & Shockwave
        if (frameCount % 90 === 89) {
          customState.shockwaveR = 5
          customState.shockwaveAlpha = 1
          customState.flashAlpha = 1

          for (let b = 0; b < 24; b++) {
            const bAng = (b * Math.PI * 2) / 24
            const bSpd = 2 + Math.random() * 4
            spawnParticle(
              cx,
              cy,
              Math.cos(bAng) * bSpd,
              Math.sin(bAng) * bSpd,
              COLORS.flame[Math.floor(Math.random() * COLORS.flame.length)],
              2 + Math.random() * 2,
              0.035,
              0.04
            )
          }
        }
        ctx.restore()

        // Draw Shockwave
        if (customState.shockwaveAlpha > 0) {
          ctx.beginPath()
          ctx.arc(cx, cy, customState.shockwaveR, 0, Math.PI * 2)
          ctx.strokeStyle = `rgba(255, 60, 0, ${customState.shockwaveAlpha})`
          ctx.lineWidth = 3
          ctx.stroke()
          customState.shockwaveR += 4.5
          customState.shockwaveAlpha -= 0.04
        }
      }

      // ─── 3. CHAKKAR ───
      else if (normalizedSlug === 'chakkar') {
        const cx = width * 0.5
        const cy = height * 0.52
        customState.spinAngle += customState.speed

        // Center spinning wheel
        ctx.save()
        ctx.translate(cx, cy)
        ctx.rotate(customState.spinAngle)

        // Chakkar Disk
        ctx.beginPath()
        ctx.arc(0, 0, 16, 0, Math.PI * 2)
        ctx.fillStyle = '#451A03'
        ctx.fill()
        ctx.strokeStyle = '#F59E0B'
        ctx.lineWidth = 2
        ctx.stroke()

        // 2 Curved Flame Exhausts
        for (let arm = 0; arm < 2; arm++) {
          const armAngle = (arm * Math.PI)
          const armX = Math.cos(armAngle) * 16
          const armY = Math.sin(armAngle) * 16

          // Spawn fast tangential fire sparks
          const tanAngle = armAngle + Math.PI / 2
          for (let p = 0; p < 2; p++) {
            const spd = 2.5 + Math.random() * 3.5
            const spread = (Math.random() - 0.5) * 0.4
            spawnParticle(
              cx + armX,
              cy + armY,
              Math.cos(tanAngle + spread) * spd,
              Math.sin(tanAngle + spread) * spd,
              COLORS.gold[Math.floor(Math.random() * COLORS.gold.length)],
              1.8 + Math.random() * 1.5,
              0.045,
              0.01,
              true
            )
          }
        }
        ctx.restore()

        // Glowing Whirlpool Aura
        ctx.beginPath()
        ctx.arc(cx, cy, 42, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(245, 158, 11, 0.06)'
        ctx.fill()
      }

      // ─── 4. CRACKERS / LAR ───
      else if (normalizedSlug === 'crackers') {
        const startX = width * 0.5
        const startY = 12
        const garlandH = height * 0.72

        // Draw hanging red garland twine
        ctx.beginPath()
        ctx.moveTo(startX, startY)
        ctx.lineTo(startX, startY + garlandH)
        ctx.strokeStyle = '#991B1B'
        ctx.lineWidth = 2
        ctx.stroke()

        // Draw red cracker capsules along string
        const totalCaps = 14
        for (let c = 0; c < totalCaps; c++) {
          const capY = startY + (c * garlandH) / totalCaps
          const side = c % 2 === 0 ? 1 : -1
          const capX = startX + side * 10

          ctx.beginPath()
          ctx.roundRect(capX - 4, capY - 2, 8, 4, 1)
          ctx.fillStyle = '#EF4444'
          ctx.fill()
        }

        // Sequential Crackling Bursts
        if (frameCount % 7 === 0) {
          const burstY = startY + Math.random() * garlandH
          const burstX = startX + (Math.random() - 0.5) * 18

          // Blinding flash dot
          ctx.beginPath()
          ctx.arc(burstX, burstY, 6, 0, Math.PI * 2)
          ctx.fillStyle = '#FFFFFF'
          ctx.shadowColor = '#FF0055'
          ctx.shadowBlur = 10
          ctx.fill()

          // Sparks shooting out
          for (let s = 0; s < 6; s++) {
            const spA = Math.random() * Math.PI * 2
            const spSpd = 1.5 + Math.random() * 3
            spawnParticle(
              burstX,
              burstY,
              Math.cos(spA) * spSpd,
              Math.sin(spA) * spSpd,
              COLORS.gold[Math.floor(Math.random() * COLORS.gold.length)],
              1.5,
              0.07,
              0.05
            )
          }
        }
      }

      // ─── 5. SKY SHOTS ───
      else if (normalizedSlug === 'skyshots') {
        const cx = width * 0.5
        const mortarY = height - 10

        // Draw Mortar Base Tube
        ctx.fillStyle = '#312E81'
        ctx.fillRect(cx - 7, mortarY - 18, 14, 18)
        ctx.strokeStyle = '#6366F1'
        ctx.lineWidth = 1.5
        ctx.strokeRect(cx - 7, mortarY - 18, 14, 18)

        // Rising shell rocket
        if (customState.rocketActive) {
          customState.rocketY += customState.rocketVy
          customState.rocketVy += 0.05 // deceleration

          // Draw ascending comet
          ctx.beginPath()
          ctx.arc(cx, customState.rocketY, 3, 0, Math.PI * 2)
          ctx.fillStyle = '#FFFFFF'
          ctx.shadowColor = '#00F0FF'
          ctx.shadowBlur = 12
          ctx.fill()

          // Trail sparks
          spawnParticle(
            cx + (Math.random() - 0.5) * 2,
            customState.rocketY + 4,
            (Math.random() - 0.5) * 0.8,
            1.5 + Math.random() * 1.5,
            '#00F0FF',
            1.5,
            0.08,
            0.02
          )

          // Apex detonation
          if (customState.rocketY <= height * 0.28 || customState.rocketVy >= -0.8) {
            customState.rocketActive = false
            const apexY = customState.rocketY

            // Huge Willow / Peony Burst
            const shellColors = Math.random() > 0.5 ? COLORS.cyan : COLORS.purple
            for (let i = 0; i < 36; i++) {
              const ang = (i * Math.PI * 2) / 36 + (Math.random() - 0.5) * 0.15
              const spd = 1.8 + Math.random() * 3.2
              spawnParticle(
                cx,
                apexY,
                Math.cos(ang) * spd,
                Math.sin(ang) * spd,
                shellColors[Math.floor(Math.random() * shellColors.length)],
                2,
                0.028 + Math.random() * 0.015,
                0.035,
                true
              )
            }
          }
        } else {
          // Restart rocket cycle after delay
          if (frameCount % 85 === 0) {
            customState.rocketY = mortarY - 18
            customState.rocketVy = -4.8
            customState.rocketActive = true
          }
        }
      }

      // ─── 6. AERIAL CAKES ───
      else if (normalizedSlug === 'aerial-cakes') {
        const boxX = width * 0.5 - 24
        const boxY = height - 22

        // Cake Box
        ctx.fillStyle = '#1E1B4B'
        ctx.fillRect(boxX, boxY, 48, 20)
        ctx.strokeStyle = '#EC4899'
        ctx.lineWidth = 1.5
        ctx.strokeRect(boxX, boxY, 48, 20)

        // Multiple Tube Outlets
        for (let t = 0; t < 5; t++) {
          ctx.beginPath()
          ctx.arc(boxX + 6 + t * 9, boxY + 3, 3, 0, Math.PI * 2)
          ctx.fillStyle = '#F43F5E'
          ctx.fill()
        }

        // Rapid Continuous Multi-Burst
        if (frameCount % 18 === 0) {
          const barrelIdx = Math.floor(Math.random() * 5)
          const bX = boxX + 6 + barrelIdx * 9
          const bAngle = -Math.PI / 2 + (barrelIdx - 2) * 0.28
          const bSpeed = 3.5 + Math.random() * 2

          // Burst apex
          const burstX = bX + Math.cos(bAngle) * 60
          const burstY = boxY - 50 - Math.random() * 30
          const palette = [COLORS.emerald, COLORS.crimson, COLORS.gold, COLORS.cyan][
            Math.floor(Math.random() * 4)
          ]

          // Shell burst in sky
          for (let k = 0; k < 18; k++) {
            const a = (k * Math.PI * 2) / 18
            const s = 1.2 + Math.random() * 2.5
            spawnParticle(
              burstX,
              burstY,
              Math.cos(a) * s,
              Math.sin(a) * s,
              palette[Math.floor(Math.random() * palette.length)],
              1.8,
              0.04,
              0.04,
              true
            )
          }
        }
      }

      // ─── 7. ROCKETS ───
      else if (normalizedSlug === 'rockets') {
        customState.rocketY += customState.rocketVy
        const rx = width * 0.52
        const ry = customState.rocketY

        // Draw Rocket Body & Guide Stick
        ctx.save()
        // Stick
        ctx.beginPath()
        ctx.moveTo(rx, ry + 12)
        ctx.lineTo(rx - 4, ry + 36)
        ctx.strokeStyle = '#B45309'
        ctx.lineWidth = 1.5
        ctx.stroke()

        // Rocket Cylinder
        ctx.fillStyle = '#EF4444'
        ctx.fillRect(rx - 3, ry - 6, 6, 18)

        // Nose Cone
        ctx.beginPath()
        ctx.moveTo(rx, ry - 14)
        ctx.lineTo(rx - 4, ry - 6)
        ctx.lineTo(rx + 4, ry - 6)
        ctx.closePath()
        ctx.fillStyle = '#F59E0B'
        ctx.fill()
        ctx.restore()

        // Thrust Plume & Sparks
        for (let t = 0; t < 3; t++) {
          spawnParticle(
            rx + (Math.random() - 0.5) * 3,
            ry + 12,
            (Math.random() - 0.5) * 1.5,
            2.5 + Math.random() * 3,
            COLORS.flame[Math.floor(Math.random() * COLORS.flame.length)],
            2,
            0.08,
            0.02
          )
        }

        // Top Apex Explosion & Reset
        if (customState.rocketY < height * 0.2) {
          for (let r = 0; r < 30; r++) {
            const rAng = (r * Math.PI * 2) / 30
            const rSpd = 2 + Math.random() * 3.5
            spawnParticle(
              rx,
              ry,
              Math.cos(rAng) * rSpd,
              Math.sin(rAng) * rSpd,
              COLORS.gold[Math.floor(Math.random() * COLORS.gold.length)],
              2,
              0.035,
              0.03,
              true
            )
          }
          customState.rocketY = height + 15
        }
      }

      // ─── 8. TORCHES ───
      else if (normalizedSlug === 'torches') {
        const torchX = width * 0.5
        const torchY = height * 0.76

        // Draw Color Torch Cylinder
        ctx.save()
        ctx.beginPath()
        ctx.roundRect(torchX - 6, torchY, 12, 34, 3)
        ctx.fillStyle = '#0F172A'
        ctx.fill()
        ctx.strokeStyle = '#06B6D4'
        ctx.lineWidth = 1.5
        ctx.stroke()
        ctx.restore()

        // Continuous High-Velocity Jet Flame
        for (let f = 0; f < 4; f++) {
          const spread = (Math.random() - 0.5) * 0.35
          const spd = 3.5 + Math.random() * 3.5
          spawnParticle(
            torchX + (Math.random() - 0.5) * 4,
            torchY,
            Math.sin(spread) * spd,
            -Math.cos(spread) * spd,
            COLORS.cyan[Math.floor(Math.random() * COLORS.cyan.length)],
            2.2,
            0.045,
            0.01
          )
        }
      }

      // ─── 9. FLOWERPOTS (ANAR) ───
      else if (normalizedSlug === 'flowerpots') {
        const potX = width * 0.5
        const potY = height - 12
        const potW = 28
        const potH = 26

        // Terracotta Anar Clay Pot
        ctx.save()
        ctx.beginPath()
        ctx.moveTo(potX - potW / 2, potY)
        ctx.lineTo(potX - 5, potY - potH)
        ctx.lineTo(potX + 5, potY - potH)
        ctx.lineTo(potX + potW / 2, potY)
        ctx.closePath()
        ctx.fillStyle = '#7C2D12'
        ctx.fill()
        ctx.strokeStyle = '#F59E0B'
        ctx.lineWidth = 1.5
        ctx.stroke()
        ctx.restore()

        // Volcanic Fountain Eruption
        const nozzleX = potX
        const nozzleY = potY - potH

        for (let s = 0; s < 5; s++) {
          const angle = -Math.PI / 2 + (Math.random() - 0.5) * 0.55
          const spd = 4 + Math.random() * 4.5
          spawnParticle(
            nozzleX + (Math.random() - 0.5) * 4,
            nozzleY,
            Math.cos(angle) * spd,
            Math.sin(angle) * spd,
            COLORS.gold[Math.floor(Math.random() * COLORS.gold.length)],
            1.8 + Math.random() * 1.2,
            0.038,
            0.12, // strong gravity creates cascading fountain arc
            true
          )
        }
      }

      // ─── 10. SPARKLERS ───
      else if (normalizedSlug === 'sparklers') {
        const startX = width * 0.25
        const startY = height * 0.8
        const tipX = width * 0.65
        const tipY = height * 0.25

        // Steel Wire Rod
        ctx.beginPath()
        ctx.moveTo(startX, startY)
        ctx.lineTo(tipX, tipY)
        ctx.strokeStyle = '#94A3B8'
        ctx.lineWidth = 2
        ctx.stroke()

        // Intense Molten Burning Tip
        ctx.beginPath()
        ctx.arc(tipX, tipY, 4.5, 0, Math.PI * 2)
        ctx.fillStyle = '#FFFFFF'
        ctx.shadowColor = '#FFE600'
        ctx.shadowBlur = 14
        ctx.fill()

        // Dancing Branching Sparkler Stars
        for (let sp = 0; sp < 6; sp++) {
          const ang = Math.random() * Math.PI * 2
          const dist = 2 + Math.random() * 4.5
          spawnParticle(
            tipX,
            tipY,
            Math.cos(ang) * dist,
            Math.sin(ang) * dist,
            COLORS.gold[Math.floor(Math.random() * COLORS.gold.length)],
            1.5 + Math.random() * 1.5,
            0.05 + Math.random() * 0.03,
            0.02,
            true
          )
        }
      }

      // ─── 11. KIDS SPECIAL ───
      else if (normalizedSlug === 'kids-special') {
        const cx = width * 0.5
        const cy = height * 0.5

        if (frameCount % 16 === 0) {
          const popX = cx + (Math.random() - 0.5) * 70
          const popY = cy + (Math.random() - 0.5) * 50
          const colors = [COLORS.cyan, COLORS.crimson, COLORS.gold, COLORS.emerald]
          const chosen = colors[Math.floor(Math.random() * colors.length)]

          for (let p = 0; p < 8; p++) {
            const a = (p * Math.PI * 2) / 8
            const spd = 1.5 + Math.random() * 2
            spawnParticle(
              popX,
              popY,
              Math.cos(a) * spd,
              Math.sin(a) * spd,
              chosen[Math.floor(Math.random() * chosen.length)],
              2,
              0.045,
              0.02,
              true
            )
          }
        }
      }

      // ─── 12. ALL FIREWORKS (GRAND FINALE) ───
      else {
        if (frameCount % 24 === 0) {
          const fx = width * 0.2 + Math.random() * width * 0.6
          const fy = height * 0.2 + Math.random() * height * 0.4
          const palette = [COLORS.gold, COLORS.crimson, COLORS.cyan, COLORS.purple][
            Math.floor(Math.random() * 4)
          ]

          for (let k = 0; k < 22; k++) {
            const a = (k * Math.PI * 2) / 22
            const s = 1.5 + Math.random() * 3
            spawnParticle(
              fx,
              fy,
              Math.cos(a) * s,
              Math.sin(a) * s,
              palette[Math.floor(Math.random() * palette.length)],
              2,
              0.032,
              0.03,
              true
            )
          }
        }
      }

      // ─── PARTICLE UPDATE & RENDER LOOP (Zero Memory Allocations) ───
      for (let i = 0; i < MAX_PARTICLES; i++) {
        const p = particles[i]
        if (!p.active) continue

        p.x += p.vx
        p.y += p.vy
        p.vy += p.gravity
        p.alpha -= p.decay

        if (p.alpha <= 0) {
          p.active = false
          continue
        }

        ctx.save()
        ctx.globalAlpha = Math.max(0, p.alpha)
        ctx.fillStyle = p.color
        if (p.flicker && Math.random() > 0.4) {
          ctx.globalAlpha *= 0.6
        }
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      }

      animFrameId.current = requestAnimationFrame(render)
    }

    // ─── INTERSECTION OBSERVER (Pauses animation when off-screen = 0% Lag, 0% CPU) ───
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          isVisibleRef.current = true
          if (!animFrameId.current) {
            animFrameId.current = requestAnimationFrame(render)
          }
        } else {
          isVisibleRef.current = false
          if (animFrameId.current) {
            cancelAnimationFrame(animFrameId.current)
            animFrameId.current = null
          }
        }
      },
      { threshold: 0.05 }
    )

    observer.observe(canvas)

    // Window resize observer
    const resizeObserver = new ResizeObserver(() => {
      const rect = canvas.getBoundingClientRect()
      if (rect.width > 0 && rect.height > 0) {
        width = rect.width
        height = rect.height
        canvas.width = width * dpr
        canvas.height = height * dpr
        ctx.scale(dpr, dpr)
      }
    })
    resizeObserver.observe(canvas)

    return () => {
      observer.disconnect()
      resizeObserver.disconnect()
      if (animFrameId.current) {
        cancelAnimationFrame(animFrameId.current)
      }
    }
  }, [slug])

  return (
    <div className={styles.animationContainer} aria-hidden="true">
      {/* Dynamic Deep Dark Celestial Backdrop */}
      <div className={`${styles.nightSky} ${styles['sky_' + slug.toLowerCase().replace(/_/g, '-')]}`} />
      
      {/* High-Performance 60FPS Particle Simulation Canvas */}
      <canvas ref={canvasRef} className={styles.fireworkCanvas} />

      {/* Specular Ambient Glow Aura */}
      <div className={styles.auraLight} />
    </div>
  )
}
