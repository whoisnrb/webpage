'use client'

import { FadeIn } from "@/components/ui/motion-wrapper"
import Image from "next/image"

const technologies = [
    {
        name: 'Vercel',
        logo: 'https://assets.vercel.com/image/upload/v1607554385/repositories/vercel/logo.png',
        category: 'Infrastructure'
    },
    {
        name: 'Next.js',
        logo: 'https://assets.vercel.com/image/upload/v1662130559/nextjs/Icon_dark_background.png',
        category: 'Framework'
    },
    {
        name: 'Cloudflare',
        logo: 'https://www.cloudflare.com/img/logo-cloudflare-dark.svg',
        category: 'Security & CDN'
    },
    {
        name: 'Neon',
        logo: 'https://neon.tech/brand/neon-logo-dark-color.svg',
        category: 'Database'
    },
    {
        name: 'SimplePay',
        logo: 'https://simplepay.hu/wp-content/themes/simplepay/images/logo.svg',
        category: 'Payment (PCI DSS)'
    },
    {
        name: 'GitHub',
        logo: 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png',
        category: 'Development'
    },
    {
        name: 'TypeScript',
        logo: 'https://www.typescriptlang.org/icons/icon-512x512.png',
        category: 'Language'
    },
    {
        name: 'Prisma',
        logo: 'https://www.prisma.io/images/favicon-32x32.png',
        category: 'ORM'
    },
    {
        name: 'n8n',
        logo: 'https://n8n.io/favicon.svg',
        category: 'Automation'
    },
    {
        name: 'Számlázz.hu',
        logo: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 50"><text x="10" y="35" font-family="Arial, sans-serif" font-size="24" font-weight="bold" fill="%23666">Számlázz.hu</text></svg>',
        category: 'Invoicing'
    },
    {
        name: 'Sentry',
        logo: 'https://sentry-brand.storage.googleapis.com/sentry-logo-black.png',
        category: 'Monitoring'
    },
    {
        name: 'Google Analytics',
        logo: 'https://www.gstatic.com/analytics-suite/header/suite/v2/ic_analytics.svg',
        category: 'Analytics'
    }
]

export function TrustedBy() {
    return (
        <section className="py-16 md:py-20 bg-muted/20 border-y">
            <div className="container mx-auto px-4">
                <FadeIn>
                    <div className="text-center mb-12">
                        <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-3">
                            Megbízható Technológiák és Partnerek
                        </h2>
                        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                            Az iparág vezető technológiáival és biztonságos platformjaival dolgozunk
                        </p>
                    </div>
                </FadeIn>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-8 max-w-7xl mx-auto">
                    {technologies.map((tech, index) => (
                        <FadeIn key={tech.name} delay={index * 0.05}>
                            <div className="flex flex-col items-center justify-center p-6 rounded-lg hover:bg-muted/50 transition-all duration-300 group">
                                <div className="relative w-16 h-16 mb-3 grayscale hover:grayscale-0 transition-all duration-300 flex items-center justify-center">
                                    <Image
                                        src={tech.logo}
                                        alt={`${tech.name} logo`}
                                        width={64}
                                        height={64}
                                        className="object-contain max-w-full max-h-full"
                                        unoptimized={tech.logo.startsWith('data:')}
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
                            PCI DSS Compliant | GDPR Compatible | Enterprise Security
                        </div>
                    </div>
                </FadeIn>
            </div>
        </section>
    )
}
