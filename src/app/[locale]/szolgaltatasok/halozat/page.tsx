"use client"

import { NetworkHero } from "@/components/sections/network-hero"
import { Button } from "@/components/ui/button"
import { Link } from "@/i18n/routing"
import { useTranslations } from "next-intl"
import { Lock, Network, Shield, Wifi, CheckCircle2, ArrowRight } from "lucide-react"
import { SpotlightCard } from "@/components/ui/spotlight-card"
import { motion } from "framer-motion"

export default function HalozatPage() {
    const t = useTranslations("Services.Network")
    const tCommon = useTranslations("Common")

    const services = [
        {
            icon: Lock,
            title: t("services.vpn.title"),
            desc: t("services.vpn.desc"),
            features: [0, 1, 2, 3].map(i => t(`services.vpn.features.${i}`))
        },
        {
            icon: Network,
            title: t("services.vlan.title"),
            desc: t("services.vlan.desc"),
            features: [0, 1, 2, 3].map(i => t(`services.vlan.features.${i}`))
        },
        {
            icon: Shield,
            title: t("services.firewall.title"),
            desc: t("services.firewall.desc"),
            features: [0, 1, 2, 3].map(i => t(`services.firewall.features.${i}`))
        },
        {
            icon: Wifi,
            title: t("services.wifi.title"),
            desc: t("services.wifi.desc"),
            features: [0, 1, 2, 3].map(i => t(`services.wifi.features.${i}`))
        }
    ]

    return (
        <div className="flex flex-col min-h-screen bg-transparent">
            {/* Hero with 3D Visualization */}
            <NetworkHero />

            {/* Services Grid */}
            <section className="py-24 md:py-32 relative bg-transparent">
                <div className="container mx-auto px-4 relative z-10">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 text-[10px] font-black tracking-[0.4em] uppercase rounded-full bg-white/[0.03] text-primary border border-white/10">
                            <Network className="h-3 w-3" />
                            {t("subtitle")}
                        </div>
                        <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-6">
                            {t("title")}
                        </h2>
                        <p className="text-xl text-white/40 max-w-2xl mx-auto font-medium">
                            {t("description")}
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                        {services.map((service, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                viewport={{ once: true }}
                            >
                                <SpotlightCard className="h-full bg-white/[0.02] border-white/10 rounded-3xl p-8">
                                    <div className="p-3 inline-block rounded-2xl bg-primary/10 border border-primary/20 mb-6">
                                        <service.icon className="h-8 w-8 text-primary" />
                                    </div>
                                    <h3 className="text-2xl font-black text-white mb-3">{service.title}</h3>
                                    <p className="text-white/60 font-medium mb-6 leading-relaxed">{service.desc}</p>
                                    <ul className="space-y-3">
                                        {service.features.map((feature, i) => (
                                            <li key={i} className="flex items-start gap-3">
                                                <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                                                <span className="text-white/80 text-sm font-medium">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </SpotlightCard>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 md:py-32 relative bg-transparent">
                <div className="container mx-auto px-4 relative z-10">
                    <SpotlightCard className="max-w-4xl mx-auto bg-gradient-to-br from-primary/10 to-transparent border-primary/20 rounded-[48px] p-12 text-center">
                        <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-6">
                            {t("cta_title")}
                        </h2>
                        <p className="text-xl text-white/60 font-medium mb-8 max-w-2xl mx-auto">
                            {t("cta_description")}
                        </p>
                        <div className="flex flex-wrap gap-4 justify-center">
                            <Button
                                size="lg"
                                className="h-16 px-8 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-tight shadow-[0_20px_40px_-10px_rgba(6,182,212,0.4)]"
                                asChild
                            >
                                <Link href="/kapcsolat">
                                    {t("cta_button")} <ArrowRight className="ml-2 h-5 w-5" />
                                </Link>
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                className="h-16 px-8 rounded-2xl border-white/20 hover:bg-white/5 text-white font-bold"
                                asChild
                            >
                                <Link href="/demo">
                                    {t("cta_secondary")}
                                </Link>
                            </Button>
                        </div>
                    </SpotlightCard>
                </div>
            </section>
        </div>
    )
}
