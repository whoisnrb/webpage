"use client"

import { Button } from '@/components/ui/button'
import { Link } from '@/i18n/routing'
import { useTranslations } from 'next-intl'
import { Shield, Wifi, Lock, Network, Activity } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'

// --- Live Network Topology Visualization ---
function NetworkTopologyViz() {
    const [activeLink, setActiveLink] = useState(0)
    const [packetPos, setPacketPos] = useState(0)
    const [threatDetected, setThreatDetected] = useState(false)
    const [logLines, setLogLines] = useState<string[]>([])

    const allLogLines = [
        'VPN tunnel established → Router',
        'VLAN 10 (Office) traffic: OK',
        'Firewall: 3 threats blocked',
        'WireGuard: 5 peers connected',
        'VLAN 20 (Guest) isolated',
        'QoS rules applied: OK',
    ]

    // Cycle active data link
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveLink(prev => (prev + 1) % 5)
            setPacketPos(prev => (prev + 1) % 4)
        }, 1800)
        return () => clearInterval(interval)
    }, [])

    // Simulate threat detection
    useEffect(() => {
        const interval = setInterval(() => {
            setThreatDetected(true)
            setTimeout(() => setThreatDetected(false), 1200)
        }, 5000)
        return () => clearInterval(interval)
    }, [])

    // Cycle log lines
    useEffect(() => {
        const interval = setInterval(() => {
            setLogLines(prev => {
                const next = allLogLines[(prev.length) % allLogLines.length]
                if (prev.length >= 3) return [next]
                return [...prev, next]
            })
        }, 2200)
        return () => clearInterval(interval)
    }, [])

    const nodes = [
        { id: 'internet', x: 50, y: 12, label: 'Internet', icon: '🌐', color: '#06b6d4' },
        { id: 'firewall', x: 50, y: 35, label: 'Firewall', icon: '🛡️', color: '#f59e0b', highlight: threatDetected },
        { id: 'router', x: 50, y: 58, label: 'Router', icon: '📡', color: '#8b5cf6' },
        { id: 'office', x: 18, y: 80, label: 'Iroda VLAN', icon: '💼', color: '#10b981' },
        { id: 'guest', x: 50, y: 80, label: 'Vendég VLAN', icon: '👥', color: '#06b6d4' },
        { id: 'vpn', x: 82, y: 80, label: 'VPN Kliens', icon: '🔒', color: '#f43f5e' },
    ]

    const links = [
        { from: 0, to: 1 },
        { from: 1, to: 2 },
        { from: 2, to: 3 },
        { from: 2, to: 4 },
        { from: 2, to: 5 },
    ]

    return (
        <div className="relative w-full h-full flex flex-col gap-3">
            {/* SVG Topology */}
            <div className="relative flex-1 bg-black/30 border border-white/10 rounded-2xl overflow-hidden p-2">
                {/* Header bar */}
                <div className="flex items-center gap-2 mb-2 px-1">
                    <div className="flex gap-1">
                        <div className="h-2 w-2 rounded-full bg-red-500/50" />
                        <div className="h-2 w-2 rounded-full bg-yellow-500/50" />
                        <div className="h-2 w-2 rounded-full bg-green-500/50" />
                    </div>
                    <span className="text-[9px] text-white/30 font-black uppercase tracking-widest flex-1">Network Topology</span>
                    <div className="flex items-center gap-1">
                        <Activity className="h-2.5 w-2.5 text-primary animate-pulse" />
                        <span className="text-[8px] text-primary font-black uppercase">Live</span>
                    </div>
                </div>

                <svg viewBox="0 0 100 100" className="w-full h-full" style={{ maxHeight: '200px' }}>
                    {/* Draw links */}
                    {links.map((link, i) => {
                        const from = nodes[link.from]
                        const to = nodes[link.to]
                        const isActive = activeLink === i
                        return (
                            <g key={i}>
                                <line
                                    x1={from.x} y1={from.y}
                                    x2={to.x} y2={to.y}
                                    stroke={isActive ? '#06b6d4' : 'rgba(255,255,255,0.08)'}
                                    strokeWidth={isActive ? '0.6' : '0.3'}
                                    strokeDasharray={isActive ? '2 1' : 'none'}
                                />
                                {/* Animated packet on active link */}
                                {isActive && (
                                    <motion.circle
                                        r="1.2"
                                        fill="#06b6d4"
                                        filter="url(#glow)"
                                        initial={{ cx: from.x, cy: from.y }}
                                        animate={{ cx: to.x, cy: to.y }}
                                        transition={{ duration: 1.6, ease: 'easeInOut', repeat: Infinity, repeatType: 'reverse' }}
                                    />
                                )}
                            </g>
                        )
                    })}

                    {/* Glow filter */}
                    <defs>
                        <filter id="glow">
                            <feGaussianBlur stdDeviation="1" result="coloredBlur" />
                            <feMerge>
                                <feMergeNode in="coloredBlur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>

                    {/* Draw nodes */}
                    {nodes.map((node, i) => (
                        <g key={node.id}>
                            {/* Outer glow ring for highlighted nodes */}
                            {node.highlight && (
                                <motion.circle
                                    cx={node.x} cy={node.y} r="5"
                                    fill="none"
                                    stroke="#f59e0b"
                                    strokeWidth="0.5"
                                    initial={{ opacity: 0, r: 4 }}
                                    animate={{ opacity: [0, 1, 0], r: [4, 7, 4] }}
                                    transition={{ duration: 0.8, repeat: Infinity }}
                                />
                            )}
                            <circle
                                cx={node.x} cy={node.y} r="4"
                                fill={`${node.color}20`}
                                stroke={node.highlight ? '#f59e0b' : node.color}
                                strokeWidth="0.5"
                            />
                            <text
                                x={node.x} y={node.y + 1}
                                textAnchor="middle"
                                dominantBaseline="middle"
                                fontSize="3.5"
                            >
                                {node.icon}
                            </text>
                            <text
                                x={node.x} y={node.y + 7}
                                textAnchor="middle"
                                fontSize="2.5"
                                fill={node.highlight ? '#f59e0b' : 'rgba(255,255,255,0.5)'}
                                fontWeight="bold"
                                fontFamily="monospace"
                            >
                                {node.label}
                            </text>
                        </g>
                    ))}
                </svg>

                {/* Threat alert overlay */}
                <AnimatePresence>
                    {threatDetected && (
                        <motion.div
                            initial={{ opacity: 0, y: 4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="absolute top-2 right-2 flex items-center gap-1 bg-amber-500/20 border border-amber-500/40 px-2 py-0.5 rounded-full"
                        >
                            <div className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
                            <span className="text-[8px] font-black text-amber-400 uppercase tracking-tighter">Threat Blocked</span>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Live Log */}
            <div className="bg-black/30 border border-white/10 rounded-xl p-3 font-mono text-[9px] min-h-[64px] relative overflow-hidden">
                <div className="flex items-center gap-1 mb-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[8px] font-black text-emerald-400 uppercase tracking-widest">System Log</span>
                </div>
                <div className="space-y-1">
                    <AnimatePresence mode="popLayout">
                        {logLines.map((line, i) => (
                            <motion.div
                                key={line + i}
                                initial={{ opacity: 0, x: -8, filter: 'blur(4px)' }}
                                animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                                className="flex items-center gap-1.5 text-white/60"
                            >
                                <span className="text-primary/60 font-black">›</span>
                                <span className={line.includes('blocked') || line.includes('Blocked') ? 'text-amber-400 font-bold' : ''}>{line}</span>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-2">
                {[
                    { label: 'VPN Peers', value: '5', color: 'text-cyan-400' },
                    { label: 'Threats', value: '0', color: 'text-emerald-400' },
                    { label: 'Uptime', value: '99.9%', color: 'text-purple-400' },
                ].map((stat, i) => (
                    <div key={i} className="bg-black/30 border border-white/5 rounded-xl p-2 text-center">
                        <div className={`text-base font-black ${stat.color}`}>{stat.value}</div>
                        <div className="text-[8px] text-white/30 font-bold uppercase tracking-wider">{stat.label}</div>
                    </div>
                ))}
            </div>
        </div>
    )
}

// --- Main NetworkHero Component ---
export function NetworkHero() {
    const t = useTranslations('Services.Network')

    return (
        <section className="relative py-24 md:py-32 overflow-hidden">
            {/* Background Effects - transparent to blend with global neural background */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left: Content */}
                    <div className="order-2 lg:order-1 space-y-8">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 text-[10px] font-black tracking-[0.4em] uppercase rounded-full bg-white/[0.03] text-primary border border-white/10">
                            <Network className="h-3 w-3" />
                            {t('hero_badge')}
                        </div>

                        {/* Title */}
                        <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-white tracking-tighter leading-[0.9]">
                            {t.rich('hero_title', {
                                br: () => <br />,
                                span: (chunks) => (
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-primary">
                                        {chunks}
                                    </span>
                                )
                            })}
                        </h1>

                        {/* Description */}
                        <p className="text-lg md:text-xl text-white/60 font-medium leading-relaxed max-w-xl">
                            {t('hero_description')}
                        </p>

                        {/* Feature Pills */}
                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { icon: Lock, text: t('services.vpn.title') },
                                { icon: Network, text: t('services.vlan.title') },
                                { icon: Shield, text: t('services.firewall.title') },
                                { icon: Wifi, text: t('services.wifi.title') },
                            ].map((feature, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 + 0.3 }}
                                    className="p-3 border border-white/5 bg-white/5 hover:bg-white/10 transition-colors rounded-xl"
                                >
                                    <div className="flex items-center gap-3 text-white/90">
                                        <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                                            <feature.icon className="h-4 w-4 text-primary" />
                                        </div>
                                        <span className="text-sm font-bold tracking-wide">{feature.text}</span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* CTAs */}
                        <div className="flex flex-wrap gap-4 pt-4">
                            <Button
                                size="lg"
                                className="h-14 px-8 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-tight shadow-[0_20px_40px_-10px_rgba(6,182,212,0.4)]"
                                asChild
                            >
                                <Link href="/kapcsolat">
                                    {t('cta_button')}
                                </Link>
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                className="h-14 px-8 rounded-2xl border-white/20 hover:bg-white/5 text-white font-bold"
                                asChild
                            >
                                <Link href="/demo">
                                    {t('cta_secondary')}
                                </Link>
                            </Button>
                        </div>

                        {/* Trust Badge */}
                        <div className="pt-8 border-t border-white/10">
                            <p className="text-xs text-white/40 font-medium mb-2">
                                {t('official_qualification')}
                            </p>
                            <p className="text-sm text-white/60 font-bold">
                                {t('qualification_name')}
                            </p>
                        </div>
                    </div>

                    {/* Right: Animated Network Topology */}
                    <motion.div
                        className="order-1 lg:order-2"
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                    >
                        <div className="relative w-full max-w-lg mx-auto lg:mx-0 p-1">
                            {/* Outer glow */}
                            <div className="absolute -inset-4 bg-gradient-to-tr from-primary/20 to-purple-500/10 rounded-3xl blur-2xl opacity-60 pointer-events-none" />
                            <div className="relative bg-white/[0.02] border border-white/10 rounded-3xl p-4 backdrop-blur-sm shadow-2xl h-[320px] md:h-[420px]">
                                <NetworkTopologyViz />
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}
