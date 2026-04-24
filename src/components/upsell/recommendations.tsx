import { Link } from "@/i18n/routing"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles } from "lucide-react"
import { useTranslations } from "next-intl"

// Simple mapping for keys. Titles and descriptions are now localized.
const serviceMapping: Record<string, { key: string; link: string }> = {
    "Webdevelopment": {
        key: "webdev",
        link: "/szolgaltatasok/webfejlesztes"
    },
    "Automation": {
        key: "automation",
        link: "/szolgaltatasok/scriptek"
    },
    "Consulting": {
        key: "consulting",
        link: "/kapcsolat"
    },
    "Cloud": {
        key: "cloud",
        link: "/szolgaltatasok/rendszeruzemeltetes"
    },
    "Security": {
        key: "security",
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
    const t = useTranslations('References.upsell');

    // Logic to find relevant services based on tags or direct mapping
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
                            <span>{title || t('title')}</span>
                        </div>
                        <h3 className="text-2xl font-bold">{description || t('description')}</h3>
                    </div>
                    <Link href="/kapcsolat">
                        <Button variant="default">
                            {t('cta_button')}
                        </Button>
                    </Link>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    {recommendations.map((rec, idx) => (
                        <Card key={idx} className="bg-background border-none shadow-sm hover:shadow-md transition-shadow">
                            <CardHeader>
                                <CardTitle className="text-xl">{t(`services.${rec.key}.title`)}</CardTitle>
                                <CardDescription>{t(`services.${rec.key}.description`)}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Link href={rec.link as any}>
                                    <Button variant="outline" className="w-full group">
                                        {t('view_more')} <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
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
