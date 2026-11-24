"use client"

import { useState, useTransition, useEffect, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from "sonner"
import {
    getSeoKeywords,
    addSeoKeyword,
    deleteSeoKeyword,
    refreshSeoRanks,
    SeoKeywordItem,
    SeoSummaryMetrics,
} from "@/app/actions/seo-tracker"
import {
    Search,
    TrendingUp,
    TrendingDown,
    Minus,
    Plus,
    RefreshCw,
    Globe,
    Award,
    Eye,
    MousePointerClick,
    ExternalLink,
    Trash2,
    Filter,
    Layers,
    CheckCircle2,
    ArrowUpRight,
    Star,
    Sparkles,
} from "lucide-react"

export function SeoTrackerClient() {
    const [domain, setDomain] = useState<"backlineit.hu" | "backlineit.com">("backlineit.hu")
    const [keywords, setKeywords] = useState<SeoKeywordItem[]>([])
    const [metrics, setMetrics] = useState<SeoSummaryMetrics | null>(null)
    const [categories, setCategories] = useState<string[]>([])
    const [selectedCategory, setSelectedCategory] = useState<string>("ALL")
    const [searchQuery, setSearchQuery] = useState("")
    const [isLoading, setIsLoading] = useState(true)
    const [isPending, startTransition] = useTransition()

    // Add modal state
    const [isOpenAdd, setIsOpenAdd] = useState(false)
    const [newKeyword, setNewKeyword] = useState("")
    const [newCategory, setNewCategory] = useState("Szoftverfejlesztés")
    const [newTargetUrl, setNewTargetUrl] = useState("")
    const [newVolume, setNewVolume] = useState("500")
    const [newRank, setNewRank] = useState("5")

    const loadData = async (targetDomain: "backlineit.hu" | "backlineit.com") => {
        setIsLoading(true)
        try {
            const data = await getSeoKeywords(targetDomain)
            setKeywords(data.keywords)
            setMetrics(data.metrics)
            setCategories(data.categories)
        } catch (e: any) {
            toast.error(e.message || "Nem sikerült betölteni a kulcsszavakat.")
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        loadData(domain)
    }, [domain])

    const handleRefreshRanks = () => {
        startTransition(async () => {
            const res = await refreshSeoRanks(domain)
            if (res.success) {
                toast.success(`Google rangsorok frissítve a ${domain} domainhez!`)
                await loadData(domain)
            } else {
                toast.error(res.error || "Hiba történt a frissítés közben.")
            }
        })
    }

    const handleAddKeyword = async () => {
        if (!newKeyword.trim()) {
            toast.error("Add meg a kulcsszó kifejezést!")
            return
        }

        const res = await addSeoKeyword({
            domain,
            keyword: newKeyword,
            category: newCategory,
            targetUrl: newTargetUrl || (domain.includes("com") ? "/en/services/web-development" : "/szolgaltatasok/webfejlesztes"),
            searchVolume: Number(newVolume) || 500,
            currentRank: Number(newRank) || 5,
        })

        if (res.success) {
            toast.success("Új kulcsszó sikeresen hozzáadva a követési listához!")
            setIsOpenAdd(false)
            setNewKeyword("")
            await loadData(domain)
        } else {
            toast.error(res.error || "Hiba történt a mentéskor.")
        }
    }

    const handleDelete = async (id: string, kw: string) => {
        if (!confirm(`Biztosan törölni szeretnéd a(z) "${kw}" kulcsszót a követésből?`)) return

        const res = await deleteSeoKeyword(id)
        if (res.success) {
            toast.success("Kulcsszó törölve.")
            setKeywords(prev => prev.filter(k => k.id !== id))
        } else {
            toast.error(res.error || "Nem sikerült a törlés.")
        }
    }

    // Filtered keywords
    const filteredKeywords = useMemo(() => {
        return keywords.filter(k => {
            const matchesCat = selectedCategory === "ALL" || k.category === selectedCategory
            const matchesSearch = !searchQuery.trim() || k.keyword.toLowerCase().includes(searchQuery.toLowerCase()) || k.targetUrl?.toLowerCase().includes(searchQuery.toLowerCase())
            return matchesCat && matchesSearch
        })
    }, [keywords, selectedCategory, searchQuery])

    // Top pages by count
    const topPages = useMemo(() => {
        const counts: Record<string, number> = {}
        keywords.forEach(k => {
            if (k.targetUrl) {
                counts[k.targetUrl] = (counts[k.targetUrl] || 0) + 1
            }
        })
        return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 4)
    }, [keywords])

    return (
        <div className="space-y-8">
            {/* Header with Domain Switcher */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-blue-950/30 to-purple-950/30 border border-cyan-500/20 backdrop-blur-xl shadow-2xl">
                <div className="space-y-1.5">
                    <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                            <Search className="h-5 w-5" />
                        </div>
                        <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                            SEO Pozíció- & Kulcsszó Tracker
                        </h1>
                        <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-500/40 font-mono text-[10px]">
                            GOOGLE SERP
                        </Badge>
                    </div>
                    <p className="text-xs md:text-sm text-slate-300 max-w-2xl">
                        Kövesd élőben a BacklineIT kulcsszavas rangsorolását a Google keresőben: organikus pozíciók, keresési volumenek, kattintások és céloldalak teljesítménye mindkét domainen.
                    </p>
                </div>

                {/* Domain Switcher Buttons */}
                <div className="flex items-center p-1.5 rounded-xl bg-black/40 border border-white/10 shrink-0">
                    <button
                        onClick={() => setDomain("backlineit.hu")}
                        className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                            domain === "backlineit.hu"
                                ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                                : "text-slate-400 hover:text-white"
                        }`}
                    >
                        <span>🇭🇺</span>
                        <span>backlineit.hu</span>
                        <span className="text-[10px] opacity-75 font-normal">(Google.hu)</span>
                    </button>
                    <button
                        onClick={() => setDomain("backlineit.com")}
                        className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                            domain === "backlineit.com"
                                ? "bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]"
                                : "text-slate-400 hover:text-white"
                        }`}
                    >
                        <span>🌐</span>
                        <span>backlineit.com</span>
                        <span className="text-[10px] opacity-75 font-normal">(Global)</span>
                    </button>
                </div>
            </div>

            {/* KPI Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="bg-[#090d16] border-white/10 p-4">
                    <div className="flex items-center justify-between text-slate-400 text-xs">
                        <span className="font-semibold uppercase tracking-wider">Top 3 Pozíciók</span>
                        <Award className="h-4 w-4 text-emerald-400" />
                    </div>
                    <div className="text-2xl font-bold text-emerald-400 mt-2 flex items-baseline gap-1.5">
                        {metrics?.top3Count ?? 0}
                        <span className="text-xs text-slate-400 font-normal">/ {metrics?.totalKeywords ?? 0} kulcsszó</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">A keresések legfelső élmezőnye</p>
                </Card>

                <Card className="bg-[#090d16] border-white/10 p-4">
                    <div className="flex items-center justify-between text-slate-400 text-xs">
                        <span className="font-semibold uppercase tracking-wider">Top 10 (1. Oldal)</span>
                        <Star className="h-4 w-4 text-cyan-400" />
                    </div>
                    <div className="text-2xl font-bold text-cyan-400 mt-2 flex items-baseline gap-1.5">
                        {metrics?.top10Count ?? 0}
                        <span className="text-xs text-slate-400 font-normal">kulcsszó az első oldalon</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">A forgalom 92%-át ezek adják</p>
                </Card>

                <Card className="bg-[#090d16] border-white/10 p-4">
                    <div className="flex items-center justify-between text-slate-400 text-xs">
                        <span className="font-semibold uppercase tracking-wider">Átlagos Pozíció</span>
                        <TrendingUp className="h-4 w-4 text-purple-400" />
                    </div>
                    <div className="text-2xl font-bold text-purple-400 mt-2 flex items-baseline gap-1">
                        #{metrics?.averageRank ?? 0}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">Összesített átlagos Google rang</p>
                </Card>

                <Card className="bg-[#090d16] border-white/10 p-4">
                    <div className="flex items-center justify-between text-slate-400 text-xs">
                        <span className="font-semibold uppercase tracking-wider">Becsült Megjelenés</span>
                        <Eye className="h-4 w-4 text-blue-400" />
                    </div>
                    <div className="text-2xl font-bold text-blue-400 mt-2 flex items-baseline gap-1.5">
                        {metrics ? metrics.estimatedMonthlyImpressions.toLocaleString("hu-HU") : 0}
                        <span className="text-xs text-slate-400 font-normal">/ hó</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">Kb. ~{metrics?.estimatedClicks ?? 0} organikus kattintás</p>
                </Card>
            </div>

            {/* Filter and Action Toolbar */}
            <div className="p-4 rounded-xl bg-[#090d16] border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="flex items-center gap-2 flex-wrap">
                    <button
                        onClick={() => setSelectedCategory("ALL")}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                            selectedCategory === "ALL"
                                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                                : "text-slate-400 hover:text-white bg-white/[0.02]"
                        }`}
                    >
                        Összes ({keywords.length})
                    </button>
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                                selectedCategory === cat
                                    ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                                    : "text-slate-400 hover:text-white bg-white/[0.02]"
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-2.5">
                    <div className="relative">
                        <Search className="h-3.5 w-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                        <Input
                            placeholder="Szűrés kulcsszóra..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="h-9 pl-9 w-48 lg:w-64 bg-white/[0.03] border-white/10 text-xs text-white rounded-lg"
                        />
                    </div>

                    <Button
                        onClick={handleRefreshRanks}
                        disabled={isPending || isLoading}
                        variant="outline"
                        size="sm"
                        className="h-9 px-3 bg-white/[0.04] hover:bg-white/[0.08] border-white/10 text-slate-300 hover:text-white rounded-lg text-xs flex items-center gap-1.5"
                    >
                        <RefreshCw className={`h-3.5 w-3.5 text-cyan-400 ${isPending ? 'animate-spin' : ''}`} />
                        <span className="hidden sm:inline">Frissítés</span>
                    </Button>

                    {/* Add Keyword Dialog */}
                    <Dialog open={isOpenAdd} onOpenChange={setIsOpenAdd}>
                        <DialogTrigger asChild>
                            <Button
                                size="sm"
                                className="h-9 px-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs flex items-center gap-1.5 shadow-sm"
                            >
                                <Plus className="h-3.5 w-3.5" />
                                <span>Új Kulcsszó</span>
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-[#090d16] border-white/10 text-white sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle className="text-base font-bold flex items-center gap-2">
                                    <Plus className="h-4 w-4 text-cyan-400" />
                                    Új Kulcsszó Felvétele ({domain})
                                </DialogTitle>
                                <DialogDescription className="text-slate-400 text-xs">
                                    Vedd fel azokat a kulcsszavakat, amelyekre a BacklineIT-t előre szeretnéd hozni a keresőben.
                                </DialogDescription>
                            </DialogHeader>

                            <div className="space-y-3.5 py-2">
                                <div>
                                    <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1 block">
                                        Kulcsszó kifejezés *
                                    </label>
                                    <Input
                                        placeholder="pl. egyedi szoftverfejlesztés árak"
                                        value={newKeyword}
                                        onChange={(e) => setNewKeyword(e.target.value)}
                                        className="h-10 bg-white/[0.03] border-white/10 text-white text-xs rounded-xl"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1 block">
                                            Kategória
                                        </label>
                                        <Input
                                            placeholder="pl. Szoftverfejlesztés"
                                            value={newCategory}
                                            onChange={(e) => setNewCategory(e.target.value)}
                                            className="h-10 bg-white/[0.03] border-white/10 text-white text-xs rounded-xl"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1 block">
                                            Kezdő Rang (#)
                                        </label>
                                        <Input
                                            type="number"
                                            placeholder="pl. 6"
                                            value={newRank}
                                            onChange={(e) => setNewRank(e.target.value)}
                                            className="h-10 bg-white/[0.03] border-white/10 text-white text-xs rounded-xl"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1 block">
                                            Céloldal URL
                                        </label>
                                        <Input
                                            placeholder="/szolgaltatasok/..."
                                            value={newTargetUrl}
                                            onChange={(e) => setNewTargetUrl(e.target.value)}
                                            className="h-10 bg-white/[0.03] border-white/10 text-white text-xs rounded-xl"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1 block">
                                            Havi Keresési Volumen
                                        </label>
                                        <Input
                                            type="number"
                                            placeholder="pl. 850"
                                            value={newVolume}
                                            onChange={(e) => setNewVolume(e.target.value)}
                                            className="h-10 bg-white/[0.03] border-white/10 text-white text-xs rounded-xl"
                                        />
                                    </div>
                                </div>
                            </div>

                            <DialogFooter>
                                <Button
                                    variant="outline"
                                    onClick={() => setIsOpenAdd(false)}
                                    className="border-white/10 text-slate-300 text-xs"
                                >
                                    Mégse
                                </Button>
                                <Button
                                    onClick={handleAddKeyword}
                                    className="bg-cyan-600 hover:bg-cyan-500 text-white text-xs"
                                >
                                    Kulcsszó Mentése
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Keywords Table */}
            <Card className="bg-[#090d16] border-white/10 shadow-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                        <thead className="bg-[#0c1220] border-b border-white/10 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                            <tr>
                                <th className="py-3 px-4 w-20">Pozíció</th>
                                <th className="py-3 px-4 w-20">Trend</th>
                                <th className="py-3 px-4">Kulcsszó</th>
                                <th className="py-3 px-4">Kategória</th>
                                <th className="py-3 px-4">Havi Volumen</th>
                                <th className="py-3 px-4">Nehézség (KD)</th>
                                <th className="py-3 px-4">Céloldal (Landing Page)</th>
                                <th className="py-3 px-4 w-12 text-right">Művelet</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={8} className="py-12 text-center text-slate-400">
                                        <RefreshCw className="h-5 w-5 animate-spin mx-auto mb-2 text-cyan-400" />
                                        Kulcsszavak és rangsorok betöltése...
                                    </td>
                                </tr>
                            ) : filteredKeywords.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="py-12 text-center text-slate-500">
                                        Nem található kulcsszó a megadott szűrési feltételekkel.
                                    </td>
                                </tr>
                            ) : (
                                filteredKeywords.map((k) => (
                                    <tr key={k.id} className="hover:bg-white/[0.02] transition-colors group">
                                        {/* Rank */}
                                        <td className="py-3 px-4">
                                            <div className={`w-9 h-8 rounded-lg flex items-center justify-center font-bold text-xs font-mono shadow-sm ${
                                                k.currentRank <= 3
                                                    ? 'bg-gradient-to-br from-amber-400 to-yellow-600 text-black shadow-amber-500/20'
                                                    : k.currentRank <= 10
                                                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                                                    : 'bg-white/[0.05] text-slate-400 border border-white/5'
                                            }`}>
                                                #{k.currentRank}
                                            </div>
                                        </td>

                                        {/* Change */}
                                        <td className="py-3 px-4">
                                            {k.change > 0 ? (
                                                <span className="inline-flex items-center gap-0.5 text-emerald-400 font-bold font-mono text-[11px] bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                                                    <TrendingUp className="h-3 w-3" />
                                                    +{k.change}
                                                </span>
                                            ) : k.change < 0 ? (
                                                <span className="inline-flex items-center gap-0.5 text-red-400 font-bold font-mono text-[11px] bg-red-500/10 px-1.5 py-0.5 rounded border border-red-500/20">
                                                    <TrendingDown className="h-3 w-3" />
                                                    {k.change}
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-0.5 text-slate-500 font-mono text-[11px]">
                                                    <Minus className="h-3 w-3" />
                                                    0
                                                </span>
                                            )}
                                        </td>

                                        {/* Keyword Name */}
                                        <td className="py-3 px-4 font-medium text-white">
                                            <div className="flex items-center gap-2">
                                                <span>{k.keyword}</span>
                                                {k.currentRank <= 3 && (
                                                    <span className="text-[9px] px-1 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold">
                                                        TOP 3
                                                    </span>
                                                )}
                                            </div>
                                        </td>

                                        {/* Category */}
                                        <td className="py-3 px-4">
                                            <Badge variant="outline" className="text-slate-400 border-white/10 text-[10px] font-normal">
                                                {k.category}
                                            </Badge>
                                        </td>

                                        {/* Search Volume */}
                                        <td className="py-3 px-4 font-mono text-slate-300">
                                            {k.searchVolume.toLocaleString("hu-HU")} / hó
                                        </td>

                                        {/* Difficulty */}
                                        <td className="py-3 px-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-16 h-1.5 rounded-full bg-white/10 overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full ${
                                                            k.difficulty > 55 ? 'bg-red-400' :
                                                            k.difficulty > 35 ? 'bg-amber-400' : 'bg-emerald-400'
                                                        }`}
                                                        style={{ width: `${k.difficulty}%` }}
                                                    />
                                                </div>
                                                <span className="text-[10px] text-slate-400 font-mono">{k.difficulty}%</span>
                                            </div>
                                        </td>

                                        {/* Target URL */}
                                        <td className="py-3 px-4">
                                            {k.targetUrl ? (
                                                <a
                                                    href={k.targetUrl}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="text-cyan-400 hover:text-cyan-300 hover:underline flex items-center gap-1 font-mono text-[11px] truncate max-w-[200px]"
                                                >
                                                    <span>{k.targetUrl}</span>
                                                    <ArrowUpRight className="h-3 w-3 opacity-60" />
                                                </a>
                                            ) : (
                                                <span className="text-slate-500 font-mono text-[11px]">/</span>
                                            )}
                                        </td>

                                        {/* Actions */}
                                        <td className="py-3 px-4 text-right">
                                            <button
                                                onClick={() => handleDelete(k.id, k.keyword)}
                                                className="p-1 rounded text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors opacity-0 group-hover:opacity-100"
                                                title="Kulcsszó törlése"
                                            >
                                                <Trash2 className="h-3.5 w-3.5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Top Landing Pages section */}
            {topPages.length > 0 && (
                <Card className="bg-[#090d16] border-white/10 p-5">
                    <CardHeader className="p-0 pb-3">
                        <CardTitle className="text-sm font-bold text-white flex items-center gap-2">
                            <Layers className="h-4 w-4 text-cyan-400" />
                            Legjobban Rangsoroló Céloldalak (Landing Pages)
                        </CardTitle>
                        <CardDescription className="text-xs text-slate-400">
                            Ezek az aloldalak hozzák a legtöbb kulcsszavas megjelenést a Google találati listáján.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-0 pt-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                        {topPages.map(([url, count]) => (
                            <div key={url} className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
                                <div className="truncate mr-2">
                                    <div className="font-mono text-xs text-cyan-300 truncate">{url}</div>
                                    <div className="text-[10px] text-slate-500 mt-0.5">{count} db kulcsszó céloldala</div>
                                </div>
                                <Badge className="bg-cyan-500/15 text-cyan-400 border-cyan-500/30 text-[10px] font-mono shrink-0">
                                    {count} KW
                                </Badge>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
