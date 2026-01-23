import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Code2, Server, Shield, ShoppingCart, ArrowRight, CheckCircle2 } from "lucide-react"
import { Link } from "@/i18n/routing"
import { Badge } from "@/components/ui/badge"
import { useTranslations, useLocale } from "next-intl"
import { getTranslations } from "next-intl/server"
import { PriceDisplay } from "@/components/price-display"
import { ServicesHero } from "@/components/sections/services-hero"

// Metadata generation for multilingual support
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'ServicesPage' });

    return {
        title: t('hero_badge') + " | BacklineIT", // Or a specific metadata title key
        description: t('hero_desc'),
    };
}

export default function SzolgaltatasokPage() {
    const t = useTranslations('ServicesPage')
    const locale = useLocale()
    const tCTA = useTranslations('CTA')
    const tStats = useTranslations('Stats')

    const services = [
        {
            title: t('items.scripts.title'),
            description: t('items.scripts.desc'),
            icon: Code2,
            href: "/szolgaltatasok/scriptek",
            pricing: 50000,
            features: [
                t('items.scripts.features.0'),
                t('items.scripts.features.1'),
                t('items.scripts.features.2'),
                t('items.scripts.features.3')
            ]
        },
        {
            title: t('items.webdev.title'),
            description: t('items.webdev.desc'),
            icon: ShoppingCart,
            href: "/szolgaltatasok/webfejlesztes",
            pricing: 150000,
            features: [
                t('items.webdev.features.0'),
                t('items.webdev.features.1'),
                t('items.webdev.features.2'),
                t('items.webdev.features.3')
            ]
        },
        {
            title: t('items.devops.title'),
            description: t('items.devops.desc'),
            icon: Server,
            href: "/szolgaltatasok/rendszeruzemeltetes",
            pricing: 0, // 0 indicates request quote
            features: [
                t('items.devops.features.0'),
                t('items.devops.features.1'),
                t('items.devops.features.2'),
                t('items.devops.features.3')
            ]
        },
        {
            title: t('items.security.title'),
            description: t('items.security.desc'),
            icon: Shield,
            href: "/szolgaltatasok/biztonsag",
            pricing: 80000,
            features: [
                t('items.security.features.0'),
                t('items.security.features.1'),
                t('items.security.features.2'),
                t('items.security.features.3')
            ]
        },
        {
            title: t('items.network.title'),
            description: t('items.network.desc'),
            icon: Server, // Using Server icon temporarily, can be changed
            href: "/szolgaltatasok/halozat",
            pricing: 0, // 0 indicates request quote
            features: [
                t('items.network.features.0'),
                t('items.network.features.1'),
                t('items.network.features.2'),
                t('items.network.features.3')
            ]
        }
    ]

    return (
        <>
            {/* Hero Section */}
            <ServicesHero
                badge={t('hero_badge')}
                title={t('hero_title')}
                titleHighlight={t('hero_title_highlight')}
                description={t('hero_desc')}
                ctaQuote={t('cta_quote')}
                ctaServices={t('cta_services')}
            />

            {/* Services Grid */}
            <section id="szolgaltatasok" className="py-20 md:py-32">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                            {t('list_title')}
                        </h2>
                        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                            {t('list_desc')}
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                        {services.map((service, index) => {
                            const Icon = service.icon
                            return (
                                <Card key={index} className="flex flex-col border-2 hover:border-primary/50 transition-all hover:shadow-lg group">
                                    <CardHeader>
                                        <div className="flex items-start justify-between">
                                            <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                                                <Icon className="h-7 w-7" />
                                            </div>
                                            <Badge variant="outline" className="text-primary border-primary/20">
                                                {service.pricing > 0 ? (
                                                    <div className="flex items-center gap-1">
                                                        {locale === 'hu' ? (
                                                            <>
                                                                <PriceDisplay amount={service.pricing} className="font-bold" />
                                                                <span className="text-[10px] opacity-70">{t('item_labels.pricing_from')}</span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <span className="text-[10px] opacity-70">{t('item_labels.pricing_from')}</span>
                                                                <PriceDisplay amount={service.pricing} className="font-bold" />
                                                            </>
                                                        )}
                                                    </div>
                                                ) : (
                                                    t('item_labels.pricing_custom')
                                                )}
                                            </Badge>
                                        </div>
                                        <CardTitle className="text-2xl mb-2">{service.title}</CardTitle>
                                        <CardDescription className="text-base leading-relaxed">
                                            {service.description}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="flex-1 flex flex-col">
                                        <div className="flex-1">
                                            <h4 className="font-semibold mb-3 text-sm uppercase tracking-wider text-muted-foreground">{t('item_labels.whats_included')}</h4>
                                            <ul className="space-y-3 mb-8">
                                                {service.features.map((feature, idx) => (
                                                    <li key={idx} className="flex items-start gap-3 text-sm">
                                                        <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                                                        <span>{feature}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        <Link href={service.href} className="mt-auto">
                                            <Button className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors" variant="outline">
                                                {t('item_labels.details_and_order')} <ArrowRight className="ml-2 h-4 w-4" />
                                            </Button>
                                        </Link>
                                    </CardContent>
                                </Card>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* Tech Stack / Why Us */}
            <section className="py-20 md:py-32 bg-slate-950 text-white overflow-hidden relative">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black opacity-80" />
                <div className="container relative mx-auto px-4">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">
                                {t('why_us_title')}
                            </h2>
                            <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                                {t('why_us_lead')}
                            </p>

                            <div className="space-y-6">
                                <div className="flex gap-4">
                                    <div className="h-12 w-12 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0">
                                        <Code2 className="h-6 w-6 text-blue-400" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-xl mb-1">{t('reasons.tech.title')}</h3>
                                        <p className="text-slate-400">{t('reasons.tech.desc')}</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="h-12 w-12 rounded-full bg-green-500/20 flex items-center justify-center shrink-0">
                                        <Shield className="h-6 w-6 text-green-400" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-xl mb-1">{t('reasons.security.title')}</h3>
                                        <p className="text-slate-400">{t('reasons.security.desc')}</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="h-12 w-12 rounded-full bg-purple-500/20 flex items-center justify-center shrink-0">
                                        <Server className="h-6 w-6 text-purple-400" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-xl mb-1">{t('reasons.scale.title')}</h3>
                                        <p className="text-slate-400">{t('reasons.scale.desc')}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur-2xl opacity-30" />
                            <div className="relative bg-slate-900 border border-slate-800 rounded-2xl p-8">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-slate-800/50 p-6 rounded-xl text-center">
                                        <div className="text-4xl font-bold text-blue-400 mb-2">100%</div>
                                        <div className="text-sm text-slate-400">{t('stats.deadline')}</div>
                                    </div>
                                    <div className="bg-slate-800/50 p-6 rounded-xl text-center">
                                        <div className="text-4xl font-bold text-purple-400 mb-2">24/7</div>
                                        <div className="text-sm text-slate-400">{t('stats.monitoring')}</div>
                                    </div>
                                    <div className="bg-slate-800/50 p-6 rounded-xl text-center">
                                        <div className="text-4xl font-bold text-green-400 mb-2">50+</div>
                                        <div className="text-sm text-slate-400">{t('stats.projects')}</div>
                                    </div>
                                    <div className="bg-slate-800/50 p-6 rounded-xl text-center">
                                        <div className="text-4xl font-bold text-yellow-400 mb-2">5.0</div>
                                        <div className="text-sm text-slate-400">{t('stats.rating')}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section - Neural Network Compatible Premium Design */}
            <section className="relative py-24 md:py-40 overflow-hidden">
                {/* Transparent to blend with neural background - just subtle overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-950/50 to-transparent" />

                {/* Animated hexagon grid pattern */}
                <div className="absolute inset-0 opacity-[0.03]" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l25.98 15v30L30 60 4.02 45V15z' fill='none' stroke='%2306b6d4' stroke-width='1'/%3E%3C/svg%3E")`,
                    backgroundSize: '60px 60px'
                }} />

                {/* Animated gradient orbs that match neural colors */}
                <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[400px] h-[400px] bg-violet-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />

                {/* Floating particles */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {[...Array(6)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute w-1 h-1 bg-cyan-400 rounded-full animate-float opacity-60"
                            style={{
                                left: `${15 + i * 15}%`,
                                top: `${20 + (i % 3) * 25}%`,
                                animationDelay: `${i * 0.5}s`,
                                animationDuration: `${3 + i * 0.5}s`
                            }}
                        />
                    ))}
                </div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-5xl mx-auto">
                        {/* Main holographic card */}
                        <div className="relative group">
                            {/* Animated border gradient */}
                            <div className="absolute -inset-[2px] bg-gradient-to-r from-cyan-500 via-violet-500 to-cyan-500 rounded-3xl opacity-75 blur-sm group-hover:opacity-100 transition-opacity duration-500 animate-gradient-x bg-[length:200%_auto]" />

                            {/* Card content */}
                            <div className="relative bg-slate-950/90 backdrop-blur-2xl rounded-3xl border border-white/5 overflow-hidden">
                                {/* Top accent line */}
                                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />

                                {/* Inner glow */}
                                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-violet-500/5" />

                                <div className="relative p-10 md:p-16 lg:p-20">
                                    {/* Status indicator */}
                                    <div className="flex justify-center mb-10">
                                        <div className="inline-flex items-center gap-3 bg-cyan-500/10 backdrop-blur-sm border border-cyan-500/20 rounded-full px-6 py-3">
                                            <div className="relative">
                                                <div className="w-3 h-3 bg-cyan-400 rounded-full" />
                                                <div className="absolute inset-0 w-3 h-3 bg-cyan-400 rounded-full animate-ping" />
                                            </div>
                                            <span className="text-sm font-semibold text-cyan-300 tracking-wide uppercase">{tCTA('available_capacity')}</span>
                                            <div className="w-px h-4 bg-cyan-500/30" />
                                            <span className="text-sm text-cyan-400/80">2 {tCTA('project_slots')}</span>
                                        </div>
                                    </div>

                                    {/* Main headline */}
                                    <h2 className="text-center mb-8">
                                        <span className="block text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-white mb-2">
                                            {t('cta_bottom_title')}
                                        </span>
                                        <span className="block text-2xl md:text-3xl font-light text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-400">
                                            {tCTA('build_future')}
                                        </span>
                                    </h2>

                                    <p className="text-center text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed">
                                        {t('cta_bottom_desc')}
                                    </p>

                                    {/* CTA Buttons */}
                                    <div className="flex flex-col sm:flex-row gap-5 justify-center items-center mb-16">
                                        {/* Primary - Glowing cyan button */}
                                        <Link href="/demo">
                                            <Button size="lg" className="group relative h-16 px-12 text-lg font-bold overflow-hidden">
                                                {/* Button glow */}
                                                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-cyan-400 transition-all duration-300 group-hover:scale-105" />
                                                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-cyan-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                                <div className="absolute inset-0 shadow-[0_0_40px_rgba(6,182,212,0.5)] group-hover:shadow-[0_0_60px_rgba(6,182,212,0.7)] transition-shadow duration-300" />
                                                <span className="relative flex items-center text-slate-950 font-bold">
                                                    {t('cta_consultation')}
                                                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-2 transition-transform duration-300" />
                                                </span>
                                            </Button>
                                        </Link>

                                        {/* Secondary - Ghost button with border animation */}
                                        <Link href="/arak">
                                            <Button size="lg" className="group relative h-16 px-12 text-lg font-bold bg-transparent overflow-hidden">
                                                {/* Animated border */}
                                                <div className="absolute inset-0 rounded-md">
                                                    <div className="absolute inset-0 rounded-md border-2 border-violet-500/50 group-hover:border-violet-400 transition-colors duration-300" />
                                                    <div className="absolute inset-[-2px] rounded-md bg-gradient-to-r from-violet-500 to-cyan-500 opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300" />
                                                </div>
                                                <span className="relative flex items-center text-white">
                                                    {t('cta_packages')}
                                                    <svg className="ml-2 h-5 w-5 group-hover:rotate-12 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                </span>
                                            </Button>
                                        </Link>
                                    </div>

                                    {/* Stats with animated counters look */}
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-10 border-t border-white/5">
                                        <div className="text-center group/stat">
                                            <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-b from-cyan-300 to-cyan-500 mb-2 group-hover/stat:scale-110 transition-transform">50+</div>
                                            <div className="text-sm text-slate-500 uppercase tracking-wider">{tStats('successful_projects')}</div>
                                        </div>
                                        <div className="text-center group/stat">
                                            <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-b from-violet-300 to-violet-500 mb-2 group-hover/stat:scale-110 transition-transform">100%</div>
                                            <div className="text-sm text-slate-500 uppercase tracking-wider">{tStats('satisfaction')}</div>
                                        </div>
                                        <div className="text-center group/stat">
                                            <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-b from-cyan-300 to-cyan-500 mb-2 group-hover/stat:scale-110 transition-transform">&lt;24h</div>
                                            <div className="text-sm text-slate-500 uppercase tracking-wider">{tStats('response_time')}</div>
                                        </div>
                                        <div className="text-center group/stat">
                                            <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-b from-violet-300 to-violet-500 mb-2 group-hover/stat:scale-110 transition-transform">5.0★</div>
                                            <div className="text-sm text-slate-500 uppercase tracking-wider">{tStats('rating')}</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Bottom accent line */}
                                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500 to-transparent" />
                            </div>
                        </div>

                        {/* Trust badges below */}
                        <div className="mt-12 flex flex-wrap justify-center gap-6 text-slate-500 text-sm">
                            <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm rounded-full px-4 py-2">
                                <svg className="h-4 w-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span>{tStats('ssl_security')}</span>
                            </div>
                            <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm rounded-full px-4 py-2">
                                <svg className="h-4 w-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span>{tStats('gdpr_compliant')}</span>
                            </div>
                            <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm rounded-full px-4 py-2">
                                <svg className="h-4 w-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span>{tStats('no_hidden_costs')}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}
