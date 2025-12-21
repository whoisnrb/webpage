
"use client"

import { Button } from "@/components/ui/button"
import { Link } from "@/i18n/routing"
import { Edit, Trash2, Eye } from "lucide-react"
import { deleteBlogPost } from "@/app/actions/blog"
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
import { MoreHorizontal } from "lucide-react"

interface AdminBlogActionsProps {
    id: string
    slug: string
}

export function AdminBlogActions({ id, slug }: AdminBlogActionsProps) {
    const [isPending, startTransition] = useTransition()

    const handleDelete = () => {
        if (confirm("Biztosan törölni szeretnéd ezt a bejegyzést?")) {
            startTransition(async () => {
                const result = await deleteBlogPost(id)
                if (result.success) {
                    toast.success("Bejegyzés törölve")
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
                    <Link href={`/blog/${slug}`} target="_blank" className="cursor-pointer">
                        <Eye className="mr-2 h-4 w-4" /> Megtekintés
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link href={`/admin/blog/${id}`} className="cursor-pointer">
                        <Edit className="mr-2 h-4 w-4" /> Szerkesztés
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleDelete} className="text-red-500 cursor-pointer focus:text-red-500">
                    <Trash2 className="mr-2 h-4 w-4" /> Törlés
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
