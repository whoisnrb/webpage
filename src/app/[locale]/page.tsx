import { useTranslations } from 'next-intl';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { Link } from "@/i18n/routing"
import { Hero } from "@/components/sections/hero"
import { ServicesPreview } from "@/components/sections/services-preview"
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
                                            <CardTitle className="text-xl">Év tapasztalat</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-muted-foreground">
                                                Több mint 5 éve dolgozunk IT projekteken, startupokkal és vállalatokkal
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
                                            <CardTitle className="text-xl">Sikeres projekt</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-muted-foreground">
                                                Weboldalak, webshopok, automatizációk és egyedi szoftverek
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
                                            <CardTitle className="text-xl">Ügyfél elégedettség</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-muted-foreground">
                                                Minden ügyfelünk elégedett volt a munkánkkal és ajánl minket tovább
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
                                    <h3 className="font-semibold mb-2">Konzultáció</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Ingyenes konzultáció, ahol megbeszéljük az igényeidet
                                    </p>
                                </div>
                            </FadeIn>

                            <FadeIn delay={0.2}>
                                <div className="text-center">
                                    <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                                        <span className="text-2xl font-bold text-primary">2</span>
                                    </div>
                                    <h3 className="font-semibold mb-2">Ajánlat</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Részletes ajánlat az árral, határidővel és funkcionalitással
                                    </p>
                                </div>
                            </FadeIn>

                            <FadeIn delay={0.3}>
                                <div className="text-center">
                                    <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                                        <span className="text-2xl font-bold text-primary">3</span>
                                    </div>
                                    <h3 className="font-semibold mb-2">Fejlesztés</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Folyamatos egyeztetés és átlátható fejlesztési folyamat
                                    </p>
                                </div>
                            </FadeIn>

                            <FadeIn delay={0.4}>
                                <div className="text-center">
                                    <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                                        <span className="text-2xl font-bold text-primary">4</span>
                                    </div>
                                    <h3 className="font-semibold mb-2">Átadás & Support</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Átadás, képzés és folyamatos support a projekt után
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

