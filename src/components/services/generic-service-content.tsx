"use client"

import { useState, useEffect } from "react"
import { useTranslations, useLocale } from "next-intl"
import { Link, usePathname } from "@/i18n/routing"
import { 
    CheckCircle2, 
    ArrowRight, 
    Sparkles, 
    Zap, 
    ShieldCheck, 
    Trophy, 
    ChevronDown,
    LucideIcon,
    Cloud,
    Cpu,
    Puzzle,
    Activity,
    Layout,
    Headphones
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { FadeIn, SlideUp, ScaleIn } from "@/components/ui/motion-wrapper"
import { SpotlightCard } from "@/components/ui/spotlight-card"
import { useCurrency } from "@/components/currency-provider"
import { formatPrice } from "@/lib/currency"

interface GenericServiceContentProps {
    serviceKey: "CloudMigration" | "AICustomerSupport" | "CRMAutomation" | "EcommerceTracking" | "BusinessDashboards" | "RemoteHelpdesk"
}

const SERVICE_ICONS: Record<string, LucideIcon> = {
    CloudMigration: Cloud,
    AICustomerSupport: Cpu,
    CRMAutomation: Puzzle,
    EcommerceTracking: Activity,
    BusinessDashboards: Layout,
    RemoteHelpdesk: Headphones,
}

export function GenericServiceContent({ serviceKey }: GenericServiceContentProps) {
    const IconComponent = SERVICE_ICONS[serviceKey] || Cloud
    const t = useTranslations(`Services.${serviceKey}`)
    const tCommon = useTranslations("ServiceTemplate")
    const tServices = useTranslations("ServicesPage")
    const locale = useLocale()
    const pathname = usePathname()
    const { currency, rates } = useCurrency()
    
    const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null)
    const [currentUrl, setCurrentUrl] = useState("")

    useEffect(() => {
        if (typeof window !== "undefined") {
            setCurrentUrl(window.location.origin + pathname)
        }
    }, [pathname])

    const getPriceString = (amount: number) => {
        const val = amount / (rates['HUF'] || 1) * (rates[currency] || 1)
        return formatPrice(val, currency)
    }

    // Helper to get features dynamically
    const getFeatures = (planKey: string) => {
        try {
            const raw = t.raw(`plans.${planKey}.features`)
            if (Array.isArray(raw)) return raw
        } catch (e) {}
        return []
    }

    // Helper to get array items safely
    const getBenefits = () => {
        try {
            const raw = t.raw("hero_benefits")
            if (Array.isArray(raw)) return raw
        } catch (e) {}
        return []
    }

    const getUseCases = () => {
        try {
            const raw = t.raw("use_cases_items")
            if (Array.isArray(raw)) return raw
        } catch (e) {}
        return []
    }

    const getSteps = () => {
        try {
            const raw = t.raw("how_we_work_steps")
            if (Array.isArray(raw)) return raw
        } catch (e) {}
        return []
    }

    const getFaqItems = () => {
        try {
            const raw = t.raw("faq_items")
            if (Array.isArray(raw)) return raw
        } catch (e) {}
        return []
    }

    const benefits = getBenefits()
    const useCases = getUseCases()
    const steps = getSteps()
    const faqItems = getFaqItems()

    const planKeys = ["base", "detailed", "complex"] as const
    const plans = planKeys.map((planKey) => {
        const priceVal = parseInt(t(`plans.${planKey}.price`) || "0", 10)
        return {
            key: planKey,
            name: t(`plans.${planKey}.name`),
            desc: t(`plans.${planKey}.desc`),
            price: priceVal,
            priceFrom: t(`plans.${planKey}.priceFrom`) === "true" || true,
            sub: t(`plans.${planKey}.sub`),
            badge: planKey === "detailed" ? (t(`plans.${planKey}.badge`) || (locale === 'hu' ? 'Legnépszerűbb' : 'Most popular')) : undefined,
            popular: planKey === "detailed",
            features: getFeatures(planKey),
            duration: t(`plans.${planKey}.duration_label`)
        }
    })

    const title = t("title")
    const description = t("description")

    // Dynamic CTA URL
    const getCtaLink = (packageName?: string) => {
        const interest = packageName ? `${title} - ${packageName}` : title;
        return {
            pathname: "/ajanlatkeres" as const,
            query: {
                serviceInterest: interest,
                language: locale,
                sourcePage: currentUrl
            }
        }
    }

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
                                    {tCommon("premium_service")}
                                </div>
                                <h1 className="text-4xl sm:text-5xl md:text-8xl lg:text-9xl font-black tracking-tighter mb-8 text-white leading-[0.85]">
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
                                        <Link href={getCtaLink()} className="flex items-center">
                                            {locale === 'hu' ? 'Ajánlatot kérek' : 'Request a quote'}
                                            <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-2 transition-transform" />
                                        </Link>
                                    </Button>
                                    <Button size="lg" variant="ghost" className="h-16 px-10 text-xl font-black uppercase tracking-tight text-white/60 hover:text-white hover:bg-white/5 border border-white/10 rounded-2xl transition-all duration-500 hover:border-white/20" asChild>
                                        <Link href="/konzultacio">
                                            {locale === 'hu' ? 'Ingyenes konzultáció' : 'Free consultation'}
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
                                    <div className="relative h-full w-full rounded-[32px] md:rounded-[48px] bg-white/[0.02] border border-white/10 backdrop-blur-3xl flex items-center justify-center p-8 md:p-12 overflow-hidden group shadow-2xl">
                                        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                                        <div className="relative text-cyan-400 transform group-hover:scale-110 transition-transform duration-700 drop-shadow-[0_0_30px_rgba(34,211,238,0.5)]">
                                            <IconComponent className="h-32 w-32" />
                                        </div>

                                        {/* Floating Elements */}
                                        <div className="absolute top-4 right-4 md:top-12 md:right-12 p-3 md:p-5 rounded-xl md:rounded-2xl bg-white/[0.05] border border-white/10 backdrop-blur-xl animate-float shadow-xl">
                                            <Zap className="h-5 w-5 md:h-8 md:w-8 text-yellow-400" />
                                        </div>
                                        <div className="absolute bottom-4 left-4 md:bottom-12 md:left-12 p-3 md:p-5 rounded-xl md:rounded-2xl bg-white/[0.05] border border-white/10 backdrop-blur-xl animate-float-delayed shadow-xl">
                                            <ShieldCheck className="h-5 w-5 md:h-8 md:w-8 text-emerald-400" />
                                        </div>
                                    </div>
                                </div>
                            </ScaleIn>
                        </div>
                    </div>
                </div>
            </section>

            {/* "Miben segítünk?" Section */}
            <section className="py-24 md:py-32 relative bg-transparent overflow-hidden">
                <div className="container mx-auto px-4 relative z-10">
                    <div className="text-center mb-20">
                        <FadeIn>
                            <h2 className="text-4xl md:text-7xl font-black text-white tracking-tighter mb-6">
                                {t("use_cases_title")}
                            </h2>
                            <p className="text-xl text-white/40 max-w-3xl mx-auto font-medium">
                                {t("use_cases_desc")}
                            </p>
                        </FadeIn>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                        {useCases.map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                viewport={{ once: true }}
                            >
                                <SpotlightCard className="h-full bg-white/[0.02] border-white/10 rounded-[32px] p-8 flex flex-col justify-between hover:border-primary/30 transition-all">
                                    <div>
                                        <div className="flex items-center gap-4 mb-6">
                                            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                                <IconComponent className="h-6 w-6" />
                                            </div>
                                            <h3 className="text-2xl font-black text-white">{item.title}</h3>
                                        </div>
                                        <p className="text-white/60 mb-6 text-base leading-relaxed">{item.description}</p>
                                        <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 mb-6">
                                            <p className="text-[10px] font-black uppercase tracking-wider text-primary mb-2">
                                                {locale === 'hu' ? 'Gyakorlati példa:' : 'In practice:'}
                                            </p>
                                            <p className="text-sm text-white/50 leading-relaxed font-medium italic">"{item.example}"</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-emerald-400 mt-auto bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-xl w-max">
                                        <CheckCircle2 className="h-4 w-4" />
                                        {item.roi}
                                    </div>
                                </SpotlightCard>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* "Kinek ajánlott?" Section */}
            <section className="py-24 md:py-32 relative bg-slate-950/40 border-t border-b border-white/5 overflow-hidden">
                <div className="container mx-auto px-4 relative z-10">
                    <div className="text-center mb-20">
                        <FadeIn>
                            <h2 className="text-4xl md:text-7xl font-black text-white tracking-tighter mb-6">
                                {locale === 'hu' ? 'Kinek ajánljuk?' : 'Who is it for?'}
                            </h2>
                            <p className="text-xl text-white/40 max-w-2xl mx-auto font-medium">
                                {locale === 'hu' ? 'Megoldások a különböző fejlődési szakaszban lévő cégeknek' : 'Tailored support for businesses at any stage of growth'}
                            </p>
                        </FadeIn>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                        {benefits.map((benefit, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                viewport={{ once: true }}
                            >
                                <SpotlightCard className="h-full bg-white/[0.02] border-white/10 rounded-[32px] p-8 flex flex-col">
                                    <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center border border-white/10 text-primary mb-6 shadow-xl">
                                        <Trophy className="h-6 w-6" />
                                    </div>
                                    <h3 className="text-2xl font-black text-white mb-4">{benefit.title}</h3>
                                    <p className="text-white/40 text-base leading-relaxed font-medium">{benefit.description}</p>
                                </SpotlightCard>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section className="py-24 md:py-32 relative bg-transparent overflow-hidden">
                <div className="container mx-auto px-4 relative z-10">
                    <div className="text-center mb-20">
                        <FadeIn>
                            <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 text-[10px] font-black tracking-[0.4em] uppercase rounded-full bg-white/[0.03] text-primary border border-white/10">
                                <Sparkles className="h-3 w-3" />
                                {t("pricing_title")}
                            </div>
                            <h2 className="text-4xl md:text-7xl font-black text-white tracking-tighter mb-6">{t("pricing_title")}</h2>
                            <p className="text-xl text-white/40 max-w-2xl mx-auto font-medium">{t("pricing_desc")}</p>
                        </FadeIn>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto relative">
                        {plans.map((plan, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                viewport={{ once: true }}
                                className="relative group"
                            >
                                {plan.popular && plan.badge && (
                                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-20">
                                        <div className="bg-gradient-to-r from-red-500 to-primary text-white text-[10px] font-black uppercase tracking-widest px-6 py-2 rounded-full shadow-xl">
                                            {plan.badge}
                                        </div>
                                    </div>
                                )}

                                <SpotlightCard className={`h-full bg-white/[0.02] border-white/10 rounded-[48px] p-10 flex flex-col ${plan.popular ? 'border-primary/50 bg-primary/[0.02] shadow-[0_0_30px_rgba(6,182,212,0.05)]' : ''}`}>
                                    <div className="mb-10">
                                        <h3 className="text-3xl font-black text-white mb-4">{plan.name}</h3>
                                        <p className="text-white/40 font-medium leading-relaxed min-h-[60px]">{plan.desc}</p>
                                    </div>

                                    <div className="mb-12">
                                        <div className="flex items-baseline gap-2">
                                            <div className="text-5xl md:text-6xl font-black text-white tracking-tighter">
                                                {plan.price > 0 ? (
                                                    tServices('item_labels.pricing_from_format', {
                                                        price: getPriceString(plan.price)
                                                    })
                                                ) : (
                                                    locale === 'hu' ? 'Egyedi' : 'Custom'
                                                )}
                                            </div>
                                        </div>
                                        <p className="text-white/20 font-black uppercase tracking-widest text-[10px] mt-4">{plan.sub}</p>
                                    </div>

                                    <div className="flex-1 space-y-4 mb-12">
                                        {plan.features.map((feature, j) => (
                                            <div key={j} className="flex items-start gap-3 group/item">
                                                <div className="mt-1 h-5 w-5 rounded-full bg-white/[0.05] flex items-center justify-center group-hover/item:bg-primary/20 transition-colors">
                                                    <CheckCircle2 className="h-3 w-3 text-primary" />
                                                </div>
                                                <span className="text-white/60 font-medium group-hover/item:text-white transition-colors text-sm">{feature}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="pt-8 border-t border-white/5 mt-auto">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-3">
                                            {locale === 'hu' ? 'Ajánlott célcsoport:' : 'Recommended for:'}
                                        </p>
                                        <p className="text-sm italic text-white/40 mb-8 min-h-[40px]">{plan.duration}</p>
                                        
                                        <Button className={`w-full h-16 rounded-2xl text-lg font-black uppercase tracking-tight transition-all duration-500 ${plan.popular ? 'bg-primary hover:bg-primary/90 text-white shadow-[0_20px_40px_-10px_rgba(6,182,212,0.4)] hover:scale-[1.02]' : 'bg-white/[0.05] hover:bg-white/[0.1] text-white border border-white/10 hover:scale-[1.02]'}`} asChild>
                                            <Link href={getCtaLink(plan.name)}>
                                                {locale === 'hu' ? 'Ajánlatot kérek' : 'Request a quote'}
                                                <ArrowRight className="ml-3 h-6 w-6" />
                                            </Link>
                                        </Button>
                                    </div>
                                </SpotlightCard>
                            </motion.div>
                        ))}
                    </div>

                    <div className="mt-12 text-center max-w-2xl mx-auto">
                        <p className="text-xs text-white/30 font-medium leading-relaxed">
                            {locale === 'hu' 
                                ? '* A licencek, hirdetési költések, cloud provider díjak, külső SaaS előfizetések és extra integrációk nincsenek benne az árakban.'
                                : '* Licenses, ad spend, cloud provider costs, third-party SaaS subscriptions, and custom API integrations are not included in the prices.'
                            }
                        </p>
                    </div>
                </div>
            </section>

            {/* "Hogyan dolgozunk?" Section */}
            <section className="py-24 md:py-32 relative bg-slate-950/40 border-t border-b border-white/5 overflow-hidden">
                <div className="container mx-auto px-4 relative z-10">
                    <div className="text-center mb-20">
                        <FadeIn>
                            <h2 className="text-4xl md:text-7xl font-black text-white tracking-tighter mb-6">
                                {t("how_we_work_title")}
                            </h2>
                            <p className="text-xl text-white/40 max-w-3xl mx-auto font-medium">
                                {t("how_we_work_desc")}
                            </p>
                        </FadeIn>
                    </div>

                    <div className="max-w-4xl mx-auto relative">
                        {/* Timeline vertical bar */}
                        <div className="absolute left-[39px] top-8 bottom-8 w-0.5 bg-gradient-to-b from-primary via-purple-500 to-primary/20 hidden md:block" />

                        <div className="space-y-12">
                            {steps.map((step, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -30 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    viewport={{ once: true }}
                                    className="flex flex-col md:flex-row gap-6 md:gap-10 relative group"
                                >
                                    {/* Number / Node */}
                                    <div className="h-20 w-20 rounded-2xl bg-[#090d16] border-2 border-white/10 flex items-center justify-center text-primary font-black text-2xl group-hover:border-primary group-hover:shadow-[0_0_20px_rgba(6,182,212,0.2)] transition-all z-10 shrink-0">
                                        0{i + 1}
                                    </div>
                                    <div className="bg-white/[0.01] border border-white/5 rounded-3xl p-8 flex-1 group-hover:bg-white/[0.03] group-hover:border-white/10 transition-all">
                                        <h3 className="text-2xl font-black text-white mb-3 group-hover:text-primary transition-colors">{step.title}</h3>
                                        <p className="text-white/40 text-base font-medium leading-relaxed">{step.description}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-24 md:py-32 relative bg-transparent overflow-hidden">
                <div className="container mx-auto px-4 relative z-10">
                    <div className="text-center mb-20">
                        <FadeIn>
                            <h2 className="text-4xl md:text-7xl font-black text-white tracking-tighter mb-6">
                                {t("faq_title")}
                            </h2>
                            <p className="text-xl text-white/40 max-w-2xl mx-auto font-medium">
                                {t("faq_desc")}
                            </p>
                        </FadeIn>
                    </div>

                    <div className="max-w-3xl mx-auto space-y-4">
                        {faqItems.map((faq, index) => (
                            <div
                                key={index}
                                className="bg-white/[0.01] border border-white/10 rounded-[24px] overflow-hidden hover:border-white/15 transition-all shadow-sm"
                            >
                                <button
                                    onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                                    className="w-full px-8 py-6 flex items-center justify-between text-left hover:bg-white/[0.02] transition-colors"
                                >
                                    <span className="font-black text-lg text-white pr-8">{faq.question}</span>
                                    <ChevronDown
                                        className={`h-5 w-5 text-white/40 shrink-0 transition-transform duration-300 ${openFaqIndex === index ? 'rotate-180 text-primary' : ''
                                            }`}
                                    />
                                </button>

                                <AnimatePresence initial={false}>
                                    {openFaqIndex === index && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3, ease: "easeInOut" }}
                                        >
                                            <div className="px-8 pb-6 pt-2 border-t border-white/5">
                                                <p className="text-white/50 leading-relaxed font-medium">
                                                    {faq.answer}
                                                </p>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Bottom Lead CTA - Ultra Premium */}
            <section className="relative py-32 overflow-hidden bg-transparent">
                <div className="absolute inset-0 bg-primary/5" />
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />
                <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />

                <div className="container relative z-10 mx-auto px-4">
                    <div className="relative p-12 md:p-24 rounded-[64px] bg-white/[0.02] border border-white/10 backdrop-blur-3xl text-center overflow-hidden shadow-2xl transition-transform hover:scale-[1.01] duration-700">
                        <div className="absolute -top-10 -right-10 p-12 pointer-events-none">
                            <Sparkles className="h-32 w-32 text-primary opacity-5 animate-pulse" />
                        </div>

                        <FadeIn>
                            <div className="inline-flex items-center gap-3 px-6 py-2.5 mb-10 text-[11px] font-black tracking-[0.4em] uppercase rounded-full bg-white/[0.03] text-primary border border-white/10">
                                <span className="relative flex h-2.5 w-2.5">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-400"></span>
                                </span>
                                {tCommon("free_consultation_available")}
                            </div>

                            <h2 className="text-3xl md:text-8xl font-black mb-10 text-white tracking-tighter leading-[0.85]">
                                {t("cta_title")}
                            </h2>
                            <p className="text-lg md:text-2xl text-white/40 mb-14 md:mb-20 max-w-3xl mx-auto font-medium leading-relaxed">
                                {tCommon("cta_description")}
                            </p>

                            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                                <Button size="lg" className="h-20 px-14 text-2xl font-black uppercase tracking-tight bg-white text-slate-950 hover:bg-white/90 hover:scale-105 transition-all duration-500 rounded-2xl shadow-[0_20px_40px_-10px_rgba(255,255,255,0.4)]" asChild>
                                    <Link href={getCtaLink()} className="flex items-center">
                                        {locale === 'hu' ? 'Ajánlatot kérek' : 'Request a quote'}
                                        <ArrowRight className="ml-4 h-8 w-8" />
                                    </Link>
                                </Button>
                                <Button size="lg" variant="ghost" className="h-20 px-14 text-2xl font-black uppercase tracking-tight text-white/60 hover:text-white hover:bg-white/5 border border-white/10 rounded-2xl transition-all duration-500 hover:border-white/20" asChild>
                                    <Link href="/konzultacio">
                                        {locale === 'hu' ? 'Ingyenes konzultáció' : 'Free consultation'}
                                    </Link>
                                </Button>
                            </div>
                        </FadeIn>
                    </div>
                </div>
            </section>
        </div>
    )
}
