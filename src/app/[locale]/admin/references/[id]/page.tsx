import { getReferences } from "@/app/actions/reference"
import { prisma } from "@/lib/db"
import { ReferenceForm } from "../reference-form"
import { Button } from "@/components/ui/button"
import { Link } from "@/i18n/routing"
import { ArrowLeft } from "lucide-react"
import { notFound } from "next/navigation"

interface EditReferencePageProps {
    params: Promise<{ id: string }>
}

export default async function EditReferencePage({ params }: EditReferencePageProps) {
    const { id } = await params
    
    const reference = await (prisma as any).reference.findUnique({
        where: { id }
    })

    if (!reference) {
        notFound()
    }

    // Map metrics from Json to Metric[] if necessary
    const mappedReference = {
        ...reference,
        metrics: reference.metrics ? (typeof reference.metrics === 'string' ? JSON.parse(reference.metrics) : reference.metrics) : null
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href={"/admin/references" as any}>
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold tracking-tight">Referencia szerkesztése</h1>
                    <p className="text-muted-foreground">Módosítsd a kiválasztott referencia adatait.</p>
                </div>
            </div>

            <div className="border rounded-lg bg-card p-8">
                <ReferenceForm initialData={mappedReference as any} />
            </div>
        </div>
    )
}
