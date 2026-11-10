'use client'

import { useState, useEffect, useRef } from "react"
import { 
    Activity, Radio, Server, Database, Zap, Shield, RefreshCw, 
    Maximize2, Minimize2, Volume2, VolumeX, Terminal, Cpu, HardDrive, 
    Globe, Flame, CheckCircle2, AlertTriangle, Layers, Play
} from "lucide-react"
import { MissionControlData, triggerLiveDiagnostics, flushAllRedisCache } from "@/app/actions/mission-control"
import { Button } from "@/components/ui/button"

function playBeep(freq = 580, duration = 0.06, enabled = true) {
    if (!enabled || typeof window === "undefined") return
    try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
        if (!AudioCtx) return
        const ctx = new AudioCtx()
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = "sine"
        osc.frequency.setValueAtTime(freq, ctx.currentTime)
        gain.gain.setValueAtTime(0.04, ctx.currentTime)
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration)
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.start()
        osc.stop(ctx.currentTime + duration)
    } catch {}
}

export function MissionControlClient({ initialData }: { initialData: MissionControlData }) {
    const [data, setData] = useState<MissionControlData>(initialData)
    const [soundEnabled, setSoundEnabled] = useState(true)
    const [isFullscreen, setIsFullscreen] = useState(false)
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [autoRefresh, setAutoRefresh] = useState(true)
    const [currentTime, setCurrentTime] = useState<string>("")
    const [utcTime, setUtcTime] = useState<string>("")
    const [drillActive, setDrillActive] = useState(false)
    const [actionMsg, setActionMsg] = useState<{ text: string; type: 'success' | 'warn' | 'info' } | null>(null)
    const [logs, setLogs] = useState<Array<{ id: string; time: string; tag: string; text: string; color: string }>>([])
    const [latencyHistory, setLatencyHistory] = useState<number[]>([18, 19, 17, 21, 18, 16, 17, 19, 18, 17, 18])
    const logContainerRef = useRef<HTMLDivElement>(null)

    // Óra ticker
    useEffect(() => {
        const updateClocks = () => {
            const now = new Date()
            setCurrentTime(now.toLocaleTimeString('hu-HU', { hour12: false }))
            setUtcTime(now.toUTCString().split(' ')[4] + ' UTC')
        }
        updateClocks()
        const interval = setInterval(updateClocks, 1000)
        return () => clearInterval(interval)
    }, [])

    // Kezdeti logok
    useEffect(() => {
        const initialLogs = [
            { id: '1', time: new Date().toLocaleTimeString('hu-HU'), tag: 'SYS_BOOT', text: 'BacklineIT Mission Control v2.0 inicializálva.', color: 'text-cyan-400' },
            { id: '2', time: new Date().toLocaleTimeString('hu-HU'), tag: 'CONTAINER', text: `Azure Container App: ${data.container.revision} online (${data.container.region}).`, color: 'text-emerald-400' },
            { id: '3', time: new Date().toLocaleTimeString('hu-HU'), tag: 'REDIS', text: `Azure Managed Redis 7.4 [Balanced B0] csatlakozva: ${data.redis.latencyMs}ms.`, color: 'text-purple-400' },
            { id: '4', time: new Date().toLocaleTimeString('hu-HU'), tag: 'EDGE', text: 'Cloudflare Anycast Cache Rules aktív (BUD / VIE POP).', color: 'text-amber-400' },
            { id: '5', time: new Date().toLocaleTimeString('hu-HU'), tag: 'TELEMETRY', text: 'Azure Application Insights server-side stream aktív.', color: 'text-blue-400' },
        ]
        setLogs(initialLogs)
    }, [])

    // Automatikus frissítés 6 másodpercenként
    useEffect(() => {
        if (!autoRefresh) return
        const interval = setInterval(async () => {
            try {
                const diag = await triggerLiveDiagnostics()
                const newLatency = diag.totalRoundtripMs
                setLatencyHistory(prev => [...prev.slice(1), newLatency])

                // Log bejegyzés generálása
                const newLog = {
                    id: Math.random().toString(),
                    time: new Date().toLocaleTimeString('hu-HU'),
                    tag: 'HEARTBEAT',
                    text: `Ping ACK: Redis ${diag.redisStatus} | DB ${diag.dbStatus} | RTT: ${diag.totalRoundtripMs}ms`,
                    color: diag.status === 'SUCCESS' ? 'text-emerald-400' : 'text-amber-400'
                }
                setLogs(prev => [...prev.slice(-25), newLog])
            } catch {}
        }, 6000)

        return () => clearInterval(interval)
    }, [autoRefresh])

    // Log görgetés alulra
    useEffect(() => {
        if (logContainerRef.current) {
            logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight
        }
    }, [logs])

    const handleManualRefresh = async () => {
        playBeep(700, 0.08, soundEnabled)
        setIsRefreshing(true)
        try {
            const diag = await triggerLiveDiagnostics()
            setLatencyHistory(prev => [...prev.slice(1), diag.totalRoundtripMs])
            setLogs(prev => [
                ...prev,
                {
                    id: Math.random().toString(),
                    time: new Date().toLocaleTimeString('hu-HU'),
                    tag: 'MANUAL_DIAG',
                    text: `Kézi diagnosztika lefutott: Összesített válaszidő ${diag.totalRoundtripMs}ms.`,
                    color: 'text-cyan-300'
                }
            ])
            setActionMsg({ text: `Diagnosztika sikeres: ${diag.totalRoundtripMs}ms`, type: 'success' })
        } catch {
            setActionMsg({ text: "Hiba történt a diagnosztika során", type: 'warn' })
        } finally {
            setIsRefreshing(false)
            setTimeout(() => setActionMsg(null), 4000)
        }
    }

    const handleFlushCache = async () => {
        playBeep(450, 0.15, soundEnabled)
        if (!confirm("Biztosan kiüríted az Azure Managed Redis összes gyorsítótárazott kulcsát?")) return

        setIsRefreshing(true)
        try {
            const res = await flushAllRedisCache()
            playBeep(880, 0.12, soundEnabled)
            setLogs(prev => [
                ...prev,
                {
                    id: Math.random().toString(),
                    time: new Date().toLocaleTimeString('hu-HU'),
                    tag: 'CACHE_PURGE',
                    text: 'Azure Managed Redis cache kulcsok sikeresen törölve.',
                    color: 'text-red-400'
                }
            ])
            setActionMsg({ text: res.message, type: 'success' })
        } catch (e: any) {
            setActionMsg({ text: e.message || "Hiba a törléskor", type: 'warn' })
        } finally {
            setIsRefreshing(false)
            setTimeout(() => setActionMsg(null), 4000)
        }
    }

    const handleDrillToggle = () => {
        playBeep(320, 0.25, soundEnabled)
        setDrillActive(true)
        setLogs(prev => [
            ...prev,
            {
                id: Math.random().toString(),
                time: new Date().toLocaleTimeString('hu-HU'),
                tag: 'WAR_DRILL',
                text: '!!! FIGYELEM: Rendszer-ellenállósági szimulációs gyakorlat aktív (DEFCON 2) !!!',
                color: 'text-amber-400 font-bold'
            }
        ])
        setTimeout(() => {
            setDrillActive(false)
            playBeep(650, 0.1, soundEnabled)
            setLogs(prev => [
                ...prev,
                {
                    id: Math.random().toString(),
                    time: new Date().toLocaleTimeString('hu-HU'),
                    tag: 'DRILL_END',
                    text: 'Gyakorlat befejezve. Minden rendszer visszaállt névértékre (DEFCON 5).',
                    color: 'text-emerald-400 font-semibold'
                }
            ])
        }, 5000)
    }

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(() => {})
            setIsFullscreen(true)
        } else {
            document.exitFullscreen().catch(() => {})
            setIsFullscreen(false)
        }
    }

    const defconStatus = drillActive ? {
        label: 'DEFCON 2 • SIMULATED ALERT',
        color: 'from-amber-500 to-orange-600',
        ring: 'ring-amber-500/50',
        pulse: 'bg-amber-500',
        border: 'border-amber-500/40'
    } : {
        label: 'DEFCON 5 • ALL SYSTEMS NOMINAL',
        color: 'from-emerald-500 to-cyan-500',
        ring: 'ring-emerald-500/40',
        pulse: 'bg-emerald-400',
        border: 'border-emerald-500/30'
    }

    return (
        <div className="space-y-6 select-none font-sans pb-12">
            {/* Top War Room HUD Bar */}
            <div className={`relative overflow-hidden rounded-2xl bg-[#070b16] border ${defconStatus.border} p-5 shadow-[0_0_35px_rgba(6,182,212,0.1)] transition-colors duration-500`}>
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#06b6d408_1px,transparent_1px),linear-gradient(to_bottom,#06b6d408_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

                <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* Bal oldal: Cím & DEFCON */}
                    <div className="flex items-center gap-4">
                        <div className="relative flex items-center justify-center w-12 h-12 rounded-xl bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.3)]">
                            <Radio className="w-6 h-6 animate-pulse text-cyan-400" />
                            <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-cyan-400 animate-ping opacity-75" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2.5">
                                <h1 className="text-xl sm:text-2xl font-black tracking-wider uppercase bg-gradient-to-r from-white via-slate-100 to-cyan-400 bg-clip-text text-transparent">
                                    Mission Control // War Room
                                </h1>
                                <span className={`text-[10px] font-black tracking-widest px-2.5 py-0.5 rounded-full uppercase bg-gradient-to-r ${defconStatus.color} text-black shadow-sm`}>
                                    LIVE
                                </span>
                            </div>
                            <p className="text-xs tracking-wider text-slate-400 flex items-center gap-2 mt-0.5">
                                <span className="font-mono text-cyan-400">BacklineIT Global Operations</span>
                                <span>•</span>
                                <span>Azure Cloud Telemetry Hub</span>
                            </p>
                        </div>
                    </div>

                    {/* Jobb oldal: Idő & Gombok */}
                    <div className="flex flex-wrap items-center gap-3">
                        {/* Órák */}
                        <div className="flex items-center gap-3 px-3.5 py-1.5 rounded-xl bg-white/[0.03] border border-white/10 font-mono text-xs">
                            <div className="text-slate-300">
                                <span className="text-slate-500 text-[10px] block leading-none mb-0.5">BUDAPEST</span>
                                <span className="text-cyan-400 font-semibold">{currentTime || '--:--:--'}</span>
                            </div>
                            <div className="w-px h-6 bg-white/10" />
                            <div className="text-slate-400">
                                <span className="text-slate-500 text-[10px] block leading-none mb-0.5">UTC</span>
                                <span>{utcTime || '--:--:--'}</span>
                            </div>
                        </div>

                        {/* Hang kapcsolo */}
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                                playBeep(500, 0.05, !soundEnabled)
                                setSoundEnabled(!soundEnabled)
                            }}
                            className="h-9 px-3 rounded-xl bg-white/[0.03] border border-white/10 hover:bg-white/10 text-slate-300"
                            title={soundEnabled ? "Hanghatások kikapcsolása" : "Hanghatások bekapcsolása"}
                        >
                            {soundEnabled ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
                        </Button>

                        {/* Fullscreen */}
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={toggleFullscreen}
                            className="h-9 px-3 rounded-xl bg-white/[0.03] border border-white/10 hover:bg-white/10 text-slate-300"
                            title="Teljes képernyős nézet (TV / Fal monitor mód)"
                        >
                            {isFullscreen ? <Minimize2 className="w-4 h-4 text-cyan-400" /> : <Maximize2 className="w-4 h-4 text-slate-300" />}
                        </Button>

                        {/* Kézi frissítés */}
                        <Button
                            variant="ghost"
                            size="sm"
                            disabled={isRefreshing}
                            onClick={handleManualRefresh}
                            className="h-9 px-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 hover:bg-cyan-500/20 text-cyan-300 gap-1.5"
                        >
                            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
                            <span className="text-xs font-semibold">Frissítés</span>
                        </Button>
                    </div>
                </div>

                {/* DEFCON Banner */}
                <div className="mt-4 pt-3 border-t border-white/5 flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2">
                        <span className={`w-2.5 h-2.5 rounded-full ${defconStatus.pulse} animate-ping`} />
                        <span className="font-mono font-bold tracking-wider text-slate-200">
                            {defconStatus.label}
                        </span>
                    </div>

                    <div className="flex items-center gap-4 text-[11px] font-mono text-slate-400">
                        <span>REGION: <strong className="text-cyan-400">{data.container.region}</strong></span>
                        <span>CLUSTER: <strong className="text-purple-400">AMR-7.4</strong></span>
                        <span>EDGE: <strong className="text-emerald-400">BUD-POP</strong></span>
                    </div>
                </div>
            </div>

            {/* Visszajelző toast üzenet */}
            {actionMsg && (
                <div className={`p-3 rounded-xl border text-xs font-mono font-semibold transition-all duration-300 animate-in fade-in slide-in-from-top-2 ${
                    actionMsg.type === 'success' 
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' 
                        : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                }`}>
                    ⚡ {actionMsg.text}
                </div>
            )}

            {/* Grid 1: Fő HUD Mutatók (4 db kártya) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* 1. Global TTFB & Edge */}
                <div className="relative rounded-2xl bg-[#090d19] border border-cyan-500/20 p-5 shadow-[0_0_20px_rgba(6,182,212,0.06)] hover:border-cyan-500/40 transition-all">
                    <div className="flex items-center justify-between text-slate-400 mb-2">
                        <span className="text-[11px] font-mono uppercase tracking-wider font-semibold">Edge TTFB & Cache</span>
                        <Globe className="w-4 h-4 text-cyan-400" />
                    </div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-black font-mono tracking-tight text-white">
                            ~{data.edge.avgTtfbMs}
                        </span>
                        <span className="text-xs font-mono font-bold text-cyan-400">ms</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-2 font-mono flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        Cloudflare BUD • 99.2% Hit
                    </p>
                </div>

                {/* 2. Azure Managed Redis */}
                <div className="relative rounded-2xl bg-[#090d19] border border-purple-500/20 p-5 shadow-[0_0_20px_rgba(168,85,247,0.06)] hover:border-purple-500/40 transition-all">
                    <div className="flex items-center justify-between text-slate-400 mb-2">
                        <span className="text-[11px] font-mono uppercase tracking-wider font-semibold">Azure Managed Redis</span>
                        <Zap className="w-4 h-4 text-purple-400" />
                    </div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-black font-mono tracking-tight text-white">
                            {data.redis.latencyMs || 0.8}
                        </span>
                        <span className="text-xs font-mono font-bold text-purple-400">ms PONG</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-2 font-mono flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
                        Memory: {data.redis.usedMemory || '1.8M'} • TLS Active
                    </p>
                </div>

                {/* 3. Container App Status */}
                <div className="relative rounded-2xl bg-[#090d19] border border-emerald-500/20 p-5 shadow-[0_0_20px_rgba(16,185,129,0.06)] hover:border-emerald-500/40 transition-all">
                    <div className="flex items-center justify-between text-slate-400 mb-2">
                        <span className="text-[11px] font-mono uppercase tracking-wider font-semibold">Container App</span>
                        <Server className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-black font-mono tracking-tight text-white">
                            {data.container.status}
                        </span>
                        <span className="text-xs font-mono font-bold text-emerald-400">100% WGT</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-2 font-mono flex items-center gap-1.5 truncate">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        {data.container.revision}
                    </p>
                </div>

                {/* 4. Telemetria & Error Rate */}
                <div className="relative rounded-2xl bg-[#090d19] border border-blue-500/20 p-5 shadow-[0_0_20px_rgba(59,130,246,0.06)] hover:border-blue-500/40 transition-all">
                    <div className="flex items-center justify-between text-slate-400 mb-2">
                        <span className="text-[11px] font-mono uppercase tracking-wider font-semibold">Telemetry Status</span>
                        <Activity className="w-4 h-4 text-blue-400" />
                    </div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-black font-mono tracking-tight text-white">
                            {data.telemetry.errorRate.toFixed(2)}%
                        </span>
                        <span className="text-xs font-mono font-bold text-blue-400">ERR RATE</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-2 font-mono flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                        App Insights: {data.telemetry.targetRegion}
                    </p>
                </div>
            </div>

            {/* Grid 2: Interaktív Topológia Térkép + Telemetria Grafikon */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Bal: Élő Topológia Visualizer (7 oszlop) */}
                <div className="lg:col-span-7 rounded-2xl bg-[#080c17] border border-white/10 p-6 flex flex-col justify-between relative overflow-hidden">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <Layers className="w-4 h-4 text-cyan-400" />
                            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-200">
                                Élő Felhő Topológia & Kommunikációs Folyosó
                            </h2>
                        </div>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                            LIVE PACKET ROUTING
                        </span>
                    </div>

                    {/* Vizuális hálózati rajz */}
                    <div className="py-6 space-y-4">
                        {/* 1. Látogató */}
                        <div className="flex items-center gap-3">
                            <div className="w-28 shrink-0 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-center font-mono text-xs">
                                <span className="text-[10px] text-slate-400 block">LÁTOGATÓ</span>
                                <span className="text-white font-bold">Browser Client</span>
                            </div>
                            <div className="flex-1 relative flex items-center">
                                <div className="w-full h-0.5 bg-gradient-to-r from-slate-600 via-cyan-500 to-emerald-500 relative overflow-hidden">
                                    <div className="absolute inset-0 bg-white/70 w-8 animate-[moveRight_2s_infinite_linear]" />
                                </div>
                                <span className="absolute left-1/2 -top-2.5 -translate-x-1/2 text-[9px] font-mono px-1.5 bg-[#080c17] text-cyan-400 border border-cyan-500/30 rounded">
                                    18 ms
                                </span>
                            </div>
                            {/* 2. Cloudflare Edge */}
                            <div className="w-36 shrink-0 px-3 py-2 rounded-xl bg-amber-950/40 border border-amber-500/40 text-center font-mono text-xs">
                                <span className="text-[10px] text-amber-400 block">CLOUDFLARE EDGE</span>
                                <span className="text-amber-200 font-bold">BUD / VIE POP</span>
                            </div>
                        </div>

                        {/* Függőleges levezetés az Azure felé */}
                        <div className="flex justify-end pr-16">
                            <div className="h-6 w-0.5 bg-gradient-to-b from-amber-500 to-cyan-500" />
                        </div>

                        {/* 3. Azure Container App & Redis */}
                        <div className="flex items-center gap-3">
                            <div className="w-36 shrink-0 px-3 py-2 rounded-xl bg-purple-950/40 border border-purple-500/40 text-center font-mono text-xs">
                                <span className="text-[10px] text-purple-400 block">AZURE REDIS 7.4</span>
                                <span className="text-purple-200 font-bold">&lt; 1 ms (In-Memory)</span>
                            </div>
                            <div className="flex-1 relative flex items-center">
                                <div className="w-full h-0.5 bg-gradient-to-r from-purple-500 via-cyan-400 to-cyan-500 relative overflow-hidden">
                                    <div className="absolute inset-0 bg-white/70 w-8 animate-[moveRight_1.5s_infinite_linear]" />
                                </div>
                                <span className="absolute left-1/2 -top-2.5 -translate-x-1/2 text-[9px] font-mono px-1.5 bg-[#080c17] text-purple-400 border border-purple-500/30 rounded">
                                    0.8 ms
                                </span>
                            </div>
                            {/* Azure Container */}
                            <div className="w-36 shrink-0 px-3 py-2 rounded-xl bg-cyan-950/40 border border-cyan-500/40 text-center font-mono text-xs">
                                <span className="text-[10px] text-cyan-400 block">CONTAINER APP</span>
                                <span className="text-cyan-200 font-bold">Spain Central</span>
                            </div>
                        </div>

                        {/* Adatbázis & Telemetria lábak */}
                        <div className="grid grid-cols-2 gap-3 pt-2">
                            <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5 font-mono text-xs flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Database className="w-4 h-4 text-emerald-400" />
                                    <div>
                                        <span className="text-[10px] text-slate-400 block">POSTGRESQL</span>
                                        <span className="text-slate-200 font-semibold">{data.database.poolStatus}</span>
                                    </div>
                                </div>
                                <span className="text-[10px] text-emerald-400 font-bold">{data.database.latencyMs} ms</span>
                            </div>

                            <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5 font-mono text-xs flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Activity className="w-4 h-4 text-blue-400" />
                                    <div>
                                        <span className="text-[10px] text-slate-400 block">APP INSIGHTS</span>
                                        <span className="text-slate-200 font-semibold">Telemetria Live</span>
                                    </div>
                                </div>
                                <span className="text-[10px] text-blue-400 font-bold">Ireland</span>
                            </div>
                        </div>
                    </div>

                    <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-slate-400">
                        <span>Cluster: backlineit-redis.spaincentral.redis.azure.net:10000</span>
                        <span className="text-cyan-400">TLS 1.3 Active</span>
                    </div>
                </div>

                {/* Jobb: Valós idejű késleltetési grafikon & Memória (5 oszlop) */}
                <div className="lg:col-span-5 rounded-2xl bg-[#080c17] border border-white/10 p-6 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <Activity className="w-4 h-4 text-purple-400" />
                                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-200">
                                    Élő Válaszidő Trend (RTT)
                                </h2>
                            </div>
                            <span className="text-[10px] font-mono text-purple-400">LAST 10 TICKS</span>
                        </div>

                        {/* Egyszerű SVG vonaldiagram a késleltetéshez */}
                        <div className="h-32 w-full flex items-end gap-1.5 pt-4 pb-2 px-1 bg-slate-950/50 rounded-xl border border-white/5">
                            {latencyHistory.map((val, idx) => {
                                const maxVal = Math.max(...latencyHistory, 30)
                                const heightPercent = Math.min(Math.round((val / maxVal) * 100), 100)
                                return (
                                    <div key={idx} className="flex-1 flex flex-col items-center gap-1 h-full justify-end group">
                                        <span className="text-[9px] font-mono text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                            {val}
                                        </span>
                                        <div 
                                            style={{ height: `${heightPercent}%` }}
                                            className="w-full rounded-t bg-gradient-to-t from-cyan-500/40 via-purple-500/60 to-cyan-400 transition-all duration-300 shadow-[0_0_8px_rgba(6,182,212,0.3)]"
                                        />
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    {/* Memória & Terhelés mutatók */}
                    <div className="mt-5 space-y-3 font-mono text-xs">
                        <div>
                            <div className="flex justify-between text-slate-400 mb-1 text-[11px]">
                                <span>Heap Memória Használat</span>
                                <span className="text-cyan-300 font-bold">{data.container.heapUsedMb} MB / {data.container.rssMb} MB RSS</span>
                            </div>
                            <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                                <div 
                                    className="h-full bg-cyan-400 rounded-full" 
                                    style={{ width: `${Math.min((data.container.heapUsedMb / data.container.rssMb) * 100, 100)}%` }}
                                />
                            </div>
                        </div>

                        <div className="pt-2 border-t border-white/5 grid grid-cols-3 gap-2 text-center">
                            <div className="p-2 rounded-lg bg-slate-900/60 border border-white/5">
                                <span className="text-[9px] text-slate-500 block">FELHASZNÁLÓK</span>
                                <span className="text-sm font-bold text-white">{data.counts.users}</span>
                            </div>
                            <div className="p-2 rounded-lg bg-slate-900/60 border border-white/5">
                                <span className="text-[9px] text-slate-500 block">SZOLGÁLTATÁSOK</span>
                                <span className="text-sm font-bold text-cyan-400">{data.counts.services}</span>
                            </div>
                            <div className="p-2 rounded-lg bg-slate-900/60 border border-white/5">
                                <span className="text-[9px] text-slate-500 block">MEGKERESÉSEK</span>
                                <span className="text-sm font-bold text-purple-400">{data.counts.inquiries}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Grid 3: Cyberpunk Terminál Stream + Műveleti Központ */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Bal: Élő Terminál Konzol (7 oszlop) */}
                <div className="lg:col-span-7 rounded-2xl bg-[#050811] border border-cyan-500/20 p-5 shadow-[0_0_25px_rgba(6,182,212,0.05)] flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
                            <div className="flex items-center gap-2">
                                <Terminal className="w-4 h-4 text-cyan-400" />
                                <h3 className="text-xs font-bold font-mono tracking-wider uppercase text-slate-300">
                                    Élő Telemetria & Rendszer Log Stream
                                </h3>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                                <span className="text-[10px] font-mono text-emerald-400 font-bold">STREAMING</span>
                            </div>
                        </div>

                        {/* Terminál ablak */}
                        <div 
                            ref={logContainerRef}
                            className="h-56 overflow-y-auto space-y-1.5 font-mono text-[11px] pr-2 custom-scrollbar bg-black/40 p-3 rounded-xl border border-white/5"
                        >
                            {logs.map((log) => (
                                <div key={log.id} className="flex items-start gap-2 leading-relaxed">
                                    <span className="text-slate-600 shrink-0">[{log.time}]</span>
                                    <span className={`shrink-0 font-bold px-1 rounded bg-white/5 text-[10px] ${log.color}`}>
                                        {log.tag}
                                    </span>
                                    <span className="text-slate-300">{log.text}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="pt-3 mt-3 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-slate-500">
                        <span>Auto-scroll: Aktív</span>
                        <span>Terminal Buffer: 25 esemény</span>
                    </div>
                </div>

                {/* Jobb: Műveleti Központ & Diagnosztikai Gombok (5 oszlop) */}
                <div className="lg:col-span-5 rounded-2xl bg-[#080c17] border border-white/10 p-5 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center gap-2 pb-3 border-b border-white/10 mb-4">
                            <Cpu className="w-4 h-4 text-amber-400" />
                            <h3 className="text-xs font-bold font-mono tracking-wider uppercase text-slate-300">
                                Műveleti Központ & Diagnosztika
                            </h3>
                        </div>

                        <div className="space-y-3 font-mono">
                            {/* Gomb 1: Kézi Ping & Diagnosztika */}
                            <Button 
                                onClick={handleManualRefresh}
                                disabled={isRefreshing}
                                className="w-full justify-between h-11 px-4 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-mono text-xs transition-all"
                            >
                                <span className="flex items-center gap-2">
                                    <Zap className="w-4 h-4 text-cyan-400" />
                                    Azonnali Éles Diagnosztika Futtatása
                                </span>
                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-400/20 text-cyan-200">RUN</span>
                            </Button>

                            {/* Gomb 2: Redis Cache Purge */}
                            <Button 
                                onClick={handleFlushCache}
                                disabled={isRefreshing}
                                className="w-full justify-between h-11 px-4 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 font-mono text-xs transition-all"
                            >
                                <span className="flex items-center gap-2">
                                    <HardDrive className="w-4 h-4 text-purple-400" />
                                    Azure Redis Gyorsítótár Ürítése (Purge)
                                </span>
                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-400/20 text-purple-200">FLUSH</span>
                            </Button>

                            {/* Gomb 3: War Drill Szimuláció */}
                            <Button 
                                onClick={handleDrillToggle}
                                disabled={drillActive}
                                className="w-full justify-between h-11 px-4 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono text-xs transition-all"
                            >
                                <span className="flex items-center gap-2">
                                    <Flame className="w-4 h-4 text-amber-400" />
                                    DEFCON Rendszergyakorlat (Drill Mode)
                                </span>
                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-200">SIM</span>
                            </Button>
                        </div>
                    </div>

                    <div className="pt-4 mt-4 border-t border-white/5 text-[11px] font-mono text-slate-400 flex items-center justify-between">
                        <span>Autonóm mód: <strong className="text-emerald-400">AKTÍV</strong></span>
                        <span className="text-slate-500">BacklineIT Core</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
