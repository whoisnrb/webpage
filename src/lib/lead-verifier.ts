export interface VerifiedWebsiteResult {
    reachable: boolean
    isParked: boolean
    finalUrl: string
    hostname: string
    pageTitle: string | null
    email: string | null
    phone: string | null
    loadTimeMs: number
    hasSsl: boolean
    verifiedIssues: string[]
    primaryPainPoint: string
}

const BLOCKED_DOMAINS = [
    "facebook.com",
    "instagram.com",
    "linkedin.com",
    "youtube.com",
    "tiktok.com",
    "wikipedia.org",
    "aranyoldalak.hu",
    "ceginformacio.hu",
    "nemzeticegtar.hu",
    "opten.hu",
    "joszaki.hu",
    "szaki.hu",
    "mesterkereso.hu",
    "szakemberkereso.hu",
    "profession.hu",
    "jooble.org",
    "jofogas.hu",
    "startlap.hu",
    "google.com",
    "google.hu",
    "maps.google.com",
    "yandex.",
    "bing.com",
    "telefonszamkereso",
    "tudakozo",
    "ittjartam.hu",
    "nyitvatartas24.hu",
    "cylex.hu",
    "kompass.com",
    "europages",
    "dnb.com",
    "vertexaisearch.cloud.google.com",
    "magyarorszag.hu",
    "kormany.hu",
    "nav.gov.hu",
    "reddit.com",
    "pinterest.",
    "booking.com",
    "tripadvisor.",
    "szallas.hu",
    "wikipedia.",
    "szerelvenybolt",
    "arukereso.hu",
    "argep.hu",
    "emag.hu",
    "alza.hu",
]

const PARKED_SIGNATURES = [
    "a weboldal még nem érhető el",
    "még nem töltött fel tartalmat a tárhelyére",
    "tovább a rackhost-ra",
    "ez a domain név eladó",
    "domain is for sale",
    "buy this domain",
    "sedoparking",
    "parked free",
    "apache2 ubuntu default page",
    "apache2 debian default page",
    "welcome to nginx!",
    "cpanel default page",
    "default web site page",
    "cgi-sys/defaultwebpage.cgi",
    "hamarosan indulunk",
    "oldalunk fejlesztés alatt",
    "under construction",
    "coming soon",
    "account suspended",
    "felfüggesztett tárhely",
    "az ön weboldala hamarosan",
    "plesk default page",
    "this site can’t be reached",
]

export function isBlockedOrDirectoryHost(hostname: string): boolean {
    const lower = hostname.toLowerCase().replace(/^www\./, "")
    return BLOCKED_DOMAINS.some((b) => lower.includes(b))
}

function isParkedOrEmptyHtml(html: string): boolean {
    if (!html || html.trim().length < 350) return true
    const lower = html.toLowerCase()
    if (PARKED_SIGNATURES.some((sig) => lower.includes(sig))) {
        return true
    }
    const stripped = html.replace(/<script[\s\S]*?<\/script>/gi, "").replace(/<style[\s\S]*?<\/style>/gi, "").replace(/<[^>]+>/g, " ").trim()
    return stripped.length < 80
}

function isGarbageEmail(email: string): boolean {
    const lower = email.toLowerCase()
    if (lower.length > 80 || lower.length < 6) return true
    const badParts = [
        "example.com",
        "domain.hu",
        "domain.com",
        "sentry.io",
        "wixpress.com",
        "w3.org",
        "schema.org",
        "googleapis.com",
        "wordpress.org",
        "gravatar.com",
        "yourdomain",
        "cegnev",
        "minta",
        ".png",
        ".jpg",
        ".jpeg",
        ".svg",
        ".webp",
        ".css",
        ".js",
        "noreply",
        "no-reply",
        "wix.com",
    ]
    return badParts.some((b) => lower.includes(b))
}

