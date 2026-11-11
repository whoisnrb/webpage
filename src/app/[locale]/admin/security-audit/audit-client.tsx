"use client"

import { useState, useTransition } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import {
    runSecurityScan,
    AuditReport,
} from "@/app/actions/security-audit"
import {
    ShieldCheck,
    ShieldAlert,
    ShieldX,
    Lock,
    Unlock,
    Server,
    Mail,
    Globe,
    CheckCircle2,
    XCircle,
    AlertTriangle,
    RefreshCw,
    Copy,
    Check,
    Printer,
    FileDown,
    ArrowRight,
    Zap,
    Bot,
    ExternalLink,
} from "lucide-react"

const PRESET_DOMAINS = [
    { label: "BacklineIT.hu (Saját oldal)", domain: "backlineit.hu" },
    { label: "Google.com (Referencia)", domain: "google.com" },
    { label: "Index.hu (Híroldal)", domain: "index.hu" },
    { label: "OTP Bank (Pénzintézet)", domain: "otpbank.hu" },
]

export function AuditClient() {
    const [domain, setDomain] = useState("backlineit.hu")
    const [isScanning, startScan] = useTransition()
    const [report, setReport] = useState<AuditReport | null>(null)
    const [scanStep, setScanStep] = useState<string>("")
    const [copied, setCopied] = useState(false)
    const [isGeneratingPdf, setIsGeneratingPdf] = useState(false)

    const handleRunScan = () => {
        if (!domain.trim()) {
            toast.error("Kérlek, adj meg egy domain nevet!")
            return
        }

        setScanStep("DNS és SPF/DMARC rekordok lekérdezése...")

        startScan(async () => {
            toast.loading("Audit vizsgálat folyamatban...", { id: "audit-scan" })

            // Simulation step triggers for responsive UI feel
            const t1 = setTimeout(() => setScanStep("SSL/TLS tanúsítvány és fejlécek ellenőrzése..."), 900)
            const t2 = setTimeout(() => setScanStep("Portok és kiszolgáló szivárgások vizsgálata..."), 1800)
            const t3 = setTimeout(() => setScanStep("Azure OpenAI GPT-4o biztonsági kockázatelemzés készítése..."), 2600)

            const res = await runSecurityScan(domain)

            clearTimeout(t1)
            clearTimeout(t2)
            clearTimeout(t3)
            toast.dismiss("audit-scan")

            if (res.success && res.data) {
                setReport(res.data)
                setScanStep("")
                toast.success(`✨ ${domain} biztonsági vizsgálata sikeresen lefutott!`)
            } else {
                setScanStep("")
                toast.error(res.error || "Nem sikerült lefolytatni a vizsgálatot.")
            }
        })
    }

    const copyReportSummary = async () => {
        if (!report) return
        const text = `
🛡️ BACKLINEIT KIBERBIZTONSÁGI AUDIT JELENTÉS
Célpont: ${report.domain}
Dátum: ${report.scanDate}
Biztonsági Pontszám: ${report.score} / 100 (${report.riskLevel})

📋 VEZETŐI ÖSSZEFOGLALÓ:
${report.summary}

⚠️ FŐBB SEBEZHETŐSÉGEK:
${report.vulnerabilities.map((v, i) => `${i + 1}. [${v.severity.toUpperCase()}] ${v.title}\n   ${v.description}\n   Javaslat: ${v.recommendation}`).join("\n\n")}

✅ ERŐSSÉGEK:
${report.strengths.map((s) => `• ${s}`).join("\n")}

🎯 AKCIÓTERV:
${report.actionPlan.map((a) => `${a.priority}. ${a.task} -> ${a.impact}`).join("\n")}

💡 BACKLINEIT AJÁNLÁS:
${report.backlineProposal.headline}
Ajánlott megoldás: ${report.backlineProposal.recommendedService}
${report.backlineProposal.pitch}
`
        try {
            await navigator.clipboard.writeText(text.trim())
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
            toast.success("Teljes audit jelentés másolva a vágólapra!")
        } catch {
            toast.error("Nem sikerült másolni a vágólapra.")
        }
    }

    const handleDownloadPdf = async () => {
        if (!report || isGeneratingPdf) return
        setIsGeneratingPdf(true)
        toast.loading("Profi vezetői PDF jelentés generálása...", { id: "audit-pdf" })

        try {
            const response = await fetch("/api/admin/security-audit/pdf", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(report),
            })

            if (!response.ok) {
                const errData = await response.json().catch(() => ({}))
                throw new Error(errData.error || "Nem sikerült legenerálni a PDF-et.")
            }

            const blob = await response.blob()
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement("a")
            const safeDomain = report.domain.replace(/[^a-zA-Z0-9.-]/g, "_")
            const dateStamp = new Date().toISOString().slice(0, 10)
            a.href = url
            a.download = `BacklineIT-Biztonsagi-Audit-${safeDomain}-${dateStamp}.pdf`
            document.body.appendChild(a)
            a.click()
            a.remove()
            window.URL.revokeObjectURL(url)

            toast.dismiss("audit-pdf")
            toast.success("✨ Vezetői PDF jelentés sikeresen letöltve!")
        } catch (err: any) {
            toast.dismiss("audit-pdf")
            toast.error(err?.message || "Hiba történt a PDF letöltése közben.")
        } finally {
            setIsGeneratingPdf(false)
        }
    }

    const getScoreColor = (score: number) => {
        if (score >= 85) return "text-emerald-400 border-emerald-500/40 bg-emerald-500/10"
        if (score >= 65) return "text-cyan-400 border-cyan-500/40 bg-cyan-500/10"
        if (score >= 45) return "text-amber-400 border-amber-500/40 bg-amber-500/10"
        return "text-red-400 border-red-500/40 bg-red-500/10"
    }

    return (
        <div className="space-y-8">
            {/* Header Banner */}
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-r from-[#070e1e] via-[#090d16] to-[#0c182a] p-6 md:p-8 shadow-2xl backdrop-blur-md">
                <div className="absolute top-0 right-0 -mt-16 -mr-16 h-64 w-64 rounded-full bg-cyan-500/15 blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-1/3 -mb-16 h-48 w-48 rounded-full bg-blue-600/10 blur-3xl pointer-events-none" />

                <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2.5">
                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 flex items-center gap-1.5 shadow-[0_0_12px_rgba(6,182,212,0.2)]">
                                <ShieldCheck className="h-3.5 w-3.5 text-cyan-400 animate-pulse" />
                                Automata IT Sérülékenységvizsgáló Robot
                            </span>
                            <span className="px-3 py-1 rounded-full text-xs font-mono bg-purple-500/15 text-purple-300 border border-purple-500/30 flex items-center gap-1.5">
                                <Bot className="h-3.5 w-3.5 text-purple-400" />
                                Azure OpenAI GPT-4o Elemzés
                            </span>
                        </div>
                        <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-cyan-300 bg-clip-text text-transparent">
                            Kiberbiztonsági & IT Audit Robot
                        </h2>
                        <p className="text-slate-300 text-sm max-w-2xl leading-relaxed">
                            Vizsgálj meg bármilyen céges vagy ügyfél weboldalt: SSL érvényesség, DNS email védelem (SPF, DMARC), biztonsági HTTP fejlécek és nyitott portok. A GPT-4o másodpercek alatt készít azonnal kiküldhető, BacklineIT márkázott vezetői audit jelentést.
                        </p>
                    </div>
                </div>
            </div>

            {/* Input & Scanner Form */}
            <Card className="border border-white/10 bg-[#090d16]/70 rounded-3xl shadow-xl backdrop-blur-sm overflow-hidden">
                <CardHeader className="border-b border-white/5 bg-[#0b101c]/40 pb-5">
                    <div className="flex items-center gap-2">
                        <Zap className="h-5 w-5 text-cyan-400" />
                        <CardTitle className="text-lg font-bold text-white">Célpont Megadása</CardTitle>
                    </div>
                    <CardDescription className="text-slate-400 text-xs">
                        Írd be a vizsgálandó domain nevet (pl.: cegnev.hu vagy aldomain.ceg.hu)
                    </CardDescription>
                </CardHeader>

                <CardContent className="p-6 space-y-6">
                    {/* Presets */}
                    <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                            Gyors Teszt Sablonok
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {PRESET_DOMAINS.map((p, idx) => (
                                <button
                                    key={idx}
                                    type="button"
                                    onClick={() => setDomain(p.domain)}
                                    className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                                        domain === p.domain
                                            ? "border-cyan-500/50 bg-cyan-500/15 text-cyan-300"
                                            : "border-white/5 bg-white/[0.02] text-slate-400 hover:text-white hover:border-white/15"
                                    }`}
                                >
                                    {p.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Input bar */}
                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="relative flex-1">
                            <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                            <Input
                                value={domain}
                                onChange={(e) => setDomain(e.target.value)}
                                placeholder="pelda-ceg.hu"
                                className="pl-10 bg-[#0b101c] border-white/10 text-white rounded-xl focus:border-cyan-500 h-12 text-sm font-mono"
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && !isScanning) {
                                        handleRunScan()
                                    }
                                }}
                            />
                        </div>

                        <Button
                            onClick={handleRunScan}
                            disabled={isScanning}
                            className="bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold px-7 h-12 rounded-xl shadow-lg shadow-cyan-600/25 border border-cyan-400/40 flex items-center justify-center gap-2.5 transition-all duration-300 cursor-pointer shrink-0"
                        >
                            {isScanning ? (
                                <>
                                    <RefreshCw className="h-4 w-4 animate-spin text-white" />
                                    <span>Vizsgálat fut...</span>
                                </>
                            ) : (
                                <>
                                    <ShieldCheck className="h-4 w-4 text-cyan-300" />
                                    <span>Audit Robot Indítása</span>
                                </>
                            )}
                        </Button>
                    </div>

                    {/* Scanning step indicator */}
                    {isScanning && scanStep && (
                        <div className="flex items-center gap-2.5 text-xs text-cyan-300 bg-cyan-950/30 border border-cyan-800/40 p-3 rounded-xl animate-pulse">
                            <RefreshCw className="h-4 w-4 animate-spin shrink-0 text-cyan-400" />
                            <span>{scanStep}</span>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Results Section */}
            {report && (
                <div className="space-y-6">
                    {/* Top Overview Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {/* Score Card */}
                        <Card className="border border-white/10 bg-[#090d16]/80 rounded-3xl p-6 flex flex-col items-center justify-center text-center shadow-xl">
                            <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-2">
                                Biztonsági Pontszám
                            </span>
                            <div className={`h-24 w-24 rounded-full border-4 flex flex-col items-center justify-center font-black text-3xl shadow-lg ${getScoreColor(report.score)}`}>
                                <span>{report.score}</span>
                                <span className="text-[10px] font-medium opacity-70">/ 100</span>
                            </div>
                            <Badge className="mt-3 bg-white/5 border-white/10 text-white font-semibold">
                                {report.riskLevel} Kockázat
                            </Badge>
                        </Card>

                        {/* SSL Card */}
                        <Card className="border border-white/10 bg-[#090d16]/80 rounded-3xl p-6 flex flex-col justify-between shadow-xl">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                    SSL / TLS Védelem
                                </span>
                                {report.technicalDetails.ssl.valid ? (
                                    <Lock className="h-5 w-5 text-emerald-400" />
                                ) : (
                                    <Unlock className="h-5 w-5 text-red-400" />
                                )}
                            </div>
                            <div>
                                <h4 className="text-xl font-bold text-white">
                                    {report.technicalDetails.ssl.valid ? "Érvényes Tanúsítvány" : "Kritikus: Nincs SSL"}
                                </h4>
                                <p className="text-xs text-slate-400 mt-1">
                                    {report.technicalDetails.ssl.valid
                                        ? `${report.technicalDetails.ssl.daysRemaining} nap van hátra (${report.technicalDetails.ssl.protocol || "TLS"})`
                                        : report.technicalDetails.ssl.error || "A kapcsolat nem biztonságos"}
                                </p>
                            </div>
                            <span className="text-[10px] font-mono text-cyan-400 truncate">
                                Kibocsátó: {report.technicalDetails.ssl.issuer || "Ismeretlen"}
                            </span>
                        </Card>

                        {/* Email Security (SPF/DMARC) */}
                        <Card className="border border-white/10 bg-[#090d16]/80 rounded-3xl p-6 flex flex-col justify-between shadow-xl">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                    Email Hitelesítés
                                </span>
                                <Mail className="h-5 w-5 text-blue-400" />
                            </div>
                            <div>
                                <h4 className="text-xl font-bold text-white">
                                    {report.technicalDetails.dns.hasSpf && report.technicalDetails.dns.hasDmarc
                                        ? "Védett (SPF & DMARC)"
                                        : report.technicalDetails.dns.hasSpf
                                        ? "Részleges (Csak SPF)"
                                        : "Védtelen Domain"}
                                </h4>
                                <p className="text-xs text-slate-400 mt-1">
                                    {report.technicalDetails.dns.hasDmarc
                                        ? "Phishing & hamisítás elleni védelem aktív"
                                        : "Nincs DMARC: A domain nevében bárki küldhet csaló emailt!"}
                                </p>
                            </div>
                            <span className="text-[10px] text-slate-400 font-mono">
                                DMARC: {report.technicalDetails.dns.hasDmarc ? "✅ Megtalálható" : "❌ Hiányzik"}
                            </span>
                        </Card>

                        {/* Open Ports */}
                        <Card className="border border-white/10 bg-[#090d16]/80 rounded-3xl p-6 flex flex-col justify-between shadow-xl">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                    Port Kitettség
                                </span>
                                <Server className="h-5 w-5 text-purple-400" />
                            </div>
                            <div>
                                {(() => {
                                    const openDangerous = report.technicalDetails.ports.filter(
                                        (p) => p.status === "open" && p.port !== 80 && p.port !== 443
                                    )
                                    return (
                                        <>
                                            <h4 className="text-xl font-bold text-white">
                                                {openDangerous.length > 0 ? "Veszélyes Nyitott Portok" : "Zárt / Védett Hálózat"}
                                            </h4>
                                            <p className="text-xs text-slate-400 mt-1">
                                                {openDangerous.length > 0
                                                    ? `${openDangerous.map((p) => p.port).join(", ")} nyitva van az internet felé!`
                                                    : "Csak a szabványos webportok (80, 443) érhetők el"}
                                            </p>
                                        </>
                                    )
                                })()}
                            </div>
                            <span className="text-[10px] text-slate-400 font-mono">
                                Szerver: {report.technicalDetails.headers.serverHeader || "Rejtett / WAF"}
                            </span>
                        </Card>
                    </div>

                    {/* Executive Summary Card & Action Bar */}
                    <Card className="border border-white/10 bg-[#090d16]/80 rounded-3xl shadow-xl overflow-hidden">
                        <CardHeader className="border-b border-white/5 bg-[#0b101c]/60 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
                                    <Bot className="h-5 w-5 text-cyan-400" />
                                    Vezetői Kiberbiztonsági Értékelés ({report.domain})
                                </CardTitle>
                                <CardDescription className="text-slate-400 text-xs">
                                    Generálva: {report.scanDate} • Azure OpenAI GPT-4o Security Engine
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
                                    onClick={handleDownloadPdf}
                                    disabled={isGeneratingPdf}
                                    className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold rounded-xl border border-cyan-400/40 shadow-lg shadow-cyan-500/20 flex items-center gap-1.5 cursor-pointer"
                                >
                                    {isGeneratingPdf ? (
                                        <>
                                            <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                                            PDF Készül...
                                        </>
                                    ) : (
                                        <>
                                            <FileDown className="h-3.5 w-3.5 text-cyan-200" />
                                            Profi PDF Letöltése
                                        </>
                                    )}
                                </Button>
                            </div>
                        </CardHeader>

                        <CardContent className="p-6 md:p-8 space-y-6">
                            {/* Summary Text */}
                            <div className="bg-[#0b101c] border border-white/5 rounded-2xl p-6 space-y-3">
                                <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                                    Vezetői Összefoglaló (Cégvezetőknek & IT döntéshozóknak)
                                </h4>
                                <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">
                                    {report.summary}
                                </p>
                            </div>

                            {/* Vulnerabilities & Strengths Grid */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Vulnerabilities */}
                                <div className="space-y-3">
                                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                                        <AlertTriangle className="h-4 w-4 text-amber-400" />
                                        Feltárt Kockázatok & Sérülékenységek ({report.vulnerabilities.length})
                                    </h4>

                                    <div className="space-y-3">
                                        {report.vulnerabilities.map((v, idx) => (
                                            <div
                                                key={idx}
                                                className={`p-4 rounded-2xl border transition-all ${
                                                    v.severity === "critical"
                                                        ? "border-red-500/30 bg-red-500/5"
                                                        : v.severity === "warning"
                                                        ? "border-amber-500/30 bg-amber-500/5"
                                                        : "border-blue-500/30 bg-blue-500/5"
                                                }`}
                                            >
                                                <div className="flex items-center justify-between gap-2 mb-1">
                                                    <span className="text-sm font-bold text-white flex items-center gap-1.5">
                                                        {v.severity === "critical" ? (
                                                            <XCircle className="h-4 w-4 text-red-400" />
                                                        ) : (
                                                            <AlertTriangle className="h-4 w-4 text-amber-400" />
                                                        )}
                                                        {v.title}
                                                    </span>
                                                    <span
                                                        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                                                            v.severity === "critical"
                                                                ? "bg-red-500/20 text-red-300 border border-red-500/30"
                                                                : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                                                        }`}
                                                    >
                                                        {v.severity}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-slate-300 leading-relaxed mb-2">
                                                    {v.description}
                                                </p>
                                                <div className="bg-[#0b101c]/80 p-2.5 rounded-xl border border-white/5 text-xs text-cyan-300">
                                                    <strong>Javasolt javítás:</strong> {v.recommendation}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Strengths & Action Plan */}
                                <div className="space-y-6">
                                    {/* Strengths */}
                                    <div className="space-y-3">
                                        <h4 className="text-sm font-bold text-white flex items-center gap-2">
                                            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                                            Meglévő Erősségek & Védelmi Vonalak
                                        </h4>
                                        <div className="space-y-2">
                                            {report.strengths.map((s, idx) => (
                                                <div
                                                    key={idx}
                                                    className="p-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 flex items-center gap-2 text-xs text-slate-200"
                                                >
                                                    <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                                                    <span>{s}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Action Plan */}
                                    <div className="space-y-3">
                                        <h4 className="text-sm font-bold text-white flex items-center gap-2">
                                            <Zap className="h-4 w-4 text-cyan-400" />
                                            Javasolt Védelmi Akcióterv
                                        </h4>
                                        <div className="space-y-2">
                                            {report.actionPlan.map((a, idx) => (
                                                <div
                                                    key={idx}
                                                    className="p-3 rounded-xl border border-white/5 bg-[#0b101c] flex items-start gap-3"
                                                >
                                                    <span className="h-6 w-6 rounded-lg bg-cyan-500/20 text-cyan-300 font-bold text-xs flex items-center justify-center shrink-0 border border-cyan-500/30">
                                                        {a.priority}
                                                    </span>
                                                    <div className="space-y-0.5">
                                                        <p className="text-xs font-semibold text-white">{a.task}</p>
                                                        <p className="text-[11px] text-slate-400">{a.impact}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* BacklineIT Commercial Proposal Box */}
                            <div className="relative overflow-hidden rounded-2xl border border-cyan-500/30 bg-gradient-to-r from-cyan-950/40 via-[#0b101c] to-blue-950/30 p-6 shadow-xl">
                                <div className="space-y-2">
                                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                                        BacklineIT Megoldási Javaslat
                                    </span>
                                    <h3 className="text-lg font-bold text-white">
                                        {report.backlineProposal.headline}
                                    </h3>
                                    <p className="text-xs font-semibold text-cyan-300">
                                        Ajánlott csomag: {report.backlineProposal.recommendedService}
                                    </p>
                                    <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
                                        {report.backlineProposal.pitch}
                                    </p>
                                </div>
                            </div>

                            {/* Detailed Technical Tabs */}
                            <div className="pt-4 border-t border-white/5 space-y-4">
                                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                    Részletes Technikai Szkenner Eredmények
                                </h4>

                                <Tabs defaultValue="headers" className="space-y-4">
                                    <TabsList className="bg-[#0b101c] p-1 rounded-xl border border-white/5">
                                        <TabsTrigger
                                            value="headers"
                                            className="text-xs data-[state=active]:bg-cyan-600 data-[state=active]:text-white rounded-lg px-3 py-1.5 cursor-pointer text-slate-300"
                                        >
                                            HTTP Biztonsági Fejlécek
                                        </TabsTrigger>
                                        <TabsTrigger
                                            value="dns"
                                            className="text-xs data-[state=active]:bg-cyan-600 data-[state=active]:text-white rounded-lg px-3 py-1.5 cursor-pointer text-slate-300"
                                        >
                                            DNS & Email (SPF/DMARC)
                                        </TabsTrigger>
                                        <TabsTrigger
                                            value="ports"
                                            className="text-xs data-[state=active]:bg-cyan-600 data-[state=active]:text-white rounded-lg px-3 py-1.5 cursor-pointer text-slate-300"
                                        >
                                            Port Vizsgálat
                                        </TabsTrigger>
                                    </TabsList>

                                    {/* HEADERS TAB */}
                                    <TabsContent value="headers" className="space-y-3">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            <div className="p-3 bg-[#0b101c] rounded-xl border border-white/5 flex items-center justify-between text-xs">
                                                <span className="text-slate-300">Strict-Transport-Security (HSTS)</span>
                                                <Badge variant={report.technicalDetails.headers.hsts ? "default" : "destructive"}>
                                                    {report.technicalDetails.headers.hsts ? "Beállítva" : "Hiányzik"}
                                                </Badge>
                                            </div>
                                            <div className="p-3 bg-[#0b101c] rounded-xl border border-white/5 flex items-center justify-between text-xs">
                                                <span className="text-slate-300">Content-Security-Policy (CSP)</span>
                                                <Badge variant={report.technicalDetails.headers.csp ? "default" : "destructive"}>
                                                    {report.technicalDetails.headers.csp ? "Beállítva" : "Hiányzik"}
                                                </Badge>
                                            </div>
                                            <div className="p-3 bg-[#0b101c] rounded-xl border border-white/5 flex items-center justify-between text-xs">
                                                <span className="text-slate-300">X-Frame-Options (Clickjacking)</span>
                                                <Badge variant={report.technicalDetails.headers.xfo ? "default" : "destructive"}>
                                                    {report.technicalDetails.headers.xfo ? "Védett" : "Hiányzik"}
                                                </Badge>
                                            </div>
                                            <div className="p-3 bg-[#0b101c] rounded-xl border border-white/5 flex items-center justify-between text-xs">
                                                <span className="text-slate-300">X-Content-Type-Options (MIME Sniffing)</span>
                                                <Badge variant={report.technicalDetails.headers.xcto ? "default" : "destructive"}>
                                                    {report.technicalDetails.headers.xcto ? "nosniff" : "Hiányzik"}
                                                </Badge>
                                            </div>
                                        </div>
                                    </TabsContent>

                                    {/* DNS TAB */}
                                    <TabsContent value="dns" className="space-y-3">
                                        <div className="space-y-2 text-xs">
                                            <div className="p-3 bg-[#0b101c] rounded-xl border border-white/5 space-y-1">
                                                <span className="text-slate-400 font-semibold block">SPF Rekord:</span>
                                                <code className="text-cyan-300 font-mono text-[11px] break-all block">
                                                    {report.technicalDetails.dns.spfRecord || "Nincs konfigurálva"}
                                                </code>
                                            </div>
                                            <div className="p-3 bg-[#0b101c] rounded-xl border border-white/5 space-y-1">
                                                <span className="text-slate-400 font-semibold block">DMARC Rekord:</span>
                                                <code className="text-cyan-300 font-mono text-[11px] break-all block">
                                                    {report.technicalDetails.dns.dmarcRecord || "Nincs konfigurálva"}
                                                </code>
                                            </div>
                                        </div>
                                    </TabsContent>

                                    {/* PORTS TAB */}
                                    <TabsContent value="ports" className="space-y-3">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
                                            {report.technicalDetails.ports.map((p, idx) => (
                                                <div
                                                    key={idx}
                                                    className="p-3 bg-[#0b101c] rounded-xl border border-white/5 flex items-center justify-between text-xs"
                                                >
                                                    <div>
                                                        <span className="font-mono font-bold text-white block">
                                                            Port {p.port}
                                                        </span>
                                                        <span className="text-[10px] text-slate-400">{p.service}</span>
                                                    </div>
                                                    <span
                                                        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                                                            p.status === "open"
                                                                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                                                                : "bg-slate-800 text-slate-400 border border-white/5"
                                                        }`}
                                                    >
                                                        {p.status}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </TabsContent>
                                </Tabs>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    )
}
