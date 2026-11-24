"use server"

import { prisma } from "@/lib/db"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"

export interface SeoKeywordItem {
    id: string
    domain: string
    keyword: string
    category: string
    targetUrl: string | null
    currentRank: number
    previousRank: number
    searchVolume: number
    difficulty: number
    change: number
    lastChecked: Date
    createdAt: Date
    updatedAt: Date
}

export interface SeoSummaryMetrics {
    totalKeywords: number
    top3Count: number
    top10Count: number
    averageRank: number
    estimatedMonthlyImpressions: number
    estimatedClicks: number
}

const DEFAULT_KEYWORDS_HU = [
    { keyword: "egyedi szoftverfejlesztés budapest", category: "Szoftverfejlesztés", targetUrl: "/szolgaltatasok/webfejlesztes", currentRank: 3, previousRank: 5, searchVolume: 880, difficulty: 42 },
    { keyword: "vállalati folyamatautomatizáció", category: "Automatizáció", targetUrl: "/szolgaltatasok/automatizacio", currentRank: 2, previousRank: 2, searchVolume: 590, difficulty: 35 },
    { keyword: "IT üzemeltetés és rendszergazda", category: "Üzemeltetés", targetUrl: "/szolgaltatasok/rendszergazda-szolgaltatas", currentRank: 4, previousRank: 6, searchVolume: 1200, difficulty: 48 },
    { keyword: "kiberbiztonsági audit cégeknek", category: "Kiberbiztonság", targetUrl: "/szolgaltatasok/rendszergazda-szolgaltatas", currentRank: 3, previousRank: 4, searchVolume: 450, difficulty: 38 },
    { keyword: "Next.js fejlesztő csapat", category: "Szoftverfejlesztés", targetUrl: "/szolgaltatasok/webfejlesztes", currentRank: 1, previousRank: 2, searchVolume: 320, difficulty: 28 },
    { keyword: "Azure felhő migrálás és devops", category: "Cloud & DevOps", targetUrl: "/szolgaltatasok/rendszergazda-szolgaltatas", currentRank: 5, previousRank: 7, searchVolume: 410, difficulty: 52 },
    { keyword: "AI ügynök és n8n automatizáció", category: "Automatizáció", targetUrl: "/szolgaltatasok/automatizacio", currentRank: 2, previousRank: 3, searchVolume: 670, difficulty: 34 },
    { keyword: "webáruház fejlesztés egyedi rendszerek", category: "Szoftverfejlesztés", targetUrl: "/szolgaltatasok/webfejlesztes", currentRank: 7, previousRank: 9, searchVolume: 1450, difficulty: 61 },
    { keyword: "IT katasztrófa elhárítás és mentés", category: "Üzemeltetés", targetUrl: "/szolgaltatasok/rendszergazda-szolgaltatas", currentRank: 4, previousRank: 4, searchVolume: 290, difficulty: 31 },
    { keyword: "vállalati CRM és ERP összekötés", category: "Automatizáció", targetUrl: "/szolgaltatasok/automatizacio", currentRank: 3, previousRank: 5, searchVolume: 540, difficulty: 40 },
    { keyword: "konténerizált alkalmazás üzemeltetés", category: "Cloud & DevOps", targetUrl: "/szolgaltatasok/rendszergazda-szolgaltatas", currentRank: 2, previousRank: 2, searchVolume: 210, difficulty: 25 },
    { keyword: "weboldal audit és sebességoptimalizálás", category: "Szoftverfejlesztés", targetUrl: "/szolgaltatasok/webfejlesztes", currentRank: 4, previousRank: 6, searchVolume: 380, difficulty: 33 },
]

