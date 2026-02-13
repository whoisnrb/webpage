"use client"

import { ServiceLayout } from "@/components/templates/service-layout"
import { Network, Database, Globe, RefreshCw, Sparkles } from "lucide-react"
import { useTranslations } from "next-intl"
import { FadeIn } from "@/components/ui/motion-wrapper"
import { SpotlightCard } from "@/components/ui/spotlight-card"
import { motion } from "framer-motion"

export function IntegraciokContent() {
    const t = useTranslations("Services.Integrations")
    const tCommon = useTranslations("Common")

    const scenarios = [
        {
            title: t("scenarios.0.title"),
            description: t("scenarios.0.description"),
            icon: Globe
        },
        {
            title: t("scenarios.1.title"),
            description: t("scenarios.1.description"),
            icon: Database
        },
        {
            title: t("scenarios.2.title"),
            description: t("scenarios.2.description"),
            icon: RefreshCw
        }
    ]

    return (
        <div className="flex flex-col min-h-screen bg-transparent">
            <ServiceLayout
                title={t("title")}
                description={t("description")}
                icon={<Network className="h-24 w-24" />}
                features={[
                    t("hero_features.0"),
                    t("hero_features.1"),
                    t("hero_features.2"),
                    t("hero_features.3"),
                    t("hero_features.4"),
                    t("hero_features.5")
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
                techStack={[
                    "Node.js", "Python", "GraphQL", "REST", "Redis", "RabbitMQ", "PostgreSQL", "Docker"
                ]}
                pricing={t("pricing_label")}
            >
                <section className="py-24 md:py-32 relative overflow-hidden bg-transparent">
                    <div className="container mx-auto px-4 relative z-10">
                        <div className="text-center mb-20">
                            <FadeIn>
                                <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 text-[10px] font-black tracking-[0.4em] uppercase rounded-full bg-white/[0.03] text-primary border border-white/10">
                                    <Sparkles className="h-3 w-3" />
                                    {tCommon("use_cases_badge")}
                                </div>
                                <h2 className="text-4xl md:text-7xl font-black text-white tracking-tighter mb-6">
                                    {t("scenarios_title")}
                                </h2>
                            </FadeIn>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
                            {scenarios.map((scenario, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="group"
                                >
                                    <SpotlightCard className="h-full bg-white/[0.02] border-white/10 rounded-[40px] p-10">
                                        <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-8 border border-primary/20 group-hover:bg-primary group-hover:text-white transition-all duration-500">
                                            <scenario.icon className="h-8 w-8" />
                                        </div>
                                        <h3 className="text-2xl font-black text-white mb-4 group-hover:text-primary transition-colors">
                                            {scenario.title}
                                        </h3>
                                        <p className="text-lg text-white/40 font-medium leading-relaxed font-medium">
                                            {scenario.description}
                                        </p>
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
