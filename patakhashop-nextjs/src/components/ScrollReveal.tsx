'use client'
import { useEffect } from 'react'

export default function ScrollReveal() {
  useEffect(() => {
    // If mobile or prefers-reduced-motion, all elements are already styled visible in CSS
    if (window.innerWidth <= 768) return

    const els = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-l, .reveal-r')
    if (!els.length) return

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const el = e.target as HTMLElement
            const delay = el.dataset.delay || '0'
            el.style.transitionDelay = `${Math.min(Number(delay), 150)}ms`
            el.classList.add('visible')
            obs.unobserve(el)
          }
        })
      },
      { threshold: 0.01, rootMargin: '120px 0px 80px 0px' }
    )
    els.forEach((el) => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  return null
}
