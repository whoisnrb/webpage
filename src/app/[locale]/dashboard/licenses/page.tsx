import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { auth } from "@/auth"
import { prisma } from "@/lib/db"
import { redirect } from "next/navigation"
import { getLocale } from "next-intl/server"
import { Key, Copy, CheckCircle2, XCircle, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default async function LicensesPage() {
    const session = await auth()

    if (!session?.user?.email) {
        const locale = await getLocale()
        redirect(`/${locale}/api/auth/signin`)
    }

    const licenses = await prisma.license.findMany({
        where: {
            user: {
                email: session.user.email
            }
        },
        include: {
            product: true,
            order: true
        },
        orderBy: {
            createdAt: 'desc'
        }
    })

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Licencek</h2>
                <p className="text-muted-foreground">Itt találod a megvásárolt szoftver licenceidet.</p>
            </div>

            <div className="grid gap-4">
                {licenses.length === 0 ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                            <Key className="h-12 w-12 text-muted-foreground mb-4" />
                            <h3 className="text-lg font-semibold">Nincs aktív licenced</h3>
                            <p className="text-muted-foreground mb-4">Még nem vásároltál szoftver licencet.</p>
                            <Button asChild>
                                <a href="/termekek">Vásárlás</a>
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    licenses.map((license) => (
                        <Card key={license.id}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-base font-medium">
                                    {license.product?.name || 'Ismeretlen termék'}
                                    <Badge variant={license.status === 'ACTIVE' ? 'default' : 'secondary'} className="ml-2">
                                        {license.status === 'ACTIVE' ? 'Aktív' : license.status}
                                    </Badge>
                                </CardTitle>
                                <div className="text-sm text-muted-foreground">
                                    Vásárolva: {new Date(license.createdAt).toLocaleDateString('hu-HU')}
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 items-center mt-4">
                                    <div className="col-span-2 space-y-1">
                                        <p className="text-sm font-medium leading-none">Licenckulcs</p>
                                        <div className="flex items-center gap-2">
                                            <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
                                                {license.key}
                                            </code>
                                            {/* Client component for copy functionality could be added here, 
                                                but for now simple selection is fine or we can add a client wrapper later */}
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium leading-none">Típus</p>
                                        <p className="text-sm text-muted-foreground">{license.type}</p>
                                    </div>
                                    <div className="flex justify-end">
                                        {license.order && (
                                            <Button variant="outline" size="sm" asChild>
                                                <a href={`/dashboard/purchases#${license.order.orderRef}`}>
                                                    Rendelés megtekintése
                                                </a>
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    )
}
