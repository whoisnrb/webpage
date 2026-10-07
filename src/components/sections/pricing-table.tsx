"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Crown, CheckCircle2, Sparkles, Zap, ArrowRight, ShieldCheck, Check } from "lucide-react"
import { Link } from "@/i18n/routing"
import { useTranslations, useLocale } from "next-intl"
import { PriceDisplay } from "@/components/price-display"
import { CheckoutButton } from "@/components/checkout-button"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

export function PricingTable() {
    const t = useTranslations('PricingPage.PricingTable')
    const locale = useLocale()
    const [isAnnual, setIsAnnual] = useState(true)

    // Base prices (one-time or monthly equivalent)
    const starterBase = 199000
    const proBase = 449000

    // 20% discount on annual payment
    const starterPrice = isAnnual ? Math.round(starterBase * 0.8) : starterBase
    const proPrice = isAnnual ? Math.round(proBase * 0.8) : proBase

    const packages = [
        {
            key: "starter",
            name: t('packages.starter.name'),
            description: t('packages.starter.description'),
            price: starterPrice,
            originalPrice: isAnnual ? starterBase : undefined,
            priceNote: isAnnual ? (locale === 'hu' ? "éves számlázással (-20%)" : "billed annually (-20%)") : t('packages.starter.price_note'),
            icon: Sparkles,
            popular: false,
            badge: locale === 'hu' ? "Induló Csomag" : "Starter Pack",
            accentColor: "cyan",
            features: [
                t('packages.starter.features.0'),
                t('packages.starter.features.1'),
                t('packages.starter.features.2'),
                t('packages.starter.features.3'),
                t('packages.starter.features.4'),
                t('packages.starter.features.5'),
                t('packages.starter.features.6'),
                t('packages.starter.features.7')
            ],
            cta: t('packages.starter.cta'),
            href: "/konzultacio",
            disabled: false
        },
        {
            key: "pro",
            name: t('packages.pro.name'),
            description: t('packages.pro.description'),
            price: proPrice,
            originalPrice: isAnnual ? proBase : undefined,
            priceNote: isAnnual ? (locale === 'hu' ? "éves számlázással (-20%)" : "billed annually (-20%)") : t('packages.pro.price_note'),
            icon: Zap,
            popular: true,
            badge: t('popular_tag'),
            accentColor: "cyan",
            features: [
                t('packages.pro.features.0'),
                t('packages.pro.features.1'),
                t('packages.pro.features.2'),
                t('packages.pro.features.3'),
                t('packages.pro.features.4'),
                t('packages.pro.features.5'),
                t('packages.pro.features.6'),
                t('packages.pro.features.7'),
                t('packages.pro.features.8'),
                t('packages.pro.features.9')
            ],
            cta: t('packages.pro.cta'),
            href: "/konzultacio",
            disabled: false
        },
        {
            key: "enterprise",
            name: t('packages.enterprise.name'),
            description: t('packages.enterprise.description'),
            price: t('packages.enterprise.price'),
            originalPrice: undefined,
            priceNote: t('packages.enterprise.price_note'),
            icon: Crown,
            popular: false,
            badge: locale === 'hu' ? "Vállalati Szint" : "Enterprise",
            accentColor: "violet",
            features: [
                t('packages.enterprise.features.0'),
                t('packages.enterprise.features.1'),
                t('packages.enterprise.features.2'),
                t('packages.enterprise.features.3'),
                t('packages.enterprise.features.4'),
                t('packages.enterprise.features.5'),
                t('packages.enterprise.features.6'),
                t('packages.enterprise.features.7'),
                t('packages.enterprise.features.8'),
                t('packages.enterprise.features.9'),
                t('packages.enterprise.features.10')
            ],
            cta: t('packages.enterprise.cta'),
            href: "/ajanlatkeres",
            disabled: false
        }
    ]

    return (
        <section className="py-20 md:py-28 relative overflow-hidden bg-transparent">
            {/* Ambient Background Lights */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-cyan-500/10 rounded-full blur-[160px] pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10">
                {/* Header title */}
                <div className="text-center mb-12 max-w-3xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-cyan-400 text-xs font-black tracking-widest uppercase mb-4">
                        <Sparkles className="h-3.5 w-3.5" />
                        {locale === 'hu' ? "Átlátható Struktúra" : "Transparent Structure"}
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-4">
                        {t('title')}
                    </h2>
                    <p className="text-white/50 text-base md:text-lg leading-relaxed">
                        {t('desc')}
                    </p>

                    {/* Billing Toggle (Monthly vs Annual -20%) */}
                    <div className="mt-8 inline-flex items-center gap-3 p-1.5 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl">
                        <button
                            type="button"
                            onClick={() => setIsAnnual(false)}
                            className={cn(
                                "px-5 py-2 rounded-xl text-xs font-bold transition-all duration-300",
                                !isAnnual
                                    ? "bg-cyan-500 text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.4)]"
                                    : "text-white/60 hover:text-white"
                            )}
                        >
                            {t('billing_monthly')}
                        </button>

                        <button
                            type="button"
                            onClick={() => setIsAnnual(true)}
                            className={cn(
                                "px-5 py-2 rounded-xl text-xs font-bold transition-all duration-300 flex items-center gap-2",
                                isAnnual
                                    ? "bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 shadow-[0_0_25px_rgba(6,182,212,0.45)]"
                                    : "text-white/60 hover:text-white"
                            )}
                        >
                            <span>{t('billing_yearly')}</span>
                            <span className={cn(
                                "text-[10px] font-black uppercase px-2 py-0.5 rounded-full",
                                isAnnual ? "bg-slate-950 text-cyan-300" : "bg-cyan-500/20 text-cyan-400"
                            )}>
                                {t('save_20')}
                            </span>
                        </button>
                    </div>
                </div>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto items-stretch">
                    {packages.map((pkg, index) => {
                        const Icon = pkg.icon
                        const isCustom = typeof pkg.price !== 'number'

                        return (
                            <motion.div
                                key={pkg.key}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.15 }}
                                className={cn(
                                    "relative rounded-3xl flex flex-col justify-between transition-all duration-500",
                                    pkg.popular
                                        ? "bg-[#061322]/90 border-2 border-cyan-400/70 shadow-[0_0_60px_-10px_rgba(6,182,212,0.35)] md:-translate-y-4"
                                        : pkg.key === 'enterprise'
                                            ? "bg-[#0a0f1d]/80 border border-violet-500/30 shadow-[0_0_40px_-15px_rgba(139,92,246,0.2)]"
                                            : "bg-[#06101c]/80 border border-white/10 shadow-[0_0_30px_-10px_rgba(0,0,0,0.5)]"
                                )}
                            >
                                {/* Top Badge */}
                                {pkg.popular && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
                                        <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(6,182,212,0.5)]">
                                            <Sparkles className="h-3.5 w-3.5" />
                                            {pkg.badge}
                                        </div>
                                    </div>
                                )}

                                <div className="p-8 md:p-10 flex-1 flex flex-col">
                                    {/* Icon & Title */}
                                    <div className="flex items-center justify-between mb-6">
                                        <div className={cn(
                                            "h-14 w-14 rounded-2xl flex items-center justify-center border transition-all",
                                            pkg.popular
                                                ? "bg-cyan-500/20 border-cyan-400/40 text-cyan-400 shadow-[0_0_25px_rgba(6,182,212,0.3)]"
                                                : pkg.key === 'enterprise'
                                                    ? "bg-violet-500/15 border-violet-500/30 text-violet-400"
                                                    : "bg-white/5 border-white/10 text-white/70"
                                        )}>
                                            <Icon className="h-7 w-7" />
                                        </div>

                                        {!pkg.popular && (
                                            <span className="text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/50">
                                                {pkg.badge}
                                            </span>
                                        )}
                                    </div>

                                    <h3 className="text-2xl font-black text-white mb-2">{pkg.name}</h3>
                                    <p className="text-sm text-white/50 leading-relaxed mb-6">{pkg.description}</p>

                                    {/* Price area */}
                                    <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 mb-8">
                                        <div className="flex items-baseline gap-2">
                                            {typeof pkg.price === 'number' ? (
                                                <div className="flex items-baseline gap-3">
                                                    <PriceDisplay amount={pkg.price} className="text-3xl md:text-4xl font-black text-white" />
                                                    {pkg.originalPrice && (
                                                        <span className="text-sm line-through text-white/30">
                                                            {new Intl.NumberFormat(locale === 'hu' ? 'hu-HU' : 'en-US').format(pkg.originalPrice)} Ft
                                                        </span>
                                                    )}
                                                </div>
                                            ) : (
                                                <span className="text-3xl font-black text-white">{pkg.price}</span>
                                            )}
                                        </div>
                                        <p className="text-xs text-white/40 mt-1">{pkg.priceNote}</p>
                                    </div>

                                    {/* Feature List */}
                                    <div className="flex-1 space-y-3 mb-8">
                                        <div className="text-[11px] font-black uppercase tracking-wider text-cyan-400/80 mb-3">
                                            {locale === 'hu' ? "A csomag tartalma:" : "Included features:"}
                                        </div>
                                        {pkg.features.map((feature, idx) => (
                                            <div key={idx} className="flex items-start gap-3 text-xs leading-relaxed text-white/70">
                                                <div className={cn(
                                                    "h-4 w-4 rounded-full flex items-center justify-center shrink-0 mt-0.5",
                                                    pkg.popular ? "bg-cyan-500/20 text-cyan-400" : "bg-white/10 text-emerald-400"
                                                )}>
                                                    <Check className="h-3 w-3 stroke-[3]" />
                                                </div>
                                                <span>{feature}</span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* CTA Button */}
                                    <div className="mt-auto pt-4">
                                        {pkg.key === 'enterprise' ? (
                                            <Button
                                                asChild
                                                className="w-full h-12 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-black text-xs uppercase tracking-wider shadow-[0_0_25px_rgba(139,92,246,0.35)] transition-all"
                                            >
                                                <Link href="/ajanlatkeres">
                                                    {pkg.cta}
                                                    <ArrowRight className="ml-2 h-4 w-4" />
                                                </Link>
                                            </Button>
                                        ) : typeof pkg.price === 'number' ? (
                                            <CheckoutButton
                                                serviceName={`BacklineIT - ${pkg.name}`}
                                                price={pkg.price}
                                                currency="HUF"
                                                className={cn(
                                                    "w-full h-12 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 shadow-md",
                                                    pkg.popular
                                                        ? "bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 shadow-[0_0_30px_rgba(6,182,212,0.4)]"
                                                        : "bg-white/10 hover:bg-white/20 text-white border border-white/10"
                                                )}
                                            >
                                                {pkg.cta}
                                            </CheckoutButton>
                                        ) : (
                                            <Button
                                                asChild
                                                className="w-full h-12 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold"
                                            >
                                                <Link href="/konzultacio">
                                                    {pkg.cta}
                                                </Link>
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        )
                    })}
                </div>

                {/* Bottom Custom Solution Banner */}
                <div className="mt-16 text-center max-w-2xl mx-auto p-8 rounded-3xl bg-white/[0.02] border border-white/10 backdrop-blur-xl">
                    <p className="text-white/60 mb-4 text-sm md:text-base leading-relaxed">
                        {t('bottom_text')}
                    </p>
                    <Button
                        variant="outline"
                        size="lg"
                        className="h-12 px-8 rounded-xl border-cyan-500/40 hover:bg-cyan-500/10 text-cyan-400 hover:text-cyan-300 font-black text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(6,182,212,0.15)]"
                        asChild
                    >
                        <Link href="/ajanlatkeres">
                            {t('bottom_cta')}
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </div>
            </div>
        </section>
    )
}
