"use client"

import { Button } from '@/components/ui/button'
import { Link } from '@/i18n/routing'
import { useTranslations } from 'next-intl'
import { Server, Activity, Database, GitBranch, Cloud } from 'lucide-react'

// Simple static visual fallback
function ServerVisualFallback() {
    return (
        <div className="w-full h-full flex items-center justify-center bg-transparent">
            <div className="relative w-full aspect-square max-w-[500px] flex items-center justify-center">
                <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-3xl opacity-20" />
                <Server className="w-64 h-64 text-blue-500/50 relative z-10" strokeWidth={0.5} />
            </div>
        </div>
    )
}

export function SysAdminHero() {
    const t = useTranslations('Services.SysAdmin')

    return (
        <section className="relative py-24 md:py-32 overflow-hidden min-h-[90vh] flex items-center">
            {/* Background Effects - Simplified */}
            <div className="absolute inset-0 bg-slate-950" />
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
                                {t('title').split(' ').slice(1).join(' ')}
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
                                <div key={i} className="p-3 border border-white/5 bg-white/5 hover:bg-white/10 transition-colors rounded-xl">
                                    <div className="flex items-center gap-3 text-white/90">
                                        <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 bg-blue-500/5">
                                            <feature.icon className="h-4 w-4 text-blue-400" />
                                        </div>
                                        <span className="text-sm font-bold tracking-wide">{feature.text}</span>
                                    </div>
                                </div>
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
