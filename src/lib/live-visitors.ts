import { redisDel, redisGetPattern, redisSet } from "@/lib/redis"

export interface LiveVisitorRecord {
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
    startedAt: number
    lastSeenAt: number
}

const VISITOR_TTL_SECONDS = 75
const REDIS_PREFIX = "live:visitor:"

// In-memory fallback store if Redis is not configured locally
const globalForVisitors = global as unknown as {
    liveVisitorMap?: Map<string, LiveVisitorRecord>
}

function getMemoryStore(): Map<string, LiveVisitorRecord> {
    if (!globalForVisitors.liveVisitorMap) {
        globalForVisitors.liveVisitorMap = new Map()
    }
    return globalForVisitors.liveVisitorMap
}

function pruneExpiredMemoryVisitors(now: number) {
    const store = getMemoryStore()
    for (const [key, rec] of store.entries()) {
        if (now - rec.lastSeenAt > VISITOR_TTL_SECONDS * 1000) {
            store.delete(key)
        }
    }
}

export async function upsertLiveVisitor(record: LiveVisitorRecord): Promise<void> {
    const now = Date.now()
    const memStore = getMemoryStore()
    memStore.set(record.id, record)
    pruneExpiredMemoryVisitors(now)

    await redisSet(`${REDIS_PREFIX}${record.id}`, record, VISITOR_TTL_SECONDS)
}

export async function removeLiveVisitor(id: string): Promise<void> {
    getMemoryStore().delete(id)
    await redisDel(`${REDIS_PREFIX}${id}`)
}

export async function getActiveLiveVisitors(): Promise<LiveVisitorRecord[]> {
    const now = Date.now()
    pruneExpiredMemoryVisitors(now)

    const redisRecords = await redisGetPattern<LiveVisitorRecord>(`${REDIS_PREFIX}*`)
    const validRedis = redisRecords.filter((r) => now - r.lastSeenAt <= VISITOR_TTL_SECONDS * 1000)

    if (validRedis.length > 0) {
        return validRedis.sort((a, b) => b.lastSeenAt - a.lastSeenAt)
    }

    return Array.from(getMemoryStore().values()).sort((a, b) => b.lastSeenAt - a.lastSeenAt)
}

export function isBotUserAgent(ua: string): boolean {
    if (!ua) return false
    return /bot|crawl|spider|slurp|mediapartners|bingpreview|facebookexternalhit|lighthouse|headless|curl|wget|python-requests|ahrefs|semrush|yandex/i.test(ua)
}

export function parseDeviceFromUA(ua: string): string {
    if (!ua) return "Ismeretlen eszköz"
    if (/iPhone|iPad|iPod/i.test(ua)) return "Mobile (iOS / Safari)"
    if (/Android/i.test(ua)) return "Mobile (Android)"
    if (/Windows/i.test(ua)) return "Desktop (Windows)"
    if (/Macintosh|Mac OS/i.test(ua)) return "Desktop (Mac)"
    if (/Linux/i.test(ua)) return "Desktop (Linux)"
    return "Asztali böngésző"
}

const COUNTRY_META: Record<string, { name: string; flag: string; lat: number; lng: number }> = {
    HU: { name: "Magyarország", flag: "🇭🇺", lat: 47.4979, lng: 19.0402 },
    AT: { name: "Ausztria", flag: "🇦🇹", lat: 48.2082, lng: 16.3738 },
    DE: { name: "Németország", flag: "🇩🇪", lat: 50.1109, lng: 8.6821 },
    SK: { name: "Szlovákia", flag: "🇸🇰", lat: 48.1486, lng: 17.1077 },
    RO: { name: "Románia", flag: "🇷🇴", lat: 46.7712, lng: 23.6236 },
    GB: { name: "Egyesült Királyság", flag: "🇬🇧", lat: 51.5074, lng: -0.1278 },
    US: { name: "Egyesült Államok", flag: "🇺🇸", lat: 37.7749, lng: -122.4194 },
    NL: { name: "Hollandia", flag: "🇳🇱", lat: 52.3676, lng: 4.9041 },
    CH: { name: "Svájc", flag: "🇨🇭", lat: 47.3769, lng: 8.5417 },
    FR: { name: "Franciaország", flag: "🇫🇷", lat: 48.8566, lng: 2.3522 },
}

const CITY_COORDS: Record<string, { lat: number; lng: number }> = {
    budapest: { lat: 47.4979, lng: 19.0402 },
    debrecen: { lat: 47.5316, lng: 21.6273 },
    szeged: { lat: 46.2530, lng: 20.1414 },
    miskolc: { lat: 48.1035, lng: 20.7784 },
    pecs: { lat: 46.0727, lng: 18.2323 },
    gyor: { lat: 47.6875, lng: 17.6504 },
    szekesfehervar: { lat: 47.1899, lng: 18.4107 },
    kecskemet: { lat: 46.9074, lng: 19.6917 },
    nyiregyhaza: { lat: 47.9495, lng: 21.7244 },
    szombathely: { lat: 47.2307, lng: 16.6218 },
    vienna: { lat: 48.2082, lng: 16.3738 },
    frankfurt: { lat: 50.1109, lng: 8.6821 },
    munich: { lat: 48.1351, lng: 11.5820 },
    berlin: { lat: 52.5200, lng: 13.4050 },
    london: { lat: 51.5074, lng: -0.1278 },
}

function normalizeAsciiKey(input: string): string {
    return input
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim()
}

export function resolveGeoFromHeaders(headers: Headers) {
    const rawCountry = (headers.get("cf-ipcountry") || "HU").toUpperCase()
    const countryCode = rawCountry === "XX" || rawCountry === "T1" ? "HU" : rawCountry
    const meta = COUNTRY_META[countryCode] || {
        name: countryCode,
        flag: "🌐",
        lat: 47.4979,
        lng: 19.0402,
    }

    let city = headers.get("cf-ipcity") || ""
    if (city) {
        try {
            city = decodeURIComponent(city)
        } catch {
            // keep raw if malformed
        }
    }
    if (!city) {
        city = countryCode === "HU" ? "Budapest" : meta.name
    }

    const latHeader = parseFloat(headers.get("cf-iplatitude") || "")
    const lngHeader = parseFloat(headers.get("cf-iplongitude") || "")
    const cityCoords = CITY_COORDS[normalizeAsciiKey(city)]

    const lat = Number.isFinite(latHeader) ? latHeader : (cityCoords?.lat ?? meta.lat)
    const lng = Number.isFinite(lngHeader) ? lngHeader : (cityCoords?.lng ?? meta.lng)

    return {
        city,
        country: meta.name,
        countryCode,
        flag: meta.flag,
        lat,
        lng,
    }
}
