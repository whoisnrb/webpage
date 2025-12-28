'use client'

import { FadeIn } from "@/components/ui/motion-wrapper"
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
    return (
        <section className="py-16 md:py-20 bg-muted/20 border-y">
            <div className="container mx-auto px-4">
                <FadeIn>
                    <div className="text-center mb-12">
                        <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-3">
                            {t('title')}
                        </h2>
                        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                            {t('subtitle')}
                        </p>
                    </div>
                </FadeIn>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-8 max-w-7xl mx-auto">
                    {technologies.map((tech, index) => (
                        <FadeIn key={tech.name} delay={index * 0.05}>
                            <div className="flex flex-col items-center justify-center p-6 rounded-lg hover:bg-muted/50 transition-all duration-300 group">
                                <div className="relative w-20 h-20 mb-3 opacity-80 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                    <Image
                                        src={tech.logo}
                                        alt={`${tech.name} logo`}
                                        width={80}
                                        height={80}
                                        className="object-contain max-w-full max-h-full"
                                        unoptimized
                                    />
                                </div>
                                <div className="text-center">
                                    <p className="font-semibold text-sm mb-1">{tech.name}</p>
                                    <p className="text-xs text-muted-foreground">{tech.category}</p>
                                </div>
                            </div>
                        </FadeIn>
                    ))}
                </div>

                <FadeIn delay={0.6}>
                    <div className="mt-12 text-center">
                        <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
                            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            {t('security_badge')}
                        </div>
                    </div>
                </FadeIn>
            </div>
        </section>
    )
}
