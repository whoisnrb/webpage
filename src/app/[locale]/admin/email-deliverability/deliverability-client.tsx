"use client"

import { useState, useTransition } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { testEmailDeliverability, DeliverabilityReport } from "@/app/actions/email-deliverability"
import {
    MailCheck,
    Inbox,
    ShieldAlert,
    AlertTriangle,
    CheckCircle2,
    RefreshCw,
    Copy,
    Check,
    Send,
    Sparkles,
    Server,
    ShieldCheck,
    FileText,
    Link as LinkIcon,
    AlertOctagon,
    Lightbulb,
} from "lucide-react"

const DEFAULT_SAMPLE_OUTREACH = `Tisztelt Cégvezetés!

Török Norbert vagyok a BacklineIT alapítója. Cégünk vállalati kiberbiztonsággal és felhőinfrastruktúrák védelmével foglalkozik — a Microsoft által hivatalosan elismert és technológiailag támogatott hazai startupként.

Automatizált biztonsági robotunk a mai napon felmérte a weboldaluk nyilvánosan elérhető kiszolgálóját, és a vizsgálat több beavatkozást igénylő pontot azonosított.

A részletes technikai jelentést mellékeltem az emailhez.

ÁFA-mentesen számlázunk (AAM), és szívesen segítünk a rések 24 órán belüli lezárásában.

Üdvözlettel,
Török Norbert
BacklineIT | https://backlineit.hu`

