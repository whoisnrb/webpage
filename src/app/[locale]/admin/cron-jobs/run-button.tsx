"use client"

import { Button } from "@/components/ui/button"
import { Play } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"

export function RunCronButton({ jobId }: { jobId: string }) {
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleRun = async () => {
        setLoading(true)
        try {
            const res = await fetch(`/api/cron/${jobId}`, {
                method: "POST"
            })
            if (!res.ok) throw new Error("Failed to run job")
            router.refresh()
        } catch (error) {
            console.error(error)
            alert("Failed to run cron job")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Button size="sm" variant="outline" onClick={handleRun} disabled={loading}>
            <Play className={`w-4 h-4 mr-1 ${loading ? "animate-spin" : ""}`} />
            {loading ? "Fut..." : "Futtatás"}
        </Button>
    )
}
