import { NextResponse } from 'next/server'
import crypto from 'crypto'

// In-memory IP Rate Limiter (5 attempts per 15 minutes)
const loginAttempts = new Map<string, { count: number; lockoutUntil: number }>()

function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0].trim()
  const realIp = request.headers.get('x-real-ip')
  if (realIp) return realIp.trim()
  return '127.0.0.1'
}

function isTimingSafeMatch(a: string, b: string): boolean {
  const bufA = Buffer.from(a, 'utf-8')
  const bufB = Buffer.from(b, 'utf-8')
  if (bufA.length !== bufB.length) {
    // Perform dummy timing execution to avoid early return timing leak
    crypto.timingSafeEqual(bufA, bufA)
    return false
  }
  return crypto.timingSafeEqual(bufA, bufB)
}

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request)
    const now = Date.now()

    // Check rate limiting lockout
    const attempt = loginAttempts.get(ip)
    if (attempt && attempt.lockoutUntil > now) {
      const remainingSec = Math.ceil((attempt.lockoutUntil - now) / 1000)
      return NextResponse.json(
        { success: false, error: `Too many failed attempts. Try again in ${remainingSec} seconds.` },
        { status: 429 }
      )
    }

    const { password } = await request.json()
    if (!password || typeof password !== 'string') {
      return NextResponse.json({ success: false, error: 'Password required' }, { status: 400 })
    }

    const ADMIN_KEY = (process.env.ADMIN_KEY && process.env.ADMIN_KEY.trim() !== '')
      ? process.env.ADMIN_KEY.trim()
      : 'patakha62admin'

    const isValid = isTimingSafeMatch(password, ADMIN_KEY)

    if (isValid) {
      // Clear rate limit record on successful login
      loginAttempts.delete(ip)

      const response = NextResponse.json({ success: true, authenticated: true })
      
      // Set secure httpOnly cookie
      response.cookies.set('62_admin_auth', 'true', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: 86400 * 7 // 7 days
      })

      return response
    } else {
      // Record failed attempt
      const currentCount = (attempt ? attempt.count : 0) + 1
      if (currentCount >= 5) {
        loginAttempts.set(ip, { count: currentCount, lockoutUntil: now + 15 * 60 * 1000 })
      } else {
        loginAttempts.set(ip, { count: currentCount, lockoutUntil: 0 })
      }

      return NextResponse.json(
        { success: false, error: `Incorrect password. ${5 - currentCount} attempts remaining.` },
        { status: 401 }
      )
    }
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid request' }, { status: 400 })
  }
}
