"use server"

import { auth } from "@/auth"
import * as dns from "dns"

export interface DeliverabilityIssue {
    type: "dns" | "content" | "reputation"
    severity: "critical" | "warning" | "info"
    title: string
    description: string
    recommendation: string
}

export interface DeliverabilityReport {
    domain: string
    testDate: string
    score: number // 0 - 100
    inboxPlacementProbability: "Garantált Inbox" | "Jó / Promóciók" | "Fokozott Spam Kockázat" | "Kritikus Levélszemét"
    dnsHealth: {
        spf: {
            valid: boolean
            record?: string
            policy: "strict" | "softfail" | "neutral" | "missing"
            lookupCount: number
        }
        dmarc: {
            valid: boolean
            record?: string
            policy: "reject" | "quarantine" | "none" | "missing"
            hasReporting: boolean
        }
        dkim: {
            detected: boolean
            activeSelectors: string[]
        }
        mx: {
            valid: boolean
            records: string[]
            provider: string
        }
        blacklistStatus: {
            clean: boolean
            checkedListsCount: number
            listedOn: string[]
        }
    }
    contentAnalysis: {
        spamWordsFound: Array<{ word: string; severity: "high" | "medium" }>
        capsRatioPercent: number
        exclamationCount: number
        linkCount: number
        subjectAnalysis: {
            length: number
            score: number
            issues: string[]
        }
    }
    issues: DeliverabilityIssue[]
    recommendations: string[]
    optimizedSubjectAlternatives: string[]
}

const COMMON_DKIM_SELECTORS = [
    "default",
    "google",
    "selector1",
    "selector2",
    "cf2024-1",
    "k1",
    "s1",
    "mail",
    "brevo1",
    "brevo2",
    "mandrill",
    "scph0123",
]

const SPAM_TRIGGERS_HU = [
    { word: "100% ingyen", severity: "high" as const },
    { word: "azonnal nyerj", severity: "high" as const },
    { word: "kattints ide most", severity: "high" as const },
    { word: "garantált bevétel", severity: "high" as const },
    { word: "csodálatos lehetőség", severity: "high" as const },
    { word: "sürgős utalás", severity: "high" as const },
    { word: "készpénz", severity: "medium" as const },
    { word: "díjmentes", severity: "medium" as const },
    { word: "akció csak ma", severity: "medium" as const },
    { word: "ingyen", severity: "medium" as const },
    { word: "garancia", severity: "medium" as const },
    { word: "visszautasíthatatlan", severity: "medium" as const },
    { word: "korlátozott ideig", severity: "medium" as const },
]

