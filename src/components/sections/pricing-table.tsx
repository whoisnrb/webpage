import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, Sparkles, Zap, Crown } from "lucide-react"
import { Link } from "@/i18n/routing"
import { useTranslations } from "next-intl"

export function PricingTable() {
    const t = useTranslations('PricingPage.PricingTable')

    const packages = [
        {
            key: "starter",
            name: t('packages.starter.name'),
            description: t('packages.starter.description'),
            price: "199.000",
            priceNote: t('packages.starter.price_note'),
            icon: Sparkles,
            popular: false,
            features: [
                t('packages.starter.features.0'),
                t('packages.starter.features.1'),
                t('packages.starter.features.2'),
                t('packages.starter.features.3'),
                t('packages.starter.features.4'),
                t('packages.starter.features.5'),
                t('packages.starter.features.6'),
                t('packages.starter.features.7')
            ],
            cta: t('packages.starter.cta'),
            href: "#",
            disabled: true
        },
        {
            key: "pro",
            name: t('packages.pro.name'),
            description: t('packages.pro.description'),
            price: "449.000",
            priceNote: t('packages.pro.price_note'),
            icon: Zap,
            popular: true,
            features: [
                t('packages.pro.features.0'),
                t('packages.pro.features.1'),
                t('packages.pro.features.2'),
                t('packages.pro.features.3'),
                t('packages.pro.features.4'),
                t('packages.pro.features.5'),
                t('packages.pro.features.6'),
                t('packages.pro.features.7'),
                t('packages.pro.features.8'),
                t('packages.pro.features.9')
            ],
            cta: t('packages.pro.cta'),
            href: "#",
            disabled: true
        },
        {
            key: "enterprise",
            name: t('packages.enterprise.name'),
            description: t('packages.enterprise.description'),
            price: t('packages.enterprise.price'),
            priceNote: t('packages.enterprise.price_note'),
            icon: Crown,
            popular: false,
            features: [
                t('packages.enterprise.features.0'),
                t('packages.enterprise.features.1'),
                t('packages.enterprise.features.2'),
                t('packages.enterprise.features.3'),
                t('packages.enterprise.features.4'),
                t('packages.enterprise.features.5'),
                t('packages.enterprise.features.6'),
                t('packages.enterprise.features.7'),
                t('packages.enterprise.features.8'),
                t('packages.enterprise.features.9'),
                t('packages.enterprise.features.10')
            ],
            cta: t('packages.enterprise.cta'),
            href: "/ajanlatkeres",
            disabled: false
        }
    ]

    return (
        <section className="py-16 md:py-24">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                        {t('title')}
                    </h2>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        {t('desc')}
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
                    {packages.map((pkg, index) => {
                        const Icon = pkg.icon
                        const isCustomPrice = pkg.price === t('packages.enterprise.price')
                        return (
                            <Card
                                key={index}
                                className={`relative flex flex-col ${pkg.popular
                                    ? 'border-primary shadow-xl scale-105 md:scale-110'
                                    : 'border-border shadow-md'
                                    }`}
                            >
                                {pkg.popular && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold">
                                        {t('popular_tag')}
                                    </div>
                                )}

                                <CardHeader className="text-center pb-8">
                                    <div className="mx-auto mb-4 h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                                        <Icon className="h-6 w-6 text-primary" />
                                    </div>
                                    <CardTitle className="text-2xl mb-2">{pkg.name}</CardTitle>
                                    <CardDescription className="text-base">{pkg.description}</CardDescription>

                                    <div className="mt-6">
                                        <div className="flex items-baseline justify-center gap-2">
                                            {!isCustomPrice && (
                                                <span className="text-4xl font-bold">{pkg.price}</span>
                                            )}
                                            {isCustomPrice && (
                                                <span className="text-3xl font-bold">{pkg.price}</span>
                                            )}
                                            {!isCustomPrice && (
                                                <span className="text-muted-foreground">Ft</span>
                                            )}
                                        </div>
                                        <p className="text-sm text-muted-foreground mt-1">{pkg.priceNote}</p>
                                    </div>
                                </CardHeader>

                                <CardContent className="flex-1 flex flex-col">
                                    <ul className="space-y-3 mb-8 flex-1">
                                        {pkg.features.map((feature, idx) => (
                                            <li key={idx} className="flex items-start gap-3">
                                                <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                                                <span className="text-sm">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    {pkg.disabled ? (
                                        <Button
                                            size="lg"
                                            disabled
                                            className="w-full bg-muted text-muted-foreground cursor-not-allowed"
                                        >
                                            {pkg.cta}
                                        </Button>
                                    ) : (
                                        <Link href={pkg.href} className="w-full">
                                            <Button
                                                size="lg"
                                                className={`w-full ${pkg.popular
                                                    ? 'bg-primary hover:bg-primary/90'
                                                    : 'bg-accent hover:bg-accent/90'
                                                    }`}
                                            >
                                                {pkg.cta}
                                            </Button>
                                        </Link>
                                    )}
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>

                <div className="mt-12 text-center">
                    <p className="text-muted-foreground mb-4">
                        {t('bottom_text')}
                    </p>
                    <Link href="/ajanlatkeres">
                        <Button variant="outline" size="lg">
                            {t('bottom_cta')}
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    )
}
