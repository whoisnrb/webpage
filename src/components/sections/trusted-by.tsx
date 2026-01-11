'use client'

import { motion } from "framer-motion"
import Image from "next/image"
import { useTranslations } from "next-intl"

const technologies = [
    {
        name: 'Vercel',
        logo: 'https://cdn.simpleicons.org/vercel/white',
        category: 'Infrastructure'
    },
    {
        name: 'Next.js',
        logo: 'https://cdn.simpleicons.org/nextdotjs/white',
        category: 'Framework'
    },
    {
        name: 'Cloudflare',
        logo: 'https://cdn.simpleicons.org/cloudflare/F38020',
        category: 'Security & CDN'
    },
    {
        name: 'PostgreSQL',
        logo: 'https://cdn.simpleicons.org/postgresql/4169E1',
        category: 'Database (Neon)'
    },
    {
        name: 'Stripe',
        logo: 'https://cdn.simpleicons.org/stripe/008CDD',
        category: 'Payment (PCI DSS)'
    },
    {
        name: 'GitHub',
        logo: 'https://cdn.simpleicons.org/github/white',
        category: 'Development'
    },
    {
        name: 'TypeScript',
        logo: 'https://cdn.simpleicons.org/typescript/3178C6',
        category: 'Language'
    },
    {
        name: 'Prisma',
        logo: 'https://cdn.simpleicons.org/prisma/2D3748',
        category: 'ORM'
    },
    {
        name: 'React',
        logo: 'https://cdn.simpleicons.org/react/61DAFB',
        category: 'UI Library'
    },
    {
        name: 'TailwindCSS',
        logo: 'https://cdn.simpleicons.org/tailwindcss/06B6D4',
        category: 'Styling'
    },
    {
        name: 'Google Analytics',
        logo: 'https://cdn.simpleicons.org/googleanalytics/E37400',
        category: 'Analytics'
    },
    {
        name: 'Google Cloud',
        logo: 'https://cdn.simpleicons.org/googlecloud/4285F4',
        category: 'Services'
    }
]

export function TrustedBy() {
    const t = useTranslations('TrustedBy')

    // Duplicate technologies for smooth infinite loop
    const duplicatedTech = [...technologies, ...technologies, ...technologies]

    return (
        <section className="py-24 relative overflow-hidden bg-transparent">
            <div className="container mx-auto px-4 relative z-10 mb-16">
                <div className="text-center">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-2xl md:text-3xl font-black tracking-tight mb-4 text-white uppercase tracking-[0.2em]"
                    >
                        {t('title')}
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-white/40 text-lg max-w-2xl mx-auto font-medium"
                    >
                        {t('subtitle')}
                    </motion.p>
                </div>
            </div>

            {/* Infinite Marquee Container */}
            <div className="relative flex overflow-hidden py-10 select-none">
                {/* Fade overlays for the sides */}
                <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-background to-transparent z-10" />
                <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-background to-transparent z-10" />

                <motion.div
                    animate={{
                        x: [0, -2000],
                    }}
                    transition={{
                        x: {
                            repeat: Infinity,
                            repeatType: "loop",
                            duration: 40,
                            ease: "linear",
                        },
                    }}
                    className="flex flex-nowrap gap-12 items-center"
                >
                    {duplicatedTech.map((tech, index) => (
                        <div
                            key={`${tech.name}-${index}`}
                            className="flex-shrink-0 flex items-center gap-4 bg-white/[0.03] backdrop-blur-3xl border border-white/5 px-8 py-5 rounded-3xl hover:border-primary/40 hover:bg-white/[0.05] transition-all duration-500 group"
                        >
                            <div className="relative w-10 h-10 grayscale group-hover:grayscale-0 transition-all duration-700">
                                <Image
                                    src={tech.logo}
                                    alt={tech.name}
                                    width={40}
                                    height={40}
                                    className="object-contain w-full h-full"
                                    unoptimized
                                />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-white font-black text-sm tracking-tight">{tech.name}</span>
                                <span className="text-[10px] text-white/30 uppercase font-black tracking-widest leading-none mt-1">{tech.category}</span>
                            </div>
                        </div>
                    ))}
                </motion.div>
            </div>

            <div className="mt-16 text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="inline-flex items-center px-6 py-2.5 rounded-full bg-white/[0.03] backdrop-blur-xl border border-white/10 text-primary/80 text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl hover:border-primary/30 transition-colors cursor-default"
                >
                    <svg className="w-4 h-4 mr-3 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    {t('security_badge')}
                </motion.div>
            </div>
        </section>
    )
}
