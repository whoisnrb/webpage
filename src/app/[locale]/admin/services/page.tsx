import { getServices, deleteService } from "@/app/actions/service"
import { Button } from "@/components/ui/button"
import { Link } from "@/i18n/routing"
import { Plus, Pencil, Trash2, CheckCircle2, XCircle } from "lucide-react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

export default async function AdminServicesPage() {
    const services = await getServices()

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight">Szolgáltatások</h1>
                <Link href="/admin/services/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Új szolgáltatás
                    </Button>
                </Link>
            </div>

            <div className="border rounded-lg">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Sorrend</TableHead>
                            <TableHead>Név</TableHead>
                            <TableHead>Slug</TableHead>
                            <TableHead>Ár</TableHead>
                            <TableHead>Státusz</TableHead>
                            <TableHead className="text-right">Műveletek</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {services.map((service) => (
                            <TableRow key={service.id}>
                                <TableCell className="text-muted-foreground">{service.sortOrder}</TableCell>
                                <TableCell className="font-medium">{service.name}</TableCell>
                                <TableCell className="text-muted-foreground">{service.slug}</TableCell>
                                <TableCell>
                                    {service.price > 0
                                        ? new Intl.NumberFormat('hu-HU', { style: 'currency', currency: 'HUF', maximumFractionDigits: 0 }).format(service.price)
                                        : <span className="text-amber-500">Egyedi árazás</span>
                                    }
                                </TableCell>
                                <TableCell>
                                    {service.active ? (
                                        <span className="inline-flex items-center gap-1 text-green-500 text-sm">
                                            <CheckCircle2 className="h-4 w-4" /> Aktív
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1 text-red-500 text-sm">
                                            <XCircle className="h-4 w-4" /> Inaktív
                                        </span>
                                    )}
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <Link href={`/admin/services/${service.id}`}>
                                            <Button variant="ghost" size="icon">
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                        </Link>
                                        <form action={async () => {
                                            "use server"
                                            await deleteService(service.id)
                                        }}>
                                            <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </form>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                        {services.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                                    Nincs megjeleníthető szolgáltatás.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
