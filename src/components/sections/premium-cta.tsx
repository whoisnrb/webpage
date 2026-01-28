"use client"

import { Button } from "@/components/ui/button"
import { ShieldCheck, Trophy, Zap, Sparkles, ArrowRight } from "lucide-react"
import { Link } from "@/i18n/routing"
import { useTranslations } from "next-intl"
import { FadeIn } from "@/components/ui/motion-wrapper"

export function PremiumCTA() {
    const t = useTranslations("ServiceTemplate")

    return (
        <section className="relative py-32 md:py-48 overflow-hidden bg-transparent">
            <div className="absolute inset-0 bg-primary/5" />
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            {/* Background decorative elements */}
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px]" />
            <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px]" />

            <div className="container relative z-10 mx-auto px-4">
                <div className="relative p-12 md:p-28 rounded-[64px] bg-white/[0.02] border border-white/10 backdrop-blur-3xl text-center overflow-hidden shadow-2xl transition-transform hover:scale-[1.01] duration-700">
                    <div className="absolute -top-10 -right-10 p-12">
                        <Sparkles className="h-32 w-32 text-primary opacity-5 animate-pulse" />
                    </div>

                    <FadeIn>
                        <div className="inline-flex items-center gap-3 px-6 py-2.5 mb-10 text-[11px] font-black tracking-[0.4em] uppercase rounded-full bg-white/[0.03] text-primary border border-white/10">
                            <span className="relative flex h-2.5 w-2.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-400"></span>
                            </span>
                            {t("free_consultation_available")}
                        </div>

                        <h2 className="text-6xl md:text-9xl font-black mb-10 text-white tracking-tighter leading-[0.85]">
                            {t("ready_to_start")}<br />
                            <span className="text-white/20">{t("let_us_build")}</span>
                        </h2>
                        <p className="text-xl md:text-3xl text-white/40 mb-20 max-w-4xl mx-auto font-medium leading-relaxed">
                            {t("cta_description")}
                        </p>

                        <div className="flex flex-col sm:flex-row gap-8 justify-center items-center">
                            <Button size="lg" className="h-20 px-14 text-2xl font-black uppercase tracking-tight bg-white text-slate-950 hover:bg-white/90 hover:scale-105 transition-all duration-500 rounded-2xl shadow-[0_20px_40px_-10px_rgba(255,255,255,0.4)]" asChild>
                                <Link href="/demo" className="flex items-center">
                                    {t("free_consultation")}
                                    <ArrowRight className="ml-4 h-8 w-8" />
                                </Link>
                            </Button>
                            <Button size="lg" variant="ghost" className="h-20 px-14 text-2xl font-black uppercase tracking-tight text-white/60 hover:text-white hover:bg-white/5 border border-white/10 rounded-2xl transition-all duration-500 hover:border-white/20" asChild>
                                <Link href="/arak">
                                    {t("view_pricing")}
                                </Link>
                            </Button>
                        </div>

                        <div className="mt-20 flex flex-wrap justify-center gap-16">
                            {[
                                { label: t("no_hidden_costs"), icon: ShieldCheck },
                                { label: t("satisfaction_guarantee"), icon: Trophy },
                                { label: t("fast_response"), icon: Zap }
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-4 text-white/40 font-bold uppercase tracking-[0.2em] text-xs">
                                    <item.icon className="h-5 w-5 text-primary" />
                                    {item.label}
                                </div>
                            ))}
                        </div>
                    </FadeIn>
                </div>
            </div>
        </section>
    )
}
