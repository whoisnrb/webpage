import { BookingForm } from "@/components/booking-form"
import { Mail, MapPin, Phone, Clock, ArrowUpRight, Zap, Shield, Headphones } from "lucide-react"
import { FadeIn, SlideUp } from "@/components/ui/motion-wrapper"
import { TrustSignals } from "@/components/ui/trust-signals"
import { useTranslations } from "next-intl"
import { routing } from '@/i18n/routing'

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}

export const revalidate = 86400; // 24 hours

export default function ContactPage() {
    const t = useTranslations('Contact')

    return (
        <div className="min-h-screen flex flex-col">
            {/* Hero Section */}
            <section className="relative py-20 md:py-28 overflow-hidden">
                {/* Background Effects */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[120px]" />
                    <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px]" />
                </div>

                <div className="container mx-auto px-4 text-center relative z-10">
                    <FadeIn>
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm text-cyan-400 mb-6">
                            <Headphones className="h-4 w-4" />
                            {t('info_desc').split('.')[0]}
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-5 bg-gradient-to-b from-white to-white/70 bg-clip-text text-transparent">
                            {t('title')}
                        </h1>
                        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                            {t('subtitle')}
                        </p>
                    </FadeIn>
                </div>
            </section>

            {/* Main Content */}
            <section className="pb-20 md:pb-32">
                <div className="container mx-auto px-4">
                    <div className="grid lg:grid-cols-5 gap-10 max-w-6xl mx-auto">

                        {/* Left Column - Contact Info */}
                        <SlideUp className="lg:col-span-2 space-y-6">
                            {/* Contact Cards */}
                            <div className="space-y-4">
                                {/* Email Card */}
                                <div className="group relative rounded-2xl border border-white/10 bg-white/[0.02] p-5 hover:bg-white/[0.04] hover:border-white/15 transition-all duration-500">
                                    <div className="flex items-start gap-4">
                                        <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/20 flex items-center justify-center shrink-0 group-hover:shadow-lg group-hover:shadow-cyan-500/10 transition-shadow">
                                            <Mail className="h-5 w-5 text-cyan-400" />
                                        </div>
                                        <div className="min-w-0">
                                            <h3 className="font-semibold mb-1.5 text-sm">Email</h3>
                                            <a href="mailto:hello@backlineit.hu" className="text-muted-foreground hover:text-cyan-400 transition-colors text-sm flex items-center gap-1 group/link">
                                                {t('email_hello')}
                                                <ArrowUpRight className="h-3 w-3 opacity-0 group-hover/link:opacity-100 transition-opacity" />
                                            </a>
                                            <a href="mailto:support@backlineit.hu" className="text-muted-foreground hover:text-cyan-400 transition-colors text-sm flex items-center gap-1 group/link">
                                                {t('email_support')}
                                                <ArrowUpRight className="h-3 w-3 opacity-0 group-hover/link:opacity-100 transition-opacity" />
                                            </a>
                                        </div>
                                    </div>
                                </div>

                                {/* Phone Card */}
                                <div className="group relative rounded-2xl border border-white/10 bg-white/[0.02] p-5 hover:bg-white/[0.04] hover:border-white/15 transition-all duration-500">
                                    <div className="flex items-start gap-4">
                                        <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 border border-violet-500/20 flex items-center justify-center shrink-0 group-hover:shadow-lg group-hover:shadow-violet-500/10 transition-shadow">
                                            <Phone className="h-5 w-5 text-violet-400" />
                                        </div>
                                        <div className="min-w-0">
                                            <h3 className="font-semibold mb-1.5 text-sm">{t('phone_label')}</h3>
                                            <p className="text-muted-foreground text-sm">{t('phone_soon')}</p>
                                            <div className="flex items-center gap-1.5 mt-1.5">
                                                <Clock className="h-3 w-3 text-white/30" />
                                                <p className="text-xs text-white/30">{t('phone_hours')}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Address Card */}
                                <div className="group relative rounded-2xl border border-white/10 bg-white/[0.02] p-5 hover:bg-white/[0.04] hover:border-white/15 transition-all duration-500">
                                    <div className="flex items-start gap-4">
                                        <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-emerald-500/20 to-green-500/20 border border-emerald-500/20 flex items-center justify-center shrink-0 group-hover:shadow-lg group-hover:shadow-emerald-500/10 transition-shadow">
                                            <MapPin className="h-5 w-5 text-emerald-400" />
                                        </div>
                                        <div className="min-w-0">
                                            <h3 className="font-semibold mb-1.5 text-sm">{t('address_label')}</h3>
                                            <p className="text-muted-foreground text-sm leading-relaxed">
                                                {t('address')}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Stats */}
                            <div className="grid grid-cols-3 gap-3">
                                <div className="text-center p-4 rounded-2xl border border-white/10 bg-white/[0.02]">
                                    <div className="flex items-center justify-center mb-2">
                                        <Zap className="h-5 w-5 text-amber-400" />
                                    </div>
                                    <p className="text-xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">&lt;2h</p>
                                    <p className="text-[11px] text-white/40 mt-0.5">{/* Response time */}Válaszidő</p>
                                </div>
                                <div className="text-center p-4 rounded-2xl border border-white/10 bg-white/[0.02]">
                                    <div className="flex items-center justify-center mb-2">
                                        <Shield className="h-5 w-5 text-emerald-400" />
                                    </div>
                                    <p className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">100%</p>
                                    <p className="text-[11px] text-white/40 mt-0.5">{/* Satisfaction */}Elégedettség</p>
                                </div>
                                <div className="text-center p-4 rounded-2xl border border-white/10 bg-white/[0.02]">
                                    <div className="flex items-center justify-center mb-2">
                                        <Headphones className="h-5 w-5 text-cyan-400" />
                                    </div>
                                    <p className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">24/7</p>
                                    <p className="text-[11px] text-white/40 mt-0.5">{/* Support */}Support</p>
                                </div>
                            </div>

                            {/* Trust Signals */}
                            <div className="pt-4">
                                <TrustSignals variant="default" orientation="vertical" />
                            </div>
                        </SlideUp>

                        {/* Right Column - Booking Form */}
                        <SlideUp delay={0.15} className="lg:col-span-3">
                            <div className="relative">
                                {/* Card glow effect */}
                                <div className="absolute -inset-px rounded-3xl bg-gradient-to-b from-cyan-500/20 via-transparent to-blue-500/20 opacity-0 hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                                <div className="relative rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-sm p-6 md:p-8 overflow-hidden">
                                    {/* Subtle inner gradient */}
                                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />

                                    <div className="relative z-10">
                                        <div className="mb-6">
                                            <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                                                {t('booking_title')}
                                            </h2>
                                            <p className="text-sm text-muted-foreground mt-1">
                                                {/* Quick, easy, free */}
                                                {t('subtitle') || ''}
                                            </p>
                                        </div>
                                        <BookingForm />
                                    </div>
                                </div>
                            </div>
                        </SlideUp>
                    </div>
                </div>
            </section>
        </div>
    )
}
