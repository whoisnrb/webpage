"use client"

import { Button } from "@/components/ui/button"
import { Edit, Trash2, MoreHorizontal } from "lucide-react"
import { Link } from "@/i18n/routing"
import { deleteBlogSeries } from "@/app/actions/blog"
import { useTransition } from "react"
import { toast } from "sonner"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface SeriesActionsProps {
    id: string
    postCount: number
}

export function SeriesActions({ id, postCount }: SeriesActionsProps) {
    const [isPending, startTransition] = useTransition()

    const handleDelete = () => {
        const message = postCount > 0
            ? `Ez a sorozat ${postCount} bejegyzést tartalmaz. A bejegyzések NEM lesznek törölve, csak a sorozatból lesznek eltávolítva. Biztosan törölni szeretnéd?`
            : "Biztosan törölni szeretnéd ezt a sorozatot?"

        if (confirm(message)) {
            startTransition(async () => {
                const result = await deleteBlogSeries(id)
                if (result.success) {
                    toast.success("Sorozat törölve")
                } else {
                    toast.error("Hiba történt a törlés során")
                }
            })
        }
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Menü megnyitása</span>
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Műveletek</DropdownMenuLabel>
                <DropdownMenuItem asChild>
                    <Link href={`/admin/blog/series/${id}`} className="cursor-pointer">
                        <Edit className="mr-2 h-4 w-4" /> Szerkesztés
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    onClick={handleDelete}
                    className="text-red-500 cursor-pointer focus:text-red-500"
                    disabled={isPending}
                >
                    <Trash2 className="mr-2 h-4 w-4" /> Törlés
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
