"use client"

import { motion } from "framer-motion"
import { useTranslations } from "next-intl"
import { SpotlightCard } from "@/components/ui/spotlight-card"
import { Trophy, Rocket, Users, Target, ShieldCheck, Zap } from "lucide-react"

export function WhyUs() {
    const t = useTranslations('HomePage')

    const stats = [
        {
            value: "5+",
            title: t('stats_exp_title'),
            desc: t('stats_exp_desc'),
            icon: Trophy,
            color: "rgba(234, 179, 8, 0.15)", // Gold
            delay: 0.1
        },
        {
            value: "50+",
            title: t('stats_projects_title'),
            desc: t('stats_projects_desc'),
            icon: Rocket,
            color: "rgba(6, 182, 212, 0.15)", // Cyan
            delay: 0.2
        },
        {
            value: "100%",
            title: t('stats_satisfaction_title'),
            desc: t('stats_satisfaction_desc'),
            icon: Users,
            color: "rgba(34, 197, 94, 0.15)", // Green
            delay: 0.3
        }
    ]

    return (
        <section className="py-24 md:py-32 relative overflow-hidden bg-transparent">
            {/* Background decorative elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-20">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-4 py-2 mb-6 text-[10px] font-black tracking-[0.4em] uppercase rounded-full bg-white/[0.03] text-primary border border-white/10 backdrop-blur-xl"
                    >
                        <Target className="h-3 w-3" />
                        Excellence
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-6xl font-black tracking-tighter mb-6 text-white"
                    >
                        {t('why_us_title')}
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-white/40 text-lg md:text-xl max-w-2xl mx-auto font-medium"
                    >
                        {t('why_us_desc')}
                    </motion.p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.8, delay: stat.delay }}
                            className="group h-full"
                        >
                            <SpotlightCard
                                className="h-full border border-white/10 bg-white/[0.01] backdrop-blur-3xl rounded-[2.5rem] p-10 flex flex-col items-center text-center hover:border-primary/40 transition-all duration-700 hover:scale-[1.02] hover:shadow-[0_20px_50px_-10px_rgba(0,0,0,0.5)]"
                                spotlightColor={stat.color}
                            >
                                <div className="h-20 w-20 rounded-[1.5rem] bg-white/[0.03] border border-white/10 flex items-center justify-center mb-8 group-hover:bg-primary/10 group-hover:border-primary/50 group-hover:scale-110 transition-all duration-700">
                                    <stat.icon className="h-10 w-10 text-primary" />
                                </div>

                                <div className="text-5xl font-black text-white mb-4 tracking-tighter drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                                    {stat.value}
                                </div>

                                <h3 className="text-xl font-black text-white mb-4 group-hover:text-primary transition-colors duration-500">
                                    {stat.title}
                                </h3>

                                <p className="text-white/40 font-medium leading-relaxed group-hover:text-white/70 transition-all duration-700">
                                    {stat.desc}
                                </p>

                                {/* Bottom decorative bar */}
                                <div className="mt-8 w-12 h-1 bg-white/10 rounded-full group-hover:w-full group-hover:bg-primary/50 transition-all duration-700" />
                            </SpotlightCard>
                        </motion.div>
                    ))}
                </div>

                {/* Trust badges footer inside section */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 }}
                    className="mt-24 flex flex-wrap justify-center gap-12 grayscale opacity-30 hover:grayscale-0 hover:opacity-100 transition-all duration-1000"
                >
                    <div className="flex items-center gap-2">
                        <ShieldCheck className="h-5 w-5" />
                        <span className="text-[10px] font-black uppercase tracking-widest">ISO 27001 Ready</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Zap className="h-5 w-5" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Fast Delivery</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Team Support</span>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}
