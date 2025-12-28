import { Button } from "@/components/ui/button"
import { CheckCircle2, ArrowRight } from "lucide-react"
import { ReactNode } from "react"
import { Link } from "@/i18n/routing"

interface ServiceLayoutProps {
    title: string
    description: string
    icon: ReactNode
    features: string[]
    benefits: { title: string; description: string }[]
    techStack: string[]
    pricing?: string
    children?: ReactNode
}

export function ServiceLayout({
    title,
    description,
    icon,
    features,
    benefits,
    techStack,
    pricing,
    children,
}: ServiceLayoutProps) {
    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero Section */}
            <section className="bg-muted/30 py-16 md:py-24 border-b">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        <div className="flex-1">
                            <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-xl mb-6 text-primary">
                                {icon}
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">{title}</h1>
                            <p className="text-xl text-muted-foreground mb-8 max-w-2xl">
                                {description}
                            </p>
                            <div className="flex gap-4">
                                <Button size="lg" className="bg-accent hover:bg-accent/90 text-white" asChild>
                                    <Link href="/ajanlatkeres">
                                        Kérj árajánlatot
                                    </Link>
                                </Button>
                                <Button variant="outline" size="lg" asChild>
                                    <Link href="/demo">
                                        Időpont kérés
                                    </Link>
                                </Button>
                            </div>
                        </div>
                        {/* Abstract Visual */}
                        <div className="flex-1 flex justify-center">
                            <div className="w-full max-w-md aspect-square bg-gradient-to-br from-primary/5 to-secondary/5 rounded-full blur-3xl opacity-50" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Problem / Solution / Benefits */}
            <section className="py-16 md:py-24">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-12 lg:gap-24">
                        <div>
                            <h2 className="text-3xl font-bold mb-6">Miért van erre szükséged?</h2>
                            <div className="space-y-8">
                                {benefits.map((benefit, index) => (
                                    <div key={index} className="flex gap-4">
                                        <div className="mt-1">
                                            <CheckCircle2 className="h-6 w-6 text-secondary" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                                            <p className="text-muted-foreground">{benefit.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="bg-card border rounded-2xl p-8 shadow-sm">
                            <h3 className="text-2xl font-bold mb-6">Mit tartalmaz a csomag?</h3>
                            <ul className="space-y-4 mb-8">
                                {features.map((feature, index) => (
                                    <li key={index} className="flex items-center gap-3">
                                        <div className="h-2 w-2 rounded-full bg-primary" />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <div className="border-t pt-6">
                                <h4 className="font-semibold mb-4">Technológiák:</h4>
                                <div className="flex flex-wrap gap-2">
                                    {techStack.map((tech, index) => (
                                        <span key={index} className="px-3 py-1 bg-muted rounded-full text-sm font-medium">
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {pricing && (
                                <div className="mt-8 pt-6 border-t">
                                    <p className="text-sm text-muted-foreground mb-1">Irányár</p>
                                    <div className="text-3xl font-bold text-primary">{pricing}</div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="relative py-20 md:py-32 overflow-hidden">
                {/* Premium gradient background */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-primary/90 to-slate-900" />

                {/* Animated mesh gradient overlay */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-cyan-500/20 via-transparent to-transparent" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-purple-500/20 via-transparent to-transparent" />

                {/* Dot pattern */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,_rgba(255,255,255,0.07)_1px,_transparent_0)] bg-[length:24px_24px]" />

                {/* Floating glow orbs */}
                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-cyan-400/20 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

                <div className="container relative z-10 mx-auto px-4 text-center">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-8">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400"></span>
                        </span>
                        <span className="text-sm font-medium text-white/90">Ingyenes konzultáció elérhető</span>
                    </div>

                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 text-white tracking-tight">
                        Készen állsz a kezdésre?
                    </h2>
                    <p className="text-xl md:text-2xl text-white/80 mb-12 max-w-3xl mx-auto leading-relaxed">
                        Kérj ingyenes konzultációt, és beszéljük át a projekted részleteit. Nincs kötelezettség, csak hasznos tanácsok.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        {/* Primary CTA Button */}
                        <Button size="lg" className="group relative h-14 px-10 text-lg font-bold bg-white text-slate-900 hover:bg-white hover:scale-105 transition-all duration-300 shadow-2xl shadow-white/20" asChild>
                            <Link href="/kapcsolat">
                                <span className="relative z-10 flex items-center">
                                    Ingyenes konzultáció
                                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                </span>
                            </Link>
                        </Button>

                        {/* Secondary CTA Button - Árak megtekintése */}
                        <Button size="lg" className="group relative h-14 px-10 text-lg font-bold bg-transparent border-2 border-amber-400/80 text-amber-300 hover:bg-amber-400/20 hover:border-amber-300 hover:text-amber-200 transition-all duration-300 shadow-lg shadow-amber-500/10" asChild>
                            <Link href="/arak">
                                <span className="flex items-center">
                                    Árak megtekintése
                                    <svg className="ml-2 h-5 w-5 group-hover:rotate-12 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </span>
                            </Link>
                        </Button>
                    </div>

                    {/* Trust indicators */}
                    <div className="mt-12 flex flex-wrap justify-center gap-8 text-white/60 text-sm">
                        <div className="flex items-center gap-2">
                            <svg className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span>Nincs rejtett költség</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <svg className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span>100% elégedettségi garancia</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <svg className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span>Válasz 24 órán belül</span>
                        </div>
                    </div>
                </div>
            </section>

            {children}
        </div>
    )
}
