import { auth } from "@/auth"
import { prisma } from "@/lib/db"
import { redirect } from "next/navigation"
import { getLocale, getTranslations } from "next-intl/server"
import { Briefcase, Calendar, CheckCircle2, Clock, PlayCircle } from "lucide-react"

export default async function ProjectsPage() {
    const session = await auth()
    const locale = await getLocale()
    const t = await getTranslations('Dashboard')

    if (!session?.user?.email) {
        redirect(`/${locale}/api/auth/signin`)
    }

    const projects = await prisma.project.findMany({
        where: {
            user: { email: session.user.email }
        },
        orderBy: {
            createdAt: 'desc'
        }
    })

    const getStatusInfo = (status: string) => {
        switch (status) {
            case 'KICKOFF': return { label: 'Indulás', color: 'text-purple-400', bg: 'bg-purple-400/10', border: 'border-purple-400/20', icon: PlayCircle }
            case 'DESIGN': return { label: 'Tervezés', color: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-400/20', icon: Clock }
            case 'DEVELOPMENT': return { label: 'Fejlesztés', color: 'text-orange-400', bg: 'bg-orange-400/10', border: 'border-orange-400/20', icon: Clock }
            case 'REVISION': return { label: 'Revízió', color: 'text-yellow-400', bg: 'bg-yellow-400/10', border: 'border-yellow-400/20', icon: Clock }
            case 'COMPLETED': return { label: 'Kész', color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/20', icon: CheckCircle2 }
            default: return { label: status, color: 'text-slate-400', bg: 'bg-slate-400/10', border: 'border-slate-400/20', icon: Clock }
        }
    }

    return (
        <div className="space-y-6 animate-fadeIn">
            <div>
                <h1 className="text-2xl font-bold">{t('projects') || 'Projektek'}</h1>
                <p className="text-muted-foreground mt-1">Kövesd nyomon az aktív projektjeid állását.</p>
            </div>

            {projects.length === 0 ? (
                <div className="rounded-xl border border-white/5 bg-card/50 p-8 text-center backdrop-blur">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                        <Briefcase className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold">Nincsenek aktív projektek</h3>
                    <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
                        Jelenleg nincs folyamatban lévő projekted. Ha szeretnél egy újat indítani, kérj konzultációt!
                    </p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {projects.map((project) => {
                        const statusInfo = getStatusInfo(project.status)
                        const StatusIcon = statusInfo.icon

                        return (
                            <div key={project.id} className="relative overflow-hidden rounded-xl border border-white/5 bg-card/40 p-5 backdrop-blur transition-all duration-300 hover:border-white/10 hover:bg-card/60">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-3">
                                            <h3 className="font-semibold text-lg">{project.title}</h3>
                                            <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium border ${statusInfo.bg} ${statusInfo.color} ${statusInfo.border}`}>
                                                <StatusIcon className="h-3.5 w-3.5" />
                                                {statusInfo.label}
                                            </span>
                                        </div>
                                        {project.description && (
                                            <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-4 text-sm text-muted-foreground shrink-0">
                                        <div className="flex items-center gap-1.5">
                                            <Calendar className="h-4 w-4" />
                                            Indítva: {project.createdAt.toLocaleDateString('hu-HU')}
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Progress bar */}
                                <div className="mt-6">
                                    <div className="flex justify-between text-xs mb-2">
                                        <span className="font-medium text-muted-foreground">Készültség</span>
                                        <span className="font-bold text-foreground">{project.progress}%</span>
                                    </div>
                                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                        <div 
                                            className="h-full bg-gradient-to-r from-primary to-blue-500 rounded-full transition-all duration-1000 ease-out" 
                                            style={{ width: `${project.progress}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
