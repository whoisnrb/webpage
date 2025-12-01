type RateLimitStore = Map<string, { count: number; resetTime: number }>

const store: RateLimitStore = new Map()

interface RateLimitConfig {
    interval: number // in milliseconds
    limit: number // max requests per interval
}

export function rateLimit(ip: string, config: RateLimitConfig = { interval: 60000, limit: 10 }) {
    const now = Date.now()
    const record = store.get(ip)

    if (!record) {
        store.set(ip, { count: 1, resetTime: now + config.interval })
        return { success: true }
    }

    if (now > record.resetTime) {
        store.set(ip, { count: 1, resetTime: now + config.interval })
        return { success: true }
    }

    if (record.count >= config.limit) {
        return { success: false }
    }

    record.count += 1
    return { success: true }
}

// Clean up old entries every 5 minutes
setInterval(() => {
    const now = Date.now()
    for (const [ip, record] of store.entries()) {
        if (now > record.resetTime) {
            store.delete(ip)
        }
    }
}, 300000)
