"use client"

import { ServiceLayout } from "@/components/templates/service-layout"
import { UseCases } from "@/components/sections/use-cases"
import { ShoppingCart, Globe, Rocket, Building2, Smartphone, Zap, CheckCircle2, ArrowRight, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Link } from "@/i18n/routing"
import { useTranslations } from "next-intl"
import { PriceDisplay } from "@/components/price-display"
import { motion } from "framer-motion"
import { FadeIn } from "@/components/ui/motion-wrapper"
import { SpotlightCard } from "@/components/ui/spotlight-card"
import { useCurrency } from "@/components/currency-provider"
import { formatPrice } from "@/lib/currency"

export function WebDevelopmentClient() {
    const t = useTranslations("Services.WebDev")
    const tServices = useTranslations("ServicesPage")
    const { currency, rates } = useCurrency()

    const getPriceString = (amount: number) => {
        const val = amount / (rates['HUF'] || 1) * (rates[currency] || 1)
        return formatPrice(val, currency)
    }

    const projectTypes = [
        {
            title: t("project_types_items.0.title"),
            description: t("project_types_items.0.description"),
            icon: Globe,
            example: t("project_types_items.0.example"),
            roi: t("project_types_items.0.roi")
        },
        {
            title: t("project_types_items.1.title"),
            description: t("project_types_items.1.description"),
            icon: ShoppingCart,
            example: t("project_types_items.1.example"),
            roi: t("project_types_items.1.roi")
        },
        {
            title: t("project_types_items.2.title"),
            description: t("project_types_items.2.description"),
            icon: Rocket,
            example: t("project_types_items.2.example"),
            roi: t("project_types_items.2.roi")
        },
        {
            title: t("project_types_items.3.title"),
            description: t("project_types_items.3.description"),
            icon: Building2,
            example: t("project_types_items.3.example"),
            roi: t("project_types_items.3.roi")
        },
        {
            title: t("project_types_items.4.title"),
            description: t("project_types_items.4.description"),
            icon: Smartphone,
            example: t("project_types_items.4.example"),
            roi: t("project_types_items.4.roi")
        },
        {
            title: t("project_types_items.5.title"),
            description: t("project_types_items.5.description"),
            icon: Zap,
            example: t("project_types_items.5.example"),
            roi: t("project_types_items.5.roi")
        }
    ]

    const plans = [
        {
            name: t("plans.0.name"),
            desc: t("plans.0.desc"),
            price: 150000,
            priceFrom: true,
            sub: t("plans.0.sub"),
            badge: t("plans.0.badge"),
            features: [0, 1, 2, 3, 4, 5, 6].map(i => t(`plans.0.features.${i}`)),
            ideal: t("plans.0.ideal"),
            color: "cyan"
        },
        {
            name: t("plans.1.name"),
            desc: t("plans.1.desc"),
            price: 450000,
            priceFrom: true,
            sub: t("plans.1.sub"),
            badge: t("plans.1.badge"),
            features: [0, 1, 2, 3, 4, 5, 6, 7].map(i => t(`plans.1.features.${i}`)),
            ideal: t("plans.1.ideal"),
            popular: true,
            color: "primary"
        },
        {
            name: t("plans.2.name"),
            desc: t("plans.2.desc"),
            price: 800000,
            sub: t("plans.2.sub"),
            badge: t("plans.2.badge"),
            features: [0, 1, 2, 3, 4, 5, 6, 7].map(i => t(`plans.2.features.${i}`)),
            ideal: t("plans.2.ideal"),
            pricePlus: true,
            color: "purple"
        }
    ]

    const portfolioItems = [
        {
            title: t("portfolio_items.0.title"),
            desc: t("portfolio_items.0.desc"),
            badge: t("portfolio_items.0.badge"),
            icon: Globe,
            gradient: "from-blue-500 to-cyan-400",
            tags: ["Next.js", "Tailwind", "Framer Motion"],
            metric: t("portfolio_conversion"),
            value: "4.2%"
        },
        {
            title: t("portfolio_items.1.title"),
            desc: t("portfolio_items.1.desc"),
            badge: t("portfolio_items.1.badge"),
            icon: ShoppingCart,
            gradient: "from-green-500 to-emerald-400",
            tags: ["WooCommerce", "Stripe", "WordPress"],
            metric: t("portfolio_revenue"),
            value: <PriceDisplay amount={2500000} className="text-primary" />
        },
        {
            title: t("portfolio_items.2.title"),
            desc: t("portfolio_items.2.desc"),
            badge: t("portfolio_items.2.badge"),
            icon: Building2,
            gradient: "from-orange-500 to-red-400",
            tags: ["WordPress", "Custom Theme", "SEO"],
            metric: t("portfolio_traffic"),
            value: "+150%"
        }
    ]

    return (
        <div className="flex flex-col min-h-screen bg-transparent">
            <ServiceLayout
                title={t("title")}
                description={t("description")}
                icon={<ShoppingCart className="h-24 w-24" />}
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
                techStack={["Next.js", "React", "Tailwind CSS", "WordPress", "WooCommerce", "PostgreSQL", "Stripe", "Vercel"]}
                pricing={tServices('item_labels.pricing_from_format', {
                    price: getPriceString(250000)
                })}
            >
                {/* Individual Page Content as Children */}

                {/* Project Types (UseCases) */}
                <UseCases
                    title={t("project_types_title")}
                    description={t("project_types_desc")}
                    cases={projectTypes}
                />

                {/* Extended Portfolio Section */}
                <section className="py-24 md:py-32 relative overflow-hidden bg-transparent">
                    <div className="container mx-auto px-4 relative z-10">
                        <div className="text-center mb-16">
                            <FadeIn>
                                <h2 className="text-4xl md:text-7xl font-black text-white tracking-tighter mb-6">{t("portfolio_title")}</h2>
                                <p className="text-xl text-white/40 max-w-2xl mx-auto">{t("portfolio_desc")}</p>
                            </FadeIn>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                            {portfolioItems.map((item, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="group"
                                >
                                    <SpotlightCard className="h-full bg-white/[0.02] border-white/10 rounded-[40px] overflow-hidden p-0">
                                        <div className={`h-64 bg-gradient-to-br ${item.gradient} flex items-center justify-center relative overflow-hidden`}>
                                            <div className="absolute inset-0 bg-black/20" />
                                            <item.icon className="h-24 w-24 text-white relative z-10 transform group-hover:scale-110 transition-transform duration-700" />
                                            <div className="absolute top-6 left-6">
                                                <Badge className="bg-white/20 backdrop-blur-md border-white/20 text-white font-black">{item.badge}</Badge>
                                            </div>
                                        </div>
                                        <div className="p-8">
                                            <h3 className="text-2xl font-black text-white mb-3">{item.title}</h3>
                                            <p className="text-white/40 mb-8 font-medium line-clamp-2">{item.desc}</p>

                                            <div className="flex flex-wrap gap-2 mb-8">
                                                {item.tags.map((tag, j) => (
                                                    <span key={j} className="px-3 py-1 bg-white/[0.05] border border-white/10 rounded-full text-xs font-bold text-white/60">
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>

                                            <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                                                <span className="text-sm font-black uppercase tracking-wider text-white/20">{item.metric}</span>
                                                <span className="text-lg font-black text-primary">{item.value}</span>
                                            </div>
                                        </div>
                                    </SpotlightCard>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Ultimate Pricing Section */}
                <section className="py-24 md:py-32 relative bg-transparent overflow-hidden">
                    <div className="container mx-auto px-4 relative z-10">
                        <div className="text-center mb-20">
                            <FadeIn>
                                <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 text-[10px] font-black tracking-[0.4em] uppercase rounded-full bg-white/[0.03] text-primary border border-white/10">
                                    <Sparkles className="h-3 w-3" />
                                    {t("pricing_badge")}
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
                                                {t("plans.1.popular")}
                                            </div>
                                        </div>
                                    )}

                                    <SpotlightCard className={`h-full bg-white/[0.02] border-white/10 rounded-[48px] p-10 flex flex-col ${plan.popular ? 'border-primary/50 bg-primary/[0.02]' : ''}`}>
                                        <div className="mb-10">
                                            <Badge className="mb-4 bg-white/[0.05] border-white/10 text-white/60 font-black tracking-widest uppercase text-[10px] py-1.5 px-4">{plan.badge}</Badge>
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
                                                        <PriceDisplay amount={plan.price} className="text-white" />
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
                                            <p className="text-xs italic text-white/20 mb-8">{plan.ideal}</p>
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
