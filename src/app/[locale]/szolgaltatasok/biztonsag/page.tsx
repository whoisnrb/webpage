import { ServiceLayout } from "@/components/templates/service-layout"
import { UseCases } from "@/components/sections/use-cases"
import { Shield, Lock, Eye, FileSearch, Server, AlertTriangle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Link } from "@/i18n/routing"
import { useTranslations } from "next-intl"
import { PriceDisplay } from "@/components/price-display"

export default function BiztonsagPage() {
    const t = useTranslations("Services.Security")

    const useCases = [
        {
            title: t("use_cases_items.0.title"),
            description: t("use_cases_items.0.description"),
            icon: FileSearch,
            example: t("use_cases_items.0.example"),
            roi: t("use_cases_items.0.roi")
        },
        {
            title: t("use_cases_items.1.title"),
            description: t("use_cases_items.1.description"),
            icon: AlertTriangle,
            example: t("use_cases_items.1.example"),
            roi: t("use_cases_items.1.roi")
        },
        {
            title: t("use_cases_items.2.title"),
            description: t("use_cases_items.2.description"),
            icon: Server,
            example: t("use_cases_items.2.example"),
            roi: t("use_cases_items.2.roi")
        },
        {
            title: t("use_cases_items.3.title"),
            description: t("use_cases_items.3.description"),
            icon: Lock,
            example: t("use_cases_items.3.example"),
            roi: t("use_cases_items.3.roi")
        },
        {
            title: t("use_cases_items.4.title"),
            description: t("use_cases_items.4.description"),
            icon: Shield,
            example: t("use_cases_items.4.example"),
            roi: t("use_cases_items.4.roi")
        },
        {
            title: t("use_cases_items.5.title"),
            description: t("use_cases_items.5.description"),
            icon: Eye,
            example: t("use_cases_items.5.example"),
            roi: t("use_cases_items.5.roi")
        }
    ]

    return (
        <div className="flex flex-col min-h-screen">
            <ServiceLayout
                title={t("title")}
                description={t("description")}
                icon={<Shield className="h-8 w-8" />}
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
                techStack={["Kali Linux", "Nmap", "Wireshark", "Metasploit", "Cloudflare", "ModSecurity", "Fail2Ban", "OpenVAS"]}
                pricing={t.rich('item_labels.pricing_from_format', {
                    price: () => <PriceDisplay amount={80000} />
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
                                <CardTitle className="text-2xl">{t("plans.base.name")}</CardTitle>
                                <CardDescription className="text-base">
                                    {t("plans.base.desc")}
                                </CardDescription>
                                <div className="pt-4">
                                    <div className="text-3xl font-bold">
                                        <PriceDisplay amount={80000} />
                                    </div>
                                    <p className="text-sm text-muted-foreground">{t("plans.base.sub")}</p>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2 text-sm">
                                    <li>• {t("plans.base.features.0")}</li>
                                    <li>• {t("plans.base.features.1")}</li>
                                    <li>• {t("plans.base.features.2")}</li>
                                    <li>• {t("plans.base.features.3")}</li>
                                    <li>• {t("plans.base.features.4")}</li>
                                </ul>
                                <p className="text-xs text-muted-foreground mt-4 italic">
                                    {t("plans.base.duration_label")}
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="border-2 border-primary shadow-lg">
                            <CardHeader>
                                <div className="inline-block px-3 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded-full mb-2">
                                    {t("plans.detailed.badge")}
                                </div>
                                <CardTitle className="text-2xl">{t("plans.detailed.name")}</CardTitle>
                                <CardDescription className="text-base">
                                    {t("plans.detailed.desc")}
                                </CardDescription>
                                <div className="pt-4">
                                    <div className="text-3xl font-bold">
                                        <PriceDisplay amount={150000} />
                                    </div>
                                    <p className="text-sm text-muted-foreground">{t("plans.detailed.sub")}</p>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2 text-sm">
                                    <li>• {t("plans.detailed.features.0")}</li>
                                    <li>• {t("plans.detailed.features.1")}</li>
                                    <li>• {t("plans.detailed.features.2")}</li>
                                    <li>• {t("plans.detailed.features.3")}</li>
                                    <li>• {t("plans.detailed.features.4")}</li>
                                    <li>• {t("plans.detailed.features.5")}</li>
                                </ul>
                                <p className="text-xs text-muted-foreground mt-4 italic">
                                    {t("plans.detailed.duration_label")}
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
                                    <div className="text-3xl font-bold">{t("plans.complex.price_label")}</div>
                                    <p className="text-sm text-muted-foreground">{t("plans.complex.price_sub")}</p>
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
                                    {t("plans.complex.duration_label")}
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="text-center mt-12">
                        <Link href="/checkout?package=custom">
                            <Button size="lg" className="bg-accent hover:bg-accent/90">
                                {t("cta_request_audit")}
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    )
}
