
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Code2, Server, Shield, ShoppingCart, ArrowRight, CheckCircle2 } from "lucide-react"
import { Link } from "@/i18n/routing"
import { Badge } from "@/components/ui/badge"

const services = [
    {
        title: "Egyedi Scriptek & Automatizáció",
        description: "Spórolj órákat a munkafolyamataid automatizálásával. Python, Node.js, n8n workflow-ok.",
        icon: Code2,
        href: "/szolgaltatasok/scriptek",
        pricing: "50.000 Ft-tól",
        features: ["API integrációk", "Workflow automatizáció", "Adatszinkronizáció", "Riport generálás"]
    },
    {
        title: "Webfejlesztés & Webáruház",
        description: "Modern, gyors és konverzió-fókuszált weboldalak és webshopok (WooCommerce, Next.js).",
        icon: ShoppingCart,
        href: "/szolgaltatasok/webfejlesztes",
        pricing: "150.000 Ft-tól",
        features: ["Reszponzív design", "E-commerce", "SEO optimalizálás", "Headless CMS"]
    },
    {
        title: "Rendszerüzemeltetés & DevOps",
        description: "Stabil szerverháttér, CI/CD pipeline-ok, Docker konténerizáció és felhő megoldások.",
        icon: Server,
        href: "/szolgaltatasok/rendszeruzemeltetes",
        pricing: "Egyedi árazás",
        features: ["CI/CD pipeline", "Docker & Kubernetes", "Felhő infrastruktúra", "Monitoring"]
    },
    {
        title: "Biztonság & Audit",
        description: "Weboldal biztonsági átvilágítás, sérülékenység vizsgálat és védelem beállítása.",
        icon: Shield,
        href: "/szolgaltatasok/biztonsag",
        pricing: "80.000 Ft-tól",
        features: ["Biztonsági audit", "Penetration testing", "WAF beállítás", "GDPR compliance"]
    }
]

