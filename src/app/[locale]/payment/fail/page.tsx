"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { XCircle, Loader2 } from "lucide-react"
import { Link } from "@/i18n/routing"

function PaymentFailContent() {
    const searchParams = useSearchParams()
    const [orderRef, setOrderRef] = useState<string | null>(null)

    useEffect(() => {
        const ref = searchParams.get('orderRef')
        setOrderRef(ref)
    }, [searchParams])

    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1 flex items-center justify-center py-16 md:py-24">
                <div className="container mx-auto px-4">
                    <Card className="max-w-2xl mx-auto text-center border-2 border-red-500">
                        <CardHeader>
                            <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-red-100 flex items-center justify-center">
                                <XCircle className="h-10 w-10 text-red-600" />
                            </div>
                            <CardTitle className="text-3xl mb-2">Sikertelen fizetés</CardTitle>
                            <CardDescription className="text-lg">
                                A fizetés nem sikerült
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {orderRef && (
                                <div className="bg-muted p-4 rounded-lg">
                                    <p className="text-sm text-muted-foreground mb-1">Rendelési azonosító:</p>
                                    <p className="font-mono font-semibold">{orderRef}</p>
                                </div>
                            )}

                            <div className="space-y-2 text-left">
                                <h3 className="font-semibold">Lehetséges okok:</h3>
                                <ul className="space-y-2 text-sm text-muted-foreground">
                                    <li>❌ Nem volt elegendő fedezet a kártyán</li>
                                    <li>❌ Hibás kártyaadatok</li>
                                    <li>❌ A bank elutasította a tranzakciót</li>
                                    <li>❌ Időtúllépés történt</li>
                                </ul>
                            </div>

                            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg text-left">
                                <p className="text-sm text-blue-900">
                                    <strong>Próbáld újra!</strong> Ellenőrizd a kártyaadatokat és próbáld meg újra a fizetést.
                                </p>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                                <Link href="/checkout">
                                    <Button size="lg" className="bg-accent hover:bg-accent/90">
                                        Újrapróbálkozás
                                    </Button>
                                </Link>
                                <Link href="/">
                                    <Button variant="outline" size="lg">
                                        Vissza a főoldalra
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>
            <Footer />
        </div>
    )
}

export default function PaymentFailPage() {
    return (
        <Suspense fallback={
            <div className="flex min-h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        }>
            <PaymentFailContent />
        </Suspense>
    )
}
