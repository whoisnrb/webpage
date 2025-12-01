import { ServiceLayout } from "@/components/templates/service-layout"
import { UseCases } from "@/components/sections/use-cases"
import { Code2, Database, Mail, Calendar, FileText, Zap } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Link } from "@/i18n/routing"

const useCases = [
    {
        title: "E-mail automatizáció",
        description: "Automatikus e-mail küldés eseményekre, emlékeztetőkre, vagy marketing kampányokra.",
        icon: Mail,
        example: "Új ügyfél regisztrációkor automatikus üdvözlő e-mail sorozat, majd heti hírlevél személyre szabott tartalommal.",
        roi: "~15 óra/hó megtakarítás"
    },
    {
        title: "Adatszinkronizáció",
        description: "Különböző rendszerek közötti adatok automatikus szinkronizálása.",
        icon: Database,
        example: "WooCommerce rendelések automatikus átvezetése a számlázó rendszerbe és a CRM-be.",
        roi: "~20 óra/hó megtakarítás + 95% kevesebb hiba"
    },
    {
        title: "Riport generálás",
        description: "Automatikus riportok készítése és kiküldése megadott időközönként.",
        icon: FileText,
        example: "Heti értékesítési riport automatikus generálása Excel-ben, grafikonokkal és kiküldés e-mailben.",
        roi: "~10 óra/hó megtakarítás"
    },
    {
        title: "Naptár integráció",
        description: "Automatikus időpontfoglalás, emlékeztetők és naptár szinkronizáció.",
        icon: Calendar,
        example: "Ügyfél foglaláskor automatikus Google Calendar bejegyzés + SMS emlékeztető 24 órával előtte.",
        roi: "~8 óra/hó megtakarítás + jobb ügyfélélmény"
    },
    {
        title: "Weboldal monitoring",
        description: "Weboldal elérhetőség, teljesítmény és változások automatikus figyelése.",
        icon: Zap,
        example: "Óránkénti ellenőrzés, hogy a webshop elérhető-e. Leállás esetén azonnali értesítés SMS-ben és e-mailben.",
        roi: "99.9% uptime + gyors reagálás"
    },
    {
        title: "Adatfeldolgozás",
        description: "Nagy mennyiségű adat automatikus feldolgozása, tisztítása, átalakítása.",
        icon: Database,
        example: "Napi 1000+ termék ár és készlet frissítése beszállítói CSV alapján, automatikus feltöltés a webshopba.",
        roi: "~30 óra/hó megtakarítás"
    }
]

