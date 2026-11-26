import { getLocalizedProducts } from "@/app/actions/product"
import { ConsultationFormClient } from "./consultation-form-client"
import { getTranslations } from "next-intl/server"
import { routing, Link } from '@/i18n/routing'
import { getSeoMetadata } from "@/lib/seo"
import type { Metadata } from "next"
import { Suspense } from "react"
import { Sparkles, CheckCircle2, Shield, Clock, Calendar, Mail, Phone, Rocket } from "lucide-react"
import { Button } from "@/components/ui/button"

export const revalidate = 3600

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { locale } = await params;
    return {
        title: locale === 'en' ? 'Solution Consultation' : 'Megoldás Konzultáció',
        description: locale === 'en'
            ? 'Request a personalized expert consultation for our IT, automation, or AI solutions and packages.'
            : 'Kérj személyre szabott szakértői konzultációt IT, automatizációs és AI megoldásainkhoz vagy csomagjainkhoz.',
        ...getSeoMetadata(locale, '/konzultacio')
    };
}

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}

interface PageProps {
    params: Promise<{ locale: string }>
}

export default async function ConsultationPage({ params }: PageProps) {
    const { locale } = await params
    const isEn = locale === 'en'
    const contactEmail = isEn ? 'hello@backlineit.com' : 'hello@backlineit.hu'
    const products = await getLocalizedProducts(locale)
    const tQuote = await getTranslations({ locale, namespace: "QuoteRequest" })

    return (
        <div className="min-h-screen bg-[#030712] text-white pt-24 md:pt-28 pb-16 px-4 relative overflow-hidden">
            {/* Ambient Background Lights matching site theme */}
            <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[150px] pointer-events-none" />
            <div className="absolute top-1/2 right-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[160px] pointer-events-none" />

            <div className="container mx-auto max-w-5xl relative z-10">
                {/* Header */}
                <div className="text-center mb-8 md:mb-10">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-cyan-400 text-xs font-black tracking-widest uppercase mb-3">
                        <Sparkles className="h-3.5 w-3.5" />
                        {isEn ? "Solution & Package Consultation" : "Megoldás & Csomag Konzultáció"}
                    </div>

                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mb-3 text-white">
                        {isEn
                            ? "Request a Tailored "
                            : "Kérj személyre szabott "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-cyan-300 to-blue-400">
                            {isEn ? "Solution Consultation" : "szakmai konzultációt"}
                        </span>
                    </h1>

                    <p className="text-sm md:text-base text-white/60 max-w-2xl mx-auto leading-relaxed">
                        {isEn
                            ? "Select the solution or package you are interested in, and our engineers will walk you through rollout steps, integrations, and pricing."
                            : "Válaszd ki az érdeklődésedre számot tartó megoldást vagy csomagot, szakértőink pedig átbeszélik veled a bevezetést és az integrációkat."}
                    </p>
                </div>

                {/* Main Two-Column Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
                    {/* Left Form Card */}
                    <div className="lg:col-span-8">
                        <div className="rounded-3xl border border-white/10 bg-[#06101c]/80 backdrop-blur-2xl p-5 md:p-8 shadow-[0_0_50px_-15px_rgba(6,182,212,0.15)] relative overflow-hidden">
                            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500/60 via-blue-500/60 to-transparent" />
                            <Suspense fallback={
                                <div className="py-12 flex items-center justify-center">
                                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent" />
                                </div>
                            }>
                                <ConsultationFormClient products={products} />
                            </Suspense>
                        </div>
                    </div>

                    {/* Right Trust & Direct Contact Sidebar */}
                    <div className="lg:col-span-4 space-y-4 lg:sticky lg:top-24">
                        <div className="rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-white/[0.01] backdrop-blur-2xl p-5 md:p-6 space-y-4">
                            <div className="flex items-center gap-2 text-cyan-400 text-xs font-black uppercase tracking-wider">
                                <Sparkles className="h-4 w-4" />
                                <span>{tQuote("sidebar.title")}</span>
                            </div>

                            <div className="space-y-3.5">
                                <div className="flex items-start gap-3">
                                    <div className="h-8 w-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0 mt-0.5">
                                        <Rocket className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-white">
                                            {isEn ? "Ready-to-Deploy Modules" : "Kulcsrakész modulok & testreszabás"}
                                        </h4>
                                        <p className="text-xs text-white/50 leading-relaxed mt-0.5">
                                            {isEn
                                                ? "We tailor each package directly to your existing CRM, billing, and stack."
                                                : "Minden csomagot a meglévő CRM-, számlázási és IT-rendszereidhez illesztünk."}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="h-8 w-8 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
                                        <Clock className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-white">
                                            {isEn ? "Reply Within 24 Hours" : "Válasz 24 órán belül"}
                                        </h4>
                                        <p className="text-xs text-white/50 leading-relaxed mt-0.5">
                                            {isEn
                                                ? "An engineer — not a salesperson — reviews your requirements."
                                                : "Közvetlenül fejlesztő / rendszermérnök nézi át az igényedet."}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="h-8 w-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                                        <Shield className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-white">
                                            {isEn ? "100% No Obligation" : "100% kötelezettségmentes"}
                                        </h4>
                                        <p className="text-xs text-white/50 leading-relaxed mt-0.5">
                                            {isEn
                                                ? "Clear roadmap and fixed-price quote before any commitment."
                                                : "Tiszta megvalósítási terv és fix árajánlat bármilyen elköteleződés előtt."}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-3xl border border-cyan-500/20 bg-gradient-to-br from-cyan-500/10 via-blue-500/5 to-transparent p-5 space-y-3">
                            <span className="text-[10px] font-black uppercase tracking-widest text-cyan-400">
                                {isEn ? "Prefer picking a time slot?" : "Inkább időpontot foglalnál?"}
                            </span>
                            <p className="text-xs text-white/60 leading-relaxed">
                                {isEn
                                    ? "Pick a 30-min video call slot directly or reach out via email / phone."
                                    : "Foglalj azonnal szabad 30 perces idősávot a naptárban, vagy írj / hívj minket közvetlenül."}
                            </p>
                            <div className="space-y-1.5 text-xs pt-1">
                                <a href={`mailto:${contactEmail}`} className="flex items-center gap-2 text-cyan-300 hover:text-cyan-200 transition-colors font-medium">
                                    <Mail className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
                                    <span>{contactEmail}</span>
                                </a>
                                <a href="tel:+36501034140" className="flex items-center gap-2 text-cyan-300 hover:text-cyan-200 transition-colors font-medium">
                                    <Phone className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
                                    <span>+36 50 103 4140</span>
                                </a>
                            </div>
                            <Button
                                className="w-full mt-2 h-10 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/10"
                                asChild
                            >
                                <Link href="/demo">
                                    <Calendar className="mr-2 h-3.5 w-3.5 text-cyan-400" />
                                    {isEn ? "Open Calendar" : "Naptár megnyitása"}
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
