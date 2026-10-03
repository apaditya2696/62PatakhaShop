'use client'

import React, { useEffect, useRef } from 'react'

interface FireworksSparkHoverProps {
  children: React.ReactNode
  className?: string
  sparkColor?: string
}

export default function FireworksSparkHover({
  children,
  className = '',
  sparkColor = '#C99E52'
}: FireworksSparkHoverProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<{ x: number; y: number; vx: number; vy: number; life: number; maxLife: number; size: number; alpha: number }[]>([])
  const animFrameRef = useRef<number | null>(null)
  const isHoveredRef = useRef(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const updateSize = () => {
      if (!containerRef.current || !canvas) return
      const rect = containerRef.current.getBoundingClientRect()
      canvas.width = rect.width
      canvas.height = rect.height
    }

    updateSize()
    window.addEventListener('resize', updateSize)

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Only add particles if user hovered
      if (isHoveredRef.current && Math.random() < 0.25) {
        const x = Math.random() * canvas.width
        const y = Math.random() * canvas.height
        for (let i = 0; i < 4; i++) {
          const angle = Math.random() * Math.PI * 2
          const speed = 0.5 + Math.random() * 1.5
          particlesRef.current.push({
            x,
            y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed - 0.2,
            life: 0,
            maxLife: 20 + Math.random() * 25,
            size: 1 + Math.random() * 1.5,
            alpha: 0.9
          })
        }
      }

      // Draw and update active particles
      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const p = particlesRef.current[i]
        p.x += p.vx
        p.y += p.vy
        p.life++
        p.alpha = Math.max(0, 1 - (p.life / p.maxLife))

        if (p.life >= p.maxLife) {
          particlesRef.current.splice(i, 1)
          continue
        }

        ctx.save()
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = sparkColor
        ctx.globalAlpha = p.alpha * 0.75
        ctx.shadowColor = sparkColor
        ctx.shadowBlur = 4
        ctx.fill()
        ctx.restore()
      }

      if (particlesRef.current.length > 0 || isHoveredRef.current) {
        animFrameRef.current = requestAnimationFrame(render)
      } else {
        animFrameRef.current = null
      }
    }

    const onMouseEnter = () => {
      isHoveredRef.current = true
      if (!animFrameRef.current) {
        animFrameRef.current = requestAnimationFrame(render)
      }
    }

    const onMouseLeave = () => {
      isHoveredRef.current = false
    }

    const el = containerRef.current
    if (el) {
      el.addEventListener('mouseenter', onMouseEnter)
      el.addEventListener('mouseleave', onMouseLeave)
    }

    return () => {
      window.removeEventListener('resize', updateSize)
      if (el) {
        el.removeEventListener('mouseenter', onMouseEnter)
        el.removeEventListener('mouseleave', onMouseLeave)
      }
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current)
      }
    }
  }, [sparkColor])

  return (
    <div ref={containerRef} style={{ position: 'relative' }} className={className}>
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 5,
        }}
      />
      {children}
    </div>
  )
}
