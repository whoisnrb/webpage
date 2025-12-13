import { BookingForm } from "@/components/booking-form"
import { Card } from "@/components/ui/card"
import { CheckCircle2, Calendar, MessageSquare, Zap, Shield, TrendingUp } from "lucide-react"
import { Metadata } from "next"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

export const metadata: Metadata = {
    title: "Ingyenes Konzultáció | BacklineIT",
    description: "Foglalj egy ingyenes, 30 perces konzultációt szakértőinkkel. Átbeszéljük projektjeidet és technikai tanácsokat adunk.",
    keywords: ["ingyenes konzultáció", "demó időpont", "BacklineIT konzultáció", "IT tanácsadás"]
}

const benefits = [
    {
        icon: Calendar,
        title: "30 Perces Konzultáció",
        description: "Részletesen átbeszéljük a projektjeidet és igényeidet"
    },
    {
        icon: MessageSquare,
        title: "Szakértői Tanácsadás",
        description: "Tapasztalt fejlesztőink segítenek megtalálni a legjobb megoldást"
    },
    {
        icon: Zap,
        title: "Gyors Válaszok",
        description: "Azonnal megválaszoljuk technikai kérdéseidet"
    },
    {
        icon: Shield,
        title: "Nincs Kötelezettség",
        description: "Teljesen ingyenes és nem kötelez semmiféle vásárlásra"
    },
    {
        icon: TrendingUp,
        title: "Növekedési Javaslatok",
        description: "Konkrét tippeket adsz a vállalkozásod digitális fejlesztéséhez"
    }
]

const faqs = [
    {
        question: "Mennyi ideig tart a konzultáció?",
        answer: "A konzultáció körülbelül 30 percet vesz igénybe. Ez elég idő ahhoz, hogy megismerjük az igényeidet, átbeszéljük a projektjeidet és válaszoljunk a kérdéseidre."
    },
    {
        question: "Valóban ingyenes?",
        answer: "Igen, teljesen ingyenes és nem kötelez semmiféle vásárlásra. Célunk, hogy megismerjük egymást és segítsünk megtalálni a legjobb megoldást az igényeidhez."
    },
    {
        question: "Milyen témákról beszélhetünk?",
        answer: "Bármiről, ami IT-val kapcsolatos: webfejlesztés, automatizáció, biztonsági audit, rendszerüzemeltetés, DevOps, egyedi scriptek, integrációk stb."
    },
    {
        question: "Online vagy személyesen történik?",
        answer: "A konzultáció online zajlik Google Meet vagy Zoom platformon keresztül, így bárhonnan csatlakozhatsz."
    },
    {
        question: "Mit kell előkészítenem?",
        answer: "Semmi különöset! Ha van konkrét projekted vagy kérdésed, érdemes azt megfogalmazni előre, de mi vezetjük a beszélgetést és segítünk eligazodni."
    },
    {
        question: "Mikor kapok visszajelzést?",
        answer: "A foglalást követően 24 órán belül felvesszük veled a kapcsolatot email-ben vagy telefonon a pontos időpont egyeztetéséhez."
    }
]

export default function DemoPage() {
    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-20 md:py-32">
                <div className="absolute inset-0 bg-grid-slate-200 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-slate-800/50" />
                <div className="container relative mx-auto px-4 text-center">
                    <div className="inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium text-primary mb-6 bg-primary/10 backdrop-blur-sm border-primary/20">
                        <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse" />
                        Ingyenes és Nem Kötelez Semmiről
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 leading-tight">
                        Foglalj Ingyenes <br className="hidden md:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary/80 to-secondary">
                            30 Perces Konzultációt
                        </span>
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
                        Beszéljük át projektjeidet szakértőinkkel. Technikai tanácsokat adsz, megoldási javaslatokat
                        kapsz és segítünk megtalálni a legjobb utat a digitális átalakulásodhoz.
                    </p>

                    {/* Benefits Grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto mt-16">
                        {benefits.slice(0, 3).map((benefit, index) => {
                            const Icon = benefit.icon
                            return (
                                <Card key={index} className="p-6 border-2 hover:border-primary/50 transition-colors">
                                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 mx-auto">
                                        <Icon className="h-6 w-6 text-primary" />
                                    </div>
                                    <h3 className="font-semibold text-lg mb-2">{benefit.title}</h3>
                                    <p className="text-muted-foreground text-sm">{benefit.description}</p>
                                </Card>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* Booking Form Section */}
            <section className="py-20 md:py-32">
                <div className="container mx-auto px-4">
                    <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto items-start">
                        {/* Left Side - Additional Benefits */}
                        <div className="space-y-8">
                            <div>
                                <h2 className="text-3xl font-bold tracking-tight mb-4">
                                    Miért érdemes demót foglalnod?
                                </h2>
                                <p className="text-muted-foreground text-lg">
                                    A konzultáció során nem csak válaszokat kapsz, hanem konkrét,
                                    cselekvésre kész javaslatokat is a vállalkozásod fejlesztéséhez.
                                </p>
                            </div>

                            <div className="space-y-4">
                                {benefits.map((benefit, index) => {
                                    const Icon = benefit.icon
                                    return (
                                        <div key={index} className="flex gap-4 items-start">
                                            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                                <Icon className="h-5 w-5 text-primary" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold mb-1">{benefit.title}</h3>
                                                <p className="text-muted-foreground text-sm">{benefit.description}</p>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>

                            <div className="bg-muted/50 p-6 rounded-xl border">
                                <div className="flex items-center gap-2 mb-3">
                                    <CheckCircle2 className="h-5 w-5 text-primary" />
                                    <span className="font-semibold">100% Bizalmas</span>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    Minden információt amit megosztasz velünk szigorúan bizalmasan kezelünk.
                                    Nem adjuk tovább harmadik félnek és csak a konzultáció céljára használjuk.
                                </p>
                            </div>
                        </div>

                        {/* Right Side - Booking Form */}
                        <div className="lg:sticky lg:top-8">
                            <Card className="p-8 border-2 shadow-lg">
                                <div className="mb-6">
                                    <h3 className="text-2xl font-bold mb-2">Válassz Időpontot</h3>
                                    <p className="text-muted-foreground">
                                        Töltsd ki az alábbi űrlapot és mi felvesszük veled a kapcsolatot.
                                    </p>
                                </div>
                                <BookingForm />
                            </Card>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-20 md:py-32 bg-muted/30">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                                Gyakran Ismételt Kérdések
                            </h2>
                            <p className="text-muted-foreground text-lg">
                                Minden, amit tudnod kell a konzultációról
                            </p>
                        </div>

                        <Accordion type="single" collapsible className="space-y-4">
                            {faqs.map((faq, index) => (
                                <AccordionItem
                                    key={index}
                                    value={`item-${index}`}
                                    className="bg-card border rounded-lg px-6"
                                >
                                    <AccordionTrigger className="hover:no-underline text-left">
                                        <span className="font-semibold">{faq.question}</span>
                                    </AccordionTrigger>
                                    <AccordionContent className="text-muted-foreground">
                                        {faq.answer}
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </div>
                </div>
            </section>
        </div>
    )
}
