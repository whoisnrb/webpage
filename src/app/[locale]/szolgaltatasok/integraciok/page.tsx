import { ServiceLayout } from "@/components/templates/service-layout"
import { Network, Database, Globe, RefreshCw } from "lucide-react"
import { useTranslations } from "next-intl"

export default function IntegraciokPage() {
    const t = useTranslations("Services.Integrations")

    return (
        <ServiceLayout
            title={t("title")}
            description={t("description")}
            icon={<Network className="h-8 w-8" />}
            features={[
                t("hero_features.0"),
                t("hero_features.1"),
                t("hero_features.2"),
                t("hero_features.3"),
                t("hero_features.4"),
                t("hero_features.5")
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
            techStack={[
                "Node.js", "Python", "GraphQL", "REST", "Redis", "RabbitMQ", "PostgreSQL", "Docker"
            ]}
            pricing={t("pricing_label")}
        >
            <section className="py-16 bg-muted/30">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold mb-12 text-center">{t("scenarios_title")}</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-card p-6 rounded-xl border shadow-sm">
                            <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                                <Globe className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="text-xl font-semibold mb-3">{t("scenarios.0.title")}</h3>
                            <p className="text-muted-foreground">
                                {t("scenarios.0.description")}
                            </p>
                        </div>
                        <div className="bg-card p-6 rounded-xl border shadow-sm">
                            <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                                <Database className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="text-xl font-semibold mb-3">{t("scenarios.1.title")}</h3>
                            <p className="text-muted-foreground">
                                {t("scenarios.1.description")}
                            </p>
                        </div>
                        <div className="bg-card p-6 rounded-xl border shadow-sm">
                            <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                                <RefreshCw className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="text-xl font-semibold mb-3">{t("scenarios.2.title")}</h3>
                            <p className="text-muted-foreground">
                                {t("scenarios.2.description")}
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </ServiceLayout>
    )
}
