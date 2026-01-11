"use client"

import { Button } from "@/components/ui/button"
import { CheckCircle2, ArrowRight, Sparkles, Zap, ShieldCheck, Trophy } from "lucide-react"
import { ReactNode } from "react"
import { Link } from "@/i18n/routing"
import { useTranslations } from "next-intl"
import { motion } from "framer-motion"
import { FadeIn, SlideUp, ScaleIn } from "@/components/ui/motion-wrapper"

interface ServiceLayoutProps {
    title: string
    description: string
    icon: ReactNode
    features: string[]
    benefits: { title: string; description: string }[]
    techStack: string[]
    pricing?: string | ReactNode
    children?: ReactNode
}

export function ServiceLayout({
    title,
    description,
    icon,
    features,
    benefits,
    techStack,
    pricing,
    children,
}: ServiceLayoutProps) {
    const t = useTranslations("ServiceTemplate")
    const tServices = useTranslations("ServicesPage")

    return (
        <div className="flex flex-col min-h-screen bg-transparent selection:bg-primary/30 selection:text-white">
            {/* Hero Section */}
            <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden border-b border-white/5 bg-slate-950/50 backdrop-blur-sm">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,_rgba(6,182,212,0.15),_transparent_60%)]" />

                <div className="container relative z-10 mx-auto px-4">
                    <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
                        <div className="flex-1 text-left">
                            <FadeIn>
                                <div className="inline-flex items-center gap-3 px-5 py-2 mb-8 text-[11px] font-black tracking-[0.4em] uppercase rounded-full bg-white/[0.03] text-primary border border-white/10 backdrop-blur-xl group cursor-default">
                                    <Sparkles className="h-3 w-3 group-hover:rotate-12 transition-transform" />
                                    {t("premium_service")}
                                </div>
                                <h1 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter mb-8 text-white leading-[0.85]">
                                    {title.split(' ').map((word, i) => (
                                        <span key={i} className={i === title.split(' ').length - 1 ? "text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-primary to-purple-500 animate-gradient-x bg-[length:200%_auto] block lg:inline" : ""}>
                                            {word}{' '}
                                        </span>
                                    ))}
                                </h1>
                                <p className="text-xl md:text-2xl text-white/50 mb-12 max-w-2xl font-medium leading-relaxed">
                                    {description}
                                </p>
                                <div className="flex flex-wrap gap-6">
                                    <Button size="lg" className="h-16 px-10 text-xl font-black uppercase tracking-tight bg-primary hover:bg-primary/90 text-white rounded-2xl shadow-[0_20px_40px_-10px_rgba(6,182,212,0.4)] transition-all duration-500 hover:scale-[1.02] active:scale-95 group" asChild>
                                        <Link href="/kapcsolat" className="flex items-center">
                                            {t("get_quote")}
                                            <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-2 transition-transform" />
                                        </Link>
                                    </Button>
                                    <Button size="lg" variant="ghost" className="h-16 px-10 text-xl font-black uppercase tracking-tight text-white/60 hover:text-white hover:bg-white/5 border border-white/10 rounded-2xl transition-all duration-500 hover:border-white/20" asChild>
                                        <Link href="/referenciak">
                                            {t("view_references")}
                                        </Link>
                                    </Button>
                                </div>
                            </FadeIn>
                        </div>

                        <div className="flex-1 relative">
                            <ScaleIn delay={0.2}>
                                <div className="relative w-full aspect-square max-w-[550px] mx-auto">
                                    {/* Animated Glow Rings */}
                                    <div className="absolute inset-0 bg-primary/20 rounded-full blur-[120px] animate-pulse" />
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                        className="absolute -inset-8 border border-white/5 rounded-full"
                                    />
                                    <motion.div
                                        animate={{ rotate: -360 }}
                                        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                                        className="absolute -inset-16 border border-white/[0.02] rounded-full"
                                    />

                                    {/* Main Icon Glass Plate */}
                                    <div className="relative h-full w-full rounded-[48px] bg-white/[0.02] border border-white/10 backdrop-blur-3xl flex items-center justify-center p-12 overflow-hidden group shadow-2xl">
                                        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                                        <div className="relative text-cyan-400 transform group-hover:scale-110 transition-transform duration-700 drop-shadow-[0_0_30px_rgba(34,211,238,0.5)]">
                                            {icon}
                                        </div>

                                        {/* Floating Elements */}
                                        <div className="absolute top-12 right-12 p-5 rounded-2xl bg-white/[0.05] border border-white/10 backdrop-blur-xl animate-float shadow-xl">
                                            <Zap className="h-8 w-8 text-yellow-400" />
                                        </div>
                                        <div className="absolute bottom-12 left-12 p-5 rounded-2xl bg-white/[0.05] border border-white/10 backdrop-blur-xl animate-float-delayed shadow-xl">
                                            <ShieldCheck className="h-8 w-8 text-emerald-400" />
                                        </div>
                                    </div>
                                </div>
                            </ScaleIn>
                        </div>
                    </div>
                </div>
            </section>

            {/* Problem / Solution / Benefits */}
            <section className="py-24 md:py-40 relative bg-transparent overflow-hidden">
                {/* Subtle side glow */}
                <div className="absolute top-1/2 -left-64 w-128 h-128 bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

                <div className="container mx-auto px-4">
                    <div className="grid lg:grid-cols-2 gap-24 items-start">
                        <div>
                            <SlideUp>
                                <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-16 leading-[0.9]">
                                    {t("why_need_this")}<br />
                                    <span className="text-white/20 italic font-serif">{t("with_backlineit")}</span>
                                </h2>
                                <div className="space-y-12">
                                    {benefits.map((benefit, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, x: -20 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            viewport={{ once: true }}
                                            className="flex gap-8 group"
                                        >
                                            <div className="mt-1 h-16 w-16 shrink-0 rounded-2xl bg-white/[0.03] flex items-center justify-center border border-white/10 text-primary group-hover:bg-primary group-hover:text-white group-hover:border-primary group-hover:scale-110 transition-all duration-500 shadow-lg">
                                                <Trophy className="h-8 w-8" />
                                            </div>
                                            <div>
                                                <h3 className="text-2xl md:text-3xl font-black text-white mb-4 group-hover:text-primary transition-colors">{benefit.title}</h3>
                                                <p className="text-lg md:text-xl text-white/40 leading-relaxed font-medium">{benefit.description}</p>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </SlideUp>
                        </div>

                        <div className="relative lg:sticky lg:top-32">
                            <FadeIn delay={0.3}>
                                <div className="p-10 md:p-14 rounded-[48px] bg-white/[0.02] border border-white/10 backdrop-blur-3xl overflow-hidden group shadow-2xl">
                                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent" />

                                    <h3 className="text-3xl md:text-4xl font-black text-white mb-10 flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center">
                                            <div className="h-3.5 w-3.5 rounded-full bg-primary animate-pulse" />
                                        </div>
                                        {t("whats_included")}
                                    </h3>

                                    <div className="grid gap-5 mb-14">
                                        {features.map((feature, index) => (
                                            <div key={index} className="flex items-center gap-5 p-5 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-primary/30 hover:bg-white/[0.05] transition-all duration-300 group/item">
                                                <CheckCircle2 className="h-7 w-7 text-primary group-hover/item:scale-110 transition-transform" />
                                                <span className="text-lg md:text-xl font-semibold text-white/60 group-hover/item:text-white transition-colors">{feature}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="pt-12 border-t border-white/10">
                                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 mb-8">{t("technologies")}</h4>
                                        <div className="flex flex-wrap gap-3">
                                            {techStack.map((tech, index) => (
                                                <span key={index} className="px-6 py-3 bg-white/[0.05] border border-white/10 rounded-2xl text-sm font-bold text-white/70 hover:text-primary hover:border-primary/50 transition-all cursor-default hover:bg-white/[0.08]">
                                                    {tech}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {pricing && (
                                        <div className="mt-14 p-10 rounded-[32px] bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 shadow-inner group/pricing">
                                            <p className="text-xs font-black uppercase tracking-[0.3em] text-primary/60 mb-3">{tServices("item_labels.starting_price")}</p>
                                            <div className="text-5xl md:text-6xl font-black text-white tracking-tighter group-hover/pricing:scale-105 transition-transform duration-500 origin-left">
                                                {pricing}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </FadeIn>
                        </div>
                    </div>
                </div>
            </section>

            {children}

            {/* CTA Section - Ultra Premium */}
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
                                    <Link href="/kapcsolat" className="flex items-center">
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
        </div>
    )
}
