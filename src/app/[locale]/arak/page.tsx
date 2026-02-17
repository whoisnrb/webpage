import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { PricingTable } from "@/components/sections/pricing-table"
import { PricingFAQ } from "@/components/sections/pricing-faq"
import { Button } from "@/components/ui/button"
import { ArrowRight, Check } from "lucide-react"
import { Link } from "@/i18n/routing"
import { useTranslations } from "next-intl"
import { routing } from '@/i18n/routing'

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}

export const revalidate = 86400; // 24 hours

export default function ArakPage() {
    const t = useTranslations('PricingPage');

    return (
        <div className="flex min-h-screen flex-col">
            <main className="flex-1">
                {/* Hero Section */}
                <section className="bg-gradient-to-b from-muted/50 to-background py-16 md:py-24 border-b">
                    <div className="container mx-auto px-4 text-center">
                        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
                            {t('hero_title')}<br />
                            <span className="text-primary">{t('hero_title_highlight')}</span>
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
                            {t('hero_desc')}
                        </p>
                        <div className="flex flex-wrap gap-4 justify-center">
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Check className="h-5 w-5 text-primary" />
                                <span>{t('features.no_hidden_fees')}</span>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Check className="h-5 w-5 text-primary" />
                                <span>{t('features.free_consultation')}</span>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Check className="h-5 w-5 text-primary" />
                                <span>{t('features.money_back')}</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Pricing Table */}
                <PricingTable />

                {/* Comparison Table */}
                <section className="py-16 md:py-24 bg-muted/30">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                                {t('comparison_title')}
                            </h2>
                            <p className="text-muted-foreground text-lg">
                                {t('comparison_desc')}
                            </p>
                        </div>

                        <div className="max-w-5xl mx-auto overflow-x-auto">
                            <table className="w-full border-collapse bg-card rounded-lg overflow-hidden shadow-md">
                                <thead>
                                    <tr className="border-b bg-muted/50">
                                        <th className="text-left p-4 font-semibold">{t('table.service')}</th>
                                        <th className="text-center p-4 font-semibold">{t('table.starter')}</th>
                                        <th className="text-center p-4 font-semibold bg-primary/5">{t('table.pro')}</th>
                                        <th className="text-center p-4 font-semibold">{t('table.enterprise')}</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    <tr>
                                        <td className="p-4 font-medium">{t('table.rows.webdev')}</td>
                                        <td className="text-center p-4"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                                        <td className="text-center p-4 bg-primary/5"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                                        <td className="text-center p-4"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                                    </tr>
                                    <tr>
                                        <td className="p-4 font-medium">{t('table.rows.responsive')}</td>
                                        <td className="text-center p-4"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                                        <td className="text-center p-4 bg-primary/5"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                                        <td className="text-center p-4"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                                    </tr>
                                    <tr>
                                        <td className="p-4 font-medium">{t('table.rows.seo')}</td>
                                        <td className="text-center p-4 text-muted-foreground">{t('table.values.basic')}</td>
                                        <td className="text-center p-4 bg-primary/5 text-muted-foreground">{t('table.values.advanced')}</td>
                                        <td className="text-center p-4 text-muted-foreground">{t('table.values.full')}</td>
                                    </tr>
                                    <tr>
                                        <td className="p-4 font-medium">{t('table.rows.shop')}</td>
                                        <td className="text-center p-4 text-muted-foreground">-</td>
                                        <td className="text-center p-4 bg-primary/5"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                                        <td className="text-center p-4"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                                    </tr>
                                    <tr>
                                        <td className="p-4 font-medium">{t('table.rows.automation')}</td>
                                        <td className="text-center p-4 text-muted-foreground">-</td>
                                        <td className="text-center p-4 bg-primary/5"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                                        <td className="text-center p-4"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                                    </tr>
                                    <tr>
                                        <td className="p-4 font-medium">{t('table.rows.security')}</td>
                                        <td className="text-center p-4 text-muted-foreground">-</td>
                                        <td className="text-center p-4 bg-primary/5"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                                        <td className="text-center p-4"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                                    </tr>
                                    <tr>
                                        <td className="p-4 font-medium">{t('table.rows.devops')}</td>
                                        <td className="text-center p-4 text-muted-foreground">-</td>
                                        <td className="text-center p-4 bg-primary/5"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                                        <td className="text-center p-4"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                                    </tr>
                                    <tr>
                                        <td className="p-4 font-medium">{t('table.rows.hosting')}</td>
                                        <td className="text-center p-4 text-muted-foreground">{t('table.values.year_shared')}</td>
                                        <td className="text-center p-4 bg-primary/5 text-muted-foreground">{t('table.values.year_vps')}</td>
                                        <td className="text-center p-4 text-muted-foreground">{t('table.values.dedicated')}</td>
                                    </tr>
                                    <tr>
                                        <td className="p-4 font-medium">{t('table.rows.support')}</td>
                                        <td className="text-center p-4 text-muted-foreground">3 {t('table.values.months')}</td>
                                        <td className="text-center p-4 bg-primary/5 text-muted-foreground">6 {t('table.values.months')}</td>
                                        <td className="text-center p-4 text-muted-foreground">12 {t('table.values.months')}</td>
                                    </tr>
                                    <tr>
                                        <td className="p-4 font-medium">{t('table.rows.monitoring')}</td>
                                        <td className="text-center p-4 text-muted-foreground">-</td>
                                        <td className="text-center p-4 bg-primary/5 text-muted-foreground">-</td>
                                        <td className="text-center p-4"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                                    </tr>
                                    <tr>
                                        <td className="p-4 font-medium">{t('table.rows.engineer')}</td>
                                        <td className="text-center p-4 text-muted-foreground">-</td>
                                        <td className="text-center p-4 bg-primary/5 text-muted-foreground">-</td>
                                        <td className="text-center p-4"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>

                {/* FAQ */}
                <PricingFAQ />

                {/* CTA Section - Premium Gold Theme */}
                <section className="relative py-24 md:py-36 overflow-hidden">
                    {/* Dark gradient background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />

                    {/* Subtle gold gradient overlays */}
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent" />
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-yellow-500/5 via-transparent to-transparent" />

                    {/* Diamond pattern overlay */}
                    <div className="absolute inset-0 opacity-[0.02]" style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 0L40 20L20 40L0 20z' fill='none' stroke='%23fbbf24' stroke-width='1'/%3E%3C/svg%3E")`,
                        backgroundSize: '40px 40px'
                    }} />

                    {/* Floating gold particles */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <div className="absolute top-1/4 left-1/5 w-2 h-2 bg-amber-400/60 rounded-full animate-float" style={{ animationDelay: '0s' }} />
                        <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-yellow-300/50 rounded-full animate-float" style={{ animationDelay: '1s' }} />
                        <div className="absolute bottom-1/3 left-1/3 w-1.5 h-1.5 bg-amber-300/40 rounded-full animate-float" style={{ animationDelay: '2s' }} />
                        <div className="absolute top-2/3 right-1/3 w-1 h-1 bg-yellow-400/50 rounded-full animate-float" style={{ animationDelay: '0.5s' }} />
                    </div>

                    <div className="container mx-auto px-4 relative z-10">
                        <div className="max-w-4xl mx-auto text-center">
                            {/* Premium badge */}
                            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-amber-500/10 to-yellow-500/10 border border-amber-500/30 rounded-full px-6 py-2.5 mb-10">
                                <div className="flex items-center gap-1">
                                    <svg className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                    <svg className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                    <svg className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                </div>
                                <span className="text-sm font-semibold text-amber-300 tracking-wide">{t('satisfaction_guarantee')}</span>
                            </div>

                            {/* Headline */}
                            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 text-white tracking-tight">
                                {t('cta_title')}
                            </h2>
                            <p className="text-xl md:text-2xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed">
                                {t('cta_desc')}
                            </p>

                            {/* CTA Buttons */}
                            <div className="flex flex-col sm:flex-row gap-5 justify-center items-center mb-16">
                                {/* Primary - Gold gradient button */}
                                <Link href="/demo">
                                    <Button size="lg" className="group relative h-16 px-12 text-lg font-bold overflow-hidden border-0">
                                        <div className="absolute inset-0 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 animate-gradient-x bg-[length:200%_auto]" />
                                        <div className="absolute inset-0 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-gradient-x bg-[length:200%_auto]" />
                                        <div className="absolute inset-0 shadow-[0_0_30px_rgba(251,191,36,0.4)] group-hover:shadow-[0_0_50px_rgba(251,191,36,0.6)] transition-shadow duration-300" />
                                        <span className="relative flex items-center text-slate-900 font-bold">
                                            {t('cta_consultation')}
                                            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-2 transition-transform duration-300" />
                                        </span>
                                    </Button>
                                </Link>

                                {/* Secondary - Glass button */}
                                <Link href="/szolgaltatasok">
                                    <Button size="lg" className="group relative h-16 px-12 text-lg font-bold bg-transparent overflow-hidden">
                                        <div className="absolute inset-0 rounded-md border-2 border-slate-600 group-hover:border-slate-500 transition-colors duration-300" />
                                        <div className="absolute inset-0 bg-white/5 group-hover:bg-white/10 transition-colors duration-300" />
                                        <span className="relative flex items-center text-white">
                                            {t('cta_services')}
                                            <svg className="ml-2 h-5 w-5 group-hover:scale-110 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </span>
                                    </Button>
                                </Link>
                            </div>

                            {/* Trust row */}
                            <div className="flex flex-wrap justify-center gap-8 text-slate-500 text-sm">
                                <div className="flex items-center gap-2">
                                    <svg className="h-5 w-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                    <span>{t('secure_payment')}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <svg className="h-5 w-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span>{t('fast_response')}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <svg className="h-5 w-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                    </svg>
                                    <span>{t('flexible_payment')}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    )
}
