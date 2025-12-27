import { prisma } from "@/lib/db"

/**
 * Checks if a feature flag is enabled.
 * Supports simple percentage-based rollout if userId is provided.
 */
export async function isFeatureEnabled(key: string, userId?: string): Promise<boolean> {
    // 1. Fetch the flag
    // In a real high-scale app, this would be cached (Redis/Memory)
    const flag = await prisma.featureFlag.findUnique({
        where: { key }
    })

    // 2. If valid and enabled globally
    if (!flag) return false
    if (!flag.enabled) return false

    // 3. Percentage Rollout Logic (Simple hash-based)
    // If percentage is 100, everyone gets it.
    if (flag.percentage === 100) return true

    // If no user context but flag is partial, default to OFF to be safe (or random?)
    // Let's safe default to false if no user.
    if (!userId) return false

    // Simple hashing to determine if user falls in the bucket
    const hash = simpleHash(userId + key)
    const normalized = hash % 100 // 0-99

    return normalized < flag.percentage
}

/**
 * Simple string hash for deterministic rollout
 */
function simpleHash(str: string): number {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i)
        hash = (hash << 5) - hash + char
        hash |= 0 // Convert to 32bit integer
    }
    return Math.abs(hash)
}
