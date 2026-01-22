"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Cloud, Network, Server, Shield, CheckCircle2 } from "lucide-react"
import { useTranslations } from "next-intl"
import { motion } from "framer-motion"
import { FadeIn } from "@/components/ui/motion-wrapper"
import { SpotlightCard } from "@/components/ui/spotlight-card"

const pillarIcons = {
    virtualization: Cloud,
    network: Network,
    servers: Server,
    security: Shield,
}

const pillarColors = {
    virtualization: "from-cyan-500 to-blue-500",
    network: "from-purple-500 to-pink-500",
    servers: "from-emerald-500 to-teal-500",
    security: "from-orange-500 to-red-500",
}

export function ServicePillars() {
    const t = useTranslations("Services.SysAdmin")

    const pillars = ["virtualization", "network", "servers", "security"] as const

    return (
        <section className="py-24 md:py-32 relative overflow-hidden bg-transparent">
            {/* Background effects */}
            <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[150px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-0 w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-[150px] pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-20">
                    <FadeIn>
                        <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 text-[10px] font-black tracking-[0.4em] uppercase rounded-full bg-white/[0.03] text-primary border border-white/10 backdrop-blur-xl">
                            {t("pillars_badge")}
                        </div>
                        <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-6">
                            {t("pillars_title")}
                        </h2>
                        <p className="text-xl text-white/40 max-w-3xl mx-auto font-medium">
                            {t("pillars_desc")}
                        </p>
                    </FadeIn>
                </div>

                <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                    {pillars.map((pillarKey, index) => {
                        const Icon = pillarIcons[pillarKey]
                        const colorGradient = pillarColors[pillarKey]

                        return (
                            <motion.div
                                key={pillarKey}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="group"
                            >
                                <SpotlightCard className="h-full bg-white/[0.02] border-white/10 rounded-[32px] p-8 hover:bg-white/[0.04] transition-all duration-500">
                                    {/* Header */}
                                    <div className="flex items-start gap-4 mb-6">
                                        <div className={`h-16 w-16 rounded-2xl bg-gradient-to-br ${colorGradient} flex items-center justify-center shadow-lg`}>
                                            <Icon className="h-8 w-8 text-white" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-2xl font-black text-white mb-2 group-hover:text-primary transition-colors">
                                                {t(`pillars.${pillarKey}.title`)}
                                            </h3>
                                            <p className="text-white/40 font-medium leading-relaxed">
                                                {t(`pillars.${pillarKey}.desc`)}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Features */}
                                    <div className="space-y-3 mt-6 pt-6 border-t border-white/10">
                                        {[0, 1, 2, 3].map((i) => (
                                            <div key={i} className="flex items-center gap-3">
                                                <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                                                <span className="text-white/60 font-medium">
                                                    {t(`pillars.${pillarKey}.features.${i}`)}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </SpotlightCard>
                            </motion.div>
                        )
                    })}
                </div>

                {/* Certification Badge */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-16 text-center"
                >
                    <div className="inline-flex items-center gap-4 px-8 py-4 rounded-full bg-primary/10 border border-primary/30 backdrop-blur-xl">
                        <Shield className="h-6 w-6 text-primary" />
                        <div className="text-left">
                            <p className="text-sm font-bold text-primary">{t("certification_badge")}</p>
                            <p className="text-xs text-white/40">{t("certification_desc")}</p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}
