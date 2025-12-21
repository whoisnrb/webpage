import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { PricingTable } from "@/components/sections/pricing-table"
import { PricingFAQ } from "@/components/sections/pricing-faq"
import { Button } from "@/components/ui/button"
import { ArrowRight, Check } from "lucide-react"
import { Link } from "@/i18n/routing"
import { useTranslations } from "next-intl"

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

                {/* CTA Section */}
                <section className="py-16 md:py-24 bg-primary text-primary-foreground">
                    <div className="container mx-auto px-4 text-center">
                        <h2 className="text-3xl md:text-4xl font-bold mb-6">
                            {t('cta_title')}
                        </h2>
                        <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
                            {t('cta_desc')}
                        </p>
                        <div className="flex flex-wrap gap-4 justify-center">
                            <Link href="/checkout?package=consultation">
                                <Button size="lg" variant="secondary" className="text-lg px-8">
                                    {t('cta_consultation')} <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                            </Link>
                            <Link href="/szolgaltatasok">
                                <Button size="lg" variant="ghost" className="text-lg px-8 !bg-transparent text-primary-foreground border-2 border-primary-foreground/20 hover:bg-primary-foreground/10 hover:text-primary-foreground">
                                    {t('cta_services')}
                                </Button>
                            </Link>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    )
}
