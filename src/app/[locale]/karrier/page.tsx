import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Briefcase, Coffee, Laptop, Zap } from "lucide-react"
import { Link } from "@/i18n/routing"
import { useTranslations } from "next-intl"

export default function KarrierPage() {
    const t = useTranslations('Careers')

    return (
        <div className="min-h-screen flex flex-col">
            {/* Hero */}
            <section className="bg-muted/30 py-16 md:py-24 border-b">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
                        {t('title')}
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        {t('description')}
                    </p>
                </div>
            </section>

            {/* Benefits */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold mb-12 text-center">{t('benefits_title')}</h2>
                    <div className="grid md:grid-cols-4 gap-8">
                        <div className="text-center">
                            <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Laptop className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="font-semibold mb-2">{t('benefits.tech.title')}</h3>
                            <p className="text-sm text-muted-foreground">{t('benefits.tech.desc')}</p>
                        </div>
                        <div className="text-center">
                            <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Zap className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="font-semibold mb-2">{t('benefits.growth.title')}</h3>
                            <p className="text-sm text-muted-foreground">{t('benefits.growth.desc')}</p>
                        </div>
                        <div className="text-center">
                            <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Briefcase className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="font-semibold mb-2">{t('benefits.flexible.title')}</h3>
                            <p className="text-sm text-muted-foreground">{t('benefits.flexible.desc')}</p>
                        </div>
                        <div className="text-center">
                            <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Coffee className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="font-semibold mb-2">{t('benefits.atmosphere.title')}</h3>
                            <p className="text-sm text-muted-foreground">{t('benefits.atmosphere.desc')}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Open Positions */}
            <section className="py-16 bg-muted/30">
                <div className="container mx-auto px-4 max-w-4xl">
                    <h2 className="text-3xl font-bold mb-8 text-center">{t('open_positions')}</h2>
                    <div className="space-y-4">
                        <Card className="opacity-75 border-dashed">
                            <CardHeader className="flex flex-row items-center justify-between">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <CardTitle className="text-xl">{t('positions.senior_fullstack')}</CardTitle>
                                        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">{t('coming_soon')}</Badge>
                                    </div>
                                    <div className="flex gap-2">
                                        <Badge variant="outline" className="text-muted-foreground">{t('location.remote')}</Badge>
                                        <Badge variant="outline" className="text-muted-foreground">{t('job_type.full_time')}</Badge>
                                    </div>
                                </div>
                                <Button disabled variant="secondary">{t('apply')}</Button>
                            </CardHeader>
                        </Card>

                        <Card className="opacity-75 border-dashed">
                            <CardHeader className="flex flex-row items-center justify-between">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <CardTitle className="text-xl">{t('positions.devops')}</CardTitle>
                                        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">{t('coming_soon')}</Badge>
                                    </div>
                                    <div className="flex gap-2">
                                        <Badge variant="outline" className="text-muted-foreground">{t('location.hybrid')}</Badge>
                                        <Badge variant="outline" className="text-muted-foreground">{t('job_type.full_time')}</Badge>
                                    </div>
                                </div>
                                <Button disabled variant="secondary">{t('apply')}</Button>
                            </CardHeader>
                        </Card>

                        <Card className="opacity-75 border-dashed">
                            <CardHeader className="flex flex-row items-center justify-between">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <CardTitle className="text-xl">{t('positions.junior_python')}</CardTitle>
                                        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">{t('coming_soon')}</Badge>
                                    </div>
                                    <div className="flex gap-2">
                                        <Badge variant="outline" className="text-muted-foreground">{t('location.office')}</Badge>
                                        <Badge variant="outline" className="text-muted-foreground">{t('job_type.intern')}</Badge>
                                    </div>
                                </div>
                                <Button disabled variant="secondary">{t('apply')}</Button>
                            </CardHeader>
                        </Card>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-16 text-center">
                <div className="container mx-auto px-4">
                    <h2 className="text-2xl font-bold mb-4">{t('spontaneous.title')}</h2>
                    <p className="text-muted-foreground mb-8">
                        {t('spontaneous.description')}
                    </p>
                    <Link href="/karrier/jelentkezes">
                        <Button variant="outline" size="lg">
                            {t('spontaneous.cta')}
                        </Button>
                    </Link>
                </div>
            </section>
        </div>
    )
}
