
"use client"

import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react"
import { generateDemoContent } from "@/app/actions/blog"
import { toast } from "sonner"
import { useState } from "react"
import { Loader2 } from "lucide-react"

export function DemoContentButton() {
    const [isLoading, setIsLoading] = useState(false)

    const handleClick = async () => {
        setIsLoading(true)
        try {
            const result = await generateDemoContent()
            if (result.success) {
                toast.success("Demo tartalom sikeresen generálva!")
            } else {
                toast.error(result.error || "Hiba történt")
            }
        } catch (error) {
            toast.error("Váratlan hiba történt")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Button variant="outline" onClick={handleClick} disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
            Demo Tartalom Generálás
        </Button>
    )
}
