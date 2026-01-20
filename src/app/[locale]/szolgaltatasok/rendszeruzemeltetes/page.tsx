"use client"

import { ServiceLayout } from "@/components/templates/service-layout"
import { PriceCalculator } from "@/components/tools/price-calculator"
import { UseCases } from "@/components/sections/use-cases"
import { Server, Cloud, Shield, Activity, GitBranch, Database, CheckCircle2, ArrowRight, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Link } from "@/i18n/routing"
import { useTranslations } from "next-intl"
import { PriceDisplay } from "@/components/price-display"
import { motion } from "framer-motion"
import { FadeIn, SlideUp } from "@/components/ui/motion-wrapper"
import { SpotlightCard } from "@/components/ui/spotlight-card"

export default function RendszeruzemeltetesPage() {
    const t = useTranslations("Services.SysAdmin")
    const tCommon = useTranslations("Common")
    const tServices = useTranslations("ServicesPage")

    const useCases = [
        {
            title: t("use_cases_items.0.title"),
            description: t("use_cases_items.0.description"),
            icon: GitBranch,
            example: t("use_cases_items.0.example"),
            roi: t("use_cases_items.0.roi")
        },
        {
            title: t("use_cases_items.1.title"),
            description: t("use_cases_items.1.description"),
            icon: Cloud,
            example: t("use_cases_items.1.example"),
            roi: t("use_cases_items.1.roi")
        },
        {
            title: t("use_cases_items.2.title"),
            description: t("use_cases_items.2.description"),
            icon: Activity,
            example: t("use_cases_items.2.example"),
            roi: t("use_cases_items.2.roi")
        },
        {
            title: t("use_cases_items.3.title"),
            description: t("use_cases_items.3.description"),
            icon: Database,
            example: t("use_cases_items.3.example"),
            roi: t("use_cases_items.3.roi")
        },
        {
            title: t("use_cases_items.4.title"),
            description: t("use_cases_items.4.description"),
            icon: Server,
            example: t("use_cases_items.4.example"),
            roi: t("use_cases_items.4.roi")
        },
        {
            title: t("use_cases_items.5.title"),
            description: t("use_cases_items.5.description"),
            icon: Shield,
            example: t("use_cases_items.5.example"),
            roi: t("use_cases_items.5.roi")
        }
    ]

    return (
        <div className="flex flex-col min-h-screen bg-transparent">
            <ServiceLayout
                title={t("title")}
                description={t("description")}
                icon={<Server className="h-24 w-24" />}
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
                    },
                    {
                        title: t("hero_benefits.3.title"),
                        description: t("hero_benefits.3.description")
                    }
                ]}
                techStack={["Docker", "Kubernetes", "AWS", "Linux", "Nginx", "Terraform", "Ansible", "GitHub Actions"]}
                pricing={t("plans.enterprise.price_label")}
            >
                {/* Use Cases Section */}
                <UseCases
                    title={t("use_cases_title")}
                    description={t("use_cases_desc")}
                    cases={useCases}
                />

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
                            {/* Starter */}
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                className="relative group"
                            >
                                <SpotlightCard className="h-full bg-white/[0.02] border-white/10 rounded-[48px] p-10 flex flex-col">
                                    <div className="mb-10">
                                        <h3 className="text-3xl font-black text-white mb-4">{t("plans.starter.name")}</h3>
                                        <p className="text-white/40 font-medium leading-relaxed">{t("plans.starter.desc")}</p>
                                    </div>
                                    <div className="mb-12">
                                        <div className="text-6xl font-black text-white tracking-tighter">
                                            {tServices.rich('item_labels.pricing_from_format', {
                                                price: () => <PriceDisplay amount={70000} className="text-white" />
                                            })}
                                        </div>
                                        <p className="text-white/20 font-black uppercase tracking-widest text-[10px] mt-4">{tServices("item_labels.pricing_per_month")}</p>
                                    </div>
                                    <div className="flex-1 space-y-4 mb-12">
                                        {[0, 1, 2, 3].map(i => (
                                            <div key={i} className="flex items-start gap-3">
                                                <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
                                                <span className="text-white/60 font-medium">{t(`plans.starter.features.${i}`)}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="pt-8 border-t border-white/5">
                                        <p className="text-xs text-white/20 mb-8">{t("pricing_reaction_time")}: 24 {tCommon("hours")}</p>
                                        <Button className="w-full h-16 rounded-2xl bg-white/[0.05] hover:bg-white/[0.1] text-white border border-white/10" asChild>
                                            <Link href="/kapcsolat">{t("pricing_select_plan")}</Link>
                                        </Button>
                                    </div>
                                </SpotlightCard>
                            </motion.div>

                            {/* Pro */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                className="relative group z-10"
                            >
                                <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-20">
                                    <div className="bg-gradient-to-r from-cyan-500 to-primary text-white text-[10px] font-black uppercase tracking-widest px-6 py-2 rounded-full shadow-xl">
                                        ⭐ {t("plans.pro.badge")}
                                    </div>
                                </div>
                                <SpotlightCard className="h-full bg-primary/[0.03] border-primary/30 rounded-[48px] p-10 flex flex-col">
                                    <div className="mb-10">
                                        <h3 className="text-3xl font-black text-white mb-4">{t("plans.pro.name")}</h3>
                                        <p className="text-white/40 font-medium leading-relaxed">{t("plans.pro.desc")}</p>
                                    </div>
                                    <div className="mb-12">
                                        <div className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-primary tracking-tighter">
                                            {tServices.rich('item_labels.pricing_from_format', {
                                                price: () => <PriceDisplay amount={175000} className="text-inherit" />
                                            })}
                                        </div>
                                        <p className="text-white/20 font-black uppercase tracking-widest text-[10px] mt-4">{tServices("item_labels.pricing_per_month")}</p>
                                    </div>
                                    <div className="flex-1 space-y-4 mb-12">
                                        {[0, 1, 2, 3, 4].map(i => (
                                            <div key={i} className="flex items-start gap-3">
                                                <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
                                                <span className="text-white font-medium">{t(`plans.pro.features.${i}`)}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="pt-8 border-t border-white/5">
                                        <p className="text-xs text-primary/60 font-bold mb-8">⚡ {t("pricing_reaction_time")}: 4 {tCommon("hours")}</p>
                                        <Button className="w-full h-16 rounded-2xl bg-primary hover:bg-primary/90 text-white shadow-[0_20px_40px_-10px_rgba(6,182,212,0.4)] font-black uppercase tracking-tight" asChild>
                                            <Link href="/kapcsolat">{t("pricing_select_plan")}</Link>
                                        </Button>
                                    </div>
                                </SpotlightCard>
                            </motion.div>

                            {/* Enterprise */}
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                className="relative group"
                            >
                                <SpotlightCard className="h-full bg-white/[0.02] border-white/10 rounded-[48px] p-10 flex flex-col">
                                    <div className="mb-10">
                                        <h3 className="text-3xl font-black text-white mb-4">{t("plans.enterprise.name")}</h3>
                                        <p className="text-white/40 font-medium leading-relaxed">{t("plans.enterprise.desc")}</p>
                                    </div>
                                    <div className="mb-12">
                                        <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400 tracking-tighter">{t("plans.enterprise.price_label")}</div>
                                        <p className="text-white/20 font-black uppercase tracking-widest text-[10px] mt-4">{t("plans.enterprise.price_sub")}</p>
                                    </div>
                                    <div className="flex-1 space-y-4 mb-12">
                                        {[0, 1, 2, 3].map(i => (
                                            <div key={i} className="flex items-start gap-3">
                                                <CheckCircle2 className="h-5 w-5 text-amber-400 mt-0.5" />
                                                <span className="text-white/60 font-medium">{t(`plans.enterprise.features.${i}`)}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="pt-8 border-t border-white/5">
                                        <p className="text-xs text-amber-400/60 font-bold mb-8">🔥 {t("pricing_reaction_time")}: 1 {tCommon("hours")}</p>
                                        <Button className="w-full h-16 rounded-2xl bg-white/[0.05] hover:bg-white/[0.1] text-white border border-white/10 font-black uppercase tracking-tight" asChild>
                                            <Link href="/kapcsolat">{t("pricing_contact_us")}</Link>
                                        </Button>
                                    </div>
                                </SpotlightCard>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Price Calculator Section */}
                <section className="py-24 md:py-32 relative overflow-hidden bg-transparent">
                    <div className="container relative mx-auto px-4 z-10">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-6">{t("cost_title")}</h2>
                            <p className="text-xl text-white/40 max-w-2xl mx-auto font-medium">{t("cost_desc")}</p>
                        </div>
                        <div className="max-w-4xl mx-auto">
                            <SpotlightCard className="bg-white/[0.02] border-white/10 rounded-[48px] p-8 md:p-12">
                                <PriceCalculator />
                            </SpotlightCard>
                        </div>
                    </div>
                </section>
            </ServiceLayout>
        </div>
    )
}
