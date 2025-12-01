import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, Key, Copy } from "lucide-react"
import { Link } from "@/i18n/routing"
import { prisma } from "@/lib/db"
import { generateLicenseKey } from "@/lib/license"
import { LicenseCopyButton } from "@/components/dashboard/license-copy-button"

interface Props {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function PaymentSuccessPage({ searchParams }: Props) {
    const params = await searchParams
    const orderRef = typeof params.orderRef === 'string' ? params.orderRef : null
    let licenses: any[] = []

    if (orderRef) {
        try {
            // 1. Update order status
            const order = await prisma.order.update({
                where: { orderRef },
                data: { status: 'SUCCESS' },
                include: { user: true, licenses: true }
            })

            // 2. Check if license already exists (idempotency)
            if (order.licenses.length === 0 && order.user) {
                // 3. Determine license type based on amount
                let type = 'STARTER'
                if (order.totalAmount >= 400000) type = 'PRO'
                if (order.totalAmount === 0) type = 'TRIAL'

                // 4. Create license
                const newLicense = await prisma.license.create({
                    data: {
                        key: await generateLicenseKey(),
                        type,
                        userId: order.user.id,
                        orderId: order.id,
                        status: 'ACTIVE'
                    }
                })
                licenses = [newLicense]
            } else {
                licenses = order.licenses
            }
        } catch (error) {
            console.error('Failed to process order success:', error)
        }
    }

    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1 flex items-center justify-center py-16 md:py-24">
                <div className="container mx-auto px-4">
                    <Card className="max-w-2xl mx-auto text-center border-2 border-green-500">
                        <CardHeader>
                            <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
                                <CheckCircle2 className="h-10 w-10 text-green-600" />
                            </div>
                            <CardTitle className="text-3xl mb-2">Sikeres fizetés!</CardTitle>
                            <CardDescription className="text-lg">
                                Köszönjük a megrendelésed!
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {orderRef && (
                                <div className="bg-muted p-4 rounded-lg">
                                    <p className="text-sm text-muted-foreground mb-1">Rendelési azonosító:</p>
                                    <p className="font-mono font-semibold">{orderRef}</p>
                                </div>
                            )}

                            {licenses.length > 0 && (
                                <div className="space-y-4 text-left border rounded-lg p-4 bg-accent/5">
                                    <h3 className="font-semibold flex items-center gap-2">
                                        <Key className="h-4 w-4 text-primary" />
                                        Elkészült licencek
                                    </h3>
                                    <div className="space-y-2">
                                        {licenses.map((license) => (
                                            <div key={license.id} className="flex items-center justify-between bg-background p-3 rounded border">
                                                <div>
                                                    <p className="text-xs text-muted-foreground font-mono">{license.type}</p>
                                                    <p className="font-mono font-bold text-lg tracking-wider">{license.key}</p>
                                                </div>
                                                <LicenseCopyButton licenseKey={license.key} />
                                            </div>
                                        ))}
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        A licenceket elküldtük e-mailben is, és megtalálod őket a fiókodban.
                                    </p>
                                </div>
                            )}

                            <div className="space-y-2 text-left">
                                <h3 className="font-semibold">Mi történik most?</h3>
                                <ul className="space-y-2 text-sm text-muted-foreground">
                                    <li>✅ A fizetésed sikeresen feldolgozásra került</li>
                                    <li>✅ A licencek azonnal használhatók</li>
                                    <li>✅ Hamarosan felvesszük veled a kapcsolatot a részletekkel</li>
                                </ul>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                                <Link href="/dashboard/licenses">
                                    <Button variant="outline" size="lg">
                                        Licencek kezelése
                                    </Button>
                                </Link>
                                <Link href="/szolgaltatasok">
                                    <Button size="lg" className="bg-accent hover:bg-accent/90">
                                        További szolgáltatások
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
