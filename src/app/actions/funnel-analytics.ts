"use server"

import { prisma } from "@/lib/db"
import { auth } from "@/auth"

export type DomainFilter = "all" | "backlineit.hu" | "backlineit.com"
export type TimeRangeFilter = "7d" | "30d" | "90d"

export interface FunnelStage {
    id: string
    label: string
    description: string
    count: number
    conversionFromPrev: number // percentage vs previous stage (100 for stage 1)
    dropOffFromPrev: number // percentage lost from previous stage
    conversionFromTop: number // percentage vs stage 1
}

export interface MicroFunnelStep {
    step: string
    label: string
    count: number
    conversionFromPrev: number
    dropOffCount: number
    dropOffPercent: number
}

export interface FieldDropOffItem {
    field: string
    fieldLabel: string
    funnel: string
    count: number
    sharePercent: number
}

export interface ExitPageItem {
    page: string
    views: number
    conversions: number
    dropOffPercent: number
}

export interface DomainComparisonItem {
    domain: string
    label: string
    flag: string
    sessions: number
    serviceViews: number
    formStarts: number
    submissions: number
    conversionRate: number
}

export interface DeviceFunnelItem {
    device: string
    sessions: number
    formStarts: number
    submissions: number
    conversionRate: number
    abandonRate: number
}

export interface CroInsight {
    severity: "critical" | "warning" | "good"
    title: string
    description: string
    action: string
}

export interface FunnelAnalyticsData {
    domain: DomainFilter
    range: TimeRangeFilter
    generatedAt: string
    kpis: {
        totalSessions: number
        formPageVisits: number
        formStarts: number
        totalSubmissions: number
        overallConversionRate: number
        abandonmentRate: number
        biggestDropOffLabel: string
        biggestDropOffPercent: number
    }
    macroFunnel: FunnelStage[]
    quoteWizardFunnel: MicroFunnelStep[]
    bookingWizardFunnel: MicroFunnelStep[]
    consultationFunnel: MicroFunnelStep[]
    domainComparison: DomainComparisonItem[]
    deviceBreakdown: DeviceFunnelItem[]
    abandonedFields: FieldDropOffItem[]
    exitPages: ExitPageItem[]
    insights: CroInsight[]
    hasMicroFunnelEvents: boolean
}

const FIELD_LABELS: Record<string, string> = {
    projectType: "Projekt típusa (1. lépés)",
    budget: "Költségkeret választás (2. lépés)",
    deadline: "Határidő választás (2. lépés)",
    name: "Név mező",
    email: "E-mail cím mező",
    phone: "Telefonszám mező",
    company: "Cégnév mező",
    description: "Projekt leírás / Üzenet",
    topic: "Téma választása (Időpontfoglaló)",
    time: "Dátum és Idősáv (Naptár)",
    message: "Részletes üzenet",
    unknown: "Oldal elhagyása interakció után",
}

function normalizeDomain(raw: unknown): "backlineit.hu" | "backlineit.com" {
    const str = String(raw || "").toLowerCase()
    if (str.includes("backlineit.com")) return "backlineit.com"
    return "backlineit.hu"
}

function isServicePath(page: string): boolean {
    const p = page.toLowerCase()
    return (
        p.includes("/szolgaltatasok") ||
        p.includes("/services") ||
        p.includes("/megoldasok") ||
        p.includes("/solutions") ||
        p.includes("/arak") ||
        p.includes("/pricing")
    )
}

function isFormPath(page: string): boolean {
    const p = page.toLowerCase()
    return (
        p.includes("/ajanlatkeres") ||
        p.includes("/request-a-quote") ||
        p.includes("/kapcsolat") ||
        p.includes("/contact") ||
        p.includes("/konzultacio") ||
        p.includes("/consultation")
    )
}

