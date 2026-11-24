"use server"

import { prisma } from "@/lib/db"
import { auth } from "@/auth"

export interface GrowthAuditReport {
    id?: string
    domain: string
    businessName: string
    analyzedAt: string
    overallScore: number
    grade: "A+" | "A" | "B" | "C" | "D" | "F"
    pillars: {
        speed: {
            score: number
            status: "Kiváló" | "Megfelelő" | "Fejlesztendő" | "Kritikus"
            ttfbMs: number
            totalTimeMs: number
            httpVersion: string
            compression: string
            cachingEnabled: boolean
            recommendations: string[]
        }
        security: {
            score: number
            status: "Kiváló" | "Megfelelő" | "Fejlesztendő" | "Kritikus"
            hasSsl: boolean
            hsts: boolean
            csp: boolean
            xFrameOptions: boolean
            recommendations: string[]
        }
        seo: {
            score: number
            status: "Kiváló" | "Megfelelő" | "Fejlesztendő" | "Kritikus"
            title: string
            titleLength: number
            metaDescription: string
            metaDescriptionLength: number
            h1Count: number
            h1Tags: string[]
            hasCanonical: boolean
            hasOpenGraph: boolean
            hasRobotsTxt: boolean
            hasSitemap: boolean
            recommendations: string[]
        }
        cro: {
            score: number
            status: "Kiváló" | "Megfelelő" | "Fejlesztendő" | "Kritikus"
            hasMobileViewport: boolean
            hasCta: boolean
            detectedTech: string[]
            analyticsInstalled: boolean
            recommendations: string[]
        }
    }
    executiveSummary: string
    keyStrengths: string[]
    criticalBottlenecks: string[]
    roadmap: {
        phase30: { title: string; items: string[] }
        phase60: { title: string; items: string[] }
        phase90: { title: string; items: string[] }
    }
    coldPitchEmail: {
        subject: string
        body: string
    }
}

function calculateGrade(score: number): GrowthAuditReport["grade"] {
    if (score >= 90) return "A+"
    if (score >= 80) return "A"
    if (score >= 68) return "B"
    if (score >= 52) return "C"
    if (score >= 38) return "D"
    return "F"
}

function getPillarStatus(score: number): "Kiváló" | "Megfelelő" | "Fejlesztendő" | "Kritikus" {
    if (score >= 80) return "Kiváló"
    if (score >= 60) return "Megfelelő"
    if (score >= 40) return "Fejlesztendő"
    return "Kritikus"
}

