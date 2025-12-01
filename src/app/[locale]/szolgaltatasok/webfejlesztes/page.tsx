import { ServiceLayout } from "@/components/templates/service-layout"
import { UseCases } from "@/components/sections/use-cases"
import { ShoppingCart, Globe, Rocket, Building2, Smartphone, Zap } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Link } from "@/i18n/routing"

const projectTypes = [
    {
        title: "Landing Page",
        description: "Konverzió-fókuszált egyoldalas weboldal termékekhez vagy szolgáltatásokhoz",
        icon: Globe,
        example: "Startup bemutatkozó oldal lead generálással",
        roi: "Átlagosan 3-5% konverziós ráta"
    },
    {
        title: "E-commerce / Webshop",
        description: "Teljes körű online áruház fizetési és raktárkezelési integrációval",
        icon: ShoppingCart,
        example: "WooCommerce webshop 500+ termékkel, Stripe fizetéssel",
        roi: "Átlagosan 2-4% konverziós ráta"
    },
    {
        title: "SaaS Platform",
        description: "Szoftver-mint-szolgáltatás platform előfizetéses modellel",
        icon: Rocket,
        example: "Projektmenedzsment tool csapatoknak, havi előfizetéssel",
        roi: "Skálázható bevétel, alacsony működési költség"
    },
    {
        title: "Vállalati Weboldal",
        description: "Professzionális bemutatkozó oldal cégeknek, több aloldallal",
        icon: Building2,
        example: "Ügyvédi iroda weboldala szolgáltatásokkal, referenciákkal, blog-gal",
        roi: "Növeli a cég hitelességét és elérhetőségét"
    },
    {
        title: "Mobilalkalmazás",
        description: "Progressive Web App (PWA) vagy natív mobil alkalmazás",
        icon: Smartphone,
        example: "Étterem rendelési app iOS és Android platformra",
        roi: "Jobb ügyfélélmény, push értesítések"
    },
    {
        title: "Egyedi Webalkalmazás",
        description: "Testreszabott funkciókkal rendelkező komplex webalkalmazás",
        icon: Zap,
        example: "Belső CRM rendszer értékesítési folyamatok kezelésére",
        roi: "Hatékonyabb munkafolyamatok, adatvezérelt döntések"
    }
]

