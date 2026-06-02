const db = require('./db');

/**
 * Simple in-memory rate limiter
 * Uses a rolling window approach
 */
class RateLimiter {
  constructor() {
    this.windows = new Map();
    // Cleanup old entries every 5 minutes
    setInterval(() => this.cleanup(), 5 * 60 * 1000);
  }

  /**
   * Check if a request is allowed
   * @param {string} key - API key to check
   * @param {number} limit - Max requests in window
   * @param {number} windowMs - Window in ms (default: 1 day = 86400000)
   * @returns {{ allowed: boolean, remaining: number, resetAt: number }}
   */
  check(key, limit, windowMs = 86400000) {
    const now = Date.now();
    const windowKey = `${key}:${Math.floor(now / windowMs)}`;

    if (!this.windows.has(windowKey)) {
      this.windows.set(windowKey, { count: 0, key });
    }

    const entry = this.windows.get(windowKey);
    entry.count++;

    const windowStart = Math.floor(now / windowMs) * windowMs;
    const resetAt = windowStart + windowMs;
    const remaining = Math.max(0, limit - entry.count);

    return {
      allowed: entry.count <= limit,
      remaining,
      resetAt,
    };
  }

  /**
   * Express middleware for rate limiting
   */
  middleware(req, res, next) {
    const keyInfo = req.apiKeyInfo;
    if (!keyInfo) return next();

    const limit = keyInfo.rate_limit || 100;
    const result = this.check(keyInfo.key, limit);

    // Set rate limit headers
    res.set('X-RateLimit-Limit', String(limit));
    res.set('X-RateLimit-Remaining', String(result.remaining));
    res.set('X-RateLimit-Reset', String(Math.floor(result.resetAt / 1000)));

    if (!result.allowed) {
      return res.status(429).json({
        error: 'Rate limit exceeded',
        limit,
        remaining: 0,
        reset_at: new Date(result.resetAt).toISOString(),
      });
    }

    next();
  }

  /**
   * Cleanup old windows
   */
  cleanup() {
    const now = Date.now();
    for (const [key, entry] of this.windows.entries()) {
      const windowEnd = parseInt(key.split(':').pop()) + 86400000;
      if (now > windowEnd) {
        this.windows.delete(key);
      }
    }
  }
}

module.exports = new RateLimiter();
