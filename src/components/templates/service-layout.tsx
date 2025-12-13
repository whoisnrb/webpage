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
                                        Demó időpont
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
            <section className="py-16 bg-primary text-primary-foreground">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold mb-6">Készen állsz a kezdésre?</h2>
                    <p className="text-xl text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
                        Kérj ingyenes konzultációt, és beszéljük át a projekted részleteit.
                    </p>
                    <Button size="lg" variant="secondary" className="text-lg px-8" asChild>
                        <Link href="/demo">
                            Kapcsolatfelvétel <ArrowRight className="ml-2 h-5 w-5" />
                        </Link>
                    </Button>
                </div>
            </section>

            {children}
        </div>
    )
}
