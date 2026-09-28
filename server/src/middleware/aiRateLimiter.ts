import { Request, Response, NextFunction } from 'express';
import { ENV } from '../config/env.js';

interface RateLimitRecord {
  minuteCount: number;
  minuteResetAt: number;
  dayCount: number;
  dayResetAt: number;
}

const rateLimitStore = new Map<string, RateLimitRecord>();

// Clean up stale records periodically (every 10 minutes)
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of rateLimitStore.entries()) {
    if (now > record.dayResetAt) {
      rateLimitStore.delete(key);
    }
  }
}, 10 * 60 * 1000);

export function aiRateLimiter(req: Request, res: Response, next: NextFunction): void {
  const userId = (req as any).user?._id?.toString() || req.ip || 'anonymous';
  const now = Date.now();

  let record = rateLimitStore.get(userId);
  if (!record) {
    record = {
      minuteCount: 0,
      minuteResetAt: now + 60 * 1000,
      dayCount: 0,
      dayResetAt: now + 24 * 60 * 60 * 1000
    };
    rateLimitStore.set(userId, record);
  }

  // Reset 1-minute window if expired
  if (now > record.minuteResetAt) {
    record.minuteCount = 0;
    record.minuteResetAt = now + 60 * 1000;
  }

  // Reset 24-hour window if expired
  if (now > record.dayResetAt) {
    record.dayCount = 0;
    record.dayResetAt = now + 24 * 60 * 60 * 1000;
  }

  const limitPerMinute = ENV.AI_RATE_LIMIT_PER_MINUTE || 30;
  const limitPerDay = limitPerMinute * 20; // 600 per day

  if (record.minuteCount >= limitPerMinute) {
    const retryAfterSec = Math.ceil((record.minuteResetAt - now) / 1000);
    res.setHeader('Retry-After', retryAfterSec);
    res.status(429).json({
      success: false,
      message: `AI rate limit reached (${limitPerMinute}/min). Please wait ${retryAfterSec}s before trying again.`
    });
    return;
  }

  if (record.dayCount >= limitPerDay) {
    res.status(429).json({
      success: false,
      message: 'Daily AI usage quota reached. Please try again tomorrow.'
    });
    return;
  }

  record.minuteCount += 1;
  record.dayCount += 1;
  next();
}