function computeDropOffSteps(rawSteps: Array<{ step: string; label: string; count: number }>): MicroFunnelStep[] {
    // Enforce non-increasing monotonicity? Keep real numbers, calculate ratios safely
    return rawSteps.map((item, idx) => {
        if (idx === 0) {
            return {
                ...item,
                conversionFromPrev: item.count > 0 ? 100 : 0,
                dropOffCount: 0,
                dropOffPercent: 0,
            }
        }
        const prevCount = rawSteps[idx - 1].count
        const base = Math.max(prevCount, item.count)
        const conv = base > 0 ? Math.round((item.count / base) * 1000) / 10 : 0
        const dropCount = Math.max(0, prevCount - item.count)
        const dropPct = prevCount > 0 ? Math.max(0, Math.round(((prevCount - item.count) / prevCount) * 1000) / 10) : 0
        return {
            ...item,
            conversionFromPrev: Math.min(100, conv),
            dropOffCount: dropCount,
            dropOffPercent: dropPct,
        }
    })
}

export async function getFunnelAnalytics(
    domain: DomainFilter = "all",
    range: TimeRangeFilter = "30d"
): Promise<FunnelAnalyticsData> {
    const session = await auth()
    const allowedRoles = ["ADMIN", "SUPER_ADMIN", "DEVELOPER", "SALES"]
    if (!session?.user || !allowedRoles.includes(session.user.role || "")) {
        throw new Error("Nincs jogosultságod a konverziós tölcsér adatok megtekintéséhez.")
    }

    const days = range === "7d" ? 7 : range === "90d" ? 90 : 30
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000)

    const [events, inquiryCount, contactCount, consultationCount, salesMeetingCount] = await Promise.all([
        prisma.analyticsEvent.findMany({
            where: {
                createdAt: { gte: since },
                name: { in: ["page_view", "view_service", "view_product", "funnel_step"] },
            },
            orderBy: { createdAt: "desc" },
            take: 15000,
            select: {
                id: true,
                name: true,
                properties: true,
                createdAt: true,
            },
        }),
        prisma.serviceInquiry.count({ where: { createdAt: { gte: since } } }),
        prisma.contactMessage.count({ where: { createdAt: { gte: since } } }),
        prisma.consultation.count({ where: { createdAt: { gte: since } } }),
        prisma.salesMeeting.count({ where: { createdAt: { gte: since } } }),
    ])

    // Session & domain tracking sets
    type SessionAgg = {
        domain: "backlineit.hu" | "backlineit.com"
        device: string
        pages: string[]
        lastPage: string
        visitedService: boolean
        visitedFormPage: boolean
        startedForm: boolean
        submitted: boolean
        abandoned: boolean
    }

    const sessionMap = new Map<string, SessionAgg>()
    const pageViewsCounter: Record<string, { views: number; sessions: Set<string>; convertedSessions: Set<string> }> = {}

    // Micro-funnel step counters (filtered by selected domain)
    const quoteSteps = {
        step_1_view: new Set<string>(),
        step_1_interact: new Set<string>(),
        step_2_budget: new Set<string>(),
        step_3_contact: new Set<string>(),
        submitted: new Set<string>(),
    }
    const bookingSteps = {
        step_1_details: new Set<string>(),
        step_1_interact: new Set<string>(),
        step_2_topic: new Set<string>(),
        step_3_schedule: new Set<string>(),
        step_4_message: new Set<string>(),
        submitted: new Set<string>(),
    }
    const consultationSteps = {
        step_1_view: new Set<string>(),
        step_1_interact: new Set<string>(),
        submitted: new Set<string>(),
    }

    const fieldAbandonMap: Record<string, { field: string; funnel: string; count: number }> = {}
    let totalFunnelEvents = 0

    for (const evt of events) {
        const props = (evt.properties || {}) as Record<string, any>
        const evtDomain = normalizeDomain(props.domain)
        const device = String(props.device || "Desktop")
        const page = String(props.page || (evt.name === "view_service" ? "/szolgaltatasok" : evt.name === "view_product" ? "/megoldasok" : "/"))
        const sid = String(props.visitorId || `evt-${evt.id}`)

        let sAgg = sessionMap.get(sid)
        if (!sAgg) {
            sAgg = {
                domain: evtDomain,
                device,
                pages: [],
                lastPage: page,
                visitedService: false,
                visitedFormPage: false,
                startedForm: false,
                submitted: false,
                abandoned: false,
            }
            sessionMap.set(sid, sAgg)
        }
        sAgg.pages.push(page)
        sAgg.lastPage = page

        if (evt.name === "view_service" || evt.name === "view_product" || isServicePath(page)) {
            sAgg.visitedService = true
        }
        if (isFormPath(page)) {
            sAgg.visitedFormPage = true
        }

        // Page-level aggregation for selected domain
        if (domain === "all" || evtDomain === domain) {
            if (evt.name === "page_view") {
                if (!pageViewsCounter[page]) {
                    pageViewsCounter[page] = { views: 0, sessions: new Set(), convertedSessions: new Set() }
                }
                pageViewsCounter[page].views += 1
                pageViewsCounter[page].sessions.add(sid)
            }
        }

        if (evt.name === "funnel_step") {
            totalFunnelEvents++
            const funnel = String(props.funnel || "")
            const step = String(props.step || "")

            if (step.includes("interact") || step.includes("step_2") || step.includes("step_3") || step.includes("step_4")) {
                sAgg.startedForm = true
            }
            if (step === "submitted") {
                sAgg.startedForm = true
                sAgg.submitted = true
                if (pageViewsCounter[page]) {
                    pageViewsCounter[page].convertedSessions.add(sid)
                }
            }
            if (step === "abandoned") {
                sAgg.startedForm = true
                sAgg.abandoned = true
            }

            if (domain === "all" || evtDomain === domain) {
                if (funnel === "quote") {
                    if (step in quoteSteps) {
                        quoteSteps[step as keyof typeof quoteSteps].add(sid)
                    }
                } else if (funnel === "booking") {
                    if (step in bookingSteps) {
                        bookingSteps[step as keyof typeof bookingSteps].add(sid)
                    }
                } else if (funnel === "consultation") {
                    if (step in consultationSteps) {
                        consultationSteps[step as keyof typeof consultationSteps].add(sid)
                    }
                }

                if (step === "abandoned") {
                    const fName = String(props.lastField || "unknown")
                    const key = `${funnel}::${fName}`
                    if (!fieldAbandonMap[key]) {
                        fieldAbandonMap[key] = { field: fName, funnel, count: 0 }
                    }
                    fieldAbandonMap[key].count += 1
                }
            }
        }
    }

    // Aggregate domain comparison & device breakdown across all sessions
    const domainStats: Record<"backlineit.hu" | "backlineit.com", { sessions: number; serviceViews: number; formStarts: number; submissions: number }> = {
        "backlineit.hu": { sessions: 0, serviceViews: 0, formStarts: 0, submissions: 0 },
        "backlineit.com": { sessions: 0, serviceViews: 0, formStarts: 0, submissions: 0 },
    }
    const deviceStats: Record<string, { sessions: number; formStarts: number; submissions: number; abandoned: number }> = {}

    let filteredSessions = 0
    let filteredServiceViews = 0
    let filteredFormPageVisits = 0
    let filteredFormStarts = 0
    let filteredSubmissions = 0
    let filteredAbandoned = 0

    for (const s of sessionMap.values()) {
        const ds = domainStats[s.domain]
        ds.sessions += 1
        if (s.visitedService) ds.serviceViews += 1
        if (s.startedForm) ds.formStarts += 1
        if (s.submitted) ds.submissions += 1

        if (domain === "all" || s.domain === domain) {
            filteredSessions += 1
            if (s.visitedService) filteredServiceViews += 1
            if (s.visitedFormPage) filteredFormPageVisits += 1
            if (s.startedForm) filteredFormStarts += 1
            if (s.submitted) filteredSubmissions += 1
            if (s.abandoned) filteredAbandoned += 1

            if (!deviceStats[s.device]) {
                deviceStats[s.device] = { sessions: 0, formStarts: 0, submissions: 0, abandoned: 0 }
            }
            const dv = deviceStats[s.device]
            dv.sessions += 1
            if (s.startedForm) dv.formStarts += 1
            if (s.submitted) dv.submissions += 1
            if (s.abandoned) dv.abandoned += 1
        }
    }

    // Combine real DB conversions if event-level submissions are lower (historical leads before beacon)
    const dbTotalLeads = inquiryCount + contactCount + consultationCount + salesMeetingCount
    const effectiveSubmissions = domain === "all" ? Math.max(filteredSubmissions, dbTotalLeads) : filteredSubmissions
    const effectiveFormStarts = Math.max(filteredFormStarts, effectiveSubmissions)
    const effectiveFormPageVisits = Math.max(filteredFormPageVisits, effectiveFormStarts)
    const effectiveServiceViews = Math.max(filteredServiceViews, effectiveFormPageVisits)
    const effectiveSessions = Math.max(filteredSessions, effectiveServiceViews)

    // Macro funnel 5 stages
    const rawMacro = [
        {
            id: "sessions",
            label: "1. Összes Látogató (Landolás)",
            description: "Egyedi látogatói munkamenetek a weboldalon",
            count: effectiveSessions,
        },
        {
            id: "services",
            label: "2. Szolgáltatás / Megoldás Érdeklődő",
            description: "Szolgáltatás-, megoldás- vagy árazás aloldalt megtekintők",
            count: effectiveServiceViews,
        },
        {
            id: "form_view",
            label: "3. Ajánlatkérő / Kapcsolat Oldal Elérése",
            description: "Megnyitotta az ajánlatkérés, kapcsolat vagy konzultáció oldalt",
            count: effectiveFormPageVisits,
        },
        {
            id: "form_start",
            label: "4. Űrlap Kitöltés Elkezdése",
            description: "Legalább egy mezőbe beírt vagy továbblépett a varázslóban",
            count: effectiveFormStarts,
        },
        {
            id: "converted",
            label: "5. Sikeres Konverzió (Beküldött Igény)",
            description: "Véglegesített ajánlatkérés, időpontfoglalás vagy üzenet",
            count: effectiveSubmissions,
        },
    ]

    let biggestDropOffLabel = "Nincs elegendő adat"
    let biggestDropOffPercent = 0

    const macroFunnel: FunnelStage[] = rawMacro.map((stage, idx) => {
        const topBase = rawMacro[0].count
        const conversionFromTop = topBase > 0 ? Math.round((stage.count / topBase) * 1000) / 10 : 0
        if (idx === 0) {
            return {
                ...stage,
                conversionFromPrev: stage.count > 0 ? 100 : 0,
                dropOffFromPrev: 0,
                conversionFromTop: stage.count > 0 ? 100 : 0,
            }
        }
        const prev = rawMacro[idx - 1].count
        const convPrev = prev > 0 ? Math.min(100, Math.round((stage.count / prev) * 1000) / 10) : 0
        const dropPrev = prev > 0 ? Math.max(0, Math.round(((prev - stage.count) / prev) * 1000) / 10) : 0

        if (prev > 0 && dropPrev > biggestDropOffPercent) {
            biggestDropOffPercent = dropPrev
            biggestDropOffLabel = `${rawMacro[idx - 1].label.split(".")[1]?.trim()} → ${stage.label.split(".")[1]?.trim()}`
        }

        return {
            ...stage,
            conversionFromPrev: convPrev,
            dropOffFromPrev: dropPrev,
            conversionFromTop: Math.min(100, conversionFromTop),
        }
    })

    // Micro-funnels
    const quoteWizardFunnel = computeDropOffSteps([
        { step: "step_1_view", label: "1. Oldal megnyitása (Projekt típus)", count: quoteSteps.step_1_view.size },
        { step: "step_1_interact", label: "2. Interakció / Típus kiválasztása", count: quoteSteps.step_1_interact.size },
        { step: "step_2_budget", label: "3. Költségkeret & Határidő lépés", count: quoteSteps.step_2_budget.size },
        { step: "step_3_contact", label: "4. Elérhetőségek megadása lépés", count: quoteSteps.step_3_contact.size },
        { step: "submitted", label: "5. Sikeres ajánlatkérés beküldve", count: quoteSteps.submitted.size },
    ])

    const bookingWizardFunnel = computeDropOffSteps([
        { step: "step_1_details", label: "1. Adatok lépés megnyitása", count: bookingSteps.step_1_details.size },
        { step: "step_1_interact", label: "2. Név / Email elkezdése", count: bookingSteps.step_1_interact.size },
        { step: "step_2_topic", label: "3. Téma választása", count: bookingSteps.step_2_topic.size },
        { step: "step_3_schedule", label: "4. Naptár / Idősáv választása", count: bookingSteps.step_3_schedule.size },
        { step: "step_4_message", label: "5. Üzenet & Összesítés", count: bookingSteps.step_4_message.size },
        { step: "submitted", label: "6. Sikeres foglalás", count: bookingSteps.submitted.size },
    ])

    const consultationFunnel = computeDropOffSteps([
        { step: "step_1_view", label: "1. Konzultációs oldal megnyitása", count: consultationSteps.step_1_view.size },
        { step: "step_1_interact", label: "2. Űrlap kitöltése elkezdve", count: consultationSteps.step_1_interact.size },
        { step: "submitted", label: "3. Sikeres konzultáció igénylés", count: consultationSteps.submitted.size },
    ])

    // Domain comparison
    const domainComparison: DomainComparisonItem[] = [
        {
            domain: "backlineit.hu",
            label: "Magyar piac (HUF)",
            flag: "🇭🇺",
            sessions: domainStats["backlineit.hu"].sessions,
            serviceViews: domainStats["backlineit.hu"].serviceViews,
            formStarts: domainStats["backlineit.hu"].formStarts,
            submissions: domainStats["backlineit.hu"].submissions,
            conversionRate: domainStats["backlineit.hu"].sessions > 0
                ? Math.round((domainStats["backlineit.hu"].submissions / domainStats["backlineit.hu"].sessions) * 1000) / 10
                : 0,
        },
        {
            domain: "backlineit.com",
            label: "Nemzetközi piac (EUR)",
            flag: "🌐",
            sessions: domainStats["backlineit.com"].sessions,
            serviceViews: domainStats["backlineit.com"].serviceViews,
            formStarts: domainStats["backlineit.com"].formStarts,
            submissions: domainStats["backlineit.com"].submissions,
            conversionRate: domainStats["backlineit.com"].sessions > 0
                ? Math.round((domainStats["backlineit.com"].submissions / domainStats["backlineit.com"].sessions) * 1000) / 10
                : 0,
        },
    ]

    // Device breakdown
    const deviceBreakdown: DeviceFunnelItem[] = Object.entries(deviceStats)
        .map(([device, st]) => ({
            device,
            sessions: st.sessions,
            formStarts: st.formStarts,
            submissions: st.submissions,
            conversionRate: st.sessions > 0 ? Math.round((st.submissions / st.sessions) * 1000) / 10 : 0,
            abandonRate: st.formStarts > 0 ? Math.round((st.abandoned / st.formStarts) * 1000) / 10 : 0,
        }))
        .sort((a, b) => b.sessions - a.sessions)

    // Field drop-offs
    const totalAbandonedFields = Object.values(fieldAbandonMap).reduce((sum, x) => sum + x.count, 0)
    const abandonedFields: FieldDropOffItem[] = Object.values(fieldAbandonMap)
        .map((item) => ({
            field: item.field,
            fieldLabel: FIELD_LABELS[item.field] || item.field,
            funnel: item.funnel === "quote" ? "Ajánlatkérés" : item.funnel === "booking" ? "Kapcsolat / Időpont" : "Konzultáció",
            count: item.count,
            sharePercent: totalAbandonedFields > 0 ? Math.round((item.count / totalAbandonedFields) * 1000) / 10 : 0,
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 8)

    // Top exit / landing pages
    const exitPages: ExitPageItem[] = Object.entries(pageViewsCounter)
        .map(([page, val]) => {
            const sessCount = val.sessions.size
            const convCount = val.convertedSessions.size
            return {
                page,
                views: val.views,
                conversions: convCount,
                dropOffPercent: sessCount > 0 ? Math.round(((sessCount - convCount) / sessCount) * 1000) / 10 : 0,
            }
        })
        .sort((a, b) => b.views - a.views)
        .slice(0, 8)

    // Overall rates
    const overallConversionRate = effectiveSessions > 0
        ? Math.round((effectiveSubmissions / effectiveSessions) * 1000) / 10
        : 0
    const abandonmentRate = effectiveFormStarts > 0
        ? Math.max(0, Math.round(((effectiveFormStarts - effectiveSubmissions) / effectiveFormStarts) * 1000) / 10)
        : 0

    // Rule-based CRO Insights
    const insights: CroInsight[] = []
    if (effectiveSessions === 0) {
        insights.push({
            severity: "warning",
            title: "Látogatói munkamenetek gyűjtése folyamatban",
            description: "A kiválasztott időszakban még nincs rögzített `page_view` vagy `funnel_step` adat ehhez a domain szűrőhöz.",
            action: "Nyisd meg a publikus oldalt inkognitó ablakban vagy várj az első élő látogatókra.",
        })
    } else {
        if (macroFunnel[2]?.dropOffFromPrev > 65) {
            insights.push({
                severity: "critical",
                title: "Magas lemorzsolódás a Szolgáltatás → Ajánlatkérés átmenetnél",
                description: `A szolgáltatások iránt érdeklődők ${macroFunnel[2].dropOffFromPrev}%-a nem lép tovább az ajánlatkérő vagy kapcsolat oldalra.`,
                action: "Helyezz el erősebb, hajtás feletti CTA gombokat és azonnali árazási példákat a szolgáltatás aloldalakon.",
            })
        }
        if (abandonmentRate > 40) {
            insights.push({
                severity: "warning",
                title: `Űrlap-félbehagyási arány: ${abandonmentRate}%`,
                description: "A látogatók elindítják az űrlap kitöltését, de több mint 40%-uk kilép beküldés előtt.",
                action: "Ellenőrizd a Félbehagyott Mezők listáját: egyszerűsítsd a költségkeret vagy kötelező mezők számát.",
            })
        }
        const mobile = deviceBreakdown.find((d) => d.device.toLowerCase().includes("mobile"))
        const desktop = deviceBreakdown.find((d) => d.device.toLowerCase().includes("desktop"))
        if (mobile && desktop && mobile.sessions >= 5 && mobile.conversionRate < desktop.conversionRate * 0.6) {
            insights.push({
                severity: "warning",
                title: "Mobilon gyengébb a konverzió, mint asztali gépen",
                description: `Mobil konverzió (${mobile.conversionRate}%) elmarad az asztali értéktől (${desktop.conversionRate}%).`,
                action: "Optimalizáld a mobil űrlaplépések gombjait és görgetési távolságát.",
            })
        }
        if (overallConversionRate >= 2.5) {
            insights.push({
                severity: "good",
                title: `Erős átfogó konverziós ráta (${overallConversionRate}%)`,
                description: "A B2B IT ügynökségi átlag (1.5–2.5%) felett teljesít a tölcsér a kiválasztott időszakban.",
                action: "Skálázd a fizetett vagy SEO forgalmat a legjobban konvertáló szolgáltatásoldalakra.",
            })
        }
        if (insights.length === 0) {
            insights.push({
                severity: "good",
                title: "Stabil tölcsérműködés, finomhangolás javasolt",
                description: `Összesen ${effectiveSessions} munkamenet és ${effectiveSubmissions} rögzített konverzió történt a vizsgált időszakban.`,
                action: "Kövesd a lépésenkénti mikrotölcsért az első űrlap-interakciók beérkezése után is.",
            })
        }
    }

    return {
        domain,
        range,
        generatedAt: new Date().toLocaleString("hu-HU"),
        kpis: {
            totalSessions: effectiveSessions,
            formPageVisits: effectiveFormPageVisits,
            formStarts: effectiveFormStarts,
            totalSubmissions: effectiveSubmissions,
            overallConversionRate,
            abandonmentRate,
            biggestDropOffLabel,
            biggestDropOffPercent,
        },
        macroFunnel,
        quoteWizardFunnel,
        bookingWizardFunnel,
        consultationFunnel,
        domainComparison,
        deviceBreakdown,
        abandonedFields,
        exitPages,
        insights,
        hasMicroFunnelEvents: totalFunnelEvents > 0,
    }
}