export function DeliverabilityClient() {
    const [domain, setDomain] = useState("backlineit.hu")
    const [subject, setSubject] = useState("Sürgős biztonsági észrevétel a weboldallal kapcsolatban [Audit riport]")
    const [body, setBody] = useState(DEFAULT_SAMPLE_OUTREACH)

    const [isScanning, startScan] = useTransition()
    const [report, setReport] = useState<DeliverabilityReport | null>(null)
    const [copiedSubjectIdx, setCopiedSubjectIdx] = useState<number | null>(null)

    const handleRunTest = () => {
        if (!domain.trim()) {
            toast.error("Kérlek, add meg a feladó domaint!")
            return
        }

        startScan(async () => {
            toast.loading("Email kézbesíthetőség elemzése...", { id: "deliverability-scan" })
            const res = await testEmailDeliverability({ domain, subject, body })
            toast.dismiss("deliverability-scan")

            if (res.success && res.data) {
                setReport(res.data)
                toast.success(`📬 ${domain} kézbesíthetőségi elemzése kész!`)
            } else {
                toast.error(res.error || "Nem sikerült a vizsgálat.")
            }
        })
    }

    const copySubject = async (text: string, idx: number) => {
        try {
            await navigator.clipboard.writeText(text)
            setCopiedSubjectIdx(idx)
            setTimeout(() => setCopiedSubjectIdx(null), 2000)
            toast.success("Optimalizált tárgysor másolva!")
        } catch {
            toast.error("Nem sikerült másolni.")
        }
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500 max-w-7xl mx-auto pb-16">
            {/* Header Banner */}
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#070d18] via-[#09152b] to-[#160c29] p-8 md:p-10 shadow-2xl">
                <div className="relative z-10 max-w-3xl space-y-4">
                    <div className="flex flex-wrap items-center gap-2">
                        <Badge className="bg-emerald-500/10 text-emerald-300 border-emerald-500/20 px-3 py-1 font-medium flex items-center gap-1.5">
                            <Inbox className="h-3.5 w-3.5 text-emerald-400" />
                            Inbox Placement & Spam Filter AI
                        </Badge>
                        <Badge className="bg-cyan-500/10 text-cyan-300 border-cyan-500/20 px-3 py-1 font-medium flex items-center gap-1.5">
                            <ShieldCheck className="h-3.5 w-3.5 text-cyan-400" />
                            SPF, DMARC, DKIM & DNSBL Ellenőrzés
                        </Badge>
                    </div>

                    <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white">
                        Automata Email Kézbesíthetőség & <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
                            Spam Score Tesztelő
                        </span>
                    </h1>

                    <p className="text-slate-300 text-sm md:text-base leading-relaxed">
                        Teszteld le a hideg megkereséseidet, hírleveleidet és számlaértesítőidet a kiküldés előtt.
                        Vizsgáld a feladó domain DNS hitelességét és a szöveg spam-kockázatát, hogy minden leveled garantáltan
                        az elsődleges Beérkező (Inbox) mappába érkezzen!
                    </p>
                </div>

                <div className="absolute -right-10 -bottom-10 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
                <div className="absolute right-40 -top-10 h-60 w-60 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
            </div>

            {/* Test Composer Card */}
            <Card className="border border-white/10 bg-[#090d16]/80 rounded-3xl p-6 md:p-8 shadow-xl space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/5">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
                        <MailCheck className="h-4 w-4" />
                        Levél és Feladó Adatok Megadása
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => {
                                setSubject("Sürgős biztonsági észrevétel a weboldallal kapcsolatban [Audit riport]")
                                setBody(DEFAULT_SAMPLE_OUTREACH)
                            }}
                            className="text-xs text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl h-8 px-3"
                        >
                            Hideg Megkereső Sablon
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                            Küldő Domain (SPF / DMARC)
                        </label>
                        <Input
                            placeholder="pl.: backlineit.hu"
                            value={domain}
                            onChange={(e) => setDomain(e.target.value)}
                            disabled={isScanning}
                            className="mt-1.5 bg-[#0b101c] border-white/10 text-white placeholder:text-slate-500 rounded-xl h-11 text-sm focus-visible:ring-emerald-500"
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                            Tervezett Tárgymező (Subject)
                        </label>
                        <Input
                            placeholder="pl.: Kiberbiztonsági helyzetkép a cegnev.hu rendszereiről"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            disabled={isScanning}
                            className="mt-1.5 bg-[#0b101c] border-white/10 text-white placeholder:text-slate-500 rounded-xl h-11 text-sm focus-visible:ring-emerald-500"
                        />
                    </div>
                </div>

                <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                            Tervezett Levéltörzs (Body)
                        </label>
                        <span className="text-[11px] text-slate-400 font-mono">
                            Hossz: {body.length} karakter
                        </span>
                    </div>
                    <Textarea
                        rows={8}
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                        disabled={isScanning}
                        placeholder="Másold be a kiküldendő levél szövegét..."
                        className="bg-[#0b101c] border-white/10 text-slate-200 font-sans text-xs leading-relaxed rounded-2xl p-4 focus-visible:ring-emerald-500"
                    />
                </div>

                <div className="flex justify-end pt-2">
                    <Button
                        type="button"
                        onClick={handleRunTest}
                        disabled={isScanning}
                        className="h-12 px-8 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-bold rounded-2xl shadow-lg shadow-emerald-500/20 text-sm transition-all duration-300 cursor-pointer flex items-center justify-center gap-2"
                    >
                        {isScanning ? (
                            <>
                                <RefreshCw className="h-4 w-4 animate-spin" />
                                Kézbesíthetőség Elemzése...
                            </>
                        ) : (
                            <>
                                <Send className="h-4 w-4" />
                                Kézbesíthetőségi Teszt Indítása
                            </>
                        )}
                    </Button>
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
                                report.score >= 90
                                    ? "bg-gradient-to-br from-emerald-950/40 to-slate-900 border-emerald-500/30"
                                    : report.score >= 75
                                    ? "bg-gradient-to-br from-cyan-950/40 to-slate-900 border-cyan-500/30"
                                    : "bg-gradient-to-br from-rose-950/40 to-slate-900 border-rose-500/30"
                            }`}
                        >
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                    Kézbesítési Index
                                </span>
                                <Inbox
                                    className={`h-5 w-5 ${
                                        report.score >= 90 ? "text-emerald-400" : report.score >= 75 ? "text-cyan-400" : "text-rose-400"
                                    }`}
                                />
                            </div>
                            <div className="my-2">
                                <div className="text-5xl font-black text-white flex items-baseline gap-1">
                                    {report.score}
                                    <span className="text-lg font-bold text-slate-400">/ 100</span>
                                </div>
                                <div className="text-xs font-bold uppercase tracking-wider mt-1 text-slate-300">
                                    {report.inboxPlacementProbability}
                                </div>
                            </div>
                            <span className="text-[10px] text-slate-400 font-mono">
                                Domain: {report.domain}
                            </span>
                        </Card>

                        {/* SPF Card */}
                        <Card className="border border-white/10 bg-[#090d16]/80 rounded-3xl p-6 flex flex-col justify-between shadow-xl">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                    SPF Védelem
                                </span>
                                {report.dnsHealth.spf.valid ? (
                                    <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                                ) : (
                                    <AlertTriangle className="h-5 w-5 text-rose-400" />
                                )}
                            </div>
                            <div className="my-2">
                                <div className="text-2xl font-bold text-white">
                                    {report.dnsHealth.spf.valid ? "Érvényes SPF" : "Hiányzik!"}
                                </div>
                                <p className="text-xs text-slate-300 mt-1">
                                    Szabályzat: {report.dnsHealth.spf.policy} ({report.dnsHealth.spf.lookupCount} lookup)
                                </p>
                            </div>
                            <span className="text-[10px] text-slate-400 font-mono truncate">
                                {report.dnsHealth.spf.record ? "✅ Konfigurálva" : "❌ Nincs TXT"}
                            </span>
                        </Card>

                        {/* DMARC Card */}
                        <Card className="border border-white/10 bg-[#090d16]/80 rounded-3xl p-6 flex flex-col justify-between shadow-xl">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                    DMARC Szabályzat
                                </span>
                                {report.dnsHealth.dmarc.valid && report.dnsHealth.dmarc.policy !== "none" ? (
                                    <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                                ) : (
                                    <AlertTriangle className="h-5 w-5 text-amber-400" />
                                )}
                            </div>
                            <div className="my-2">
                                <div className="text-2xl font-bold text-white capitalize">
                                    {report.dnsHealth.dmarc.policy} Mód
                                </div>
                                <p className="text-xs text-slate-300 mt-1">
                                    {report.dnsHealth.dmarc.policy === "reject"
                                        ? "Maximális szigor (p=reject)"
                                        : report.dnsHealth.dmarc.policy === "quarantine"
                                        ? "Erős védelem (p=quarantine)"
                                        : "Passzív (p=none) felügyelet"}
                                </p>
                            </div>
                            <span className="text-[10px] text-slate-400 font-mono">
                                Riporting: {report.dnsHealth.dmarc.hasReporting ? "✅ rua aktív" : "⚠️ nincs rua"}
                            </span>
                        </Card>

                        {/* Provider & Blacklist */}
                        <Card className="border border-white/10 bg-[#090d16]/80 rounded-3xl p-6 flex flex-col justify-between shadow-xl">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                    Levelező & Feketelista
                                </span>
                                <Server className="h-5 w-5 text-cyan-400" />
                            </div>
                            <div className="my-2">
                                <div className="text-xl font-bold text-white truncate">
                                    {report.dnsHealth.mx.provider}
                                </div>
                                <p className="text-xs text-emerald-300 mt-1 flex items-center gap-1">
                                    <CheckCircle2 className="h-3.5 w-3.5" /> Feketelisták: Tiszta
                                </p>
                            </div>
                            <span className="text-[10px] text-slate-400 font-mono">
                                DKIM: {report.dnsHealth.dkim.detected ? "✅ Észlelve" : "ℹ️ Standard név hiányzik"}
                            </span>
                        </Card>
                    </div>

                    {/* Content & Spam Words Breakdown */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Content Analysis */}
                        <Card className="border border-white/10 bg-[#090d16]/80 rounded-3xl p-6 shadow-xl space-y-4">
                            <h3 className="text-sm font-bold text-white flex items-center gap-2">
                                <FileText className="h-4 w-4 text-emerald-400" />
                                Szöveges Tartalom & Spam Kockázatok
                            </h3>

                            <div className="grid grid-cols-2 gap-3 text-xs">
                                <div className="p-3 rounded-xl border border-white/5 bg-[#0b101c]">
                                    <div className="text-slate-400">Gyanús szavak</div>
                                    <div className="text-lg font-bold text-white mt-1">
                                        {report.contentAnalysis.spamWordsFound.length} db
                                    </div>
                                </div>
                                <div className="p-3 rounded-xl border border-white/5 bg-[#0b101c]">
                                    <div className="text-slate-400">Külső linkek</div>
                                    <div className="text-lg font-bold text-white mt-1">
                                        {report.contentAnalysis.linkCount} db
                                    </div>
                                </div>
                            </div>

                            {report.contentAnalysis.spamWordsFound.length > 0 ? (
                                <div className="space-y-2 pt-2">
                                    <span className="text-xs font-semibold text-slate-300">
                                        Spamszűrőt aktiváló kifejezések a szövegben:
                                    </span>
                                    <div className="flex flex-wrap gap-2">
                                        {report.contentAnalysis.spamWordsFound.map((w, idx) => (
                                            <Badge
                                                key={idx}
                                                className={`text-xs ${
                                                    w.severity === "high"
                                                        ? "bg-rose-500/20 text-rose-300 border-rose-500/30"
                                                        : "bg-amber-500/20 text-amber-300 border-amber-500/30"
                                                }`}
                                            >
                                                {w.word}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-2">
                                    <CheckCircle2 className="h-4 w-4 shrink-0" />
                                    Nem találtunk kockázatos spam trigger szavakat a megadott levélben!
                                </div>
                            )}
                        </Card>

                        {/* Subject Optimizer */}
                        <Card className="border border-white/10 bg-[#090d16]/80 rounded-3xl p-6 shadow-xl space-y-4">
                            <h3 className="text-sm font-bold text-white flex items-center gap-2">
                                <Sparkles className="h-4 w-4 text-purple-400" />
                                Spamszűrő-biztos Tárgysor Alternatívák
                            </h3>
                            <p className="text-xs text-slate-400">
                                Magas megnyitási arányú, szakmai alternatívák a spam mappa elkerüléséhez:
                            </p>

                            <div className="space-y-2.5">
                                {report.optimizedSubjectAlternatives.map((subj, idx) => (
                                    <div
                                        key={idx}
                                        className="p-3 rounded-xl border border-white/5 bg-[#0b101c] flex items-center justify-between gap-3 text-xs"
                                    >
                                        <span className="text-slate-200 font-medium">{subj}</span>
                                        <Button
                                            type="button"
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => copySubject(subj, idx)}
                                            className="text-[11px] h-7 px-2.5 text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg shrink-0"
                                        >
                                            {copiedSubjectIdx === idx ? (
                                                <Check className="h-3 w-3 text-emerald-400" />
                                            ) : (
                                                <Copy className="h-3 w-3" />
                                            )}
                                            {copiedSubjectIdx === idx ? "Másolva" : "Másolás"}
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>

                    {/* Identified Issues & Recommendations */}
                    <Card className="border border-white/10 bg-[#090d16]/80 rounded-3xl p-6 shadow-xl space-y-4">
                        <h3 className="text-base font-bold text-white flex items-center gap-2">
                            <Lightbulb className="h-4 w-4 text-amber-400" />
                            Kézbesíthetőségi Tanácsok & Javítási Javaslatok
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {report.recommendations.map((rec, idx) => (
                                <div
                                    key={idx}
                                    className="p-4 rounded-2xl border border-white/5 bg-[#0b101c] flex items-start gap-3"
                                >
                                    <div className="h-6 w-6 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                                        ✓
                                    </div>
                                    <p className="text-xs text-slate-200 leading-relaxed">{rec}</p>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            )}
        </div>
    )
}
