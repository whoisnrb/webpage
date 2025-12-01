"use client"

import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Copy, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function PaymentInstructionsPage() {
    const searchParams = useSearchParams()
    const orderRef = searchParams.get("orderRef")
    const method = searchParams.get("method")

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text)
        alert("Másolva vágólapra!")
    }

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-muted/30 py-12 px-4">
            <Card className="w-full max-w-lg">
                <CardHeader className="text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                        <CheckCircle2 className="h-10 w-10 text-green-600" />
                    </div>
                    <CardTitle className="text-2xl">Rendelés sikeresen rögzítve!</CardTitle>
                    <CardDescription>
                        Rendelési azonosító: <span className="font-mono font-bold text-foreground">{orderRef}</span>
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="rounded-lg bg-blue-50 p-4 text-sm text-blue-900">
                        A rendelésed feldolgozását a fizetés beérkezése után kezdjük meg. Kérjük, teljesítsd a fizetést az alábbiak szerint:
                    </div>

                    {method === 'TRANSFER' && (
                        <div className="space-y-4">
                            <h3 className="font-semibold text-lg border-b pb-2">Banki átutalás adatai</h3>

                            <div className="grid gap-3 text-sm">
                                <div className="flex justify-between items-center p-3 bg-white rounded border">
                                    <span className="text-muted-foreground">Kedvezményezett:</span>
                                    <div className="flex items-center gap-2 font-medium">
                                        Török Norbert
                                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => copyToClipboard("Török Norbert")}>
                                            <Copy className="h-3 w-3" />
                                        </Button>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-white rounded border">
                                    <span className="text-muted-foreground">Bankszámlaszám:</span>
                                    <div className="flex items-center gap-2 font-medium">
                                        11773362-00994366
                                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => copyToClipboard("11773362-00994366")}>
                                            <Copy className="h-3 w-3" />
                                        </Button>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-white rounded border">
                                    <span className="text-muted-foreground">Bank:</span>
                                    <span className="font-medium">OTP Bank</span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-white rounded border border-blue-200 bg-blue-50">
                                    <span className="text-blue-700 font-semibold">Közlemény:</span>
                                    <div className="flex items-center gap-2 font-bold text-blue-900">
                                        {orderRef}
                                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => copyToClipboard(orderRef || "")}>
                                            <Copy className="h-3 w-3" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                            <p className="text-xs text-muted-foreground text-center">
                                *Kérjük, a közlemény rovatba <b>kizárólag</b> a rendelési azonosítót írd be!
                            </p>
                        </div>
                    )}

                    {method === 'PAYPAL' && (
                        <div className="space-y-4 text-center">
                            <h3 className="font-semibold text-lg border-b pb-2">PayPal fizetés</h3>
                            <p className="text-sm text-muted-foreground">
                                Kérjük, küldd el a végösszeget az alábbi PayPal címre:
                            </p>
                            <div className="p-4 bg-white rounded border flex justify-center items-center gap-2 font-bold text-lg">
                                tthkira@yahoo.com
                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => copyToClipboard("tthkira@yahoo.com")}>
                                    <Copy className="h-4 w-4" />
                                </Button>
                            </div>
                            <div className="p-3 bg-blue-50 rounded border border-blue-200 text-sm text-blue-900">
                                Közleményként add meg: <b>{orderRef}</b>
                            </div>
                            <Button className="w-full bg-[#003087] hover:bg-[#003087]/90 text-white" asChild>
                                <a href="https://paypal.me/tthkira" target="_blank" rel="noopener noreferrer">
                                    Fizetés PayPal-on
                                </a>
                            </Button>
                        </div>
                    )}

                    <div className="pt-4 border-t">
                        <Button variant="outline" className="w-full" asChild>
                            <Link href="/">
                                Vissza a főoldalra
                            </Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
