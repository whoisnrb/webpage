import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Briefcase, Coffee, Laptop, Zap } from "lucide-react"
import { Link } from "@/i18n/routing"

export default function KarrierPage() {
    return (
        <div className="min-h-screen flex flex-col">
            {/* Hero */}
            <section className="bg-muted/30 py-16 md:py-24 border-b">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
                        Csatlakozz a csapathoz!
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Keressük azokat a tehetségeket, akik velünk együtt szeretnék formálni a jövő digitális megoldásait.
                    </p>
                </div>
            </section>

            {/* Benefits */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold mb-12 text-center">Mit kínálunk?</h2>
                    <div className="grid md:grid-cols-4 gap-8">
                        <div className="text-center">
                            <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Laptop className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="font-semibold mb-2">Modern Tech Stack</h3>
                            <p className="text-sm text-muted-foreground">A legújabb technológiákkal dolgozunk (Next.js, TypeScript, AWS).</p>
                        </div>
                        <div className="text-center">
                            <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Zap className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="font-semibold mb-2">Szakmai Fejlődés</h3>
                            <p className="text-sm text-muted-foreground">Támogatjuk a tanulást, konferenciákat és képzéseket.</p>
                        </div>
                        <div className="text-center">
                            <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Briefcase className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="font-semibold mb-2">Rugalmas Munkaidő</h3>
                            <p className="text-sm text-muted-foreground">Hiszünk a work-life balance-ban. Home office lehetőség.</p>
                        </div>
                        <div className="text-center">
                            <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Coffee className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="font-semibold mb-2">Jó Hangulat</h3>
                            <p className="text-sm text-muted-foreground">Barátságos légkör, közös programok és finom kávé.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Open Positions */}
            <section className="py-16 bg-muted/30">
                <div className="container mx-auto px-4 max-w-4xl">
                    <h2 className="text-3xl font-bold mb-8 text-center">Nyitott Pozíciók</h2>
                    <div className="space-y-4">
                        <Card className="opacity-75 border-dashed">
                            <CardHeader className="flex flex-row items-center justify-between">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <CardTitle className="text-xl">Senior Full Stack Fejlesztő</CardTitle>
                                        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Hamarosan</Badge>
                                    </div>
                                    <div className="flex gap-2">
                                        <Badge variant="outline" className="text-muted-foreground">Remote</Badge>
                                        <Badge variant="outline" className="text-muted-foreground">Teljes munkaidő</Badge>
                                    </div>
                                </div>
                                <Button disabled variant="secondary">Jelentkezés</Button>
                            </CardHeader>
                        </Card>

                        <Card className="opacity-75 border-dashed">
                            <CardHeader className="flex flex-row items-center justify-between">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <CardTitle className="text-xl">DevOps Engineer</CardTitle>
                                        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Hamarosan</Badge>
                                    </div>
                                    <div className="flex gap-2">
                                        <Badge variant="outline" className="text-muted-foreground">Hybrid</Badge>
                                        <Badge variant="outline" className="text-muted-foreground">Teljes munkaidő</Badge>
                                    </div>
                                </div>
                                <Button disabled variant="secondary">Jelentkezés</Button>
                            </CardHeader>
                        </Card>

                        <Card className="opacity-75 border-dashed">
                            <CardHeader className="flex flex-row items-center justify-between">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <CardTitle className="text-xl">Junior Python Fejlesztő</CardTitle>
                                        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Hamarosan</Badge>
                                    </div>
                                    <div className="flex gap-2">
                                        <Badge variant="outline" className="text-muted-foreground">Iroda</Badge>
                                        <Badge variant="outline" className="text-muted-foreground">Gyakornok</Badge>
                                    </div>
                                </div>
                                <Button disabled variant="secondary">Jelentkezés</Button>
                            </CardHeader>
                        </Card>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-16 text-center">
                <div className="container mx-auto px-4">
                    <h2 className="text-2xl font-bold mb-4">Nem találtál hozzád illő pozíciót?</h2>
                    <p className="text-muted-foreground mb-8">
                        Küldd el önéletrajzodat az adatbázisunkba, és értesítünk, ha nyílik megfelelő lehetőség.
                    </p>
                    <Link href="mailto:karrier@itservices.hu">
                        <Button variant="outline" size="lg">
                            Spontán jelentkezés
                        </Button>
                    </Link>
                </div>
            </section>
        </div>
    )
}
