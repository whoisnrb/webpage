"use client"

import { Code, Server, Shield, ShoppingCart, ArrowRight, Eye, Terminal, Cpu, Zap, Globe, Lock, Activity, Sparkles, Database, BarChart3, Layers } from "lucide-react"
import { Link } from "@/i18n/routing"
import { useTranslations } from "next-intl"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { QuickViewModal } from "@/components/ui/quick-view-modal"
import { cn } from "@/lib/utils"
import { SpotlightCard } from "@/components/ui/spotlight-card"
import { motion, AnimatePresence } from "framer-motion"

export function ServicesPreview() {
    const t = useTranslations('ServicesPreview')
    const tQuickView = useTranslations('QuickView')
    const [selectedService, setSelectedService] = useState<any | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)

    // Automation terminal lines
    const [terminalLines, setTerminalLines] = useState<string[]>([])
    const allLines = [
        '[16:54:20] FETCH orders FROM simplepay...',
        '[16:54:21] PARSING 12 items...',
        '[16:54:23] SYNCED with "Marketing DB"',
        '[16:54:25] SENDING webhook to n8n...',
        '[16:54:26] DONE: Success'
    ]

    useEffect(() => {
        const interval = setInterval(() => {
            setTerminalLines(prev => {
                if (prev.length >= allLines.length) return [allLines[0]]
                return [...prev, allLines[prev.length]]
            })
        }, 2000)
        return () => clearInterval(interval)
    }, [])

    const services = [
        {
            title: t('items.automation.title'),
            description: t('items.automation.description'),
            benefit: t('items.automation.benefit'),
            icon: Cpu,
            href: "/szolgaltatasok/scriptek",
            className: "md:col-span-8 md:row-span-1",
            color: "rgba(6, 182, 212, 0.2)",
            extra: (
                <div className="mt-auto pt-6">
                    <div className="p-4 bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 font-mono text-[11px] space-y-2 overflow-hidden min-h-[140px] relative group-hover:border-primary/40 transition-all duration-700 shadow-2xl">
                        <div className="flex items-center gap-2 mb-3 border-b border-white/10 pb-2">
                            <div className="flex gap-1.5">
                                <div className="h-2 w-2 rounded-full bg-red-500/40" />
                                <div className="h-2 w-2 rounded-full bg-yellow-500/40" />
                                <div className="h-2 w-2 rounded-full bg-green-500/40" />
                            </div>
                            <span className="text-[9px] text-white/40 uppercase tracking-[0.2em] flex-1 font-bold">Core.Engine.v4.0_Stable</span>
                            <div className="flex items-center gap-1 opacity-50">
                                <Activity className="h-3 w-3 text-primary animate-pulse" />
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <AnimatePresence mode="popLayout">
                                {terminalLines.map((line, i) => (
                                    <motion.div
                                        key={line + i}
                                        initial={{ opacity: 0, x: -10, filter: "blur(5px)" }}
                                        animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                                        className="flex items-center gap-2"
                                    >
                                        <span className="text-primary/60 font-black">{">"}</span>
                                        <span className={cn(
                                            "truncate tracking-tight",
                                            line.includes('Success') ? "text-emerald-400 font-bold drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]" : "text-white/70"
                                        )}>{line}</span>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                        <div className="absolute bottom-3 right-4 flex items-center gap-2 bg-emerald-500/10 px-2 py-1 rounded-full border border-emerald-500/20">
                            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[9px] text-emerald-400 uppercase font-black tracking-tighter">Live Process</span>
                        </div>
                    </div>
                </div>
            )
        },
        {
            title: t('items.webdev.title'),
            description: t('items.webdev.description'),
            benefit: t('items.webdev.benefit'),
            icon: Globe,
            href: "/szolgaltatasok/webfejlesztes",
            className: "md:col-span-4 md:row-span-2",
            color: "rgba(249, 115, 22, 0.2)",
            extra: (
                <div className="mt-8 flex-1 flex flex-col justify-between">
                    <div className="relative h-48 w-full group/perf flex items-center justify-center">
                        {/* Complex animated rings */}
                        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-center">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                className="h-40 w-40 border border-white/5 rounded-full border-t-orange-500/40"
                            />
                        </div>
                        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-center">
                            <motion.div
                                animate={{ rotate: -360 }}
                                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                                className="h-32 w-32 border border-white/5 rounded-full border-b-cyan-500/40"
                            />
                        </div>

                        <div className="relative z-10 text-center">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                className="text-6xl font-black text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                            >
                                99
                            </motion.div>
                            <div className="text-xs uppercase font-black text-orange-500 tracking-[0.3em] mt-1">Lighthouse</div>
                        </div>
                    </div>

                    <div className="space-y-5 pt-6">
                        <div className="space-y-2">
                            <div className="flex justify-between text-[10px] font-black text-white/30 uppercase tracking-widest">
                                <span>UX Performance</span>
                                <span className="text-orange-400">OPTIMIZED</span>
                            </div>
                            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden p-[1px] border border-white/10">
                                <motion.div
                                    initial={{ width: 0 }}
                                    whileInView={{ width: '98%' }}
                                    transition={{ duration: 2, ease: "circOut" }}
                                    className="h-full bg-gradient-to-r from-orange-600 via-orange-400 to-amber-300 rounded-full shadow-[0_0_15px_rgba(249,115,22,0.4)]"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-[10px] font-black text-white/30 uppercase tracking-widest">
                                <span>SEO Strength</span>
                                <span className="text-cyan-400">MAXIMUM</span>
                            </div>
                            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden p-[1px] border border-white/10">
                                <motion.div
                                    initial={{ width: 0 }}
                                    whileInView={{ width: '100%' }}
                                    transition={{ duration: 2, ease: "circOut", delay: 0.2 }}
                                    className="h-full bg-gradient-to-r from-cyan-600 via-cyan-400 to-blue-300 rounded-full shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )
        },
        {
            title: t('items.devops.title'),
            description: t('items.devops.description'),
            benefit: t('items.devops.benefit'),
            icon: Activity,
            href: "/szolgaltatasok/rendszeruzemeltetes",
            className: "md:col-span-4 md:row-span-1",
            color: "rgba(168, 85, 247, 0.2)",
            extra: (
                <div className="mt-auto h-32 relative overflow-hidden rounded-2xl bg-black/40 border border-white/5 p-4 flex flex-col justify-end">
                    <div className="flex items-end justify-between gap-1 h-full mb-2">
                        {[40, 70, 45, 90, 65, 30, 85, 50, 75, 40, 60, 35].map((h, i) => (
                            <motion.div
                                key={i}
                                initial={{ height: 0 }}
                                animate={{ height: `${h}%` }}
                                transition={{
                                    duration: 1,
                                    delay: i * 0.05,
                                    repeat: Infinity,
                                    repeatType: "reverse",
                                    ease: "easeInOut"
                                }}
                                className="flex-1 rounded-t-[2px] bg-gradient-to-t from-purple-600/50 to-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.3)]"
                            />
                        ))}
                    </div>
                    <div className="flex justify-between items-center text-[9px] font-black text-purple-400/70 uppercase tracking-tighter">
                        <span>Cluster Status: Active</span>
                        <span>0.4ms Latency</span>
                    </div>
                </div>
            )
        },
        {
            title: t('items.security.title'),
            description: t('items.security.description'),
            benefit: t('items.security.benefit'),
            icon: Lock,
            href: "/szolgaltatasok/biztonsag",
            className: "md:col-span-4 md:row-span-1",
            color: "rgba(239, 68, 68, 0.2)",
            extra: (
                <div className="mt-auto h-32 relative overflow-hidden rounded-2xl bg-gradient-to-br from-red-500/5 to-blue-500/5 border border-white/5 p-4 flex items-center justify-center group/lock">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/[0.03] via-transparent to-transparent" />
                    <motion.div
                        animate={{
                            scale: [1, 1.05, 1],
                            rotate: [0, 2, -2, 0]
                        }}
                        transition={{ duration: 4, repeat: Infinity }}
                        className="relative z-10"
                    >
                        <div className="h-16 w-16 rounded-3xl bg-white/[0.03] border border-white/10 flex items-center justify-center shadow-2xl backdrop-blur-md group-hover/lock:border-red-500/50 transition-colors duration-500">
                            <Shield className="h-8 w-8 text-red-500/80 drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]" />
                        </div>
                    </motion.div>

                    <div className="absolute top-3 right-4">
                        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-red-500/10 border border-red-500/20">
                            <span className="text-[8px] font-black text-red-400 uppercase tracking-tighter">SSL / AES-256</span>
                        </div>
                    </div>

                    {/* Decorative scanning line */}
                    <motion.div
                        animate={{ top: ['0%', '100%'], opacity: [0, 1, 0] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        className="absolute left-0 w-full h-px bg-gradient-to-r from-transparent via-red-500/50 to-transparent z-0"
                    />
                </div>
            )
        },
    ]

    return (
        <section className="py-24 md:py-32 relative overflow-hidden">
            {/* Ultra-luxury background elements */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[140px] opacity-40 animate-pulse" />
                <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-[120px] opacity-30" />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-4xl mx-auto text-center mb-24">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 text-[10px] font-black tracking-[0.4em] uppercase rounded-full bg-white/[0.03] text-primary border border-white/10 backdrop-blur-xl shadow-[0_0_20px_rgba(6,182,212,0.2)]">
                            <Sparkles className="h-3 w-3 animate-spin-slow text-cyan-400" />
                            Premium Intelligence
                        </div>
                        <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 text-white leading-[0.95] perspective-1000">
                            {t('title_1')} <br />
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-cyan-300 to-blue-500 drop-shadow-[0_0_40px_rgba(6,182,212,0.4)]">
                                {t('title_2')}
                            </span>
                        </h2>
                        <p className="text-white/40 max-w-2xl mx-auto text-lg md:text-xl font-medium leading-relaxed">
                            {t('description')}
                        </p>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 auto-rows-auto gap-6 max-w-7xl mx-auto">
                    {services.map((service, index) => (
                        <motion.div
                            key={index}
                            className={cn("group flex h-full", service.className)}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 1, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <SpotlightCard
                                className="border border-white/10 shadow-3xl hover:border-primary/40 transition-all duration-1000 w-full relative overflow-hidden flex flex-col p-8 md:p-10 backdrop-blur-3xl bg-white/[0.015] rounded-[2.5rem]"
                                spotlightColor={service.color}
                            >
                                {/* Decorative elements */}
                                <div className="absolute -top-10 -right-10 h-40 w-40 bg-primary/5 blur-[50px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000 rounded-full pointer-events-none" />

                                <div className="flex justify-between items-start mb-10 z-10 relative">
                                    <div className="h-20 w-20 rounded-[1.5rem] bg-white/[0.03] border border-white/10 flex items-center justify-center group-hover:scale-110 group-hover:border-primary/60 group-hover:bg-primary/10 transition-all duration-1000 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)]">
                                        <service.icon className="h-10 w-10 text-primary group-hover:text-white transition-all duration-700 animate-float" />
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-12 w-12 text-white/20 hover:text-white hover:bg-white/5 opacity-0 group-hover:opacity-100 transition-all duration-700 rounded-2xl border border-white/10"
                                        onClick={() => {
                                            setSelectedService({
                                                ...service,
                                                id: `service-${index}`,
                                                type: 'service',
                                                slug: service.href
                                            })
                                            setIsModalOpen(true)
                                        }}
                                    >
                                        <Eye className="h-6 w-6" />
                                    </Button>
                                </div>

                                <div className="flex-1 z-10 flex flex-col relative">
                                    <h3 className="text-3xl font-black mb-4 text-white group-hover:text-primary transition-all duration-700 tracking-tighter leading-none">{service.title}</h3>
                                    <p className="text-lg text-white/40 mb-8 font-medium leading-relaxed group-hover:text-white/70 transition-all duration-1000">
                                        {service.description}
                                    </p>

                                    <div className="flex items-center text-xs font-black text-primary mb-8 uppercase tracking-[0.3em] group-hover:tracking-[0.4em] transition-all duration-700">
                                        <span className="relative">
                                            {service.benefit}
                                            <span className="absolute -bottom-2 left-0 w-full h-[2px] bg-gradient-to-r from-primary to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left" />
                                        </span>
                                        <ArrowRight className="ml-3 h-5 w-5 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-1000" />
                                    </div>

                                    {service.extra}
                                </div>

                                <div className="mt-10 z-10 relative">
                                    <Button asChild className="w-full bg-white/[0.03] hover:bg-primary text-white font-black uppercase tracking-[0.1em] border border-white/10 hover:border-transparent transition-all duration-700 h-14 rounded-2xl group-hover:scale-[1.02] active:scale-[0.98] group-hover:shadow-[0_20px_50px_-10px_rgba(6,182,212,0.4)]">
                                        <Link href={service.href}>
                                            {tQuickView('details')}
                                        </Link>
                                    </Button>
                                </div>
                            </SpotlightCard>
                        </motion.div>
                    ))}
                </div>
            </div>

            <QuickViewModal
                isOpen={isModalOpen}
                onOpenChange={setIsModalOpen}
                data={selectedService}
            />

            <style jsx global>{`
                .perspective-1000 {
                    perspective: 1000px;
                }
                @keyframes spin-slow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .animate-spin-slow {
                    animation: spin-slow 12s linear infinite;
                }
                .animate-float {
                    animation: float 4s ease-in-out infinite;
                }
                @keyframes float {
                    0%, 100% { transform: translateY(0) rotate(0deg); }
                    50% { transform: translateY(-10px) rotate(2deg); }
                }
            `}</style>
        </section>
    )
}
