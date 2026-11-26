import { BookingForm } from "@/components/booking-form"
import { CheckCircle2, Calendar, MessageSquare, Zap, Shield, TrendingUp, Mail, Phone } from "lucide-react"
import { getTranslations } from "next-intl/server"
import { routing } from '@/i18n/routing'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { getSeoMetadata } from "@/lib/seo"

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'DemoPage.metadata' });

    return {
        title: t('title'),
        description: t('description'),
        keywords: t('keywords').split(', '),
        ...getSeoMetadata(locale, '/demo')
    }
}

export default async function DemoPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const isEn = locale === 'en';
    const contactEmail = isEn ? 'hello@backlineit.com' : 'hello@backlineit.hu';
    const t = await getTranslations({ locale, namespace: 'DemoPage' });

    const benefits = [
        { key: 'consultation', icon: Calendar },
        { key: 'expert', icon: MessageSquare },
        { key: 'fast', icon: Zap },
        { key: 'no_obligation', icon: Shield },
        { key: 'growth', icon: TrendingUp }
    ];

    const agendaSteps = isEn
        ? [
            { num: "01", title: "Current Bottlenecks & Goals", desc: "We review your existing stack, workflows, and main growth or IT pain points." },
            { num: "02", title: "Concrete Solution Plan", desc: "You get actionable architectural, automation, or security recommendations on the spot." },
            { num: "03", title: "Timeline & Budget Estimate", desc: "We outline realistic next steps and rough budget options — zero obligation." },
        ]
        : [
            { num: "01", title: "Helyzetfelmérés & célok", desc: "Áttekintjük a meglévő rendszereidet, folyamataidat és a fő szűk keresztmetszeteket." },
            { num: "02", title: "Konkrét megoldási javaslat", desc: "Azonnal adunk működő architektúra-, automatizálási vagy biztonsági javaslatokat." },
            { num: "03", title: "Időtáv & költségbecslés", desc: "Tiszta képet kapsz a megvalósításról és várható költségekről — kötelezettség nélkül." },
        ];

    const faqIndices = ['0', '1', '2', '3', '4', '5'];

    return (
        <div className="flex flex-col min-h-screen bg-[#030712] text-white relative overflow-hidden">
            {/* Ambient Glows matching /ajanlatkeres and /kapcsolat */}
            <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[150px] pointer-events-none" />
            <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[160px] pointer-events-none" />

            {/* Compact Hero Section (keeps booking form visible above the fold) */}
            <section className="relative pt-24 md:pt-28 pb-8 md:pb-10 z-10">
                <div className="container mx-auto px-4 text-center max-w-4xl">
                    <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/25 bg-cyan-500/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-cyan-400 mb-4">
                        <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
                        {t('hero.badge')}
                    </div>
                    <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight mb-4 leading-tight text-white">
                        {t('hero.title_1')}{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-cyan-300 to-blue-400">
                            {t('hero.title_2')}
                        </span>
                    </h1>
                    <p className="text-base md:text-lg text-white/60 max-w-2xl mx-auto leading-relaxed">
                        {t('hero.description')}
                    </p>
                </div>
            </section>

            {/* Main Two-Column Booking & Agenda Section */}
            <section className="pb-16 md:pb-24 z-10">
                <div className="container mx-auto px-4">
                    <div className="grid lg:grid-cols-12 gap-8 lg:gap-10 max-w-6xl mx-auto items-start">

                        {/* Left Side - Agenda, Benefits & Confidentiality */}
                        <div className="lg:col-span-6 space-y-6">
                            <div>
                                <h2 className="text-2xl md:text-3xl font-black tracking-tight mb-2 text-white">
                                    {t('booking.title')}
                                </h2>
                                <p className="text-white/60 text-sm md:text-base leading-relaxed">
                                    {t('booking.desc')}
                                </p>
                            </div>

                            {/* 3-Step 30-Min Agenda */}
                            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 md:p-6 space-y-4">
                                <p className="text-xs font-black uppercase tracking-widest text-cyan-400">
                                    {isEn ? "What happens in 30 minutes?" : "Hogyan zajlik a 30 perc?"}
                                </p>
                                <div className="space-y-4">
                                    {agendaSteps.map((step) => (
                                        <div key={step.num} className="flex gap-3.5 items-start">
                                            <span className="h-7 w-7 rounded-lg bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-black flex items-center justify-center shrink-0 mt-0.5">
                                                {step.num}
                                            </span>
                                            <div>
                                                <h3 className="text-sm font-bold text-white">{step.title}</h3>
                                                <p className="text-xs text-white/55 leading-relaxed mt-0.5">{step.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Key Benefits */}
                            <div className="grid sm:grid-cols-2 gap-3">
                                {benefits.slice(0, 4).map((benefit, index) => {
                                    const Icon = benefit.icon
                                    return (
                                        <div key={index} className="flex gap-3 items-start rounded-xl border border-white/10 bg-white/[0.02] p-3.5">
                                            <div className="h-8 w-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0">
                                                <Icon className="h-4 w-4 text-cyan-400" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-xs text-white">{t(`benefits.${benefit.key}.title`)}</h3>
                                                <p className="text-white/50 text-[11px] leading-snug mt-0.5">{t(`benefits.${benefit.key}.desc`)}</p>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>

                            {/* Confidentiality & Direct Contact */}
                            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.04] p-5 space-y-3">
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                                    <span className="font-bold text-sm text-white">{t('booking.confidential_title')}</span>
                                </div>
                                <p className="text-xs text-white/60 leading-relaxed">
                                    {t('booking.confidential_desc')}
                                </p>
                                <div className="pt-2 border-t border-white/10 flex flex-wrap gap-4 text-xs">
                                    <a href={`mailto:${contactEmail}`} className="inline-flex items-center gap-1.5 text-cyan-300 hover:text-cyan-200 transition-colors">
                                        <Mail className="h-3.5 w-3.5 text-cyan-400" />
                                        <span>{contactEmail}</span>
                                    </a>
                                    <a href="tel:+36501034140" className="inline-flex items-center gap-1.5 text-cyan-300 hover:text-cyan-200 transition-colors">
                                        <Phone className="h-3.5 w-3.5 text-cyan-400" />
                                        <span>+36 50 103 4140</span>
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Right Side - Glassmorphic Booking Form */}
                        <div className="lg:col-span-6 lg:sticky lg:top-24">
                            <div className="rounded-3xl border border-white/10 bg-[#06101c]/80 backdrop-blur-2xl p-6 md:p-8 shadow-[0_0_50px_-15px_rgba(6,182,212,0.15)] relative overflow-hidden">
                                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500/60 via-blue-500/60 to-transparent" />
                                <div className="mb-5">
                                    <h3 className="text-xl md:text-2xl font-black text-white mb-1">{t('booking.form_title')}</h3>
                                    <p className="text-white/55 text-sm">
                                        {t('booking.form_desc')}
                                    </p>
                                </div>
                                <BookingForm defaultMode="meeting" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-16 md:py-24 border-t border-white/5 z-10">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto">
                        <div className="text-center mb-10">
                            <h2 className="text-2xl md:text-4xl font-black tracking-tight mb-3 text-white">
                                {t('faq.title')}
                            </h2>
                            <p className="text-white/55 text-base">
                                {t('faq.desc')}
                            </p>
                        </div>

                        <Accordion type="single" collapsible className="space-y-3">
                            {faqIndices.map((index) => (
                                <AccordionItem
                                    key={index}
                                    value={`item-${index}`}
                                    className="rounded-2xl border border-white/10 bg-white/[0.02] px-6 data-[state=open]:border-cyan-500/30 transition-colors"
                                >
                                    <AccordionTrigger className="hover:no-underline text-left text-white font-semibold py-4">
                                        <span>{t(`faq.items.${index}.question`)}</span>
                                    </AccordionTrigger>
                                    <AccordionContent className="text-white/60 text-sm leading-relaxed pb-4">
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
