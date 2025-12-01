import { ServiceLayout } from "@/components/templates/service-layout"
import { PriceCalculator } from "@/components/tools/price-calculator"
import { UseCases } from "@/components/sections/use-cases"
import { Server, Cloud, Shield, Activity, GitBranch, Database } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Link } from "@/i18n/routing"

const useCases = [
    {
        title: "CI/CD Pipeline",
        description: "Automatizált tesztelés és élesítés minden kódmódosításnál.",
        icon: GitBranch,
        example: "GitHub push -> Automatikus teszt futtatás -> Build -> Deploy éles szerverre leállás nélkül.",
        roi: "Gyorsabb fejlesztés, 0 hibás deploy"
    },
    {
        title: "Felhő Migráció",
        description: "Hagyományos szerverek költöztetése modern felhő infrastruktúrába.",
        icon: Cloud,
        example: "Régi VPS költöztetése AWS-be, auto-scaling beállítása a forgalmi csúcsok kezelésére.",
        roi: "Skálázhatóság, költséghatékonyság"
    },
    {
        title: "Szerver Monitoring",
        description: "24/7 felügyelet és azonnali riasztás hiba esetén.",
        icon: Activity,
        example: "CPU, RAM, Tárhely figyelése. Ha a válaszidő megnő, vagy leáll a szolgáltatás, SMS riasztás.",
        roi: "99.9% rendelkezésre állás"
    },
    {
        title: "Biztonsági Mentés",
        description: "Automatizált, titkosított mentések külső helyszínre.",
        icon: Database,
        example: "Napi adatbázis és fájl mentés S3-ba, 30 napos visszakereshetőséggel. Havi visszaállítás teszt.",
        roi: "Adatvesztés elleni védelem"
    },
    {
        title: "Load Balancing",
        description: "Forgalom elosztása több szerver között a stabilitásért.",
        icon: Server,
        example: "Nginx load balancer beállítása 3 web szerver elé. Ha egy kiesik, a többi átveszi a terhelést.",
        roi: "Nincs leállás nagy forgalomnál sem"
    },
    {
        title: "Infrastruktúra Kódként (IaC)",
        description: "Szerverek és hálózatok kezelése kódként (Terraform, Ansible).",
        icon: Shield,
        example: "Teljes környezet felhúzása egy parancssal. Reprodukálható, verziókezelt infrastruktúra.",
        roi: "Gyors környezet létrehozás, dokumentáltság"
    }
]

