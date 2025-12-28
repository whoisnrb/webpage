import { ServiceLayout } from "@/components/templates/service-layout"
import { UseCases } from "@/components/sections/use-cases"
import { Code2, Database, Mail, Calendar, FileText, Zap } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Link } from "@/i18n/routing"
import { useTranslations } from "next-intl"
import { PriceDisplay } from "@/components/price-display"

export default function ScriptekPage() {
    const t = useTranslations("Services.Scripts")

    const useCases = [
        {
            title: t("use_cases_items.0.title"),
            description: t("use_cases_items.0.description"),
            icon: Mail,
            example: t("use_cases_items.0.example"),
            roi: t("use_cases_items.0.roi")
        },
        {
            title: t("use_cases_items.1.title"),
            description: t("use_cases_items.1.description"),
            icon: Database,
            example: t("use_cases_items.1.example"),
            roi: t("use_cases_items.1.roi")
        },
        {
            title: t("use_cases_items.2.title"),
            description: t("use_cases_items.2.description"),
            icon: FileText,
            example: t("use_cases_items.2.example"),
            roi: t("use_cases_items.2.roi")
        },
        {
            title: t("use_cases_items.3.title"),
            description: t("use_cases_items.3.description"),
            icon: Calendar,
            example: t("use_cases_items.3.example"),
            roi: t("use_cases_items.3.roi")
        },
        {
            title: t("use_cases_items.4.title"),
            description: t("use_cases_items.4.description"),
            icon: Zap,
            example: t("use_cases_items.4.example"),
            roi: t("use_cases_items.4.roi")
        },
        {
            title: t("use_cases_items.5.title"),
            description: t("use_cases_items.5.description"),
            icon: Database,
            example: t("use_cases_items.5.example"),
            roi: t("use_cases_items.5.roi")
        }
    ]

    return (
        <div className="flex flex-col min-h-screen">
            <ServiceLayout
                title={t("title")}
                description={t("description")}
                icon={<Code2 className="h-8 w-8" />}
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
                    }
                ]}
                techStack={["Python", "Node.js", "n8n", "Docker", "REST API", "GraphQL", "Zapier", "Make"]}
                pricing={t.rich('item_labels.pricing_from_format', {
                    price: () => <PriceDisplay amount={50000} />
                }) as any}
            />

            {/* Use Cases */}
            <UseCases
                title={t("use_cases_title")}
                description={t("use_cases_desc")}
                cases={useCases}
            />

            {/* Pricing Tiers */}
            <section className="py-16 md:py-24">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                            {t("pricing_title")}
                        </h2>
                        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                            {t("pricing_desc")}
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        <Card className="border-2">
                            <CardHeader>
                                <CardTitle className="text-2xl">{t("plans.simple.name")}</CardTitle>
                                <CardDescription className="text-base">
                                    {t("plans.simple.desc")}
                                </CardDescription>
                                <div className="pt-4">
                                    <div className="text-3xl font-bold">
                                        <PriceDisplay amount={50000} />
                                    </div>
                                    <p className="text-sm text-muted-foreground">{t("plans.simple.sub")}</p>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2 text-sm">
                                    <li>• {t("plans.simple.features.0")}</li>
                                    <li>• {t("plans.simple.features.1")}</li>
                                    <li>• {t("plans.simple.features.2")}</li>
                                    <li>• {t("plans.simple.features.3")}</li>
                                    <li>• {t("plans.simple.features.4")}</li>
                                </ul>
                                <p className="text-xs text-muted-foreground mt-4 italic">
                                    {t("plans.simple.example")}
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="border-2 border-primary shadow-lg">
                            <CardHeader>
                                <div className="inline-block px-3 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded-full mb-2">
                                    {t("plans.medium.popular")}
                                </div>
                                <CardTitle className="text-2xl">{t("plans.medium.name")}</CardTitle>
                                <CardDescription className="text-base">
                                    {t("plans.medium.desc")}
                                </CardDescription>
                                <div className="pt-4">
                                    <div className="text-3xl font-bold">
                                        <PriceDisplay amount={150000} />
                                    </div>
                                    <p className="text-sm text-muted-foreground">{t("plans.medium.sub")}</p>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2 text-sm">
                                    <li>• {t("plans.medium.features.0")}</li>
                                    <li>• {t("plans.medium.features.1")}</li>
                                    <li>• {t("plans.medium.features.2")}</li>
                                    <li>• {t("plans.medium.features.3")}</li>
                                    <li>• {t("plans.medium.features.4")}</li>
                                    <li>• {t("plans.medium.features.5")}</li>
                                </ul>
                                <p className="text-xs text-muted-foreground mt-4 italic">
                                    {t("plans.medium.example")}
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="border-2">
                            <CardHeader>
                                <CardTitle className="text-2xl">{t("plans.complex.name")}</CardTitle>
                                <CardDescription className="text-base">
                                    {t("plans.complex.desc")}
                                </CardDescription>
                                <div className="pt-4">
                                    <div className="text-3xl font-bold">
                                        {t.rich('item_labels.pricing_plus_format', {
                                            price: () => <PriceDisplay amount={300000} />
                                        })}
                                    </div>
                                    <p className="text-sm text-muted-foreground">{t("plans.complex.sub")}</p>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2 text-sm">
                                    <li>• {t("plans.complex.features.0")}</li>
                                    <li>• {t("plans.complex.features.1")}</li>
                                    <li>• {t("plans.complex.features.2")}</li>
                                    <li>• {t("plans.complex.features.3")}</li>
                                    <li>• {t("plans.complex.features.4")}</li>
                                    <li>• {t("plans.complex.features.5")}</li>
                                </ul>
                                <p className="text-xs text-muted-foreground mt-4 italic">
                                    {t("plans.complex.example")}
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="text-center mt-12">
                        <Link href="/arak">
                            <Button size="lg" className="bg-accent hover:bg-accent/90">
                                {t("pricing_view_all")}
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Example Projects */}
            <section className="py-16 md:py-24 bg-muted/30">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                            {t("portfolio_title")}
                        </h2>
                        <p className="text-muted-foreground text-lg">
                            {t("portfolio_desc")}
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                        <Card>
                            <CardHeader>
                                <CardTitle>{t("portfolio_items.0.title")}</CardTitle>
                                <CardDescription>{t("portfolio_items.0.desc")}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground mb-4">
                                    {t("portfolio_items.0.content")}
                                </p>
                                <div className="flex items-center justify-between pt-4 border-t">
                                    <span className="text-sm font-semibold">{t("portfolio_items.0.metric_label")}</span>
                                    <span className="text-sm text-primary">{t("portfolio_items.0.metric_value")}</span>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>{t("portfolio_items.1.title")}</CardTitle>
                                <CardDescription>{t("portfolio_items.1.desc")}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground mb-4">
                                    {t("portfolio_items.1.content")}
                                </p>
                                <div className="flex items-center justify-between pt-4 border-t">
                                    <span className="text-sm font-semibold">{t("portfolio_items.1.metric_label")}</span>
                                    <span className="text-sm text-primary">{t("portfolio_items.1.metric_value")}</span>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>{t("portfolio_items.2.title")}</CardTitle>
                                <CardDescription>{t("portfolio_items.2.desc")}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground mb-4">
                                    {t("portfolio_items.2.content")}
                                </p>
                                <div className="flex items-center justify-between pt-4 border-t">
                                    <span className="text-sm font-semibold">{t("portfolio_items.2.metric_label")}</span>
                                    <span className="text-sm text-primary">{t("portfolio_items.2.metric_value")}</span>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>{t("portfolio_items.3.title")}</CardTitle>
                                <CardDescription>{t("portfolio_items.3.desc")}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground mb-4">
                                    {t("portfolio_items.3.content")}
                                </p>
                                <div className="flex items-center justify-between pt-4 border-t">
                                    <span className="text-sm font-semibold">{t("portfolio_items.3.metric_label")}</span>
                                    <span className="text-sm text-primary">{t("portfolio_items.3.metric_value")}</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>
        </div>
    )
}
