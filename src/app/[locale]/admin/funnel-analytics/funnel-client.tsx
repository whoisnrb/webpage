"use client"

import { useEffect, useState, useTransition } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import {
    getFunnelAnalytics,
    DomainFilter,
    TimeRangeFilter,
    FunnelAnalyticsData,
    MicroFunnelStep,
} from "@/app/actions/funnel-analytics"
import {
    Filter,
    TrendingDown,
    TrendingUp,
    Users,
    MousePointerClick,
    CheckCircle2,
    AlertTriangle,
    AlertCircle,
    RefreshCw,
    Monitor,
    Smartphone,
    Tablet,
    ArrowDown,
    Sparkles,
    FileText,
    Calendar,
    MessageSquare,
    Globe,
    Layers,
} from "lucide-react"

function MicroFunnelCard({
    title,
    subtitle,
    steps,
    hasEvents,
}: {
    title: string
    subtitle: string
    steps: MicroFunnelStep[]
    hasEvents: boolean
}) {
    const maxCount = Math.max(...steps.map((s) => s.count), 1)

    return (
        <Card className="bg-[#090d16] border-white/10 shadow-xl">
            <CardHeader className="pb-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                        <CardTitle className="text-base text-white">{title}</CardTitle>
                        <CardDescription className="text-xs text-slate-400 mt-0.5">{subtitle}</CardDescription>
                    </div>
                    {!hasEvents && (
                        <Badge className="bg-amber-500/15 text-amber-300 border-amber-500/30 text-[10px] w-fit">
                            Lépésmérés aktív • új munkamenetekre vár
                        </Badge>
                    )}
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {steps.map((s, idx) => {
                    const widthPct = maxCount > 0 && s.count > 0 ? Math.max(6, Math.round((s.count / maxCount) * 100)) : 0
                    return (
                        <div key={s.step} className="space-y-1.5">
                            <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                                <span className="font-medium text-slate-200">{s.label}</span>
                                <div className="flex items-center gap-2 font-mono">
                                    <span className="text-white font-bold">{s.count} munkamenet</span>
                                    {idx > 0 && (
                                        <>
                                            <Badge className="bg-cyan-500/15 text-cyan-300 border-cyan-500/30 text-[10px]">
                                                {s.conversionFromPrev}% továbbjutás
                                            </Badge>
                                            {s.dropOffPercent > 0 && (
                                                <Badge className="bg-rose-500/15 text-rose-300 border-rose-500/30 text-[10px]">
                                                    -{s.dropOffPercent}% ({s.dropOffCount} fő)
                                                </Badge>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>
                            <div className="h-3 w-full rounded-full bg-white/[0.04] border border-white/5 overflow-hidden">
                                <div
                                    className={`h-full rounded-full transition-all duration-700 ${
                                        idx === steps.length - 1
                                            ? "bg-gradient-to-r from-emerald-500 to-teal-400"
                                            : "bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500"
                                    }`}
                                    style={{ width: `${widthPct}%` }}
                                />
                            </div>
                        </div>
                    )
                })}
            </CardContent>
        </Card>
    )
}

export function FunnelClient() {
    const [domain, setDomain] = useState<DomainFilter>("all")
    const [range, setRange] = useState<TimeRangeFilter>("30d")
    const [data, setData] = useState<FunnelAnalyticsData | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isPending, startTransition] = useTransition()

    const loadData = async (d: DomainFilter, r: TimeRangeFilter, showToast = false) => {
        setIsLoading(true)
        try {
            const res = await getFunnelAnalytics(d, r)
            setData(res)
            if (showToast) toast.success("Konverziós tölcsér adatai frissítve!")
        } catch (err: any) {
            toast.error(err.message || "Hiba a tölcsér adatok lekérésekor.")
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        loadData(domain, range)
    }, [domain, range])

    const handleRefresh = () => {
        startTransition(() => {
            loadData(domain, range, true)
        })
    }

    const maxMacro = data ? Math.max(...data.macroFunnel.map((m) => m.count), 1) : 1

    return (
        <div className="space-y-8">
            {/* Header Banner */}
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-indigo-950/30 to-rose-950/30 border border-cyan-500/20 backdrop-blur-xl shadow-2xl">
                <div className="space-y-1.5">
                    <div className="flex items-center gap-2.5 flex-wrap">
                        <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                            <Filter className="h-5 w-5" />
                        </div>
                        <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
                            Konverziós Tölcsér & Űrlap-lemorzsolódás
                        </h1>
                        <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-500/40 font-mono text-[10px]">
                            FUNNEL CRO
                        </Badge>
                    </div>
                    <p className="text-xs md:text-sm text-slate-300 max-w-2xl">
                        Hol veszítjük el a látogatókat? Kövesd a teljes látogatói utat a landolástól a sikeres ajánlatkérésig, külön a .hu és .com oldalakra bontva.
                    </p>
                </div>

                {/* Controls: Domain + Time Range + Refresh */}
                <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                    <div className="flex items-center p-1 rounded-xl bg-black/40 border border-white/10">
                        {(
                            [
                                { id: "all", label: "Mindkettő", icon: "⚡" },
                                { id: "backlineit.hu", label: "backlineit.hu", icon: "🇭🇺" },
                                { id: "backlineit.com", label: "backlineit.com", icon: "🌐" },
                            ] as const
                        ).map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setDomain(item.id)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                                    domain === item.id
                                        ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-[0_0_12px_rgba(6,182,212,0.35)]"
                                        : "text-slate-400 hover:text-white"
                                }`}
                            >
                                <span>{item.icon}</span>
                                <span>{item.label}</span>
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center p-1 rounded-xl bg-black/40 border border-white/10">
                        {(["7d", "30d", "90d"] as const).map((r) => (
                            <button
                                key={r}
                                onClick={() => setRange(r)}
                                className={`px-2.5 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all ${
                                    range === r
                                        ? "bg-white/15 text-cyan-300"
                                        : "text-slate-400 hover:text-white"
                                }`}
                            >
                                {r === "7d" ? "7 nap" : r === "30d" ? "30 nap" : "90 nap"}
                            </button>
                        ))}
                    </div>

                    <Button
                        onClick={handleRefresh}
                        disabled={isLoading || isPending}
                        variant="outline"
                        size="sm"
                        className="h-9 px-3 bg-white/[0.04] hover:bg-white/[0.08] border-white/10 text-slate-200 rounded-xl text-xs gap-1.5"
                    >
                        <RefreshCw className={`h-3.5 w-3.5 text-cyan-400 ${isLoading || isPending ? "animate-spin" : ""}`} />
                        <span className="hidden sm:inline">Frissítés</span>
                    </Button>
                </div>
            </div>

            {/* 4 Top KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="bg-[#090d16] border-white/10 p-4">
                    <div className="flex items-center justify-between text-slate-400 text-xs">
                        <span className="font-semibold uppercase tracking-wider">Munkamenetek</span>
                        <Users className="h-4 w-4 text-cyan-400" />
                    </div>
                    <div className="text-2xl font-bold text-white mt-2">
                        {data?.kpis.totalSessions.toLocaleString("hu-HU") ?? 0}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">
                        Űrlapoldal elérése: <span className="text-cyan-300 font-mono">{data?.kpis.formPageVisits ?? 0}</span>
                    </p>
                </Card>

                <Card className="bg-[#090d16] border-white/10 p-4">
                    <div className="flex items-center justify-between text-slate-400 text-xs">
                        <span className="font-semibold uppercase tracking-wider">Űrlap Elkezdések</span>
                        <MousePointerClick className="h-4 w-4 text-purple-400" />
                    </div>
                    <div className="text-2xl font-bold text-purple-400 mt-2">
                        {data?.kpis.formStarts.toLocaleString("hu-HU") ?? 0}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">
                        Félbehagyási arány: <span className="text-rose-400 font-mono">{data?.kpis.abandonmentRate ?? 0}%</span>
                    </p>
                </Card>

                <Card className="bg-[#090d16] border-white/10 p-4">
                    <div className="flex items-center justify-between text-slate-400 text-xs">
                        <span className="font-semibold uppercase tracking-wider">Konverziós Ráta</span>
                        <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    </div>
                    <div className="text-2xl font-bold text-emerald-400 mt-2 flex items-baseline gap-2">
                        {data?.kpis.overallConversionRate ?? 0}%
                        <span className="text-xs text-slate-400 font-normal">({data?.kpis.totalSubmissions ?? 0} db)</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">Látogatóból sikeres beküldés</p>
                </Card>

                <Card className="bg-[#090d16] border-white/10 p-4">
                    <div className="flex items-center justify-between text-slate-400 text-xs">
                        <span className="font-semibold uppercase tracking-wider">Legnagyobb Szűkület</span>
                        <TrendingDown className="h-4 w-4 text-rose-400" />
                    </div>
                    <div className="text-2xl font-bold text-rose-400 mt-2">
                        -{data?.kpis.biggestDropOffPercent ?? 0}%
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1 truncate" title={data?.kpis.biggestDropOffLabel}>
                        {data?.kpis.biggestDropOffLabel || "Nincs adat"}
                    </p>
                </Card>
            </div>

            {/* Macro Funnel + Domain Comparison */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Macro 5-Stage Funnel */}
                <Card className="lg:col-span-8 bg-[#090d16] border-white/10 shadow-xl">
                    <CardHeader>
                        <CardTitle className="text-base text-white flex items-center gap-2">
                            <Layers className="h-4 w-4 text-cyan-400" />
                            Teljes Látogatói Konverziós Tölcsér (5 Lépcső)
                        </CardTitle>
                        <CardDescription className="text-xs text-slate-400">
                            Lépésről lépésre mutatja a látogatók előrehaladását és a lemorzsolódási pontokat.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {isLoading ? (
                            <div className="py-12 text-center text-slate-400 text-xs">
                                <RefreshCw className="h-5 w-5 animate-spin mx-auto mb-2 text-cyan-400" />
                                Tölcsér adatok számítása...
                            </div>
                        ) : (
                            data?.macroFunnel.map((stage, idx) => {
                                const widthPct = maxMacro > 0 && stage.count > 0 ? Math.max(8, Math.round((stage.count / maxMacro) * 100)) : 0
                                return (
                                    <div key={stage.id} className="space-y-2">
                                        {idx > 0 && (
                                            <div className="flex items-center gap-2 pl-4 text-[11px]">
                                                <ArrowDown className="h-3.5 w-3.5 text-slate-500" />
                                                <span className="text-cyan-300 font-mono font-semibold">
                                                    {stage.conversionFromPrev}% továbbjutott
                                                </span>
                                                {stage.dropOffFromPrev > 0 && (
                                                    <span className="text-rose-400 font-mono bg-rose-500/10 px-1.5 py-0.5 rounded border border-rose-500/20">
                                                        -{stage.dropOffFromPrev}% lemorzsolódás
                                                    </span>
                                                )}
                                            </div>
                                        )}

                                        <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/15 transition-colors space-y-2">
                                            <div className="flex flex-wrap items-center justify-between gap-2">
                                                <div>
                                                    <div className="text-sm font-bold text-white">{stage.label}</div>
                                                    <div className="text-[11px] text-slate-400">{stage.description}</div>
                                                </div>
                                                <div className="text-right font-mono">
                                                    <div className="text-lg font-bold text-white">{stage.count.toLocaleString("hu-HU")}</div>
                                                    <div className="text-[10px] text-slate-400">{stage.conversionFromTop}% a tetejéhez képest</div>
                                                </div>
                                            </div>
                                            <div className="h-3.5 w-full rounded-full bg-black/50 border border-white/5 overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full transition-all duration-700 ${
                                                        idx === 4
                                                            ? "bg-gradient-to-r from-emerald-500 to-teal-400 shadow-[0_0_12px_rgba(16,185,129,0.5)]"
                                                            : idx === 0
                                                            ? "bg-gradient-to-r from-cyan-500 to-blue-500"
                                                            : "bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"
                                                    }`}
                                                    style={{ width: `${widthPct}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        )}
                    </CardContent>
                </Card>

                {/* Right Column: .hu vs .com + Device Breakdown */}
                <div className="lg:col-span-4 space-y-6">
                    {/* Domain Comparison */}
                    <Card className="bg-[#090d16] border-white/10 shadow-xl">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-bold text-white flex items-center gap-2">
                                <Globe className="h-4 w-4 text-cyan-400" />
                                .hu vs .com Teljesítmény
                            </CardTitle>
                            <CardDescription className="text-xs text-slate-400">
                                Két domain konverziós összehasonlítása
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {data?.domainComparison.map((dc) => (
                                <div key={dc.domain} className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span>{dc.flag}</span>
                                            <div>
                                                <div className="text-xs font-bold text-white font-mono">{dc.domain}</div>
                                                <div className="text-[10px] text-slate-400">{dc.label}</div>
                                            </div>
                                        </div>
                                        <Badge className="bg-emerald-500/15 text-emerald-300 border-emerald-500/30 font-mono text-xs">
                                            {dc.conversionRate}% CR
                                        </Badge>
                                    </div>
                                    <div className="grid grid-cols-3 gap-2 pt-1 border-t border-white/5 text-center font-mono text-[11px]">
                                        <div>
                                            <div className="text-slate-500 text-[10px]">Munkamenet</div>
                                            <div className="text-white font-bold">{dc.sessions}</div>
                                        </div>
                                        <div>
                                            <div className="text-slate-500 text-[10px]">Űrlap start</div>
                                            <div className="text-purple-300 font-bold">{dc.formStarts}</div>
                                        </div>
                                        <div>
                                            <div className="text-slate-500 text-[10px]">Beküldés</div>
                                            <div className="text-emerald-300 font-bold">{dc.submissions}</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Device Breakdown */}
                    <Card className="bg-[#090d16] border-white/10 shadow-xl">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-bold text-white flex items-center gap-2">
                                <Smartphone className="h-4 w-4 text-purple-400" />
                                Eszköz Szerinti Bontás
                            </CardTitle>
                            <CardDescription className="text-xs text-slate-400">
                                Asztali vs. mobil lemorzsolódási arányok
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2.5">
                            {(!data?.deviceBreakdown || data.deviceBreakdown.length === 0) ? (
                                <p className="text-xs text-slate-500 py-4 text-center">Még nincs eszköz szerinti munkamenet adat.</p>
                            ) : (
                                data.deviceBreakdown.map((dev) => {
                                    const lower = dev.device.toLowerCase()
                                    const Icon = lower.includes("mobile") ? Smartphone : lower.includes("tablet") ? Tablet : Monitor
                                    return (
                                        <div key={dev.device} className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between text-xs">
                                            <div className="flex items-center gap-2.5">
                                                <Icon className="h-4 w-4 text-cyan-400" />
                                                <div>
                                                    <div className="font-semibold text-white">{dev.device}</div>
                                                    <div className="text-[10px] text-slate-400 font-mono">
                                                        {dev.sessions} munkamenet • {dev.submissions} konverzió
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right font-mono">
                                                <div className="text-emerald-400 font-bold">{dev.conversionRate}% CR</div>
                                                {dev.abandonRate > 0 && (
                                                    <div className="text-[10px] text-rose-400">{dev.abandonRate}% elhagyás</div>
                                                )}
                                            </div>
                                        </div>
                                    )
                                })
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Tabs: Form Micro-Funnels & Drop-Off Diagnostics */}
            <Tabs defaultValue="quote" className="w-full">
                <TabsList className="bg-white/[0.04] border border-white/10 p-1 rounded-xl flex-wrap h-auto">
                    <TabsTrigger value="quote" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-300 rounded-lg text-xs gap-1.5">
                        <FileText className="h-3.5 w-3.5" />
                        Ajánlatkérő Wizard (3 lépés)
                    </TabsTrigger>
                    <TabsTrigger value="booking" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-300 rounded-lg text-xs gap-1.5">
                        <Calendar className="h-3.5 w-3.5" />
                        Kapcsolat / Időpontfoglaló (4 lépés)
                    </TabsTrigger>
                    <TabsTrigger value="consultation" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-300 rounded-lg text-xs gap-1.5">
                        <MessageSquare className="h-3.5 w-3.5" />
                        Konzultációs Űrlap
                    </TabsTrigger>
                    <TabsTrigger value="diagnostics" className="data-[state=active]:bg-rose-500/20 data-[state=active]:text-rose-300 rounded-lg text-xs gap-1.5">
                        <TrendingDown className="h-3.5 w-3.5" />
                        Mező-lemorzsolódás & CRO Javaslatok
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="quote" className="mt-4">
                    <MicroFunnelCard
                        title="Ajánlatkérő Varázsló (/ajanlatkeres és /request-a-quote)"
                        subtitle="Lépésről lépésre méri, hogy a Projekt típus → Költségkeret → Elérhetőség lépések közül hol fordulnak vissza az érdeklődők."
                        steps={data?.quoteWizardFunnel || []}
                        hasEvents={Boolean(data?.hasMicroFunnelEvents)}
                    />
                </TabsContent>

                <TabsContent value="booking" className="mt-4">
                    <MicroFunnelCard
                        title="Időpontfoglaló & Kapcsolat Wizard (/kapcsolat és /contact)"
                        subtitle="Adatok → Téma → Naptár/Idősáv → Üzenet → Sikeres foglalás lépések lemorzsolódása."
                        steps={data?.bookingWizardFunnel || []}
                        hasEvents={Boolean(data?.hasMicroFunnelEvents)}
                    />
                </TabsContent>

                <TabsContent value="consultation" className="mt-4">
                    <MicroFunnelCard
                        title="Megoldás-specifikus Konzultáció (/konzultacio)"
                        subtitle="A kosárból vagy megoldás oldalról érkező konzultációk konverziós útja."
                        steps={data?.consultationFunnel || []}
                        hasEvents={Boolean(data?.hasMicroFunnelEvents)}
                    />
                </TabsContent>

                <TabsContent value="diagnostics" className="mt-4 space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        {/* Abandoned Fields */}
                        <Card className="lg:col-span-6 bg-[#090d16] border-white/10">
                            <CardHeader>
                                <CardTitle className="text-sm font-bold text-white flex items-center gap-2">
                                    <AlertTriangle className="h-4 w-4 text-rose-400" />
                                    Utoljára Érintett Mezők Elhagyás Előtt
                                </CardTitle>
                                <CardDescription className="text-xs text-slate-400">
                                    Melyik beviteli mezőnél hagyták abba legtöbben a kitöltést.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {(!data?.abandonedFields || data.abandonedFields.length === 0) ? (
                                    <div className="py-8 text-center text-xs text-slate-500">
                                        Még nincs rögzített űrlap-félbehagyás az elmúlt időszakban.
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {data.abandonedFields.map((item) => (
                                            <div key={`${item.funnel}-${item.field}`} className="space-y-1">
                                                <div className="flex items-center justify-between text-xs">
                                                    <div>
                                                        <span className="font-medium text-white">{item.fieldLabel}</span>
                                                        <Badge variant="outline" className="ml-2 text-[10px] border-white/10 text-slate-400">
                                                            {item.funnel}
                                                        </Badge>
                                                    </div>
                                                    <span className="font-mono text-rose-300 font-bold">
                                                        {item.count}× ({item.sharePercent}%)
                                                    </span>
                                                </div>
                                                <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                                                    <div
                                                        className="h-full rounded-full bg-gradient-to-r from-rose-500 to-amber-500"
                                                        style={{ width: `${Math.max(5, item.sharePercent)}%` }}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Exit / Top Pages */}
                        <Card className="lg:col-span-6 bg-[#090d16] border-white/10">
                            <CardHeader>
                                <CardTitle className="text-sm font-bold text-white flex items-center gap-2">
                                    <TrendingUp className="h-4 w-4 text-cyan-400" />
                                    Leglátogatottabb Oldalak Konverziós Aránya
                                </CardTitle>
                                <CardDescription className="text-xs text-slate-400">
                                    Mely aloldalakon mekkora a lemorzsolódási arány.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {(!data?.exitPages || data.exitPages.length === 0) ? (
                                    <div className="py-8 text-center text-xs text-slate-500">
                                        Még nincs oldal-szintű látogatási adat.
                                    </div>
                                ) : (
                                    <div className="divide-y divide-white/5 text-xs">
                                        {data.exitPages.map((p) => (
                                            <div key={p.page} className="py-2.5 flex items-center justify-between gap-2">
                                                <span className="font-mono text-cyan-300 truncate">{p.page}</span>
                                                <div className="flex items-center gap-3 shrink-0 font-mono">
                                                    <span className="text-slate-300">{p.views} megtekintés</span>
                                                    <Badge className="bg-white/5 text-slate-300 border-white/10 text-[10px]">
                                                        {p.dropOffPercent}% kilépés
                                                    </Badge>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Automated CRO Recommendations */}
                    <Card className="bg-[#090d16] border-white/10">
                        <CardHeader>
                            <CardTitle className="text-sm font-bold text-white flex items-center gap-2">
                                <Sparkles className="h-4 w-4 text-purple-400" />
                                Automata CRO Diagnosztika & Javaslatok
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {data?.insights.map((ins, i) => (
                                <div
                                    key={i}
                                    className={`p-4 rounded-xl border space-y-1.5 ${
                                        ins.severity === "critical"
                                            ? "bg-rose-950/20 border-rose-500/30"
                                            : ins.severity === "warning"
                                            ? "bg-amber-950/20 border-amber-500/30"
                                            : "bg-emerald-950/20 border-emerald-500/30"
                                    }`}
                                >
                                    <div className="flex items-center gap-2 text-xs font-bold text-white">
                                        {ins.severity === "critical" ? (
                                            <AlertCircle className="h-4 w-4 text-rose-400" />
                                        ) : ins.severity === "warning" ? (
                                            <AlertTriangle className="h-4 w-4 text-amber-400" />
                                        ) : (
                                            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                                        )}
                                        <span>{ins.title}</span>
                                    </div>
                                    <p className="text-xs text-slate-300 leading-relaxed">{ins.description}</p>
                                    <p className="text-[11px] text-cyan-300 pt-1">
                                        <strong>Javaslat:</strong> {ins.action}
                                    </p>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
