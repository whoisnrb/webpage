"use client"

import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { ToggleLeft, ToggleRight, Edit2 } from "lucide-react"

export function ToggleFeatureButton({
    flagId,
    initialStatus,
    initialPercentage
}: {
    flagId: string,
    initialStatus: boolean,
    initialPercentage: number
}) {
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleToggle = async () => {
        setLoading(true)
        try {
            const res = await fetch(`/api/admin/features/toggle`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: flagId, enabled: !initialStatus })
            })
            if (!res.ok) throw new Error("Failed to toggle")
            router.refresh()
        } catch (error) {
            console.error(error)
            alert("Hiba!")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex items-center justify-end gap-2">
            <Button
                variant={initialStatus ? "default" : "outline"}
                size="sm"
                onClick={handleToggle}
                disabled={loading}
            >
                {initialStatus ? "ON" : "OFF"}
            </Button>
        </div>
    )
}
