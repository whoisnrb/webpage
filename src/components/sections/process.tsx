"use client"

import { motion } from "framer-motion"
import { useTranslations } from "next-intl"
import { MessageSquare, FileText, Code2, CheckCircle, ArrowRight } from "lucide-react"

export function Process() {
    const t = useTranslations('HomePage')

    const steps = [
        {
            title: t('process_1_title'),
            desc: t('process_1_desc'),
            icon: MessageSquare,
            color: "text-blue-400",
            bg: "bg-blue-500/10"
        },
        {
            title: t('process_2_title'),
            desc: t('process_2_desc'),
            icon: FileText,
            color: "text-purple-400",
            bg: "bg-purple-500/10"
        },
        {
            title: t('process_3_title'),
            desc: t('process_3_desc'),
            icon: Code2,
            color: "text-cyan-400",
            bg: "bg-cyan-500/10"
        },
        {
            title: t('process_4_title'),
            desc: t('process_4_desc'),
            icon: CheckCircle,
            color: "text-emerald-400",
            bg: "bg-emerald-500/10"
        }
    ]

    return (
        <section className="py-24 md:py-32 relative bg-transparent overflow-hidden">
            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-24">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-6xl font-black tracking-tighter mb-6 text-white"
                    >
                        {t('process_title')}
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-white/40 text-lg md:text-xl max-w-2xl mx-auto font-medium"
                    >
                        {t('process_desc')}
                    </motion.p>
                </div>

                <div className="relative grid md:grid-cols-4 gap-12 max-w-7xl mx-auto">
                    {/* Progress line for Desktop */}
                    <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent hidden md:block -translate-y-12" />

                    {steps.map((step, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.15 }}
                            className="relative group text-center"
                        >
                            <div className="relative z-10 mb-8 inline-flex items-center justify-center">
                                {/* Step Number Overlay */}
                                <div className="absolute -top-4 -right-4 h-8 w-8 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl flex items-center justify-center text-[10px] font-black text-white/40 group-hover:text-primary transition-colors">
                                    0{index + 1}
                                </div>

                                <div className={`h-24 w-24 rounded-[2rem] ${step.bg} border border-white/5 flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-700 shadow-2xl`}>
                                    <step.icon className={`h-10 w-10 ${step.color} group-hover:scale-110 transition-transform`} />
                                </div>

                                {index < steps.length - 1 && (
                                    <div className="absolute -right-8 top-1/2 -translate-y-1/2 hidden md:block">
                                        <ArrowRight className="h-5 w-5 text-white/10 group-hover:text-primary/40 transition-colors" />
                                    </div>
                                )}
                            </div>

                            <h3 className="text-2xl font-black text-white mb-4 tracking-tight group-hover:text-primary transition-colors">
                                {step.title}
                            </h3>
                            <p className="text-white/40 font-medium leading-relaxed group-hover:text-white/70 transition-all duration-700 px-4">
                                {step.desc}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
