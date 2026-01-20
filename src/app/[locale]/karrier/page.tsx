import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Briefcase, Coffee, Laptop, Zap } from "lucide-react"
import { Link } from "@/i18n/routing"
import { useTranslations } from "next-intl"

export default function KarrierPage() {
    const t = useTranslations('Careers')

    return (
        <div className="min-h-screen flex flex-col relative overflow-hidden">
            {/* Background elements */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[150px] opacity-10 animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 rounded-full blur-[150px] opacity-10" />
                <div className="absolute inset-0 bg-grid-slate-200 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-slate-800/50 opacity-20" />
            </div>

            {/* Hero */}
            <section className="py-16 md:py-24 relative z-10">
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
            <section className="py-16 relative z-10">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold mb-12 text-center">{t('benefits_title')}</h2>
                    <div className="grid md:grid-cols-4 gap-8">
                        <div className="text-center p-6 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-sm">
                            <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Laptop className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="font-semibold mb-2">{t('benefits.tech.title')}</h3>
                            <p className="text-sm text-muted-foreground">{t('benefits.tech.desc')}</p>
                        </div>
                        <div className="text-center p-6 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-sm">
                            <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Zap className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="font-semibold mb-2">{t('benefits.growth.title')}</h3>
                            <p className="text-sm text-muted-foreground">{t('benefits.growth.desc')}</p>
                        </div>
                        <div className="text-center p-6 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-sm">
                            <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Briefcase className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="font-semibold mb-2">{t('benefits.flexible.title')}</h3>
                            <p className="text-sm text-muted-foreground">{t('benefits.flexible.desc')}</p>
                        </div>
                        <div className="text-center p-6 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-sm">
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
            <section className="py-16 relative z-10">
                <div className="container mx-auto px-4 max-w-4xl">
                    <h2 className="text-3xl font-bold mb-8 text-center">{t('open_positions')}</h2>
                    <div className="space-y-4">
                        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                            <CardHeader className="flex flex-row items-center justify-between">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <CardTitle className="text-xl">{t('positions.senior_fullstack')}</CardTitle>
                                        <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20">{t('coming_soon')}</Badge>
                                    </div>
                                    <div className="flex gap-2">
                                        <Badge variant="outline" className="text-muted-foreground border-white/20">{t('location.remote')}</Badge>
                                        <Badge variant="outline" className="text-muted-foreground border-white/20">{t('job_type.full_time')}</Badge>
                                    </div>
                                </div>
                                <Button disabled variant="secondary" className="opacity-50">{t('apply')}</Button>
                            </CardHeader>
                        </Card>

                        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                            <CardHeader className="flex flex-row items-center justify-between">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <CardTitle className="text-xl">{t('positions.devops')}</CardTitle>
                                        <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20">{t('coming_soon')}</Badge>
                                    </div>
                                    <div className="flex gap-2">
                                        <Badge variant="outline" className="text-muted-foreground border-white/20">{t('location.hybrid')}</Badge>
                                        <Badge variant="outline" className="text-muted-foreground border-white/20">{t('job_type.full_time')}</Badge>
                                    </div>
                                </div>
                                <Button disabled variant="secondary" className="opacity-50">{t('apply')}</Button>
                            </CardHeader>
                        </Card>

                        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                            <CardHeader className="flex flex-row items-center justify-between">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <CardTitle className="text-xl">{t('positions.junior_python')}</CardTitle>
                                        <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20">{t('coming_soon')}</Badge>
                                    </div>
                                    <div className="flex gap-2">
                                        <Badge variant="outline" className="text-muted-foreground border-white/20">{t('location.office')}</Badge>
                                        <Badge variant="outline" className="text-muted-foreground border-white/20">{t('job_type.intern')}</Badge>
                                    </div>
                                </div>
                                <Button disabled variant="secondary" className="opacity-50">{t('apply')}</Button>
                            </CardHeader>
                        </Card>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-16 text-center relative z-10">
                <div className="container mx-auto px-4">
                    <h2 className="text-2xl font-bold mb-4">{t('spontaneous.title')}</h2>
                    <p className="text-muted-foreground mb-8">
                        {t('spontaneous.description')}
                    </p>
                    <Link href="/karrier/jelentkezes">
                        <Button variant="outline" size="lg" className="bg-transparent border-white/10 hover:bg-white/5">
                            {t('spontaneous.cta')}
                        </Button>
                    </Link>
                </div>
            </section>
        </div>
    )
}
