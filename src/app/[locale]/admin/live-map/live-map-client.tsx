'use client'

import { useState, useEffect, useRef } from "react"
import { 
    Globe, MapPin, Eye, Monitor, Smartphone, Navigation, 
    Layers, Zap, RefreshCw, Radio, Flame, ArrowUpRight
} from "lucide-react"
import { LiveTrafficData, VisitorSession, getLiveTrafficData } from "@/app/actions/live-traffic"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function LiveMapClient({ initialData }: { initialData: LiveTrafficData }) {
    const [data, setData] = useState<LiveTrafficData>(initialData)
    const [selectedVisitor, setSelectedVisitor] = useState<VisitorSession | null>(initialData.visitors[0] || null)
    const [viewMode, setViewMode] = useState<'3D' | '2D'>('3D')
    const [autoRotate, setAutoRotate] = useState(true)
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [lastSyncTime, setLastSyncTime] = useState<string>("Épp most")
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const rotationRef = useRef<number>(0.3)

    const refreshTraffic = async () => {
        try {
            setIsRefreshing(true)
            const fresh = await getLiveTrafficData()
            setData(fresh)
            setLastSyncTime(new Date().toLocaleTimeString('hu-HU'))
            if (selectedVisitor) {
                const match = fresh.visitors.find(v => v.id === selectedVisitor.id)
                if (match) setSelectedVisitor(match)
                else if (fresh.visitors.length > 0) setSelectedVisitor(fresh.visitors[0])
            } else if (fresh.visitors.length > 0) {
                setSelectedVisitor(fresh.visitors[0])
            }
        } catch (e) {
            console.error("Traffic refresh error:", e)
        } finally {
            setIsRefreshing(false)
        }
    }

    // Automatikus háttér szinkronizáció 8 másodpercenként
    useEffect(() => {
        const interval = setInterval(() => {
            refreshTraffic()
        }, 8000)
        return () => clearInterval(interval)
    }, [selectedVisitor])

    // 3D Canvas Globe Renderelése
    useEffect(() => {
        if (viewMode !== '3D') return
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        let animationFrameId: number

        const render = () => {
            const width = canvas.width
            const height = canvas.height
            const centerX = width / 2
            const centerY = height / 2
            const radius = Math.min(width, height) * 0.38

            ctx.clearRect(0, 0, width, height)

            if (autoRotate) {
                rotationRef.current += 0.003
            }
            const rot = rotationRef.current

            // 1. Külső atmoszféra ragyogás
            const atmosGrad = ctx.createRadialGradient(centerX, centerY, radius * 0.85, centerX, centerY, radius * 1.15)
            atmosGrad.addColorStop(0, 'rgba(6, 182, 212, 0.12)')
            atmosGrad.addColorStop(0.5, 'rgba(6, 182, 212, 0.05)')
            atmosGrad.addColorStop(1, 'rgba(6, 182, 212, 0)')
            ctx.fillStyle = atmosGrad
            ctx.beginPath()
            ctx.arc(centerX, centerY, radius * 1.15, 0, Math.PI * 2)
            ctx.fill()

            // 2. Földgömb alapszín & árnyék
            const globeGrad = ctx.createRadialGradient(centerX - radius * 0.3, centerY - radius * 0.3, radius * 0.1, centerX, centerY, radius)
            globeGrad.addColorStop(0, '#0d1527')
            globeGrad.addColorStop(0.7, '#070b16')
            globeGrad.addColorStop(1, '#03050c')
            ctx.fillStyle = globeGrad
            ctx.beginPath()
            ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
            ctx.fill()
            ctx.strokeStyle = 'rgba(6, 182, 212, 0.35)'
            ctx.lineWidth = 1.5
            ctx.stroke()

            // 3. Földrajzi szélességi és hosszúsági körök (Wireframe Grid)
            ctx.strokeStyle = 'rgba(6, 182, 212, 0.15)'
            ctx.lineWidth = 1

            // Szélességi körök
            for (let lat = -60; lat <= 60; lat += 30) {
                const latRad = (lat * Math.PI) / 180
                const y = centerY - Math.sin(latRad) * radius
                const rLat = Math.cos(latRad) * radius
                ctx.beginPath()
                ctx.ellipse(centerX, y, rLat, rLat * 0.25, 0, 0, Math.PI * 2)
                ctx.stroke()
            }

            // Hosszúsági körök
            for (let lng = 0; lng < 360; lng += 45) {
                const lngRad = ((lng + rot * 180 / Math.PI) * Math.PI) / 180
                const xOffset = Math.sin(lngRad) * radius
                const isFront = Math.cos(lngRad) > 0

                ctx.strokeStyle = isFront ? 'rgba(6, 182, 212, 0.2)' : 'rgba(6, 182, 212, 0.05)'
                ctx.beginPath()
                ctx.ellipse(centerX, centerY, Math.abs(xOffset), radius, 0, 0, Math.PI * 2)
                ctx.stroke()
            }

            // 4. Látogatói pontok vetítése a gömbre
            data.visitors.forEach((v) => {
                const latRad = (v.lat * Math.PI) / 180
                const lngRad = ((v.lng + rot * 180 / Math.PI) * Math.PI) / 180

                // 3D pozíció számítás
                const cosLat = Math.cos(latRad)
                const sinLat = Math.sin(latRad)
                const cosLng = Math.cos(lngRad)
                const sinLng = Math.sin(lngRad)

                // Csak az elülső féltekén jelenítjük meg
                if (cosLng > -0.2) {
                    const x = centerX + sinLng * cosLat * radius
                    const y = centerY - sinLat * radius

                    const isSelected = selectedVisitor?.id === v.id

                    // Pulzáló körök
                    ctx.beginPath()
                    ctx.arc(x, y, isSelected ? 8 : 4.5, 0, Math.PI * 2)
                    ctx.fillStyle = isSelected ? '#38bdf8' : '#06b6d4'
                    ctx.shadowColor = '#06b6d4'
                    ctx.shadowBlur = isSelected ? 16 : 8
                    ctx.fill()
                    ctx.shadowBlur = 0

                    if (isSelected) {
                        ctx.beginPath()
                        ctx.arc(x, y, 14, 0, Math.PI * 2)
                        ctx.strokeStyle = 'rgba(56, 189, 248, 0.6)'
                        ctx.lineWidth = 1.5
                        ctx.stroke()

                        // Város felirat a pont felett
                        ctx.font = 'bold 11px monospace'
                        ctx.fillStyle = '#ffffff'
                        ctx.fillText(`${v.city} (${v.flag})`, x + 16, y + 4)
                    }
                }
            })

            animationFrameId = requestAnimationFrame(render)
        }

        render()

        return () => cancelAnimationFrame(animationFrameId)
    }, [viewMode, autoRotate, data.visitors, selectedVisitor])

    const handleSimulateVisitor = () => {
        const newCities = [
            { city: 'Székesfehérvár', lat: 47.1899, lng: 18.4107, page: '/szolgaltatasok', device: 'Desktop' },
            { city: 'Miskolc', lat: 48.1035, lng: 20.7784, page: '/megoldasok', device: 'Mobile' },
            { city: 'Kecskemét', lat: 46.9074, lng: 19.6917, page: '/kapcsolat', device: 'Desktop' },
            { city: 'Berlin', lat: 52.5200, lng: 13.4050, page: '/en', device: 'Desktop' },
        ]
        const randomCity = newCities[Math.floor(Math.random() * newCities.length)]
        const newV: VisitorSession = {
            id: 'v-' + Date.now(),
            city: randomCity.city,
            country: 'Magyarország',
            countryCode: 'HU',
            flag: '🇭🇺',
            lat: randomCity.lat,
            lng: randomCity.lng,
            page: randomCity.page,
            device: randomCity.device,
            referrer: 'Közvetlen (Direct)',
            timeOnSite: '10mp',
            status: 'ACTIVE'
        }
        setData(prev => ({
            ...prev,
            totalActiveVisitors: prev.totalActiveVisitors + 1,
            visitors: [newV, ...prev.visitors]
        }))
        setSelectedVisitor(newV)
    }

    return (
        <div className="space-y-6">
            {/* Header & KPI kártyák */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-[#090d16]/40 border border-white/5 p-6 rounded-2xl backdrop-blur-sm">
                <div>
                    <div className="flex items-center gap-2">
                        <Globe className="w-6 h-6 text-cyan-400 animate-pulse" />
                        <h2 className="text-2xl font-bold tracking-tight text-white uppercase tracking-wider">
                            Élő Látogatói Térkép & Forgalom
                        </h2>
                    </div>
                    <p className="text-slate-400 text-sm mt-1">
                        Valós idejű globális és hazai forgalomfigyelés interaktív 3D vizualizációval.
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 font-mono text-[11px]">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                        </span>
                        <span>Élő szinkron: <strong className="text-white">{lastSyncTime}</strong></span>
                    </div>

                    <div className="flex items-center gap-2 bg-[#060913] border border-white/10 p-1 rounded-xl text-xs font-mono">
                        <button
                            onClick={() => setViewMode('3D')}
                            className={`px-3 py-1.5 rounded-lg transition-all ${
                                viewMode === '3D' ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30' : 'text-slate-400 hover:text-white'
                            }`}
                        >
                            3D Földgömb
                        </button>
                        <button
                            onClick={() => setViewMode('2D')}
                            className={`px-3 py-1.5 rounded-lg transition-all ${
                                viewMode === '2D' ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30' : 'text-slate-400 hover:text-white'
                            }`}
                        >
                            Közép-Európa Radar
                        </button>
                    </div>

                    <Button
                        size="sm"
                        variant="outline"
                        onClick={refreshTraffic}
                        disabled={isRefreshing}
                        className="h-9 px-3 rounded-xl bg-white/5 border-white/10 hover:bg-white/10 text-white text-xs gap-1.5 font-mono cursor-pointer"
                    >
                        <RefreshCw className={cn("w-3.5 h-3.5 text-cyan-400", isRefreshing && "animate-spin")} />
                        <span>Frissítés</span>
                    </Button>

                    <Button
                        size="sm"
                        onClick={handleSimulateVisitor}
                        className="h-9 px-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 hover:bg-cyan-500/20 text-cyan-300 text-xs gap-1.5 font-mono cursor-pointer"
                    >
                        <Zap className="w-3.5 h-3.5" />
                        Látogató Szimulálása
                    </Button>
                </div>
            </div>

            {/* Fő mutatók (3 kártya) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-5 rounded-2xl bg-[#070b16] border border-cyan-500/20">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block mb-1">
                        Jelenlegi Aktív Látogatók
                    </span>
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-black font-mono text-cyan-400">{data.totalActiveVisitors}</span>
                        <span className="text-xs font-mono text-emerald-400 animate-pulse">● ÉLŐBEN</span>
                    </div>
                </div>

                <div className="p-5 rounded-2xl bg-[#070b16] border border-purple-500/20">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block mb-1">
                        Mai Forgalmi Csúcs (Peak)
                    </span>
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-black font-mono text-purple-300">{data.peakToday}</span>
                        <span className="text-xs font-mono text-slate-500">látogató / óra</span>
                    </div>
                </div>

                <div className="p-5 rounded-2xl bg-[#070b16] border border-emerald-500/20">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block mb-1">
                        Átlagos Munkamenet Idő
                    </span>
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-black font-mono text-emerald-400">
                            {Math.floor(data.avgDurationSec / 60)}p {data.avgDurationSec % 60}mp
                        </span>
                        <span className="text-xs font-mono text-slate-500">átlag</span>
                    </div>
                </div>
            </div>

            {/* Fő Térkép & Részletek Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Bal oldal: 3D Globe vagy 2D Radar (7 oszlop) */}
                <div className="lg:col-span-7 rounded-2xl bg-[#070b16] border border-cyan-500/20 p-6 flex flex-col items-center justify-center relative min-h-[460px] overflow-hidden shadow-[0_0_30px_rgba(6,182,212,0.05)]">
                    <div className="absolute top-4 left-4 z-10 flex items-center gap-2 text-xs font-mono text-slate-400">
                        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                        <span>RADAR SCANNING: {data.visitors.length} CSOMÓPONT</span>
                    </div>

                    <div className="absolute top-4 right-4 z-10">
                        <button
                            onClick={() => setAutoRotate(!autoRotate)}
                            className="text-[11px] font-mono px-2 py-1 rounded bg-slate-900 border border-white/10 text-slate-400 hover:text-white"
                        >
                            Forgatás: {autoRotate ? 'BE' : 'KI'}
                        </button>
                    </div>

                    {viewMode === '3D' ? (
                        <div className="relative w-full h-[400px] flex items-center justify-center">
                            <canvas
                                ref={canvasRef}
                                width={500}
                                height={400}
                                className="max-w-full cursor-grab active:cursor-grabbing"
                                onMouseDown={() => setAutoRotate(false)}
                                onMouseUp={() => setAutoRotate(true)}
                            />
                        </div>
                    ) : (
                        /* 2D Közép-Európa Térkép Mód */
                        <div className="w-full h-[400px] flex flex-col justify-center items-center relative bg-[radial-gradient(#06b6d415_1px,transparent_1px)] bg-[size:16px_16px]">
                            <div className="text-center space-y-2 mb-6">
                                <span className="text-xs font-mono font-bold text-cyan-400 tracking-wider">
                                    KÖZÉP-EURÓPA & MAGYARORSZÁG KÖRZET
                                </span>
                                <p className="text-[11px] text-slate-400 font-mono">
                                    Aktív koncentráció: Budapest (62%), Debrecen (14%), Győr (10%), Régió (14%)
                                </p>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full max-w-lg">
                                {data.visitors.map((v) => (
                                    <div
                                        key={v.id}
                                        onClick={() => setSelectedVisitor(v)}
                                        className={`p-3 rounded-xl border text-xs font-mono cursor-pointer transition-all ${
                                            selectedVisitor?.id === v.id
                                                ? 'bg-cyan-500/20 border-cyan-500 text-white shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                                                : 'bg-slate-900/60 border-white/5 text-slate-300 hover:border-white/20'
                                        }`}
                                    >
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="font-bold flex items-center gap-1">
                                                {v.flag} {v.city}
                                            </span>
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                        </div>
                                        <span className="text-[10px] text-slate-400 block truncate">{v.page}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Alsó lábléc */}
                    <div className="w-full pt-3 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-slate-500">
                        <span>Hálózati réteg: Cloudflare BUD/VIE Anycast</span>
                        <span className="text-cyan-400 font-semibold">{data.visitors.length} aktív kapcsolat</span>
                    </div>
                </div>

                {/* Jobb oldal: Kiválasztott Látogató Adatlapja & Legnépszerűbb Oldalak (5 oszlop) */}
                <div className="lg:col-span-5 space-y-6">
                    {/* Kiválasztott látogató kártya */}
                    {selectedVisitor && (
                        <div className="p-5 rounded-2xl bg-[#070b16] border border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.08)] space-y-4">
                            <div className="flex items-center justify-between pb-3 border-b border-white/5">
                                <div className="flex items-center gap-2">
                                    <span className="text-2xl">{selectedVisitor.flag}</span>
                                    <div>
                                        <h3 className="font-bold text-white text-sm">
                                            {selectedVisitor.city}, {selectedVisitor.country}
                                        </h3>
                                        <span className="text-[10px] font-mono text-slate-400">
                                            Session ID: {selectedVisitor.id}
                                        </span>
                                    </div>
                                </div>
                                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold border border-emerald-500/30">
                                    AKTÍV
                                </span>
                            </div>

                            <div className="space-y-2.5 font-mono text-xs">
                                <div className="flex justify-between p-2 rounded-lg bg-slate-900/60 border border-white/5">
                                    <span className="text-slate-400">Jelenlegi Oldal:</span>
                                    <span className="text-cyan-300 font-bold truncate max-w-[200px]">
                                        {selectedVisitor.page}
                                    </span>
                                </div>
                                <div className="flex justify-between p-2 rounded-lg bg-slate-900/60 border border-white/5">
                                    <span className="text-slate-400">Eszköz:</span>
                                    <span className="text-white">{selectedVisitor.device}</span>
                                </div>
                                <div className="flex justify-between p-2 rounded-lg bg-slate-900/60 border border-white/5">
                                    <span className="text-slate-400">Forrás / Referrer:</span>
                                    <span className="text-purple-300">{selectedVisitor.referrer}</span>
                                </div>
                                <div className="flex justify-between p-2 rounded-lg bg-slate-900/60 border border-white/5">
                                    <span className="text-slate-400">Oldalon Töltött Idő:</span>
                                    <span className="text-emerald-400 font-bold">{selectedVisitor.timeOnSite}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Top Oldalak Rangsora */}
                    <div className="p-5 rounded-2xl bg-[#070b16] border border-white/5 space-y-3">
                        <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold block">
                            Leglátogatottabb Oldalak (Ma)
                        </span>
                        <div className="space-y-2 font-mono text-xs">
                            {data.topPages.map((tp, idx) => (
                                <div key={tp.page} className="flex items-center justify-between p-2 rounded-lg bg-slate-900/40 border border-white/5">
                                    <div className="flex items-center gap-2 truncate">
                                        <span className="text-[10px] font-bold text-cyan-400 w-4">#{idx + 1}</span>
                                        <span className="text-slate-300 truncate">{tp.page}</span>
                                    </div>
                                    <span className="text-white font-bold shrink-0">{tp.count} megtekintés</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Alsó táblázat: Élő látogatói munkamenetek */}
            <div className="rounded-2xl border border-white/5 bg-[#070b16] overflow-hidden">
                <div className="p-4 border-b border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
                        <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                            Aktív Látogatói Munkamenetek Listája
                        </h3>
                    </div>
                    <span className="text-[11px] font-mono text-slate-400">
                        {data.visitors.length} aktív kapcsolat
                    </span>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs font-sans">
                        <thead className="bg-[#0b101e] border-b border-white/5 text-[11px] font-mono uppercase tracking-wider text-slate-400">
                            <tr>
                                <th className="p-3.5">Helyszín</th>
                                <th className="p-3.5">Megtekintett Oldal</th>
                                <th className="p-3.5">Eszköz</th>
                                <th className="p-3.5">Forrás</th>
                                <th className="p-3.5 text-right">Időtartam</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 font-mono text-[11px] text-slate-300">
                            {data.visitors.map((v) => (
                                <tr 
                                    key={v.id} 
                                    onClick={() => setSelectedVisitor(v)}
                                    className={`cursor-pointer transition-colors ${
                                        selectedVisitor?.id === v.id ? 'bg-cyan-500/10' : 'hover:bg-white/[0.02]'
                                    }`}
                                >
                                    <td className="p-3.5 flex items-center gap-2">
                                        <span className="text-base">{v.flag}</span>
                                        <span className="font-bold text-white">{v.city}</span>
                                        <span className="text-slate-500">({v.countryCode})</span>
                                    </td>
                                    <td className="p-3.5 text-cyan-300 font-semibold">{v.page}</td>
                                    <td className="p-3.5 text-slate-400">{v.device}</td>
                                    <td className="p-3.5 text-purple-300">{v.referrer}</td>
                                    <td className="p-3.5 text-right text-emerald-400 font-bold">{v.timeOnSite}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