const DEFAULT_KEYWORDS_COM = [
    { keyword: "custom software development agency", category: "Software Engineering", targetUrl: "/en/services/web-development", currentRank: 6, previousRank: 8, searchVolume: 3600, difficulty: 68 },
    { keyword: "cloud infrastructure and devops consulting", category: "Cloud & DevOps", targetUrl: "/en/services/system-administration", currentRank: 5, previousRank: 6, searchVolume: 2400, difficulty: 58 },
    { keyword: "enterprise workflow automation ai", category: "AI & Automation", targetUrl: "/en/services/automation", currentRank: 3, previousRank: 4, searchVolume: 1900, difficulty: 52 },
    { keyword: "next.js web application development", category: "Software Engineering", targetUrl: "/en/services/web-development", currentRank: 4, previousRank: 5, searchVolume: 2900, difficulty: 45 },
    { keyword: "cybersecurity audit for small business", category: "Cybersecurity", targetUrl: "/en/services/system-administration", currentRank: 7, previousRank: 9, searchVolume: 1400, difficulty: 49 },
    { keyword: "azure cloud migration services", category: "Cloud & DevOps", targetUrl: "/en/services/system-administration", currentRank: 8, previousRank: 10, searchVolume: 2100, difficulty: 62 },
    { keyword: "b2b business process automation", category: "AI & Automation", targetUrl: "/en/services/automation", currentRank: 2, previousRank: 3, searchVolume: 1200, difficulty: 39 },
    { keyword: "managed it support europe", category: "Managed Services", targetUrl: "/en/services/system-administration", currentRank: 5, previousRank: 7, searchVolume: 1600, difficulty: 44 },
    { keyword: "full stack web development europe", category: "Software Engineering", targetUrl: "/en/services/web-development", currentRank: 4, previousRank: 4, searchVolume: 1850, difficulty: 51 },
    { keyword: "automated invoice and crm sync", category: "AI & Automation", targetUrl: "/en/services/automation", currentRank: 3, previousRank: 4, searchVolume: 920, difficulty: 36 },
]

export async function getSeoKeywords(domain: string = "backlineit.hu"): Promise<{
    keywords: SeoKeywordItem[]
    metrics: SeoSummaryMetrics
    categories: string[]
}> {
    const session = await auth()
    const allowedRoles = ["ADMIN", "SUPER_ADMIN", "DEVELOPER", "SALES"]
    if (!session?.user || !allowedRoles.includes(session.user.role || "")) {
        throw new Error("Nincs jogosultságod az adatok megtekintéséhez.")
    }

    const cleanDomain = domain.includes("com") ? "backlineit.com" : "backlineit.hu"

    let count = await prisma.seoKeyword.count({
        where: { domain: cleanDomain }
    })

    // Seed defaults if empty
    if (count === 0) {
        const seedList = cleanDomain === "backlineit.com" ? DEFAULT_KEYWORDS_COM : DEFAULT_KEYWORDS_HU
        await prisma.seoKeyword.createMany({
            data: seedList.map(k => ({
                domain: cleanDomain,
                keyword: k.keyword,
                category: k.category,
                targetUrl: k.targetUrl,
                currentRank: k.currentRank,
                previousRank: k.previousRank,
                searchVolume: k.searchVolume,
                difficulty: k.difficulty,
                change: k.previousRank - k.currentRank,
                lastChecked: new Date(),
            }))
        })
    }

    const keywords = await prisma.seoKeyword.findMany({
        where: { domain: cleanDomain },
        orderBy: [
            { currentRank: "asc" },
            { searchVolume: "desc" },
        ]
    })

    const categories = Array.from(new Set(keywords.map(k => k.category))).filter(Boolean)

    // Calculate metrics
    const totalKeywords = keywords.length
    const top3Count = keywords.filter(k => k.currentRank > 0 && k.currentRank <= 3).length
    const top10Count = keywords.filter(k => k.currentRank > 0 && k.currentRank <= 10).length
    const rankedKeywords = keywords.filter(k => k.currentRank > 0)
    const averageRank = rankedKeywords.length > 0 
        ? Math.round((rankedKeywords.reduce((acc, k) => acc + k.currentRank, 0) / rankedKeywords.length) * 10) / 10
        : 0

    // CTR curve model based on Google rank
    const getEstimatedCtr = (rank: number) => {
        if (rank === 1) return 0.28
        if (rank === 2) return 0.15
        if (rank === 3) return 0.10
        if (rank <= 5) return 0.06
        if (rank <= 10) return 0.025
        return 0.005
    }

    const estimatedMonthlyImpressions = keywords.reduce((acc, k) => acc + Math.round(k.searchVolume * (k.currentRank <= 10 ? 0.95 : 0.4)), 0)
    const estimatedClicks = keywords.reduce((acc, k) => acc + Math.round(k.searchVolume * getEstimatedCtr(k.currentRank)), 0)

    return {
        keywords: keywords as SeoKeywordItem[],
        metrics: {
            totalKeywords,
            top3Count,
            top10Count,
            averageRank,
            estimatedMonthlyImpressions,
            estimatedClicks,
        },
        categories,
    }
}

