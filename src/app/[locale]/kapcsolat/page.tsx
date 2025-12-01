import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { BookingForm } from "@/components/booking-form"
import { Card, CardContent } from "@/components/ui/card"
import { Mail, MapPin, Phone, Clock } from "lucide-react"
import { FadeIn, SlideUp } from "@/components/ui/motion-wrapper"

export default function KapcsolatPage() {
    return (
        <div className="min-h-screen flex flex-col">
            <section className="bg-muted/30 py-16 border-b">
                <div className="container mx-auto px-4 text-center">
                    <FadeIn>
                        <h1 className="text-4xl font-bold tracking-tight mb-4">Lépj velünk kapcsolatba</h1>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Kérdésed van? Árajánlatot szeretnél? Írj nekünk, és hamarosan válaszolunk!
                        </p>
                    </FadeIn>
                </div>
            </section>

            <section className="py-16 md:py-24">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
                        {/* Contact Info */}
                        <SlideUp className="space-y-8">
                            <div>
                                <h2 className="text-2xl font-bold mb-6">Elérhetőségeink</h2>
                                <p className="text-muted-foreground mb-8">
                                    Keress minket bizalommal bármelyik csatornán. Ügyfélszolgálatunk munkanapokon 9:00 és 17:00 között áll rendelkezésedre.
                                </p>
                            </div>

                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="bg-primary/10 p-3 rounded-lg">
                                        <Mail className="h-6 w-6 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold mb-1">Email</h3>
                                        <p className="text-muted-foreground">hello@antigravity.hu</p>
                                        <p className="text-muted-foreground">support@antigravity.hu</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="bg-primary/10 p-3 rounded-lg">
                                        <Phone className="h-6 w-6 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold mb-1">Telefon</h3>
                                        <p className="text-muted-foreground">+36 30 123 4567</p>
                                        <p className="text-sm text-muted-foreground mt-1">Hétfő - Péntek: 09:00 - 17:00</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="bg-primary/10 p-3 rounded-lg">
                                        <MapPin className="h-6 w-6 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold mb-1">Iroda</h3>
                                        <p className="text-muted-foreground">
                                            1117 Budapest,<br />
                                            Irinyi József utca 4-20.<br />
                                            (Science Park)
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </SlideUp>

                        {/* Contact Form */}
                        <SlideUp delay={0.2}>
                            <Card>
                                <CardContent className="p-6 md:p-8">
                                    <h2 className="text-2xl font-bold mb-6">Időpontfoglalás & Üzenet</h2>
                                    <BookingForm />
                                </CardContent>
                            </Card>
                        </SlideUp>
                    </div>
                </div>
            </section>
        </div>
    )
}
