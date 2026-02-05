"use client"

import { Button } from '@/components/ui/button'
import { Link } from '@/i18n/routing'
import { useTranslations } from 'next-intl'
import { Shield, Wifi, Lock, Network } from 'lucide-react'

export function NetworkHero() {
    const t = useTranslations('Services.Network')

    return (
        <section className="relative py-24 md:py-32 overflow-hidden">
            {/* Background Effects - Simplified */}
            <div className="absolute inset-0 bg-slate-950" />
            <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900/80 to-slate-950 pointer-events-none" />
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
                        <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-[0.9]">
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
                        <p className="text-xl text-white/60 font-medium leading-relaxed max-w-xl">
                            {t('hero_description')}
                        </p>

                        {/* Features */}
                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { icon: Lock, text: t('services.vpn.title') },
                                { icon: Network, text: t('services.vlan.title') },
                                { icon: Shield, text: t('services.firewall.title') },
                                { icon: Wifi, text: t('services.wifi.title') },
                            ].map((feature, i) => (
                                <div key={i} className="p-3 border border-white/5 bg-white/5 hover:bg-white/10 transition-colors rounded-xl">
                                    <div className="flex items-center gap-3 text-white/90">
                                        <div className="p-2 rounded-lg bg-primary/10 border border-primary/20 bg-primary/5">
                                            <feature.icon className="h-4 w-4 text-primary" />
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

                    {/* Right: Static Visual */}
                    <div className="order-1 lg:order-2">
                        <div className="relative aspect-square w-full max-w-2xl mx-auto lg:mx-0 flex items-center justify-center p-8">
                            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-purple-500/20 rounded-full blur-3xl opacity-30 animate-pulse" />
                            <Network className="w-64 h-64 text-primary/50 relative z-10 drop-shadow-[0_0_50px_rgba(6,182,212,0.3)]" strokeWidth={0.5} />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
