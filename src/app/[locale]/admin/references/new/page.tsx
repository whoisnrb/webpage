import { ReferenceForm } from "../reference-form"
import { Button } from "@/components/ui/button"
import { Link } from "@/i18n/routing"
import { ArrowLeft } from "lucide-react"

export default function NewReferencePage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href={"/admin/references" as any}>
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold tracking-tight">Új referencia</h1>
                    <p className="text-muted-foreground">Töltsd ki az adatokat az új esettanulmány létrehozásához.</p>
                </div>
            </div>

            <div className="border rounded-lg bg-card p-8">
                <ReferenceForm />
            </div>
        </div>
    )
}
