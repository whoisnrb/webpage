import { getReferences, deleteReference } from "@/app/actions/reference"
import { Button } from "@/components/ui/button"
import { Link } from "@/i18n/routing"
import { Plus, Pencil, Trash2, Eye, EyeOff } from "lucide-react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export default async function AdminReferencesPage() {
    const references = await getReferences()

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold tracking-tight">Referenciák</h1>
                    <p className="text-muted-foreground">Kezeld a weboldalon megjelenő esettanulmányokat és referenciamunkákat.</p>
                </div>
                <Link href="/admin/references/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Új referencia
                    </Button>
                </Link>
            </div>

            <div className="border rounded-lg bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">Státusz</TableHead>
                            <TableHead>Név / Ügyfél</TableHead>
                            <TableHead>Kategória</TableHead>
                            <TableHead>Tegek</TableHead>
                            <TableHead className="text-right">Műveletek</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {references.map((ref) => (
                            <TableRow key={ref.id}>
                                <TableCell>
                                    {ref.active ? (
                                        <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 gap-1 font-medium">
                                            <Eye className="h-3 w-3" /> Aktív
                                        </Badge>
                                    ) : (
                                        <Badge variant="secondary" className="gap-1 font-medium">
                                            <EyeOff className="h-3 w-3" /> Inaktív
                                        </Badge>
                                    )}
                                </TableCell>
                                <TableCell>
                                    <div className="font-medium">{ref.title}</div>
                                    <div className="text-sm text-muted-foreground">{ref.client}</div>
                                </TableCell>
                                <TableCell>{ref.category}</TableCell>
                                <TableCell>
                                    <div className="flex flex-wrap gap-1">
                                        {ref.tags.slice(0, 3).map(tag => (
                                            <span key={tag} className="text-[10px] bg-muted px-1.5 py-0.5 rounded border">
                                                {tag}
                                            </span>
                                        ))}
                                        {ref.tags.length > 3 && (
                                            <span className="text-[10px] text-muted-foreground">+{ref.tags.length - 3}</span>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <Link href={`/admin/references/${ref.id}`}>
                                            <Button variant="ghost" size="icon">
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                        </Link>
                                        <form action={async () => {
                                            "use server"
                                            await deleteReference(ref.id)
                                        }}>
                                            <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </form>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                        {references.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-20 text-muted-foreground">
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="p-4 bg-muted rounded-full">
                                            <Plus className="h-8 w-8 opacity-20" />
                                        </div>
                                        <p>Nincs még hozzáadott referencia.</p>
                                        <Link href="/admin/references/new">
                                            <Button variant="link">Hozzáadom az elsőt</Button>
                                        </Link>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
