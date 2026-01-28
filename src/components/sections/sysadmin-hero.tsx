"use client"

import { Suspense, lazy } from 'react'
import { Button } from '@/components/ui/button'
import { Link } from '@/i18n/routing'
import { useTranslations } from 'next-intl'
import { Server, Activity, ShieldCheck, Database, GitBranch, Cloud } from 'lucide-react'
import RetroGrid from '@/components/ui/retro-grid'
import { SpotlightCard } from '@/components/ui/spotlight-card'
import DecryptedText from '@/components/ui/decrypted-text'

// Placeholder for a 3D Server Stack or similar if needed, for now we use a nice visual composition
function ServerVisualFallback() {
    return (
        <div className="w-full h-full flex items-center justify-center bg-transparent">
            <div className="relative w-full aspect-square max-w-[500px]">
                {/* Abstract Server Rack Visualization */}
                <div className="absolute inset-x-10 top-0 bottom-0 bg-slate-900/50 border border-white/5 rounded-2xl backdrop-blur-md flex flex-col gap-4 p-6 shadow-2xl">
                    {[1, 2, 3, 4, 5].map((u) => (
                        <div key={u} className="h-16 w-full bg-slate-800/50 rounded-lg border border-white/5 flex items-center justify-between px-6 relative overflow-hidden group">
                            {/* Server Lights */}
                            <div className="flex gap-2">
                                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" style={{ animationDelay: `${u * 0.2}s` }} />
                                <span className="h-2 w-2 rounded-full bg-emerald-500/30" />
                                <span className="h-2 w-2 rounded-full bg-amber-500/30" />
                            </div>
                            {/* Data Flow Animation */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-shimmer" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export function SysAdminHero() {
    const t = useTranslations('Services.SysAdmin')

    return (
        <section className="relative py-24 md:py-32 overflow-hidden min-h-[90vh] flex items-center">
            {/* Background Effects */}
            <RetroGrid className='opacity-[0.15] dark:opacity-[0.15]' />
            <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900/50 to-slate-950 pointer-events-none" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-cyan-500/10 via-transparent to-transparent pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="grid lg:grid-cols-2 gap-12 items-center">

                    {/* Content (Left side for SysAdmin) */}
                    <div className="space-y-8">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 text-[10px] font-black tracking-[0.4em] uppercase rounded-full bg-white/[0.03] text-cyan-400 border border-white/10">
                            <Server className="h-3 w-3" />
                            SysAdmin Ops
                        </div>

                        {/* Title */}
                        <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-[0.9]">
                            {t('title').split(' ')[0]}<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">
                                <DecryptedText
                                    text={t('title').split(' ').slice(1).join(' ')}
                                    animateOn="view"
                                    speed={80}
                                    className="inline-block"
                                />
                            </span>
                        </h1>

                        {/* Description */}
                        <p className="text-xl text-white/60 font-medium leading-relaxed max-w-xl">
                            {t('description')}
                        </p>

                        {/* Features Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { icon: GitBranch, text: 'DevOps CI/CD' },
                                { icon: Cloud, text: 'Cloud Migration' },
                                { icon: Database, text: 'Adatbázis Tuning' },
                                { icon: Activity, text: '24/7 Monitoring' },
                            ].map((feature, i) => (
                                <SpotlightCard key={i} className="p-3 border-white/5 bg-white/5 hover:bg-white/10 transition-colors" spotlightColor="rgba(59, 130, 246, 0.25)">
                                    <div className="flex items-center gap-3 text-white/90">
                                        <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 bg-blue-500/5">
                                            <feature.icon className="h-4 w-4 text-blue-400" />
                                        </div>
                                        <span className="text-sm font-bold tracking-wide">{feature.text}</span>
                                    </div>
                                </SpotlightCard>
                            ))}
                        </div>

                        {/* CTAs */}
                        <div className="flex flex-wrap gap-4 pt-4">
                            <Button
                                size="lg"
                                className="h-14 px-8 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-white font-black uppercase tracking-tight shadow-[0_20px_40px_-10px_rgba(6,182,212,0.4)]"
                                asChild
                            >
                                <Link href="/kapcsolat">
                                    Ajánlatkérés
                                </Link>
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                className="h-14 px-8 rounded-2xl border-white/20 hover:bg-white/5 text-white font-bold"
                                asChild
                            >
                                <Link href="/referenciak">
                                    Referenciák
                                </Link>
                            </Button>
                        </div>
                    </div>

                    {/* Visual (Right side) */}
                    <div className="relative">
                        <ServerVisualFallback />
                    </div>
                </div>
            </div>
        </section>
    )
}
