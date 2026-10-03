// In-memory token bucket rate limiter for API endpoints
// Suitable for Node.js / edge / serverless runtime instances without requiring external Redis

interface RateLimitRecord {
  tokens: number
  lastRefill: number
}

const ipBuckets = new Map<string, RateLimitRecord>()

// Periodically prune stale bucket entries every 5 minutes to prevent memory leaks
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now()
    for (const [key, record] of ipBuckets.entries()) {
      if (now - record.lastRefill > 1000 * 60 * 10) {
        ipBuckets.delete(key)
      }
    }
  }, 1000 * 60 * 5)
}

/**
 * Checks whether an incoming request from client IP is within rate limits.
 * @param ip Unique client identifier (IP or forwarded header)
 * @param limit Maximum tokens allowed in burst (e.g. 15 requests)
 * @param windowMs Window in milliseconds to regenerate tokens (e.g. 60,000 ms = 1 minute)
 */
export function checkRateLimit(
  ip: string,
  limit: number = 20,
  windowMs: number = 60000
): { allowed: boolean; remaining: number } {
  const now = Date.now()
  const cleanIp = ip || 'unknown-client'

  let record = ipBuckets.get(cleanIp)
  if (!record) {
    record = { tokens: limit - 1, lastRefill: now }
    ipBuckets.set(cleanIp, record)
    return { allowed: true, remaining: limit - 1 }
  }

  // Refill tokens based on elapsed time
  const timeElapsed = now - record.lastRefill
  const tokensToAdd = Math.floor((timeElapsed / windowMs) * limit)

  if (tokensToAdd > 0) {
    record.tokens = Math.min(limit, record.tokens + tokensToAdd)
    record.lastRefill = now
  }

  if (record.tokens > 0) {
    record.tokens -= 1
    return { allowed: true, remaining: record.tokens }
  }

  return { allowed: false, remaining: 0 }
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  const realIp = request.headers.get('x-real-ip')
  if (realIp) {
    return realIp.trim()
  }
  return '127.0.0.1'
}
