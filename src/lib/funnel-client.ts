"use client"

export type FunnelName = "quote" | "booking" | "consultation"

export interface FunnelStepPayload {
    funnel: FunnelName
    step: string
    stepNumber?: number
    lastField?: string
    dedupe?: boolean
}

function getVisitorId(): string {
    if (typeof window === "undefined") return "unknown"
    let vid = sessionStorage.getItem("bit_vid")
    if (!vid) {
        vid = "v-" + Math.random().toString(36).slice(2, 10)
        sessionStorage.setItem("bit_vid", vid)
    }
    return vid
}

/**
 * Sends a deduplicated conversion funnel step event for the current session.
 */
export function trackFunnelStep({
    funnel,
    step,
    stepNumber,
    lastField,
    dedupe = true,
}: FunnelStepPayload) {
    if (typeof window === "undefined") return

    const pathname = window.location.pathname
    if (pathname.startsWith("/admin") || /^\/(hu|en)\/admin/.test(pathname)) {
        return
    }

    if (dedupe) {
        const storageKey = `bit_fnl_${funnel}_${step}`
        if (sessionStorage.getItem(storageKey)) {
            return
        }
        sessionStorage.setItem(storageKey, "1")
    }

    const payload = {
        visitorId: getVisitorId(),
        domain: window.location.hostname,
        page: pathname,
        funnel,
        step,
        stepNumber,
        lastField,
    }

    fetch("/api/analytics/funnel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        keepalive: true,
    }).catch(() => {})
}

/**
 * Fires a beacon when the user abandons a form before submitting.
 */
export function trackFormAbandonment({
    funnel,
    stepNumber,
    lastField,
}: {
    funnel: FunnelName
    stepNumber: number
    lastField?: string
}) {
    if (typeof window === "undefined") return

    const storageKey = `bit_fnl_${funnel}_abandoned`
    if (sessionStorage.getItem(storageKey)) return
    sessionStorage.setItem(storageKey, "1")

    const payload = JSON.stringify({
        visitorId: getVisitorId(),
        domain: window.location.hostname,
        page: window.location.pathname,
        funnel,
        step: "abandoned",
        stepNumber,
        lastField: lastField || "unknown",
    })

    if (navigator.sendBeacon) {
        navigator.sendBeacon(
            "/api/analytics/funnel",
            new Blob([payload], { type: "application/json" })
        )
    } else {
        fetch("/api/analytics/funnel", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: payload,
            keepalive: true,
        }).catch(() => {})
    }
}
