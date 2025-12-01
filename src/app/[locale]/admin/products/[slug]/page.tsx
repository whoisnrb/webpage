import { getProductBySlug } from "@/app/actions/product"
import { ProductForm } from "../product-form"
import { notFound } from "next/navigation"

interface PageProps {
    params: Promise<{ slug: string }>
}

export default async function EditProductPage({ params }: PageProps) {
    const { slug } = await params
    const product = await getProductBySlug(slug)

    if (!product) {
        notFound()
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Termék szerkesztése</h1>
            <ProductForm initialData={product} />
        </div>
    )
}
