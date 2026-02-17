import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight } from "lucide-react"
import { Link } from "@/i18n/routing"
import { caseStudies } from "@/lib/case-studies-data"
import { useTranslations } from "next-intl"
import { routing } from '@/i18n/routing'

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}

export const revalidate = 86400; // 24 hours

export default function ReferenciakPage() {
    const t = useTranslations('References')

    const studies = [
        {
            ...caseStudies[0],
            title: t('items.webshop.title'),
            client: t('items.webshop.client'),
            category: t('items.webshop.category'),
            description: t('items.webshop.description'),
        },
        {
            ...caseStudies[1],
            title: t('items.patient.title'),
            client: t('items.patient.client'),
            category: t('items.patient.category'),
            description: t('items.patient.description'),
        },
        {
            ...caseStudies[2],
            title: t('items.server.title'),
            client: t('items.server.client'),
            category: t('items.server.category'),
            description: t('items.server.description'),
        },
        {
            ...caseStudies[3],
            title: t('items.infrastructure.title'),
            client: t('items.infrastructure.client'),
            category: t('items.infrastructure.category'),
            description: t('items.infrastructure.description'),
        },
    ]

    return (
        <div className="min-h-screen flex flex-col">
            <section className="bg-muted/30 py-20 md:py-32 border-b relative overflow-hidden">
                <div className="absolute inset-0 bg-grid-slate-200 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-slate-800/50" />
                <div className="container relative mx-auto px-4 text-center">
                    <Badge className="mb-4" variant="outline">{t('badge')}</Badge>
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">{t('title')}</h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        {t('description')}
                    </p>
                </div>
            </section>

            <section className="py-20 md:py-32">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {studies.map((study, index) => (
                            <Link href={`/referenciak/${study.slug}`} key={index} className="group h-full">
                                <Card className="flex flex-col h-full overflow-hidden hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/20 cursor-pointer">
                                    <div className={`h-56 w-full flex items-center justify-center relative overflow-hidden ${!study.image.startsWith('/') ? study.image : ''}`}>
                                        {study.image.startsWith('/') ? (
                                            <img
                                                src={study.image}
                                                alt={study.title}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                            />
                                        ) : (
                                            <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors" />
                                        )}
                                        {/* Placeholder text only if no image */}
                                        {!study.image.startsWith('/') && (
                                            <div className="text-center p-6 relative z-10">
                                                <div className="font-bold text-2xl opacity-20 uppercase tracking-widest text-foreground">{study.client.split(' ')[0]}</div>
                                            </div>
                                        )}
                                    </div>
                                    <CardHeader>
                                        <div className="flex justify-between items-start mb-3">
                                            <Badge variant="secondary" className="mb-2">{study.category}</Badge>
                                        </div>
                                        <CardTitle className="text-2xl mb-2 group-hover:text-primary transition-colors">{study.title}</CardTitle>
                                        <CardDescription className="font-medium text-foreground/80">{study.client}</CardDescription>
                                    </CardHeader>
                                    <CardContent className="flex-1 flex flex-col">
                                        <p className="text-muted-foreground mb-8 flex-1 leading-relaxed">
                                            {study.description}
                                        </p>
                                        <div className="flex flex-wrap gap-2 mb-8">
                                            {study.tags.map((tag, i) => (
                                                <span key={i} className="text-xs bg-muted px-2.5 py-1 rounded-md font-medium text-muted-foreground border">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                        <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                                            {t('view_details')} <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                        </Button>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section - Premium Dark Design */}
            <section className="relative py-24 md:py-36 overflow-hidden">
                {/* Dark gradient background */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />

                {/* Subtle pattern */}
                <div className="absolute inset-0 opacity-[0.02]" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h60v60H0z' fill='none' stroke='%2306b6d4' stroke-width='1'/%3E%3C/svg%3E")`,
                    backgroundSize: '60px 60px'
                }} />

                {/* Animated glow orbs */}
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[150px] animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-violet-500/10 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: '1s' }} />
                <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-emerald-500/5 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />

                <div className="container relative z-10 mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        {/* Holographic card */}
                        <div className="relative">
                            <div className="absolute -inset-[2px] bg-gradient-to-r from-cyan-500 via-violet-500 to-cyan-500 rounded-3xl opacity-50 blur-sm animate-gradient-x bg-[length:200%_auto]" />
                            <div className="relative bg-slate-900/95 backdrop-blur-2xl rounded-3xl p-10 md:p-16 border border-white/5">
                                {/* Top accent line */}
                                <div className="absolute top-0 left-10 right-10 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />

                                <div className="text-center">
                                    {/* Badge */}
                                    <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-5 py-2 mb-8">
                                        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                                        <span className="text-sm font-semibold text-emerald-300">{t('cta.badge')}</span>
                                    </div>

                                    {/* Headline */}
                                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6">
                                        {t('cta.title_1')}
                                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-emerald-400 to-cyan-400">
                                            {t('cta.title_highlight')}
                                        </span>
                                    </h2>
                                    <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed">
                                        {t('cta.description')}
                                    </p>

                                    {/* CTA Buttons */}
                                    <div className="flex flex-col sm:flex-row gap-5 justify-center mb-12">
                                        <Link href="/ajanlatkeres">
                                            <Button size="lg" className="group relative h-16 px-12 text-lg font-bold overflow-hidden border-0 w-full sm:w-auto">
                                                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-emerald-500 to-cyan-500 animate-gradient-x bg-[length:200%_auto]" />
                                                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-emerald-400 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-gradient-x bg-[length:200%_auto]" />
                                                <div className="absolute inset-0 shadow-[0_0_40px_rgba(6,182,212,0.4)] group-hover:shadow-[0_0_60px_rgba(6,182,212,0.6)] transition-shadow duration-300" />
                                                <span className="relative flex items-center text-slate-900 font-bold">
                                                    {t('cta.button_quote')}
                                                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-2 transition-transform duration-300" />
                                                </span>
                                            </Button>
                                        </Link>
                                        <Link href="/kapcsolat">
                                            <Button size="lg" className="group relative h-16 px-12 text-lg font-bold bg-transparent overflow-hidden w-full sm:w-auto">
                                                <div className="absolute inset-0 rounded-md border-2 border-slate-600 group-hover:border-cyan-500/50 transition-colors duration-300" />
                                                <div className="absolute inset-0 bg-white/5 group-hover:bg-cyan-500/10 transition-colors duration-300" />
                                                <span className="relative flex items-center text-white">
                                                    {t('cta.button_contact')}
                                                </span>
                                            </Button>
                                        </Link>
                                    </div>

                                    {/* Stats */}
                                    <div className="grid grid-cols-3 gap-6 pt-10 border-t border-slate-800">
                                        <div className="text-center">
                                            <div className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400 mb-2">50+</div>
                                            <div className="text-sm text-slate-500">{t('cta.stats.projects')}</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 mb-2">100%</div>
                                            <div className="text-sm text-slate-500">{t('cta.stats.satisfied')}</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400 mb-2">5.0★</div>
                                            <div className="text-sm text-slate-500">{t('cta.stats.rating')}</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Bottom accent line */}
                                <div className="absolute bottom-0 left-10 right-10 h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />
                            </div>
                        </div>

                        {/* Trust badges */}
                        <div className="flex flex-wrap justify-center gap-8 mt-12 text-slate-500 text-sm">
                            <div className="flex items-center gap-2">
                                <svg className="h-5 w-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                                <span>{t('cta.trust.quality')}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <svg className="h-5 w-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>{t('cta.trust.response')}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <svg className="h-5 w-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                <span>{t('cta.trust.team')}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
