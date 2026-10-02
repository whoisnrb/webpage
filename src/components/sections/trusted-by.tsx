'use client'

import { motion } from "framer-motion"
import Image from "next/image"
import { useTranslations } from "next-intl"

interface Technology {
    name: string;
    logo: string;
    svg?: React.ReactNode;
    category: string;
}

const technologies: Technology[] = [
    {
        name: 'Microsoft for Startups',
        logo: '/images/tech/microsoft.svg',
        svg: (
            <svg className="w-8 h-8 shrink-0" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="10.8" height="10.8" fill="#F25022"/>
                <rect x="12.2" width="10.8" height="10.8" fill="#7FBA00"/>
                <rect y="12.2" width="10.8" height="10.8" fill="#00A4EF"/>
                <rect x="12.2" y="12.2" width="10.8" height="10.8" fill="#FFB900"/>
            </svg>
        ),
        category: 'Founders Hub Partner'
    },
    {
        name: 'Microsoft Azure',
        logo: '/images/tech/azure.svg',
        svg: (
            <svg className="w-8 h-8 shrink-0" viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="azure-trusted-a" x1="60.919" y1="9.602" x2="18.667" y2="134.423" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#114A8B"/>
                        <stop offset="1" stopColor="#0669BC"/>
                    </linearGradient>
                    <linearGradient id="azure-trusted-b" x1="74.117" y1="67.772" x2="64.344" y2="71.076" gradientUnits="userSpaceOnUse">
                        <stop stopOpacity=".3"/>
                        <stop offset=".071" stopOpacity=".2"/>
                        <stop offset=".321" stopOpacity=".1"/>
                        <stop offset=".623" stopOpacity=".05"/>
                        <stop offset="1" stopOpacity="0"/>
                    </linearGradient>
                    <linearGradient id="azure-trusted-c" x1="68.742" y1="5.961" x2="115.122" y2="129.525" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#3CCBF4"/>
                        <stop offset="1" stopColor="#2892DF"/>
                    </linearGradient>
                </defs>
                <path d="M46.09.002h40.685L44.541 125.137a6.485 6.485 0 01-6.146 4.413H6.733a6.482 6.482 0 01-5.262-2.699 6.474 6.474 0 01-.876-5.848L39.944 4.414A6.488 6.488 0 0146.09 0z" fill="url(#azure-trusted-a)" transform="translate(.587 4.468) scale(.91904)"/>
                <path d="M97.28 81.607H37.987a2.743 2.743 0 00-1.874 4.751l38.1 35.562a5.991 5.991 0 004.087 1.61h33.574z" fill="#0078d4"/>
                <path d="M46.09.002A6.434 6.434 0 0039.93 4.5L.644 120.897a6.469 6.469 0 006.106 8.653h32.48a6.942 6.942 0 005.328-4.531l7.834-23.089 27.985 26.101a6.618 6.618 0 004.165 1.519h36.396l-15.963-45.616-46.533.011L86.922.002z" fill="url(#azure-trusted-b)" transform="translate(.587 4.468) scale(.91904)"/>
                <path d="M98.055 4.408A6.476 6.476 0 0091.917.002H46.575a6.478 6.478 0 016.137 4.406l39.35 116.594a6.476 6.476 0 01-6.137 8.55h45.344a6.48 6.48 0 006.136-8.55z" fill="url(#azure-trusted-c)" transform="translate(.587 4.468) scale(.91904)"/>
            </svg>
        ),
        category: 'Enterprise AI Cloud'
    },
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

            {/* Seamless Infinite Marquee Container */}
            <div className="relative flex overflow-hidden py-10 select-none">
                {/* Fade overlays for the sides */}
                <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
                <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

                <div className="flex flex-nowrap w-max">
                    {[0, 1, 2].map((trackIndex) => (
                        <motion.div
                            key={`track-${trackIndex}`}
                            animate={{
                                x: ["0%", "-100%"],
                            }}
                            transition={{
                                x: {
                                    repeat: Infinity,
                                    repeatType: "loop",
                                    duration: 45,
                                    ease: "linear",
                                },
                            }}
                            className="flex flex-nowrap shrink-0 gap-12 pr-12 items-center"
                            aria-hidden={trackIndex > 0 ? "true" : undefined}
                        >
                            {technologies.map((tech, index) => (
                                <div
                                    key={`${tech.name}-${trackIndex}-${index}`}
                                    className="flex-shrink-0 flex items-center gap-4 bg-white/[0.03] backdrop-blur-3xl border border-white/5 px-8 py-5 rounded-3xl hover:border-primary/40 hover:bg-white/[0.05] transition-all duration-500 group"
                                >
                                    <div className="relative w-10 h-10 flex items-center justify-center grayscale group-hover:grayscale-0 transition-all duration-700">
                                        {tech.svg ? (
                                            tech.svg
                                        ) : (
                                            <Image
                                                src={tech.logo}
                                                alt={tech.name}
                                                width={40}
                                                height={40}
                                                className="object-contain w-full h-full"
                                                unoptimized
                                            />
                                        )}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-white font-black text-sm tracking-tight">{tech.name}</span>
                                        <span className="text-[10px] text-white/30 uppercase font-black tracking-widest leading-none mt-1">{tech.category}</span>
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    ))}
                </div>
            </div>

            <div className="mt-16 flex flex-wrap justify-center items-center gap-4 px-4 text-center">
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

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="inline-flex items-center px-6 py-2.5 rounded-full bg-gradient-to-r from-blue-500/10 via-cyan-500/10 to-transparent backdrop-blur-xl border border-blue-500/30 text-blue-300 text-[10px] font-black uppercase tracking-[0.18em] shadow-2xl hover:border-blue-400/50 transition-colors cursor-default gap-2.5"
                >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="10.8" height="10.8" fill="#F25022"/>
                        <rect x="12.2" width="10.8" height="10.8" fill="#7FBA00"/>
                        <rect y="12.2" width="10.8" height="10.8" fill="#00A4EF"/>
                        <rect x="12.2" y="12.2" width="10.8" height="10.8" fill="#FFB900"/>
                    </svg>
                    <span>Microsoft for Startups Founders Hub Partner</span>
                </motion.div>
            </div>
        </section>
    )
}
