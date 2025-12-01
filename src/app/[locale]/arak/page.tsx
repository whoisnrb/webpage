import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { PricingTable } from "@/components/sections/pricing-table"
import { PricingFAQ } from "@/components/sections/pricing-faq"
import { Button } from "@/components/ui/button"
import { ArrowRight, Check } from "lucide-react"
import { Link } from "@/i18n/routing"

export default function ArakPage() {
    return (
        <div className="flex min-h-screen flex-col">
            <main className="flex-1">
                {/* Hero Section */}
                <section className="bg-gradient-to-b from-muted/50 to-background py-16 md:py-24 border-b">
                    <div className="container mx-auto px-4 text-center">
                        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
                            Átlátható árazás,<br />
                            <span className="text-primary">rejtett költségek nélkül</span>
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
                            Válaszd ki a vállalkozásodhoz legmegfelelőbb csomagot, vagy állítsunk össze egyedi megoldást az igényeidhez.
                        </p>
                        <div className="flex flex-wrap gap-4 justify-center">
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Check className="h-5 w-5 text-primary" />
                                <span>Nincs rejtett költség</span>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Check className="h-5 w-5 text-primary" />
                                <span>Ingyenes konzultáció</span>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Check className="h-5 w-5 text-primary" />
                                <span>Pénzvisszafizetési garancia</span>
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
                                Részletes összehasonlítás
                            </h2>
                            <p className="text-muted-foreground text-lg">
                                Nézd meg pontosan, mit tartalmaz az egyes csomagok
                            </p>
                        </div>

                        <div className="max-w-5xl mx-auto overflow-x-auto">
                            <table className="w-full border-collapse bg-card rounded-lg overflow-hidden shadow-md">
                                <thead>
                                    <tr className="border-b bg-muted/50">
                                        <th className="text-left p-4 font-semibold">Szolgáltatás</th>
                                        <th className="text-center p-4 font-semibold">Starter</th>
                                        <th className="text-center p-4 font-semibold bg-primary/5">Professional</th>
                                        <th className="text-center p-4 font-semibold">Enterprise</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    <tr>
                                        <td className="p-4 font-medium">Weboldal fejlesztés</td>
                                        <td className="text-center p-4"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                                        <td className="text-center p-4 bg-primary/5"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                                        <td className="text-center p-4"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                                    </tr>
                                    <tr>
                                        <td className="p-4 font-medium">Reszponzív design</td>
                                        <td className="text-center p-4"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                                        <td className="text-center p-4 bg-primary/5"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                                        <td className="text-center p-4"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                                    </tr>
                                    <tr>
                                        <td className="p-4 font-medium">SEO optimalizálás</td>
                                        <td className="text-center p-4 text-muted-foreground">Alap</td>
                                        <td className="text-center p-4 bg-primary/5 text-muted-foreground">Haladó</td>
                                        <td className="text-center p-4 text-muted-foreground">Teljes körű</td>
                                    </tr>
                                    <tr>
                                        <td className="p-4 font-medium">Webáruház</td>
                                        <td className="text-center p-4 text-muted-foreground">-</td>
                                        <td className="text-center p-4 bg-primary/5"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                                        <td className="text-center p-4"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                                    </tr>
                                    <tr>
                                        <td className="p-4 font-medium">Automatizációk</td>
                                        <td className="text-center p-4 text-muted-foreground">-</td>
                                        <td className="text-center p-4 bg-primary/5"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                                        <td className="text-center p-4"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                                    </tr>
                                    <tr>
                                        <td className="p-4 font-medium">Biztonsági audit</td>
                                        <td className="text-center p-4 text-muted-foreground">-</td>
                                        <td className="text-center p-4 bg-primary/5"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                                        <td className="text-center p-4"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                                    </tr>
                                    <tr>
                                        <td className="p-4 font-medium">DevOps & CI/CD</td>
                                        <td className="text-center p-4 text-muted-foreground">-</td>
                                        <td className="text-center p-4 bg-primary/5"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                                        <td className="text-center p-4"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                                    </tr>
                                    <tr>
                                        <td className="p-4 font-medium">Hosting</td>
                                        <td className="text-center p-4 text-muted-foreground">1 év shared</td>
                                        <td className="text-center p-4 bg-primary/5 text-muted-foreground">1 év VPS</td>
                                        <td className="text-center p-4 text-muted-foreground">Dedikált</td>
                                    </tr>
                                    <tr>
                                        <td className="p-4 font-medium">Support időtartam</td>
                                        <td className="text-center p-4 text-muted-foreground">3 hónap</td>
                                        <td className="text-center p-4 bg-primary/5 text-muted-foreground">6 hónap</td>
                                        <td className="text-center p-4 text-muted-foreground">12 hónap</td>
                                    </tr>
                                    <tr>
                                        <td className="p-4 font-medium">24/7 Monitoring</td>
                                        <td className="text-center p-4 text-muted-foreground">-</td>
                                        <td className="text-center p-4 bg-primary/5 text-muted-foreground">-</td>
                                        <td className="text-center p-4"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                                    </tr>
                                    <tr>
                                        <td className="p-4 font-medium">Dedikált mérnök</td>
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
                            Készen állsz az indulásra?
                        </h2>
                        <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
                            Foglalj egy ingyenes konzultációt, és beszéljük át a projekted részleteit. Nincs kötelezettség, csak hasznos tanácsok.
                        </p>
                        <div className="flex flex-wrap gap-4 justify-center">
                            <Link href="/checkout?package=consultation">
                                <Button size="lg" variant="secondary" className="text-lg px-8">
                                    Ingyenes konzultáció <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                            </Link>
                            <Link href="/szolgaltatasok">
                                <Button size="lg" variant="ghost" className="text-lg px-8 !bg-transparent text-primary-foreground border-2 border-primary-foreground/20 hover:bg-primary-foreground/10 hover:text-primary-foreground">
                                    Szolgáltatások áttekintése
                                </Button>
                            </Link>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    )
}
