'use server'

import { prisma } from "@/lib/db"
import { getActiveLiveVisitors } from "@/lib/live-visitors"

export type VisitorSession = {
    id: string
    city: string
    country: string
    countryCode: string
    flag: string
    lat: number
    lng: number
    page: string
    device: string
    referrer: string
    timeOnSite: string
    durationSec: number
    status: 'ACTIVE' | 'IDLE'
}

export type RecentVisitEntry = {
    id: string
    page: string
    eventType: string
    location: string
    device: string
    timeStr: string
    timeAgo: string
}

export type LiveTrafficData = {
    totalActiveVisitors: number
    peakToday: number
    totalEventsToday: number
    avgDurationSec: number
    topPages: Array<{ page: string; count: number }>
    visitors: VisitorSession[]
    recentVisits: RecentVisitEntry[]
    lastUpdatedIso: string
}

function formatLiveDuration(diffMs: number): string {
    const sec = Math.max(1, Math.floor(diffMs / 1000))
    if (sec < 60) return `${sec}mp`
    const min = Math.floor(sec / 60)
    const remSec = sec % 60
    if (min < 60) return `${min}p ${remSec}mp`
    const hrs = Math.floor(min / 60)
    const remMin = min % 60
    return `${hrs}ó ${remMin}p`
}

function formatRelativeAgo(diffMs: number): string {
    const min = Math.floor(diffMs / 60000)
    if (min < 1) return "épp most"
    if (min < 60) return `${min} perce`
    const hrs = Math.floor(min / 60)
    const remMin = min % 60
    return remMin > 0 ? `${hrs} órája ${remMin}p` : `${hrs} órája`
}

function resolvePageFromEvent(evt: { name: string; properties: any }): string {
    const props = evt.properties || {}
    if (props.page) return String(props.page)
    if (props.service) return `/szolgaltatasok/${props.service}`
    if (props.slug) return `/megoldasok/${props.slug}`
    if (evt.name === "view_service") return "/szolgaltatasok"
    if (evt.name === "view_product") return "/megoldasok"
    if (evt.name === "user_login_attempt") return "/login"
    return "/"
}

export async function getLiveTrafficData(): Promise<LiveTrafficData> {
    const now = Date.now()
    const todayStart = new Date()
    todayStart.setHours(0, 0, 0, 0)

    // 1. Valódi aktív látogatók lekérése Redisből (csak akiknek az elmúlt 75 mp-ben volt aktív életjele!)
    const activeRecords = await getActiveLiveVisitors()
    const visitors: VisitorSession[] = activeRecords.map((rec) => {
        const diffMs = Math.max(1000, now - rec.startedAt)
        const durationSec = Math.floor(diffMs / 1000)
        return {
            id: rec.id,
            city: rec.city,
            country: rec.country,
            countryCode: rec.countryCode,
            flag: rec.flag,
            lat: rec.lat,
            lng: rec.lng,
            page: rec.page,
            device: rec.device,
            referrer: rec.referrer,
            timeOnSite: formatLiveDuration(diffMs),
            durationSec,
            status: "ACTIVE",
        }
    })

    // 2. Valós napi statisztikák az adatbázisból
    let eventsToday: any[] = []
    let totalEventsToday = 0
    try {
        const [recentRows, todayCount] = await Promise.all([
            prisma.analyticsEvent.findMany({
                where: { createdAt: { gte: todayStart } },
                orderBy: { createdAt: "desc" },
                take: 250,
                select: {
                    id: true,
                    name: true,
                    category: true,
                    properties: true,
                    createdAt: true,
                },
            }),
            prisma.analyticsEvent.count({
                where: { createdAt: { gte: todayStart } },
            }),
        ])
        eventsToday = recentRows
        totalEventsToday = todayCount
    } catch (e) {
        console.error("Live traffic DB error:", e)
    }

    // 3. Mai csúcs óránkénti bontásban (valós adatokból)
    const hourlyBuckets: Record<number, number> = {}
    const pageCounts: Record<string, number> = {}

    for (const evt of eventsToday) {
        const hour = new Date(evt.createdAt).getHours()
        hourlyBuckets[hour] = (hourlyBuckets[hour] || 0) + 1

        const page = resolvePageFromEvent(evt)
        pageCounts[page] = (pageCounts[page] || 0) + 1
    }

    const peakToday = Math.max(
        visitors.length,
        ...Object.values(hourlyBuckets),
        0
    )

    const topPages = Object.entries(pageCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([page, count]) => ({ page, count }))

    // 4. Korábbi mai események pontos időbélyeggel ("2 órája", nem "367p aktívként"!)
    const recentVisits: RecentVisitEntry[] = eventsToday.slice(0, 12).map((evt) => {
        const props = (evt.properties as any) || {}
        const createdMs = new Date(evt.createdAt).getTime()
        const loc = props.city && props.country
            ? `${props.city} (${props.country})`
            : props.locale
            ? `Nyelv: ${String(props.locale).toUpperCase()}`
            : "Webes kérés"

        return {
            id: evt.id,
            page: resolvePageFromEvent(evt),
            eventType: evt.name,
            location: loc,
            device: props.device ? String(props.device) : "Böngésző",
            timeStr: new Date(evt.createdAt).toLocaleTimeString("hu-HU", {
                hour: "2-digit",
                minute: "2-digit",
            }),
            timeAgo: formatRelativeAgo(Math.max(0, now - createdMs)),
        }
    })

    // 5. Átlagos aktív munkamenet idő (kizárólag a valódi aktívakból!)
    const avgDurationSec =
        visitors.length > 0
            ? Math.round(visitors.reduce((sum, v) => sum + v.durationSec, 0) / visitors.length)
            : 0

    return {
        totalActiveVisitors: visitors.length,
        peakToday,
        totalEventsToday,
        avgDurationSec,
        topPages,
        visitors,
        recentVisits,
        lastUpdatedIso: new Date().toISOString(),
    }
}
