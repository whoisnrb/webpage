import { Link } from "@/i18n/routing"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles } from "lucide-react"

// Simple mapping for demonstration. In a real app, this could be more complex logic or DB driven.
const serviceMapping: Record<string, { title: string; description: string; link: string }> = {
    "Webdevelopment": {
        title: "Egyedi Webfejlesztés",
        description: "Modern, gyors és skálázható weboldalak és webalkalmazások fejlesztése Next.js alapokon.",
        link: "/szolgaltatasok/webfejlesztes"
    },
    "Automation": {
        title: "Üzleti Automatizáció",
        description: "Spórolj időt és pénzt! Automatizáld unalmas, ismétlődő folyamataidat n8n segítségével.",
        link: "/szolgaltatasok/automatizacio" // Note: Check real link if needed, assuming generic structure
    },
    "Consulting": {
        title: "IT Tanácsadás",
        description: "Segítünk megtalálni a legjobb technológiai megoldást üzleti problémáidra.",
        link: "/kapcsolat"
    },
    "Cloud": {
        title: "Felhő Infrastruktúra",
        description: "Biztonságos és skálázható szervermegoldások (AWS, Vercel) telepítése és üzemeltetése.",
        link: "/szolgaltatasok/rendszeruzemeltetes"
    },
    "Security": {
        title: "Kiberbiztonság",
        description: "Védd meg adataidat és rendszereidet! Biztonsági audit és GDPR megfelelés biztosítása.",
        link: "/szolgaltatasok/biztonsag"
    }
}

interface UpsellEngineProps {
    tags: string[];
    currentService?: string;
    title?: string;
    description?: string;
}

export function UpsellEngine({ tags, currentService, title, description }: UpsellEngineProps) {
    // Logic to find relevant services based on tags or direct mapping
    // For simplicity, we filter the `serviceMapping` keys that are present in the `tags` array
    // If no direct tag matches, we can fallback or show defaults.

    // Normalize tags for matching
    const relevantServices = Object.keys(serviceMapping).filter(key =>
        tags.some(tag => tag.toLowerCase().includes(key.toLowerCase()) || key.toLowerCase().includes(tag.toLowerCase()))
    );

    // If we found fewer than 2, fill up with generic ones (e.g. Consulting) if not present
    if (relevantServices.length < 2) {
        if (!relevantServices.includes("Webdevelopment")) relevantServices.push("Webdevelopment");
        if (!relevantServices.includes("Consulting") && relevantServices.length < 2) relevantServices.push("Consulting");
    }

    // Limit to 2 recommendations for a clean look
    const recommendations = relevantServices.slice(0, 2).map(key => serviceMapping[key]);

    return (
        <section className="py-12 bg-muted/40 rounded-xl my-12 border border-primary/10">
            <div className="container px-4 md:px-6">
                <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-2 text-primary font-medium">
                            <Sparkles className="w-5 h-5" />
                            <span>{title || "Hogyan segíthetünk neked?"}</span>
                        </div>
                        <h3 className="text-2xl font-bold">{description || "Hasonló megoldások a te vállalkozásodnak"}</h3>
                    </div>
                    <Link href="/kapcsolat">
                        <Button variant="default">
                            Ingyenes Konzultáció
                        </Button>
                    </Link>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    {recommendations.map((rec, idx) => (
                        <Card key={idx} className="bg-background border-none shadow-sm hover:shadow-md transition-shadow">
                            <CardHeader>
                                <CardTitle className="text-xl">{rec.title}</CardTitle>
                                <CardDescription>{rec.description}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Link href={rec.link}>
                                    <Button variant="outline" className="w-full group">
                                        Megnézem <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    )
}
