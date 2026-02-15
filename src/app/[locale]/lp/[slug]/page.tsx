import { notFound } from "next/navigation";
import { landingPages } from "@/config/landing-pages";
import { industries } from "@/lib/industry-data";
import { caseStudies } from "@/lib/case-studies-data";
import { UpsellEngine } from "@/components/upsell/recommendations";
import { Button } from "@/components/ui/button";
import { Check, Star, ArrowRight, CheckCircle2 } from "lucide-react";
import { Link } from "@/i18n/routing"; // Use i18n link
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { routing } from '@/i18n/routing';

export function generateStaticParams() {
    const industrySlugs = industries.map((i) => i.slug);
    const lpSlugs = Object.keys(landingPages);
    const allSlugs = [...industrySlugs, ...lpSlugs];
    return routing.locales.flatMap((locale) =>
        allSlugs.map((slug) => ({ locale, slug }))
    );
}

interface Props {
    params: Promise<{
        slug: string;
        locale: string;
    }>;
}

export default async function LandingPage({ params }: Props) {
    const { slug } = await params;

    // 1. Check if it's an Industry Page
    const industry = industries.find(i => i.slug === slug);

    if (industry) {
        // Filter relevant case studies
        const relatedCaseStudies = caseStudies.filter(
            study => study.category.toLowerCase().includes(industry.title.toLowerCase()) ||
                study.tags.some(t => t.toLowerCase() === industry.slug || t.toLowerCase().includes(slug))
        ).slice(0, 2);

        return (
            <div className="min-h-screen flex flex-col">
                {/* Dynamic Hero Section */}
                <section className={`relative py-24 md:py-32 overflow-hidden ${industry.heroImage}`}>
                    <div className="absolute inset-0 bg-background/60 backdrop-blur-sm" />
                    <div className="container relative mx-auto px-4">
                        <div className="max-w-3xl">
                            <Badge className="mb-6 uppercase tracking-wider text-primary-foreground bg-primary">{industry.title} Megoldások</Badge>
                            <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">{industry.subtitle}</h1>
                            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                                {industry.description}
                            </p>
                            <div className="flex gap-4">
                                <Link href="/kapcsolat">
                                    <Button size="lg" className="text-lg px-8">Konzultációt kérek</Button>
                                </Link>
                                <Link href="/referenciak">
                                    <Button variant="outline" size="lg" className="text-lg px-8">Esettanulmányok</Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Problems & Solutions Grid */}
                <section className="py-20 md:py-24">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-bold mb-4">Gyakori kihívások és megoldásaink</h2>
                            <p className="text-muted-foreground max-w-2xl mx-auto">
                                Ismerjük az iparágad sajátosságait. Így segítünk az {industry.title.toLowerCase()} szektor szereplőinek.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
                            {/* Problems Column */}
                            <div>
                                <h3 className="text-xl font-bold mb-6 flex items-center text-red-500">
                                    <span className="mr-2">❌</span> A Problémák
                                </h3>
                                <div className="space-y-6">
                                    {industry.problems.map((prob, i) => (
                                        <Card key={i} className="bg-red-50/50 dark:bg-red-900/10 border-red-100 dark:border-red-900/30">
                                            <CardHeader className="pb-2">
                                                <CardTitle className="text-lg">{prob.title}</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <p className="text-sm text-foreground/80">{prob.description}</p>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </div>

                            {/* Solutions Column */}
                            <div>
                                <h3 className="text-xl font-bold mb-6 flex items-center text-green-500">
                                    <span className="mr-2">✅</span> A Megoldásunk
                                </h3>
                                <div className="space-y-6">
                                    {industry.solutions.map((sol, i) => (
                                        <Card key={i} className="bg-green-50/50 dark:bg-green-900/10 border-green-100 dark:border-green-900/30">
                                            <CardHeader className="pb-2">
                                                <CardTitle className="text-lg">{sol.title}</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <p className="text-sm text-foreground/80">{sol.description}</p>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Related Case Studies */}
                {relatedCaseStudies.length > 0 && (
                    <section className="py-20 bg-muted/30">
                        <div className="container mx-auto px-4">
                            <h2 className="text-3xl font-bold mb-12 text-center">Így segítettünk másoknak</h2>
                            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                                {relatedCaseStudies.map((study, idx) => (
                                    <Link href={`/referenciak/${study.slug}`} key={idx} className="group">
                                        <Card className="h-full hover:shadow-lg transition-all border-l-4 border-l-primary/50">
                                            <CardHeader>
                                                <Badge variant="outline" className="w-fit mb-2">{study.client}</Badge>
                                                <CardTitle className="group-hover:text-primary transition-colors">{study.title}</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <p className="text-muted-foreground line-clamp-3">{study.description}</p>
                                                <div className="mt-4 text-sm font-medium text-primary flex items-center">
                                                    Esettanulmány elolvasása <ArrowRight className="w-4 h-4 ml-1" />
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* Integrated Upsell Engine */}
                <div className="container mx-auto px-4 pb-20">
                    <UpsellEngine
                        tags={industry.relatedServices}
                        title="Személyre szabott szolgáltatások"
                        description={`Ajánlott megoldások ${industry.title} cégek számára`}
                    />
                </div>

            </div>
        );
    }

    // 2. Check if it's a generic Landing Page (e.g. Sales page)
    const page = landingPages[slug];

    if (page) {
        return (
            <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
                {/* Simplified Header - Logo only */}
                <header className="py-6 flex justify-center border-b border-border/40">
                    <Link href="/" className="font-bold text-2xl tracking-tighter">
                        BacklineIT
                    </Link>
                </header>

                <main className="flex-1">
                    {/* Hero Section */}
                    <section className="py-20 px-4 text-center max-w-4xl mx-auto">
                        <div className="mb-6 inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                            {page.pricing.savings || "Limited Offer"}
                        </div>
                        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
                            {page.hero.headline}
                        </h1>
                        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                            {page.hero.subheadline}
                        </p>
                        <div className="flex justify-center gap-4">
                            <Button size="lg" className="text-lg px-8 py-6 h-auto shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all">
                                {page.hero.cta}
                            </Button>
                        </div>
                        {/* Video Placeholder */}
                        {page.hero.videoUrl ? (
                            <div className="mt-12 aspect-video bg-muted rounded-xl border border-border flex items-center justify-center text-muted-foreground shadow-2xl relative overflow-hidden">
                                {/* If real video logic needed, add iframe here */}
                                <iframe width="100%" height="100%" src={page.hero.videoUrl} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe>
                            </div>
                        ) : (
                            <div className="mt-12 aspect-video bg-muted rounded-xl border border-border flex items-center justify-center text-muted-foreground shadow-2xl">
                                VIDEO HELYE (16:9)
                            </div>
                        )}

                    </section>

                    {/* Problem Section */}
                    <section className="py-16 bg-muted/30">
                        <div className="max-w-3xl mx-auto px-4">
                            <h2 className="text-3xl font-bold mb-8 text-center">{page.problem.title}</h2>
                            <div className="space-y-4">
                                {page.problem.points.map((point, i) => (
                                    <div key={i} className="flex items-start gap-3 p-4 bg-background rounded-lg border border-red-500/20 text-red-500/80">
                                        <div className="mt-1 min-w-4"><span className="text-red-500 font-bold">✕</span></div>
                                        <p className="font-medium text-foreground">{point}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Solution Section */}
                    <section className="py-20 px-4">
                        <div className="max-w-4xl mx-auto">
                            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">{page.solution.title}</h2>
                            <div className="grid md:grid-cols-3 gap-8">
                                {page.solution.features.map((feature, i) => (
                                    <div key={i} className="p-6 rounded-2xl border border-primary/20 bg-primary/5">
                                        <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-6 text-primary">
                                            <Check className="w-6 h-6" />
                                        </div>
                                        <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                                        <p className="text-muted-foreground">{feature.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Pricing / CTA Section */}
                    <section className="py-24 bg-gradient-to-b from-background to-primary/5 border-t">
                        <div className="max-w-xl mx-auto px-4 text-center">
                            <div className="mb-8">
                                <span className="text-lg text-muted-foreground line-through block mb-2">{page.pricing.price}</span>
                                <span className="text-5xl font-extrabold text-primary block">{page.pricing.discountedPrice}</span>
                            </div>
                            <Button size="lg" className="w-full text-xl py-8 h-auto font-bold shadow-2xl">
                                {page.hero.cta} &rarr;
                            </Button>
                            <p className="mt-4 text-sm text-muted-foreground">30 napos pénzvisszafizetési garancia</p>
                        </div>
                    </section>
                </main>

                {/* Simplified Footer */}
                <footer className="py-8 text-center text-sm text-muted-foreground border-t border-border/40">
                    <p>© {new Date().getFullYear()} BacklineIT. Minden jog fenntartva.</p>
                    <div className="mt-2 space-x-4">
                        <Link href="/adatvedelem" className="hover:underline">Adatvédelem</Link>
                        <Link href="/aszf" className="hover:underline">ÁSZF</Link>
                    </div>
                </footer>
            </div>
        );
    }

    notFound();
}