function extractContacts(html: string): { email: string | null; phone: string | null } {
    let email: string | null = null
    let phone: string | null = null

    // 1. Prefer explicit mailto: links
    const mailtoMatches = Array.from(html.matchAll(/href=["']mailto:([^"'?#\s>]+)["']/gi))
    for (const m of mailtoMatches) {
        const candidate = decodeURIComponent(m[1]).trim().toLowerCase()
        if (candidate.includes("@") && !isGarbageEmail(candidate)) {
            email = candidate
            break
        }
    }

    // 2. Fallback: visible text email regex
    if (!email) {
        const textOnly = html.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ")
        const emailMatches = Array.from(textOnly.matchAll(/\b([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,10})\b/g))
        for (const m of emailMatches) {
            const candidate = m[1].trim().toLowerCase()
            if (!isGarbageEmail(candidate)) {
                email = candidate
                break
            }
        }
    }

    // 3. Prefer explicit tel: links
    const telMatches = Array.from(html.matchAll(/href=["']tel:([^"']+)["']/gi))
    for (const m of telMatches) {
        const raw = decodeURIComponent(m[1]).trim()
        const digits = raw.replace(/\D/g, "")
        if (digits.length >= 8 && digits.length <= 15) {
            phone = raw
            break
        }
    }

    // 4. Fallback: Hungarian phone patterns in text
    if (!phone) {
        const textOnly = html
            .replace(/<script[\s\S]*?<\/script>/gi, " ")
            .replace(/<style[\s\S]*?<\/style>/gi, " ")
            .replace(/<[^>]+>/g, " ")
        const phoneMatch = textOnly.match(/((?:\+36|06)[\s\-/]?(?:1|20|30|31|50|70|[2-9]\d)[\s\-/]?\d{3}[\s\-/]?\d{3,4})/)
        if (phoneMatch) {
            phone = phoneMatch[1].replace(/\s+/g, " ").trim()
        }
    }

    return { email, phone }
}

function findContactSubpageUrl(html: string, baseUrl: string): string | null {
    const hrefMatches = Array.from(html.matchAll(/href=["']([^"'#]+)["']/gi))
    const targetKeywords = ["kapcsolat", "elerhetoseg", "contact", "impresszum"]
    for (const m of hrefMatches) {
        const href = m[1].trim()
        const lower = href.toLowerCase()
        if (targetKeywords.some((k) => lower.includes(k)) && !lower.startsWith("mailto:") && !lower.startsWith("tel:")) {
            try {
                const resolved = new URL(href, baseUrl)
                const baseHost = new URL(baseUrl).hostname.replace(/^www\./, "")
                if (resolved.hostname.replace(/^www\./, "") === baseHost) {
                    return resolved.toString()
                }
            } catch {
                // ignore malformed URL
            }
        }
    }
    return null
}

async function fetchWithTimeout(url: string, timeoutMs: number): Promise<Response> {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), timeoutMs)
    try {
        return await fetch(url, {
            signal: controller.signal,
            redirect: "follow",
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                "Accept-Language": "hu-HU,hu;q=0.9,en;q=0.8",
            },
        })
    } finally {
        clearTimeout(timer)
    }
}

