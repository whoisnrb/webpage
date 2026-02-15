import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { BookingForm } from "@/components/booking-form"
import { Card, CardContent } from "@/components/ui/card"
import { Mail, MapPin, Phone, Clock } from "lucide-react"
import { FadeIn, SlideUp } from "@/components/ui/motion-wrapper"
import { TrustSignals } from "@/components/ui/trust-signals"
import { useTranslations } from "next-intl"
import { routing } from '@/i18n/routing'

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}

export default function ContactPage() {
    const t = useTranslations('Contact')

    return (
        <div className="min-h-screen flex flex-col">
            <section className="py-16">
                <div className="container mx-auto px-4 text-center">
                    <FadeIn>
                        <h1 className="text-4xl font-bold tracking-tight mb-4">{t('title')}</h1>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            {t('subtitle')}
                        </p>
                    </FadeIn>
                </div>
            </section>

            <section className="py-16 md:py-24">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
                        {/* Contact Info */}
                        <SlideUp className="space-y-8">
                            <div>
                                <h2 className="text-2xl font-bold mb-6">{t('info_title')}</h2>
                                <p className="text-muted-foreground mb-8">
                                    {t('info_desc')}
                                </p>
                            </div>

                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="bg-primary/10 p-3 rounded-lg">
                                        <Mail className="h-6 w-6 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold mb-1">Email</h3>
                                        <p className="text-muted-foreground">{t('email_hello')}</p>
                                        <p className="text-muted-foreground">{t('email_support')}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="bg-primary/10 p-3 rounded-lg">
                                        <Phone className="h-6 w-6 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold mb-1">{t('phone_label')}</h3>
                                        <p className="text-muted-foreground">{t('phone_soon')}</p>
                                        <p className="text-sm text-muted-foreground mt-1">{t('phone_hours')}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="bg-primary/10 p-3 rounded-lg">
                                        <MapPin className="h-6 w-6 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold mb-1">{t('address_label')}</h3>
                                        <p className="text-muted-foreground">
                                            {t('address')}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6 border-t">
                                <TrustSignals variant="default" orientation="vertical" />
                            </div>
                        </SlideUp>

                        {/* Contact Form */}
                        <SlideUp delay={0.2}>
                            <Card>
                                <CardContent className="p-6 md:p-8">
                                    <h2 className="text-2xl font-bold mb-6">{t('booking_title')}</h2>
                                    <BookingForm />
                                </CardContent>
                            </Card>
                        </SlideUp>
                    </div>
                </div>
            </section>
        </div>
    )
}
