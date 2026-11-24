"use client"

import { useState, useTransition, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import {
    runGrowthAudit,
    getRecentGrowthAudits,
    GrowthAuditReport,
} from "@/app/actions/growth-audit"
import {
    TrendingUp,
    Zap,
    ShieldCheck,
    Search,
    Target,
    FileDown,
    Copy,
    Check,
    RefreshCw,
    Sparkles,
    CheckCircle2,
    AlertTriangle,
    XCircle,
    ArrowRight,
    ExternalLink,
    Mail,
    Globe,
    Layers,
    Cpu,
    Calendar,
    Clock,
} from "lucide-react"

const PRESETS = [
    { domain: "harmonysound.eu", name: "Harmony Sound" },
    { domain: "backlineit.hu", name: "BacklineIT Magyarország" },
    { domain: "backlineit.com", name: "BacklineIT Global" },
    { domain: "index.hu", name: "Index Híroldal" },
]

export function GrowthAuditClient() {
    const [domain, setDomain] = useState("")
    const [businessName, setBusinessName] = useState("")
    const [isPending, startTransition] = useTransition()
    const [report, setReport] = useState<GrowthAuditReport | null>(null)
    const [copiedEmail, setCopiedEmail] = useState(false)
    const [isDownloadingPdf, setIsDownloadingPdf] = useState(false)
    const [recentAudits, setRecentAudits] = useState<any[]>([])

    useEffect(() => {
        getRecentGrowthAudits().then(setRecentAudits).catch(() => {})
    }, [])

    const handleRunAudit = (targetDomain?: string, targetName?: string) => {
        const dom = targetDomain || domain
        const name = targetName !== undefined ? targetName : businessName

        if (!dom.trim()) {
            toast.error("Kérlek, add meg a vizsgálni kívánt weboldal domainjét!")
            return
        }

        startTransition(async () => {
            const res = await runGrowthAudit(dom, name)
            if (res.success && res.data) {
                setReport(res.data)
                toast.success(`Sikeres auditálás: ${res.data.domain} (${res.data.overallScore}/100 pont)!`)
                getRecentGrowthAudits().then(setRecentAudits).catch(() => {})
            } else {
                toast.error(res.error || "Hiba történt a vizsgálat során.")
            }
        })
    }

    const handleDownloadPdf = async () => {
        if (!report) return
        setIsDownloadingPdf(true)
        try {
            const res = await fetch("/api/admin/growth-audit/pdf", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(report),
            })

            if (!res.ok) {
                throw new Error("Nem sikerült a PDF generálása.")
            }

            const blob = await res.blob()
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement("a")
            a.href = url
            a.download = `BacklineIT-Weboldal-Novekedesi-Audit-${report.domain}.pdf`
            document.body.appendChild(a)
            a.click()
            window.URL.revokeObjectURL(url)
            document.body.removeChild(a)
            toast.success("Vezetői PDF jelentés sikeresen letöltve!")
        } catch (e: any) {
            toast.error(e.message || "Hiba a PDF letöltésekor.")
        } finally {
            setIsDownloadingPdf(false)
        }
    }

    const handleCopyEmail = () => {
        if (!report?.coldPitchEmail) return
        const text = `Tárgy: ${report.coldPitchEmail.subject}\n\n${report.coldPitchEmail.body}`
        navigator.clipboard.writeText(text)
        setCopiedEmail(true)
        toast.success("Hideg értékesítési e-mail szövege másolva a vágólapra!")
        setTimeout(() => setCopiedEmail(false), 3000)
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-cyan-950/30 to-purple-950/30 border border-emerald-500/20 backdrop-blur-xl shadow-2xl">
                <div className="space-y-1.5">
                    <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                            <TrendingUp className="h-5 w-5" />
                        </div>
                        <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                            1-Kattintásos Weboldal Audit & Növekedési Riport
                        </h1>
                        <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-mono text-[10px]">
                            AI STRATEGY
                        </Badge>
                    </div>
                    <p className="text-xs md:text-sm text-slate-300 max-w-2xl">
                        Vizsgálj meg bármely potenciális ügyféloldalt másodpercek alatt: technikai infrastruktúra, betöltési sebesség, SEO, konverziós potenciál és azonnali nyomtatható vezetői PDF export.
                    </p>
                </div>
            </div>

            {/* Input form */}
            <Card className="bg-[#090d16]/90 border-white/10 shadow-xl backdrop-blur-xl">
                <CardHeader className="pb-3">
                    <CardTitle className="text-base text-white flex items-center gap-2">
                        <Globe className="h-4 w-4 text-cyan-400" />
                        Weboldal Diagnosztika Indítása
                    </CardTitle>
                    <CardDescription className="text-slate-400 text-xs">
                        Add meg a vizsgálni kívánt cég vagy projekt domainjét. A rendszer élő hálózati kérésekkel elemzi a struktúrát.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                        <div className="md:col-span-6">
                            <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5 block">
                                Cél Weboldal Domainje *
                            </label>
                            <Input
                                placeholder="pl. harmonysound.eu vagy minta-ceg.hu"
                                value={domain}
                                onChange={(e) => setDomain(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleRunAudit()}
                                disabled={isPending}
                                className="h-11 bg-white/[0.03] border-white/10 text-white placeholder:text-slate-500 rounded-xl focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50"
                            />
                        </div>
                        <div className="md:col-span-4">
                            <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5 block">
                                Vállalkozás / Ügyfél Neve (Opcionális)
                            </label>
                            <Input
                                placeholder="pl. Harmony Sound Tenerife"
                                value={businessName}
                                onChange={(e) => setBusinessName(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleRunAudit()}
                                disabled={isPending}
                                className="h-11 bg-white/[0.03] border-white/10 text-white placeholder:text-slate-500 rounded-xl focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50"
                            />
                        </div>
                        <div className="md:col-span-2 flex items-end">
                            <Button
                                onClick={() => handleRunAudit()}
                                disabled={isPending || !domain.trim()}
                                className="w-full h-11 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-medium rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all flex items-center justify-center gap-2"
                            >
                                {isPending ? (
                                    <>
                                        <RefreshCw className="h-4 w-4 animate-spin" />
                                        <span>Elemzés...</span>
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="h-4 w-4" />
                                        <span>Auditálás</span>
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>

                    {/* Presets */}
                    <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/5">
                        <span className="text-[11px] text-slate-400 font-medium">Gyors minták:</span>
                        {PRESETS.map((p) => (
                            <button
                                key={p.domain}
                                onClick={() => {
                                    setDomain(p.domain)
                                    setBusinessName(p.name)
                                    handleRunAudit(p.domain, p.name)
                                }}
                                disabled={isPending}
                                className="px-2.5 py-1 text-xs rounded-lg bg-white/[0.04] hover:bg-cyan-500/15 border border-white/10 hover:border-cyan-500/30 text-slate-300 hover:text-cyan-300 transition-all font-mono"
                            >
                                {p.domain}
                            </button>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* In Progress Loader */}
            {isPending && (
                <div className="p-8 rounded-2xl bg-[#090d16] border border-cyan-500/30 flex flex-col items-center justify-center gap-4 text-center">
                    <div className="relative">
                        <div className="w-16 h-16 rounded-full border-4 border-cyan-500/20 border-t-cyan-400 animate-spin" />
                        <Sparkles className="h-6 w-6 text-cyan-400 absolute inset-0 m-auto animate-pulse" />
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-base font-bold text-white">Élő Weboldal Audit & Növekedési Elemzés Folyamatban...</h3>
                        <p className="text-xs text-slate-400">
                            Hálózati sebesség (TTFB), SSL tanúsítvány, SEO meta adatok és technológiai stack vizsgálata.
                        </p>
                    </div>
                </div>
            )}

            {/* Report View */}
            {report && !isPending && (
                <div className="space-y-6 animate-in fade-in-50 duration-500">
                    {/* Top Action Bar */}
                    <div className="p-5 rounded-2xl bg-[#0b101d] border border-white/10 flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-xl">
                        <div className="flex items-center gap-4">
                            <div className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center font-bold text-white shadow-lg ${
                                report.overallScore >= 80 ? 'bg-gradient-to-br from-emerald-500 to-teal-700 shadow-emerald-500/20' :
                                report.overallScore >= 60 ? 'bg-gradient-to-br from-cyan-500 to-blue-700 shadow-cyan-500/20' :
                                report.overallScore >= 40 ? 'bg-gradient-to-br from-amber-500 to-orange-700 shadow-amber-500/20' :
                                'bg-gradient-to-br from-red-500 to-rose-700 shadow-red-500/20'
                            }`}>
                                <span className="text-xl leading-none">{report.grade}</span>
                                <span className="text-[10px] opacity-80">{report.overallScore}/100</span>
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h2 className="text-lg font-bold text-white">{report.businessName}</h2>
                                    <Badge variant="outline" className="text-cyan-400 border-cyan-500/30 text-xs font-mono">
                                        {report.domain}
                                    </Badge>
                                </div>
                                <p className="text-xs text-slate-400 mt-0.5">
                                    Auditálás dátuma: {report.analyzedAt} • Hitelesített BacklineIT Növekedési Riport
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2.5 flex-wrap">
                            <Button
                                onClick={handleDownloadPdf}
                                disabled={isDownloadingPdf}
                                className="h-10 px-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-medium rounded-xl shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all flex items-center gap-2 text-xs"
                            >
                                {isDownloadingPdf ? (
                                    <>
                                        <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                                        <span>PDF Generálása...</span>
                                    </>
                                ) : (
                                    <>
                                        <FileDown className="h-3.5 w-3.5" />
                                        <span>PDF Jelentés Letöltése</span>
                                    </>
                                )}
                            </Button>

                            <Button
                                onClick={handleCopyEmail}
                                variant="outline"
                                className="h-10 px-3.5 bg-white/[0.04] hover:bg-white/[0.08] border-white/10 text-slate-200 hover:text-white rounded-xl text-xs flex items-center gap-2 transition-all"
                            >
                                {copiedEmail ? (
                                    <>
                                        <Check className="h-3.5 w-3.5 text-emerald-400" />
                                        <span>Email Másolva!</span>
                                    </>
                                ) : (
                                    <>
                                        <Copy className="h-3.5 w-3.5 text-cyan-400" />
                                        <span>Email Pitch Másolása</span>
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>

                    {/* 4 Pillar Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Speed */}
                        <Card className="bg-[#090d16] border-white/10 relative overflow-hidden">
                            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-400" />
                            <CardHeader className="p-4 pb-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                                        <Zap className="h-3.5 w-3.5 text-emerald-400" />
                                        Sebesség & Kiszolgálás
                                    </span>
                                    <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/30 text-[10px]">
                                        {report.pillars.speed.status}
                                    </Badge>
                                </div>
                                <div className="text-2xl font-bold text-white mt-1">
                                    {report.pillars.speed.score}<span className="text-xs text-slate-400 font-normal">/100</span>
                                </div>
                            </CardHeader>
                            <CardContent className="p-4 pt-1 space-y-1 text-xs text-slate-300">
                                <div className="flex justify-between py-0.5 border-b border-white/5">
                                    <span className="text-slate-400">TTFB válaszidő:</span>
                                    <span className="font-mono text-cyan-300">{report.pillars.speed.ttfbMs} ms</span>
                                </div>
                                <div className="flex justify-between py-0.5 border-b border-white/5">
                                    <span className="text-slate-400">Tömörítés:</span>
                                    <span className="font-medium text-white">{report.pillars.speed.compression}</span>
                                </div>
                                <div className="flex justify-between py-0.5">
                                    <span className="text-slate-400">Protokoll:</span>
                                    <span className="text-slate-300">{report.pillars.speed.httpVersion}</span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Security */}
                        <Card className="bg-[#090d16] border-white/10 relative overflow-hidden">
                            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 to-blue-500" />
                            <CardHeader className="p-4 pb-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                                        <ShieldCheck className="h-3.5 w-3.5 text-cyan-400" />
                                        IT & Biztonság
                                    </span>
                                    <Badge className="bg-cyan-500/15 text-cyan-400 border-cyan-500/30 text-[10px]">
                                        {report.pillars.security.status}
                                    </Badge>
                                </div>
                                <div className="text-2xl font-bold text-white mt-1">
                                    {report.pillars.security.score}<span className="text-xs text-slate-400 font-normal">/100</span>
                                </div>
                            </CardHeader>
                            <CardContent className="p-4 pt-1 space-y-1 text-xs text-slate-300">
                                <div className="flex justify-between py-0.5 border-b border-white/5">
                                    <span className="text-slate-400">SSL Tanúsítvány:</span>
                                    <span className={report.pillars.security.hasSsl ? "text-emerald-400" : "text-red-400"}>
                                        {report.pillars.security.hasSsl ? "Érvényes (HTTPS)" : "Hiányzik!"}
                                    </span>
                                </div>
                                <div className="flex justify-between py-0.5 border-b border-white/5">
                                    <span className="text-slate-400">HSTS Fejléc:</span>
                                    <span className={report.pillars.security.hsts ? "text-emerald-400" : "text-amber-400"}>
                                        {report.pillars.security.hsts ? "Bekapcsolva" : "Nincs"}
                                    </span>
                                </div>
                                <div className="flex justify-between py-0.5">
                                    <span className="text-slate-400">CSP Védelem:</span>
                                    <span className={report.pillars.security.csp ? "text-emerald-400" : "text-amber-400"}>
                                        {report.pillars.security.csp ? "Aktív" : "Hiányzik"}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* SEO */}
                        <Card className="bg-[#090d16] border-white/10 relative overflow-hidden">
                            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-orange-500" />
                            <CardHeader className="p-4 pb-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                                        <Search className="h-3.5 w-3.5 text-amber-400" />
                                        SEO & Láthatóság
                                    </span>
                                    <Badge className="bg-amber-500/15 text-amber-400 border-amber-500/30 text-[10px]">
                                        {report.pillars.seo.status}
                                    </Badge>
                                </div>
                                <div className="text-2xl font-bold text-white mt-1">
                                    {report.pillars.seo.score}<span className="text-xs text-slate-400 font-normal">/100</span>
                                </div>
                            </CardHeader>
                            <CardContent className="p-4 pt-1 space-y-1 text-xs text-slate-300">
                                <div className="flex justify-between py-0.5 border-b border-white/5">
                                    <span className="text-slate-400">Title Hossz:</span>
                                    <span className="font-mono text-cyan-300">{report.pillars.seo.titleLength} kar.</span>
                                </div>
                                <div className="flex justify-between py-0.5 border-b border-white/5">
                                    <span className="text-slate-400">Meta Leírás:</span>
                                    <span className="font-mono text-cyan-300">{report.pillars.seo.metaDescriptionLength} kar.</span>
                                </div>
                                <div className="flex justify-between py-0.5">
                                    <span className="text-slate-400">H1 Címkék:</span>
                                    <span className="text-slate-300">{report.pillars.seo.h1Count} db</span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* CRO */}
                        <Card className="bg-[#090d16] border-white/10 relative overflow-hidden">
                            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-pink-500" />
                            <CardHeader className="p-4 pb-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                                        <Target className="h-3.5 w-3.5 text-purple-400" />
                                        Konverzió & Tech
                                    </span>
                                    <Badge className="bg-purple-500/15 text-purple-400 border-purple-500/30 text-[10px]">
                                        {report.pillars.cro.status}
                                    </Badge>
                                </div>
                                <div className="text-2xl font-bold text-white mt-1">
                                    {report.pillars.cro.score}<span className="text-xs text-slate-400 font-normal">/100</span>
                                </div>
                            </CardHeader>
                            <CardContent className="p-4 pt-1 space-y-1 text-xs text-slate-300">
                                <div className="flex justify-between py-0.5 border-b border-white/5">
                                    <span className="text-slate-400">Mobil Reszponzív:</span>
                                    <span className={report.pillars.cro.hasMobileViewport ? "text-emerald-400" : "text-red-400"}>
                                        {report.pillars.cro.hasMobileViewport ? "Igen" : "Nem!"}
                                    </span>
                                </div>
                                <div className="flex justify-between py-0.5 border-b border-white/5">
                                    <span className="text-slate-400">CTA Gombok:</span>
                                    <span className={report.pillars.cro.hasCta ? "text-emerald-400" : "text-amber-400"}>
                                        {report.pillars.cro.hasCta ? "Észlelve" : "Hiányos"}
                                    </span>
                                </div>
                                <div className="flex justify-between py-0.5">
                                    <span className="text-slate-400">Fő Technológia:</span>
                                    <span className="text-purple-300 truncate max-w-[100px]">
                                        {report.pillars.cro.detectedTech[0] || "Egyedi"}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Executive Summary & Strengths/Bottlenecks */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        <div className="lg:col-span-12">
                            <Card className="bg-[#090d16] border-white/10 p-5">
                                <div className="flex items-center gap-2 mb-2 text-cyan-400 font-bold text-sm uppercase tracking-wider">
                                    <Sparkles className="h-4 w-4" />
                                    Vezetői Összegzés & Helyzetértékelés
                                </div>
                                <p className="text-sm text-slate-300 leading-relaxed">
                                    {report.executiveSummary}
                                </p>
                            </Card>
                        </div>

                        {/* Strengths */}
                        <div className="lg:col-span-6">
                            <Card className="bg-emerald-950/20 border-emerald-500/30 p-5 h-full">
                                <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2 mb-3">
                                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                                    Azonnali Versenyelőnyök (Erősségek)
                                </h3>
                                <ul className="space-y-2 text-xs text-emerald-200/90">
                                    {report.keyStrengths.map((str, i) => (
                                        <li key={i} className="flex items-start gap-2">
                                            <span className="text-emerald-400 font-bold">✔</span>
                                            <span>{str}</span>
                                        </li>
                                    ))}
                                </ul>
                            </Card>
                        </div>

                        {/* Bottlenecks */}
                        <div className="lg:col-span-6">
                            <Card className="bg-red-950/20 border-red-500/30 p-5 h-full">
                                <h3 className="text-sm font-bold text-red-400 uppercase tracking-wider flex items-center gap-2 mb-3">
                                    <AlertTriangle className="h-4 w-4 text-red-400" />
                                    Bevételt Csökkentő Szűkkeresztmetszetek
                                </h3>
                                <ul className="space-y-2 text-xs text-red-200/90">
                                    {report.criticalBottlenecks.map((bot, i) => (
                                        <li key={i} className="flex items-start gap-2">
                                            <span className="text-red-400 font-bold">⚠</span>
                                            <span>{bot}</span>
                                        </li>
                                    ))}
                                </ul>
                            </Card>
                        </div>
                    </div>

                    {/* Tabs View */}
                    <Tabs defaultValue="roadmap" className="w-full">
                        <TabsList className="bg-white/[0.04] border border-white/10 p-1 rounded-xl">
                            <TabsTrigger value="roadmap" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-300 rounded-lg text-xs">
                                30–60–90 Napos Akcióterv
                            </TabsTrigger>
                            <TabsTrigger value="details" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-300 rounded-lg text-xs">
                                Részletes Ajánlások Pillérenként
                            </TabsTrigger>
                            <TabsTrigger value="email" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-300 rounded-lg text-xs">
                                Hideg Értékesítési Email Sablon
                            </TabsTrigger>
                            <TabsTrigger value="tech" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-300 rounded-lg text-xs">
                                Technológiai Ujjlenyomat
                            </TabsTrigger>
                        </TabsList>

                        {/* Roadmap Tab */}
                        <TabsContent value="roadmap" className="mt-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <Card className="bg-[#090d16] border-cyan-500/30 p-5">
                                    <div className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-2">
                                        {report.roadmap.phase30.title}
                                    </div>
                                    <ul className="space-y-2 text-xs text-slate-300">
                                        {report.roadmap.phase30.items.map((it, idx) => (
                                            <li key={idx} className="flex items-start gap-2">
                                                <span className="text-cyan-400 font-bold">1.{idx + 1}</span>
                                                <span>{it}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </Card>

                                <Card className="bg-[#090d16] border-purple-500/30 p-5">
                                    <div className="text-xs font-bold text-purple-400 uppercase tracking-wider mb-2">
                                        {report.roadmap.phase60.title}
                                    </div>
                                    <ul className="space-y-2 text-xs text-slate-300">
                                        {report.roadmap.phase60.items.map((it, idx) => (
                                            <li key={idx} className="flex items-start gap-2">
                                                <span className="text-purple-400 font-bold">2.{idx + 1}</span>
                                                <span>{it}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </Card>

                                <Card className="bg-[#090d16] border-emerald-500/30 p-5">
                                    <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">
                                        {report.roadmap.phase90.title}
                                    </div>
                                    <ul className="space-y-2 text-xs text-slate-300">
                                        {report.roadmap.phase90.items.map((it, idx) => (
                                            <li key={idx} className="flex items-start gap-2">
                                                <span className="text-emerald-400 font-bold">3.{idx + 1}</span>
                                                <span>{it}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </Card>
                            </div>
                        </TabsContent>

                        {/* Details Tab */}
                        <TabsContent value="details" className="mt-4 space-y-4">
                            {Object.entries(report.pillars).map(([key, p]: any) => (
                                <Card key={key} className="bg-[#090d16] border-white/10 p-5">
                                    <div className="flex items-center justify-between mb-3">
                                        <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                                            {key === "speed" ? "Sebesség & Kiszolgálás" :
                                             key === "security" ? "IT Biztonság & Kiberhigiénia" :
                                             key === "seo" ? "Keresőoptimalizálás (SEO)" : "Konverzió & Felhasználói Élmény"}
                                        </h4>
                                        <Badge variant="outline" className="text-cyan-400 border-cyan-500/30">
                                            Pontszám: {p.score}/100
                                        </Badge>
                                    </div>
                                    <div className="space-y-1.5">
                                        <p className="text-xs text-slate-400 font-semibold uppercase">Ajánlott akciók:</p>
                                        <ul className="space-y-1.5 text-xs text-slate-300">
                                            {p.recommendations.map((rec: string, idx: number) => (
                                                <li key={idx} className="flex items-start gap-2">
                                                    <span className="text-cyan-400">•</span>
                                                    <span>{rec}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </Card>
                            ))}
                        </TabsContent>

                        {/* Email Pitch Tab */}
                        <TabsContent value="email" className="mt-4">
                            <Card className="bg-[#090d16] border-white/10 p-5 space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <h4 className="text-sm font-bold text-white flex items-center gap-2">
                                            <Mail className="h-4 w-4 text-cyan-400" />
                                            Személyre Szabott Hideg Megkereső Email
                                        </h4>
                                        <p className="text-xs text-slate-400">
                                            Közvetlenül kiküldhető az ügyfél cégvezetőjének vagy marketing vezetőjének.
                                        </p>
                                    </div>
                                    <Button
                                        onClick={handleCopyEmail}
                                        size="sm"
                                        className="bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40"
                                    >
                                        {copiedEmail ? <Check className="h-3.5 w-3.5 mr-1 text-emerald-400" /> : <Copy className="h-3.5 w-3.5 mr-1" />}
                                        {copiedEmail ? "Másolva!" : "Teljes Email Másolása"}
                                    </Button>
                                </div>

                                <div className="space-y-3 pt-2">
                                    <div>
                                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Ajánlott Tárgysor:</label>
                                        <div className="p-2.5 rounded-lg bg-white/[0.03] border border-white/10 text-xs text-cyan-300 font-medium font-mono">
                                            {report.coldPitchEmail.subject}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Email Szövegtörzs:</label>
                                        <pre className="p-3.5 rounded-lg bg-white/[0.03] border border-white/10 text-xs text-slate-300 font-sans whitespace-pre-wrap leading-relaxed">
                                            {report.coldPitchEmail.body}
                                        </pre>
                                    </div>
                                </div>
                            </Card>
                        </TabsContent>

                        {/* Tech Tab */}
                        <TabsContent value="tech" className="mt-4">
                            <Card className="bg-[#090d16] border-white/10 p-5 space-y-4">
                                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                                    <Cpu className="h-4 w-4 text-purple-400" />
                                    Észlelt Technológiai Stack & Ökoszisztéma
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                    {report.pillars.cro.detectedTech.map((tech, i) => (
                                        <Badge key={i} className="px-3 py-1.5 bg-purple-500/15 border-purple-500/30 text-purple-300 text-xs font-mono">
                                            {tech}
                                        </Badge>
                                    ))}
                                </div>
                                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-xs text-slate-400 space-y-1">
                                    <p>• <strong>Meta Title:</strong> {report.pillars.seo.title}</p>
                                    <p>• <strong>Meta Description:</strong> {report.pillars.seo.metaDescription}</p>
                                    <p>• <strong>Főcímek (H1):</strong> {report.pillars.seo.h1Tags.join(" | ") || "Nincs"}</p>
                                </div>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            )}

            {/* Recent Audits Table */}
            {recentAudits.length > 0 && (
                <Card className="bg-[#090d16]/80 border-white/10">
                    <CardHeader className="p-4 pb-2">
                        <CardTitle className="text-sm text-white flex items-center gap-2">
                            <Clock className="h-4 w-4 text-cyan-400" />
                            Korábban Elemzett Weboldalak
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-1">
                        <div className="divide-y divide-white/5">
                            {recentAudits.map((a) => (
                                <div key={a.id} className="py-2.5 flex items-center justify-between text-xs">
                                    <div className="flex items-center gap-3">
                                        <Badge className={`font-mono text-[10px] ${
                                            a.score >= 80 ? 'bg-emerald-500/20 text-emerald-300' :
                                            a.score >= 60 ? 'bg-cyan-500/20 text-cyan-300' :
                                            'bg-amber-500/20 text-amber-300'
                                        }`}>
                                            {a.score}/100
                                        </Badge>
                                        <div>
                                            <span className="font-semibold text-white">{a.businessName || a.domain}</span>
                                            <span className="text-slate-500 text-[11px] ml-2 font-mono">({a.domain})</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-slate-500 text-[11px] hidden sm:inline">
                                            {new Date(a.createdAt).toLocaleDateString("hu-HU")}
                                        </span>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => {
                                                setDomain(a.domain)
                                                setBusinessName(a.businessName || "")
                                                handleRunAudit(a.domain, a.businessName || "")
                                            }}
                                            className="h-7 px-2 text-cyan-400 hover:text-white hover:bg-cyan-500/10 text-xs"
                                        >
                                            Újraelemzés
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
