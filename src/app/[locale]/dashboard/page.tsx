import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Ticket, ArrowUpRight, FileText, Briefcase } from "lucide-react"
import { Link } from "@/i18n/routing"
import { Button } from "@/components/ui/button"
import { auth } from "@/auth"
import { prisma } from "@/lib/db"
import { redirect } from "next/navigation"
import { getLocale, getTranslations } from "next-intl/server"

export default async function DashboardPage() {
    const session = await auth()
    const locale = await getLocale()
    const t = await getTranslations('Dashboard')

    if (!session?.user?.email) {
        redirect(`/${locale}/api/auth/signin`)
    }

    // Try to get ticket count, fallback to 0 if table doesn't exist yet
    let openTickets = 0
    try {
        openTickets = await prisma.ticket.count({
            where: {
                user: {
                    email: session.user.email
                },
                status: {
                    in: ['OPEN', 'IN_PROGRESS']
                }
            }
        })
    } catch (error) {
        console.log('Ticket table not available yet')
    }

    return (
        <div className="space-y-8">
            {/* Hero Section */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary/10 via-primary/5 to-background border border-primary/10 p-8 md:p-12">
                <div className="relative z-10">
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-2 bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">
                        {t('welcome', { name: session.user.name || 'User' })}
                    </h2>
                    <p className="text-muted-foreground max-w-xl text-lg">
                        {t('welcome_subtitle')}
                    </p>
                </div>
                <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-primary/10 to-transparent opacity-50 blur-3xl" />
            </div>

            {/* Stats Grid */}
            <div className="grid gap-6 md:grid-cols-3">
                <Card className="relative overflow-hidden border-orange-500/20 bg-card/50 backdrop-blur transition-all hover:border-orange-500/50 hover:shadow-lg hover:shadow-orange-500/5">
                    <div className="absolute right-0 top-0 p-4 opacity-10">
                        <Ticket className="h-24 w-24 text-orange-500" />
                    </div>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">{t('open_tickets')}</CardTitle>
                        <Ticket className="h-4 w-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{openTickets} db</div>
                        <p className="text-xs text-muted-foreground mt-1">{t('waiting_for_reply')}</p>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions */}
            <div className="space-y-6">
                <h3 className="text-xl font-semibold">{t('quick_actions')}</h3>
                <div className="grid gap-4 md:grid-cols-3">
                    <Link href="/dashboard/tickets/new">
                        <div className="group flex items-center p-4 rounded-xl border bg-card/50 hover:bg-card hover:border-primary/50 transition-all cursor-pointer h-full">
                            <div className="h-10 w-10 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                                <Ticket className="h-5 w-5" />
                            </div>
                            <div className="ml-4">
                                <p className="font-medium">{t('open_ticket')}</p>
                                <p className="text-xs text-muted-foreground">{t('need_help')}</p>
                            </div>
                            <ArrowUpRight className="ml-auto h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                    </Link>

                    <Link href="/megoldasok">
                        <div className="group flex items-center p-4 rounded-xl border bg-card/50 hover:bg-card hover:border-primary/50 transition-all cursor-pointer h-full">
                            <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                                <Briefcase className="h-5 w-5" />
                            </div>
                            <div className="ml-4">
                                <p className="font-medium">Megoldások böngészése</p>
                                <p className="text-xs text-muted-foreground">Fedezze fel szolgáltatásainkat</p>
                            </div>
                            <ArrowUpRight className="ml-auto h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                    </Link>

                    <Link href="/konzultacio">
                        <div className="group flex items-center p-4 rounded-xl border bg-card/50 hover:bg-card hover:border-primary/50 transition-all cursor-pointer h-full">
                            <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center text-green-500 group-hover:bg-green-500 group-hover:text-white transition-colors">
                                <FileText className="h-5 w-5" />
                            </div>
                            <div className="ml-4">
                                <p className="font-medium">Konzultáció kérése</p>
                                <p className="text-xs text-muted-foreground">Egyedi ajánlatkérés</p>
                            </div>
                            <ArrowUpRight className="ml-auto h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    )
}
