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
            title: "VPN Megoldások",
            desc: "Biztonságos távoli elérés WireGuard vagy OpenVPN technológiával",
            features: [
                "Site-to-Site VPN kapcsolatok",
                "Remote Access VPN munkatársaknak",
                "Multi-factor authentication (MFA)",
                "Split-tunneling konfiguráció"
            ]
        },
        {
            icon: Network,
            title: "VLAN Szegmentálás",
            desc: "Hálózati elkülönítés a biztonság és teljesítmény növelésére",
            features: [
                "Irodai és szerver hálózat elkülönítése",
                "Vendéghálózat (Guest WiFi) izolálás",
                "IoT eszközök biztonságos kezelése",
                "Inter-VLAN routing szabályok"
            ]
        },
        {
            icon: Shield,
            title: "Tűzfal Menedzsment",
            desc: "Professzionális tűzfal konfiguráció és karbantartás",
            features: [
                "MikroTik / Cisco / pfSense beállítás",
                "DDoS védelem és rate limiting",
                "Port forwarding és NAT szabályok",
                "Folyamatos monitoring és naplózás"
            ]
        },
        {
            icon: Wifi,
            title: "WiFi Menedzsment",
            desc: "Vállalati szintű WiFi hálózat kiépítése és kezelése",
            features: [
                "Ubiquiti UniFi rendszerek",
                "Több SSID, VLAN támogatás",
                "Captive portal (vendég regisztráció)",
                "Roaming optimalizálás"
            ]
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
                            SZOLGÁLTATÁSOK
                        </div>
                        <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-6">
                            Hálózati Szolgáltatásaink
                        </h2>
                        <p className="text-xl text-white/40 max-w-2xl mx-auto font-medium">
                            Professzionális megoldások vállalati hálózatok tervezésére, kiépítésére és üzemeltetésére
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
                            Készen állsz egy biztonságos hálózatra?
                        </h2>
                        <p className="text-xl text-white/60 font-medium mb-8 max-w-2xl mx-auto">
                            Kérj ingyenes konzultációt és beszéljük át a hálózati igényeidet. Nincs kötelezettség, csak hasznos tanácsok.
                        </p>
                        <div className="flex flex-wrap gap-4 justify-center">
                            <Button
                                size="lg"
                                className="h-16 px-8 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-tight shadow-[0_20px_40px_-10px_rgba(6,182,212,0.4)]"
                                asChild
                            >
                                <Link href="/kapcsolat">
                                    Ajánlatkérés <ArrowRight className="ml-2 h-5 w-5" />
                                </Link>
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                className="h-16 px-8 rounded-2xl border-white/20 hover:bg-white/5 text-white font-bold"
                                asChild
                            >
                                <Link href="/demo">
                                    Ingyenes Konzultáció
                                </Link>
                            </Button>
                        </div>
                    </SpotlightCard>
                </div>
            </section>
        </div>
    )
}
