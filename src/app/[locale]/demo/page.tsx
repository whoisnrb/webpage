import { BookingForm } from "@/components/booking-form"
import { Card } from "@/components/ui/card"
import { CheckCircle2, Calendar, MessageSquare, Zap, Shield, TrendingUp } from "lucide-react"
import { useTranslations } from "next-intl"
import { getTranslations } from "next-intl/server"
import { routing } from '@/i18n/routing'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'DemoPage.metadata' });

    return {
        title: t('title'),
        description: t('description'),
        keywords: t('keywords').split(', ')
    }
}

export default function DemoPage() {
    const t = useTranslations('DemoPage')

    const benefits = [
        {
            key: 'consultation',
            icon: Calendar
        },
        {
            key: 'expert',
            icon: MessageSquare
        },
        {
            key: 'fast',
            icon: Zap
        },
        {
            key: 'no_obligation',
            icon: Shield
        },
        {
            key: 'growth',
            icon: TrendingUp
        }
    ]

    const faqIndices = ['0', '1', '2', '3', '4', '5'];

    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-20 md:py-32">
                <div className="absolute inset-0 bg-grid-slate-200 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-slate-800/50" />
                <div className="container relative mx-auto px-4 text-center">
                    <div className="inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium text-primary mb-6 bg-primary/10 backdrop-blur-sm border-primary/20">
                        <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse" />
                        {t('hero.badge')}
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 leading-tight">
                        {t('hero.title_1')} <br className="hidden md:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary/80 to-secondary">
                            {t('hero.title_2')}
                        </span>
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
                        {t('hero.description')}
                    </p>

                    {/* Benefits Grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto mt-16">
                        {benefits.slice(0, 3).map((benefit, index) => {
                            const Icon = benefit.icon
                            return (
                                <Card key={index} className="p-6 border-2 hover:border-primary/50 transition-colors">
                                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 mx-auto">
                                        <Icon className="h-6 w-6 text-primary" />
                                    </div>
                                    <h3 className="font-semibold text-lg mb-2">{t(`benefits.${benefit.key}.title`)}</h3>
                                    <p className="text-muted-foreground text-sm">{t(`benefits.${benefit.key}.desc`)}</p>
                                </Card>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* Booking Form Section */}
            <section className="py-20 md:py-32">
                <div className="container mx-auto px-4">
                    <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto items-start">
                        {/* Left Side - Additional Benefits */}
                        <div className="space-y-8">
                            <div>
                                <h2 className="text-3xl font-bold tracking-tight mb-4">
                                    {t('booking.title')}
                                </h2>
                                <p className="text-muted-foreground text-lg">
                                    {t('booking.desc')}
                                </p>
                            </div>

                            <div className="space-y-4">
                                {benefits.map((benefit, index) => {
                                    const Icon = benefit.icon
                                    return (
                                        <div key={index} className="flex gap-4 items-start">
                                            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                                <Icon className="h-5 w-5 text-primary" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold mb-1">{t(`benefits.${benefit.key}.title`)}</h3>
                                                <p className="text-muted-foreground text-sm">{t(`benefits.${benefit.key}.desc`)}</p>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>

                            <div className="bg-muted/50 p-6 rounded-xl border">
                                <div className="flex items-center gap-2 mb-3">
                                    <CheckCircle2 className="h-5 w-5 text-primary" />
                                    <span className="font-semibold">{t('booking.confidential_title')}</span>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    {t('booking.confidential_desc')}
                                </p>
                            </div>
                        </div>

                        {/* Right Side - Booking Form */}
                        <div className="lg:sticky lg:top-8">
                            <Card className="p-8 border-2 shadow-lg">
                                <div className="mb-6">
                                    <h3 className="text-2xl font-bold mb-2">{t('booking.form_title')}</h3>
                                    <p className="text-muted-foreground">
                                        {t('booking.form_desc')}
                                    </p>
                                </div>
                                <BookingForm />
                            </Card>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-20 md:py-32 bg-muted/30">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                                {t('faq.title')}
                            </h2>
                            <p className="text-muted-foreground text-lg">
                                {t('faq.desc')}
                            </p>
                        </div>

                        <Accordion type="single" collapsible className="space-y-4">
                            {faqIndices.map((index) => (
                                <AccordionItem
                                    key={index}
                                    value={`item-${index}`}
                                    className="bg-card border rounded-lg px-6"
                                >
                                    <AccordionTrigger className="hover:no-underline text-left">
                                        <span className="font-semibold">{t(`faq.items.${index}.question`)}</span>
                                    </AccordionTrigger>
                                    <AccordionContent className="text-muted-foreground">
                                        {t(`faq.items.${index}.answer`)}
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </div>
                </div>
            </section>
        </div>
    )
}
