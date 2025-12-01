"use client"

import { Button } from "@/components/ui/button"
import { Link } from "@/i18n/routing"
import { Construction } from "lucide-react"

export default function CheckoutPage() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
            <div className="bg-muted/30 p-8 rounded-2xl border max-w-md w-full">
                <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Construction className="h-8 w-8 text-primary" />
                </div>
                <h1 className="text-2xl font-bold mb-4">A vásárlás jelenleg szünetel</h1>
                <p className="text-muted-foreground mb-8">
                    Weboldalunk fejlesztés alatt áll. A vásárlási funkció hamarosan elérhető lesz.
                    Kérjük, látogass vissza később!
                </p>
                <Link href="/">
                    <Button className="w-full">
                        Vissza a főoldalra
                    </Button>
                </Link>
            </div>
        </div>
    )
}
