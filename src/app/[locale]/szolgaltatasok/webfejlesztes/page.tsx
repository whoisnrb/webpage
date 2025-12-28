import { ServiceLayout } from "@/components/templates/service-layout"
import { UseCases } from "@/components/sections/use-cases"
import { ShoppingCart, Globe, Rocket, Building2, Smartphone, Zap } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Link } from "@/i18n/routing"
import { useTranslations } from "next-intl"
import { PriceDisplay } from "@/components/price-display"

export default function WebfejlesztesPage() {
    const t = useTranslations("Services.WebDev")

    const projectTypes = [
        {
            title: t("project_types_items.0.title"),
            description: t("project_types_items.0.description"),
            icon: Globe,
            example: t("project_types_items.0.example"),
            roi: t("project_types_items.0.roi")
        },
        {
            title: t("project_types_items.1.title"),
            description: t("project_types_items.1.description"),
            icon: ShoppingCart,
            example: t("project_types_items.1.example"),
            roi: t("project_types_items.1.roi")
        },
        {
            title: t("project_types_items.2.title"),
            description: t("project_types_items.2.description"),
            icon: Rocket,
            example: t("project_types_items.2.example"),
            roi: t("project_types_items.2.roi")
        },
        {
            title: t("project_types_items.3.title"),
            description: t("project_types_items.3.description"),
            icon: Building2,
            example: t("project_types_items.3.example"),
            roi: t("project_types_items.3.roi")
        },
        {
            title: t("project_types_items.4.title"),
            description: t("project_types_items.4.description"),
            icon: Smartphone,
            example: t("project_types_items.4.example"),
            roi: t("project_types_items.4.roi")
        },
        {
            title: t("project_types_items.5.title"),
            description: t("project_types_items.5.description"),
            icon: Zap,
            example: t("project_types_items.5.example"),
            roi: t("project_types_items.5.roi")
        }
    ]

    return (
        <div className="flex flex-col min-h-screen">
            <ServiceLayout
                title={t("title")}
                description={t("description")}
                icon={<ShoppingCart className="h-8 w-8" />}
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
                techStack={["Next.js", "React", "Tailwind CSS", "WordPress", "WooCommerce", "PostgreSQL", "Stripe", "Vercel"]}
                pricing={t.rich('item_labels.pricing_from_format', {
                    price: () => <PriceDisplay amount={150000} />
                }) as any}
            />

            {/* Project Types */}
            <UseCases
                title={t("project_types_title")}
                description={t("project_types_desc")}
                cases={projectTypes}
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
                                <Badge className="w-fit mb-2">{t("plans.0.badge")}</Badge>
                                <CardTitle className="text-2xl">{t("plans.0.name")}</CardTitle>
                                <CardDescription className="text-base">
                                    {t("plans.0.desc")}
                                </CardDescription>
                                <div className="pt-4">
                                    <div className="text-3xl font-bold">
                                        <PriceDisplay amount={150000} />
                                    </div>
                                    <p className="text-sm text-muted-foreground">{t("plans.0.sub")}</p>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2 text-sm">
                                    <li>• {t("plans.0.features.0")}</li>
                                    <li>• {t("plans.0.features.1")}</li>
                                    <li>• {t("plans.0.features.2")}</li>
                                    <li>• {t("plans.0.features.3")}</li>
                                    <li>• {t("plans.0.features.4")}</li>
                                    <li>• {t("plans.0.features.5")}</li>
                                    <li>• {t("plans.0.features.6")}</li>
                                </ul>
                                <p className="text-xs text-muted-foreground mt-4 italic">
                                    {t("plans.0.ideal")}
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="border-2 border-primary shadow-lg">
                            <CardHeader>
                                <div className="inline-block px-3 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded-full mb-2">
                                    {t("plans.1.popular")}
                                </div>
                                <Badge className="w-fit mb-2">{t("plans.1.badge")}</Badge>
                                <CardTitle className="text-2xl">{t("plans.1.name")}</CardTitle>
                                <CardDescription className="text-base">
                                    {t("plans.1.desc")}
                                </CardDescription>
                                <div className="pt-4">
                                    <div className="text-3xl font-bold">
                                        <PriceDisplay amount={350000} />
                                    </div>
                                    <p className="text-sm text-muted-foreground">{t("plans.1.sub")}</p>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2 text-sm">
                                    <li>• {t("plans.1.features.0")}</li>
                                    <li>• {t("plans.1.features.1")}</li>
                                    <li>• {t("plans.1.features.2")}</li>
                                    <li>• {t("plans.1.features.3")}</li>
                                    <li>• {t("plans.1.features.4")}</li>
                                    <li>• {t("plans.1.features.5")}</li>
                                    <li>• {t("plans.1.features.6")}</li>
                                    <li>• {t("plans.1.features.7")}</li>
                                </ul>
                                <p className="text-xs text-muted-foreground mt-4 italic">
                                    {t("plans.1.ideal")}
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="border-2">
                            <CardHeader>
                                <Badge className="w-fit mb-2">{t("plans.2.badge")}</Badge>
                                <CardTitle className="text-2xl">{t("plans.2.name")}</CardTitle>
                                <CardDescription className="text-base">
                                    {t("plans.2.desc")}
                                </CardDescription>
                                <div className="pt-4">
                                    <div className="text-3xl font-bold">
                                        {t.rich('item_labels.pricing_plus_format', {
                                            price: () => <PriceDisplay amount={600000} />
                                        })}
                                    </div>
                                    <p className="text-sm text-muted-foreground">{t("plans.2.sub")}</p>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2 text-sm">
                                    <li>• {t("plans.2.features.0")}</li>
                                    <li>• {t("plans.2.features.1")}</li>
                                    <li>• {t("plans.2.features.2")}</li>
                                    <li>• {t("plans.2.features.3")}</li>
                                    <li>• {t("plans.2.features.4")}</li>
                                    <li>• {t("plans.2.features.5")}</li>
                                    <li>• {t("plans.2.features.6")}</li>
                                    <li>• {t("plans.2.features.7")}</li>
                                </ul>
                                <p className="text-xs text-muted-foreground mt-4 italic">
                                    {t("plans.2.ideal")}
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

            {/* Portfolio Examples */}
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

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                        <Card className="overflow-hidden">
                            <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                                <Globe className="h-16 w-16 text-white" />
                            </div>
                            <CardHeader>
                                <div className="flex items-center justify-between mb-2">
                                    <Badge>{t("portfolio_items.0.badge")}</Badge>
                                    <span className="text-xs text-muted-foreground">2024</span>
                                </div>
                                <CardTitle>{t("portfolio_items.0.title")}</CardTitle>
                                <CardDescription>
                                    {t("portfolio_items.0.desc")}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-2 mb-4">
                                    <Badge variant="outline">Next.js</Badge>
                                    <Badge variant="outline">Tailwind</Badge>
                                    <Badge variant="outline">Framer Motion</Badge>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">{t("portfolio_conversion")}</span>
                                    <span className="font-semibold text-primary">4.2%</span>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="overflow-hidden">
                            <div className="h-48 bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center">
                                <ShoppingCart className="h-16 w-16 text-white" />
                            </div>
                            <CardHeader>
                                <div className="flex items-center justify-between mb-2">
                                    <Badge>{t("portfolio_items.1.badge")}</Badge>
                                    <span className="text-xs text-muted-foreground">2024</span>
                                </div>
                                <CardTitle>{t("portfolio_items.1.title")}</CardTitle>
                                <CardDescription>
                                    {t("portfolio_items.1.desc")}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-2 mb-4">
                                    <Badge variant="outline">WooCommerce</Badge>
                                    <Badge variant="outline">Stripe</Badge>
                                    <Badge variant="outline">WordPress</Badge>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">{t("portfolio_revenue")}</span>
                                    <span className="font-semibold text-primary">
                                        <PriceDisplay amount={2500000} />
                                    </span>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="overflow-hidden">
                            <div className="h-48 bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
                                <Building2 className="h-16 w-16 text-white" />
                            </div>
                            <CardHeader>
                                <div className="flex items-center justify-between mb-2">
                                    <Badge>{t("portfolio_items.2.badge")}</Badge>
                                    <span className="text-xs text-muted-foreground">2023</span>
                                </div>
                                <CardTitle>{t("portfolio_items.2.title")}</CardTitle>
                                <CardDescription>
                                    {t("portfolio_items.2.desc")}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-2 mb-4">
                                    <Badge variant="outline">WordPress</Badge>
                                    <Badge variant="outline">Custom Theme</Badge>
                                    <Badge variant="outline">SEO</Badge>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">{t("portfolio_traffic")}</span>
                                    <span className="font-semibold text-primary">+150%</span>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="overflow-hidden">
                            <div className="h-48 bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center">
                                <Rocket className="h-16 w-16 text-white" />
                            </div>
                            <CardHeader>
                                <div className="flex items-center justify-between mb-2">
                                    <Badge>{t("portfolio_items.3.badge")}</Badge>
                                    <span className="text-xs text-muted-foreground">2024</span>
                                </div>
                                <CardTitle>{t("portfolio_items.3.title")}</CardTitle>
                                <CardDescription>
                                    {t("portfolio_items.3.desc")}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-2 mb-4">
                                    <Badge variant="outline">Next.js</Badge>
                                    <Badge variant="outline">PostgreSQL</Badge>
                                    <Badge variant="outline">Stripe</Badge>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">{t("portfolio_active_users")}</span>
                                    <span className="font-semibold text-primary">500+</span>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="overflow-hidden">
                            <div className="h-48 bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center">
                                <Smartphone className="h-16 w-16 text-white" />
                            </div>
                            <CardHeader>
                                <div className="flex items-center justify-between mb-2">
                                    <Badge>{t("portfolio_items.4.badge")}</Badge>
                                    <span className="text-xs text-muted-foreground">2024</span>
                                </div>
                                <CardTitle>{t("portfolio_items.4.title")}</CardTitle>
                                <CardDescription>
                                    {t("portfolio_items.4.desc")}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-2 mb-4">
                                    <Badge variant="outline">React</Badge>
                                    <Badge variant="outline">PWA</Badge>
                                    <Badge variant="outline">Firebase</Badge>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">{t("portfolio_daily_orders")}</span>
                                    <span className="font-semibold text-primary">150+</span>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="overflow-hidden">
                            <div className="h-48 bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center">
                                <Zap className="h-16 w-16 text-white" />
                            </div>
                            <CardHeader>
                                <div className="flex items-center justify-between mb-2">
                                    <Badge>{t("portfolio_items.5.badge")}</Badge>
                                    <span className="text-xs text-muted-foreground">2023</span>
                                </div>
                                <CardTitle>{t("portfolio_items.5.title")}</CardTitle>
                                <CardDescription>
                                    {t("portfolio_items.5.desc")}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-2 mb-4">
                                    <Badge variant="outline">Next.js</Badge>
                                    <Badge variant="outline">PostgreSQL</Badge>
                                    <Badge variant="outline">API</Badge>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">{t("portfolio_efficiency")}</span>
                                    <span className="font-semibold text-primary">+40%</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Technology Stack Details */}
            <section className="py-16 md:py-24">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                            {t("tech_title")}
                        </h2>
                        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                            {t("tech_desc")}
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Frontend</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-2">
                                    <Badge>Next.js</Badge>
                                    <Badge>React</Badge>
                                    <Badge>Tailwind CSS</Badge>
                                    <Badge>TypeScript</Badge>
                                    <Badge>Framer Motion</Badge>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Backend</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-2">
                                    <Badge>Node.js</Badge>
                                    <Badge>PostgreSQL</Badge>
                                    <Badge>MongoDB</Badge>
                                    <Badge>Prisma</Badge>
                                    <Badge>GraphQL</Badge>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">CMS & E-commerce</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-2">
                                    <Badge>WordPress</Badge>
                                    <Badge>WooCommerce</Badge>
                                    <Badge>Shopify</Badge>
                                    <Badge>Strapi</Badge>
                                    <Badge>Sanity</Badge>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Hosting & DevOps</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-2">
                                    <Badge>Vercel</Badge>
                                    <Badge>AWS</Badge>
                                    <Badge>DigitalOcean</Badge>
                                    <Badge>Docker</Badge>
                                    <Badge>GitHub Actions</Badge>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>
        </div>
    )
}
