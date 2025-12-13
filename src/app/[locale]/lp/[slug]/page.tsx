import { notFound } from "next/navigation";
import { landingPages } from "@/config/landing-pages";
import { Button } from "@/components/ui/button";
import { Check, Star } from "lucide-react";
import Link from "next/link";

interface Props {
    params: {
        slug: string;
        locale: string;
    };
}

export default function LandingPage({ params }: Props) {
    const page = landingPages[params.slug];

    if (!page) {
        notFound();
    }

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
                    <div className="mt-12 aspect-video bg-muted rounded-xl border border-border flex items-center justify-center text-muted-foreground shadow-2xl">
                        VIDEO HELYE (16:9)
                    </div>
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
