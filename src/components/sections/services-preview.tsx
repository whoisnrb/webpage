"use client"

import { Code, Server, Shield, ShoppingCart, ArrowRight, Eye, Terminal, Cpu, Zap, Globe, Lock, Activity } from "lucide-react"
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
    const [activeTab, setActiveTab] = useState(0)

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
            className: "md:col-span-2 md:row-span-1",
            color: "rgba(6, 182, 212, 0.25)", // Cyan
            extra: (
                <div className="mt-4 p-4 bg-black/60 rounded-xl border border-primary/20 font-mono text-[10px] space-y-1 overflow-hidden min-h-[120px] relative group-hover:border-primary/50 transition-all duration-500 shadow-2xl">
                    <div className="flex items-center gap-2 mb-2 border-b border-white/10 pb-2">
                        <div className="flex gap-1">
                            <div className="h-1.5 w-1.5 rounded-full bg-red-500/50" />
                            <div className="h-1.5 w-1.5 rounded-full bg-yellow-500/50" />
                            <div className="h-1.5 w-1.5 rounded-full bg-green-500/50" />
                        </div>
                        <span className="text-[8px] text-white/30 uppercase tracking-widest flex-1">Automation Engine v2.0</span>
                    </div>
                    <div className="space-y-1.5">
                        <AnimatePresence>
                            {(terminalLines.length > 0 ? terminalLines : [allLines[0]]).map((line, i) => (
                                <motion.div
                                    key={line + i}
                                    initial={{ opacity: 0, x: -5 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="flex items-center gap-2"
                                >
                                    <span className="text-primary font-bold">{">"}</span>
                                    <span className={cn(
                                        "truncate",
                                        line.includes('Success') ? "text-green-400 font-bold" : "text-primary/80"
                                    )}>{line}</span>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                    <div className="absolute bottom-2 right-2 flex items-center gap-1.5">
                        <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-ping" />
                        <span className="text-[8px] text-green-500/70 uppercase font-bold tracking-tighter">Live Sync</span>
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
            className: "md:col-span-1 md:row-span-2",
            color: "rgba(249, 115, 22, 0.25)", // Orange
            extra: (
                <div className="mt-6 p-4 rounded-xl bg-gradient-to-br from-orange-500/5 to-transparent border border-orange-500/10 h-full flex flex-col justify-between">
                    <div className="flex flex-col items-center justify-center space-y-6 flex-1 py-4">
                        <div className="relative h-32 w-32 group-hover:scale-110 transition-transform duration-700">
                            {/* Pulsating background ring */}
                            <motion.div
                                animate={{ scale: [1, 1.05, 1], opacity: [0.1, 0.2, 0.1] }}
                                transition={{ duration: 4, repeat: Infinity }}
                                className="absolute -inset-4 rounded-full bg-green-500/20 blur-xl"
                            />

                            <svg className="h-full w-full transform -rotate-90 filter drop-shadow-[0_0_10px_rgba(34,197,94,0.3)]" viewBox="0 0 100 100">
                                <circle cx="50" cy="50" r="45" fill="transparent" stroke="currentColor" strokeWidth="6" className="text-white/5" />
                                <motion.circle
                                    cx="50" cy="50" r="45" fill="transparent" stroke="currentColor" strokeWidth="8"
                                    strokeDasharray="283"
                                    initial={{ strokeDashoffset: 283 }}
                                    whileInView={{ strokeDashoffset: 15 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
                                    className="text-green-500"
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center -space-y-1">
                                <motion.span
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.5, delay: 1.5 }}
                                    className="text-4xl font-black text-white"
                                >
                                    98
                                </motion.span>
                                <span className="text-[10px] uppercase font-black text-green-500 tracking-widest">Perf</span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-1.5">
                            <div className="flex justify-between text-[10px] font-bold text-white/50 uppercase">
                                <span>SEO Score</span>
                                <span className="text-orange-400">100%</span>
                            </div>
                            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    whileInView={{ width: '100%' }}
                                    transition={{ duration: 1.5, delay: 1 }}
                                    className="h-full bg-gradient-to-r from-orange-600 to-orange-400 shadow-[0_0_10px_rgba(249,115,22,0.5)]"
                                />
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <div className="flex justify-between text-[10px] font-bold text-white/50 uppercase">
                                <span>Mobile Ready</span>
                                <span className="text-cyan-400">YES</span>
                            </div>
                            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden text-right">
                                <motion.div
                                    initial={{ width: 0 }}
                                    whileInView={{ width: '92%' }}
                                    transition={{ duration: 1.5, delay: 1.2 }}
                                    className="h-full bg-gradient-to-r from-cyan-600 to-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.5)]"
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
            className: "md:col-span-1 md:row-span-1",
            color: "rgba(168, 85, 247, 0.25)", // Purple
            extra: (
                <div className="mt-4 p-4 rounded-xl bg-black/40 border border-white/5 relative overflow-hidden h-28 flex flex-col justify-center">
                    <div className="grid grid-cols-4 gap-3 relative z-10">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                            <div key={i} className="flex flex-col items-center gap-1">
                                <div className="h-8 w-1 bg-white/20 rounded-full relative overflow-hidden">
                                    <motion.div
                                        animate={{ height: ['20%', '80%', '40%', '90%', '20%'] }}
                                        transition={{ duration: 2 + Math.random() * 2, repeat: Infinity, ease: "easeInOut" }}
                                        className="absolute bottom-0 left-0 w-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.8)]"
                                    />
                                </div>
                                <div className={cn(
                                    "h-1.5 w-1.5 rounded-full",
                                    i === 3 ? "bg-red-500 animate-pulse" : "bg-green-500"
                                )} />
                            </div>
                        ))}
                    </div>
                    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-500 via-transparent to-transparent" />
                </div>
            )
        },
        {
            title: t('items.security.title'),
            description: t('items.security.description'),
            benefit: t('items.security.benefit'),
            icon: Lock,
            href: "/szolgaltatasok/biztonsag",
            className: "md:col-span-1 md:row-span-1",
            color: "rgba(239, 68, 68, 0.25)", // Red
            extra: (
                <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-red-500/10 to-blue-500/10 border border-white/5 flex items-center gap-4 group/sec h-28 overflow-hidden relative">
                    <div className="relative z-10 h-16 w-16 shrink-0 flex items-center justify-center">
                        <div className="absolute inset-0 bg-red-500/20 blur-xl group-hover/sec:bg-red-500/40 transition-colors rounded-full" />
                        <Shield className="h-10 w-10 text-red-500 group-hover/sec:scale-110 transition-transform duration-500" />
                    </div>
                    <div className="flex-1 space-y-2 relative z-10">
                        <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest">WAF Active Protection</div>
                        <div className="space-y-1">
                            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                <motion.div animate={{ x: ['-100%', '200%'] }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }} className="h-full w-1/3 bg-gradient-to-r from-transparent via-red-500 to-transparent" />
                            </div>
                            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                <motion.div animate={{ x: ['200%', '-100%'] }} transition={{ duration: 5, repeat: Infinity, ease: "linear" }} className="h-full w-1/4 bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
                            </div>
                        </div>
                    </div>
                    <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center pointer-events-none opacity-20">
                        <div className="h-40 w-40 border border-white/10 rounded-full animate-spin-slow" />
                        <div className="absolute h-32 w-32 border border-white/5 rounded-full animate-reverse-spin-slow" />
                    </div>
                </div>
            )
        },
    ]

    return (
        <section className="py-24 md:py-32 bg-black relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-full">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-primary/5 rounded-full blur-[120px]" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150" />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-4xl mx-auto text-center mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <span className="inline-block px-4 py-1.5 mb-6 text-xs font-black tracking-[0.2em] uppercase rounded-full bg-primary/10 text-primary border border-primary/20">
                            Our Core Expertise
                        </span>
                        <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-8 text-white leading-[1.1]">
                            {t('title_1')} <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-cyan-400 to-blue-600 drop-shadow-[0_0_30px_rgba(6,182,212,0.3)]">{t('title_2')}</span>
                        </h2>
                        <p className="text-white/50 max-w-2xl mx-auto text-lg md:text-xl font-medium">
                            {t('description')}
                        </p>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-6 max-w-7xl mx-auto">
                    {services.map((service, index) => (
                        <motion.div
                            key={index}
                            className={cn("group flex", service.className)}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.8, delay: index * 0.1 }}
                        >
                            <SpotlightCard
                                className="border border-white/5 shadow-2xl hover:border-primary/20 transition-all duration-700 w-full relative overflow-hidden flex flex-col p-8 backdrop-blur-3xl bg-white/[0.03]"
                                spotlightColor={service.color}
                            >
                                <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-10 transition-opacity duration-700 transform translate-x-4 -translate-y-4">
                                    <service.icon size={120} />
                                </div>

                                <div className="flex justify-between items-start mb-8 z-10">
                                    <div className="h-16 w-16 rounded-2xl bg-white/[0.05] border border-white/10 flex items-center justify-center group-hover:scale-110 group-hover:border-primary/50 group-hover:bg-primary/5 transition-all duration-700 shadow-2xl">
                                        <service.icon className="h-8 w-8 text-primary group-hover:text-white transition-colors animate-float" />
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-10 w-10 text-white/30 hover:text-white hover:bg-white/5 opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-xl"
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
                                        <Eye className="h-5 w-5" />
                                    </Button>
                                </div>

                                <div className="flex-1 z-10">
                                    <h3 className="text-2xl font-black mb-3 text-white group-hover:text-primary transition-colors tracking-tight">{service.title}</h3>
                                    <p className="text-base text-white/40 mb-6 font-medium leading-relaxed group-hover:text-white/60 transition-colors">
                                        {service.description}
                                    </p>

                                    <div className="flex items-center text-sm font-black text-primary mb-6 uppercase tracking-widest">
                                        <span className="relative">
                                            {service.benefit}
                                            <span className="absolute -bottom-1 left-0 w-full h-px bg-primary/30 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                                        </span>
                                        <ArrowRight className="ml-2 h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500" />
                                    </div>

                                    {service.extra}
                                </div>

                                <div className="mt-8 z-10">
                                    <Button asChild className="w-full bg-white/[0.05] hover:bg-primary text-white font-black uppercase tracking-tighter border border-white/10 hover:border-transparent transition-all duration-500 h-12 rounded-xl group-hover:shadow-[0_10px_30px_-10px_rgba(6,182,212,0.5)]">
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
                @keyframes spin-slow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                @keyframes reverse-spin-slow {
                    from { transform: rotate(360deg); }
                    to { transform: rotate(0deg); }
                }
                .animate-spin-slow {
                    animation: spin-slow 20s linear infinite;
                }
                .animate-reverse-spin-slow {
                    animation: reverse-spin-slow 15s linear infinite;
                }
                .animate-float {
                    animation: float 3s ease-in-out infinite;
                }
                @keyframes float {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-5px); }
                }
            `}</style>
        </section>
    )
}