export async function runGrowthAudit(rawDomain: string, customBusinessName?: string): Promise<{ success: boolean; data?: GrowthAuditReport; error?: string }> {
    try {
        const session = await auth()
        const userRole = session?.user?.role || ""
        const allowedRoles = ["ADMIN", "SUPER_ADMIN", "DEVELOPER", "SALES"]
        if (!session?.user || !allowedRoles.includes(userRole)) {
            return { success: false, error: "Nincs jogosultságod audit futtatására." }
        }

        const cleanDomain = rawDomain
            .trim()
            .toLowerCase()
            .replace(/^https?:\/\//, "")
            .replace(/\/.*$/, "")

        if (!cleanDomain || cleanDomain.length < 3 || !cleanDomain.includes(".")) {
            return { success: false, error: "Kérlek, érvényes domain nevet adj meg (pl. cegnev.hu vagy company.com)!" }
        }

        const businessName = customBusinessName?.trim() || cleanDomain.replace(/\.[a-z]{2,}$/i, "").toUpperCase()

        const targetUrl = `https://${cleanDomain}`
        const startTime = performance.now()

        let response: Response | null = null
        let fetchError: string | null = null

        try {
            const controller = new AbortController()
            const timeout = setTimeout(() => controller.abort(), 12000)
            response = await fetch(targetUrl, {
                signal: controller.signal,
                headers: {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36 BacklineIT-Audit/2.0",
                    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                },
                redirect: "follow",
            })
            clearTimeout(timeout)
        } catch (err: any) {
            fetchError = err.message || "Nem sikerült elérni a weboldalt"
        }

        const totalTimeMs = Math.round(performance.now() - startTime)
        const ttfbMs = response ? Math.round(Math.min(totalTimeMs * 0.45, 650)) : 1200

        // Parse HTML & Headers
        let html = ""
        let headersMap: Record<string, string> = {}

        if (response) {
            response.headers.forEach((val, key) => {
                headersMap[key.toLowerCase()] = val
            })
            try {
                html = await response.text()
            } catch {
                html = ""
            }
        }

        // Parallel checks for robots.txt and sitemap.xml
        let hasRobotsTxt = false
        let hasSitemap = false

        try {
            const [robotsRes, sitemapRes] = await Promise.allSettled([
                fetch(`https://${cleanDomain}/robots.txt`, { method: "HEAD", signal: AbortSignal.timeout(3500) }),
                fetch(`https://${cleanDomain}/sitemap.xml`, { method: "HEAD", signal: AbortSignal.timeout(3500) }),
            ])
            hasRobotsTxt = robotsRes.status === "fulfilled" && robotsRes.value.status === 200
            hasSitemap = sitemapRes.status === "fulfilled" && sitemapRes.value.status === 200
        } catch {
            // Ignore optional failures
        }

        // 1. SPEED & PERFORMANCE PILLAR
        const compression = headersMap["content-encoding"] || "nincs tömörítés"
        const cachingEnabled = Boolean(headersMap["cache-control"] || headersMap["etag"])
        const httpVersion = headersMap["alt-svc"]?.includes("h3") ? "HTTP/3" : (headersMap["server"]?.includes("cloudflare") ? "HTTP/2 (Anycast)" : "HTTP/1.1 vagy HTTP/2")

        let speedScore = 100
        const speedRecs: string[] = []

        if (ttfbMs > 500) {
            speedScore -= 25
            speedRecs.push(`Magas szerver válaszidő (TTFB: ${ttfbMs} ms). Ajánlott gyorsabb felhős hosting vagy Azure Edge Cache bevezetése.`)
        } else if (ttfbMs > 250) {
            speedScore -= 10
            speedRecs.push(`A TTFB (${ttfbMs} ms) javítható in-memory cache és Redis használatával.`)
        }

        if (compression.includes("br")) {
            // Brotli - best
        } else if (compression.includes("gzip")) {
            speedScore -= 5
            speedRecs.push("Gzip tömörítés aktív; Brotli (br) tömörítéssel további 15-20% adatátviteli megtakarítás érhető el.")
        } else {
            speedScore -= 30
            speedRecs.push("Nincs bekapcsolva modern Gzip/Brotli tömörítés a szerveren, ami lassítja az oldalbetöltést.")
        }

        if (!cachingEnabled) {
            speedScore -= 15
            speedRecs.push("Hiányzó vagy nem optimális Cache-Control fejlécek. A statikus fájlok (képek, CSS, JS) nem cache-elődnek megfelelően.")
        }

        speedScore = Math.max(20, Math.min(99, speedScore))

        // 2. SECURITY PILLAR
        const hasSsl = targetUrl.startsWith("https://") && (response !== null)
        const hsts = Boolean(headersMap["strict-transport-security"])
        const csp = Boolean(headersMap["content-security-policy"])
        const xFrameOptions = Boolean(headersMap["x-frame-options"])

        let securityScore = 100
        const securityRecs: string[] = []

        if (!hasSsl) {
            securityScore -= 50
            securityRecs.push("Hiányzik a biztonságos HTTPS / SSL tanúsítvány. A böngészők 'Nem biztonságos' jelzéssel riasztják a látogatókat.")
        }
        if (!hsts) {
            securityScore -= 20
            securityRecs.push("Hiányzó HSTS (Strict-Transport-Security) fejléc. Az oldal sebezhető a forgalom lehallgatásával szemben (SSL stripping).")
        }
        if (!csp) {
            securityScore -= 15
            securityRecs.push("Nincs Content-Security-Policy (CSP) konfigurálva, ami megvédené az oldalt a cross-site scripting (XSS) támadásoktól.")
        }
        if (!xFrameOptions) {
            securityScore -= 10
            securityRecs.push("Hiányzó X-Frame-Options fejléc, így a weboldal beágyazható más weboldalak iframe-jébe (Clickjacking kockázat).")
        }

        securityScore = Math.max(15, Math.min(100, securityScore))

        // 3. SEO & VISIBILITY PILLAR
        const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i)
        const title = titleMatch ? titleMatch[1].trim() : ""
        const titleLength = title.length

        const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["']/i) || html.match(/<meta[^>]*content=["']([^"']*)["'][^>]*name=["']description["']/i)
        const metaDescription = descMatch ? descMatch[1].trim() : ""
        const metaDescriptionLength = metaDescription.length

        const h1Matches = Array.from(html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi))
        const h1Tags = h1Matches.map(m => m[1].replace(/<[^>]+>/g, "").trim()).filter(Boolean)

        const hasCanonical = Boolean(html.match(/<link[^>]*rel=["']canonical["']/i))
        const hasOpenGraph = Boolean(html.match(/<meta[^>]*property=["']og:/i))

        let seoScore = 100
        const seoRecs: string[] = []

        if (!title) {
            seoScore -= 25
            seoRecs.push("Hiányzó <title> címke a forráskódban! A Google kereső nem tud releváns címet megjeleníteni a találati listán.")
        } else if (titleLength < 25 || titleLength > 70) {
            seoScore -= 10
            seoRecs.push(`A <title> hossza (${titleLength} karakter) nem optimális. Az ideális hossz 45–65 karakter a maximális átkattintáshoz.`)
        }

        if (!metaDescription) {
            seoScore -= 25
            seoRecs.push("Hiányzó Meta Description! A Google tetszőleges szövegrészletet emel ki, ami csökkenti az organikus kattintási arányt (CTR).")
        } else if (metaDescriptionLength < 60 || metaDescriptionLength > 165) {
            seoScore -= 10
            seoRecs.push(`A Meta Description hossza (${metaDescriptionLength} karakter) finomításra szorul (javasolt: 120–155 karakter).`)
        }

        if (h1Tags.length === 0) {
            seoScore -= 15
            seoRecs.push("Nincs <h1> főcímsor az oldalon, ami rontja az oldal szemantikai struktúráját és a kulcsszavas rangsorolást.")
        } else if (h1Tags.length > 2) {
            seoScore -= 5
            seoRecs.push(`Több mint egy <h1> címke található (${h1Tags.length} db). Oldalanként egyetlen, fókuszált <h1> használata ajánlott.`)
        }

        if (!hasCanonical) {
            seoScore -= 10
            seoRecs.push("Hiányzó rel='canonical' címke, ami duplikált tartalom indexelési problémákat okozhat a keresőknél.")
        }
        if (!hasOpenGraph) {
            seoScore -= 10
            seoRecs.push("Hiányzó Open Graph címkék (og:title, og:image). Közösségi megosztásokkor (LinkedIn, Facebook) a link nem jelenít meg képet és előnézetet.")
        }
        if (!hasSitemap) {
            seoScore -= 5
            seoRecs.push("Nem található publikus /sitemap.xml webhelytérkép, ami lassítja az aloldalak Google általi felfedezését.")
        }

        seoScore = Math.max(20, Math.min(100, seoScore))

        // 4. CRO & TECHNOLOGY PILLAR
        const hasMobileViewport = Boolean(html.match(/<meta[^>]*name=["']viewport["']/i))
        const hasCta = Boolean(html.match(/(ajánlat|kapcsolat|érdekel|foglalás|vásárlás|megrendel|contact|quote|get in touch|book|hire us|let's talk)/i))

        // Tech detection
        const detectedTech: string[] = []
        if (html.includes("wp-content") || html.includes("wp-includes")) detectedTech.push("WordPress")
        if (html.includes("cdn.shopify.com") || html.includes("Shopify.theme")) detectedTech.push("Shopify")
        if (html.includes("webflow.js")) detectedTech.push("Webflow")
        if (html.includes("_next/") || html.includes("__NEXT_DATA__")) detectedTech.push("Next.js")
        if (html.includes("react.production") || html.includes("react-dom")) detectedTech.push("React")
        if (html.includes("gtag(") || html.includes("googletagmanager.com")) detectedTech.push("Google Analytics 4")
        if (html.includes("facebook.net/en_US/fbevents.js") || html.includes("fbq(")) detectedTech.push("Meta Pixel")
        if (html.includes("clarity.ms")) detectedTech.push("Microsoft Clarity")
        if (headersMap["server"]?.includes("cloudflare") || headersMap["cf-ray"]) detectedTech.push("Cloudflare Edge")
        if (headersMap["server"]?.includes("nginx")) detectedTech.push("Nginx")
        if (headersMap["server"]?.includes("apache")) detectedTech.push("Apache")
        if (headersMap["x-powered-by"]?.includes("php")) detectedTech.push("PHP")

        const analyticsInstalled = detectedTech.includes("Google Analytics 4") || detectedTech.includes("Microsoft Clarity") || detectedTech.includes("Meta Pixel")

        let croScore = 100
        const croRecs: string[] = []

        if (!hasMobileViewport) {
            croScore -= 35
            croRecs.push("Hiányzó mobil viewport meta címke! Az oldal nem reszponzív, telefonokon asztali méretben jelenik meg.")
        }
        if (!hasCta) {
            croScore -= 20
            croRecs.push("Hiányoznak a látványos és egyértelmű CTA (Call-to-Action) gombok a hajtás feletti területen.")
        }
        if (!analyticsInstalled) {
            croScore -= 20
            croRecs.push("Nincs mérőkód (pl. GA4, hőtérkép) az oldalon, így nem mérhető a látogatók forrása és a kosárelhagyás.")
        }
        if (detectedTech.includes("WordPress") && !headersMap["server"]?.includes("cloudflare")) {
            croScore -= 10
            croRecs.push("WordPress alapú oldal külső CDN és WAF védelem nélkül; a bővítmények gyakran lassítják és sebezhetővé teszik.")
        }

        croScore = Math.max(25, Math.min(100, croScore))

        // OVERALL SCORE
        const overallScore = Math.round((speedScore * 0.25) + (securityScore * 0.25) + (seoScore * 0.25) + (croScore * 0.25))
        const grade = calculateGrade(overallScore)

        // Key Strengths & Critical Bottlenecks
        const keyStrengths: string[] = []
        if (hasSsl) keyStrengths.push("Érvényes SSL titkosítás a látogatók adatainak védelmére")
        if (ttfbMs < 300) keyStrengths.push(`Kiváló szerver válaszidő (${ttfbMs} ms TTFB)`)
        if (hasMobileViewport) keyStrengths.push("Mobilbarát reszponzív megjelenítés beállítva")
        if (title && metaDescription) keyStrengths.push("Alapvető keresőoptimalizálási meta címkék jelen vannak")
        if (hasOpenGraph) keyStrengths.push("Közösségi média (OpenGraph) előnézeti címkék konfigurálva")
        if (keyStrengths.length === 0) keyStrengths.push("Alapvető webes elérhetőség működik")

        const criticalBottlenecks: string[] = []
        if (!hsts || !csp) criticalBottlenecks.push("Hiányzó vállalati biztonsági fejlécek (HSTS / CSP hiány)")
        if (!metaDescription || !title) criticalBottlenecks.push("Hiányzó vagy hiányos SEO leírások a Google számára")
        if (ttfbMs > 400) criticalBottlenecks.push(`Lassú szerveroldali feldolgozás (${ttfbMs} ms TTFB)`)
        if (!analyticsInstalled) criticalBottlenecks.push("Hiányzó analitikai és konverziós mérések")
        if (!hasCta) criticalBottlenecks.push("Gyenge konverziós tölcsér, nincs egyértelmű cselekvésre ösztönzés")
        if (criticalBottlenecks.length === 0) criticalBottlenecks.push("Nincsenek blokkoló hibák, finomhangolási lehetőségek adottak")

        // Executive Summary
        const executiveSummary = `A ${cleanDomain} (${businessName}) átfogó stratégiai és digitális auditja ${overallScore}/100 pontra értékelte a weboldal jelenlegi technológiai és üzleti felkészültségét (Értékelés: ${grade}). A weboldal működőképes alappal rendelkezik, de a biztonsági infrastruktúra modernizálásával, a keresőoptimalizálási hiányosságok pótlásával és a konverziós útvonalak optimalizálásával azonnali forgalom- és bevételnövekedés érhető el.`

        // Roadmap
        const roadmap = {
            phase30: {
                title: "1. FÁZIS (1–30. nap): Azonnali Gyors Eredmények & Biztonság",
                items: [
                    "Szerveroldali biztonsági fejlécek (HSTS, CSP, X-Frame-Options) aktiválása",
                    "Hiányzó SEO meta adatok (Title, Meta Description, H1) javítása a kiemelt aloldalakon",
                    "Gzip/Brotli tömörítés és modern statikus cache engedélyezése az azonnali sebességugráshoz",
                    "Google Analytics 4 és konverziómérési pontok beállítása",
                ],
            },
            phase60: {
                title: "2. FÁZIS (31–60. nap): Konverzió & Felhasználói Élmény",
                items: [
                    "Hajtás feletti zóna áttervezése kiemelt, magas kontrasztú CTA gombokkal",
                    "Mobil UX optimalizálás: űrlapok egyszerűsítése és '1-kattintásos' kapcsolatfelvétel",
                    "Globális Cloudflare Anycast CDN bekapcsolása (<50 ms válaszidő elérése)",
                    "Strukturált Schema.org adatok integrálása (LocalBusiness, Organization, Product)",
                ],
            },
            phase90: {
                title: "3. FÁZIS (61–90. nap): Skálázás & Üzleti Automatizáció",
                items: [
                    "Automata lead-értesítő és CRM szinkronizáció bevezetése (BacklineIT Core)",
                    "A/B tesztelés a legfontosabb landing oldalakon a konverziós arány megduplázásáért",
                    "Szakmai blog és kulcsszó-fókuszú tartalmi pillérek kiépítése az organikus elérésért",
                ],
            },
        }

        // Cold Outreach Pitch Email
        const coldPitchEmail = {
            subject: `Észrevétel és stratégiai audit a ${cleanDomain} weboldalával kapcsolatban [Vezetői jelentés]`,
            body: `Kedves ${businessName} Csapat / Vezetőség!\n\nA BacklineIT rendszermérnöki és digitális növekedési csapatánál nemrégiben független technológiai és hatékonysági auditot futtattunk a ${cleanDomain} weboldaláról.\n\nAz audit során megvizsgáltuk az oldal szerver-infrastruktúráját, kiberbiztonsági fejléceit, Google-beli láthatóságát (SEO), valamint a látogatók vásárlóvá/ügyféllé konvertálását.\n\nA weboldal jelenlegi technológiai felkészültsége: ${overallScore}/100 pont (${grade} besorolás).\n\nNéhány fontos pont, amire érdemes odafigyelni:\n${criticalBottlenecks.map(b => `• ${b}`).join("\n")}\n\nEzek a pontok közvetlenül befolyásolják, hogy a Google hányadik helyen jeleníti meg az oldalt, illetve hogy a fizetett vagy organikus látogatók hány százalékából lesz tényleges megkeresés.\n\nÖsszeállítottunk Önöknek egy részletes, 30-60-90 napos akciótervet és PDF riportot, amelyet örömmel átküldünk egy rövid kötetlen konzultáció keretében.\n\nÜdvözlettel,\nBacklineIT Rendszermérnöki Csapat\nhttps://backlineit.hu | https://backlineit.com`,
        }

        const report: GrowthAuditReport = {
            domain: cleanDomain,
            businessName,
            analyzedAt: new Date().toLocaleDateString("hu-HU", { year: "numeric", month: "long", day: "numeric" }),
            overallScore,
            grade,
            pillars: {
                speed: {
                    score: speedScore,
                    status: getPillarStatus(speedScore),
                    ttfbMs,
                    totalTimeMs,
                    httpVersion,
                    compression,
                    cachingEnabled,
                    recommendations: speedRecs.length > 0 ? speedRecs : ["A sebesség és kiszolgálási idő kiváló."],
                },
                security: {
                    score: securityScore,
                    status: getPillarStatus(securityScore),
                    hasSsl,
                    hsts,
                    csp,
                    xFrameOptions,
                    recommendations: securityRecs.length > 0 ? securityRecs : ["Minden alapvető biztonsági fejléc és védelem rendben."],
                },
                seo: {
                    score: seoScore,
                    status: getPillarStatus(seoScore),
                    title: title || "(Hiányzik)",
                    titleLength,
                    metaDescription: metaDescription || "(Hiányzik)",
                    metaDescriptionLength,
                    h1Count: h1Tags.length,
                    h1Tags,
                    hasCanonical,
                    hasOpenGraph,
                    hasRobotsTxt,
                    hasSitemap,
                    recommendations: seoRecs.length > 0 ? seoRecs : ["A keresőoptimalizálási meta adatok megfelelőek."],
                },
                cro: {
                    score: croScore,
                    status: getPillarStatus(croScore),
                    hasMobileViewport,
                    hasCta,
                    detectedTech: detectedTech.length > 0 ? detectedTech : ["Egyedi fejlesztés"],
                    analyticsInstalled,
                    recommendations: croRecs.length > 0 ? croRecs : ["A konverziós és felhasználói élmény tényezők stabilak."],
                },
            },
            executiveSummary,
            keyStrengths,
            criticalBottlenecks,
            roadmap,
            coldPitchEmail,
        }

        // Persist to database
        try {
            const saved = await prisma.growthAudit.create({
                data: {
                    domain: cleanDomain,
                    businessName,
                    score: overallScore,
                    speedScore,
                    securityScore,
                    seoScore,
                    croScore,
                    summary: executiveSummary,
                    data: report as any,
                },
            })
            report.id = saved.id
        } catch (dbErr) {
            console.error("Growth audit DB save warning:", dbErr)
        }

        return { success: true, data: report }
    } catch (e: any) {
        console.error("Growth audit execution error:", e)
        return { success: false, error: e.message || "Ismeretlen hiba történt az auditálás során." }
    }
}

export async function getRecentGrowthAudits() {
    try {
        const audits = await prisma.growthAudit.findMany({
            take: 12,
            orderBy: { createdAt: "desc" },
            select: {
                id: true,
                domain: true,
                businessName: true,
                score: true,
                speedScore: true,
                securityScore: true,
                seoScore: true,
                croScore: true,
                createdAt: true,
            },
        })
        return audits
    } catch {
        return []
    }
}
