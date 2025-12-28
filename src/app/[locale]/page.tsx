import { useTranslations } from 'next-intl';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { Link } from "@/i18n/routing"
import { SplitHero } from "@/components/sections/split-hero"
import { ServicesPreview } from "@/components/sections/services-preview"

import { TrustedBy } from "@/components/sections/trusted-by"
import { FadeIn, SlideUp, ScaleIn } from "@/components/ui/motion-wrapper"
import { SpotlightCard } from "@/components/ui/spotlight-card"

export default function Home() {
    const t = useTranslations('HomePage');
    const tST = useTranslations('ServiceTemplate');

    return (
        <div className="flex min-h-screen flex-col">
            <main className="flex-1">


                {/* Hero Section */}
                <SplitHero />

                {/* Services Grid */}
                <ServicesPreview />

                {/* Trusted Technologies & Partners */}
                <TrustedBy />

                {/* Why Choose Us */}
                <section className="py-16 md:py-24 bg-muted/30">
                    <div className="container mx-auto px-4">
                        <FadeIn>
                            <div className="text-center mb-12">
                                <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                                    {t('why_us_title')}
                                </h2>
                                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                                    {t('why_us_desc')}
                                </p>
                            </div>
                        </FadeIn>

                        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                            <ScaleIn delay={0.1}>
                                <div className="h-full">
                                    <SpotlightCard className="text-center h-full border-primary/20 backdrop-blur-sm" spotlightColor="rgba(var(--primary), 0.15)">
                                        <CardHeader>
                                            <div className="text-4xl font-bold text-primary mb-2 drop-shadow-md">5+</div>
                                            <CardTitle className="text-xl">{t('stats_exp_title')}</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-muted-foreground">
                                                {t('stats_exp_desc')}
                                            </p>
                                        </CardContent>
                                    </SpotlightCard>
                                </div>
                            </ScaleIn>

                            <ScaleIn delay={0.2}>
                                <div className="h-full">
                                    <SpotlightCard className="text-center h-full border-primary/20 backdrop-blur-sm" spotlightColor="rgba(var(--primary), 0.15)">
                                        <CardHeader>
                                            <div className="text-4xl font-bold text-primary mb-2 drop-shadow-md">50+</div>
                                            <CardTitle className="text-xl">{t('stats_projects_title')}</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-muted-foreground">
                                                {t('stats_projects_desc')}
                                            </p>
                                        </CardContent>
                                    </SpotlightCard>
                                </div>
                            </ScaleIn>

                            <ScaleIn delay={0.3}>
                                <div className="h-full">
                                    <SpotlightCard className="text-center h-full border-primary/20 backdrop-blur-sm" spotlightColor="rgba(var(--primary), 0.15)">
                                        <CardHeader>
                                            <div className="text-4xl font-bold text-primary mb-2 drop-shadow-md">100%</div>
                                            <CardTitle className="text-xl">{t('stats_satisfaction_title')}</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-muted-foreground">
                                                {t('stats_satisfaction_desc')}
                                            </p>
                                        </CardContent>
                                    </SpotlightCard>
                                </div>
                            </ScaleIn>
                        </div>
                    </div>
                </section>

                {/* Process */}
                <section className="py-16 md:py-24">
                    <div className="container mx-auto px-4">
                        <SlideUp>
                            <div className="text-center mb-12">
                                <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                                    {t('process_title')}
                                </h2>
                                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                                    {t('process_desc')}
                                </p>
                            </div>
                        </SlideUp>

                        <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto">
                            <FadeIn delay={0.1}>
                                <div className="text-center">
                                    <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                                        <span className="text-2xl font-bold text-primary">1</span>
                                    </div>
                                    <h3 className="font-semibold mb-2">{t('process_1_title')}</h3>
                                    <p className="text-sm text-muted-foreground">
                                        {t('process_1_desc')}
                                    </p>
                                </div>
                            </FadeIn>

                            <FadeIn delay={0.2}>
                                <div className="text-center">
                                    <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                                        <span className="text-2xl font-bold text-primary">2</span>
                                    </div>
                                    <h3 className="font-semibold mb-2">{t('process_2_title')}</h3>
                                    <p className="text-sm text-muted-foreground">
                                        {t('process_2_desc')}
                                    </p>
                                </div>
                            </FadeIn>

                            <FadeIn delay={0.3}>
                                <div className="text-center">
                                    <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                                        <span className="text-2xl font-bold text-primary">3</span>
                                    </div>
                                    <h3 className="font-semibold mb-2">{t('process_3_title')}</h3>
                                    <p className="text-sm text-muted-foreground">
                                        {t('process_3_desc')}
                                    </p>
                                </div>
                            </FadeIn>

                            <FadeIn delay={0.4}>
                                <div className="text-center">
                                    <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                                        <span className="text-2xl font-bold text-primary">4</span>
                                    </div>
                                    <h3 className="font-semibold mb-2">{t('process_4_title')}</h3>
                                    <p className="text-sm text-muted-foreground">
                                        {t('process_4_desc')}
                                    </p>
                                </div>
                            </FadeIn>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="relative py-20 md:py-32 overflow-hidden">
                    {/* Premium gradient background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-primary/90 to-slate-900" />

                    {/* Animated mesh gradient overlay */}
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-cyan-500/20 via-transparent to-transparent" />
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-purple-500/20 via-transparent to-transparent" />

                    {/* Dot pattern */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,_rgba(255,255,255,0.07)_1px,_transparent_0)] bg-[length:24px_24px]" />

                    {/* Floating glow orbs */}
                    <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-cyan-400/20 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

                    <div className="container relative z-10 mx-auto px-4 text-center">
                        <ScaleIn>
                            {/* Badge */}
                            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-8">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400"></span>
                                </span>
                                <span className="text-sm font-medium text-white/90">{tST('free_consultation_available')}</span>
                            </div>

                            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 text-white tracking-tight">
                                {t('cta_footer_title')}
                            </h2>
                            <p className="text-xl md:text-2xl text-white/80 mb-12 max-w-3xl mx-auto leading-relaxed">
                                {t('cta_footer_desc')}
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                                {/* Primary CTA Button */}
                                <Link href="/kapcsolat">
                                    <Button size="lg" className="group relative h-14 px-10 text-lg font-bold bg-white text-slate-900 hover:bg-white hover:scale-105 transition-all duration-300 shadow-2xl shadow-white/20">
                                        <span className="relative z-10 flex items-center">
                                            {t('cta_consultation')}
                                            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                        </span>
                                    </Button>
                                </Link>

                                {/* Secondary CTA Button - Árak megtekintése */}
                                <Link href="/arak">
                                    <Button size="lg" className="group relative h-14 px-10 text-lg font-bold bg-transparent border-2 border-amber-400/80 text-amber-300 hover:bg-amber-400/20 hover:border-amber-300 hover:text-amber-200 transition-all duration-300 shadow-lg shadow-amber-500/10">
                                        <span className="flex items-center">
                                            {t('cta_prices')}
                                            <svg className="ml-2 h-5 w-5 group-hover:rotate-12 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </span>
                                    </Button>
                                </Link>
                            </div>

                            {/* Trust indicators */}
                            <div className="mt-12 flex flex-wrap justify-center gap-8 text-white/60 text-sm">
                                <div className="flex items-center gap-2">
                                    <svg className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span>{tST('no_hidden_costs')}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <svg className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span>{tST('satisfaction_guarantee')}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <svg className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span>{tST('fast_response')}</span>
                                </div>
                            </div>
                        </ScaleIn>
                    </div>
                </section>
            </main>
        </div>
    )
}

