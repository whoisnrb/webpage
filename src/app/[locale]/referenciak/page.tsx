import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight } from "lucide-react"

// Mock data for case studies
const caseStudies = [
    {
        title: "Webshop Optimalizálás & Automatizáció",
        client: "GreenLeaf Bio Kft.",
        category: "E-kereskedelem",
        description: "WooCommerce-ről Next.js-re váltás és teljes körű raktárkészlet szinkronizáció, ami 40%-kal növelte a konverziót.",
        tags: ["Next.js", "n8n", "WooCommerce"],
        image: "bg-green-500/10"
    },
    {
        title: "Biztonságos Páciens Kezelő Rendszer",
        client: "Praxis Dr. Kovács",
        category: "Egészségügy",
        description: "GDPR-kompatibilis, titkosított páciens adatbázis és időpontfoglaló rendszer privát felhő infrastruktúrán.",
        tags: ["Private Cloud", "Security", "GDPR"],
        image: "bg-blue-500/10"
    },
    {
        title: "High-Availability Szerver Klaszter",
        client: "Apex Logistics Zrt.",
        category: "Logisztika",
        description: "0-24 órás rendelkezésre állású szerverpark kiépítése nyomkövető rendszerek számára, 99.99% uptime-mal.",
        tags: ["Linux", "HAProxy", "Monitoring"],
        image: "bg-orange-500/10"
    }
]

export default function ReferenciakPage() {
    return (
        <div className="min-h-screen flex flex-col">
            <section className="bg-muted/30 py-20 md:py-32 border-b relative overflow-hidden">
                <div className="absolute inset-0 bg-grid-slate-200 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-slate-800/50" />
                <div className="container relative mx-auto px-4 text-center">
                    <Badge className="mb-4" variant="outline">Sikertörténetek</Badge>
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">Esettanulmányok</h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Nézd meg, hogyan segítettünk más vállalkozásoknak növekedni, automatizálni és hatékonyabbá válni modern IT megoldásokkal.
                    </p>
                </div>
            </section>

            <section className="py-20 md:py-32">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {caseStudies.map((study, index) => (
                            <Card key={index} className="flex flex-col overflow-hidden hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/20 group">
                                <div className={`h-56 w-full ${study.image} flex items-center justify-center relative overflow-hidden`}>
                                    <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors" />
                                    {/* Placeholder for project image - in real app use Next.js Image */}
                                    <div className="text-center p-6">
                                        <div className="font-bold text-2xl opacity-20 uppercase tracking-widest">{study.client.split(' ')[0]}</div>
                                    </div>
                                </div>
                                <CardHeader>
                                    <div className="flex justify-between items-start mb-3">
                                        <Badge variant="secondary" className="mb-2">{study.category}</Badge>
                                    </div>
                                    <CardTitle className="text-2xl mb-2 group-hover:text-primary transition-colors">{study.title}</CardTitle>
                                    <CardDescription className="font-medium text-foreground/80">{study.client}</CardDescription>
                                </CardHeader>
                                <CardContent className="flex-1 flex flex-col">
                                    <p className="text-muted-foreground mb-8 flex-1 leading-relaxed">
                                        {study.description}
                                    </p>
                                    <div className="flex flex-wrap gap-2 mb-8">
                                        {study.tags.map((tag, i) => (
                                            <span key={i} className="text-xs bg-muted px-2.5 py-1 rounded-md font-medium text-muted-foreground border">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                    <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                                        Részletek megtekintése <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-20 md:py-32 bg-primary text-primary-foreground text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10" />
                <div className="container relative mx-auto px-4">
                    <h2 className="text-3xl md:text-5xl font-bold mb-8">Te lehetsz a következő sikersztori</h2>
                    <p className="text-xl text-primary-foreground/80 mb-10 max-w-2xl mx-auto">
                        Ne maradj le a digitális versenyben. Kérj ajánlatot még ma, és kezdjük el a közös munkát!
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button size="lg" className="bg-accent hover:bg-accent/90 text-white h-14 px-10 text-lg shadow-lg">
                            Kérj ajánlatot most
                        </Button>
                        <Button size="lg" variant="outline" className="h-14 px-10 text-lg border-primary-foreground/30 hover:bg-primary-foreground/10 text-primary-foreground">
                            Kapcsolatfelvétel
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    )
}