export async function inspectAndAuditLiveWebsite(rawWebsite: string): Promise<VerifiedWebsiteResult | null> {
    let cleanHost = rawWebsite
        .trim()
        .toLowerCase()
        .replace(/^https?:\/\//, "")
        .split("/")[0]
        .split("?")[0]
        .replace(/:\d+$/, "")

    if (!cleanHost || !cleanHost.includes(".") || isBlockedOrDirectoryHost(cleanHost)) {
        return null
    }

    const start = performance.now()
    let res: Response | null = null
    let hasSsl = true

    try {
        res = await fetchWithTimeout(`https://${cleanHost}`, 6500)
    } catch {
        hasSsl = false
        try {
            res = await fetchWithTimeout(`http://${cleanHost}`, 5500)
        } catch {
            return null
        }
    }

    const loadTimeMs = Math.round(performance.now() - start)
    if (!res || res.status >= 400) {
        return null
    }

    const finalUrl = res.url || `https://${cleanHost}`
    let finalHost = cleanHost
    try {
        const parsedFinal = new URL(finalUrl)
        finalHost = parsedFinal.hostname.replace(/^www\./, "")
        if (isBlockedOrDirectoryHost(finalHost)) {
            return null
        }
        hasSsl = parsedFinal.protocol === "https:"
    } catch {
        // ignore
    }

    let html = ""
    try {
        html = await res.text()
    } catch {
        return null
    }

    if (isParkedOrEmptyHtml(html)) {
        return null
    }

    // Extract title
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i)
    const pageTitle = titleMatch ? titleMatch[1].replace(/\s+/g, " ").trim().slice(0, 120) : null

    // Extract contacts from homepage
    let { email, phone } = extractContacts(html)
    let combinedHtml = html

    // Check /kapcsolat or /contact subpage if email or phone or form is missing
    const hasHomeForm = /<form[\s>]/i.test(html)
    if (!email || !phone || !hasHomeForm) {
        const contactUrl = findContactSubpageUrl(html, finalUrl)
        if (contactUrl && contactUrl !== finalUrl) {
            try {
                const subRes = await fetchWithTimeout(contactUrl, 4500)
                if (subRes.ok) {
                    const subHtml = await subRes.text()
                    combinedHtml += "\n" + subHtml
                    const subContacts = extractContacts(subHtml)
                    if (!email && subContacts.email) email = subContacts.email
                    if (!phone && subContacts.phone) phone = subContacts.phone
                }
            } catch {
                // ignore subpage error
            }
        }
    }

    // Run REAL technical diagnostics on headers + HTML
    const headersMap: Record<string, string> = {}
    res.headers.forEach((v, k) => {
        headersMap[k.toLowerCase()] = v
    })

    const verifiedIssues: string[] = []

    if (!hasSsl) {
        verifiedIssues.push("Nincs HTTPS (SSL) titkosítás — a böngésző 'Nem biztonságos' figyelmeztetést mutat")
    }

    if (loadTimeMs > 1200) {
        verifiedIssues.push(`Lassú szerverválasz (${loadTimeMs} ms) — lassú betöltés miatt ügyfeleket veszít`)
    }

    const hasViewport = /<meta[^>]*name=["']viewport["']/i.test(html)
    if (!hasViewport) {
        verifiedIssues.push("Nem mobilbarát (hiányzó viewport meta) — mobilon széteső elrendezés")
    }

    const hasForm = /<form[\s>]/i.test(combinedHtml)
    if (!hasForm) {
        verifiedIssues.push("Nincs online ajánlatkérő vagy kapcsolatfelvételi űrlap az oldalon")
    }

    const hasMetaDesc = /<meta[^>]*name=["']description["'][^>]*content=["'][^"']{15,}/i.test(html) ||
        /<meta[^>]*content=["'][^"']{15,}["'][^>]*name=["']description["']/i.test(html)
    if (!hasMetaDesc || !pageTitle) {
        verifiedIssues.push("Hiányzó SEO Meta Description / alapvető Google keresőoptimalizálási hiányosság")
    }

    const hasAnalytics = /(gtag\(|googletagmanager\.com|clarity\.ms|fbq\(|plausible\.io|matomo)/i.test(html)
    if (!hasAnalytics) {
        verifiedIssues.push("Nincs analitikai mérőkód (GA4/GTM) — láthatatlan a látogatói forgalom")
    }

    const hasHsts = Boolean(headersMap["strict-transport-security"])
    const hasCsp = Boolean(headersMap["content-security-policy"])
    if (!hasHsts && !hasCsp) {
        verifiedIssues.push("Hiányzó biztonsági fejlécek (HSTS / CSP védelem nincs beállítva)")
    }

    const encoding = headersMap["content-encoding"] || ""
    if (!encoding.includes("gzip") && !encoding.includes("br")) {
        verifiedIssues.push("Nincs aktív Gzip/Brotli tömörítés a szerveren")
    }

    const hasOg = /<meta[^>]*property=["']og:/i.test(html)
    if (!hasOg) {
        verifiedIssues.push("Hiányzó OpenGraph megosztási címkék (közösségi médiában nincs előnézet)")
    }

    if (verifiedIssues.length === 0) {
        verifiedIssues.push(`Élő oldal ellenőrizve (${loadTimeMs} ms) — finomhangolható konverziós és automatizációs potenciál`)
    }

    const primaryPainPoint = verifiedIssues.slice(0, 2).join(" • ")

    return {
        reachable: true,
        isParked: false,
        finalUrl,
        hostname: finalHost,
        pageTitle,
        email,
        phone,
        loadTimeMs,
        hasSsl,
        verifiedIssues,
        primaryPainPoint,
    }
}