export default function RendszeruzemeltetesPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <ServiceLayout
                title="Rendszerüzemeltetés & DevOps"
                description="Stabil szerverháttér és automatizált folyamatok. Hogy te a fejlesztésre és az üzletre koncentrálhass, ne a szerverekre."
                icon={<Server className="h-8 w-8" />}
                features={[
                    "CI/CD pipeline építés (GitHub Actions, GitLab CI)",
                    "Docker konténerizáció és Kubernetes",
                    "Felhő infrastruktúra (AWS, DigitalOcean, Hetzner)",
                    "Szerver monitoring és riasztás (Prometheus, Grafana)",
                    "Automatikus biztonsági mentések",
                    "Load balancing és skálázás",
                    "Log menedzsment (ELK Stack)",
                    "Infrastruktúra tervezés és optimalizálás"
                ]}
                benefits={[
                    {
                        title: "Stabilitás",
                        description: "99.9%-os rendelkezésre állás és gyors hibaelhárítás. Megelőzzük a bajt, mielőtt bekövetkezne."
                    },
                    {
                        title: "Gyorsabb fejlesztés",
                        description: "Az automatizált deploy folyamatokkal a fejlesztők gyorsabban tudnak dolgozni, nem kell a szerverekkel bajlódniuk."
                    },
                    {
                        title: "Költséghatékonyság",
                        description: "Optimalizált infrastruktúrával és automatizált feladatokkal csökkentjük az üzemeltetési költségeket."
                    },
                    {
                        title: "Biztonság",
                        description: "Rendszeres biztonsági frissítések, mentések és monitoring a maximális adatvédelem érdekében."
                    }
                ]}
                techStack={["Docker", "Kubernetes", "AWS", "Linux", "Nginx", "Terraform", "Ansible", "GitHub Actions"]}
                pricing="Egyedi árazás"
            />

            <section className="py-16 md:py-24 bg-muted">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-12">Mire használható?</h2>
                    <UseCases cases={useCases} />
                </div>
            </section>

            <section className="relative overflow-hidden py-16 md:py-24 bg-gray-50">
                {/* Background Elements */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
                    <div className="absolute top-20 right-0 w-72 h-72 bg-secondary/10 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
                </div>

                <div className="container relative mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-12">Áraink</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <Card className="border-2">
                            <CardHeader>
                                <CardTitle className="text-2xl">Alap</CardTitle>
                                <CardDescription className="text-base">
                                    Kisebb weboldalakhoz és alkalmazásokhoz
                                </CardDescription>
                                <div className="pt-4">
                                    <div className="text-3xl font-bold">50.000 Ft</div>
                                    <p className="text-sm text-muted-foreground">/ hó</p>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2 text-sm">
                                    <li>• Havi rendszerfrissítés</li>
                                    <li>• Rendelkezésre állás figyelés</li>
                                    <li>• Napi biztonsági mentés</li>
                                    <li>• 1 óra hibaelhárítás / hó</li>
                                    <li>• SSL tanúsítvány kezelés</li>
                                </ul>
                                <p className="text-xs text-muted-foreground mt-4 italic">
                                    Reakcióidő: 24 óra
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="border-2 border-primary shadow-lg">
                            <CardHeader>
                                <div className="inline-block px-3 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded-full mb-2">
                                    Ajánlott
                                </div>
                                <CardTitle className="text-2xl">Pro</CardTitle>
                                <CardDescription className="text-base">
                                    Üzleti kritikus alkalmazásokhoz
                                </CardDescription>
                                <div className="pt-4">
                                    <div className="text-3xl font-bold">100.000 Ft</div>
                                    <p className="text-sm text-muted-foreground">/ hó</p>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2 text-sm">
                                    <li>• Heti rendszerfrissítés</li>
                                    <li>• 24/7 Monitoring és Riasztás</li>
                                    <li>• Valós idejű biztonsági mentés</li>
                                    <li>• 4 óra hibaelhárítás / hó</li>
                                    <li>• Teljesítmény optimalizálás</li>
                                    <li>• CI/CD karbantartás</li>
                                </ul>
                                <p className="text-xs text-muted-foreground mt-4 italic">
                                    Reakcióidő: 4 óra
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="border-2">
                            <CardHeader>
                                <CardTitle className="text-2xl">Enterprise</CardTitle>
                                <CardDescription className="text-base">
                                    Nagy forgalmú rendszerekhez
                                </CardDescription>
                                <div className="pt-4">
                                    <div className="text-3xl font-bold">Egyedi</div>
                                    <p className="text-sm text-muted-foreground">megállapodás szerint</p>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2 text-sm">
                                    <li>• Dedikált DevOps mérnök</li>
                                    <li>• SLA garancia</li>
                                    <li>• High Availability tervezés</li>
                                    <li>• Katasztrófa elhárítási terv</li>
                                    <li>• Biztonsági auditok</li>
                                    <li>• Korlátlan incidens kezelés</li>
                                </ul>
                                <p className="text-xs text-muted-foreground mt-4 italic">
                                    Reakcióidő: 1 óra
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="text-center mt-12">
                        <Link href="/checkout?package=custom">
                            <Button size="lg" className="bg-accent hover:bg-accent/90">
                                Egyedi ajánlat kérése
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            <section className="relative overflow-hidden py-16 md:py-24">
                {/* Background Elements */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
                    <div className="absolute top-20 right-0 w-72 h-72 bg-secondary/10 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
                </div>

                <div className="container relative mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4">Mennyibe kerül?</h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            Használja árkalkulátorunkat a várható költségek becsléséhez.
                            A pontos árajánlathoz kérjük, vegye fel velünk a kapcsolatot.
                        </p>
                    </div>
                    <PriceCalculator />
                </div>
            </section>
        </div>
    )
}
