"use client"

import { ServiceLayout } from "@/components/templates/service-layout"
import { UseCases } from "@/components/sections/use-cases"
import { Code2, Database, Mail, Calendar, FileText, Zap, CheckCircle2, ArrowRight, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Link } from "@/i18n/routing"
import { useTranslations } from "next-intl"
import { PriceDisplay } from "@/components/price-display"
import { motion } from "framer-motion"
import { FadeIn, SlideUp } from "@/components/ui/motion-wrapper"
import { SpotlightCard } from "@/components/ui/spotlight-card"
import { useCurrency } from "@/components/currency-provider"
import { formatPrice } from "@/lib/currency"

export function ScriptsClient() {
    const t = useTranslations("Services.Scripts")
    const tServices = useTranslations("ServicesPage")
    const { currency, rates } = useCurrency()

    const getPriceString = (amount: number) => {
        const val = amount / (rates['HUF'] || 1) * (rates[currency] || 1)
        return formatPrice(val, currency)
    }

    const useCases = [
        {
            title: t("use_cases_items.0.title"),
            description: t("use_cases_items.0.description"),
            icon: Mail,
            example: t("use_cases_items.0.example"),
            roi: t("use_cases_items.0.roi")
        },
        {
            title: t("use_cases_items.1.title"),
            description: t("use_cases_items.1.description"),
            icon: Database,
            example: t("use_cases_items.1.example"),
            roi: t("use_cases_items.1.roi")
        },
        {
            title: t("use_cases_items.2.title"),
            description: t("use_cases_items.2.description"),
            icon: FileText,
            example: t("use_cases_items.2.example"),
            roi: t("use_cases_items.2.roi")
        },
        {
            title: t("use_cases_items.3.title"),
            description: t("use_cases_items.3.description"),
            icon: Calendar,
            example: t("use_cases_items.3.example"),
            roi: t("use_cases_items.3.roi")
        },
        {
            title: t("use_cases_items.4.title"),
            description: t("use_cases_items.4.description"),
            icon: Zap,
            example: t("use_cases_items.4.example"),
            roi: t("use_cases_items.4.roi")
        },
        {
            title: t("use_cases_items.5.title"),
            description: t("use_cases_items.5.description"),
            icon: Database,
            example: t("use_cases_items.5.example"),
            roi: t("use_cases_items.5.roi")
        }
    ]

    const plans = [
        {
            name: t("plans.simple.name"),
            desc: t("plans.simple.desc"),
            price: 100000,
            priceFrom: true,
            sub: t("plans.simple.sub"),
            features: [0, 1, 2, 3, 4].map(i => t(`plans.simple.features.${i}`)),
            example: t("plans.simple.example")
        },
        {
            name: t("plans.medium.name"),
            desc: t("plans.medium.desc"),
            price: 275000,
            priceFrom: true,
            sub: t("plans.medium.sub"),
            popular: true,
            features: [0, 1, 2, 3, 4, 5].map(i => t(`plans.medium.features.${i}`)),
            example: t("plans.medium.example")
        },
        {
            name: t("plans.complex.name"),
            desc: t("plans.complex.desc"),
            price: 750000,
            priceFrom: true,
            sub: t("plans.complex.sub"),
            pricePlus: true,
            features: [0, 1, 2, 3, 4, 5].map(i => t(`plans.complex.features.${i}`)),
            example: t("plans.complex.example")
        }
    ]

    return (
        <div className="flex flex-col min-h-screen bg-transparent">
            <ServiceLayout
                title={t("title")}
                description={t("description")}
                icon={<Code2 className="h-24 w-24" />}
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
                techStack={["Python", "Node.js", "n8n", "Docker", "REST API", "GraphQL", "Zapier", "Make"]}
                pricing={tServices('item_labels.pricing_from_format', {
                    price: getPriceString(100000)
                })}
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
                                    {tServices("pricing_badge")}
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
                                            <div className="bg-gradient-to-r from-cyan-500 to-primary text-white text-[10px] font-black uppercase tracking-widest px-6 py-2 rounded-full shadow-xl">
                                                {t("plans.medium.popular")}
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
                                                    {plan.priceFrom ? (
                                                        tServices('item_labels.pricing_from_format', {
                                                            price: getPriceString(plan.price)
                                                        })
                                                    ) : plan.pricePlus ? (
                                                        tServices('item_labels.pricing_plus_format', {
                                                            price: getPriceString(plan.price)
                                                        })
                                                    ) : (
                                                        <PriceDisplay amount={plan.price} />
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
                                            <p className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-3">{tServices("pricing_example_label")}</p>
                                            <p className="text-sm italic text-white/40 mb-8">{plan.example}</p>
                                            <Button className={`w-full h-16 rounded-2xl text-lg font-black uppercase tracking-tight transition-all duration-500 ${plan.popular ? 'bg-primary hover:bg-primary/90 text-white shadow-[0_20px_40px_-10px_rgba(6,182,212,0.4)]' : 'bg-white/[0.05] hover:bg-white/[0.1] text-white border border-white/10'}`} asChild>
                                                <Link href="/kapcsolat">
                                                    {tServices("cta_quote")}
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