export default function ScriptekPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <ServiceLayout
                title="Egyedi Scriptek & Automatizáció"
                description="Automatizáld az unalmas, ismétlődő feladatokat. Spórolj időt és csökkentsd a hibalehetőségeket egyedi scriptekkel és workflow-kkal."
                icon={<Code2 className="h-8 w-8" />}
                features={[
                    "n8n workflow tervezés és implementálás",
                    "Egyedi Python / Node.js scriptek",
                    "Adatbázis szinkronizáció",
                    "API integrációk (CRM, Számlázó, Webshop)",
                    "Időzített feladatok (Cron jobs)",
                    "Automatikus riport generálás",
                    "E-mail automatizáció",
                    "Webhook integráció"
                ]}
                benefits={[
                    {
                        title: "Időmegtakarítás",
                        description: "Ami eddig órákig tartott, most másodpercek alatt fut le automatikusan. Ügyfeleink átlagosan 20-30 óra/hó munkaidőt takarítanak meg."
                    },
                    {
                        title: "Hibamentesség",
                        description: "Az automatizáció nem fárad el és nem vét elgépelési hibákat. 95%-kal kevesebb emberi hiba."
                    },
                    {
                        title: "Skálázhatóság",
                        description: "A rendszereid képesek lesznek kezelni a növekvő forgalmat emberi beavatkozás nélkül."
                    }
                ]}
                techStack={["Python", "Node.js", "n8n", "Docker", "REST API", "GraphQL", "Zapier", "Make"]}
                pricing="50.000 Ft-tól"
            />

            {/* Use Cases */}
            <UseCases
                title="Mire használhatod?"
                description="Valós példák arra, hogyan segíthetnek az automatizációk a vállalkozásodnak"
                cases={useCases}
            />

            {/* Pricing Tiers */}
            <section className="py-16 md:py-24">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                            Árazási modellek
                        </h2>
                        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                            Válaszd ki a projekted komplexitásának megfelelő árazást
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        <Card className="border-2">
                            <CardHeader>
                                <CardTitle className="text-2xl">Egyszerű</CardTitle>
                                <CardDescription className="text-base">
                                    Kisebb automatizációk, 1-2 integrációval
                                </CardDescription>
                                <div className="pt-4">
                                    <div className="text-3xl font-bold">50.000 Ft</div>
                                    <p className="text-sm text-muted-foreground">egyszeri díj</p>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2 text-sm">
                                    <li>• 1-2 API integráció</li>
                                    <li>• Egyszerű logika</li>
                                    <li>• Alapvető hibaellenőrzés</li>
                                    <li>• 1 hónap support</li>
                                    <li>• Dokumentáció</li>
                                </ul>
                                <p className="text-xs text-muted-foreground mt-4 italic">
                                    Pl: E-mail küldés űrlap kitöltéskor
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="border-2 border-primary shadow-lg">
                            <CardHeader>
                                <div className="inline-block px-3 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded-full mb-2">
                                    Legnépszerűbb
                                </div>
                                <CardTitle className="text-2xl">Közepes</CardTitle>
                                <CardDescription className="text-base">
                                    Komplex workflow-k, több integrációval
                                </CardDescription>
                                <div className="pt-4">
                                    <div className="text-3xl font-bold">120.000 Ft</div>
                                    <p className="text-sm text-muted-foreground">egyszeri díj</p>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2 text-sm">
                                    <li>• 3-5 API integráció</li>
                                    <li>• Komplex üzleti logika</li>
                                    <li>• Fejlett hibaellenőrzés</li>
                                    <li>• Adatbázis műveletek</li>
                                    <li>• 3 hónap support</li>
                                    <li>• Részletes dokumentáció</li>
                                </ul>
                                <p className="text-xs text-muted-foreground mt-4 italic">
                                    Pl: Rendelés → Számla → CRM → E-mail
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="border-2">
                            <CardHeader>
                                <CardTitle className="text-2xl">Komplex</CardTitle>
                                <CardDescription className="text-base">
                                    Nagyvállalati szintű automatizáció
                                </CardDescription>
                                <div className="pt-4">
                                    <div className="text-3xl font-bold">250.000 Ft+</div>
                                    <p className="text-sm text-muted-foreground">egyedi árazás</p>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2 text-sm">
                                    <li>• 6+ API integráció</li>
                                    <li>• Microservices architektúra</li>
                                    <li>• AI/ML integráció</li>
                                    <li>• Valós idejű feldolgozás</li>
                                    <li>• 6 hónap support</li>
                                    <li>• Teljes dokumentáció + képzés</li>
                                </ul>
                                <p className="text-xs text-muted-foreground mt-4 italic">
                                    Pl: Teljes ügyfélkezelési rendszer
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

            {/* Example Projects */}
            <section className="py-16 md:py-24 bg-muted/30">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                            Példa projektek
                        </h2>
                        <p className="text-muted-foreground text-lg">
                            Nézd meg, milyen automatizációkat készítettünk már
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                        <Card>
                            <CardHeader>
                                <CardTitle>E-commerce automatizáció</CardTitle>
                                <CardDescription>Webshop + Számlázó + Raktár szinkronizáció</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground mb-4">
                                    Automatikus rendelésfeldolgozás: új rendelés → számla generálás (Billingo) →
                                    készlet frissítés → ügyfél értesítés e-mailben → CRM bejegyzés.
                                </p>
                                <div className="flex items-center justify-between pt-4 border-t">
                                    <span className="text-sm font-semibold">Megtakarítás:</span>
                                    <span className="text-sm text-primary">~25 óra/hó</span>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Marketing automatizáció</CardTitle>
                                <CardDescription>Lead nurturing és követés</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground mb-4">
                                    Új lead → üdvözlő e-mail → 3 napos e-mail sorozat →
                                    ha nem reagál, értesítés az értékesítőnek → ha reagál, időpont foglalás link.
                                </p>
                                <div className="flex items-center justify-between pt-4 border-t">
                                    <span className="text-sm font-semibold">Konverzió növekedés:</span>
                                    <span className="text-sm text-primary">+35%</span>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Adatgyűjtés és riportolás</CardTitle>
                                <CardDescription>Automatikus heti riportok</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground mb-4">
                                    Heti adatgyűjtés Google Analytics, Facebook Ads, Google Ads-ből →
                                    Excel riport generálás grafikonokkal → kiküldés e-mailben a vezetőségnek.
                                </p>
                                <div className="flex items-center justify-between pt-4 border-t">
                                    <span className="text-sm font-semibold">Megtakarítás:</span>
                                    <span className="text-sm text-primary">~12 óra/hó</span>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Ügyfélszolgálat automatizáció</CardTitle>
                                <CardDescription>Ticket rendszer integráció</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground mb-4">
                                    E-mail beérkezik → automatikus ticket létrehozás →
                                    kategorizálás AI-val → hozzárendelés a megfelelő munkatárshoz →
                                    automatikus válasz az ügyfélnek.
                                </p>
                                <div className="flex items-center justify-between pt-4 border-t">
                                    <span className="text-sm font-semibold">Válaszidő csökkenés:</span>
                                    <span className="text-sm text-primary">-60%</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>
        </div>
    )
}
