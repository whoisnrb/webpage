import { Link } from "@/i18n/routing"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles } from "lucide-react"
import { useTranslations } from "next-intl"

const SERVICE_DEFS = [
    {
        key: "webshop",
        link: "/szolgaltatasok/webshop-automatizacio",
        keywords: ["e-commerce", "ecommerce", "webshop", "webáruház", "unas", "woocommerce", "shopify", "shop", "product"]
    },
    {
        key: "automation",
        link: "/szolgaltatasok/scriptek",
        keywords: ["automation", "automatiz", "python", "script", "batch", "n8n", "api", "erp", "crm", "sync", "szinkron", "scrape", "data"]
    },
    {
        key: "ai",
        link: "/szolgaltatasok/ai-asszisztensek",
        keywords: ["ai", "gpt", "rag", "ocr", "vision", "chatbot", "assistant", "asszisztens", "bot", "llm"]
    },
    {
        key: "webdev",
        link: "/szolgaltatasok/webfejlesztes",
        keywords: ["webdev", "webfejleszt", "next.js", "nextjs", "react", "website", "portál", "portal", "landing", "seo"]
    },
    {
        key: "cloud",
        link: "/szolgaltatasok/rendszeruzemeltetes",
        keywords: ["cloud", "felhő", "server", "szerver", "devops", "rendszer", "üzemeltetés", "monitor", "linux", "azure", "docker", "hosting"]
    },
    {
        key: "security",
        link: "/szolgaltatasok/biztonsag",
        keywords: ["security", "biztonság", "gdpr", "audit", "waf", "nis2", "backup", "vpn", "ssl"]
    },
    {
        key: "consulting",
        link: "/demo",
        keywords: ["consulting", "tanácsad", "strategy"]
    }
]

interface UpsellEngineProps {
    tags: string[];
    currentService?: string;
    title?: string;
    description?: string;
}

export function UpsellEngine({ tags, title, description }: UpsellEngineProps) {
    const t = useTranslations('References.upsell');
    const normalizedTags = tags.map(tag => tag.toLowerCase());

    // Score each service by matching tag/category keywords
    const scored = SERVICE_DEFS
        .map(def => {
            const score = def.keywords.reduce((acc, kw) => {
                return acc + (normalizedTags.some(tag => tag.includes(kw)) ? 1 : 0);
            }, 0);
            return { ...def, score };
        })
        .filter(def => def.score > 0)
        .sort((a, b) => b.score - a.score);

    const pickedKeys = new Set(scored.map(s => s.key));
    const finalList = [...scored];

    for (const fallbackKey of ["automation", "consulting", "webdev"]) {
        if (finalList.length >= 2) break;
        if (!pickedKeys.has(fallbackKey)) {
            const def = SERVICE_DEFS.find(d => d.key === fallbackKey);
            if (def) {
                finalList.push({ ...def, score: 0 });
                pickedKeys.add(fallbackKey);
            }
        }
    }

    const recommendations = finalList.slice(0, 2);

    return (
        <section className="rounded-3xl border border-white/10 bg-[#06101c]/80 backdrop-blur-2xl p-6 md:p-10 my-12 relative overflow-hidden shadow-[0_0_40px_-15px_rgba(6,182,212,0.15)]">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500/60 via-blue-500/60 to-transparent" />

            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
                <div>
                    <div className="inline-flex items-center gap-2 mb-2 text-cyan-400 text-xs font-black uppercase tracking-wider">
                        <Sparkles className="w-4 h-4" />
                        <span>{title || t('title')}</span>
                    </div>
                    <h3 className="text-xl md:text-2xl font-black text-white">{description || t('description')}</h3>
                </div>
                <Button
                    asChild
                    className="rounded-xl h-11 px-6 bg-gradient-to-r from-cyan-400 to-blue-600 hover:from-cyan-300 hover:to-blue-500 text-slate-950 font-black shrink-0"
                >
                    <Link href="/demo">
                        {t('cta_button')}
                        <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                </Button>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
                {recommendations.map((rec) => (
                    <div
                        key={rec.key}
                        className="flex flex-col justify-between rounded-2xl border border-white/10 bg-white/[0.03] hover:border-cyan-500/40 p-6 transition-all group"
                    >
                        <div className="space-y-2 mb-6">
                            <h4 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                                {t(`services.${rec.key}.title`)}
                            </h4>
                            <p className="text-sm text-white/60 leading-relaxed">
                                {t(`services.${rec.key}.description`)}
                            </p>
                        </div>
                        <Button
                            variant="outline"
                            asChild
                            className="w-full h-10 rounded-xl border-white/15 bg-white/[0.03] hover:bg-cyan-500/15 hover:border-cyan-400/50 text-white font-semibold group/btn"
                        >
                            <Link href={rec.link as any}>
                                {t('view_more')}
                                <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                            </Link>
                        </Button>
                    </div>
                ))}
            </div>
        </section>
    )
}
