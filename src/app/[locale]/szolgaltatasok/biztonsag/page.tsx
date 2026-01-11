"use client"

import { ServiceLayout } from "@/components/templates/service-layout"
import { UseCases } from "@/components/sections/use-cases"
import { Shield, Lock, Eye, FileSearch, Server, AlertTriangle, CheckCircle2, ArrowRight, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Link } from "@/i18n/routing"
import { useTranslations } from "next-intl"
import { PriceDisplay } from "@/components/price-display"
import { motion } from "framer-motion"
import { FadeIn, SlideUp } from "@/components/ui/motion-wrapper"
import { SpotlightCard } from "@/components/ui/spotlight-card"

export default function BiztonsagPage() {
    const t = useTranslations("Services.Security")
    const tServices = useTranslations("ServicesPage")

    const useCases = [
        {
            title: t("use_cases_items.0.title"),
            description: t("use_cases_items.0.description"),
            icon: FileSearch,
            example: t("use_cases_items.0.example"),
            roi: t("use_cases_items.0.roi")
        },
        {
            title: t("use_cases_items.1.title"),
            description: t("use_cases_items.1.description"),
            icon: AlertTriangle,
            example: t("use_cases_items.1.example"),
            roi: t("use_cases_items.1.roi")
        },
        {
            title: t("use_cases_items.2.title"),
            description: t("use_cases_items.2.description"),
            icon: Server,
            example: t("use_cases_items.2.example"),
            roi: t("use_cases_items.2.roi")
        },
        {
            title: t("use_cases_items.3.title"),
            description: t("use_cases_items.3.description"),
            icon: Lock,
            example: t("use_cases_items.3.example"),
            roi: t("use_cases_items.3.roi")
        },
        {
            title: t("use_cases_items.4.title"),
            description: t("use_cases_items.4.description"),
            icon: Shield,
            example: t("use_cases_items.4.example"),
            roi: t("use_cases_items.4.roi")
        },
        {
            title: t("use_cases_items.5.title"),
            description: t("use_cases_items.5.description"),
            icon: Eye,
            example: t("use_cases_items.5.example"),
            roi: t("use_cases_items.5.roi")
        }
    ]

    const plans = [
        {
            name: t("plans.base.name"),
            desc: t("plans.base.desc"),
            price: 80000,
            priceFrom: true,
            sub: t("plans.base.sub"),
            features: [0, 1, 2, 3, 4].map(i => t(`plans.base.features.${i}`)),
            duration: t("plans.base.duration_label")
        },
        {
            name: t("plans.detailed.name"),
            desc: t("plans.detailed.desc"),
            price: 150000,
            priceFrom: true,
            sub: t("plans.detailed.sub"),
            badge: t("plans.detailed.badge"),
            popular: true,
            features: [0, 1, 2, 3, 4, 5].map(i => t(`plans.detailed.features.${i}`)),
            duration: t("plans.detailed.duration_label")
        },
        {
            name: t("plans.complex.name"),
            desc: t("plans.complex.desc"),
            priceText: t("plans.complex.price_label"),
            sub: t("plans.complex.price_sub"),
            features: [0, 1, 2, 3, 4, 5].map(i => t(`plans.complex.features.${i}`)),
            duration: t("plans.complex.duration_label")
        }
    ]

    return (
        <div className="flex flex-col min-h-screen bg-transparent">
            <ServiceLayout
                title={t("title")}
                description={t("description")}
                icon={<Shield className="h-24 w-24" />}
                features={[
                    t("hero_features.0"),
                    t("hero_features.1"),
                    t("hero_features.2"),
                    t("hero_features.3"),
                    t("hero_features.4"),
                    t("hero_features.5"),
                    t("hero_features.6"),
                    t("hero_features.7")
                ]}
                benefits={[
                    {
                        title: t("hero_benefits.0.title"),
                        description: t("hero_benefits.0.description")
                    },
                    {
                        title: t("hero_benefits.1.title"),
                        description: t("hero_benefits.1.description")
                    },
                    {
                        title: t("hero_benefits.2.title"),
                        description: t("hero_benefits.2.description")
                    }
                ]}
                techStack={["Kali Linux", "Nmap", "Wireshark", "Metasploit", "Cloudflare", "ModSecurity", "Fail2Ban", "OpenVAS"]}
                pricing={tServices.rich('item_labels.pricing_from_format', {
                    price: () => <PriceDisplay amount={80000} />
                }) as any}
            >
                <UseCases
                    title={t("use_cases_title")}
                    description={t("use_cases_desc")}
                    cases={useCases}
                />

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

                        <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                            {plans.map((plan, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="relative group"
                                >
                                    {plan.popular && (
                                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-20">
                                            <div className="bg-gradient-to-r from-red-500 to-primary text-white text-[10px] font-black uppercase tracking-widest px-6 py-2 rounded-full shadow-xl">
                                                {plan.badge}
                                            </div>
                                        </div>
                                    )}

                                    <SpotlightCard className={`h-full bg-white/[0.02] border-white/10 rounded-[48px] p-10 flex flex-col ${plan.popular ? 'border-primary/50 bg-primary/[0.02]' : ''}`}>
                                        <div className="mb-10">
                                            <h3 className="text-3xl font-black text-white mb-4">{plan.name}</h3>
                                            <p className="text-white/40 font-medium leading-relaxed">{plan.desc}</p>
                                        </div>

                                        <div className="mb-12">
                                            <div className="flex items-baseline gap-2">
                                                <div className="text-6xl font-black text-white tracking-tighter">
                                                    {plan.priceText ? plan.priceText : plan.priceFrom ? (
                                                        tServices.rich('item_labels.pricing_from_format', {
                                                            price: () => <PriceDisplay amount={plan.price!} />
                                                        })
                                                    ) : (
                                                        <PriceDisplay amount={plan.price!} />
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
                                                    <span className="text-white/60 font-medium group-hover/item:text-white transition-colors">{feature}</span>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="pt-8 border-t border-white/5 mt-auto">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-3">{t("plans.base.duration_label")}</p>
                                            <p className="text-sm italic text-white/40 mb-8">{plan.duration}</p>
                                            <Button className={`w-full h-16 rounded-2xl text-lg font-black uppercase tracking-tight transition-all duration-500 ${plan.popular ? 'bg-primary hover:bg-primary/90 text-white shadow-[0_20px_40px_-10px_rgba(6,182,212,0.4)]' : 'bg-white/[0.05] hover:bg-white/[0.1] text-white border border-white/10'}`} asChild>
                                                <Link href="/kapcsolat">
                                                    {t("cta_request_audit")}
                                                    <ArrowRight className="ml-3 h-6 w-6" />
                                                </Link>
                                            </Button>
                                        </div>
                                    </SpotlightCard>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
            </ServiceLayout>
        </div>
    )
}
