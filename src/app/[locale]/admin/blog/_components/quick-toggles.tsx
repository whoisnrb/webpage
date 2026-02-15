"use client"

import { Button } from "@/components/ui/button"
import { Eye, EyeOff, Star, StarOff } from "lucide-react"
import { togglePublished, toggleFeatured } from "@/app/actions/blog"
import { useTransition } from "react"
import { toast } from "sonner"

interface QuickToggleProps {
    id: string
    published: boolean
    featured: boolean
}

export function PublishToggle({ id, published }: { id: string; published: boolean }) {
    const [isPending, startTransition] = useTransition()

    const handleToggle = () => {
        startTransition(async () => {
            const result = await togglePublished(id)
            if (result.success) {
                toast.success(result.published ? "Publikálva" : "Visszavonva vázlatba")
            } else {
                toast.error("Hiba történt")
            }
        })
    }

    return (
        <Button
            variant="ghost"
            size="sm"
            onClick={handleToggle}
            disabled={isPending}
            className={published
                ? "text-emerald-500 hover:text-emerald-600"
                : "text-muted-foreground hover:text-foreground"
            }
            title={published ? "Visszavonás vázlatba" : "Publikálás"}
        >
            {published ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
        </Button>
    )
}

export function FeaturedToggle({ id, featured }: { id: string; featured: boolean }) {
    const [isPending, startTransition] = useTransition()

    const handleToggle = () => {
        startTransition(async () => {
            const result = await toggleFeatured(id)
            if (result.success) {
                toast.success(result.featured ? "Kiemelve" : "Kiemelés megszüntetve")
            } else {
                toast.error("Hiba történt")
            }
        })
    }

    return (
        <Button
            variant="ghost"
            size="sm"
            onClick={handleToggle}
            disabled={isPending}
            className={featured
                ? "text-amber-500 hover:text-amber-600"
                : "text-muted-foreground hover:text-foreground"
            }
            title={featured ? "Kiemelés megszüntetése" : "Kiemelés"}
        >
            {featured ? <Star className="h-4 w-4 fill-current" /> : <StarOff className="h-4 w-4" />}
        </Button>
    )
}
