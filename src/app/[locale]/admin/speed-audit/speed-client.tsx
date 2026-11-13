"use client"

import { useState, useTransition } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { runSpeedScan, SpeedScanResult } from "@/app/actions/speed-audit"
import { saveAuditLead } from "@/app/actions/security-audit"
import {
    Zap,
    Gauge,
    Smartphone,
    Monitor,
    TrendingDown,
    Clock,
    FileCode,
    Layers,
    Server,
    ShieldAlert,
    AlertTriangle,
    CheckCircle2,
    RefreshCw,
    Copy,
    Check,
    Printer,
    Send,
    Sparkles,
    UserCheck,
    Building2,
    MailCheck,
    Mail,
    CheckCheck,
    ExternalLink,
} from "lucide-react"

const PRESET_DOMAINS = [
    { label: "BacklineIT.hu (Saját oldal)", domain: "backlineit.hu" },
    { label: "Alza.hu (E-kereskedelem)", domain: "alza.hu" },
    { label: "Index.hu (Híroldal)", domain: "index.hu" },
    { label: "OTP Bank (Pénzintézet)", domain: "otpbank.hu" },
]

export function SpeedClient() {
    const [domain, setDomain] = useState("backlineit.hu")
    const [isScanning, startScan] = useTransition()
    const [report, setReport] = useState<SpeedScanResult | null>(null)
    const [scanStep, setScanStep] = useState<string>("")
    const [copied, setCopied] = useState(false)

    // Outbound Lead Hub for Speed
    const [isOutboundOpen, setIsOutboundOpen] = useState(false)
    const [outreachPersona, setOutreachPersona] = useState<"ceo" | "marketing" | "it">("ceo")
    const [leadContactName, setLeadContactName] = useState("")
    const [leadContactEmail, setLeadContactEmail] = useState("")
    const [leadCompanyName, setLeadCompanyName] = useState("")
    const [customMessage, setCustomMessage] = useState("")
    const [isSavingLead, setIsSavingLead] = useState(false)
    const [outreachCopied, setOutreachCopied] = useState(false)

    const handleRunScan = () => {
        if (!domain.trim()) {
            toast.error("Kérlek, adj meg egy domain nevet!")
            return
        }

        setScanStep("DNS és hálózati kapcsolat létesítése...")

        startScan(async () => {
            toast.loading("Sebesség audit folyamatban...", { id: "speed-scan" })

            const t1 = setTimeout(() => setScanStep("Szerver TTFB és tömörítés vizsgálata..."), 800)
            const t2 = setTimeout(() => setScanStep("Core Web Vitals (FCP, LCP, CLS) elemzése..."), 1800)
            const t3 = setTimeout(() => setScanStep("Azure OpenAI GPT-4o konverzióvesztés kalkuláció..."), 2800)

            try {
                const res = await runSpeedScan(domain)

                clearTimeout(t1)
                clearTimeout(t2)
                clearTimeout(t3)
                toast.dismiss("speed-scan")

                if (res.success && res.data) {
                    setReport(res.data)
                    setScanStep("")
                    setLeadCompanyName(res.data.domain)
                    setLeadContactEmail(`info@${res.data.domain}`)
                    setLeadContactName("")
                    setCustomMessage(generateSpeedOutreachCopy(res.data, "ceo", `info@${res.data.domain}`, "", res.data.domain))
                    setIsOutboundOpen(false)
                    toast.success(`⚡ ${domain} sebesség vizsgálata sikeresen lefutott!`)
                } else {
                    setScanStep("")
                    toast.error(res.error || "Nem sikerült lefolytatni a sebesség vizsgálatot.")
                }
            } catch (err: any) {
                clearTimeout(t1)
                clearTimeout(t2)
                clearTimeout(t3)
                toast.dismiss("speed-scan")
                setScanStep("")
                console.error("Speed scan client error:", err)
                toast.error(err?.message || "Váratlan hiba történt a vizsgálat során.")
            }
        })
    }

    const generateSpeedOutreachCopy = (
        data: SpeedScanResult,
        persona: "ceo" | "marketing" | "it",
        email?: string,
        name?: string,
        company?: string
    ) => {
        const cName = company || data.domain
        let greeting = `Tisztelt ${cName} Vezetőség! / Tisztelt Döntéshozó!`
        if (name && name.trim()) greeting = `Tisztelt ${name.trim()}!`
        else if (persona === "marketing") greeting = `Tisztelt Marketing és Értékesítési Vezető!`
        else if (persona === "it") greeting = `Tisztelt IT Vezető / Webfejlesztő Kolléga!`

        return `${greeting}

Török Norbert vagyok a BacklineIT alapítója. Cégünk nagyvállalati és KKV weboldalak teljesítményoptimalizálásával, Next.js architektúrára történő átültetésével és felhős infrastruktúrájával foglalkozik — a Microsoft által hivatalosan elismert és támogatott hazai startupként.

A mai napon automatizált teljesítményvizsgálatot végeztünk a ${data.domain} weboldalon, és az eredmények (${data.score}/100-as pontszám mellett) egy olyan üzleti és konverziós szűk keresztmetszetet tártak fel, amelyről közvetlenül szeretnénk tájékoztatni Önöket:

Mért sebességi és üzleti mutatók:
1. Mobil teljesítmény pontszám: ${data.mobileScore} / 100 (${data.rating})
2. Fő tartalom betöltési ideje (LCP): ${data.webVitals.lcp.value} (ajánlott: < 2.5 mp)
3. Becsült látogatóvesztés a lassúság miatt: ${data.businessImpact.estimatedBounceRateIncrease}
4. Becsült konverziós kiesés: ${data.businessImpact.conversionLossPercent}

A Google és a statisztikai mérések alapján minden 1 másodperces késleltetés átlagosan 7%-kal csökkenti a vásárlói és ajánlatkérési konverziót, a türelmetlen mobil látogatók pedig átkattintanak a versenytársakhoz.

Jó hír, hogy a weboldal modern Next.js technológiával és Cloudflare CDN beállítással akár 300%-kal felgyorsítható, garantáltan 90+ zöld tartományba hozva az oldalt.

Microsoft for Startups partnerként a legmodernebb technológiákkal dolgozunk, ráadásul ÁFA-mentesen számlázunk (AAM), így a gyorsítás költsége azonnali 27%-os pénzügyi megtakarítást jelent Önöknek.

Amennyiben szeretnék megnézni, hogyan érhető el azonnali < 1.5 másodperces mobil betöltés, szívesen állunk rendelkezésre egy 15 perces konzultációra.

Üdvözlettel,
Török Norbert
Alapító & Rendszermérnök | BacklineIT
Web: https://backlineit.hu
Telefon: +36 [...]
E-mail: info@backlineit.hu`
    }

    const copyReportSummary = async () => {
        if (!report) return
        const text = `
⚡ BACKLINEIT WEBOLDAL SEBESSÉG & KONVERZIÓ AUDIT
Célpont: ${report.domain}
Dátum: ${report.scanDate}
Összesített Pontszám: ${report.score} / 100 (${report.rating})
Mobil: ${report.mobileScore}/100 | Asztali: ${report.desktopScore}/100

📊 CORE WEB VITALS:
• TTFB (Szerver válaszidő): ${report.webVitals.ttfb.value}
• FCP (Első tartalom): ${report.webVitals.fcp.value}
• LCP (Fő tartalom): ${report.webVitals.lcp.value}
• CLS (Elrendezés eltolódás): ${report.webVitals.cls.value}

💸 BECSÜLT ÜZLETI HATÁS:
• Látogató-lemorzsolódás: ${report.businessImpact.estimatedBounceRateIncrease}
• Konverzióvesztés: ${report.businessImpact.conversionLossPercent}
• ${report.businessImpact.revenueImpactSummary}

📋 VEZETŐI ÖSSZEFOGLALÓ:
${report.summary}

🎯 AKCIÓTERV:
${report.actionPlan.map((a) => `${a.priority}. ${a.task} -> ${a.impact}`).join("\n")}
`
        try {
            await navigator.clipboard.writeText(text.trim())
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
            toast.success("Sebesség audit jelentés másolva a vágólapra!")
        } catch {
            toast.error("Nem sikerült másolni.")
        }
    }

    const handleSaveLeadToCrm = async () => {
        if (!report) return
        setIsSavingLead(true)
        try {
            const subject = `Sebesség és konverziós észrevétel a ${report.domain} weboldallal kapcsolatban`
            const fullOutreach = `TÁRGY: ${subject}\n\n${customMessage}`
            const res = await saveAuditLead({
                domain: report.domain,
                companyName: leadCompanyName || report.domain,
                contactEmail: leadContactEmail || `info@${report.domain}`,
                contactName: leadContactName || undefined,
                score: report.score,
                riskLevel: report.rating,
                notes: `[SEBESSÉG AUDIT] Mobil: ${report.mobileScore}/100, LCP: ${report.webVitals.lcp.value}, Visszafordulási többlet: ${report.businessImpact.estimatedBounceRateIncrease}`,
                outreachTemplate: fullOutreach,
            })
            if (res.success) {
                toast.success(`🎉 ${report.domain} sikeresen elmentve a CRM Lead adatbázisba!`)
            } else {
                toast.error(res.error || "Nem sikerült menteni a leadet.")
            }
        } catch (e: any) {
            toast.error(e.message || "Hiba történt.")
        } finally {
            setIsSavingLead(false)
        }
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500 max-w-7xl mx-auto pb-16">
            {/* Header Banner */}
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#070b14] via-[#091024] to-[#140b24] p-8 md:p-10 shadow-2xl">
                <div className="relative z-10 max-w-3xl space-y-4">
                    <div className="flex flex-wrap items-center gap-2">
                        <Badge className="bg-amber-500/10 text-amber-300 border-amber-500/20 px-3 py-1 font-medium flex items-center gap-1.5">
                            <Zap className="h-3.5 w-3.5 text-amber-400" />
                            Core Web Vitals & TTFB Scanner
                        </Badge>
                        <Badge className="bg-purple-500/10 text-purple-300 border-purple-500/20 px-3 py-1 font-medium flex items-center gap-1.5">
                            <Sparkles className="h-3.5 w-3.5 text-purple-400" />
                            Azure OpenAI Konverzió-kalkuláció
                        </Badge>
                    </div>

                    <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white">
                        Weboldal Sebesség & <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400">
                            Konverzió-veszteség Robot
                        </span>
                    </h1>

                    <p className="text-slate-300 text-sm md:text-base leading-relaxed">
                        Mérd fel bármely weboldal valós betöltési sebességét, mérd fel a Google Core Web Vitals értékeit,
                        és számold ki másodpercek alatt a lassúság okozta becsült látogató- és bevételkiesést.
                    </p>
                </div>

                <div className="absolute -right-10 -bottom-10 h-72 w-72 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
                <div className="absolute right-40 -top-10 h-60 w-60 rounded-full bg-orange-500/10 blur-3xl pointer-events-none" />
            </div>

            {/* Target Input Card */}
            <Card className="border border-white/10 bg-[#090d16]/80 rounded-3xl p-6 md:p-8 shadow-xl">
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400">
                        <Gauge className="h-4 w-4" />
                        Célpont Weboldal Megadása
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="relative flex-1">
                            <Input
                                placeholder="Írd be a vizsgálandó domain nevet (pl.: alza.hu vagy cegnev.hu)"
                                value={domain}
                                onChange={(e) => setDomain(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleRunScan()}
                                disabled={isScanning}
                                className="bg-[#0b101c] border-white/10 text-white placeholder:text-slate-500 text-base h-14 rounded-2xl px-4 focus-visible:ring-amber-500 focus-visible:border-amber-500"
                            />
                        </div>

                        <Button
                            type="button"
                            onClick={handleRunScan}
                            disabled={isScanning}
                            className="h-14 px-8 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white font-bold rounded-2xl shadow-lg shadow-orange-500/20 text-base transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 shrink-0"
                        >
                            {isScanning ? (
                                <>
                                    <RefreshCw className="h-5 w-5 animate-spin" />
                                    Mérés Folyamatban...
                                </>
                            ) : (
                                <>
                                    <Zap className="h-5 w-5" />
                                    Sebesség Mérés Indítása
                                </>
                            )}
                        </Button>
                    </div>

                    {/* Presets */}
                    <div className="flex flex-wrap items-center gap-2 pt-2">
                        <span className="text-xs text-slate-400 font-semibold">Gyors teszt sablonok:</span>
                        {PRESET_DOMAINS.map((p) => (
                            <button
                                key={p.domain}
                                type="button"
                                onClick={() => setDomain(p.domain)}
                                className="text-xs px-3 py-1.5 rounded-xl border border-white/5 bg-white/5 hover:bg-amber-500/10 hover:border-amber-500/30 text-slate-300 hover:text-amber-200 transition-all cursor-pointer font-medium"
                            >
                                {p.label}
                            </button>
                        ))}
                    </div>

                    {/* Live Scanning Step Progress */}
                    {isScanning && (
                        <div className="pt-4 border-t border-white/5 flex items-center gap-3 text-xs text-amber-300 font-medium animate-pulse">
                            <RefreshCw className="h-4 w-4 animate-spin text-amber-400" />
                            <span>{scanStep || "Sebességmérés indítása..."}</span>
                        </div>
                    )}
                </div>
            </Card>

            {/* Results Section */}
            {report && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {/* Top Overview Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Score Card */}
                        <Card
                            className={`border rounded-3xl p-6 flex flex-col justify-between shadow-xl ${
                                report.score >= 85
                                    ? "bg-gradient-to-br from-emerald-950/40 to-slate-900 border-emerald-500/30"
                                    : report.score >= 65
                                    ? "bg-gradient-to-br from-amber-950/40 to-slate-900 border-amber-500/30"
                                    : "bg-gradient-to-br from-rose-950/40 to-slate-900 border-rose-500/30"
                            }`}
                        >
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                    Sebességi Index
                                </span>
                                <Gauge
                                    className={`h-5 w-5 ${
                                        report.score >= 85 ? "text-emerald-400" : report.score >= 65 ? "text-amber-400" : "text-rose-400"
                                    }`}
                                />
                            </div>
                            <div className="my-2">
                                <div className="text-5xl font-black text-white flex items-baseline gap-1">
                                    {report.score}
                                    <span className="text-lg font-bold text-slate-400">/ 100</span>
                                </div>
                                <div className="text-xs font-bold uppercase tracking-wider mt-1 text-slate-300">
                                    {report.rating} Sebesség
                                </div>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-slate-400 pt-2 border-t border-white/5">
                                <span className="flex items-center gap-1">
                                    <Smartphone className="h-3.5 w-3.5 text-amber-400" /> Mobil: {report.mobileScore}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Monitor className="h-3.5 w-3.5 text-cyan-400" /> Asztali: {report.desktopScore}
                                </span>
                            </div>
                        </Card>

                        {/* Bounce Increase Card */}
                        <Card className="border border-rose-500/20 bg-rose-950/10 rounded-3xl p-6 flex flex-col justify-between shadow-xl">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-semibold text-rose-300 uppercase tracking-wider">
                                    Lemorzsolódási Többlet
                                </span>
                                <TrendingDown className="h-5 w-5 text-rose-400" />
                            </div>
                            <div className="my-2">
                                <div className="text-4xl font-black text-rose-400">
                                    {report.businessImpact.estimatedBounceRateIncrease}
                                </div>
                                <p className="text-xs text-slate-300 mt-1">
                                    türelmetlen mobil látogató elvesztése a lassúság miatt
                                </p>
                            </div>
                            <span className="text-[10px] text-slate-400 font-mono">
                                LCP: {report.webVitals.lcp.value}
                            </span>
                        </Card>

                        {/* Conversion Loss Card */}
                        <Card className="border border-amber-500/20 bg-amber-950/10 rounded-3xl p-6 flex flex-col justify-between shadow-xl">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-semibold text-amber-300 uppercase tracking-wider">
                                    Becsült Konverzióvesztés
                                </span>
                                <AlertTriangle className="h-5 w-5 text-amber-400" />
                            </div>
                            <div className="my-2">
                                <div className="text-4xl font-black text-amber-400">
                                    {report.businessImpact.conversionLossPercent}
                                </div>
                                <p className="text-xs text-slate-300 mt-1">
                                    kevesebb ajánlatkérés / online vásárlás
                                </p>
                            </div>
                            <span className="text-[10px] text-slate-400 font-mono">
                                Benchmark: Google PageSpeed Statisztika
                            </span>
                        </Card>

                        {/* Server TTFB Card */}
                        <Card className="border border-white/10 bg-[#090d16]/80 rounded-3xl p-6 flex flex-col justify-between shadow-xl">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                    Szerver Válaszidő (TTFB)
                                </span>
                                <Clock className="h-5 w-5 text-cyan-400" />
                            </div>
                            <div className="my-2">
                                <div className="text-4xl font-black text-white">
                                    {report.timings.ttfbMs} <span className="text-lg font-bold text-slate-400">ms</span>
                                </div>
                                <p className="text-xs text-slate-300 mt-1">
                                    CDN: {report.pageStats.cdnProvider || "Közvetlen Tárhely"}
                                </p>
                            </div>
                            <span className="text-[10px] text-slate-400 font-mono">
                                Méret: {report.pageStats.htmlSizeKb} KB ({report.pageStats.scriptCount} script)
                            </span>
                        </Card>
                    </div>

                    {/* Core Web Vitals Grid */}
                    <Card className="border border-white/10 bg-[#090d16]/80 rounded-3xl p-6 shadow-xl space-y-4">
                        <div className="flex items-center justify-between pb-3 border-b border-white/5">
                            <div>
                                <h3 className="text-base font-bold text-white flex items-center gap-2">
                                    <Layers className="h-4 w-4 text-amber-400" />
                                    Google Core Web Vitals Részletezés
                                </h3>
                                <p className="text-xs text-slate-400">
                                    A Google rangsorolást és felhasználói élményt meghatározó hivatalos mérőszámok
                                </p>
                            </div>
                            <Badge className="bg-white/5 text-slate-300 border-white/10 text-xs">
                                4 Kulcs Metrika
                            </Badge>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {Object.values(report.webVitals).map((m, idx) => (
                                <div
                                    key={idx}
                                    className="p-4 rounded-2xl border border-white/5 bg-[#0b101c] flex flex-col justify-between space-y-2"
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                                            {m.name}
                                        </span>
                                        <Badge
                                            className={`text-[10px] ${
                                                m.status === "good"
                                                    ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                                                    : m.status === "needs-improvement"
                                                    ? "bg-amber-500/20 text-amber-300 border-amber-500/30"
                                                    : "bg-rose-500/20 text-rose-300 border-rose-500/30"
                                            }`}
                                        >
                                            {m.status === "good" ? "Jó" : m.status === "needs-improvement" ? "Közepes" : "Gyenge"}
                                        </Badge>
                                    </div>
                                    <div className="text-2xl font-black text-white">{m.value}</div>
                                    <p className="text-[11px] text-slate-400 leading-tight">{m.description}</p>
                                </div>
                            ))}
                        </div>
                    </Card>

                    {/* Executive Summary Card & Action Bar */}
                    <Card className="border border-white/10 bg-[#090d16]/80 rounded-3xl shadow-xl overflow-hidden">
                        <CardHeader className="border-b border-white/5 bg-[#0b101c]/60 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
                                    <Zap className="h-5 w-5 text-amber-400" />
                                    Vezetői Sebesség & Konverzió Értékelés ({report.domain})
                                </CardTitle>
                                <CardDescription className="text-slate-400 text-xs">
                                    Generálva: {report.scanDate} • Azure OpenAI GPT-4o Performance Engine
                                </CardDescription>
                            </div>

                            <div className="flex flex-wrap items-center gap-2.5">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={copyReportSummary}
                                    className="border-white/10 hover:border-white/20 bg-white/5 text-slate-200 text-xs rounded-xl flex items-center gap-1.5 cursor-pointer"
                                >
                                    {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5 text-slate-400" />}
                                    {copied ? "Másolva!" : "Jelentés Másolása"}
                                </Button>

                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => window.print()}
                                    className="border-white/10 hover:border-white/20 bg-white/5 text-slate-300 hover:text-white text-xs rounded-xl flex items-center gap-1.5 cursor-pointer"
                                >
                                    <Printer className="h-3.5 w-3.5 text-slate-400" />
                                    Nyomtatás
                                </Button>

                                <Button
                                    type="button"
                                    onClick={() => setIsOutboundOpen((prev) => !prev)}
                                    className="bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 hover:from-amber-500 hover:to-rose-500 text-white text-xs font-bold rounded-xl border border-amber-400/40 shadow-lg shadow-orange-500/25 flex items-center gap-1.5 cursor-pointer transition-all duration-300"
                                >
                                    <Send className="h-3.5 w-3.5 text-amber-200" />
                                    {isOutboundOpen ? "Megkereső Elrejtése" : "🚀 Sebesség Ajánlat & Lead Hub"}
                                </Button>
                            </div>
                        </CardHeader>

                        <CardContent className="p-6 md:p-8 space-y-6">
                            {/* Outbound Lead Hub for Speed */}
                            {isOutboundOpen && (
                                <div className="bg-gradient-to-br from-[#1c1106] via-[#090d16] to-[#1c0812] border-2 border-orange-500/30 rounded-3xl p-6 sm:p-8 space-y-6 shadow-[0_0_40px_rgba(249,115,22,0.15)] animate-in fade-in slide-in-from-top-4 duration-300">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-orange-500/20">
                                        <div>
                                            <div className="flex items-center gap-2 text-xs font-extrabold text-orange-400 uppercase tracking-widest">
                                                <Sparkles className="h-4 w-4" />
                                                BacklineIT Speed Pitch & Lead Hunter
                                            </div>
                                            <h3 className="text-xl font-black text-white mt-1">
                                                Weboldal Gyorsítási Ajánlat: {leadCompanyName || report.domain}
                                            </h3>
                                            <p className="text-xs text-slate-400">
                                                Konverzióvesztésre és sebességre fókuszáló hideg megkeresés az audit adatok alapján.
                                            </p>
                                        </div>
                                        <Badge className="bg-orange-500/20 text-orange-300 border-orange-500/30 px-3 py-1 text-xs">
                                            Microsoft Startup & ÁFA-mentes (AAM) Előny
                                        </Badge>
                                    </div>

                                    {/* Persona Selector */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                                            <UserCheck className="h-4 w-4 text-orange-400" />
                                            Célzott Szerepkör
                                        </label>
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setOutreachPersona("ceo")
                                                    setCustomMessage(generateSpeedOutreachCopy(report, "ceo", leadContactEmail, leadContactName, leadCompanyName))
                                                }}
                                                className={`p-3 rounded-2xl border text-left transition-all ${
                                                    outreachPersona === "ceo"
                                                        ? "bg-orange-500/20 border-orange-500 text-white shadow-[0_0_15px_rgba(249,115,22,0.25)]"
                                                        : "bg-white/5 border-white/5 text-slate-400 hover:text-white"
                                                }`}
                                            >
                                                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                                                    <Building2 className="h-3.5 w-3.5 text-orange-400" />
                                                    Ügyvezető / Cégvezető
                                                </div>
                                                <p className="text-[11px] text-slate-400 mt-0.5">Vásárlóvesztés, bevételkiesés, versenyhátrány</p>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setOutreachPersona("marketing")
                                                    setCustomMessage(generateSpeedOutreachCopy(report, "marketing", leadContactEmail, leadContactName, leadCompanyName))
                                                }}
                                                className={`p-3 rounded-2xl border text-left transition-all ${
                                                    outreachPersona === "marketing"
                                                        ? "bg-orange-500/20 border-orange-500 text-white shadow-[0_0_15px_rgba(249,115,22,0.25)]"
                                                        : "bg-white/5 border-white/5 text-slate-400 hover:text-white"
                                                }`}
                                            >
                                                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                                                    <TrendingDown className="h-3.5 w-3.5 text-pink-400" />
                                                    Marketing & E-commerce Vezető
                                                </div>
                                                <p className="text-[11px] text-slate-400 mt-0.5">Hirdetési ROI, visszafordulási arány, Google SEO</p>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setOutreachPersona("it")
                                                    setCustomMessage(generateSpeedOutreachCopy(report, "it", leadContactEmail, leadContactName, leadCompanyName))
                                                }}
                                                className={`p-3 rounded-2xl border text-left transition-all ${
                                                    outreachPersona === "it"
                                                        ? "bg-orange-500/20 border-orange-500 text-white shadow-[0_0_15px_rgba(249,115,22,0.25)]"
                                                        : "bg-white/5 border-white/5 text-slate-400 hover:text-white"
                                                }`}
                                            >
                                                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                                                    <Server className="h-3.5 w-3.5 text-cyan-400" />
                                                    IT / Webfejlesztő
                                                </div>
                                                <p className="text-[11px] text-slate-400 mt-0.5">TTFB, LCP, Cloudflare CDN és Next.js kód</p>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Lead Inputs */}
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                        <div>
                                            <label className="text-[11px] font-semibold text-slate-400">Kapcsolattartó Neve</label>
                                            <Input
                                                placeholder="pl.: Varga Tamás"
                                                value={leadContactName}
                                                onChange={(e) => {
                                                    setLeadContactName(e.target.value)
                                                    setCustomMessage(generateSpeedOutreachCopy(report, outreachPersona, leadContactEmail, e.target.value, leadCompanyName))
                                                }}
                                                className="mt-1 bg-white/5 border-white/10 text-white rounded-xl text-xs h-9"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[11px] font-semibold text-slate-400">Cég Neve</label>
                                            <Input
                                                placeholder="pl.: Alza Magyarország"
                                                value={leadCompanyName}
                                                onChange={(e) => {
                                                    setLeadCompanyName(e.target.value)
                                                    setCustomMessage(generateSpeedOutreachCopy(report, outreachPersona, leadContactEmail, leadContactName, e.target.value))
                                                }}
                                                className="mt-1 bg-white/5 border-white/10 text-white rounded-xl text-xs h-9"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[11px] font-semibold text-slate-400">E-mail Cím</label>
                                            <Input
                                                placeholder="pl.: info@alza.hu"
                                                value={leadContactEmail}
                                                onChange={(e) => setLeadContactEmail(e.target.value)}
                                                className="mt-1 bg-white/5 border-white/10 text-white rounded-xl text-xs h-9"
                                            />
                                        </div>
                                    </div>

                                    {/* Textarea */}
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                                                Generált Gyorsítási Ajánlat és Hideg Megkeresés
                                            </label>
                                            <span className="text-[11px] text-slate-400">
                                                💡 27% ÁFA előny és Microsoft technológia kiemelve
                                            </span>
                                        </div>
                                        <Textarea
                                            rows={13}
                                            value={customMessage}
                                            onChange={(e) => setCustomMessage(e.target.value)}
                                            className="bg-[#0b101c] border-white/10 text-slate-200 font-sans text-xs leading-relaxed rounded-2xl p-4 focus-visible:ring-orange-500"
                                        />
                                    </div>

                                    {/* Outbound Actions */}
                                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <Button
                                                type="button"
                                                onClick={async () => {
                                                    await navigator.clipboard.writeText(customMessage)
                                                    setOutreachCopied(true)
                                                    setTimeout(() => setOutreachCopied(false), 2000)
                                                    toast.success("Gyorsítási megkeresés másolva a vágólapra!")
                                                }}
                                                className="bg-white/10 hover:bg-white/20 text-white border border-white/10 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                                            >
                                                {outreachCopied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4 text-slate-300" />}
                                                {outreachCopied ? "Másolva!" : "📋 Szöveg Másolása"}
                                            </Button>

                                            <Button
                                                type="button"
                                                onClick={() => {
                                                    const subject = encodeURIComponent(`Sebességi és konverziós észrevétel a ${report.domain} weboldallal kapcsolatban`)
                                                    const body = encodeURIComponent(customMessage)
                                                    const email = encodeURIComponent(leadContactEmail || `info@${report.domain}`)
                                                    window.open(`mailto:${email}?subject=${subject}&body=${body}`, "_blank")
                                                }}
                                                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 border border-blue-400/30 cursor-pointer"
                                            >
                                                <Mail className="h-4 w-4" />
                                                📧 Megnyitás Levelezőben (mailto:)
                                            </Button>
                                        </div>

                                        <Button
                                            type="button"
                                            onClick={handleSaveLeadToCrm}
                                            disabled={isSavingLead}
                                            className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 border border-emerald-400/40 shadow-lg shadow-emerald-500/20 cursor-pointer"
                                        >
                                            {isSavingLead ? <RefreshCw className="h-4 w-4 animate-spin" /> : <CheckCheck className="h-4 w-4 text-emerald-200" />}
                                            💾 Mentés a CRM-be Leadként
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {/* Summary Text */}
                            <div className="bg-[#0b101c] border border-white/5 rounded-2xl p-6 space-y-3">
                                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">
                                    Vezetői Összefoglaló (Cégvezetőknek & Döntéshozóknak)
                                </h4>
                                <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">
                                    {report.summary}
                                </p>
                            </div>

                            {/* Bottlenecks and Action Plan */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Bottlenecks */}
                                <div className="space-y-3">
                                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                                        <AlertTriangle className="h-4 w-4 text-orange-400" />
                                        Feltárt Lassulási Okok ({report.bottlenecks.length})
                                    </h4>
                                    <div className="space-y-3">
                                        {report.bottlenecks.map((b, idx) => (
                                            <div
                                                key={idx}
                                                className="p-4 rounded-2xl border border-white/5 bg-[#0b101c] space-y-2"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <span className="text-xs font-bold text-white">{b.title}</span>
                                                    <Badge className="bg-orange-500/20 text-orange-300 border-orange-500/30 text-[10px]">
                                                        {(b.severity || "warning").toUpperCase()}
                                                    </Badge>
                                                </div>
                                                <p className="text-xs text-slate-300">{b.description}</p>
                                                <p className="text-xs text-amber-400 font-medium">💡 {b.recommendation}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Action Plan */}
                                <div className="space-y-3">
                                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                                        <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                                        Prioritizált Gyorsítási Terv
                                    </h4>
                                    <div className="space-y-3">
                                        {report.actionPlan.map((a, idx) => (
                                            <div
                                                key={idx}
                                                className="p-4 rounded-2xl border border-white/5 bg-[#0b101c] flex items-start gap-3"
                                            >
                                                <div className="h-6 w-6 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold flex items-center justify-center shrink-0">
                                                    {a.priority}
                                                </div>
                                                <div className="space-y-0.5">
                                                    <div className="text-xs font-bold text-white">{a.task}</div>
                                                    <div className="text-xs text-slate-400">{a.impact}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Backline Proposal Box */}
                            <div className="bg-gradient-to-r from-amber-950/40 via-[#0d1424] to-orange-950/40 border border-amber-500/30 rounded-2xl p-6 space-y-3">
                                <div className="text-xs font-bold uppercase tracking-wider text-amber-400">
                                    {report.backlineProposal.headline}
                                </div>
                                <div className="text-sm font-bold text-white">
                                    Ajánlott csomag: {report.backlineProposal.recommendedService}
                                </div>
                                <p className="text-xs text-slate-300 leading-relaxed">
                                    {report.backlineProposal.pitch}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    )
}
