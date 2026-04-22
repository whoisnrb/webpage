import { auth } from "@/auth"
import { prisma } from "@/lib/db"
import { redirect } from "next/navigation"
import { getLocale } from "next-intl/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ProjectRow } from "./project-row"

export default async function AdminProjectsPage() {
    const session = await auth()
    const locale = await getLocale()

    if (!session?.user || session.user.role !== "ADMIN") {
        redirect(`/${locale}/`)
    }

    const projects = await prisma.project.findMany({
        orderBy: {
            createdAt: 'desc'
        },
        include: {
            user: {
                select: {
                    name: true,
                    email: true
                }
            }
        }
    })

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Ügyfél Projektek</h1>
            <p className="text-muted-foreground">Aktív szolgáltatások és projektek kezelése.</p>

            <Card>
                <CardHeader>
                    <CardTitle>Összes Projekt</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Projekt</TableHead>
                                <TableHead>Ügyfél</TableHead>
                                <TableHead>Létrehozva</TableHead>
                                <TableHead>Státusz & Készültség</TableHead>
                                <TableHead className="text-right">Műveletek</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {projects.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center text-muted-foreground">
                                        Nincsenek projektek
                                    </TableCell>
                                </TableRow>
                            ) : (
                                projects.map((project) => (
                                    <ProjectRow key={project.id} project={project} />
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