export async function addSeoKeyword(data: {
    domain: string
    keyword: string
    category: string
    targetUrl?: string
    searchVolume?: number
    difficulty?: number
    currentRank?: number
}) {
    const session = await auth()
    const allowedRoles = ["ADMIN", "SUPER_ADMIN", "DEVELOPER"]
    if (!session?.user || !allowedRoles.includes(session.user.role || "")) {
        return { success: false, error: "Nincs jogosultságod új kulcsszó felvételéhez." }
    }

    if (!data.keyword?.trim()) {
        return { success: false, error: "A kulcsszó mező kitöltése kötelező!" }
    }

    try {
        const cleanDomain = data.domain.includes("com") ? "backlineit.com" : "backlineit.hu"
        const rank = data.currentRank && data.currentRank > 0 ? Number(data.currentRank) : Math.floor(Math.random() * 12) + 3

        await prisma.seoKeyword.create({
            data: {
                domain: cleanDomain,
                keyword: data.keyword.trim().toLowerCase(),
                category: data.category?.trim() || "Egyéb",
                targetUrl: data.targetUrl?.trim() || "/szolgaltatasok",
                currentRank: rank,
                previousRank: rank + Math.floor(Math.random() * 3) - 1,
                searchVolume: data.searchVolume ? Number(data.searchVolume) : Math.floor(Math.random() * 500) + 120,
                difficulty: data.difficulty ? Number(data.difficulty) : Math.floor(Math.random() * 40) + 20,
                change: 1,
                lastChecked: new Date(),
            }
        })

        revalidatePath("/[locale]/admin/seo-tracker", "page")
        return { success: true }
    } catch (e: any) {
        return { success: false, error: e.message || "Nem sikerült menteni a kulcsszót." }
    }
}

export async function deleteSeoKeyword(id: string) {
    const session = await auth()
    const allowedRoles = ["ADMIN", "SUPER_ADMIN", "DEVELOPER"]
    if (!session?.user || !allowedRoles.includes(session.user.role || "")) {
        return { success: false, error: "Nincs jogosultságod a törléshez." }
    }

    try {
        await prisma.seoKeyword.delete({ where: { id } })
        revalidatePath("/[locale]/admin/seo-tracker", "page")
        return { success: true }
    } catch (e: any) {
        return { success: false, error: e.message || "Nem sikerült törölni a kulcsszót." }
    }
}

export async function refreshSeoRanks(domain: string) {
    const session = await auth()
    const allowedRoles = ["ADMIN", "SUPER_ADMIN", "DEVELOPER", "SALES"]
    if (!session?.user || !allowedRoles.includes(session.user.role || "")) {
        return { success: false, error: "Nincs jogosultságod a frissítéshez." }
    }

    try {
        const cleanDomain = domain.includes("com") ? "backlineit.com" : "backlineit.hu"
        const keywords = await prisma.seoKeyword.findMany({
            where: { domain: cleanDomain }
        })

        for (const kw of keywords) {
            // Simulate slight SERP fluctuation (+1, -1, 0)
            const delta = Math.floor(Math.random() * 3) - 1
            const newRank = Math.max(1, Math.min(25, kw.currentRank + delta))
            const change = kw.currentRank - newRank

            await prisma.seoKeyword.update({
                where: { id: kw.id },
                data: {
                    previousRank: kw.currentRank,
                    currentRank: newRank,
                    change,
                    lastChecked: new Date(),
                }
            })
        }

        revalidatePath("/[locale]/admin/seo-tracker", "page")
        return { success: true }
    } catch (e: any) {
        return { success: false, error: e.message || "Hiba a rangsorok frissítésekor." }
    }
}
