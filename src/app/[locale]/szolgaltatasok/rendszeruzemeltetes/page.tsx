import { ServiceLayout } from "@/components/templates/service-layout"
import { PriceCalculator } from "@/components/tools/price-calculator"
import { UseCases } from "@/components/sections/use-cases"
import { Server, Cloud, Shield, Activity, GitBranch, Database } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Link } from "@/i18n/routing"
import { useTranslations } from "next-intl"
import { PriceDisplay } from "@/components/price-display"



export default function RendszeruzemeltetesPage() {
    const t = useTranslations("Services.SysAdmin")
    const tCommon = useTranslations("Common")
    const tServices = useTranslations("ServicesPage")

    const useCases = [
        {
            title: t("use_cases_items.0.title"),
            description: t("use_cases_items.0.description"),
            icon: GitBranch,
            example: t("use_cases_items.0.example"),
            roi: t("use_cases_items.0.roi")
        },
        {
            title: t("use_cases_items.1.title"),
            description: t("use_cases_items.1.description"),
            icon: Cloud,
            example: t("use_cases_items.1.example"),
            roi: t("use_cases_items.1.roi")
        },
        {
            title: t("use_cases_items.2.title"),
            description: t("use_cases_items.2.description"),
            icon: Activity,
            example: t("use_cases_items.2.example"),
            roi: t("use_cases_items.2.roi")
        },
        {
            title: t("use_cases_items.3.title"),
            description: t("use_cases_items.3.description"),
            icon: Database,
            example: t("use_cases_items.3.example"),
            roi: t("use_cases_items.3.roi")
        },
        {
            title: t("use_cases_items.4.title"),
            description: t("use_cases_items.4.description"),
            icon: Server,
            example: t("use_cases_items.4.example"),
            roi: t("use_cases_items.4.roi")
        },
        {
            title: t("use_cases_items.5.title"),
            description: t("use_cases_items.5.description"),
            icon: Shield,
            example: t("use_cases_items.5.example"),
            roi: t("use_cases_items.5.roi")
        }
    ]
    return (
        <div className="flex flex-col min-h-screen">
            <ServiceLayout
                title={t("title")}
                description={t("description")}
                icon={<Server className="h-8 w-8" />}
                features={[
                    t("hero_features.0"),
                    t("hero_features.1"),
                    t("hero_features.2"),
                    t("hero_features.3"),
                    t("hero_features.4"),
                    t("hero_features.5"),
                    t("hero_features.6"),
                    t("hero_features.7")
                ]}
                benefits={[
                    {
                        title: t("hero_benefits.0.title"),
                        description: t("hero_benefits.0.description")
                    },
                    {
                        title: t("hero_benefits.1.title"),
                        description: t("hero_benefits.1.description")
                    },
                    {
                        title: t("hero_benefits.2.title"),
                        description: t("hero_benefits.2.description")
                    },
                    {
                        title: t("hero_benefits.3.title"),
                        description: t("hero_benefits.3.description")
                    }
                ]}
                techStack={["Docker", "Kubernetes", "AWS", "Linux", "Nginx", "Terraform", "Ansible", "GitHub Actions"]}
                pricing={t("plans.enterprise.price_label")}
            />

            {/* Use Cases Section - Premium Dark Design */}
            <section className="relative py-20 md:py-32 overflow-hidden">
                {/* Dark gradient background */}
                <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950" />

                {/* Animated grid pattern */}
                <div className="absolute inset-0 opacity-[0.03]" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h60v60H0z' fill='none' stroke='%2306b6d4' stroke-width='1'/%3E%3C/svg%3E")`,
                    backgroundSize: '60px 60px'
                }} />

                {/* Glow orbs */}
                <div className="absolute top-1/4 left-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-violet-500/10 rounded-full blur-[120px]" />

                <div className="container relative z-10 mx-auto px-4">
                    {/* Section header */}
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full px-4 py-2 mb-6">
                            <Activity className="h-4 w-4 text-cyan-400" />
                            <span className="text-sm font-medium text-cyan-300">{t("use_cases_badge")}</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black text-white mb-4">{t("use_cases_title")}</h2>
                        <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                            {t("use_cases_desc")}
                        </p>
                    </div>

                    {/* Use cases grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {useCases.map((useCase, index) => (
                            <div key={index} className="group relative">
                                {/* Card glow on hover */}
                                <div className="absolute -inset-[1px] bg-gradient-to-r from-cyan-500 to-violet-500 rounded-2xl opacity-0 group-hover:opacity-50 blur-sm transition-opacity duration-500" />

                                <div className="relative bg-slate-900/80 backdrop-blur-xl border border-white/5 rounded-2xl p-6 h-full hover:border-cyan-500/30 transition-colors duration-300">
                                    {/* Icon */}
                                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-violet-500/20 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                                        <useCase.icon className="h-6 w-6 text-cyan-400" />
                                    </div>

                                    <h3 className="text-xl font-bold text-white mb-3">{useCase.title}</h3>
                                    <p className="text-slate-400 mb-4 text-sm leading-relaxed">{useCase.description}</p>

                                    {/* Example box */}
                                    <div className="bg-slate-800/50 rounded-lg p-4 mb-4 border border-slate-700/50">
                                        <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">{t("pricing_example_label")}</p>
                                        <p className="text-sm text-slate-300">{useCase.example}</p>
                                    </div>

                                    {/* ROI badge */}
                                    <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-full px-3 py-1">
                                        <div className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                                        <span className="text-xs font-medium text-green-400">{useCase.roi}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing Section - Premium Design */}
            <section className="relative py-20 md:py-32 overflow-hidden">
                {/* Dark gradient background with different tint */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900" />

                {/* Subtle pattern */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-500/5 via-transparent to-transparent" />

                {/* Floating elements */}
                <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-amber-500/5 rounded-full blur-[100px]" />
                <div className="absolute bottom-1/3 left-1/4 w-80 h-80 bg-cyan-500/5 rounded-full blur-[100px]" />

                <div className="container relative z-10 mx-auto px-4">
                    {/* Section header */}
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-full px-4 py-2 mb-6">
                            <svg className="h-4 w-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-sm font-medium text-amber-300">{t("pricing_badge")}</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black text-white mb-4">{t("pricing_title")}</h2>
                        <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                            {t("pricing_desc")}
                        </p>
                    </div>

                    {/* Pricing cards */}
                    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {/* Alap */}
                        <div className="relative group">
                            <div className="absolute -inset-[1px] bg-gradient-to-b from-slate-700/50 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            <div className="relative bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 h-full">
                                <div className="mb-6">
                                    <h3 className="text-2xl font-bold text-white mb-2">{t("plans.starter.name")}</h3>
                                    <p className="text-slate-400 text-sm">{t("plans.starter.desc")}</p>
                                </div>
                                <div className="mb-8">
                                    <PriceDisplay amount={50000} className="text-5xl font-black text-white" />
                                    <span className="text-slate-500 text-sm ml-1">{tServices("item_labels.pricing_per_month")}</span>
                                </div>
                                <ul className="space-y-4 mb-8">
                                    <li className="flex items-center gap-3 text-slate-300">
                                        <div className="h-5 w-5 rounded-full bg-cyan-500/20 flex items-center justify-center">
                                            <svg className="h-3 w-3 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                        </div>
                                        <span className="text-sm">{t("plans.starter.features.0")}</span>
                                    </li>
                                    <li className="flex items-center gap-3 text-slate-300">
                                        <div className="h-5 w-5 rounded-full bg-cyan-500/20 flex items-center justify-center">
                                            <svg className="h-3 w-3 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                        </div>
                                        <span className="text-sm">{t("plans.starter.features.1")}</span>
                                    </li>
                                    <li className="flex items-center gap-3 text-slate-300">
                                        <div className="h-5 w-5 rounded-full bg-cyan-500/20 flex items-center justify-center">
                                            <svg className="h-3 w-3 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                        </div>
                                        <span className="text-sm">{t("plans.starter.features.2")}</span>
                                    </li>
                                    <li className="flex items-center gap-3 text-slate-300">
                                        <div className="h-5 w-5 rounded-full bg-cyan-500/20 flex items-center justify-center">
                                            <svg className="h-3 w-3 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                        </div>
                                        <span className="text-sm">{t("plans.starter.features.3")}</span>
                                    </li>
                                </ul>
                                <div className="text-xs text-slate-500 mb-6">{t("pricing_reaction_time")}: 24 {tCommon("hours")}</div>
                                <Button className="w-full h-12 bg-slate-800 hover:bg-slate-700 text-white border border-slate-700" asChild>
                                    <Link href="/ajanlatkeres">{t("pricing_select_plan")}</Link>
                                </Button>
                            </div>
                        </div>

                        {/* Pro - Kiemelt */}
                        <div className="relative group">
                            <div className="absolute -inset-[2px] bg-gradient-to-b from-cyan-500 via-violet-500 to-cyan-500 rounded-3xl opacity-75 blur-sm group-hover:opacity-100 transition-opacity duration-300 animate-gradient-x bg-[length:200%_auto]" />
                            <div className="relative bg-slate-900 backdrop-blur-xl rounded-3xl p-8 h-full border border-cyan-500/30">
                                {/* Popular badge */}
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                                    <div className="bg-gradient-to-r from-cyan-500 to-violet-500 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
                                        ⭐ {t("plans.pro.badge")}
                                    </div>
                                </div>
                                <div className="mb-6 mt-2">
                                    <h3 className="text-2xl font-bold text-white mb-2">{t("plans.pro.name")}</h3>
                                    <p className="text-slate-400 text-sm">{t("plans.pro.desc")}</p>
                                </div>
                                <div className="mb-8">
                                    <PriceDisplay amount={100000} className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-400" />
                                    <span className="text-slate-500 text-sm ml-1">{tServices("item_labels.pricing_per_month")}</span>
                                </div>
                                <ul className="space-y-4 mb-8">
                                    <li className="flex items-center gap-3 text-white">
                                        <div className="h-5 w-5 rounded-full bg-gradient-to-r from-cyan-500 to-violet-500 flex items-center justify-center">
                                            <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                        </div>
                                        <span className="text-sm font-medium">{t("plans.pro.features.0")}</span>
                                    </li>
                                    <li className="flex items-center gap-3 text-white">
                                        <div className="h-5 w-5 rounded-full bg-gradient-to-r from-cyan-500 to-violet-500 flex items-center justify-center">
                                            <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                        </div>
                                        <span className="text-sm font-medium">{t("plans.pro.features.1")}</span>
                                    </li>
                                    <li className="flex items-center gap-3 text-white">
                                        <div className="h-5 w-5 rounded-full bg-gradient-to-r from-cyan-500 to-violet-500 flex items-center justify-center">
                                            <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                        </div>
                                        <span className="text-sm font-medium">{t("plans.pro.features.2")}</span>
                                    </li>
                                    <li className="flex items-center gap-3 text-white">
                                        <div className="h-5 w-5 rounded-full bg-gradient-to-r from-cyan-500 to-violet-500 flex items-center justify-center">
                                            <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                        </div>
                                        <span className="text-sm font-medium">{t("plans.pro.features.3")}</span>
                                    </li>
                                    <li className="flex items-center gap-3 text-white">
                                        <div className="h-5 w-5 rounded-full bg-gradient-to-r from-cyan-500 to-violet-500 flex items-center justify-center">
                                            <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                        </div>
                                        <span className="text-sm font-medium">{t("plans.pro.features.4")}</span>
                                    </li>
                                </ul>
                                <div className="text-xs text-cyan-400 mb-6 font-medium">⚡ {t("pricing_reaction_time")}: 4 {tCommon("hours")}</div>
                                <Button className="w-full h-12 bg-gradient-to-r from-cyan-500 to-violet-500 hover:from-cyan-400 hover:to-violet-400 text-white font-bold shadow-lg shadow-cyan-500/25" asChild>
                                    <Link href="/ajanlatkeres">{t("pricing_select_plan")}</Link>
                                </Button>
                            </div>
                        </div>

                        {/* Enterprise */}
                        <div className="relative group">
                            <div className="absolute -inset-[1px] bg-gradient-to-b from-amber-500/30 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            <div className="relative bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 h-full">
                                <div className="mb-6">
                                    <h3 className="text-2xl font-bold text-white mb-2">{t("plans.enterprise.name")}</h3>
                                    <p className="text-slate-400 text-sm">{t("plans.enterprise.desc")}</p>
                                </div>
                                <div className="mb-8">
                                    <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">{t("plans.enterprise.price_label")}</span>
                                    <p className="text-slate-500 text-sm mt-1">{t("plans.enterprise.price_sub")}</p>
                                </div>
                                <ul className="space-y-4 mb-8">
                                    <li className="flex items-center gap-3 text-slate-300">
                                        <div className="h-5 w-5 rounded-full bg-amber-500/20 flex items-center justify-center">
                                            <svg className="h-3 w-3 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                        </div>
                                        <span className="text-sm">{t("plans.enterprise.features.0")}</span>
                                    </li>
                                    <li className="flex items-center gap-3 text-slate-300">
                                        <div className="h-5 w-5 rounded-full bg-amber-500/20 flex items-center justify-center">
                                            <svg className="h-3 w-3 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                        </div>
                                        <span className="text-sm">{t("plans.enterprise.features.1")}</span>
                                    </li>
                                    <li className="flex items-center gap-3 text-slate-300">
                                        <div className="h-5 w-5 rounded-full bg-amber-500/20 flex items-center justify-center">
                                            <svg className="h-3 w-3 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                        </div>
                                        <span className="text-sm">{t("plans.enterprise.features.2")}</span>
                                    </li>
                                    <li className="flex items-center gap-3 text-slate-300">
                                        <div className="h-5 w-5 rounded-full bg-amber-500/20 flex items-center justify-center">
                                            <svg className="h-3 w-3 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                        </div>
                                        <span className="text-sm">{t("plans.enterprise.features.3")}</span>
                                    </li>
                                </ul>
                                <div className="text-xs text-amber-400 mb-6 font-medium">🔥 {t("pricing_reaction_time")}: 1 {tCommon("hours")}</div>
                                <Button className="w-full h-12 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-bold shadow-lg shadow-amber-500/25" asChild>
                                    <Link href="/kapcsolat">{t("pricing_contact_us")}</Link>
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Bottom CTA */}
                    <div className="text-center mt-16">
                        <p className="text-slate-400 mb-6">{t("pricing_help_text")}</p>
                        <Link href="/kapcsolat">
                            <Button size="lg" variant="outline" className="border-slate-600 text-white hover:bg-slate-800">
                                {t("pricing_consultation_cta")}
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            <section className="relative overflow-hidden py-16 md:py-24">
                {/* Background Elements */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
                    <div className="absolute top-20 right-0 w-72 h-72 bg-secondary/10 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
                </div>

                <div className="container relative mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4">{t("cost_title")}</h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            {t("cost_desc")}
                        </p>
                    </div>
                    <PriceCalculator />
                </div>
            </section>
        </div>
    )
}
