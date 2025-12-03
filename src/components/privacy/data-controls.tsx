"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Download, Trash2, AlertTriangle } from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from "sonner"

export function DataControls() {
    const [isDeleting, setIsDeleting] = useState(false)
    const [isExporting, setIsExporting] = useState(false)

    const handleExport = async () => {
        setIsExporting(true)
        try {
            const response = await fetch("/api/user/export")
            if (!response.ok) throw new Error("Export failed")

            const blob = await response.blob()
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement("a")
            a.href = url
            a.download = `user-data-${new Date().toISOString().split('T')[0]}.json`
            document.body.appendChild(a)
            a.click()
            window.URL.revokeObjectURL(url)
            document.body.removeChild(a)
            toast.success("Adatok sikeresen exportálva")
        } catch (error) {
            toast.error("Hiba történt az exportálás során")
            console.error(error)
        } finally {
            setIsExporting(false)
        }
    }

    const handleDelete = async () => {
        setIsDeleting(true)
        try {
            const response = await fetch("/api/user/delete", { method: "DELETE" })
            if (!response.ok) {
                if (response.status === 409) {
                    toast.error("Nem törölhető fiók aktív rendelésekkel. Kérlek vedd fel a kapcsolatot az ügyfélszolgálattal.")
                    return
                }
                throw new Error("Delete failed")
            }
            toast.success("Fiók sikeresen törölve")
            // Redirect to home or logout
            window.location.href = "/"
        } catch (error) {
            toast.error("Hiba történt a törlés során")
            console.error(error)
        } finally {
            setIsDeleting(false)
        }
    }

    return (
        <Card className="border-destructive/20">
            <CardHeader>
                <CardTitle>Adatkezelés</CardTitle>
                <CardDescription>
                    Itt kezelheted a személyes adataidat a GDPR előírásainak megfelelően.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4 justify-between items-center p-4 border rounded-lg">
                    <div className="space-y-1">
                        <h4 className="font-medium">Adatok exportálása</h4>
                        <p className="text-sm text-muted-foreground">
                            Töltsd le az összes rólad tárolt adatot JSON formátumban.
                        </p>
                    </div>
                    <Button variant="outline" onClick={handleExport} disabled={isExporting}>
                        <Download className="mr-2 h-4 w-4" />
                        {isExporting ? "Exportálás..." : "Letöltés"}
                    </Button>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-between items-center p-4 border border-destructive/20 bg-destructive/5 rounded-lg">
                    <div className="space-y-1">
                        <h4 className="font-medium text-destructive">Fiók törlése</h4>
                        <p className="text-sm text-muted-foreground">
                            Véglegesen törli a fiókodat és minden személyes adatodat. Ez a művelet nem visszavonható.
                        </p>
                    </div>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="destructive">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Fiók törlése
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle className="flex items-center gap-2 text-destructive">
                                    <AlertTriangle className="h-5 w-5" />
                                    Biztosan törlöd a fiókodat?
                                </DialogTitle>
                                <DialogDescription>
                                    Ez a művelet végleges és nem visszavonható. Minden adatod, beleértve a rendeléseket és licenceket, törlésre kerül vagy anonimizálva lesz.
                                </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                                <Button variant="outline">Mégse</Button>
                                <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
                                    {isDeleting ? "Törlés..." : "Igen, törlöm a fiókomat"}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </CardContent>
        </Card>
    )
}