export default function SzolgaltatasokPage() {
    return (
        <>
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-muted/30 py-20 md:py-32">
                <div className="absolute inset-0 bg-grid-slate-200 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-slate-800/50" />
                <div className="container relative mx-auto px-4 text-center">
                    <Badge className="mb-4" variant="secondary">Professzionális IT Megoldások</Badge>
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
                        Növeld vállalkozásod hatékonyságát<br />
                        <span className="text-primary">modern technológiákkal</span>
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-10">
                        Legyen szó egyedi szoftverfejlesztésről, folyamatautomatizálásról vagy stabil üzemeltetésről,
                        mi szakértő partnerként támogatunk a digitális transzformációban.
                    </p>
                    <div className="flex flex-wrap gap-4 justify-center">
                        <Link href="/arak">
                            <Button size="lg" className="bg-accent hover:bg-accent/90 text-white h-12 px-8 text-lg">
                                Árajánlat kérése
                            </Button>
                        </Link>
                        <Link href="#szolgaltatasok">
                            <Button size="lg" variant="outline" className="h-12 px-8 text-lg">
                                Szolgáltatásaink
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Services Grid */}
            <section id="szolgaltatasok" className="py-20 md:py-32">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                            Szolgáltatásaink
                        </h2>
                        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                            Átfogó megoldások a tervezéstől a megvalósításig
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                        {services.map((service, index) => {
                            const Icon = service.icon
                            return (
                                <Card key={index} className="flex flex-col border-2 hover:border-primary/50 transition-all hover:shadow-lg group">
                                    <CardHeader>
                                        <div className="flex items-start justify-between">
                                            <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                                                <Icon className="h-7 w-7" />
                                            </div>
                                            <Badge variant="outline" className="text-primary border-primary/20">
                                                {service.pricing}
                                            </Badge>
                                        </div>
                                        <CardTitle className="text-2xl mb-2">{service.title}</CardTitle>
                                        <CardDescription className="text-base leading-relaxed">
                                            {service.description}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="flex-1 flex flex-col">
                                        <div className="flex-1">
                                            <h4 className="font-semibold mb-3 text-sm uppercase tracking-wider text-muted-foreground">Mit tartalmaz?</h4>
                                            <ul className="space-y-3 mb-8">
                                                {service.features.map((feature, idx) => (
                                                    <li key={idx} className="flex items-start gap-3 text-sm">
                                                        <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                                                        <span>{feature}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        <Link href={service.href} className="mt-auto">
                                            <Button className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors" variant="outline">
                                                Részletek és Megrendelés <ArrowRight className="ml-2 h-4 w-4" />
                                            </Button>
                                        </Link>
                                    </CardContent>
                                </Card>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* Tech Stack / Why Us */}
            <section className="py-20 md:py-32 bg-slate-950 text-white overflow-hidden relative">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black opacity-80" />
                <div className="container relative mx-auto px-4">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">
                                Miért a BacklineIT?
                            </h2>
                            <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                                Nem csak kódolunk, hanem üzleti problémákat oldunk meg. Célunk, hogy a technológia ne teher, hanem versenyelőny legyen a vállalkozásod számára.
                            </p>

                            <div className="space-y-6">
                                <div className="flex gap-4">
                                    <div className="h-12 w-12 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0">
                                        <Code2 className="h-6 w-6 text-blue-400" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-xl mb-1">Modern Technológia</h3>
                                        <p className="text-slate-400">Next.js, React, Node.js, Python - a legmodernebb eszközökkel dolgozunk a gyors és skálázható eredményért.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="h-12 w-12 rounded-full bg-green-500/20 flex items-center justify-center shrink-0">
                                        <Shield className="h-6 w-6 text-green-400" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-xl mb-1">Biztonság és Stabilitás</h3>
                                        <p className="text-slate-400">Kiemelt figyelmet fordítunk az adatvédelemre és a rendszerek folyamatos rendelkezésre állására.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="h-12 w-12 rounded-full bg-purple-500/20 flex items-center justify-center shrink-0">
                                        <Server className="h-6 w-6 text-purple-400" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-xl mb-1">Skálázhatóság</h3>
                                        <p className="text-slate-400">Olyan rendszereket építünk, amelyek együtt nőnek a vállalkozásoddal, legyen szó 10 vagy 10.000 felhasználóról.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur-2xl opacity-30" />
                            <div className="relative bg-slate-900 border border-slate-800 rounded-2xl p-8">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-slate-800/50 p-6 rounded-xl text-center">
                                        <div className="text-4xl font-bold text-blue-400 mb-2">100%</div>
                                        <div className="text-sm text-slate-400">Határidőre</div>
                                    </div>
                                    <div className="bg-slate-800/50 p-6 rounded-xl text-center">
                                        <div className="text-4xl font-bold text-purple-400 mb-2">24/7</div>
                                        <div className="text-sm text-slate-400">Monitoring</div>
                                    </div>
                                    <div className="bg-slate-800/50 p-6 rounded-xl text-center">
                                        <div className="text-4xl font-bold text-green-400 mb-2">50+</div>
                                        <div className="text-sm text-slate-400">Sikeres Projekt</div>
                                    </div>
                                    <div className="bg-slate-800/50 p-6 rounded-xl text-center">
                                        <div className="text-4xl font-bold text-yellow-400 mb-2">5.0</div>
                                        <div className="text-sm text-slate-400">Ügyfél Értékelés</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 md:py-32">
                <div className="container mx-auto px-4">
                    <div className="bg-primary rounded-3xl p-8 md:p-16 text-center text-primary-foreground relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-full bg-[url('/grid-pattern.svg')] opacity-10" />
                        <div className="relative z-10 max-w-3xl mx-auto">
                            <h2 className="text-3xl md:text-5xl font-bold mb-6">
                                Készen állsz a közös munkára?
                            </h2>
                            <p className="text-xl text-primary-foreground/90 mb-10">
                                Foglalj egy ingyenes, 30 perces konzultációt, ahol átbeszéljük az elképzeléseidet és technikai tanácsokat adunk.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link href="/kapcsolat">
                                    <Button size="lg" variant="secondary" className="h-14 px-8 text-lg w-full sm:w-auto">
                                        Ingyenes konzultáció
                                    </Button>
                                </Link>
                                <Link href="/arak">
                                    <Button size="lg" variant="outline" className="h-14 px-8 text-lg w-full sm:w-auto border-primary-foreground/30 hover:bg-primary-foreground/10 text-primary-foreground">
                                        Csomagajánlatok
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}
