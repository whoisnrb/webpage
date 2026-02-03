import { prisma } from "@/lib/db"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Download, Mail, Phone, Linkedin, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"

export default async function CareersAdminPage() {
    const applications = await prisma.jobApplication.findMany({
        orderBy: { createdAt: 'desc' }
    })

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight">Jelentkezések</h1>
                <Badge variant="outline" className="text-lg px-4 py-1">
                    {applications.length} jelentkező
                </Badge>
            </div>

            <div className="grid gap-6">
                {applications.map((app) => (
                    <Card key={app.id} className="overflow-hidden">
                        <CardHeader className="bg-muted/30 pb-4">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div>
                                    <CardTitle className="text-xl flex items-center gap-2">
                                        {app.name}
                                        <Badge className={
                                            app.status === 'NEW' ? 'bg-blue-500' :
                                                app.status === 'HIRED' ? 'bg-green-500' : 'bg-gray-500'
                                        }>
                                            {app.status}
                                        </Badge>
                                    </CardTitle>
                                    <div className="flex flex-wrap gap-2 mt-2 text-sm text-muted-foreground">
                                        <div className="flex items-center gap-1">
                                            <Mail className="h-3 w-3" />
                                            {app.email}
                                        </div>
                                        {app.phone && (
                                            <div className="flex items-center gap-1 border-l pl-2 ml-2 border-slate-300">
                                                <Phone className="h-3 w-3" />
                                                {app.phone}
                                            </div>
                                        )}
                                        <div className="flex items-center gap-1 border-l pl-2 ml-2 border-slate-300">
                                            <Calendar className="h-3 w-3" />
                                            {new Date(app.createdAt).toLocaleDateString('hu-HU')}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    {app.linkedin && (
                                        <Button size="sm" variant="outline" asChild>
                                            <a href={app.linkedin} target="_blank" rel="noopener noreferrer">
                                                <Linkedin className="h-4 w-4 mr-2" />
                                                LinkedIn
                                            </a>
                                        </Button>
                                    )}
                                    <Button size="sm" asChild>
                                        <a href={`/api/admin/download-cv/${app.id}`} target="_blank">
                                            <Download className="h-4 w-4 mr-2" />
                                            CV Letöltése
                                        </a>
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="space-y-4">
                                <div>
                                    <h3 className="font-semibold mb-2 text-sm uppercase tracking-wide text-muted-foreground">Érdeklődési körök</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {app.areas.map((area: string) => (
                                            <Badge key={area} variant="secondary">
                                                {area}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                                {app.motivation && (
                                    <div>
                                        <h3 className="font-semibold mb-2 text-sm uppercase tracking-wide text-muted-foreground">Motiváció</h3>
                                        <p className="text-sm bg-muted/20 p-4 rounded-lg whitespace-pre-wrap leading-relaxed">
                                            {app.motivation}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                ))}

                {applications.length === 0 && (
                    <div className="text-center py-20 bg-muted/10 rounded-xl border border-dashed">
                        <p className="text-muted-foreground">Még nem érkezett jelentkezés.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
