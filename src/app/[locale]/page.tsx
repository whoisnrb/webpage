import { useTranslations } from 'next-intl';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { Link } from "@/i18n/routing"
import { Hero } from "@/components/sections/hero"
import { ServicesPreview } from "@/components/sections/services-preview"
import { TrustedBy } from "@/components/sections/trusted-by"
import { FadeIn, SlideUp, ScaleIn } from "@/components/ui/motion-wrapper"
import { SpotlightCard } from "@/components/ui/spotlight-card"

export default function Home() {
    const t = useTranslations('HomePage');

    return (
        <div className="flex min-h-screen flex-col">
            <main className="flex-1">
                {/* Hero Section */}
                <Hero />

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
                <section className="py-16 md:py-24 bg-primary text-primary-foreground">
                    <div className="container mx-auto px-4 text-center">
                        <ScaleIn>
                            <h2 className="text-3xl md:text-4xl font-bold mb-6">
                                {t('cta_footer_title')}
                            </h2>
                            <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
                                {t('cta_footer_desc')}
                            </p>
                            <div className="flex flex-wrap gap-4 justify-center">
                                <Link href="/kapcsolat">
                                    <Button size="lg" variant="secondary" className="text-lg px-8">
                                        {t('cta_consultation')} <ArrowRight className="ml-2 h-5 w-5" />
                                    </Button>
                                </Link>
                                <Link href="/arak">
                                    <Button size="lg" variant="outline" className="text-lg px-8 border-primary-foreground/20 hover:bg-primary-foreground/10">
                                        {t('cta_prices')}
                                    </Button>
                                </Link>
                            </div>
                        </ScaleIn>
                    </div>
                </section>
            </main>
        </div>
    )
}

