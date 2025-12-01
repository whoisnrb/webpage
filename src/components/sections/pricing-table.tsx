import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, Sparkles, Zap, Crown } from "lucide-react"
import { Link } from "@/i18n/routing"

const packages = [
    {
        name: "Starter",
        description: "Tökéletes kisvállalkozásoknak és induló projekteknek",
        price: "199.000",
        priceNote: "egyszeri díj",
        icon: Sparkles,
        popular: false,
        features: [
            "Modern landing page vagy bemutatkozó weboldal",
            "Reszponzív design (mobil, tablet, desktop)",
            "SEO alapbeállítások",
            "Kapcsolati űrlap",
            "1 év ingyenes hosting (shared)",
            "SSL tanúsítvány",
            "3 hónap ingyenes support",
            "Google Analytics integráció"
        ],
        cta: "Hamarosan",
        href: "#",
        disabled: true
    },
    {
        name: "Professional",
        description: "Növekvő vállalkozásoknak komplex igényekkel",
        price: "449.000",
        priceNote: "egyszeri díj + 15.000 Ft/hó support",
        icon: Zap,
        popular: true,
        features: [
            "Minden a Starter csomagból",
            "Webáruház (WooCommerce/Shopify)",
            "Egyedi funkciók és automatizációk",
            "Biztonsági audit és keményítés",
            "WAF és DDoS védelem beállítás",
            "VPS hosting 1 évre",
            "CI/CD pipeline (automatikus deploy)",
            "6 hónap priority support",
            "Havi teljesítmény riport",
            "Biztonsági mentések (napi)"
        ],
        cta: "Hamarosan",
        href: "#",
        disabled: true
    },
    {
        name: "Enterprise",
        description: "Nagyvállalatok és komplex projektekhez",
        price: "Egyedi",
        priceNote: "árajánlat alapján",
        icon: Crown,
        popular: false,
        features: [
            "Minden a Professional csomagból",
            "Teljes körű egyedi fejlesztés",
            "Headless CMS (Next.js + Strapi/Ghost)",
            "Microservices architektúra",
            "Kubernetes cluster menedzsment",
            "Dedikált DevOps mérnök",
            "24/7 monitoring és support",
            "Penetration testing",
            "GDPR compliance tanácsadás",
            "Dedikált szerver infrastruktúra",
            "SLA garancia (99.9% uptime)"
        ],
        cta: "Kérj árajánlatot",
        href: "/ajanlatkeres",
        disabled: false
    }
]

export function PricingTable() {
    return (
        <section className="py-16 md:py-24">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                        Válaszd ki a neked megfelelő csomagot
                    </h2>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        Átlátható árazás, rejtett költségek nélkül. Minden csomag tartalmazza a sikeres induláshoz szükséges eszközöket.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
                    {packages.map((pkg, index) => {
                        const Icon = pkg.icon
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
                                        Legnépszerűbb
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
                                            {pkg.price !== "Egyedi" && (
                                                <span className="text-4xl font-bold">{pkg.price}</span>
                                            )}
                                            {pkg.price === "Egyedi" && (
                                                <span className="text-3xl font-bold">{pkg.price}</span>
                                            )}
                                            {pkg.price !== "Egyedi" && (
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
                        Nem találod a megfelelő csomagot? Állítsunk össze egyedi megoldást!
                    </p>
                    <Link href="/ajanlatkeres">
                        <Button variant="outline" size="lg">
                            Egyedi ajánlatot kérek
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    )
}