export default function WebfejlesztesPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <ServiceLayout
                title="Webfejlesztés & Webáruház"
                description="Modern, gyors és konverzió-fókuszált weboldalak és webshopok. Nem csak szépek, de pénzt is termelnek."
                icon={<ShoppingCart className="h-8 w-8" />}
                features={[
                    "Egyedi weboldal tervezés és fejlesztés",
                    "WooCommerce / Shopify webáruház készítés",
                    "Headless CMS megoldások (Next.js + Strapi/Ghost)",
                    "Reszponzív, mobil-first design",
                    "SEO optimalizálás alapoktól",
                    "Gyors betöltési sebesség (Core Web Vitals)",
                    "E-commerce integráció (fizetés, szállítás)",
                    "Admin felület és tartalomkezelés"
                ]}
                benefits={[
                    {
                        title: "Magasabb konverzió",
                        description: "A gyors és felhasználóbarát oldalak több látogatóból csinálnak vásárlót. Ügyfeleink átlagosan 30-50% konverzió növekedést tapasztalnak."
                    },
                    {
                        title: "Könnyű kezelhetőség",
                        description: "Olyan admin felületet kapsz, amit te is könnyen tudsz szerkeszteni. Nincs szükség programozói tudásra a tartalom frissítéséhez."
                    },
                    {
                        title: "Jövőálló technológia",
                        description: "Modern stack-et használunk, ami évek múlva is megállja a helyét. Next.js, React, Tailwind CSS - a web jövője."
                    }
                ]}
                techStack={["Next.js", "React", "Tailwind CSS", "WordPress", "WooCommerce", "PostgreSQL", "Stripe", "Vercel"]}
                pricing="150.000 Ft-tól"
            />

            {/* Project Types */}
            <UseCases
                title="Milyen típusú projekteket készítünk?"
                description="Válaszd ki a vállalkozásodhoz legmegfelelőbb weboldal típust"
                cases={projectTypes}
            />

            {/* Pricing Tiers */}
            <section className="py-16 md:py-24">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                            Árazási csomagok
                        </h2>
                        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                            Minden projekt egyedi, de itt vannak az irányárak
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        <Card className="border-2">
                            <CardHeader>
                                <Badge className="w-fit mb-2">Landing Page</Badge>
                                <CardTitle className="text-2xl">Bemutatkozó</CardTitle>
                                <CardDescription className="text-base">
                                    Egyoldalas vagy kisebb weboldalak
                                </CardDescription>
                                <div className="pt-4">
                                    <div className="text-3xl font-bold">150.000 Ft</div>
                                    <p className="text-sm text-muted-foreground">egyszeri díj</p>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2 text-sm">
                                    <li>• 1-5 aloldal</li>
                                    <li>• Reszponzív design</li>
                                    <li>• Kapcsolati űrlap</li>
                                    <li>• SEO alapbeállítások</li>
                                    <li>• 1 év hosting</li>
                                    <li>• 3 hónap support</li>
                                    <li>• 2-3 hét átfutási idő</li>
                                </ul>
                                <p className="text-xs text-muted-foreground mt-4 italic">
                                    Ideális: kisvállalkozások, freelancerek
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="border-2 border-primary shadow-lg">
                            <CardHeader>
                                <div className="inline-block px-3 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded-full mb-2">
                                    Legnépszerűbb
                                </div>
                                <Badge className="w-fit mb-2">E-commerce</Badge>
                                <CardTitle className="text-2xl">Webáruház</CardTitle>
                                <CardDescription className="text-base">
                                    Teljes körű webshop megoldás
                                </CardDescription>
                                <div className="pt-4">
                                    <div className="text-3xl font-bold">350.000 Ft</div>
                                    <p className="text-sm text-muted-foreground">egyszeri díj</p>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2 text-sm">
                                    <li>• WooCommerce / Shopify</li>
                                    <li>• Fizetési integráció (Stripe, PayPal)</li>
                                    <li>• Termékkategóriák, szűrők</li>
                                    <li>• Kosár és checkout folyamat</li>
                                    <li>• Készletkezelés</li>
                                    <li>• SEO optimalizálás</li>
                                    <li>• 6 hónap support</li>
                                    <li>• 4-6 hét átfutási idő</li>
                                </ul>
                                <p className="text-xs text-muted-foreground mt-4 italic">
                                    Ideális: online kereskedők, termékértékesítők
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="border-2">
                            <CardHeader>
                                <Badge className="w-fit mb-2">Custom</Badge>
                                <CardTitle className="text-2xl">Egyedi</CardTitle>
                                <CardDescription className="text-base">
                                    Komplex webalkalmazások
                                </CardDescription>
                                <div className="pt-4">
                                    <div className="text-3xl font-bold">600.000 Ft+</div>
                                    <p className="text-sm text-muted-foreground">egyedi árazás</p>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2 text-sm">
                                    <li>• Headless CMS (Next.js)</li>
                                    <li>• Egyedi funkciók</li>
                                    <li>• User authentication</li>
                                    <li>• Dashboard és admin panel</li>
                                    <li>• API integráció</li>
                                    <li>• Teljes körű SEO</li>
                                    <li>• 12 hónap support</li>
                                    <li>• 8-12 hét átfutási idő</li>
                                </ul>
                                <p className="text-xs text-muted-foreground mt-4 italic">
                                    Ideális: SaaS startupok, nagyvállalatok
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="text-center mt-12">
                        <Link href="/arak">
                            <Button size="lg" className="bg-accent hover:bg-accent/90">
                                Összes csomag megtekintése
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
                            Példa projektek
                        </h2>
                        <p className="text-muted-foreground text-lg">
                            Nézd meg, milyen weboldalakat készítettünk már
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                        <Card className="overflow-hidden">
                            <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                                <Globe className="h-16 w-16 text-white" />
                            </div>
                            <CardHeader>
                                <div className="flex items-center justify-between mb-2">
                                    <Badge>Landing Page</Badge>
                                    <span className="text-xs text-muted-foreground">2024</span>
                                </div>
                                <CardTitle>Tech Startup Landing</CardTitle>
                                <CardDescription>
                                    SaaS termék bemutató oldal lead generálással
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-2 mb-4">
                                    <Badge variant="outline">Next.js</Badge>
                                    <Badge variant="outline">Tailwind</Badge>
                                    <Badge variant="outline">Framer Motion</Badge>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">Konverzió:</span>
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
                                    <Badge>E-commerce</Badge>
                                    <span className="text-xs text-muted-foreground">2024</span>
                                </div>
                                <CardTitle>Fashion Webshop</CardTitle>
                                <CardDescription>
                                    Ruházati webáruház 800+ termékkel
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-2 mb-4">
                                    <Badge variant="outline">WooCommerce</Badge>
                                    <Badge variant="outline">Stripe</Badge>
                                    <Badge variant="outline">WordPress</Badge>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">Havi forgalom:</span>
                                    <span className="font-semibold text-primary">2.5M Ft</span>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="overflow-hidden">
                            <div className="h-48 bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
                                <Building2 className="h-16 w-16 text-white" />
                            </div>
                            <CardHeader>
                                <div className="flex items-center justify-between mb-2">
                                    <Badge>Corporate</Badge>
                                    <span className="text-xs text-muted-foreground">2023</span>
                                </div>
                                <CardTitle>Ügyvédi Iroda</CardTitle>
                                <CardDescription>
                                    Professzionális bemutatkozó oldal blog-gal
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-2 mb-4">
                                    <Badge variant="outline">WordPress</Badge>
                                    <Badge variant="outline">Custom Theme</Badge>
                                    <Badge variant="outline">SEO</Badge>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">Organikus forgalom:</span>
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
                                    <Badge>SaaS</Badge>
                                    <span className="text-xs text-muted-foreground">2024</span>
                                </div>
                                <CardTitle>Projektmenedzsment Tool</CardTitle>
                                <CardDescription>
                                    Csapatoknak készült feladatkezelő platform
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-2 mb-4">
                                    <Badge variant="outline">Next.js</Badge>
                                    <Badge variant="outline">PostgreSQL</Badge>
                                    <Badge variant="outline">Stripe</Badge>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">Aktív felhasználók:</span>
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
                                    <Badge>PWA</Badge>
                                    <span className="text-xs text-muted-foreground">2024</span>
                                </div>
                                <CardTitle>Étterem Rendelési App</CardTitle>
                                <CardDescription>
                                    Progressive Web App ételrendeléshez
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-2 mb-4">
                                    <Badge variant="outline">React</Badge>
                                    <Badge variant="outline">PWA</Badge>
                                    <Badge variant="outline">Firebase</Badge>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">Napi rendelések:</span>
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
                                    <Badge>Custom</Badge>
                                    <span className="text-xs text-muted-foreground">2023</span>
                                </div>
                                <CardTitle>Belső CRM Rendszer</CardTitle>
                                <CardDescription>
                                    Értékesítési folyamatok kezelésére
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-2 mb-4">
                                    <Badge variant="outline">Next.js</Badge>
                                    <Badge variant="outline">PostgreSQL</Badge>
                                    <Badge variant="outline">API</Badge>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">Hatékonyság növekedés:</span>
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
                            Technológiák, amiket használunk
                        </h2>
                        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                            Modern, jövőálló stack a legjobb teljesítményért
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