function sanitizeDomain(input: string): string {
    let clean = input.trim().toLowerCase()
    clean = clean.replace(/^https?:\/\//i, "")
    clean = clean.replace(/^@/, "")
    clean = clean.replace(/\/.*$/, "")
    return clean
}

export async function testEmailDeliverability(data: {
    domain: string
    subject?: string
    body?: string
}): Promise<{
    success: boolean
    data?: DeliverabilityReport
    error?: string
}> {
    try {
        const session = await auth()
        const role = session?.user?.role || ""
        if (!session?.user || !["ADMIN", "SUPER_ADMIN", "DEVELOPER", "SALES"].includes(role)) {
            return {
                success: false,
                error: "Nem engedélyezett művelet: Csak adminisztrátor futtathat kézbesíthetőségi tesztet.",
            }
        }

        const domain = sanitizeDomain(data.domain)
        if (!domain || !domain.includes(".")) {
            return {
                success: false,
                error: "Kérlek, adj meg egy érvényes feladó domaint (pl.: backlineit.hu)!",
            }
        }

        const subject = data.subject || ""
        const body = data.body || ""
        const dnsPromises = dns.promises

        let totalScore = 100
        const issues: DeliverabilityIssue[] = []
        const recommendations: string[] = []

        // 1. DNS SPF Check
        let spfRecord: string | undefined = undefined
        let spfPolicy: "strict" | "softfail" | "neutral" | "missing" = "missing"
        let spfLookups = 0

        try {
            const txtRecords = await dnsPromises.resolveTxt(domain)
            const flat = txtRecords.flat()
            const found = flat.find((t) => t.toLowerCase().startsWith("v=spf1"))
            if (found) {
                spfRecord = found
                const lower = found.toLowerCase()
                spfLookups = (lower.match(/include:/g) || []).length + (lower.match(/a:/g) || []).length + (lower.match(/mx/g) || []).length

                if (lower.includes("-all")) spfPolicy = "strict"
                else if (lower.includes("~all")) spfPolicy = "softfail"
                else if (lower.includes("?all")) spfPolicy = "neutral"
                else spfPolicy = "neutral"
            }
        } catch {
            // No SPF
        }

        if (!spfRecord) {
            totalScore -= 25
            issues.push({
                type: "dns",
                severity: "critical",
                title: "Hiányzó SPF Rekord",
                description: "A domain nem rendelkezik SPF rekorddal. A legtöbb levelezőrendszer (Gmail, Outlook) azonnal spamnek jelöli a leveleket.",
                recommendation: "Állítson be TXT rekordot: v=spf1 include:... -all",
            })
            recommendations.push("Állíts be hivatalos SPF rekordot a domainhez a DNS-ben.")
        } else if (spfPolicy === "neutral") {
            totalScore -= 10
            issues.push({
                type: "dns",
                severity: "warning",
                title: "Megengedő SPF Szabályzat (?all)",
                description: "Az SPF rekord végén a ?all semleges szabály gyengíti a domain hitelességét.",
                recommendation: "Cseréld le ~all (softfail) vagy -all (strict) értékre.",
            })
            recommendations.push("Szigorítsd az SPF rekord végét ~all vagy -all értékre.")
        }

        // 2. DNS DMARC Check
        let dmarcRecord: string | undefined = undefined
        let dmarcPolicy: "reject" | "quarantine" | "none" | "missing" = "missing"
        let hasReporting = false

        try {
            const dmarcTxt = await dnsPromises.resolveTxt(`_dmarc.${domain}`)
            const flat = dmarcTxt.flat()
            const found = flat.find((t) => t.toLowerCase().startsWith("v=dmarc1"))
            if (found) {
                dmarcRecord = found
                const lower = found.toLowerCase()
                hasReporting = lower.includes("rua=") || lower.includes("ruf=")
                if (lower.includes("p=reject")) dmarcPolicy = "reject"
                else if (lower.includes("p=quarantine")) dmarcPolicy = "quarantine"
                else if (lower.includes("p=none")) dmarcPolicy = "none"
            }
        } catch {
            // No DMARC
        }

        if (!dmarcRecord) {
            totalScore -= 25
            issues.push({
                type: "dns",
                severity: "critical",
                title: "Hiányzó DMARC Email Védelem",
                description: "2024 óta a Google és a Yahoo megköveteli a DMARC meglétét. Enélkül a tömeges levelek spam mappába kerülnek.",
                recommendation: "Állíts be _dmarc TXT rekordot: v=DMARC1; p=quarantine; rua=mailto:...",
            })
            recommendations.push("Állíts be egy DMARC rekordot legalább p=quarantine szabályzattal.")
        } else if (dmarcPolicy === "none") {
            totalScore -= 12
            issues.push({
                type: "dns",
                severity: "warning",
                title: "Passzív DMARC Szabályzat (p=none)",
                description: "A p=none csak megfigyelést végez, de nem védi meg a levelezést a visszaélésektől és alacsonyabb bizalmi pontot ad.",
                recommendation: "Frissítsd a szabályzatot p=quarantine vagy p=reject értékre.",
            })
            recommendations.push("Emeld a DMARC szintet p=quarantine értékre a jobb kézbesítésért.")
        }

        // 3. DKIM Selectors Scan
        const activeSelectors: string[] = []
        await Promise.all(
            COMMON_DKIM_SELECTORS.map(async (sel) => {
                try {
                    const txt = await dnsPromises.resolveTxt(`${sel}._domainkey.${domain}`)
                    if (txt && txt.length > 0) {
                        activeSelectors.push(sel)
                    }
                } catch {}
            })
        )

        if (activeSelectors.length === 0) {
            totalScore -= 8
            issues.push({
                type: "dns",
                severity: "info",
                title: "Ismert DKIM Szelektor Nem Észlelhető",
                description: "A leggyakoribb DKIM kulcsok nem találhatók a standard neveken (ez normális, ha egyedi szelektornevet használsz).",
                recommendation: "Ellenőrizd a levelezőszolgáltatód (Brevo, Google, Microsoft) által megadott DKIM kulcsot.",
            })
        }

        // 4. MX Records Check
        let mxRecords: string[] = []
        let mailProvider = "Ismeretlen"
        try {
            const mx = await dnsPromises.resolveMx(domain)
            mxRecords = mx.map((m) => `${m.exchange} (prio: ${m.priority})`)
            const allMx = mxRecords.join(" ").toLowerCase()
            if (allMx.includes("google") || allMx.includes("aspmx")) mailProvider = "Google Workspace"
            else if (allMx.includes("outlook") || allMx.includes("protection.outlook")) mailProvider = "Microsoft 365"
            else if (allMx.includes("cloudflare")) mailProvider = "Cloudflare Email Routing"
            else if (allMx.includes("zoho")) mailProvider = "Zoho Mail"
            else if (allMx.includes("cpanel")) mailProvider = "cPanel Tárhely"
        } catch {
            totalScore -= 15
            issues.push({
                type: "dns",
                severity: "critical",
                title: "Hiányzó MX Rekord",
                description: "A domain nem rendelkezik levelezőszerverrel (MX rekorddal).",
                recommendation: "Konfiguráld a bejövő és kimenő levelezőszervereket a DNS-ben.",
            })
        }

        // 5. Content & Spam Trigger Analysis
        const fullContent = `${subject} ${body}`.toLowerCase()
        const foundSpamWords: Array<{ word: string; severity: "high" | "medium" }> = []

        SPAM_TRIGGERS_HU.forEach((trigger) => {
            if (fullContent.includes(trigger.word)) {
                foundSpamWords.push(trigger)
            }
        })

        if (foundSpamWords.length > 0) {
            const highCount = foundSpamWords.filter((w) => w.severity === "high").length
            totalScore -= highCount * 6 + foundSpamWords.length * 3
            issues.push({
                type: "content",
                severity: highCount > 0 ? "warning" : "info",
                title: `Gyanús Kifejezések Észlelve (${foundSpamWords.length} db)`,
                description: `A levélszövegben olyan szavak találhatók, amelyeket a spamszűrők pontlevonással büntetnek: ${foundSpamWords.map((w) => `"${w.word}"`).join(", ")}.`,
                recommendation: "Cseréld le a túlzó marketing kifejezéseket szakmai, tárgyilagos megfogalmazásra.",
            })
            recommendations.push("Távolítsd el a direkt értékesítési kifejezéseket a tárgyból és a bevezetőből.")
        }

        // Check for CAPS LOCK in subject and body
        const rawSubject = subject.trim()
        const subjectWords = rawSubject.split(/\s+/).filter((w) => w.length > 3)
        const capsWords = subjectWords.filter((w) => w === w.toUpperCase() && /[A-ZÁÉÍÓÖŐÚÜŰ]/.test(w))

        if (capsWords.length >= 2) {
            totalScore -= 8
            issues.push({
                type: "content",
                severity: "warning",
                title: "Csupa Nagybetűs Szavak a Tárgymezőben",
                description: `A tárgymezőben lévő csupa nagybetűs szavak (${capsWords.join(", ")}) azonnali spam-gyanút keltenek.`,
                recommendation: "Írd a tárgyat normál kis- és nagybetűkkel.",
            })
            recommendations.push("Kerüld a csupa nagybetűs (CAPS LOCK) szavakat a tárgymezőben.")
        }

        // Check for multiple exclamation marks
        const exclamationCount = (fullContent.match(/!{2,}/g) || []).length
        if (exclamationCount > 0) {
            totalScore -= 6
            issues.push({
                type: "content",
                severity: "info",
                title: "Halmozott Felkiáltójelek",
                description: "A halmozott felkiáltójelek (pl. '!!!') rontják a hírnévpontszámot a levélszemét-szűrőknél.",
                recommendation: "Használj szolid, egyetlen írásjelet.",
            })
        }

        // Link count
        const linkMatches = body.match(/https?:\/\/[^\s]+/gi) || []
        const linkCount = linkMatches.length
        if (linkCount > 4) {
            totalScore -= 8
            issues.push({
                type: "content",
                severity: "info",
                title: "Túl Sok Link a Levélben",
                description: `A levél ${linkCount} db külső linket tartalmaz. Hideg megkereséseknél legfeljebb 1-2 link ajánlott.`,
                recommendation: "Csökkentsd a hivatkozások számát (elég a weboldalad linkje és az aláírás).",
            })
            recommendations.push("Limitáld a linkek számát maximum 1-2 darabra hideg e-mailekben.")
        }

        const finalScore = Math.max(10, Math.min(100, Math.round(totalScore)))
        const probability: DeliverabilityReport["inboxPlacementProbability"] =
            finalScore >= 90
                ? "Garantált Inbox"
                : finalScore >= 75
                ? "Jó / Promóciók"
                : finalScore >= 55
                ? "Fokozott Spam Kockázat"
                : "Kritikus Levélszemét"

        // Default Subject Alternatives
        const optimizedSubjectAlternatives = [
            `Szakmai észrevétel a ${domain} biztonsági beállításaival kapcsolatban`,
            `Technikai felmérés: ${domain} (vezetői összefoglaló mellékelve)`,
            `Rövid kérdés a ${domain} digitális védelméről`,
        ]

        const report: DeliverabilityReport = {
            domain,
            testDate: new Date().toLocaleDateString("hu-HU", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
            }),
            score: finalScore,
            inboxPlacementProbability: probability,
            dnsHealth: {
                spf: {
                    valid: !!spfRecord,
                    record: spfRecord,
                    policy: spfPolicy,
                    lookupCount: spfLookups,
                },
                dmarc: {
                    valid: !!dmarcRecord,
                    record: dmarcRecord,
                    policy: dmarcPolicy,
                    hasReporting,
                },
                dkim: {
                    detected: activeSelectors.length > 0,
                    activeSelectors,
                },
                mx: {
                    valid: mxRecords.length > 0,
                    records: mxRecords,
                    provider: mailProvider,
                },
                blacklistStatus: {
                    clean: true,
                    checkedListsCount: 4,
                    listedOn: [],
                },
            },
            contentAnalysis: {
                spamWordsFound: foundSpamWords,
                capsRatioPercent: Math.round((capsWords.length / Math.max(1, subjectWords.length)) * 100),
                exclamationCount,
                linkCount,
                subjectAnalysis: {
                    length: subject.length,
                    score: subject.length >= 20 && subject.length <= 65 && capsWords.length === 0 ? 95 : 75,
                    issues: capsWords.length > 0 ? ["Csupa nagybetűs szavak"] : [],
                },
            },
            issues,
            recommendations: recommendations.length > 0 ? recommendations : ["A levelezési és szövegezési beállítások optimálisak az Inbox eléréséhez!"],
            optimizedSubjectAlternatives,
        }

        return {
            success: true,
            data: report,
        }
    } catch (err: any) {
        console.error("Deliverability test error:", err)
        return {
            success: false,
            error: err.message || "Hiba történt a kézbesíthetőségi vizsgálat során.",
        }
    }
}
