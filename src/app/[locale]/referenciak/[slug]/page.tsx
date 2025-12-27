import { caseStudies } from '@/lib/case-studies-data'
import { UpsellEngine } from '@/components/upsell/recommendations'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, CheckCircle2 } from "lucide-react"
import { Link } from "@/i18n/routing"
import { notFound } from 'next/navigation'

// Correct usage for Next.js 15+ dynamic params:
// params is a Promise that resolves to the params object.
export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const study = caseStudies.find(s => s.slug === slug);

    if (!study) {
        notFound();
    }

    // Determine upsell tags based on study tags + category
    const upsellTags = [...study.tags, study.category];

    return (
        <div className="min-h-screen flex flex-col pt-20">
            <div className="container mx-auto px-4 py-8">
                <Link href="/referenciak">
                    <Button variant="ghost" className="mb-6 pl-0 hover:pl-2 transition-all">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Vissza az esettanulmányokhoz
                    </Button>
                </Link>

                {/* Hero */}
                <div className="grid lg:grid-cols-2 gap-12 mb-16 items-center">
                    <div>
                        <Badge className="mb-4" variant="secondary">{study.category}</Badge>
                        <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight leading-tight">{study.title}</h1>
                        <p className="text-xl text-muted-foreground mb-6 font-medium">
                            {study.client}
                        </p>
                        <p className="text-lg text-muted-foreground mb-8">
                            {study.description}
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {study.tags.map((tag, i) => (
                                <Badge key={i} variant="outline" className="px-3 py-1 text-sm bg-muted/50">
                                    {tag}
                                </Badge>
                            ))}
                        </div>
                    </div>
                    <div className={`aspect-video rounded-2xl ${study.image} flex items-center justify-center shadow-2xl skew-y-1 transform transition-all`}>
                        <div className="text-center p-6">
                            <div className="font-bold text-4xl opacity-20 uppercase tracking-widest text-primary-foreground">{study.client.split(' ')[0]}</div>
                        </div>
                    </div>
                </div>

                {/* Details Grid */}
                <div className="grid md:grid-cols-3 gap-8 mb-16">
                    <div className="bg-card border rounded-xl p-8 shadow-sm">
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <span className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-2 rounded-lg">⚠️</span>
                            Kihívás
                        </h3>
                        <p className="text-muted-foreground leading-relaxed">
                            {study.challenge}
                        </p>
                    </div>
                    <div className="bg-card border rounded-xl p-8 shadow-sm">
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 p-2 rounded-lg">🛠️</span>
                            Megoldás
                        </h3>
                        <p className="text-muted-foreground leading-relaxed">
                            {study.solution}
                        </p>
                    </div>
                    <div className="bg-card border rounded-xl p-8 shadow-sm">
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <span className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 p-2 rounded-lg">🚀</span>
                            Eredmény
                        </h3>
                        <p className="text-muted-foreground leading-relaxed">
                            {study.result}
                        </p>
                    </div>
                </div>

                {/* Results Highlight (Mock) */}
                <div className="bg-primary/5 rounded-2xl p-8 md:p-12 mb-16 text-center">
                    <h2 className="text-2xl font-bold mb-8">Főbb Eredmények</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        <div>
                            <div className="text-3xl md:text-4xl font-bold text-primary mb-2">40%</div>
                            <div className="text-sm text-muted-foreground font-medium">Konverzió Növekedés</div>
                        </div>
                        <div>
                            <div className="text-3xl md:text-4xl font-bold text-primary mb-2">3x</div>
                            <div className="text-sm text-muted-foreground font-medium">Gyorsabb Betöltés</div>
                        </div>
                        <div>
                            <div className="text-3xl md:text-4xl font-bold text-primary mb-2">100%</div>
                            <div className="text-sm text-muted-foreground font-medium">Automatizált</div>
                        </div>
                        <div>
                            <div className="text-3xl md:text-4xl font-bold text-primary mb-2">0</div>
                            <div className="text-sm text-muted-foreground font-medium">Adatvesztés</div>
                        </div>
                    </div>
                </div>

                {/* Upsell Engine Integration */}
                <UpsellEngine
                    tags={upsellTags}
                    title="Hasonló problémával küzdesz?"
                    description="Nézd meg szolgáltatásainkat, melyekkel a te cégedet is sikerre vihetjük."
                />

            </div>
        </div>
    )
}
