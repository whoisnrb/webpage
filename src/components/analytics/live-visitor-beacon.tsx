"use client"

import { useEffect, useRef } from "react"
import { usePathname } from "next/navigation"

function getOrCreateSessionState() {
    if (typeof window === "undefined") return null

    let visitorId = sessionStorage.getItem("bit_vid")
    if (!visitorId) {
        visitorId = "v-" + Math.random().toString(36).slice(2, 10)
        sessionStorage.setItem("bit_vid", visitorId)
    }

    let startedAt = Number(sessionStorage.getItem("bit_started"))
    if (!startedAt || Number.isNaN(startedAt)) {
        startedAt = Date.now()
        sessionStorage.setItem("bit_started", String(startedAt))
    }

    let referrer = sessionStorage.getItem("bit_ref")
    if (referrer === null) {
        referrer = document.referrer || ""
        sessionStorage.setItem("bit_ref", referrer)
    }

    return { visitorId, startedAt, referrer }
}

export function LiveVisitorBeacon() {
    const pathname = usePathname()
    const lastTrackedPage = useRef<string | null>(null)

    useEffect(() => {
        if (!pathname || pathname.startsWith("/admin") || /^\/(hu|en)\/admin/.test(pathname)) {
            return
        }

        const state = getOrCreateSessionState()
        if (!state) return

        const sendPing = (isPageView: boolean) => {
            if (document.visibilityState === "hidden" && !isPageView) return
            fetch("/api/analytics/heartbeat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    visitorId: state.visitorId,
                    page: pathname,
                    referrer: state.referrer,
                    startedAt: state.startedAt,
                    isPageView,
                }),
                keepalive: true,
            }).catch(() => {})
        }

        const isNewPage = lastTrackedPage.current !== pathname
        if (isNewPage) {
            lastTrackedPage.current = pathname
        }
        sendPing(isNewPage)

        const interval = setInterval(() => {
            sendPing(false)
        }, 25000)

        const handleUnload = () => {
            const payload = JSON.stringify({
                visitorId: state.visitorId,
                leaving: true,
            })
            if (navigator.sendBeacon) {
                navigator.sendBeacon(
                    "/api/analytics/heartbeat",
                    new Blob([payload], { type: "application/json" })
                )
            }
        }

        window.addEventListener("pagehide", handleUnload)
        return () => {
            clearInterval(interval)
            window.removeEventListener("pagehide", handleUnload)
        }
    }, [pathname])

    return null
}
