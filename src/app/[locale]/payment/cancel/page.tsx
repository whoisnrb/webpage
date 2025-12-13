"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Loader2 } from "lucide-react"
import { Link } from "@/i18n/routing"

function PaymentCancelContent() {
    const searchParams = useSearchParams()
    const orderRef = searchParams.get('orderRef')

    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1 flex items-center justify-center py-16 md:py-24">
                <div className="container mx-auto px-4">
                    <Card className="max-w-2xl mx-auto text-center border-2 border-yellow-500">
                        <CardHeader>
                            <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-yellow-100 flex items-center justify-center">
                                <AlertCircle className="h-10 w-10 text-yellow-600" />
                            </div>
                            <CardTitle className="text-3xl mb-2">Fizetés megszakítva</CardTitle>
                            <CardDescription className="text-lg">
                                Megszakítottad a fizetési folyamatot
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
                                <p className="text-muted-foreground">
                                    A fizetési folyamatot megszakítottad. A rendelésed nem került feldolgozásra.
                                </p>
                                <p className="text-muted-foreground">
                                    Ha szeretnéd folytatni a vásárlást, kattints az alábbi gombra.
                                </p>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                                <Link href="/checkout">
                                    <Button size="lg" className="bg-accent hover:bg-accent/90">
                                        Vissza a fizetéshez
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

export default function PaymentCancelPage() {
    return (
        <Suspense fallback={
            <div className="flex min-h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        }>
            <PaymentCancelContent />
        </Suspense>
    )
}
